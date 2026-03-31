/* Student 1 - Velupula, Lakshmi - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser, getStoredSession, storeSession, updateUserProfile, updateUserPassword, updateUserNotifications } from '../services/userAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredSession());
  const [loading, setLoading] = useState(false);

  // Keep localStorage in sync whenever user changes
  useEffect(() => {
    storeSession(user);
  }, [user]);

  /**
   * Login with email + password.
   * @returns {{ success: boolean, message?: string }}
   */
  async function login({ email, password }) {
    setLoading(true);
    try {
      const u = await loginUser({ email, password });
      setUser(u);
      return { success: true, user: u };
    } catch (err) {
      return { success: false, message: err?.message || 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  }

  /**
   * Register a new account.
   * @param {{ email, password, accountType, firstName, lastName, companyName, phone, preferredLanguage }}
   * @returns {{ success: boolean, message?: string }}
   */
  async function register({
    email,
    password,
    accountType = 'CUSTOMER',
    firstName = '',
    lastName = '',
    companyName = '',
    phone = '',
  }) {
    setLoading(true);
    try {
      const u = await registerUser({
        email, password, accountType,
        firstName, lastName, companyName, phone,
      });
      setUser(u); // auto-login after successful registration
      return { success: true };
    } catch (err) {
      return { success: false, message: err?.message || 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  }

  /** Update profile details. */
  async function updateProfile({ firstName, lastName, companyName, phone, email }) {
    try {
      const updated = await updateUserProfile({ id: user.id, firstName, lastName, companyName, phone, email });
      setUser(updated);
      return { success: true };
    } catch (err) {
      return { success: false, message: err?.message || 'Failed to update profile.' };
    }
  }

  /** Change password. */
  async function updatePassword({ currentPassword, newPassword }) {
    try {
      await updateUserPassword({ id: user.id, currentPassword, newPassword });
      return { success: true };
    } catch (err) {
      return { success: false, message: err?.message || 'Failed to update password.' };
    }
  }

  /** Save notification preferences. */
  async function updateNotifications(notifications) {
    try {
      const updated = await updateUserNotifications({ id: user.id, notifications });
      setUser(updated);
      return { success: true };
    } catch (err) {
      return { success: false, message: err?.message || 'Failed to save preferences.' };
    }
  }

  /** Clear session and log out. */
  function logout() {
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
