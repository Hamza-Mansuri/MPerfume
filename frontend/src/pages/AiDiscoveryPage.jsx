import React, { useEffect } from 'react';
import { Sparkles, ShieldCheck, ArrowRight, FlaskConical, Award, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ScentConcierge from '../components/ScentConcierge.jsx';

export default function AiDiscoveryPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf7f2' }}>
      {/* Header with Dark Hero Backdrop */}
      <div
        style={{
          background: 'radial-gradient(circle at 72% 30%, #302417 0, #17120c 34%, #0c0a08 75%)',
          color: '#f4efe5',
          borderBottom: '1px solid rgba(198, 165, 107, 0.25)',
        }}
      >
        <Header />

        {/* AI Discovery Hero */}
        <section className="shell" style={{ padding: '60px 0 80px', textAlign: 'center' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 16px',
                borderRadius: 999,
                background: 'rgba(198, 165, 107, 0.15)',
                border: '1px solid rgba(198, 165, 107, 0.4)',
                color: '#e2c58c',
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: 20,
              }}
            >
              <Sparkles size={14} style={{ color: '#e2c58c' }} />
              <span>Intelligent Scent Discovery & Concierge</span>
            </span>

            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: 'clamp(38px, 5.5vw, 64px)',
                lineHeight: 1.05,
                fontWeight: 600,
                margin: '0 0 20px',
                color: '#ffffff',
              }}
            >
              Your Olfactory Signature,<br />
              <em style={{ color: '#e2c58c', fontStyle: 'italic' }}>Artfully Understood.</em>
            </h1>

            <p
              style={{
                fontSize: '17px',
                lineHeight: 1.7,
                color: '#c9c0b4',
                margin: '0 auto 32px',
                maxWidth: 620,
              }}
            >
              Explore the artistry behind perfumery. Select your desired aura, blend royal notes,
              or describe a memory — our AI concierge reveals your closest matches from the Motiwala private catalog.
            </p>

            <div
              style={{
                display: 'flex',
                gap: 16,
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <a
                href="#scent-concierge"
                className="primary-btn"
                style={{ padding: '14px 26px', fontSize: 14 }}
              >
                <Sparkles size={16} />
                <span>Start Note Formulation</span>
              </a>
              <Link
                to="/shop"
                className="secondary-btn"
                style={{ padding: '14px 24px', fontSize: 14 }}
              >
                <span>Browse Full Treasury</span>
                <ArrowRight size={15} />
              </Link>
            </div>

            {/* Trust Badges */}
            <div
              style={{
                display: 'flex',
                gap: 28,
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: 40,
                fontSize: 12.5,
                color: '#9b9083',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <ShieldCheck size={16} style={{ color: '#c6a56b' }} />
                <span>80+ Noble Olfactory Notes</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <FlaskConical size={16} style={{ color: '#c6a56b' }} />
                <span>Pure Attar & Eau de Parfum</span>
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <Compass size={16} style={{ color: '#c6a56b' }} />
                <span>Personalized Accord Harmony</span>
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Accord Banner Ribbon */}
      <div
        style={{
          background: 'linear-gradient(135deg, #181410 0%, #282017 100%)',
          color: '#e8dcce',
          padding: '12px 0',
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
          <span>✦ Intelligent Note Pyramid</span>
          <span>✦ Pure Royal Dehn Al Oud</span>
          <span>✦ Taif Rose Essence</span>
          <span>✦ Ambergris Sillage</span>
          <span>✦ Mysore Sandalwood</span>
          <span>✦ Madagascar Vanilla</span>
          <span>✦ Master Formulation Evaluation</span>
        </div>
      </div>

      {/* Main Interactive AI Concierge Engine */}
      <main style={{ flex: 1, padding: '40px 0 60px' }}>
        <ScentConcierge />

        {/* Bridge to AR Chief Nose Officer Portal */}
        <section className="shell" style={{ marginTop: 60, marginBottom: 20 }}>
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #ebdcd0',
              borderRadius: 24,
              padding: '36px 32px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 24,
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.04)',
            }}
          >
            <div style={{ maxWidth: 640 }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: 'var(--ar-green-light, #f0fdf4)',
                  color: 'var(--ar-green-dark, #166534)',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                <FlaskConical size={13} />
                <span>Atelier Master Nose Laboratory</span>
              </span>
              <h3
                style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 26,
                  margin: '0 0 8px',
                  color: '#1a140e',
                }}
              >
                Chief Nose Officer (CNO) Formulation Portal
              </h3>
              <p style={{ margin: 0, color: '#786d60', fontSize: 14, lineHeight: 1.6 }}>
                Are you an atelier nose, fragrance supplier, or blending expert? Access the AR Laboratory
                to log supplier batches, examine olfactory accord pyramids, and manage technical distillation profiles.
              </p>
            </div>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/ar/cno" className="ar-btn-primary" style={{ textDecoration: 'none' }}>
                <FlaskConical size={16} />
                <span>Launch CNO Studio</span>
              </Link>
              <Link to="/ar/cno-list" className="ar-btn-secondary" style={{ textDecoration: 'none' }}>
                <span>View Sample Registry</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

