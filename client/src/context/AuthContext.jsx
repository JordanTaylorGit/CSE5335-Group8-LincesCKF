/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/userAuth';
import { fetchWithAuth } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authService.getCurrentUser().then((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
  }, []);

  async function login({ email, password }) {
    setLoading(true);
    try {
      const currentUser = await authService.login(email, password);
      setUser(currentUser);
      return { success: true, user: currentUser };
    } catch (error) {
      return { success: false, message: error?.message || 'Login failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  }

  async function register({ email, password, accountType = 'CUSTOMER', firstName = '', lastName = '', companyName = '', phone = '' }) {
    setLoading(true);
    try {
      const currentUser = await authService.register({ email, password, accountType, firstName, lastName, companyName, phone });
      setUser(currentUser);
      return { success: true };
    } catch (error) {
      return { success: false, message: error?.message || 'Registration failed. Please try again.' };
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({ firstName, lastName, companyName, phone, email, addresses }) {
    try {
      const data = await fetchWithAuth('/users/profile', {
        method: 'PUT',
        body: JSON.stringify({ firstName, lastName, companyName, phone, email, addresses }),
      });
      setUser(data.user || { ...user, firstName, lastName, companyName, phone, email, addresses });
      return { success: true };
    } catch (error) {
      return { success: false, message: error?.message || 'Failed to update profile.' };
    }
  }

  async function updatePassword({ currentPassword, newPassword }) {
    try {
      await fetchWithAuth('/users/password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      return { success: true };
    } catch (error) {
      return { success: false, message: error?.message || 'Failed to update password.' };
    }
  }

  async function updateNotifications(notifications) {
    try {
      const data = await fetchWithAuth('/users/notifications', {
        method: 'PUT',
        body: JSON.stringify(notifications),
      });
      setUser(data.user || { ...user, notifications });
      return { success: true };
    } catch (error) {
      return { success: false, message: error?.message || 'Failed to update notification preferences.' };
    }
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
