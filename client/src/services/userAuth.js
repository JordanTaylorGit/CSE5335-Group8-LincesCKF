import { fetchWithAuth, API_URL } from './api';

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    return data.user;
  },

  async register(userData) {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Registration failed');
    }

    const data = await response.json();
    localStorage.setItem('token', data.token);
    // Profile isn't fully returned on register sometimes, we can fetch it or construct it
    return { id: data.userId, email: userData.email, accountType: userData.accountType || 'CUSTOMER', firstName: userData.firstName, lastName: userData.lastName };
  },

  async getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const user = await fetchWithAuth('/users/profile');
      return user;
    } catch (error) {
      localStorage.removeItem('token');
      return null;
    }
  },

  logout() {
    localStorage.removeItem('token');
  }
};