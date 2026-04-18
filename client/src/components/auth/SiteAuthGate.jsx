/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { useEffect, useState } from 'react';
import AuthModal from '../AuthModal';
import { useAuth } from '@context/AuthContext';

export default function SiteAuthGate({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const [authOpen, setAuthOpen] = useState(true);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setAuthOpen(true);
    }
  }, [isAuthenticated, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div
          className="w-8 h-8 border-2 border-sky-mid border-t-navy rounded-full animate-spin"
          role="status"
          aria-label="Loading authentication status"
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-transparent px-6">
        <section className="max-w-md text-center">
          <p className="font-accent text-xs tracking-[0.28em] uppercase text-silk-amber mb-4">
            Linces'CKF
          </p>
          <h1 className="font-display text-4xl text-navy mb-4">
            Sign in to continue
          </h1>
          <p className="font-body text-navy/60 leading-7 mb-8">
            Please log in or create an account to continue with Linces'CKF.
          </p>
          <button
            type="button"
            onClick={() => setAuthOpen(true)}
            className="font-body rounded-md bg-navy px-6 py-3 text-sm text-white hover:bg-silk-red transition-colors"
          >
            Login or Register
          </button>
        </section>

        <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      </main>
    );
  }

  return children;
}
