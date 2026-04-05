/* Student 1 - Taylor, Jordan - ID# - 1002080693
 * Student 2 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 3 - Tran, Andy - ID# - 1002116149
 * Student 4 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-silk-300 border-t-silk-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
