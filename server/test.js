require('dotenv').config();

const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

const TEST_PORT = process.env.TEST_PORT || String(5100 + Math.floor(Math.random() * 400));
const API_URL = process.env.API_URL || `http://localhost:${TEST_PORT}/api`;
const SERVER_START_TIMEOUT_MS = 15000;
const HEALTH_POLL_INTERVAL_MS = 300;
const DEFAULT_PASSWORD = 'password123';
const UPDATED_PASSWORD = 'newpassword123';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  const body = text ? JSON.parse(text) : null;
  return { response, body };
}

async function isServerHealthy() {
  try {
    const { response, body } = await request('/health');
    return response.ok && body?.status === 'ok';
  } catch {
    return false;
  }
}

async function waitForServerHealth(timeoutMs = SERVER_START_TIMEOUT_MS) {
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    if (await isServerHealthy()) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, HEALTH_POLL_INTERVAL_MS));
  }

  throw new Error(`Server did not become healthy within ${timeoutMs}ms`);
}

async function stopServer(child) {
  if (!child || child.exitCode !== null) return;

  await new Promise((resolve) => {
    const timer = setTimeout(() => {
      child.kill('SIGKILL');
    }, 3000);

    child.once('exit', () => {
      clearTimeout(timer);
      resolve();
    });

    child.kill('SIGINT');
  });
}

async function ensureServer() {
  if (process.env.API_URL) {
    if (!(await isServerHealthy())) {
      throw new Error(`No healthy server found at ${API_URL}`);
    }

    return { child: null };
  }

  const child = spawn(process.execPath, ['server.js'], {
    cwd: __dirname,
    env: {
      ...process.env,
      PORT: TEST_PORT,
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let stderr = '';

  child.stderr.on('data', (chunk) => {
    stderr += chunk.toString();
  });

  child.stdout.on('data', (chunk) => {
    process.stdout.write(chunk.toString());
  });

  try {
    await waitForServerHealth();
    return { child };
  } catch (error) {
    await stopServer(child);
    throw new Error(`${error.message}${stderr ? `\n${stderr.trim()}` : ''}`);
  }
}

async function createDbConnection() {
  return mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
}

async function ensureAdminUser(db) {
  const adminEmail = `admin.${Date.now()}@example.com`;
  const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10);

  await db.execute(
    `INSERT INTO users (
      email,
      password_hash,
      account_type,
      first_name,
      last_name,
      company_name,
      phone,
      preferred_language,
      is_active,
      notification_preferences
    ) VALUES (?, ?, 'ADMIN', ?, ?, '', ?, 'EN', TRUE, ?)`,
    [
      adminEmail,
      passwordHash,
      'API',
      'Admin',
      '1234567890',
      JSON.stringify({ email: true, sms: false }),
    ]
  );

  return adminEmail;
}

function authHeaders(token) {
  return { Authorization: `Bearer ${token}` };
}

async function registerUser(payload) {
  const result = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  assert.equal(result.response.status, 201, `Registration should succeed for ${payload.email}`);
  assert.ok(result.body?.token, `Registration should return a token for ${payload.email}`);
  return result.body;
}

async function loginUser({ email, password, accountType }, expectedStatus = 200) {
  const result = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, accountType }),
  });

  assert.equal(
    result.response.status,
    expectedStatus,
    `Login status mismatch for ${email} (${accountType || 'no account type'})`
  );

  return result;
}

