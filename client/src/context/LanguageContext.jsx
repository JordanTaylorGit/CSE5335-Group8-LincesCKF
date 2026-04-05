/* Student 1 - Taylor, Jordan - ID# - 1002080693
 * Student 2 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 3 - Tran, Andy - ID# - 1002116149
 * Student 4 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import React, { createContext, useContext, useState } from 'react';
import i18n from '@i18n/i18n';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem('lincesckf_lang') || 'es'
  );

  const toggleLanguage = () => {
    const next = language === 'es' ? 'en' : 'es';
    setLanguage(next);
    i18n.changeLanguage(next);
    localStorage.setItem('lincesckf_lang', next);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('lincesckf_lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
