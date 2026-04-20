# Linces'CKF — Premium Silk E-Commerce Platform
### UTA CSE 5335 Web Data Management · Group 8

A bilingual (English/Spanish) e-commerce platform for a premium silk garment brand, featuring **Direct-to-Consumer** sales and **B2B Manufacturing Services**. The project now includes a React frontend, an Express API, and a MySQL database schema for authentication, products, orders, contact routing, and custom manufacturing requests.


---
## Login Information

- New users can register as either a `CUSTOMER` or a `BRAND` from the login modal.
- Login requires the correct account type selection, so customer credentials do not authenticate as a brand account and vice versa.
- Once logged in, `My Account` provides access to profile details, password changes, notification settings, orders, and brand-only management tools.
- Protected actions such as checkout, adding brand products, and marking deliveries require login.
- Authentication uses the backend API and stores the session token in `localStorage`, which keeps the user signed in across refreshes until logout.

### Seeded Test Accounts

- **Default customer**
  - Email: `customer.demo@lincesckf.com`
  - Password: `CustomerSeed123!`
- **Default brand accounts**
  - Password for all seeded brands: `BrandSeed123!`
  - Emails:
    - `seda.atelier@lincesckf.com`
    - `casa.lunaria@lincesckf.com`
    - `brisa.silk@lincesckf.com`
    - `atelier.marfil@lincesckf.com`

---
## User Flows

### Customer Flow

1. Open the app in a fresh browser session. The app loads in English first, and later uses the language saved in `localStorage`.
2. Browse the Home page, featured products, and Catalog listings.
3. Open a product detail page, choose color and size, and add the item to cart.
4. Refresh the page if needed. The cart remains saved until the user removes items or completes checkout.
5. Open Checkout, review brand names in the order summary, and submit the order.
6. Open `My Account` to review placed orders, delivery progress, profile details, and notification settings.
7. Submit Contact Us messages or custom-order requests, with the option to route requests to a selected brand.
8. Track both regular orders and custom orders from the customer account view.

### Brand Flow

1. Log in using a Brand account.
2. Open `My Account` and review brand-specific sections such as `My Products`, `Orders`, and `Notifications`.
3. Add a new product with bilingual content, images, pricing, category, size-based stock, and the option to mark it as featured. All fields except the featured toggle must be filled before submit.
4. Confirm the product appears in the brand product list and public Catalog. It appears on the Home page when marked as featured.
5. Review `My Orders`, which includes both orders placed by the brand account and orders/custom requests routed to that brand for fulfillment.
6. Mark eligible routed order items as delivered. Customers then see updated Delivered or Partially Delivered status in their account.
7. Review targeted custom orders in the brand order view and mark them delivered when completed.
8. Review brand-directed Contact Us messages in the Notifications section.

---
## Team

| # | Student | Responsibilities |
|---|---------|-----------------|
| 1 | Velupula, Lakshmi Priya | Authentication (login/register/account), AuthContext, AuthModal, Brand vs. Customer order logic in the website Brand and Account Creation Pages, Project Regression Testing, Peer Review, Bug Fixes in cart, products, orders, catalog, responsiveness, accessibility and collaborated in drafting README |
| 2 | Tran, Andy | Main navigation bar, Mobile responsive menu, Footer design, Language switcher functionality |
| 3 | Todupunoori, Hareesh | Product catalog, product detail page, shopping cart, CartContext |
| 4 | Taylor, Jordan | Home page, B2B Services page, hero section, process steps, documentation, sqlite to mysql conversion, aws backend setup, aws backend deployment, README |
| 5 | Poudel, Ishan | Custom orders page, contact page, about page, LanguageContext |


---

## Hosting

| Phase | Host | URL |
|-------|------|-----|
| Phase 3 full-stack deployment | AWS | [dctdo5snio73e.cloudfront.net](dctdo5snio73e.cloudfront.net) |

---



## Project Overview

**Linces'CKF** is a luxury silk garment brand serving two customer segments:

1. **Direct-to-Consumer (DTC)** — Exclusive silk garments (blouses, dresses, shirts, scarves) sold directly through the catalog with size and color selection
2. **B2B Manufacturing Services** — Professional confection services for fashion brands, including custom production runs, private labeling, and pattern development

The platform is fully bilingual — all UI strings, product names, descriptions, and category labels render in either English or Spanish based on the user's language selection, which persists across sessions via `localStorage`.


