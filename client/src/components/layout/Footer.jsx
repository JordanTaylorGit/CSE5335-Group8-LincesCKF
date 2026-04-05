/* Student 1 - Taylor, Jordan - ID# - 1002080693
 * Student 2 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 3 - Tran, Andy - ID# - 1002116149
 * Student 4 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Instagram, Mail, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy-dark text-ivory/80 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
              <p className="font-accent text-xl tracking-[0.2em] text-ivory mb-4">
              LINCES<span className="text-white">'</span>CKF
            </p>
            <p className="text-sm leading-relaxed text-ivory/60 max-w-xs">
              {t("footer.brand_desc")}
            </p>
            <div className="flex gap-4 mt-6">
              <a
                href="https://instagram.com/lincesckf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/40 hover:text-silk-400 transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com/lincesckf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/40 hover:text-silk-400 transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://twitter.com/lincesckf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/40 hover:text-silk-400 transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com/company/lincesckf"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ivory/40 hover:text-silk-400 transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:contact@lincesckf.com"
                className="text-ivory/40 hover:text-silk-400 transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className=" font-semibold text-lg tracking-widest uppercase text-white mb-4">
              {t('footer.links')}
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  to="/catalog"
                  className="hover:text-ivory transition-colors"
                >
                  {t('nav.catalog')}
                </Link>
              </li>
              <li>
                <Link to="/b2b" className="hover:text-ivory transition-colors">
                  {t('nav.b2b')}
                </Link>
              </li>
              <li>
                <Link
                  to="/custom-orders"
                  className="hover:text-ivory transition-colors"
                >
                  {t('nav.customOrders')}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-ivory transition-colors"
                >
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="hover:text-ivory transition-colors"
                >
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
             <h4 className="font-semibold text-lg tracking-widest uppercase text-white mb-4">
              {t('footer.contact')}
            </h4>
            <address className="not-italic text-sm space-y-2 text-ivory/60">
              <p>contact@lincesckf.com</p>
              <p>+1 (555) 000-0000</p>
              <p>123 Silk Street</p>
              <p>Fashion District, NY 10001</p>
            </address>
          </div>

          {/* Follow Us */}
          <div>
             <h4 className="font-semibold text-lg tracking-widest uppercase text-white mb-4">
              {t('footer.social')}
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href="https://instagram.com/lincesckf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-ivory/60 hover:text-silk-400 transition-colors text-sm"
              >
                <Instagram size={18} />
                Instagram
              </a>
              <a
                href="https://facebook.com/lincesckf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-ivory/60 hover:text-silk-400 transition-colors text-sm"
              >
                <Facebook size={18} />
                Facebook
              </a>
              <a
                href="https://twitter.com/lincesckf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-ivory/60 hover:text-silk-400 transition-colors text-sm"
              >
                <Twitter size={18} />
                Twitter
              </a>
              <a
                href="https://linkedin.com/company/lincesckf"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-ivory/60 hover:text-silk-400 transition-colors text-sm"
              >
                <Linkedin size={18} />
                LinkedIn
              </a>
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