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
} from 'lucide-react';
import '../styles/ar-theme.css';

export default function ArLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const getBreadcrumb = () => {
    if (location.pathname.includes('/cno-list')) return 'CNO Sample Registry & Reports';
    if (location.pathname.includes('/cno')) return 'Chief Nose Officer (CNO) Form';
    return 'Admin Rights Business Portal';
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

          <Link
            to="/admin"
            className="ar-nav-item"
            onClick={() => setMobileOpen(false)}
          >
            <FileSpreadsheet size={18} />
            <span>Store Products</span>
          </Link>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className="ar-icon-action mobile-only"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle sidebar"
            >
              <Menu size={18} />
            </button>
            <div className="ar-breadcrumbs">
              <span>AR Portal</span>
              <span>/</span>
              <strong>{getBreadcrumb()}</strong>
            </div>
          </div>

          <div className="ar-topbar-actions">
            <div className="ar-status-badge" title="Live Cluster: Mperfume">
              <span className="ar-status-dot" />
              <span>Atlas Live · Mperfume</span>
            </div>
            <Link
              to="/shop"
              className="ar-btn-secondary"
              style={{ fontSize: 12, padding: '6px 12px' }}
              target="_blank"
              rel="noreferrer"
            >
              <span>View Store</span>
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

