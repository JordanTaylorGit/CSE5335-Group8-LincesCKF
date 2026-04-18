/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '@context/LanguageContext';

const SITE_NAME = "Linces'CKF";

const PAGE_META = [
  {
    match: (pathname) => pathname === '/',
    en: {
      title: "Linces'CKF | Premium Silk Garments",
      description:
        "Shop premium silk garments and explore professional B2B manufacturing services for fashion brands.",
    },
    es: {
      title: "Linces'CKF | Prendas premium de seda",
      description:
        "Compra prendas premium de seda y explora servicios profesionales de confeccion B2B para marcas de moda.",
    },
  },
  {
    match: (pathname) => pathname.startsWith('/catalog'),
    en: {
      title: "Product Catalog | Linces'CKF",
      description:
        "Browse silk blouses, dresses, shirts, scarves, and selected garments from Linces'CKF.",
    },
    es: {
      title: "Catalogo de productos | Linces'CKF",
      description:
        "Explora blusas, vestidos, camisas, bufandas y prendas seleccionadas de seda de Linces'CKF.",
    },
  },
  {
    match: (pathname) => pathname.startsWith('/product'),
    en: {
      title: "Product Details | Linces'CKF",
      description:
        "View product details, available sizes, colors, pricing, and silk garment information.",
    },
    es: {
      title: "Detalles del producto | Linces'CKF",
      description:
        "Consulta detalles del producto, tallas, colores, precio e informacion de prendas de seda.",
    },
  },
  {
    match: (pathname) => pathname.startsWith('/b2b'),
    en: {
      title: "B2B Manufacturing Services | Linces'CKF",
      description:
        "Partner with Linces'CKF for professional garment manufacturing and private label silk production.",
    },
    es: {
      title: "Servicios B2B de confeccion | Linces'CKF",
      description:
        "Colabora con Linces'CKF para confeccion profesional y produccion de seda para marcas privadas.",
    },
  },
  {
    match: (pathname) => pathname.startsWith('/custom-orders'),
    en: {
      title: "Custom Orders | Linces'CKF",
      description:
        "Request custom silk garments, personalization, and made-to-order fashion services.",
    },
    es: {
      title: "Pedidos personalizados | Linces'CKF",
      description:
        "Solicita prendas de seda personalizadas y servicios de moda hechos a pedido.",
    },
  },
  {
    match: (pathname) => pathname.startsWith('/about'),
    en: {
      title: "About Us | Linces'CKF",
      description:
        "Learn about Linces'CKF, our silk craftsmanship, sustainability values, and fashion manufacturing expertise.",
    },
    es: {
      title: "Sobre nosotros | Linces'CKF",
      description:
        "Conoce Linces'CKF, nuestra artesania en seda, valores de sostenibilidad y experiencia en moda.",
    },
  },
  {
    match: (pathname) => pathname.startsWith('/contact'),
    en: {
      title: "Contact | Linces'CKF",
      description:
        "Contact Linces'CKF for silk garment questions, custom requests, and brand manufacturing inquiries.",
    },
    es: {
      title: "Contacto | Linces'CKF",
      description:
        "Contacta a Linces'CKF para consultas de prendas de seda, pedidos personalizados y servicios para marcas.",
    },
  },
  {
    match: (pathname) => pathname.startsWith('/cart'),
    en: {
      title: "Shopping Cart | Linces'CKF",
      description:
        "Review your selected silk garments before checkout.",
    },
    es: {
      title: "Carrito de compras | Linces'CKF",
      description:
        "Revisa tus prendas de seda seleccionadas antes de finalizar la compra.",
    },
  },
  {
    match: (pathname) => pathname.startsWith('/checkout'),
    en: {
      title: "Checkout | Linces'CKF",
      description:
        "Complete your Linces'CKF order securely.",
    },
    es: {
      title: "Finalizar compra | Linces'CKF",
      description:
        "Completa tu pedido de Linces'CKF de forma segura.",
    },
  },
  {
    match: (pathname) => pathname.startsWith('/account'),
    en: {
      title: "My Account | Linces'CKF",
      description:
        "Manage your Linces'CKF profile, preferences, and account settings.",
    },
    es: {
      title: "Mi cuenta | Linces'CKF",
      description:
        "Administra tu perfil, preferencias y configuracion de cuenta de Linces'CKF.",
    },
  },
];

function getCurrentMeta(pathname, language) {
  const page = PAGE_META.find(({ match }) => match(pathname));
  const fallback = {
    title: "Linces'CKF",
    description:
      "Premium silk garments and professional fashion manufacturing services.",
  };

  return page?.[language] || page?.en || fallback;
}

function setMeta(attribute, value, content) {
  let element = document.head.querySelector(`meta[${attribute}="${value}"]`);

  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, value);
    document.head.appendChild(element);
  }

  element.setAttribute('content', content);
}

function setCanonical(pathname) {
  const configuredUrl = import.meta.env.VITE_SITE_URL;
  const origin = configuredUrl || window.location.origin;
  const canonicalUrl = `${origin.replace(/\/$/, '')}${pathname}`;
  let element = document.head.querySelector('link[rel="canonical"]');

  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', 'canonical');
    document.head.appendChild(element);
  }

  element.setAttribute('href', canonicalUrl);
  setMeta('property', 'og:url', canonicalUrl);
}

export default function Seo() {
  const { pathname } = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const currentLanguage = language || 'en';
    const { title, description } = getCurrentMeta(pathname, currentLanguage);

    document.documentElement.lang = currentLanguage;
    document.title = title;

    setMeta('name', 'description', description);
    setMeta('name', 'robots', 'index, follow');
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE_NAME);
    setMeta('property', 'og:title', title);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:locale', currentLanguage === 'es' ? 'es_ES' : 'en_US');
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', title);
    setMeta('name', 'twitter:description', description);
    setCanonical(pathname);
  }, [language, pathname]);

  return null;
}
