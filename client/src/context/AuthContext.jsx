import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, registerUser, getStoredSession, storeSession } from '../services/userAuth';

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
      return { success: true };
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
