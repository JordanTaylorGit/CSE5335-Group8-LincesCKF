# Linces'CKF E-Commerce Platform

## Project Description

Linces'CKF is a bilingual (English/Spanish) e-commerce platform for a premium silk garment brand with two core business lines:

1. Direct-to-consumer sales of exclusive silk garments such as blouses, dresses, shirts, and scarves.
2. B2B manufacturing services for fashion brands that need professional garment production support.

The platform combines a modern storefront, bilingual content, authentication, shopping cart workflows, and business-service pages in a single responsive web application.

## Current Implemented Functionality

- Customer and Brand accounts with registration, login, protected account views, profile management, password updates, and notification settings.
- English-first initial load with persistent English/Spanish language selection, translated product content, translated colors, and translated order/account messaging.
- Product catalog, product detail pages, featured products on the Home page, and responsive browsing across desktop and mobile layouts.
- Inventory-aware shopping experience with out-of-stock handling, per-size stock checks, checkout stock deduction, and cart quantity limits based on remaining stock.
- Persistent cart behavior across refresh using browser storage until checkout or manual removal.
- Brand dashboard tooling that allows brand users to add products, manage their catalog entries, mark featured products, and review both routed orders and orders placed from brand accounts.
- Add-item product creation requires all product fields except the featured toggle, with frontend and backend validation.
- Order lifecycle support where brands can mark regular order items as delivered and customers see Delivered or Partially Delivered status updates.
- Custom order workflows for custom garments, bulk orders, and B2B manufacturing, including brand routing and delivery completion for brand-targeted requests.
- Contact Us routing with optional target-brand selection so brand-specific inquiries appear in the selected brand's notification area.
- Route-aware SEO metadata support updates page titles, descriptions, canonical URLs, Open Graph tags, Twitter card tags, and document language for the main storefront pages.
- Environment-driven Express and MySQL backend setup so the same codebase can run locally and on AWS with the correct environment variables and database access.

## Current Architecture Notes

- Frontend: React, React Router, Context API, i18next, Tailwind CSS, and shared responsive overrides in `client/src/assets/styles/responsive.css`.
- Frontend metadata: `client/src/components/Seo.jsx` applies per-route SEO tags and uses `VITE_SITE_URL` for canonical URL generation when that environment variable is provided.
- Backend: Express API with JWT-authenticated routes for auth, products, orders, custom orders, contact routing, and brand-only fulfillment actions.
- Database: MySQL schema in `server/database_mysql.sql` with live writes flowing to `users`, `addresses`, `products`, `orders`, `order_items`, `payments`, `custom_orders`, and `contact_forms`.
- Live cart behavior is browser-based using `localStorage`; `shopping_carts`, `cart_items`, and `service_inquiries` are present in the schema but are not used by the live app flow.
- `service_types` remains part of the live custom-order workflow because each custom order stores a `service_type_id`.

The sections below preserve the original project-planning structure from the assignment. The two sections above describe the current delivered implementation.

## Project Objectives

### Primary Objectives

1. Create a fully functional bilingual e-commerce website.
2. Implement user authentication with two account types: Customer and Brand.
3. Build an intuitive shopping experience with cart functionality.
4. Showcase manufacturing services for B2B clients.
5. Ensure responsive design across mobile, tablet, and desktop devices.

### Technical Objectives

- Develop with React and modern JavaScript (ES6+).
- Use a component-based architecture.
- Create reusable UI components.
- Use Tailwind CSS for styling.
- Support accessibility and SEO best practices.

### Business Objectives

- Attract both retail customers and business clients.
- Clearly communicate brand values, quality, and exclusivity.
- Make contact and quote requests easy to complete.
- Build trust through a polished and professional user experience.

## Team Division

### Student 1: Authentication and User Management

**Responsibilities**

- Login and registration system
- Authentication logic
- Account type selection (Customer vs Brand)
- User session management
- Profile data handling
- Logout functionality

**Deliverables**

- `AuthModal` component
- Login form with validation
- Registration form with account type selection
- User state management
- Welcome message display
- Form validation for password matching and email format

**Key Files / Components**

