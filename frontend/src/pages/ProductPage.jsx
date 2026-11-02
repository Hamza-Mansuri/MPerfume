import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Heart,
  Leaf,
  Minus,
  Plus,
  ShieldCheck,
  Sparkles,
  Layers,
  Clock,
  Wind,
} from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { demoProducts, ATTAR_IMAGES, PERFUME_IMAGES } from '../data/products.js';
import { getProduct } from '../lib/api.js';

export default function ProductPage() {
  const { slug } = useParams();
  const local = useMemo(() => demoProducts.find((p) => p.slug === slug), [slug]);
  const [remote, setRemote] = useState(null);
  const [loading, setLoading] = useState(!local);
  const [qty, setQty] = useState(1);
  const [activePhoto, setActivePhoto] = useState(0);
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState('Notes');

  const product = local || remote;

  useEffect(() => {
    setActivePhoto(0);
    setQty(1);
    setRemote(null);
    setLoading(!local);
    if (local) return;
    let alive = true;
    getProduct(slug)
      .then((p) => {
        if (alive) setRemote(p);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [slug, local]);

  const gallery = useMemo(() => {
    if (!product) return [];
    if (product.type === 'Attar') {
      const extraAttars = ATTAR_IMAGES.filter((x) => x !== product.image).slice(0, 3);
      return [product.image, ...extraAttars];
    }
    const extraPerfumes = PERFUME_IMAGES.filter((x) => x !== product.image).slice(0, 3);
    return [product.image, ...extraPerfumes];
  }, [product]);

  const related = useMemo(
    () =>
      !product
        ? []
        : demoProducts
            .filter(
              (p) =>
                p.slug !== product.slug &&
                p.type === product.type &&
                p.family.split(' • ')[0] === product.family.split(' • ')[0]
            )
            .slice(0, 4),
    [product]
  );

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#faf7f2' }}>
        <Header />
        <main className="shell pdp-shell">
          <div className="pdp-skeleton">
            <div className="pdp-skeleton-image" />
            <div className="pdp-skeleton-info">
              {[30, 65, 45, 90, 75, 80].map((n, i) => (
                <span key={i} style={{ width: n + '%' }} />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ minHeight: '100vh', background: '#faf7f2' }}>
        <Header />
        <main className="shell pdp-not-found" style={{ textAlign: 'center', padding: '100px 0' }}>
          <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Fragrance Creation Not Found</h1>
          <p style={{ color: '#786d60' }}>The requested formulation could not be located in our catalog.</p>
          <Link to="/shop" className="primary-btn" style={{ textDecoration: 'none' }}>
            Return to Collection
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const notes = product.notes || [];
  const hierarchy = product.topNotes
    ? { Top: product.topNotes, Heart: product.heartNotes || [], Base: product.baseNotes || [] }
    : { Top: notes.slice(0, 1), Heart: notes.slice(1, 3), Base: notes.slice(3) };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf7f2' }}>
      <Header />

      <main className="shell pdp-shell" style={{ flex: 1 }}>
        {/* Breadcrumb */}
        <nav className="pdp-breadcrumb" aria-label="Breadcrumb">
          <Link to="/shop">
            <ArrowLeft size={15} /> Collection
          </Link>
          <span>/</span>
          <Link to="/shop">{product.type}s</Link>
          <span>/</span>
          <span style={{ color: '#1a140e', fontWeight: 600 }}>{product.name}</span>
        </nav>

        {/* PDP Main Grid */}
        <section className="pdp-grid">
          {/* Gallery */}
          <div className="pdp-gallery">
            <div className="pdp-main-image">
              <img
                src={gallery[activePhoto]}
                alt={activePhoto === 0 ? product.name : 'Editorial attar photography'}
                fetchPriority={activePhoto === 0 ? 'high' : 'auto'}
                onError={() => {
                  if (activePhoto > 0) setActivePhoto(0);
                }}
              />
              <span className="pdp-image-chip">
                {activePhoto === 0 ? 'Haute Artisanal Presentation' : 'Artisanal Oil Flacon'}
              </span>
              {gallery.length > 1 && (
                <div className="pdp-photo-arrows">
                  <button
                    aria-label="Previous image"
                    onClick={() => setActivePhoto((n) => (n + gallery.length - 1) % gallery.length)}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    aria-label="Next image"
                    onClick={() => setActivePhoto((n) => (n + 1) % gallery.length)}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>

            {/* Thumbnail carousel */}
            {gallery.length > 1 && (
              <div className="pdp-thumbnails">
                {gallery.map((src, i) => (
                  <button
                    key={src}
                    className={activePhoto === i ? 'active' : ''}
                    onClick={() => setActivePhoto(i)}
                    aria-label={'View image ' + (i + 1)}
                    aria-pressed={activePhoto === i}
                  >
                    <img src={src} alt="" loading={i === 0 ? 'eager' : 'lazy'} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="pdp-information">
            <div className="pdp-micro">
              <span>{product.type === 'Attar' ? 'TRADITIONAL PURE OIL CONCENTRATE' : 'EAU DE PARFUM HAUTE EDITION'}</span>
              <span>·</span>
              <span style={{ color: 'var(--ar-green, #99c229)' }}>{product.family}</span>
            </div>

            <h1>{product.name}</h1>
            <p className="pdp-lead">{product.description}</p>

            <div className="pdp-price">
              ₹{Number(product.price).toLocaleString('en-IN')}{' '}
              <span> / {product.size} Handcrafted Flacon</span>
            </div>

            <div className="pdp-line" />

            <div className="pdp-detail-label">SIGNATURE OLFACTORY ACCORDS</div>
            <div className="pdp-tags">
              {notes.map((n) => (
                <span key={n}>✦ {n}</span>
              ))}
            </div>

            <div className="pdp-facts">
              <div>
                <span>Olfactory Family</span>
                <strong>{product.family}</strong>
              </div>
              <div>
                <span>Sillage Projection</span>
                <strong>{product.sillage || 'Radiant (10–12ft Aura)'}</strong>
              </div>
              <div>
                <span>Longevity Chronometry</span>
                <strong>{product.longevity || '12h+ All-Day Sillage'}</strong>
              </div>
            </div>

            <div className="pdp-line" />

            <div className="pdp-order">
              <div className="pdp-quantity">
                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">
                  <Minus size={16} />
                </button>
                <strong>{qty}</strong>
                <button onClick={() => setQty((q) => Math.min(10, q + 1))} aria-label="Increase quantity">
                  <Plus size={16} />
                </button>
              </div>

              <button
                className="pdp-disabled-buy"
                disabled
                title="Bespoke order system pending owner activation"
              >
                <span>Curated Showcase · Ordering Opens Soon</span>
                <ArrowRight size={17} />
              </button>

              <button
                className={'pdp-heart ' + (saved ? 'saved' : '')}
                onClick={() => setSaved((s) => !s)}
                aria-label={saved ? 'Remove from shortlist' : 'Save to shortlist'}
                aria-pressed={saved}
              >
                <Heart size={20} fill={saved ? 'currentColor' : 'none'} />
              </button>
            </div>

            <p className="pdp-honesty">
              <ShieldCheck size={15} />
              Authentic Motiwala fragrance heritage. Pure non-alcoholic attars and aged essential accords.
            </p>
          </div>
        </section>

        {/* Note Pyramid Story Section */}
        <section className="pdp-story">
          <div className="pdp-story-header">
            <p className="eyebrow">The Olfactory Architecture</p>
            <h2>Every Note Tells an Eternal Story.</h2>
            <p>Explore the three progressive stages of this formulation drydown.</p>
          </div>

          <div className="pdp-tabs" role="tablist">
            {['Notes', 'Details', 'About Attars'].map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                className={tab === t ? 'active' : ''}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'Notes' && (
            <div className="pdp-note-pyramid">
              {Object.entries(hierarchy).map(([stage, values], i) => (
                <div key={stage} style={{ border: '1px solid rgba(198, 165, 107, 0.35)', background: '#fffdfb' }}>
                  <span className="pdp-note-number">0{i + 1}</span>
                  <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{stage} Notes</h3>
                  <p>{values.length ? values.join(' · ') : 'Not listed'}</p>
                  <small>
                    {stage === 'Top'
                      ? 'The first 15–30 minutes: sparkling head notes'
                      : stage === 'Heart'
                      ? 'Hours 1–4: the aromatic soul and character'
                      : 'Hours 4–24+: the lingering royal foundation'}
                  </small>
                </div>
              ))}
            </div>
          )}

          {tab === 'Details' && (
            <div className="pdp-story-body">
              <p>{product.description}</p>
              <p>
                Format: <strong>{product.type}</strong> · Size: <strong>{product.size}</strong> ·
                Olfactory Family: <strong>{product.family}</strong>.
              </p>
            </div>
          )}

          {tab === 'About Attars' && (
            <div className="pdp-story-body">
              <Leaf size={24} style={{ color: 'var(--ar-green, #99c229)', margin: '0 auto 12px', display: 'block' }} />
              <p>
                Attar is traditionally distilled in copper stills (Deg and Bhapka) over slow wood fires, capturing the ethereal soul of botanical flowers, rare woods, and royal ambergris into pure sandalwood oil. Free of synthetic alcohol, attar blooms with your body heat into a deeply intimate, lingering aura.
              </p>
            </div>
          )}
        </section>

        {/* Related Fragrances */}
        {related.length > 0 && (
          <section className="pdp-related" style={{ marginTop: '70px' }}>
            <div className="section-head">
              <div>
                <p className="eyebrow">Harmonious Scents</p>
                <h2>Explore Related Creations.</h2>
              </div>
              <Link to="/shop">
                Browse collection <ArrowRight size={17} />
              </Link>
            </div>
            <div className="pdp-related-grid">
              {related.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
