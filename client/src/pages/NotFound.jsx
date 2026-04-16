/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
      <p className="font-accent text-silk-amber text-xs tracking-[0.4em] uppercase mb-4">404</p>
      <h1 className="font-display text-6xl md:text-8xl text-navy mb-6">Not Found</h1>
      <p className="font-body text-navy/50 mb-10">The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">Return Home</Link>
    </div>
  );
}
