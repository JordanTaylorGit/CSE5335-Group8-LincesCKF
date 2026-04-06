/* Student 1 - Velupula, Lakshmi - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/userAuth';
import { fetchWithAuth } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  async function login({ email, password }) {
    setLoading(true);
    try {
      const u = await authService.login(email, password);
      setUser(u);
      return { success: true, user: u };
    } catch (err) {
      return { success: false, message: err?.message || 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  }

  async function register({ email, password, accountType = 'CUSTOMER', firstName = '', lastName = '', companyName = '', phone = '' }) {
    setLoading(true);
    try {
      const u = await authService.register({ email, password, accountType, firstName, lastName, companyName, phone });
      setUser(u);
      return { success: true };
    } catch (err) {
      return { success: false, message: err?.message || 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ firstName, lastName, companyName, phone, email }) {
    try {
      await fetchWithAuth('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ firstName, lastName, companyName, phone, email })
      });
      setUser({ ...user, firstName, lastName, companyName, phone, email });
      return { success: true };
    } catch (err) {
      return { success: false, message: err?.message || 'Failed to update profile.' };
    }
  }

  async function updatePassword({ currentPassword, newPassword }) {
    // Requires a PUT /api/users/password endpoint.
    return { success: false, message: 'Password update not fully implemented in barebones backend.' };
  }

  async function updateNotifications(notifications) {
    return { success: false, message: 'Notification update not fully implemented in barebones backend.' };
  }

  function logout() {
    authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateProfile,
        updatePassword,
        updateNotifications,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
