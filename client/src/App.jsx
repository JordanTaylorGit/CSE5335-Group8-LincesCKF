import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Login from '@pages/Login';
import Register from '@pages/Register';
import Account from '@pages/Account';
import B2BServices from '@pages/B2BServices';
import About from '@pages/About';
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
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

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