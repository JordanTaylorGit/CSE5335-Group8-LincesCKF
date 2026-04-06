/* Student 1 - Velupula, Lakshmi - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useCart } from '../../context/CartContext';

export default function Layout({ children }) {
  const { message } = useCart();

  return (
    <div className="min-h-screen flex flex-col relative">
      <Navbar />
      <main className="flex-1 pt-18">
        {children}
      </main>
      <Footer />
      {message && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-md shadow-lg z-50 transition-opacity duration-300">
          {message}
        </div>
      )}
    </div>
  );
}