- `AuthModal.js`
- `userAuth.js`
- User state management hooks

**Estimated Time**

- 2 weeks

### Student 2: Navigation and Layout

**Responsibilities**

- Main navigation bar
- Mobile responsive menu
- Footer design
- Page routing and navigation
- Language switcher
- Overall layout structure

**Deliverables**

- Navigation component for desktop and mobile
- Footer component
- Language toggle functionality
- Responsive hamburger menu
- Page state management
- Consistent layout across all pages

**Key Files / Components**

- `Navigation.js`
- `Footer.js`
- `Layout.js`
- Mobile menu toggle logic

**Estimated Time**

- 2 weeks

### Student 3: Product Catalog and Shopping Cart

**Responsibilities**

- Product catalog page
- Product card components
- Shopping cart functionality
- Add-to-cart feature
- Cart counter and badge
- Product filtering
- Product detail views

**Deliverables**

- `CatalogPage` component
- `ProductCard` component
- Shopping cart state management
- Add-to-cart functionality
- Cart display with item count
- Product image galleries
- Category and product filtering

**Key Files / Components**

- `CatalogPage.js`
- `ProductCard.js`
- `ShoppingCart.js`
- Product data structure
- Cart management functions

**Estimated Time**

- 2 to 3 weeks

### Student 4: Home Page and Services Page

**Responsibilities**

- Homepage hero section
- Featured products section
- Services and manufacturing page
- Process visualization
- Call-to-action buttons
- B2B feature cards

**Deliverables**

- `HomePage` component with hero section
- Featured products display
- `ServicesPage` component
- Manufacturing process steps
- Service feature cards
- Quote request button integration
- Responsive hero design

**Key Files / Components**

- `HomePage.js`
- `ServicesPage.js`
- `HeroSection.js`
- `ProcessSteps.js`

**Estimated Time**

- 2 weeks

### Student 5: Contact Forms and Static Pages

**Responsibilities**

- Custom orders and personalization page
- Contact page
- About page
- Form handling and validation
- WhatsApp integration
- Social media integration
- Bilingual content management

**Deliverables**

- `CustomPage` component with order form
- `ContactPage` component
- `AboutPage` component
- Form validation logic
- Social media link integration
- English and Spanish content support
- Form submission handling

**Key Files / Components**

- `CustomPage.js`
- `ContactPage.js`
- `AboutPage.js`
- `FormValidation.js`
- Translation content files

**Estimated Time**

- 2 weeks

## Project Timeline

### Week 1-2: Setup and Foundation

- Set up the project and development environment
- Review requirements and divide ownership
- Create the initial component structure

### Week 3-4: Core Development

- Build individual features by ownership area
- Hold weekly integration meetings
- Review code and share feedback

### Week 5-6: Integration and Testing

- Combine completed features
- Test across browsers and screen sizes
- Fix defects and layout issues

### Week 7-8: Polish and Deployment

- Final UI and UX adjustments
- Performance optimization
- Documentation
- Deployment preparation

## Shared Responsibilities

All team members should collaborate on:

- Styling consistency with Tailwind CSS
- Bilingual content and translations
- Peer code reviews
- Cross-testing of each other's components
- Documentation and README updates
- Git workflow, including branching, pull requests, and merges

## Technical Requirements

### Required Technologies

- React 18+
- Tailwind CSS
- Lucide React
- JavaScript ES6+

### Development Tools

- Git for version control
- VS Code or a similar IDE
- Browser DevTools
- npm or yarn

### Best Practices

- Component-based architecture
- Mobile-first responsive design
- Clean and readable code
- Useful comments where needed
- Consistent naming conventions
- Accessibility-minded development

## Suggested Grading Criteria

- Functionality: 40%
- Code Quality: 25%
- Design and UX: 20%
- Collaboration: 10%
- Documentation: 5%

## Deliverables

### Individual Deliverables

Each student should provide:

1. Source code
2. Component documentation
3. Testing report
4. Individual README with setup instructions
5. Short presentation or demo of their work

### Final Team Deliverable

- Complete integrated website
- Full documentation
- Deployment guide
- User manual
- Final team presentation
