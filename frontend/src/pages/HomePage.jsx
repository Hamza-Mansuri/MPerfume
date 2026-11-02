import React from 'react';
import { ArrowRight, Sparkles, ShieldCheck, Truck, FlaskConical, Award, Gem, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import ProductCarousel from '../components/ProductCarousel.jsx';
import ScentConcierge from '../components/ScentConcierge.jsx';
import Footer from '../components/Footer.jsx';
import { demoProducts } from '../data/products.js';

export default function HomePage() {
  return (
    <div>
      <div className="hero-wrap">
        <Header />
        <section className="hero shell">
          <div className="hero-copy">
            <p className="eyebrow">Motiwala · Fragrance discovery</p>
            <h1>
              Find the scent<br />
              that feels <em>like you.</em>
            </h1>
            <p className="hero-text">
              Explore artisanal attars and master perfumes by scent family, rare ingredients, and personal aura. Your bespoke fragrance journey, made beautifully simple.
            </p>
            <div className="hero-actions">
              <a href="#scent-concierge" className="primary-btn">
                <Sparkles size={17} /> Find my scent
              </a>
              <Link to="/shop" className="secondary-btn">
                Explore collection <ArrowRight size={16} />
              </Link>
            </div>
            <div className="trust-row">
              <span>
                <ShieldCheck size={16} /> Royal Scent Families
              </span>
              <span>
                <Truck size={16} /> Pure Attar & Eau de Parfum
              </span>
              <span>
                <FlaskConical size={16} /> Master Olfactory Notes
              </span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-card">
              <img
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=90"
                alt="Luxury perfume bottle"
              />
              <div className="floating-note note-one">
                <small>Signature note</small>
                <strong>Oud Al-Malaki</strong>
                <span>Smoky · woody · royal</span>
              </div>
              <div className="floating-note note-two">
                <small>Scent direction</small>
                <strong>Bulgarian Rose</strong>
                <span>Velvety · floral · radiant</span>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Heavenly Olfactory Accord Ribbon */}
      <div
        style={{
          background: 'linear-gradient(135deg, #181410 0%, #282017 100%)',
          color: '#e8dcce',
          padding: '13px 0',
          borderTop: '1px solid rgba(198, 165, 107, 0.35)',
          borderBottom: '1px solid rgba(198, 165, 107, 0.35)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          fontSize: '11.5px',
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          textAlign: 'center',
        }}
      >
        <div style={{ display: 'inline-flex', gap: '28px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <span>✦ Pure Royal Dehn Al Oud</span>
          <span>✦ French Grasse Lavender</span>
          <span>✦ Turkish Damask Rose</span>
          <span>✦ Royal Ambergris Sillage</span>
          <span>✦ Creamy Mysore Sandalwood</span>
          <span>✦ Bourbon Vanilla Absolue</span>
          <span>✦ Sparkling Calabrian Bergamot</span>
          <span>✦ Royal Arabian Saffron</span>
          <span>✦ Somalian Frankincense</span>
        </div>
      </div>

      <section className="shell featured-section">
        <div className="section-head">
          <div>
            <p className="eyebrow">Most loved</p>
            <h2>Fragrances with presence.</h2>
          </div>
          <Link to="/shop">
            View all <ArrowRight size={16} />
          </Link>
        </div>
        <ProductCarousel products={demoProducts.slice(0, 5)} />
      </section>

      <ScentConcierge />

      <section className="story-section" id="story">
        <div className="shell story-grid">
          <div className="story-image">
            <img
              src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85"
              alt="Perfume bottle on fabric"
            />
          </div>
          <div className="story-copy">
            <p className="eyebrow">Motiwala philosophy</p>
            <h2>A fragrance should feel personal before it feels premium.</h2>
            <p>
              We’re building a digital scent counter that understands ingredients, families, moods, and combinations — so discovering attar online feels closer to speaking with someone who actually knows fragrance.
            </p>
            <div className="story-stats">
              <div>
                <strong>80+</strong>
                <span>Fragrance notes explored</span>
              </div>
              <div>
                <strong>Catalog</strong>
                <span>Grounded matches</span>
              </div>
              <div>
                <strong>24/7</strong>
                <span>Discovery assistant</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
