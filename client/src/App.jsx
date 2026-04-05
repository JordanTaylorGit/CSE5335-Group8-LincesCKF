/* Student 1 - Taylor, Jordan - ID# - 1002080693
 * Student 2 - Velupula, Lakshmi Priya - ID# - 1002216063
 * Student 3 - Tran, Andy - ID# - 1002116149
 * Student 4 - Todupunoori, Hareesh - ID# - 1002275378
 * Student 5 - Poudel, Ishan - ID# - 1001838432
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@context/AuthContext';
import { CartProvider } from '@context/CartContext';
import { LanguageProvider } from '@context/LanguageContext';
import ProtectedRoute from '@components/auth/ProtectedRoute';
import Layout from '@components/layout/Layout';

// Pages — lazy loaded for code splitting
import Home from '@pages/Home';
import Catalog from '@pages/Catalog';
import ProductDetail from '@pages/ProductDetail';
import Cart from '@pages/Cart';
import Checkout from '@pages/Checkout';
import Account from '@pages/Account';
import B2BServices from '@pages/B2BServices';
import About from '@pages/About';
import CustomOrders from '@pages/CustomOrders';
import Contact from '@pages/Contact';
import NotFound from '@pages/NotFound';

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/catalog" element={<Catalog />} />
                <Route path="/catalog/:category" element={<Catalog />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/b2b" element={<B2BServices />} />
                <Route path="/custom-orders" element={<CustomOrders />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/register" element={<Navigate to="/" replace />} />

                {/* Cart — accessible without auth, checkout requires auth */}
                <Route path="/cart" element={<Cart />} />
                <Route
                  path="/checkout"
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  }
                />

                {/* Protected Account */}
                <Route
                  path="/account/*"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}