async function runTests() {
  console.log('--- Starting API Tests ---');
  let db;

  try {
    const health = await request('/health');
    assert.equal(health.response.status, 200, 'Health endpoint should respond');
    assert.equal(health.body?.status, 'ok', 'Health endpoint should return ok');

    const protectedProducts = await request('/products');
    assert.equal(protectedProducts.response.status, 401, 'Products should require authentication');

    const brandsWithoutToken = await request('/brands');
    assert.equal(brandsWithoutToken.response.status, 401, 'Brands endpoint should require authentication');

  const timestamp = Date.now();
  const customerEmail = `customer.${timestamp}@example.com`;
  const brandOneEmail = `brand.one.${timestamp}@example.com`;
  const brandTwoEmail = `brand.two.${timestamp}@example.com`;

  const customer = await registerUser({
    firstName: 'Test',
    lastName: 'Customer',
    email: customerEmail,
    password: DEFAULT_PASSWORD,
    phone: '1234567890',
    accountType: 'CUSTOMER',
  });

  const brandOne = await registerUser({
    email: brandOneEmail,
    password: DEFAULT_PASSWORD,
    phone: '1234567890',
    accountType: 'BRAND',
    companyName: 'Test Brand One',
  });

  const brandTwo = await registerUser({
    email: brandTwoEmail,
    password: DEFAULT_PASSWORD,
    phone: '1234567890',
    accountType: 'BRAND',
    companyName: 'Test Brand Two',
  });

  const customerToken = customer.token;
  const brandOneToken = brandOne.token;
  const brandTwoToken = brandTwo.token;
  const brandOneId = brandOne.user.id;
  const brandTwoId = brandTwo.user.id;

  const brands = await request('/brands', { headers: authHeaders(customerToken) });
  assert.equal(brands.response.status, 200, 'Brands endpoint should respond for authenticated users');
  assert.ok(Array.isArray(brands.body), 'Brands endpoint should return an array');

  const session = await request('/auth/session', { headers: authHeaders(customerToken) });
  assert.equal(session.response.status, 200, 'Session lookup should succeed');
  assert.equal(session.body?.user?.email, customerEmail, 'Session should match the customer');

  const profile = await request('/users/profile', { headers: authHeaders(customerToken) });
  assert.equal(profile.response.status, 200, 'Profile lookup should succeed');
  assert.equal(profile.body?.email, customerEmail, 'Profile should return the customer email');

  const profileUpdate = await request('/users/profile', {
    method: 'PUT',
    headers: authHeaders(customerToken),
    body: JSON.stringify({
      firstName: 'Updated',
      lastName: 'Customer',
      email: customerEmail,
      phone: '2223334444',
      addresses: [
        {
          line1: '123 Silk Street',
          line2: 'Suite 4',
          city: 'Arlington',
          state: 'TX',
          postalCode: '76010',
          country: 'United States',
        },
      ],
    }),
  });
  assert.equal(profileUpdate.response.status, 200, 'Profile update should succeed');
  assert.equal(profileUpdate.body?.user?.phone, '2223334444', 'Updated phone should persist');
  assert.equal(profileUpdate.body?.user?.addresses?.[0]?.city, 'Arlington', 'Primary address should persist');

  const notificationUpdate = await request('/users/notifications', {
    method: 'PUT',
    headers: authHeaders(customerToken),
    body: JSON.stringify({ email: false, sms: true }),
  });
  assert.equal(notificationUpdate.response.status, 200, 'Notification update should succeed');
  assert.deepEqual(
    notificationUpdate.body?.user?.notifications,
    { email: false, sms: true },
    'Notification preferences should update'
  );

  const passwordUpdate = await request('/users/password', {
    method: 'PUT',
    headers: authHeaders(customerToken),
    body: JSON.stringify({
      currentPassword: DEFAULT_PASSWORD,
      newPassword: UPDATED_PASSWORD,
    }),
  });
  assert.equal(passwordUpdate.response.status, 200, 'Password update should succeed');

  const customerLogin = await loginUser({
    email: customerEmail,
    password: UPDATED_PASSWORD,
    accountType: 'CUSTOMER',
  });
  assert.equal(customerLogin.body?.user?.email, customerEmail, 'Customer login should return the customer');
  const refreshedCustomerToken = customerLogin.body?.token;

  await loginUser({
    email: customerEmail,
    password: UPDATED_PASSWORD,
    accountType: 'BRAND',
  }, 401);

  await loginUser({
    email: customerEmail,
    password: UPDATED_PASSWORD,
    accountType: 'NOPE',
  }, 400);

  const logout = await request('/auth/logout', {
    method: 'POST',
    headers: authHeaders(refreshedCustomerToken),
  });
  assert.equal(logout.response.status, 200, 'Logout should succeed');

  const allProducts = await request('/products', {
    headers: authHeaders(refreshedCustomerToken),
  });
  assert.equal(allProducts.response.status, 200, 'Products endpoint should succeed');
  assert.ok(Array.isArray(allProducts.body) && allProducts.body.length > 0, 'Products should return seeded items');

  const filteredProducts = await request('/products?category=blouse', {
    headers: authHeaders(refreshedCustomerToken),
  });
  assert.equal(filteredProducts.response.status, 200, 'Category filter should succeed');
  assert.ok(filteredProducts.body.every((product) => product.category === 'blouse'), 'Category filter should only return blouses');

  const featuredProducts = await request('/products/featured?limit=2', {
    headers: authHeaders(refreshedCustomerToken),
  });
  assert.equal(featuredProducts.response.status, 200, 'Featured products endpoint should succeed');
  assert.ok(featuredProducts.body.length <= 2, 'Featured limit should be respected');

  const seededProductId = allProducts.body[0].id;
  const productDetail = await request(`/products/${seededProductId}`, {
    headers: authHeaders(refreshedCustomerToken),
  });
  assert.equal(productDetail.response.status, 200, 'Product detail should succeed');
  assert.equal(productDetail.body?.id, seededProductId, 'Product detail should match the requested id');

  const createProduct = await request('/products', {
    method: 'POST',
    headers: authHeaders(brandOneToken),
    body: JSON.stringify({
      category: 'blouse',
      name: `Integration Test Product ${timestamp}`,
      description: 'Created during API smoke tests.',
      price: 149.5,
      material: 'Silk Blend',
      images: ['https://images.pexels.com/photos/19895950/pexels-photo-19895950.jpeg'],
      sizes: [
        { name: 'S', stockQuantity: 4 },
        { name: 'M', stockQuantity: 5 },
      ],
      colors: ['Teal', 'Ivory'],
      featured: true,
    }),
  });
  assert.equal(createProduct.response.status, 201, 'Brand product creation should succeed');
  const createdProduct = createProduct.body?.product;
  assert.ok(createdProduct?.id, 'Created product should have an id');
  assert.equal(createdProduct.brandId, brandOneId, 'Created product should belong to brand one');

  const brandOneProducts = await request('/products/brand/my-products', {
    headers: authHeaders(brandOneToken),
  });
  assert.equal(brandOneProducts.response.status, 200, 'Brand product listing should succeed');
  assert.ok(
    brandOneProducts.body.some((product) => product.id === createdProduct.id),
    'Brand product listing should include the new product'
  );

  const brandTwoProducts = await request('/products/brand/my-products', {
    headers: authHeaders(brandTwoToken),
  });
  assert.equal(brandTwoProducts.response.status, 200, 'Second brand product listing should succeed');
  assert.ok(
    brandTwoProducts.body.every((product) => product.brandId === brandTwoId),
    'Second brand should not see other brand products'
  );

    db = await createDbConnection();
    const adminEmail = await ensureAdminUser(db);

  const adminLogin = await loginUser({
    email: adminEmail,
    password: DEFAULT_PASSWORD,
    accountType: 'ADMIN',
  });
  const adminToken = adminLogin.body?.token;

  const adminProducts = await request('/products/brand/my-products', {
    headers: authHeaders(adminToken),
  });
  assert.equal(adminProducts.response.status, 200, 'Admin product listing should succeed');
  assert.ok(
    adminProducts.body.some((product) => product.id === createdProduct.id),
    'Admin should see the created brand product'
  );

  const orderPayload = {
    items: [
      {
        productId: createdProduct.id,
        quantity: 1,
        selectedSize: 'M',
        selectedColor: 'Teal',
      },
    ],
    totalAmount: createdProduct.price,
    shippingAddress: {
      fullName: 'Updated Customer',
      address: '123 Silk Street',
      city: 'Arlington',
      zipCode: '76010',
      country: 'United States',
      phone: '2223334444',
    },
  };

    const createOrder = await request('/orders', {
      method: 'POST',
      headers: authHeaders(refreshedCustomerToken),
      body: JSON.stringify(orderPayload),
    });
    assert.equal(
      createOrder.response.status,
      201,
      `Order creation should succeed: ${JSON.stringify(createOrder.body)}`
    );
  const createdOrderId = createOrder.body?.orderId;

  const customerOrders = await request('/orders/my-orders', {
    headers: authHeaders(refreshedCustomerToken),
  });
  assert.equal(customerOrders.response.status, 200, 'Customer orders should load');
  const createdOrder = customerOrders.body.find((order) => order.id === createdOrderId);
  assert.ok(createdOrder, 'Customer orders should include the new order');
  assert.equal(createdOrder.items?.[0]?.selectedSize, 'M', 'Order item should preserve size');

  const brandOrders = await request('/orders/brand/my-orders', {
    headers: authHeaders(brandOneToken),
  });
  assert.equal(brandOrders.response.status, 200, 'Brand orders should load');
  const brandOrder = brandOrders.body.find((order) => order.id === createdOrderId);
  assert.ok(brandOrder, 'Brand should see orders for its products');

  const wrongBrandDeliver = await request(`/orders/${createdOrderId}/items/${brandOrder.items[0].itemIndex}/deliver`, {
    method: 'PUT',
    headers: authHeaders(brandTwoToken),
  });
  assert.equal(wrongBrandDeliver.response.status, 403, 'Other brands should not deliver someone else’s product');

  const deliverOrder = await request(`/orders/${createdOrderId}/items/${brandOrder.items[0].itemIndex}/deliver`, {
    method: 'PUT',
    headers: authHeaders(brandOneToken),
  });
  assert.equal(deliverOrder.response.status, 200, 'Owning brand should be able to deliver the item');
  assert.equal(deliverOrder.body?.order?.status, 'Delivered', 'Delivered order should update overall status');

  const targetedCustomOrder = await request('/custom-orders', {
    method: 'POST',
    headers: authHeaders(refreshedCustomerToken),
    body: JSON.stringify({
      orderType: 'custom-garment',
      brandId: brandOneId,
      contactInfo: {
        name: 'Updated Customer',
        email: customerEmail,
        phone: '2223334444',
        company: '',
      },
      requirements: {
        quantity: 3,
        timeline: '1-2 months',
        message: 'Need a custom silk capsule.',
      },
    }),
  });
  assert.equal(targetedCustomOrder.response.status, 201, 'Targeted custom order should succeed');
  const targetedCustomOrderId = targetedCustomOrder.body?.orderId;

  const b2bCustomOrder = await request('/custom-orders', {
    method: 'POST',
    headers: authHeaders(refreshedCustomerToken),
    body: JSON.stringify({
      orderType: 'b2b-manufacturing',
      contactInfo: {
        name: 'Updated Customer',
        email: customerEmail,
        phone: '2223334444',
        company: 'Customer Label',
      },
      requirements: {
        quantity: 25,
        timeline: '3-6 months',
        message: 'Need production support for a small run.',
      },
    }),
  });
  assert.equal(b2bCustomOrder.response.status, 201, 'Untargeted B2B custom order should succeed');

  const customerCustomOrders = await request('/custom-orders/my-requests', {
    headers: authHeaders(refreshedCustomerToken),
  });
  assert.equal(customerCustomOrders.response.status, 200, 'Customer custom orders should load');
  assert.ok(
    customerCustomOrders.body.some((order) => order.brandUserId === brandOneId && order.orderType === 'custom-garment'),
    'Customer custom orders should include the targeted brand request'
  );

  const brandCustomOrders = await request('/custom-orders/brand-requests', {
    headers: authHeaders(brandOneToken),
  });
  assert.equal(brandCustomOrders.response.status, 200, 'Brand custom order requests should load');
  assert.ok(
    brandCustomOrders.body.some((order) => order.brandUserId === brandOneId && order.orderType === 'custom-garment'),
    'Brand custom order requests should include the targeted request'
  );

  const wrongBrandCustomDeliver = await request(`/custom-orders/${targetedCustomOrderId}/deliver`, {
    method: 'PUT',
    headers: authHeaders(brandTwoToken),
  });
  assert.equal(wrongBrandCustomDeliver.response.status, 403, 'Other brands should not deliver someone else’s custom order');

  const deliverCustomOrder = await request(`/custom-orders/${targetedCustomOrderId}/deliver`, {
    method: 'PUT',
    headers: authHeaders(brandOneToken),
  });
  assert.equal(deliverCustomOrder.response.status, 200, 'Owning brand should be able to deliver the targeted custom order');
  assert.equal(deliverCustomOrder.body?.order?.status, 'COMPLETED', 'Delivered custom order should update status to completed');

  const customerCustomOrdersAfterDeliver = await request('/custom-orders/my-requests', {
    headers: authHeaders(refreshedCustomerToken),
  });
  assert.equal(customerCustomOrdersAfterDeliver.response.status, 200, 'Customer custom orders should still load after delivery');
  assert.ok(
    customerCustomOrdersAfterDeliver.body.some((order) => order.id === targetedCustomOrderId && order.status === 'COMPLETED'),
    'Customer custom orders should show the delivered targeted request as completed'
  );

  const targetedContact = await request('/contact', {
    method: 'POST',
    headers: authHeaders(refreshedCustomerToken),
    body: JSON.stringify({
      name: 'Updated Customer',
      email: customerEmail,
      subject: 'product-inquiry',
      message: 'Question about colors and lead time.',
      brandId: brandOneId,
    }),
  });
  assert.equal(targetedContact.response.status, 201, 'Targeted contact form should succeed');

  const generalContact = await request('/contact', {
    method: 'POST',
    headers: authHeaders(refreshedCustomerToken),
    body: JSON.stringify({
      name: 'Updated Customer',
      email: customerEmail,
      subject: 'other',
      message: 'General storefront question.',
    }),
  });
  assert.equal(generalContact.response.status, 201, 'General contact form should succeed');

  const brandInquiries = await request('/contact/brand-inquiries', {
    headers: authHeaders(brandOneToken),
  });
  assert.equal(brandInquiries.response.status, 200, 'Brand inquiries should load');
  assert.ok(
    brandInquiries.body.some((inquiry) => inquiry.brandUserId === brandOneId && inquiry.subject === 'product-inquiry'),
    'Brand inquiries should include the targeted message'
  );

  const adminContacts = await request('/contact', {
    headers: authHeaders(adminToken),
  });
  assert.equal(adminContacts.response.status, 200, 'Admin contact listing should succeed');
  assert.ok(
    adminContacts.body.some((contact) => contact.id === targetedContact.body?.id),
    'Admin should see the targeted contact submission'
  );
  assert.ok(
    adminContacts.body.some((contact) => contact.id === generalContact.body?.id),
    'Admin should see the general contact submission'
  );

    console.log('--- Tests Completed ---');
  } finally {
    if (db) {
      await db.end();
    }
  }
}

(async () => {
  let child = null;

  try {
    const server = await ensureServer();
    child = server.child;
    await runTests();
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  } finally {
    await stopServer(child);
  }
})();
