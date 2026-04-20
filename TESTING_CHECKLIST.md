# Linces'CKF Testing Checklist

Use this checklist before merging, before deploying to AWS, and after major backend or frontend changes.

Testing approach for this repo:

- Use `cd server && npm test` as the automated API smoke suite for auth, products, orders, custom orders, contact flows, and brand-facing endpoints.
- Use the manual checks below for UI behavior, bilingual content, account-role workflows, and browser rendering.
- Run both local and AWS verification before marking the project ready to merge or deploy.

## Test Session

- [ ] Date:
- [ ] Tester:
- [ ] Branch / commit:
- [ ] Environment:
  - [ ] Local
  - [ ] AWS

## 1. Prerequisites

- [ ] MySQL is running
- [ ] Node.js 18+ is installed
- [ ] `server/.env` is configured
- [ ] Dependencies are installed in both `server/` and `client/`

## 2. Database Setup

Run the schema and seed data before testing a fresh environment.

```bash
mysql -u root -p < server/database_mysql.sql
```

```bash
cd server
npm install
npm run seed
```

Expected result:

- [ ] Schema loads successfully
- [ ] Seed completes without errors
- [ ] Demo customer and seeded brand accounts are created

Seeded accounts:

- Customer: `customer.demo@lincesckf.com` / `CustomerSeed123!`
- Brand: `seda.atelier@lincesckf.com` / `BrandSeed123!`
- Brand: `casa.lunaria@lincesckf.com` / `BrandSeed123!`
- Brand: `brisa.silk@lincesckf.com` / `BrandSeed123!`
- Brand: `atelier.marfil@lincesckf.com` / `BrandSeed123!`

## 3. Backend Checks

From `server/`:

```bash
node --check server.js
```

- [ ] Syntax check passes

Start the backend:

```bash
npm start
```

- [ ] Server starts on the expected port
- [ ] MySQL connection succeeds

Run the backend smoke test in a second terminal:

```bash
cd server
npm test
```

- [ ] Auth flows pass
- [ ] Product listing and detail checks pass
- [ ] Customer order flow checks pass
- [ ] Brand product and fulfillment checks pass
- [ ] Custom order and contact routing checks pass

## 4. Frontend Checks

From `client/`:

```bash
npm install
npm run lint
npm run build
```

- [ ] Lint succeeds
- [ ] Production build succeeds

Start the frontend:

```bash
npm run dev
```

- [ ] App loads in browser
- [ ] App loads in English first in a fresh browser / cleared localStorage session
- [ ] No obvious console errors on startup
- [ ] Page title changes correctly when navigating between Home, Catalog, Product Detail, Contact, and Account
- [ ] `<html lang>` switches correctly between `en` and `es` when the app language changes
- [ ] Meta description and canonical URL update correctly for at least one public page route

## 5. Customer Flow Smoke Test

- [ ] Open the app in a fresh browser / cleared localStorage session
- [ ] Register a new customer account
- [ ] Log out
- [ ] Log back in with the new account
- [ ] Confirm the app starts in English before manually changing language
- [ ] Open Home page and confirm featured products load
- [ ] Open Catalog and browse products
- [ ] Open a product detail page
- [ ] Select color and size
- [ ] If a size is out of stock, confirm add-to-cart is blocked and out-of-stock messaging is shown
- [ ] Add item to cart
- [ ] Refresh the page and confirm the cart still contains the item
- [ ] Update quantity in cart without exceeding available stock
- [ ] Log out and sign in as a different customer or brand account
- [ ] Confirm the second account does not inherit the first account's cart contents
- [ ] Sign back into the first account and confirm that account's own cart is restored
- [ ] Confirm the cart summary shows the brand name for the added item
- [ ] Open Checkout
- [ ] Confirm the checkout summary shows brand names
- [ ] Submit an order successfully - Fail
- [ ] Verify order appears in My Account
- [ ] Update profile information 
- [ ] Update shipping address
- [ ] Change password
- [ ] Update notification preferences
- [ ] Submit a contact form
- [ ] Submit a contact form targeted to a brand
- [ ] Submit a custom garment request with a selected brand
- [ ] Submit a bulk order request with a selected brand
- [ ] Submit a B2B manufacturing request with a selected brand
- [ ] Verify custom orders appear in My Account with the selected brand
- [ ] After brand delivery, verify the customer sees the updated order / custom-order status

## 6. Brand Flow Smoke Test

- [ ] Log in as a seeded brand user
- [ ] Open brand account page
- [ ] Confirm "My Products" loads
- [ ] Try to submit the add-item form with missing fields and confirm the form blocks submit
- [ ] Add a new product with all required fields completed and optional featured toggle set as needed
- [ ] Confirm new product appears in brand product list
- [ ] Confirm new product appears in catalog
- [ ] If the product is marked featured in the database/API, confirm it appears on the Home page
- [ ] Place a normal order while logged in as a brand account
- [ ] Confirm the brand account sees its own placed order in My Orders
- [ ] Confirm brand-routed store orders also appear in My Orders
- [ ] Deliver an item from a brand order
- [ ] Confirm the customer sees the updated regular-order delivery status
- [ ] Confirm targeted custom orders appear in My Orders
- [ ] Mark a targeted custom order as delivered
- [ ] Confirm the customer sees the updated custom-order status
- [ ] Confirm brand-targeted contact inquiries appear in Notifications

