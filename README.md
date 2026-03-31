# UTA CSE 5335 WebData Management Project Linces'CKF — Premium Silk E-Commerce Platform
Group 8
Student 1 - Velupula, Lakshmi
Student 2 - Tran, Andy
Student 3 - Todupunoori, Hareesh
Student 4 - Taylor, Jordan
Student 5 - Poudel, Ishan

---

A bilingual (Spanish/English) e-commerce platform for a premium silk garment brand, featuring **Direct-to-Consumer** sales and **B2B Manufacturing Services**.

---

## 🧵 Project Overview

**Linces'CKF** offers two main business lines:

1. **Direct-to-Consumer (DTC)** — Exclusive silk garments: blouses, dresses, shirts, scarves
2. **B2B Manufacturing Services** — Professional confection services for fashion brands

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| UI Framework | React 18 |
| Routing | React Router v6 |
| State Management | React Context + Zustand (ready) |
| Internationalization | i18next (ES + EN) |
| Styling | Tailwind CSS + Custom CSS Variables |
| Animations | Framer Motion |
| HTTP Client | UTA Cloud Phase 2 | Alternative host Phase 3 |
| Package Manager | npm |

---

## 📁 Project Structure

```
lincesckf/
├── public/
│   └── images/          # Static assets & product images
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── global.css       # Global styles, CSS variables
│   ├── components/
│   │   ├── auth/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── layout/
│   │   │   ├── Layout.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── catalog/             # Product listing components
│   │   ├── cart/                # Cart UI components
│   │   ├── b2b/                 # B2B section components
│   │   └── shared/
│   │       └── ProductCard.jsx
│   ├── context/
│   │   ├── AuthContext.jsx      # Auth state & methods
│   │   ├── CartContext.jsx      # Cart state (persisted)
│   │   └── LanguageContext.jsx  # Language toggle
│   ├── hooks/                   # Custom React hooks
│   ├── i18n/
│   │   ├── i18n.js
│   │   └── locales/
│   │       ├── en.json
│   │       └── es.json
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Catalog.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx         
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Account.jsx
│   │   ├── B2BServices.jsx
│   │   ├── Contact.jsx
│   │   ├── About.jsx
│   │   └── NotFound.jsx
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
├── postcss.config.js
└── package.json

TODO: Add client, server, and databse folders
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 18.x
- npm ≥ 9.x

### Installation

```bash
# Clone the repository
git clone https://github.com/JordanTaylorGit/CSE5335-Group8-LincesCKF.git
cd lincesckf

# Install dependencies
npm install

# Start development server
npm run dev
```

The app runs at **http://localhost:3000**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🌐 Features

### ✅ Implemented — Phase 2 Frontend powered by React
- [x] Bilingual UI (ES/EN) with language toggle — defaults to english
- [ ] React Router v6 with protected routes
- [x] Authentication context (login/register/logout with localStorage session)
- [x] Shopping cart with quantity management and localStorage persistence
- [x] Product catalog with category filters and sorting
- [x] Product detail pages with size/color selection
- [ ] Responsive navigation (mobile menu)
- [ ] Luxury aesthetic design system (Cormorant Garamond + Cinzel + Jost)
- [x] Home page with hero, featured products, services overview
- [x] B2B Services page + contact inquiry form
- [ ] Account dashboard with order history stubs

### 🔧 TODOs — Phase 3 Connect to Backend
- [ ] Replace mock `AuthContext` login/register with real API (`POST /api/auth/login`, `/api/auth/register`)
- [ ] Replace `utils/products.js` mock data with API calls (`GET /api/products`, `GET /api/products/:id`)
- [ ] Implement Checkout flow
- [ ] Add order management APIs (`POST /api/orders`, `GET /api/orders/:userId`)
- [ ] Add JWT token refresh logic
- [ ] B2B inquiry form — connect to `POST /api/b2b/inquiry`
- [ ] Add product image upload management (admin)

---

## 🎨 Design System

### Colors
| Token | Value | Usage |
|-------|-------|-------|
| `silk-500` | `#bf7a45` | Primary accent |
| `obsidian` | `#0d0d0d` | Text, backgrounds |
| `ivory` | `#f9f4ee` | Main background |

### Typography
- **Display** — Cormorant Garamond (headings)
- **Accent** — Cinzel (labels, navigation)
- **Body** — Jost (body text, UI)


---

## 📡 API Contract (Expected)

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/products?category=&sort=
GET    /api/products/:id
POST   /api/cart
POST   /api/orders
GET    /api/orders/:userId
POST   /api/b2b/inquiry
```

---

## 👥 Contributing

1. Branch from `main` — use `feature/`, `fix/`, or `chore/` prefixes
2. Follow existing code style (functional components, hooks)
3. Test across mobile and desktop breakpoints

---