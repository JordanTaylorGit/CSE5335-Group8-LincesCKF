const API_URL = process.env.API_URL || 'http://localhost:5001/api';

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

async function runTests() {
  console.log('--- Starting API Tests ---');

  const protectedProducts = await request('/products');
  console.log('Protected products without token:', protectedProducts.response.status);

  const email = `test${Date.now()}@example.com`;
  const register = await request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      firstName: 'Test',
      lastName: 'User',
      email,
      password: 'password123',
      phone: '1234567890',
      accountType: 'CUSTOMER',
    }),
  });
  console.log('Register:', register.response.status, register.body?.user?.email);

  const token = register.body?.token;
  if (!token) throw new Error('Register did not return a token');

  const authHeaders = { Authorization: `Bearer ${token}` };

  const session = await request('/auth/session', { headers: authHeaders });
  console.log('Session:', session.response.status, session.body?.user?.email);

  const profile = await request('/users/profile', { headers: authHeaders });
  console.log('Profile:', profile.response.status, profile.body?.email);

  const password = await request('/users/password', {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      currentPassword: 'password123',
      newPassword: 'newpassword123',
    }),
  });
  console.log('Password update:', password.response.status);

  const login = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password: 'newpassword123' }),
  });
  console.log('Login with new password:', login.response.status, login.body?.user?.email);

  const products = await request('/products', {
    headers: { Authorization: `Bearer ${login.body?.token}` },
  });
  console.log('Protected products with token:', products.response.status);

  console.log('--- Tests Completed ---');
}

runTests().catch((error) => {
  console.error(error);
  process.exit(1);
});
