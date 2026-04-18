/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="not-found-page min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <p className="font-accent text-silk-amber text-xs tracking-[0.4em] uppercase mb-4">404</p>
      <h1 className="font-display text-6xl md:text-8xl text-navy mb-6">{t('notFound.title')}</h1>
      <p className="font-body text-navy/50 mb-10">{t('notFound.message')}</p>
      <Link to="/" className="btn-primary">{t('notFound.return_home')}</Link>
    </div>
  );
}
