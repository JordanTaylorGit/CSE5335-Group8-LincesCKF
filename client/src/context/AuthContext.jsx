import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('lincesckf_user');
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch (_) {}
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    // TODO: Replace with real API call — POST /api/auth/login
    // const { data } = await axios.post('/api/auth/login', { email, password });
    const mockUser = { id: '1', email, name: 'Demo User', role: 'customer' };
    setUser(mockUser);
    localStorage.setItem('lincesckf_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const register = async (name, email, password) => {
    // TODO: Replace with real API call — POST /api/auth/register
    const mockUser = { id: Date.now().toString(), email, name, role: 'customer' };
    setUser(mockUser);
    localStorage.setItem('lincesckf_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lincesckf_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
