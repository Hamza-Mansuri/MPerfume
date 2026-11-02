import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ShopPage = lazy(() => import('./pages/ShopPage.jsx'));
const ProductPage = lazy(() => import('./pages/ProductPage.jsx'));
const LoginPage = lazy(() => import('./pages/LoginPage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));

// AR (Admin Rights) Portal
const ArLayout = lazy(() => import('./layouts/ArLayout.jsx'));
const CnoFormPage = lazy(() => import('./pages/ar/CnoFormPage.jsx'));
const CnoListPage = lazy(() => import('./pages/ar/CnoListPage.jsx'));

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
      <Routes>
        {/* Public Storefront Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:slug" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* AR (Admin Rights) Business & CNO Portal */}
        <Route path="/ar" element={<ArLayout />}>
          <Route index element={<Navigate to="/ar/cno" replace />} />
          <Route path="cno" element={<CnoFormPage />} />
          <Route path="cno-list" element={<CnoListPage />} />
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