---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| UI Framework | React 18 | Functional components + hooks throughout |
| Routing | React Router v6 | Client-side routing, protected routes |
| State Management | React Context API | Auth, Cart, Language contexts |
| Internationalization | i18next + react-i18next | EN/ES, single `translations.js` source |
| Styling | Tailwind CSS + inline styles | Custom token system (see Design System) |
| Build Tool | Vite | Fast dev server + optimized builds |
| Package Manager | npm | |
| Backend Framework | Node.js + Express.js | REST API, middleware, route handling |
| Database | MySQL 8 | Hosted on AWS RDS |
| ORM / DB Driver | mysql2 | Direct query driver for Express |
| Authentication | bcrypt + JWT | Password hashing and session tokens |
| Frontend Hosting | AWS S3 + CloudFront | Static build files, HTTPS via CDN |
| Backend Hosting | AWS EC2 (t2.micro) | Node.js server managed via PM2 |
| Database Hosting | AWS RDS (db.t3.micro) | Managed MySQL, private subnet |
| Process Manager | PM2 | Auto-restart and process monitoring on EC2 |
---

## Project Structure

```
CSE5335-Group8-LincesCKF/
├── client/
│   ├── src/
│   │   ├── assets/
│   │   │   └── styles/
│   │   │       ├── global.css       # Global styles, font imports, focus tokens
│   │   │       └── responsive.css   # Responsive layout overrides for dense pages
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── ProtectedRoute.jsx
│   │   │   │   └── SiteAuthGate.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Layout.jsx       # Wraps all pages with Navbar + Footer
│   │   │   │   ├── Navbar.jsx       # Fixed header, cart badge, language toggle, auth
│   │   │   │   └── Footer.jsx       # Links, contact info, social icons
│   │   │   ├── home/
│   │   │   │   ├── HeroSection.jsx  # Full-viewport silk-red hero
│   │   │   │   └── ProcessSteps.jsx # 4-step B2B process visualization
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.jsx     # Individual cart row with quantity controls
│   │   │   │   └── CartSummary.jsx  # Order total and checkout button
│   │   │   ├── catalog/
│   │   │   │   ├── CatalogFilters.jsx
│   │   │   │   └── ProductGallery.jsx
│   │   │   ├── shared/
│   │   │   │   └── ProductCard.jsx  # Reusable card with color/size selection
│   │   │   ├── AuthModal.jsx        # Login/register modal
│   │   │   ├── ScrollToTop.jsx      # Route scroll reset helper
│   │   │   ├── Seo.jsx              # Per-page document metadata helper
│   │   │   ├── auth.css
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state — login, register, logout
│   │   │   ├── CartContext.jsx      # Cart state — add, remove, quantity, messages
│   │   │   └── LanguageContext.jsx  # Language toggle (EN/ES), persisted to localStorage
│   │   ├── i18n/
│   │   │   ├── i18n.js              # i18 configuration
│   │   │   └── translations.js      # All EN + ES strings (single file, both languages)
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Hero, featured products, B2B overview, CTA
│   │   │   ├── Catalog.jsx          # Product grid with category filters
│   │   │   ├── ProductDetail.jsx    # Product detail with color/size selection + add to cart
│   │   │   ├── Cart.jsx             # Cart page with CartItem and CartSummary
│   │   │   ├── Checkout.jsx         # Checkout call-to-action (requires user login)
│   │   │   ├── Account.jsx          # User account dashboard
│   │   │   ├── B2BServices.jsx      # B2B services, process steps, quote CTA
│   │   │   ├── Contact.jsx          # Contact form and company info
│   │   │   ├── CustomOrders.jsx     # 3-step custom order request flow
│   │   │   ├── About.jsx            # Brand story, values, team
│   │   │   └── NotFound.jsx         # 404 page
│   │   ├── App.jsx                  # Route definitions
│   │   └── main.jsx                 # React entry point
│   ├── index.html
│   ├── tailwind.config.js           # Custom token definitions
│   ├── postcss.config.js
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── server.js                  # Express API, auth, products, orders, custom orders, contact routing
│   ├── database_mysql.sql         # MySQL schema + seed inserts
│   ├── seed.js                    # Seed helper
│   ├── test.js                    # API smoke and regression coverage
│   ├── cleanup_test_data.js       # Removes integration-test inserts
│   ├── reset_stock_full.js        # Refills seeded inventory for demos/tests
│   └── package.json
```

