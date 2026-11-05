import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ShopPage = lazy(() => import('./pages/ShopPage.jsx'));
const AiDiscoveryPage = lazy(() => import('./pages/AiDiscoveryPage.jsx'));
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));

// AR (Admin Rights) Portal
const ArLayout = lazy(() => import('./layouts/ArLayout.jsx'));
const CnoFormPage = lazy(() => import('./pages/ar/CnoFormPage.jsx'));
const CnoListPage = lazy(() => import('./pages/ar/CnoListPage.jsx'));
const ArProductsPage = lazy(() => import('./pages/ar/ArProductsPage.jsx'));

export default function App() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: '75vh',
            display: 'grid',
            placeItems: 'center',
            background: '#fffdfa',
          }}
        >
          <div
            style={{ width: 120, height: 4, background: '#e6d4bb', borderRadius: 20 }}
            role="status"
            aria-label="Loading page"
          />
        </main>
      }
    >
      <ScrollToTop />
      <Routes>
        {/* Public Storefront Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/ai-discovery" element={<AiDiscoveryPage />} />
        <Route path="/discover" element={<Navigate to="/ai-discovery" replace />} />
        <Route path="/finder" element={<Navigate to="/ai-discovery" replace />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* AR (Admin Rights) Business & CNO Portal */}
        <Route path="/ar" element={<ArLayout />}>
          <Route index element={<Navigate to="/ar/cno" replace />} />
          <Route path="cno" element={<CnoFormPage />} />
          <Route path="cno-list" element={<CnoListPage />} />
          <Route path="products" element={<ArProductsPage />} />
          <Route path="store-products" element={<Navigate to="/ar/products" replace />} />
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