## 7. API Spot Checks

Use browser devtools, Postman, or curl to confirm these endpoints behave correctly. Endpoints after login require a valid Bearer token.

- [ ] `GET /api/health`
- [ ] `POST /api/auth/register`
- [ ] `POST /api/auth/login`
- [ ] `GET /api/auth/session`
- [ ] `GET /api/products`
- [ ] `GET /api/products?category=...`
- [ ] `GET /api/brands`
- [ ] `GET /api/products/featured`
- [ ] `GET /api/products/:id`
- [ ] `POST /api/products`
- [ ] `GET /api/products/brand/my-products`
- [ ] `GET /api/users/profile`
- [ ] `PUT /api/users/profile`
- [ ] `PUT /api/users/password`
- [ ] `PUT /api/users/notifications`
- [ ] `POST /api/orders`
- [ ] `GET /api/orders/my-orders`
- [ ] `GET /api/orders/brand/my-orders`
- [ ] `PUT /api/orders/:orderId/items/:itemIndex/deliver`
- [ ] `POST /api/custom-orders`
- [ ] `GET /api/custom-orders/brand-requests`
- [ ] `GET /api/custom-orders/my-requests`
- [ ] `PUT /api/custom-orders/:customOrderId/deliver`
- [ ] `POST /api/contact`
- [ ] `GET /api/contact/brand-inquiries`

## 8. Database Spot Checks

Run these after testing to confirm writes landed in the correct tables.

```sql
SELECT user_id, email, account_type FROM users ORDER BY user_id DESC LIMIT 10;
SELECT address_id, user_id, address_type, city FROM addresses ORDER BY address_id DESC LIMIT 10;
SELECT product_id, name_en, brand_user_id, is_featured FROM products ORDER BY product_id DESC LIMIT 10;
SELECT order_id, order_number, user_id, total_amount, order_status FROM orders ORDER BY order_id DESC LIMIT 10;
SELECT order_item_id, order_id, product_id, delivery_status FROM order_items ORDER BY order_item_id DESC LIMIT 10;
SELECT payment_id, order_id, amount, payment_status FROM payments ORDER BY payment_id DESC LIMIT 10;
SELECT custom_order_id, request_number, brand_user_id, request_status FROM custom_orders ORDER BY custom_order_id DESC LIMIT 10;
SELECT service_type_id, name_en, is_active FROM service_types ORDER BY service_type_id DESC LIMIT 10;
SELECT contact_id, brand_user_id, subject, inquiry_type, status FROM contact_forms ORDER BY contact_id DESC LIMIT 10;
SELECT COUNT(*) AS shopping_cart_rows FROM shopping_carts;
SELECT COUNT(*) AS cart_item_rows FROM cart_items;
SELECT COUNT(*) AS service_inquiry_rows FROM service_inquiries;
```

- [ ] New users are present in `users`
- [ ] Addresses are present in `addresses`
- [ ] Orders are present in `orders`
- [ ] Line items are present in `order_items`
- [ ] Payments are present in `payments`
- [ ] Custom orders are present in `custom_orders`
- [ ] Custom-order service types are present in `service_types`
- [ ] Contact submissions are present in `contact_forms`
- [ ] `shopping_carts`, `cart_items`, and `service_inquiries` remain empty unless a future feature starts using them

## 9. AWS Deployment Verification

Before deploy:

- [ ] `client/.env.production` points to the correct deployed API URL
- [ ] `VITE_SITE_URL` is set to the deployed frontend URL if canonical tags should use the production domain at build time
- [ ] `npm run build` succeeds in `client/`
- [ ] Backend environment variables are set correctly on AWS
- [ ] Database is reachable from the deployed backend

After deploy:

- [ ] Home page loads
- [ ] Login works
- [ ] Register works
- [ ] Products load
- [ ] Featured products load
- [ ] Checkout works
- [ ] Contact form works
- [ ] Custom orders work
- [ ] Brand flows work
- [ ] Page title, description, and canonical tags reflect the deployed domain and current route
- [ ] No browser CORS errors
- [ ] No server `500` errors in deployment logs

## 10. Known Caveats

- The live cart uses React Context with `localStorage` persistence; `shopping_carts` and `cart_items` are not part of the current checkout flow.
- `service_inquiries` is present in the schema but is not part of the current live frontend/backend flow.
- Home page product visibility is driven by `products.is_featured`; newly added products appear in the catalog immediately, but they only appear on Home when marked featured.
- Helper SQL files in `server/` should be reviewed before use because some were written against older schema naming.
- Billing address workflow is not currently exercised by the checkout UI.
- Admin-only APIs are not part of the default UI and should be spot-checked separately if admin support is added to the seeded data.

## Sign-off

- [ ] Local testing passed
- [ ] AWS testing passed
- [ ] Ready to merge / deploy
