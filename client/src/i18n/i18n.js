/* Student 1 - Taylor, Jordan - ID# - 1002080693
 * Student 2 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 3 - Tran, Andy - ID# - 1002116149
 * Student 4 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from './translations';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: translations.en },
    es: { translation: translations.es },
  },
  lng: localStorage.getItem('lincesckf_lang') || 'es',
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
});

export default i18n;
