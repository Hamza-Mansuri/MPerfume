import React, { useState, useEffect } from 'react';
import { Menu, Search, ShoppingBag, UserRound, ShieldCheck, X, Sparkles, ChevronRight, FlaskConical, ListFilter, Boxes } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const location = useLocation();

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (mobileNavOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileNavOpen]);

  return (
    <>
      <header className="header shell">
        <Link to="/" className="brand" aria-label="Motiwala Perfumes home">
          <span className="brand-mark">MP</span>
          <span className="brand-copy">
            <strong>Motiwala</strong>
            <small>Perfumes</small>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <Link to="/shop">Shop</Link>
          <a href="#discover">AI Discovery</a>
          <a href="#story">Our Story</a>
          <Link to="/ar/cno" className="ar-nav-pill" title="Admin Rights - Business Portal">
            <ShieldCheck size={13} strokeWidth={2.5} />
            <span>AR (Admin Rights)</span>
          </Link>
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          <button className="icon-button" aria-label="Search">
            <Search size={18} />
          </button>
          <Link className="icon-button" to="/login" aria-label="Account">
            <UserRound size={18} />
          </Link>
          <button className="icon-button" aria-label="Cart">
            <ShoppingBag size={18} />
          </button>
          <Link
            to="/ar/cno"
            className="icon-button mobile-only"
            aria-label="Admin Rights"
            title="AR Business Portal"
          >
            <ShieldCheck size={18} style={{ color: 'var(--ar-green, #99c229)' }} />
          </Link>
          <button
            className="icon-button mobile-only"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            {mobileNavOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Backdrop */}
      {mobileNavOpen && (
        <div
          className="mp-mobile-nav-backdrop"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-Out Navigation Drawer */}
      <div className={`mp-mobile-nav-drawer ${mobileNavOpen ? 'open' : ''}`}>
        <div className="mp-mobile-nav-header">
          <Link to="/" className="brand" onClick={() => setMobileNavOpen(false)}>
            <span className="brand-mark">MP</span>
            <span className="brand-copy">
              <strong>Motiwala</strong>
              <small>Perfumes</small>
            </span>
          </Link>
          <button
            type="button"
            className="icon-button"
            onClick={() => setMobileNavOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mp-mobile-nav-links">
          <div className="mp-mobile-nav-section-label">Explore Catalog</div>
          <Link to="/shop" className="mp-mobile-nav-item" onClick={() => setMobileNavOpen(false)}>
            <span>Shop All Fragrances</span>
            <ChevronRight size={16} />
          </Link>
          <a href="#discover" className="mp-mobile-nav-item" onClick={() => setMobileNavOpen(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Sparkles size={16} style={{ color: 'var(--gold, #c6a56b)' }} />
              <span>AI Scent Concierge</span>
            </div>
            <ChevronRight size={16} />
          </a>
          <a href="#story" className="mp-mobile-nav-item" onClick={() => setMobileNavOpen(false)}>
            <span>Our Story & Heritage</span>
            <ChevronRight size={16} />
          </a>

          <div className="mp-mobile-nav-section-label">Admin Rights · AR Portal</div>
          <div className="mp-mobile-ar-card">
            <div className="mp-mobile-ar-header">
              <ShieldCheck size={18} style={{ color: 'var(--ar-green, #99c229)' }} />
              <div>
                <strong>AR Business Management</strong>
                <small>Formulation & Samples</small>
              </div>
            </div>
            <div className="mp-mobile-ar-links">
              <Link to="/ar/cno" className="mp-mobile-ar-item" onClick={() => setMobileNavOpen(false)}>
                <FlaskConical size={15} />
                <span>Chief Nose Officer (CNO) Form</span>
              </Link>
              <Link to="/ar/cno-list" className="mp-mobile-ar-item" onClick={() => setMobileNavOpen(false)}>
                <ListFilter size={15} />
                <span>CNO Sample Registry</span>
              </Link>
              <Link to="/ar/products" className="mp-mobile-ar-item" onClick={() => setMobileNavOpen(false)}>
                <Boxes size={15} />
                <span>Store Products Registry</span>
              </Link>
            </div>
          </div>

          <div className="mp-mobile-nav-section-label">Account & Operations</div>
          <Link to="/login" className="mp-mobile-nav-item" onClick={() => setMobileNavOpen(false)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserRound size={16} />
              <span>Customer Account / Sign In</span>
            </div>
            <ChevronRight size={16} />
          </Link>
        </nav>

        <div className="mp-mobile-nav-footer">
          <small>Motiwala Perfumes · Artisanal Luxury Since 1974</small>
        </div>
      </div>
    </>
  );
}
