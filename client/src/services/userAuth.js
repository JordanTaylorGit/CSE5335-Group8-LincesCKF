/* Student 1 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 2 - Tran, Andy - ID# - 1002116149
 * Student 3 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 4 - Taylor, Jordan - ID# - 1002080693
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { fetchWithAuth, API_BASE_URL } from './api';

export const authService = {
  async login(email, password) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Login failed');
    }

    const responseData = await response.json();
    localStorage.setItem('token', responseData.token);
    return responseData.user;
  },

  async register(registrationData) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(registrationData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Registration failed');
    }

    const responseData = await response.json();
    localStorage.setItem('token', responseData.token);
    return responseData.user || {
      id: responseData.userId,
      email: registrationData.email,
      accountType: registrationData.accountType || 'CUSTOMER',
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
      companyName: registrationData.companyName,
      phone: registrationData.phone,
    };
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
