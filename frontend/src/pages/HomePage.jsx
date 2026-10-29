import { ArrowRight, Sparkles, ShieldCheck, Truck, FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import AIFragranceFinder from '../components/AIFragranceFinder.jsx';
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
            <p className="eyebrow">Attar heritage × modern intelligence</p>
            <h1>Find the scent<br/>that feels <em>like you.</em></h1>
            <p className="hero-text">Discover handcrafted attars and perfumes by note, mood, memory and occasion — with an AI-assisted fragrance guide built around our real collection.</p>
            <div className="hero-actions"><a href="#discover" className="primary-btn"><Sparkles size={17}/> Find my scent</a><Link to="/shop" className="secondary-btn">Explore collection <ArrowRight size={16}/></Link></div>
            <div className="trust-row"><span><ShieldCheck size={16}/> Authentic blends</span><span><Truck size={16}/> Pan-India delivery</span><span><FlaskConical size={16}/> Curated notes</span></div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-card">
              <img src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1400&q=90" alt="Luxury perfume bottle" />
              <div className="floating-note note-one"><small>Signature note</small><strong>Oud</strong><span>Smoky · woody · rich</span></div>
              <div className="floating-note note-two"><small>AI match</small><strong>96%</strong><span>Evening · formal · warm</span></div>
            </div>
          </div>
        </section>
      </div>

      <section className="shell featured-section">
        <div className="section-head"><div><p className="eyebrow">Most loved</p><h2>Fragrances with presence.</h2></div><Link to="/shop">View all <ArrowRight size={16}/></Link></div>
        <ProductCarousel products={demoProducts.slice(0, 5)} />
      </section>

      <ScentConcierge />
      <AIFragranceFinder />

      <section className="story-section" id="story">
        <div className="shell story-grid">
          <div className="story-image"><img src="https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85" alt="Perfume bottle on fabric"/></div>
          <div className="story-copy"><p className="eyebrow">Motiwala philosophy</p><h2>A fragrance should feel personal before it feels premium.</h2><p>We’re building a digital scent counter that understands ingredients, families, moods and combinations — so discovering attar online feels closer to speaking with someone who actually knows fragrance.</p><div className="story-stats"><div><strong>20+</strong><span>Scent notes mapped</span></div><div><strong>100%</strong><span>Catalog-backed recommendations</span></div><div><strong>24/7</strong><span>Discovery assistant</span></div></div></div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
