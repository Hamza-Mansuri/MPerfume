import React from 'react';
import { Instagram, MessageCircle, ArrowUpRight, ShieldCheck, Sparkles, MapPin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" style={{ background: '#120f0c', borderTop: '1px solid rgba(198, 165, 107, 0.25)' }}>
      <div className="shell footer-grid">
        {/* Brand column */}
        <div>
          <div className="brand footer-brand">
            <span className="brand-mark" style={{ borderColor: 'rgba(198, 165, 107, 0.8)', color: '#f1d596' }}>
              MP
            </span>
            <span className="brand-copy">
              <strong style={{ color: '#fffef9', fontSize: '15px' }}>Motiwala</strong>
              <small style={{ color: 'var(--gold, #c6a56b)' }}>Perfumes & Attars</small>
            </span>
          </div>
          <p style={{ color: '#a79a8c', fontSize: '13px', lineHeight: 1.6, maxWidth: '290px', margin: '12px 0 16px' }}>
            Artisanal attar distillation and modern olfactory architecture. Handcrafted in small batches with rare botanicals and aged agarwood.
          </p>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#c6a56b', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            <Sparkles size={13} />
            <span>Master Perfumer Atelier · Est. 1974</span>
          </div>
        </div>

        {/* Explore Links */}
        <div>
          <p className="eyebrow" style={{ color: '#c6a56b' }}>Curated Treasury</p>
          <Link to="/shop">Artisanal Pure Attars</Link>
          <Link to="/shop">Eau de Parfum Sprays</Link>
          <Link to="/ai-discovery">AI Scent Concierge</Link>
          <Link to="/ar/cno" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: 'var(--ar-green, #99c229)' }}>
            <ShieldCheck size={13} />
            <span>AR Business Portal</span>
          </Link>
        </div>

        {/* Private Salon & Help */}
        <div>
          <p className="eyebrow" style={{ color: '#c6a56b' }}>Private Salon</p>
          <Link to="/login">Client Account</Link>
          <Link to="/ar/cno-list">CNO Formulation Registry</Link>
          <a href="#story">Our Heritage & Deg Craft</a>
          <a href="#">Bespoke Commission</a>
        </div>

        {/* Contact & Stay Connected */}
        <div>
          <p className="eyebrow" style={{ color: '#c6a56b' }}>Connect with Us</p>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link">
            <Instagram size={15} style={{ color: '#c6a56b' }} /> Instagram Concierge
          </a>
          <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="social-link">
            <MessageCircle size={15} style={{ color: '#25d366' }} /> WhatsApp Master Nose
          </a>
          <span style={{ fontSize: '12px', color: '#8f8274', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
            <MapPin size={13} style={{ color: '#c6a56b' }} /> Mumbai · Dubai · Grasse
          </span>
        </div>
      </div>

      <div className="shell footer-bottom" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
        <span style={{ color: '#8f8376' }}>© {new Date().getFullYear()} Motiwala Perfumes. All rights reserved.</span>
        <span style={{ color: '#c6a56b', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          Crafted for the modern fragrance connoisseur <ArrowUpRight size={14} />
        </span>
      </div>
    </footer>
  );
}
