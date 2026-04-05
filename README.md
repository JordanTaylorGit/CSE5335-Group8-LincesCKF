# Linces'CKF — Premium Silk E-Commerce Platform
### UTA CSE 5335 Web Data Management · Group 8

A bilingual (English/Spanish) e-commerce platform for a premium silk garment brand, featuring **Direct-to-Consumer** sales and **B2B Manufacturing Services**. Built with React 18 for Phase 2, with a backend API integration planned for Phase 3.


---
## Login Information

- Click on the Login Page and Register, if you are a new user. Enter all the details in the form and click Submit. 
- After registering, enter the same details in the Login page. 
- Once logged in, to view the Account details page, click 'My Account' in the Nav Bar.
- This page allows the user to view their account details and change the password if required.

---

## Team

| # | Student | Responsibilities |
|---|---------|-----------------|
| 1 | Velupula, Lakshmi Priya | Authentication (login/register/account), AuthContext, AuthModal, Project Regression Testing, collaborated in drafting README |
| 2 | Tran, Andy | Main navigation bar, Mobile responsive menu, Footer design, Language switcher functionality |
| 3 | Todupunoori, Hareesh | Product catalog, product detail page, shopping cart, CartContext |
| 4 | Taylor, Jordan | Home page, B2B Services page, hero section, process steps, documentation, README |
| 5 | Poudel, Ishan | Custom orders page, contact page, about page, LanguageContext |


---

## Hosting

| Phase | Host | URL |
|-------|------|-----|
| Phase 2 (Frontend) | UTA Cloud | [jxt0693.uta.cloud](http://jxt0693.uta.cloud) |
| Phase 3 (Full Stack) | TBD | TBD |

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

---

## Project Structure

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

## Getting Started

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

The app runs at **http://localhost:5173**

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🌐 Features

### Phase 2 — React Frontend

- Bilingual UI (EN/ES) with language toggle — persists via localStorage
- Fully responsive design — mobile, tablet, and desktop layouts
- Authentication — login, register, logout with localStorage session persistence
- Shopping cart — add, remove, quantity controls, color/size tracking, toast notifications
- Product catalog — category filters, responsive grid, bilingual product names
- Product detail pages — color swatch selection, size selection, bilingual name and description
- Cart badge — live count reflecting total quantity across all items
- Responsive navigation — desktop nav + mobile hamburger menu
- Home page — hero, featured products, B2B overview, quote CTA
- B2B Services page — service cards, process steps, quote CTA
- Custom Orders page — 3-step order type selection and form flow
- Contact page — contact form with subject selection
- Consistent design system across all pages (see Design System section)
- Account Details Page


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

The platform is fully responsive across mobile, tablet, and desktop using **Tailwind CSS v3** utility classes with a **mobile-first** approach. No additional CSS frameworks are used.

### Breakpoints

Tailwind's default breakpoint scale is used throughout:

| Prefix | Min-width | Typical device |
|--------|-----------|----------------|
| _(base)_ | 0px | Mobile portrait |
| `sm:` | 640px | Mobile landscape / small tablet |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Laptop |
| `xl:` | 1280px | Desktop |

### Responsive Patterns by Component

| Component | Pattern |
|-----------|---------|
| **Navbar** | Desktop nav hidden on mobile (`hidden md:flex`); hamburger toggle shown with `md:hidden` |
| **Product Catalog grid** | `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4` — 1 → 2 → 3 → 4 columns |
| **Cart layout** | Single column on mobile; `md:grid-cols-[2fr_1fr]` sidebar layout on tablet+ |
| **Footer** | `grid-cols-1 md:grid-cols-4` — stacked on mobile, 4 columns on tablet+ |
| **Hero CTA buttons** | `flex-col sm:flex-row` — stacked on mobile, side-by-side on sm+ |

### Focus & Touch

- Global `:focus-visible` styles are defined in `global.css` using the `silk-gold` token, ensuring keyboard and touch focus indicators are visible on all interactive elements.
- Minimum tap target sizes are maintained on all buttons and links for touch usability.

---

## Accessibility

The platform follows WCAG 2.1 AA guidelines using custom-built accessibility patterns throughout — no third-party a11y libraries are used.

### ARIA & Semantic HTML

- Semantic landmark elements (`<header>`, `<main>`, `<footer>`, `<nav>`, `<form>`) used across all layout components
- ARIA roles and attributes applied to all interactive components:
  - `AuthModal` — `role="dialog"`, `aria-modal`, `aria-labelledby`, `aria-selected` on tabs, `role="alert"` on errors, `aria-busy` on submit
  - `ProcessSteps` — `aria-labelledby` linking the section to its heading
  - Social media links in `Footer` — descriptive `aria-label` on every icon link
  - Navbar buttons — `aria-label` on cart link, language toggle, and hamburger menu

### Keyboard Navigation

`AuthModal` implements a full focus trap:
- Moves focus to the first focusable element when the modal opens
- Traps Tab / Shift+Tab cycling within the modal
- Closes on Escape and restores focus to the trigger element

Focusable elements are selected via:
```js
const FOCUSABLE = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
```

### Focus Styles

A global `:focus-visible` style is defined in `global.css`:
```css
:focus-visible {
  outline: 2px solid var(--color-silk-gold);
  outline-offset: 3px;
}
```
Form inputs use Tailwind `focus:ring-2` classes for additional inline focus indication.

### Images & Alt Text

All `<img>` elements carry descriptive `alt` attributes — product images use the product name, and decorative images use `alt=""`.

### Forms

All form inputs in `AuthModal`, `Account`, and `Contact` use `<label htmlFor>` with matching `id` attributes. Password and user data fields include appropriate `autoComplete` attributes. Error messages use `role="alert"` for immediate screen reader announcement.

---

## Internationalization

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

## AI Queries Used

Jordan:
Generate just essential scaffolding for multi phase e-commerce web development project. Phase 1 was planning and design. Phase 2 front-end. Phase 3 back end. Phase 4 integration. Phase 1 is completed by time, we are on phase 2 front-end. Linces'CKF is a bilingual (Spanish/English) e -commerce platform for a premium silk garment brand that offers two main business lines:
1. Direct-to-Consumer Sales
2. B2B Manufacturing Services
Describe best practices for implementing hero section and b2b process steps into Linces'CKF home page and b2b services page respectively. Hero section and process steps must ensure responsive design across platforms

Lakshmi Priya: 
Suggest guidelines on how to fix vite errors after initial scaffolding
Describe the best way to design a login page for a Customer and a Brand with validations
How to make the login page consistent with the color theme?

Ishan:
have a React + Tailwind component for a multi-step progress indicator that overflows horizontally on mobile (step 3 causes scrolling). How can I make it fully responsive and prevent overflow while keeping steps aligned properly?  I replaced custom Tailwind colors (obsidian, ivory, silk-500) with new theme values (navy, silk-amber, silk-gold). How do I ensure consistency across all React components and avoid leftover old styles?
