# Linces'CKF — Premium Silk E-Commerce Platform
### UTA CSE 5335 Web Data Management · Group 8

A bilingual (English/Spanish) e-commerce platform for a premium silk garment brand, featuring **Direct-to-Consumer** sales and **B2B Manufacturing Services**. Built with React 18 for Phase 2, with a backend API integration planned for Phase 3.

---

## 👥 Team

| # | Student | Responsibilities |
|---|---------|-----------------|
| 1 | Velupula, Lakshmi | Authentication (login/register/account), AuthContext, AuthModal, protected routes |
| 2 | Tran, Andy | Main navigation bar, Mobile responsive menu, Footer design, Language switcher functionality |
| 3 | Todupunoori, Hareesh | Product catalog, product detail page, shopping cart, CartContext |
| 4 | Taylor, Jordan | Home page, B2B Services page, hero section, process steps, documentation, README |
| 5 | Poudel, Ishan | Custom orders page, contact page, about page, LanguageContext |

---

## ☁️ Hosting

| Phase | Host | URL |
|-------|------|-----|
| Phase 2 (Frontend) | UTA Cloud | [jxt0693.uta.cloud](http://jxt0693.uta.cloud) |
| Phase 3 (Full Stack) | TBD | TBD |

---

## 🧵 Project Overview

**Linces'CKF** is a luxury silk garment brand serving two customer segments:

1. **Direct-to-Consumer (DTC)** — Exclusive silk garments (blouses, dresses, shirts, scarves) sold directly through the catalog with size and color selection
2. **B2B Manufacturing Services** — Professional confection services for fashion brands, including custom production runs, private labeling, and pattern development

The platform is fully bilingual — all UI strings, product names, descriptions, and category labels render in either English or Spanish based on the user's language selection, which persists across sessions via `localStorage`.


---

## 🛠️ Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| UI Framework | React 18 | Functional components + hooks throughout |
| Routing | React Router v6 | Client-side routing, protected routes |
| State Management | React Context API | Auth, Cart, Language contexts |
| Internationalization | i18next + react-i18next | EN/ES, single `translations.js` source |
| Styling | Tailwind CSS + inline styles | Custom token system (see Design System) |
| Build Tool | Vite | Fast dev server + optimized builds |
| Package Manager | npm | |

---

## 📁 Project Structure

```
lincesckf/
├── client/
│   ├── public/
│   │   └── images/                  # Product images (silkBlouse.jpeg, silkDress.jpeg, etc.)
│   ├── src/
│   │   ├── assets/
│   │   │   └── styles/
│   │   │       └── global.css       # Global styles, font imports
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   └── ProtectedRoute.jsx
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
│   │   │   ├── shared/
│   │   │   │   └── ProductCard.jsx  # Reusable card with color/size selection
│   │   │   ├── AuthModal.jsx        # Login/register modal
│   │   │   ├── auth.css
│   │   │   └── AuthModal.css
│   │   ├── context/
│   │   │   ├── AuthContext.jsx      # Auth state — login, register, logout
│   │   │   ├── CartContext.jsx      # Cart state — add, remove, quantity, messages
│   │   │   └── LanguageContext.jsx  # Language toggle (EN/ES), persisted to localStorage
│   │   ├── data/
│   │   │   └── products.js          # Single source for product data (bilingual)
│   │   ├── i18n/
│   │   │   ├── i18n.js              # i18 configuration
│   │   │   └── translations.js      # All EN + ES strings (single file, both languages)
│   │   ├── pages/
│   │   │   ├── Home.jsx             # Hero, featured products, B2B overview, CTA
│   │   │   ├── Catalog.jsx          # Product grid with category filters
│   │   │   ├── ProductDetail.jsx    # Product detail with color/size selection + add to cart
│   │   │   ├── Cart.jsx             # Cart page with CartItem and CartSummary
│   │   │   ├── Checkout.jsx         # Checkout flow (Phase 3)
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
```

> **Note for Phase 3:** A `server/` directory will be added for the Express backend, and a `database/` directory for schema and migrations.

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18.x
- npm ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/JordanTaylorGit/CSE5335-Group8-LincesCKF.git
cd lincesckf/client

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at **http://localhost:4173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🌐 Features

### ✅ Phase 2 — React Frontend

- [x] Bilingual UI (EN/ES) with language toggle — persists via localStorage
- [x] Fully responsive design — mobile, tablet, and desktop layouts
- [x] Authentication — login, register, logout with localStorage session persistence
- [x] Shopping cart — add, remove, quantity controls, color/size tracking, toast notifications
- [x] Product catalog — category filters, responsive grid, bilingual product names
- [x] Product detail pages — color swatch selection, size selection, bilingual name and description
- [x] Cart badge — live count reflecting total quantity across all items
- [x] Responsive navigation — desktop nav + mobile hamburger menu
- [x] Home page — hero, featured products, B2B overview, quote CTA
- [x] B2B Services page — service cards, process steps, quote CTA
- [x] Custom Orders page — 3-step order type selection and form flow
- [x] Contact page — contact form with subject selection
- [x] Consistent design system across all pages (see Design System section)
- [ ] Account dashboard with order histoy
- [x] Checkout call to action

### 🔧 Phase 3 — Backend Integration TODOs

- [ ] Replace mock `AuthContext` with real API calls (`POST /api/auth/login`, `POST /api/auth/register`)
- [ ] Replace `data/products.js` static data with API (`GET /api/products`, `GET /api/products/:id`)
- [ ] Implement checkout flow (`POST /api/orders`)
- [ ] Add order history retrieval (`GET /api/orders/:userId`)
- [ ] Add JWT token refresh and session management
- [ ] Connect B2B inquiry form (`POST /api/b2b/inquiry`)
- [ ] Connect custom orders form (`POST /api/custom-orders`)
- [ ] Connect contact form (`POST /api/contact`)
- [ ] Add product image upload management (admin panel)
- [ ] Cart persistence via backend (currently localStorage only)

---

## 🎨 Design System

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

## 🌍 Internationalization

All UI strings are managed in a single file: `src/i18n/translations.js`. Both English and Spanish strings live side by side.

**To add a new translation key:**
1. Add the key and English string under `en` in `translations.js`
2. Add the Spanish equivalent directly below under `es`
3. Use `const { t } = useTranslation()` and call `t('your.key')` in the component

**Product bilingual fields** — for phase 2 product names and descriptions are stored directly on the product object in `data/products.js`:
```js
const { i18n } = useTranslation();
const name = i18n.language === 'es' ? product.nameEs : product.nameEn;
const description = i18n.language === 'es' ? product.descriptionEs : product.descriptionEn;
```

---

## 📡 API Contract (Phase 3)

```
POST   /api/auth/login              Login with email + password
POST   /api/auth/register           Register new customer or brand account
GET    /api/products                List products, supports ?category= and ?featured=true
GET    /api/products/:id            Single product detail
POST   /api/cart                    Sync cart to backend
POST   /api/orders                  Place an order
GET    /api/orders/:userId          Retrieve order history
POST   /api/b2b/inquiry             Submit B2B quote request
POST   /api/custom-orders           Submit custom order request
POST   /api/contact                 Submit contact form message
```

---

## 👥 Contributing

1. Branch from `main` using `feature/`, `fix/`, or `chore/` prefixes
2. All new UI strings must be added to `translations.js` in both EN and ES
3. Follow the color palette — do not introduce new hex values outside the design system
4. Test across mobile, tablet, and desktop before merging

---