> **Current project note:** The repository includes both the React client and the Express/MySQL backend used for authentication, catalog data, orders, contact routing, and custom orders.

---

## Getting Started

### Prerequisites
- Node.js ≥ 18.x
- npm ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/JordanTaylorGit/CSE5335-Group8-LincesCKF.git
cd CSE5335-Group8-LincesCKF/client

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at **http://localhost:5173**

### Full Stack Run Steps

```bash
# 1. Run the schema in MySQL first
#    Use DBeaver or the mysql CLI to execute server/database_mysql.sql

# 2. Start the backend
cd server
npm install
npm run seed
npm start

# 3. Start the frontend in a second terminal
cd ../client
npm install
npm run dev
```

Backend runs at **http://localhost:5001**  
Frontend runs at **http://localhost:5173**

---

## Naming Conventions

To keep the project consistent across frontend, backend, and database files, use these naming rules:

- **React components:** `PascalCase`
  - Examples: `AuthModal.jsx`, `ProductDetail.jsx`, `CartSummary.jsx`
- **JavaScript variables, functions, and state:** `camelCase`
  - Examples: `buildUserResponse`, `selectedSize`, `orderNumber`
- **Constants:** `UPPER_SNAKE_CASE`
  - Examples: `JWT_SECRET`, `DEFAULT_PAYMENT_METHOD`, `SEEDED_BRAND_PASSWORD`
- **Database tables and columns:** `snake_case`
  - Examples: `users`, `order_items`, `preferred_language`, `stock_quantity`
- **SQL files and route helper files:** descriptive lowercase names when possible
  - Examples: `database_mysql.sql`, `seed.js`

When backend code reads database rows, SQL column names stay in `snake_case`, but JavaScript response objects sent to the frontend should use `camelCase`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## Current Full-Stack Features

### Authentication and Account Roles

- Customer and Brand registration with role-aware login validation
- JWT-based protected API access with session persistence across refresh
- Toast and inline feedback for login and registration failures
- Account dashboard for profile updates, password changes, address information, and notification preferences

### Storefront and Bilingual Experience

- English-first initial load with persistent EN/ES language switching
- Bilingual product names, descriptions, category labels, colors, and account/order UI
- Responsive Home, Catalog, Product Detail, Cart, Checkout, About, Contact, and B2B Services pages
- Home page featured section powered by `GET /api/products/featured`
- Route-aware SEO metadata updates for titles, descriptions, canonical URLs, Open Graph, Twitter cards, and document language

### Inventory, Stock, and Out-of-Stock Handling

- Product inventory stored in MySQL with both total stock and per-size stock
- Product cards and product detail pages show out-of-stock states and disable unavailable selections
- Cart quantity updates are capped by the selected size's available stock
- Checkout decrements stock and updates both the total product quantity and size-level availability


### Cart and Checkout

- Add-to-cart flow tracks product, color, size, quantity, and brand metadata
- Cart persists across page refresh with `localStorage` until checkout or manual removal
- Cart and checkout summaries show brand names for each line item
- Checkout creates order, order items, payment, and shipping records through the backend API

### Brand Product Management

- Brand accounts can add new catalog items from the account dashboard
- Add Item supports bilingual product fields, images, category, colors, price, size-based stock entry, and a featured-products toggle
- All add-item fields are required except the featured-products toggle
- Newly added items appear in the brand's product list and in the public catalog immediately
- Newly added items appear on the Home page when they are marked as featured from the add-item form or through the database/API

### Order Fulfillment and Delivery Updates

- Customers see both regular orders and custom orders in My Orders
- Brand accounts see both the orders they place themselves and the store/custom orders routed to their brand
- Brands can mark individual store order items as delivered
- Customer order status updates to Delivered or Partially Delivered based on brand fulfillment progress
- Brands can mark targeted custom orders as delivered and the customer sees the updated custom-order status

### Custom Orders and Contact Routing

- All custom order types support selecting a target brand
- Brand-targeted custom orders are routed to the selected brand and shown in that brand's My Orders view
- Contact Us supports brand-directed inquiries
- Brand-directed contact messages appear in the target brand's Notifications section

## Database Write Map

