import React, { useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  FlaskConical,
  ListFilter,
  ArrowLeft,
  ShieldCheck,
  Database,
  ExternalLink,
  Menu,
  X,
  FileSpreadsheet,
  Boxes,
} from 'lucide-react';
import '../styles/ar-theme.css';

export default function ArLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getBreadcrumb = () => {
    if (location.pathname.includes('/cno-list')) return 'CNO Sample Registry & Reports';
    if (location.pathname.includes('/cno')) return 'Chief Nose Officer (CNO) Form';
    if (location.pathname.includes('/products')) return 'Store Products Registry';
    return 'Admin Rights Business Portal';
  };

  const getBreadcrumbShort = () => {
    if (location.pathname.includes('/cno-list')) return 'CNO Registry';
    if (location.pathname.includes('/cno')) return 'CNO Form';
    if (location.pathname.includes('/products')) return 'Products';
    return 'AR Portal';
  };

  return (
    <div className="ar-portal">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="ar-modal-backdrop"
          style={{ zIndex: 45 }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`ar-sidebar ${mobileOpen ? 'open' : ''}`}>
        <div className="ar-sidebar-brand">
          <Link to="/ar/cno" className="ar-brand-link">
            <div className="ar-brand-mark">MP</div>
            <div className="ar-brand-titles">
              <strong>Motiwala</strong>
              <small>Admin Rights · AR</small>
            </div>
          </Link>
          <button
            className="ar-icon-action mobile-only"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
            style={{ display: mobileOpen ? 'grid' : 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="ar-sidebar-nav">
          <div className="ar-nav-section-title">Fragrance Formulation & CNO</div>

          <NavLink
            to="/ar/cno"
            end
            className={({ isActive }) => `ar-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <FlaskConical size={18} />
            <span>CNO</span>
          </NavLink>

          <NavLink
            to="/ar/cno-list"
            className={({ isActive }) => `ar-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <ListFilter size={18} />
            <span>CNO List</span>
          </NavLink>

          <div className="ar-nav-section-title">System & Management</div>

          <NavLink
            to="/ar/products"
            className={({ isActive }) => `ar-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setMobileOpen(false)}
          >
            <Boxes size={18} />
            <span>Store Products</span>
          </NavLink>
        </nav>

        <div className="ar-sidebar-footer">
          <Link to="/" className="ar-store-link">
            <ArrowLeft size={16} />
            <span>Back to Storefront</span>
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <div className="ar-main">
        {/* Topbar */}
        <header className="ar-topbar">
          <div className="ar-topbar-left">
            <button
              className="ar-icon-action mobile-only"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="ar-breadcrumbs">
              <span className="ar-breadcrumb-root">AR Portal</span>
              <span className="ar-breadcrumb-sep">/</span>
              <strong className="ar-breadcrumb-full">{getBreadcrumb()}</strong>
              <strong className="ar-breadcrumb-mobile">{getBreadcrumbShort()}</strong>
            </div>
          </div>

          <div className="ar-topbar-actions">
            <div className="ar-status-badge" title="Live Cluster: Mperfume">
              <span className="ar-status-dot" />
              <span className="ar-status-full">Atlas Live · Mperfume</span>
              <span className="ar-status-mobile">Atlas Live</span>
            </div>
            <Link
              to="/shop"
              className="ar-btn-secondary ar-view-store-btn"
              target="_blank"
              rel="noreferrer"
            >
              <span className="ar-store-text">View Store</span>
              <ExternalLink size={13} />
            </Link>
          </div>
        </header>

        {/* Content View */}
        <main className="ar-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

