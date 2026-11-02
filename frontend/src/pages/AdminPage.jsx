import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, FlaskConical, ListFilter, Boxes, ArrowRight, Plus, Search, ExternalLink } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { demoProducts } from '../data/products.js';

export default function AdminPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = demoProducts.filter((p) =>
    [p.name, p.type, p.family].join(' ').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf7f2' }}>
      <Header />
      <main className="shell admin-page" style={{ flex: 1, padding: '40px 0' }}>
        {/* AR PORTAL PROMINENT ATELIER BANNER */}
        <div
          style={{
            background: 'linear-gradient(135deg, #181410 0%, #2b231b 100%)',
            border: '1.5px solid rgba(198, 165, 107, 0.4)',
            borderRadius: '20px',
            padding: '24px 28px',
            color: '#fffef9',
            marginBottom: '32px',
            boxShadow: '0 20px 45px -10px rgba(50, 32, 14, 0.18)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '18px',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span
                style={{
                  background: 'rgba(153, 194, 41, 0.2)',
                  color: '#bbf447',
                  border: '1px solid #99c229',
                  borderRadius: '999px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                }}
              >
                <ShieldCheck size={12} />
                <span>Admin Rights · AR System</span>
              </span>
            </div>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '26px',
                margin: '0 0 6px',
                color: '#fffef9',
              }}
            >
              Chief Nose Officer Formulation & Laboratory Suite
            </h2>
            <p style={{ margin: 0, color: '#c5b9aa', fontSize: '13.5px', maxWidth: '620px', lineHeight: 1.5 }}>
              Register new supplier samples, evaluate scent longevity chronometry, perform AI scent pyramid matching, and download official PDF evaluation dossiers.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link
              to="/ar/cno"
              style={{
                background: 'linear-gradient(135deg, #8cb324 0%, #6e9415 100%)',
                color: '#ffffff',
                padding: '12px 20px',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '13.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                textDecoration: 'none',
                boxShadow: '0 4px 14px rgba(110, 148, 21, 0.4)',
              }}
            >
              <FlaskConical size={16} />
              <span>Launch CNO Studio</span>
              <ArrowRight size={15} />
            </Link>
            <Link
              to="/ar/cno-list"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#ffffff',
                padding: '12px 18px',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '13.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                textDecoration: 'none',
              }}
            >
              <ListFilter size={16} />
              <span>CNO Registry</span>
            </Link>
          </div>
        </div>

        {/* Catalog Control Header */}
        <div className="section-head" style={{ marginBottom: '20px' }}>
          <div>
            <p className="eyebrow">Catalog Administration</p>
            <h1>Store Catalog Inventory</h1>
          </div>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '260px' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9c8e80' }} />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '10px',
                  border: '1px solid #ddd2c4',
                  fontSize: '13px',
                  background: '#ffffff',
                }}
              />
            </div>
            <Link
              to="/ar/products"
              className="primary-btn"
              style={{ padding: '10px 18px', fontSize: '13px', textDecoration: 'none' }}
            >
              <Boxes size={15} />
              <span>Manage in AR Portal</span>
            </Link>
          </div>
        </div>

        {/* Admin Table */}
        <div className="admin-table" style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #ebdcd0', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
          <div className="admin-row admin-head" style={{ background: '#faf6f0', padding: '14px 20px', borderBottom: '1px solid #ebdcd0', fontWeight: 800 }}>
            <span>Product</span>
            <span>Type & Family</span>
            <span>Price (INR)</span>
            <span>Status</span>
          </div>
          {filtered.map((p) => (
            <div className="admin-row" key={p.id} style={{ padding: '14px 20px', borderBottom: '1px solid #f5ede4', alignItems: 'center' }}>
              <span className="admin-product" style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img
                  src={p.image}
                  alt={p.name}
                  style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', background: '#f5efe6' }}
                />
                <div>
                  <strong style={{ fontSize: '14px', color: '#1a140e', display: 'block' }}>{p.name}</strong>
                  <small style={{ color: '#8c7e70', fontSize: '11px' }}>{p.size}</small>
                </div>
              </span>
              <div>
                <span style={{ fontWeight: 600, fontSize: '13px' }}>{p.type}</span>
                <small style={{ display: 'block', color: '#8c7e70', fontSize: '11px' }}>{p.family}</small>
              </div>
              <strong style={{ fontSize: '14px', color: '#1a140e' }}>₹{p.price.toLocaleString('en-IN')}</strong>
              <div>
                <span
                  style={{
                    background: 'rgba(153, 194, 41, 0.15)',
                    color: '#365314',
                    border: '1px solid rgba(153, 194, 41, 0.35)',
                    borderRadius: '999px',
                    padding: '3px 10px',
                    fontSize: '11px',
                    fontWeight: 700,
                  }}
                >
                  Active Inventory
                </span>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