| Flow / Action | Inserts Into | Notes |
|---|---|---|
| Customer registration | `users` | Creates a new customer account |
| Brand registration | `users` | Creates a new brand account |
| Profile save with first shipping address | `addresses` | Later profile saves usually update the same address row |
| Brand adds a product | `products` | Also inserts into `categories` if the entered category does not already exist |
| Customer checkout | `addresses`, `orders`, `order_items`, `payments` | Also updates product stock in `products` |
| Customer submits custom order | `custom_orders` | Also inserts into `service_types` if the order type does not already exist |
| Customer submits Contact Us form | `contact_forms` | `brand_user_id` is filled when the user targets a brand |
| Brand marks store order delivered | No new rows | Updates `order_items` and `orders` |
| Brand marks custom order delivered | No new rows | Updates `custom_orders` |

### Tables Not Used by the Live App Flow

- `shopping_carts`
- `cart_items`
- `service_inquiries`

These tables are currently not populated by the live frontend/backend flow. The cart is stored in browser `localStorage`. Contact Us submissions are written to `contact_forms`, and Custom Orders submissions are written to `custom_orders`.


---

## Design System

The design system uses a combination of Tailwind CSS custom tokens (defined in `tailwind.config.js`) and inline styles using the same hex values. Both approaches are in use across the codebase. Teammates should use either consistently within their files.

### Color Palette

| Token | Tailwind Class | Hex | Role |
|-------|---------------|-----|------|
| Silk Red | `bg-silk-red` | `#C8102E` | **Hero section background only** — never used as text |
| Silk Amber | `text-silk-amber` / `bg-silk-amber` | `#d4900a` | Primary accent on white/light sections — eyebrows, active nav, prices, CTA buttons |
| Silk Gold | `bg-silk-gold` | `#ffae42` | Accent on dark navy sections — buttons and highlights on dark backgrounds |
| Navy | `bg-navy` / `text-navy` | `#0B2545` | All body text, headings, dark section backgrounds, button hover states |
| Sky Light | `bg-sky-light` | `#E8F4FD` | Light subsection backgrounds, success states |
| Sky Mid | `border-sky-mid` | `#B8D4E8` | Card borders, dividers, icon strokes |
| White | `bg-white` | `#FFFFFF` | Main page background |


### Section Background Pattern

Pages follow a consistent alternating section pattern:

| Section Type | Background | Text |
|---|---|---|
| Hero | `#C8102E` silk red | White |
| Main content | `#FFFFFF` white | `#0B2545` navy |
| Dark accent | `#0B2545` navy | White |
| Light accent | `#E8F4FD` sky light | `#0B2545` navy |

### Typography

| Role | Font | Tailwind Class | Usage |
|------|------|---------------|-------|
| Display / Headings | Cormorant Garamond | `font-display` | Page titles, section headings, product names |
| Accent / Labels | Cinzel | `font-accent` | Eyebrows, navigation, button labels, badges |
| Body | Jost | `font-body` | Body text, descriptions, UI labels |

---

## Responsive Design

The platform is responsive across mobile, tablet, and desktop using **Tailwind CSS v3** utility classes together with layout-specific overrides in `client/src/assets/styles/responsive.css`. The design stays mobile-first, then refines dense surfaces such as catalog grids, checkout, account pages, and custom-order forms with targeted media-query adjustments.

### Breakpoints

The app primarily uses Tailwind's breakpoint scale:

| Prefix | Min-width | Typical device |
|--------|-----------|----------------|
| _(base)_ | 0px | Mobile portrait |
| `sm:` | 640px | Mobile landscape / small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |

`responsive.css` also applies layout-specific overrides around `1100px`, `900px`, `768px`, and `560px` for components that need extra control.

### Responsive Patterns by Component

