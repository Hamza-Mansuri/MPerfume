import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, ArrowRight, Lock, Mail, User, FlaskConical } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Concept login demo notification
    alert(`${mode === 'login' ? 'Signed in as' : 'Account created for'} ${email || 'Client'}`);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf7f2' }}>
      <Header />
      <main className="auth-page shell" style={{ flex: 1, padding: '40px 0' }}>
        <div
          className="auth-card"
          style={{
            background: '#ffffff',
            borderRadius: '24px',
            border: '1px solid rgba(198, 165, 107, 0.3)',
            boxShadow: '0 25px 60px -15px rgba(50, 35, 20, 0.1)',
            padding: '38px',
            maxWidth: '480px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle gold accent aura */}
          <div
            style={{
              position: 'absolute',
              top: '-35px',
              right: '-35px',
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(198, 165, 107, 0.25) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 12px',
                borderRadius: '999px',
                background: 'rgba(198, 165, 107, 0.12)',
                border: '1px solid rgba(198, 165, 107, 0.35)',
                color: '#8c6f3d',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                marginBottom: '12px',
              }}
            >
              <Sparkles size={12} />
              <span>Motiwala Private Salon</span>
            </span>
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '32px',
                color: '#1a140e',
                margin: '0 0 8px',
                lineHeight: 1.15,
              }}
            >
              {mode === 'login' ? 'Welcome to the Sanctuary' : 'Join the Perfumery Circle'}
            </h1>
            <p style={{ color: '#786d60', fontSize: '13.5px', margin: 0, lineHeight: 1.5 }}>
              {mode === 'login'
                ? 'Sign in to access your curated olfactive shortlist and bespoke fragrances.'
                : 'Create an account to save fragrance harmonies and bespoke formulation notes.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6e6255', marginBottom: '6px' }}>
                  Full Name
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a09485' }} />
                  <input
                    type="text"
                    required
                    placeholder="Master Perfumer / Client Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 40px',
                      borderRadius: '12px',
                      border: '1px solid #e2d7c7',
                      background: '#fffdfb',
                      fontSize: '13.5px',
                      color: '#1a140e',
                      outlineColor: '#c6a56b',
                    }}
                  />
                </div>
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6e6255', marginBottom: '6px' }}>
                Email Address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a09485' }} />
                <input
                  type="email"
                  required
                  placeholder="name@motiwalaperfumes.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: '12px',
                    border: '1px solid #e2d7c7',
                    background: '#fffdfb',
                    fontSize: '13.5px',
                    color: '#1a140e',
                    outlineColor: '#c6a56b',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#6e6255', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#a09485' }} />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 40px',
                    borderRadius: '12px',
                    border: '1px solid #e2d7c7',
                    background: '#fffdfb',
                    fontSize: '13.5px',
                    color: '#1a140e',
                    outlineColor: '#c6a56b',
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '10px',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'linear-gradient(135deg, #241d16 0%, #17120c 100%)',
                color: '#fffef9',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 20px rgba(23, 18, 12, 0.25)',
                transition: 'all 0.18s ease',
              }}
            >
              <span>{mode === 'login' ? 'Enter Sanctuary' : 'Create Exclusive Account'}</span>
              <ArrowRight size={16} />
            </button>

            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#8c6f3d',
                fontSize: '12.5px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '6px 0',
                marginTop: '4px',
              }}
            >
              {mode === 'login'
                ? 'New to Motiwala? Join the private circle'
                : 'Already an exclusive member? Sign in here'}
            </button>
          </form>

          {/* AR Portal Link */}
          <div
            style={{
              marginTop: '26px',
              paddingTop: '18px',
              borderTop: '1px solid #f0e6d8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FlaskConical size={16} style={{ color: 'var(--ar-green, #99c229)' }} />
              <span style={{ fontSize: '12px', color: '#6e6255', fontWeight: 600 }}>Chief Nose Officer & Admin?</span>
            </div>
            <Link
              to="/ar/cno"
              style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#365314',
                background: 'rgba(153, 194, 41, 0.14)',
                padding: '4px 10px',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
            >
              Access AR Portal →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
