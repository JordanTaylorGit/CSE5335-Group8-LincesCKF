import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ShoppingBag, Menu, X, Globe } from "lucide-react";
import { useAuth } from "@context/AuthContext";
import { useCart } from "@context/CartContext";
import { useLanguage } from "@context/LanguageContext";

export default function Navbar() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const { count } = useCart();
  const { language, toggleLanguage } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-white border-b border-sky-mid"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-18 py-4">
        {/* Logo */}
        <Link
          to="/"
          className="font-accent text-xl tracking-[0.2em] text-navy hover:text-silk-red transition-colors"
        >
          LINCES<span className="text-silk-red">'</span>CKF
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/">{t("nav.home")}</NavLink>
          <NavLink to="/catalog">{t("nav.catalog")}</NavLink>
          <NavLink to="/b2b">{t("nav.b2b")}</NavLink>
          <NavLink to="/custom-orders">{t("nav.customOrders")}</NavLink>
          <NavLink to="/about">{t("nav.about")}</NavLink>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={toggleLanguage}
            className="font-body text-xs tracking-widest uppercase text-navy/60 hover:text-silk-red transition-colors flex items-center gap-1.5"
            aria-label="Toggle language"
          >
            <Globe size={16} strokeWidth={1.5} />
            {language === "es" ? "EN" : "ES"}
          </button>

          {/* Account */}
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            className="font-body text-sm tracking-wider text-navy hover:text-silk-red transition-colors"
          >
            {isAuthenticated ? t("nav.account") : t("nav.login")}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="relative text-navy hover:text-silk-red transition-colors"
            aria-label={t("nav.cart")}
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {count > 0 && (
              <span className="absolute -top-2 -right-2 bg-silk-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                {count}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-navy"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-sky-mid py-6 px-6">
          <nav className="flex flex-col gap-5">
            <NavLink to="/" mobile>
              {t("nav.home")}
            </NavLink>
            <NavLink to="/catalog" mobile>
              {t("nav.catalog")}
            </NavLink>
            <NavLink to="/b2b" mobile>
              {t("nav.b2b")}
            </NavLink>
            <NavLink to="/custom-orders" mobile>
              {t("nav.customOrders")}
            </NavLink>
            <NavLink to="/about" mobile>
              {t("nav.about")}
            </NavLink>
            <NavLink to={isAuthenticated ? "/account" : "/login"} mobile>
              {isAuthenticated ? t("nav.account") : t("nav.login")}
            </NavLink>
          </nav>
        </div>
      )}
    </header>
  );
}

function NavLink({ to, children, mobile }) {
  const location = useLocation();
  const active =
    location.pathname === to || location.pathname.startsWith(`${to}/`);
  return (
    <Link
      to={to}
      className={`font-body text-sm tracking-wider transition-colors ${
        mobile ? "text-lg" : ""
      } ${active ? "text-silk-red" : "text-navy hover:text-silk-red"}`}
    >
      {children}
    </Link>
  );
}