| Component | Pattern |
|-----------|---------|
| **Navbar** | Desktop nav is hidden on mobile, while the hamburger toggle opens a separate mobile navigation panel with stacked links |
| **Home featured products** | Featured-product cards scale from 4 columns on large screens down to 3, 2, and 1 column on smaller widths |
| **Catalog grid** | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`, with responsive overrides keeping card heights, media ratios, and action rows stable |
| **Product detail** | Two-column media/content layout on large screens; collapses to one column on tablet/mobile, with narrower padding and full-width CTA treatment |
| **Cart and Checkout** | Sidebar summary layout on larger screens; collapses to a single column on smaller screens, with sticky summaries becoming static for mobile usability |
| **Contact page** | Multi-column contact, form, and map layout on larger screens; form and embedded map stack vertically on smaller screens |
| **Custom Orders** | Type-selection cards and form grids collapse from 3 / 2 columns to one column; progress steps remain usable on narrow screens with horizontal overflow support |
| **Account dashboard** | Sidebar becomes wrapped pill-style navigation on smaller screens; settings, addresses, brand add-item form, and order item grids collapse to one column |
| **Footer** | `grid-cols-1 md:grid-cols-4` — stacked on mobile, 4 columns on tablet+ |

### Focus & Touch

- Global `:focus-visible` styles are defined in `global.css` using the `silk-gold` token, ensuring keyboard and touch focus indicators are visible on all interactive elements.
- Toasts, summaries, and account navigation reposition on smaller screens to avoid clipping or overlap.
- Touch-heavy controls such as cart quantity buttons, product selectors, mobile navigation, and custom-order actions remain usable without requiring hover interactions.

---

## Accessibility

The app includes accessibility-oriented patterns across navigation, authentication, forms, account management, and product interaction. It has not been through a formal accessibility audit, but the current implementation includes semantic structure, keyboard support, focus management, and assistive labels in the main user flows.

### Semantic Structure

- Layout components use semantic elements such as `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, and `<form>`.
- `Layout.jsx` includes a skip link that moves keyboard users directly to `#main-content`.
- `ProcessSteps` uses `aria-labelledby`, and the contact map iframe includes a descriptive `title`.

### Dialog, Navigation, and Controls

- `AuthModal` uses `role="dialog"`, `aria-modal`, `aria-labelledby`, focus trapping, Escape-to-close, and focus restoration to the previously active element.
- Navbar controls expose `aria-label`, `aria-controls`, `aria-expanded`, and `aria-current` where appropriate.
- Product size/color selectors, product gallery thumbnails, catalog category chips, and language/account-type toggles use pressed-state patterns such as `aria-pressed`.
- Notification preferences on the account page use `role="switch"` with `aria-checked`.
- Footer social/contact links include descriptive `aria-label` values.

### Forms, Feedback, and Media

- Auth, account, contact, catalog filter, checkout, and custom-order forms use visible labels with matching `htmlFor` / `id` pairs.
- Common fields include useful `autoComplete` values such as `email`, `given-name`, `family-name`, `organization`, `tel`, `address-line1`, `postal-code`, and card-entry hints in checkout.
- Error and success feedback is announced through `role="alert"` in the auth modal, account settings, custom-order phone validation, and order-action messages.
- The auth gate loading state exposes `role="status"` while authentication is being resolved.
- Product, catalog, cart, checkout, about, and hero images use descriptive `alt` text based on product or page context.

### Focus and Motion

- A global `:focus-visible` rule in `global.css` provides a consistent visible outline across interactive controls.
- `prefers-reduced-motion: reduce` is respected by reducing animations and transition duration for motion-sensitive users.

---

## SEO

The frontend includes a shared route-level SEO helper in `client/src/components/Seo.jsx`, mounted once at the app root in `App.jsx`. It updates metadata on navigation so the storefront pages keep meaningful titles and descriptions instead of a single static document title.

### Current SEO Behavior

- Route-specific page titles and descriptions are defined for Home, Catalog, Product Detail, B2B Services, Custom Orders, About, Contact, Cart, Checkout, and Account pages.
- The document title is updated on route change.
- The main description meta tag is updated on route change.
- The root `<html>` element language is updated to `en` or `es` based on the active app language.
- A canonical URL link tag is maintained for the current route.
- Open Graph metadata is updated for `og:type`, `og:site_name`, `og:title`, `og:description`, `og:locale`, and `og:url`.
- Twitter metadata is updated for `twitter:card`, `twitter:title`, and `twitter:description`.
- A `robots` meta tag is set to `index, follow`.

### Deployment Note

- `Seo.jsx` uses `VITE_SITE_URL` when it is configured to build canonical URLs against the deployed frontend domain.
- If `VITE_SITE_URL` is not set, canonical URLs fall back to the current browser origin.
- `client/index.html` provides baseline metadata for the first page load, while `Seo.jsx` keeps metadata in sync after client-side route changes.

### Scope

- This is client-side SEO metadata support for a React SPA.
- The current repo does not document sitemap generation or server-side rendering.

