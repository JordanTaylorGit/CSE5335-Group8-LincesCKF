# Master Plan: Phase 3 - Back-end Development

This document outlines the comprehensive master plan for building the backend of the Linces'CKF application. The backend will serve as the foundation for the e-commerce platform, handling direct-to-consumer (DTC) sales, B2B manufacturing requests, and custom order operations.

## 1. Architectural Overview
- **Technology Stack**: Node.js with Express.js framework.
- **Database**: MongoDB (via Mongoose ODM) or PostgreSQL (via Sequelize/Prisma) depending on relational needs. Given the e-commerce nature (products, orders, users), both work well, but MongoDB is highly flexible for product catalogs.
- **API Design**: RESTful architecture.
- **Authentication**: JSON Web Tokens (JWT) for secure, stateless authentication.
- **Structure**: MVC-like architecture (Models, Controllers, Routes) with dedicated Middleware and Config folders.

---

## 2. Database Integration & Data Models

### 2.1 Users Model
- **Fields**: `firstName`, `lastName`, `email`, `passwordHash`, `phone`, `accountType` (ENUM: 'CUSTOMER', 'BRAND', 'ADMIN'), `companyName` (for brands), `addresses`, `notificationPreferences` (email, sms).
- **Purpose**: Manage authentication, authorization, and user profiles.

### 2.2 Products Model
- **Fields**: `name`, `description`, `price`, `category` (Blouses, Dresses, Shirts, Scarves), `material`, `images`, `stockQuantity`, `sizes`, `colors`.
- **Purpose**: Store the catalog for the DTC store.

### 2.3 Orders Model
- **Fields**: `userId`, `items` (Array of Product references with quantity and snapshot of price), `totalAmount`, `status` (Pending, Processing, Shipped, Delivered), `shippingAddress`, `paymentStatus`.
- **Purpose**: Track e-commerce purchases.

### 2.4 Custom/B2B Orders Model
- **Fields**: `userId` (optional, can be guest), `orderType` (Custom Garment, Bulk Order, B2B Manufacturing), `contactInfo` (Name, Email, Phone, Company), `requirements` (Quantity, Timeline, Message), `status` (New, Under Review, Quoted, Accepted, Fulfilled).
- **Purpose**: Handle specialized service requests and custom tailoring.

### 2.5 Contact Messages Model
- **Fields**: `name`, `email`, `subject`, `message`, `status` (Unread, Read, Responded), `createdAt`.
- **Purpose**: Store general inquiries.

---

## 3. RESTful API Endpoints

### 3.1 Authentication & User Management (`/api/auth` & `/api/users`)
- `POST /api/auth/register` - Create a new user (Customer or Fashion Brand).
- `POST /api/auth/login` - Authenticate user and return JWT.
- `GET /api/users/profile` - Get current user's profile (Protected).
- `PUT /api/users/profile` - Update user details (Name, company, phone, email) (Protected).
- `PUT /api/users/password` - Change account password (Protected).
- `PUT /api/users/notifications` - Update email/SMS preferences (Protected).

### 3.2 Product Catalog (`/api/products`)
- `GET /api/products` - Retrieve all products (with pagination, filtering, and sorting by category, price, etc.).
- `GET /api/products/:id` - Retrieve a single product's details.
- `POST /api/products` - Create a new product (Admin only).
- `PUT /api/products/:id` - Update a product (Admin only).
- `DELETE /api/products/:id` - Remove a product (Admin only).

### 3.3 Shopping Cart & Orders (`/api/orders`)
- `POST /api/orders` - Submit a new standard e-commerce order (integrates with payment gateway).
- `GET /api/orders/my-orders` - Get order history for the logged-in user (Protected).
- `GET /api/orders/:id` - Get specific order details (Protected to owner or Admin).
- `PUT /api/orders/:id/status` - Update order status (Admin only).

### 3.4 Custom & B2B Orders (`/api/custom-orders`)
- `POST /api/custom-orders` - Submit a new custom garment, bulk, or B2B manufacturing request.
- `GET /api/custom-orders` - Retrieve requests (Admin only).
- `GET /api/custom-orders/my-requests` - Track status of B2B/Custom requests (Protected).
- `PUT /api/custom-orders/:id/status` - Update the processing status (Admin only).

### 3.5 Contact Inquiries (`/api/contact`)
- `POST /api/contact` - Submit a new contact form message.
- `GET /api/contact` - Retrieve contact messages (Admin only).

---

## 4. Server-Side Business Logic

### 4.1 Security & Middleware
- **Auth Middleware**: Validate JWT tokens on protected routes. Inject `req.user` for downstream use.
- **Role-based Access Control (RBAC)**: Middleware to ensure only `ADMIN` users can mutate products or view all orders, while `BRAND` users might get wholesale pricing logic applied automatically.
- **Input Validation**: Use libraries like `Joi` or `express-validator` to ensure incoming data (emails, passwords, order forms) is clean and secure.
- **Error Handling**: Global error handling middleware to catch exceptions and return standardized JSON error responses (e.g., 400 Bad Request, 401 Unauthorized, 500 Server Error).

### 4.2 Payment Processing Logic
- Integrate with a payment provider (e.g., Stripe API).
- Logic to calculate totals securely on the server (never trust client-side pricing).
- Webhook endpoints to listen for successful payment events and automatically trigger order status updates.

### 4.3 Email & Notification Service
- Integrate an email service (e.g., SendGrid or Nodemailer).
- **Triggers**:
  - Welcome email upon registration.
  - Order confirmation receipt.
  - Notification to Admin when a high-value B2B or Custom Order is submitted.
  - Password reset flows.

### 4.4 Advanced Business Rules
- **Inventory Management**: Automatically deduct `stockQuantity` when an order is placed. Reject orders if items are out of stock.
- **B2B Logic**: If a user is authenticated as `BRAND`, the API could conditionally return wholesale pricing or enforce minimum order quantities on specific endpoints.

---

## 5. Development Phases & Execution Plan

1. **Setup & Configuration**
   - Initialize Node.js project.
   - Install dependencies (`express`, `mongoose`/`sequelize`, `dotenv`, `cors`, `jsonwebtoken`, `bcryptjs`).
   - Configure environment variables (DB URI, JWT Secrets, API Keys).
   - Set up the Express server and establish the database connection.

2. **Data Modeling**
   - Create schema definitions in the `models/` directory for Users, Products, Orders, CustomOrders, and Contacts.

3. **Authentication Implementation**
   - Build auth controllers (registration, login, hashing passwords).
   - Create the JWT verification middleware.

4. **Core API Development**
   - Build out the Products API (Controllers and Routes).
   - Build out the Custom Orders & Contact API (to fulfill the specific forms currently on the frontend).
   - Build out the User Profile management endpoints.

5. **E-commerce Logic**
   - Implement the checkout flow, order creation, and stock management.
   - (Optional/Later) Integrate Stripe for payments.

6. **Testing & Refinement**
   - Test endpoints using Postman or automated tests (Jest/Supertest).
   - Ensure CORS is correctly configured to accept requests from the frontend client.
   - Secure headers using `helmet`.

7. **Integration**
   - Update the React frontend's API service files to replace mock `setTimeout` functions with actual `fetch` or `axios` calls to this new Node backend.