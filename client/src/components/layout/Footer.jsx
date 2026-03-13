import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Instagram, Mail, Facebook } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-ivory/80 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            {/* <p className="font-accent text-xl tracking-[0.2em] text-ivory mb-4">
              LINCES<span className="text-silk-400">'</span>CKF
            </p> */}
            <h3 className="text-xl font-semibold text-white font-sans mb-4">
              Linces'CKF
            </h3>
            <p className="text-sm leading-relaxed text-ivory/60 max-w-xs">
              {t("footer.brand_desc")}
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/40 hover:text-silk-400 transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href="mailto:contact@lincesckf.com"
                className="text-ivory/40 hover:text-silk-400 transition-colors"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            {/* <h4 className="font-accent text-xs tracking-widest uppercase text-silk-400 mb-5">
              {t("footer.links")}
            </h4> */}
            <h4 className="text-base font-semibold text-white font-sans mb-4">
              Quick Links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-ivory transition-colors"
                >
                  Catalog
                </Link>
              </li>
              <li>
                <Link to="/b2b" className="hover:text-ivory transition-colors">
                  B2B Services
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-ivory transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  className="hover:text-ivory transition-colors"
                >
                  My Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            {/* <h4 className="font-accent text-xs tracking-widest uppercase text-silk-400 mb-5">
              {t("footer.contact")}
            </h4> */}
            <h4 className="text-base font-semibold text-white font-sans mb-4">
              Contact Us
            </h4>
            <address className="not-italic text-sm space-y-2 text-ivory/60">
              <p>contact@lincesckf.com</p>
              <p>+1 (555) 000-0000</p>
            </address>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-base font-semibold text-white font-sans mb-4">
              Follow Us
            </h4>
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="flex items-center gap-2 text-ivory/60 hover:text-silk-400 transition-colors text-sm"
              >
                <Instagram size={18} />
                Instagram
              </Link>
              <Link
                to="/"
                className="flex items-center gap-2 text-ivory/60 hover:text-silk-400 transition-colors text-sm"
              >
                <Facebook size={18} />
                Facebook
              </Link>
            </div>
          </div>
        </div>

        <div className="divider-silk mt-12 mb-6 opacity-20" />

        <p className="text-center text-xs text-ivory/30 tracking-wider">
          © {year} Linces'CKF. {t("footer.rights")}.
        </p>
      </div>
    </footer>
  );
}