---

## Internationalization

All UI strings are managed in a single file: `src/i18n/translations.js`. Both English and Spanish strings live side by side.

**To add a new translation key:**
1. Add the key and English string under `en` in `translations.js`
2. Add the Spanish equivalent directly below under `es`
3. Use `const { t } = useTranslation()` and call `t('your.key')` in the component

**Product bilingual fields** — product payloads returned by the backend include bilingual names and descriptions:
```js
const name = i18n.language === 'es' ? product.nameEs : product.nameEn;
const description = i18n.language === 'es' ? product.descriptionEs : product.descriptionEn;
```

---

## AI Queries Used 

This section is preserved as part of the course process documentation. The sections above describe the current implementation and current behavior of the app.

### Jordan:
Phase2:  
1. Generate just essential scaffolding for multi phase e-commerce web development project. Phase 1 was planning and design. Phase 2 front-end. Phase 3 back end. Phase 4 integration. Phase 1 is completed by time, we are on phase 2 front-end. Linces'CKF is a bilingual (Spanish/English) e -commerce platform for a premium silk garment brand that offers two main business lines:
   1. Direct-to-Consumer Sales
   2. B2B Manufacturing Services

2. Describe best practices for implementing hero section and b2b process steps into Linces'CKF home page and b2b services page respectively. Hero section and process steps must ensure responsive design across platforms

Phase3:  
1. Using aws free tier list what aws core services are required to deploy an ecommerce site using a MySQL database and step by step guide to deploy to aws.

2. The eccommerce site has been deployed to aws and the ec2 server can connect to the backend, but on the cloudfront frontend the products are not being displayed. Console output shows error connecting to MySQL server. What are the most likely cause for error and solution to resolve.

### Lakshmi Priya:
Phase2:  
1. Suggest guidelines on how to fix vite errors after initial scaffolding

2. Describe the best way to design a login and register page for a Customer and a Brand with validations

3. Suggest how to structure the account details page of a logged in user

4. How to make the login page consistent with the color theme?

Phase3:  
1. Explain how to integrate frontend form validation with backend validation for login and registration APIs. Include error messaging, status codes, and UX-friendly feedback.

2. Describe how JWT-based authentication between frontend and backend works and suggest how to integrate it

3. Walkthrough the best practices of designing a login authentication flow for a web application

4. Elaborate the guidelines to follow for making the navigation links secure and accessible only upon login?

### Ishan:
Phase2:  
1. I have a React + Tailwind component for a multi-step progress indicator that overflows horizontally on mobile (step 3 causes scrolling). How can I make it fully responsive and prevent overflow while keeping steps aligned properly?

2. I replaced custom Tailwind colors (obsidian, ivory, silk-500) with new theme values (navy, silk-amber, silk-gold). How do I ensure consistency across all React components and avoid leftover old styles?

Phase3:  
1. How does Nginx route incoming requests to different services, such as sending frontend traffic to a React app on port 5173 and API requests (e.g., /api) to a Node.js backend on port 5001? How does the proxy_pass directive control this behavior?

2. Why do API calls using localhost fail when a frontend is deployed on an EC2 instance, even if the backend server is running on the same machine? How does the browser interpret localhost in this context?

3. How does the presence or absence of a trailing slash in the Nginx proxy_pass configuration affect how request paths are forwarded to the backend, and how can this lead to 404 errors if not configured correctly?

### Hareesh:
phase2:  
1. Describe design for a product catalog with category filtering using React Context API.

2. For the cart, describe Context to add, update quantity, and remove items, along with cart message.

phase3:  
No prompts used for this phase.

### Andy: 
No prompts used.

## External websites referenced
Node.js Documentation: https://nodejs.org/docs/latest/api/  
MySQL Documentation: https://dev.mysql.com/doc/  
React Documentation: https://react.dev/  
Express Documentation: https://expressjs.com/  
MDN Web Docs: https://developer.mozilla.org/  
Phrase i18n overview: https://phrase.com/blog/posts/i18n-a-simple-definition/  
AWS S3 Static Website Hosting: https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html  
AWS CloudFront Getting Started: https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/GettingStarted.html  
AWS EC2 User Guide: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide  
AWS RDS MySQL: https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/CHAP_MySQL.html    
Additional reference sites used during development: W3Schools, GeeksforGeeks, and Stack Overflow.