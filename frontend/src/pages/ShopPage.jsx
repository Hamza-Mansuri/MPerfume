import React, { useMemo, useState, useEffect } from 'react';
import { Search, Sparkles, Filter, X, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, SlidersHorizontal } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { demoProducts, fragranceNoteLibrary } from '../data/products.js';

export default function ShopPage() {
  const [type, setType] = useState('All');
  const [query, setQuery] = useState('');
  const [family, setFamily] = useState('All');
  const [note, setNote] = useState('All');
  const [sort, setSort] = useState('recommended');
  const [page, setPage] = useState(1);

  const families = useMemo(
    () => [...new Set(demoProducts.map((p) => p.family.split(' • ')[0]))].sort(),
    []
  );

  const products = useMemo(() => {
    let items = demoProducts.filter(
      (p) =>
        (type === 'All' || p.type === type) &&
        (family === 'All' || p.family.includes(family)) &&
        (note === 'All' || p.notes.some((n) => n.toLowerCase() === note.toLowerCase())) &&
        [p.name, p.type, p.family, p.description, ...(p.notes || [])]
          .join(' ')
          .toLowerCase()
          .includes(query.trim().toLowerCase())
    );

    if (sort === 'price-low') items.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') items.sort((a, b) => b.price - a.price);
    if (sort === 'name') items.sort((a, b) => a.name.localeCompare(b.name));
    return items;
  }, [type, query, family, note, sort]);

  useEffect(() => setPage(1), [type, query, family, note, sort]);

  // Exactly 2 lines of 3 products = 6 products per page
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
  const isFiltered = type !== 'All' || query !== '' || family !== 'All' || note !== 'All';

  // Smart page numbers array for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push('...');
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (page < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    const targetEl = document.getElementById('product-results');
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 340, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#faf7f2' }}>
      <div className="catalog-header">
        <Header />
      </div>

      <main className="shell shop-page shop-v4" style={{ flex: 1, paddingBottom: '80px' }}>
        {/* Intro */}
        <div className="shop-intro" style={{ marginBottom: '28px' }}>
          <div>
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
                marginBottom: '10px',
              }}
            >
              <Sparkles size={12} />
              <span>Haute Parfumerie Treasury</span>
            </span>
            <h1 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '42px', margin: '0 0 8px', color: '#1a140e' }}>
              A World of Scent, <em>Made Personal.</em>
            </h1>
            <p style={{ color: '#786d60', fontSize: '15px', margin: 0, maxWidth: '600px', lineHeight: 1.6 }}>
              Explore artisanal attars distilled in small batches alongside Eau de Parfum creations. Discover by signature accord, olfactive family, or noble ingredients.
            </p>
          </div>
          <div className="shop-count">
            <strong style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#1a140e' }}>
              {products.length}
            </strong>
            <span>master creations found</span>
          </div>
        </div>

        {/* Product Type Segment */}
        <div className="type-segment" role="group" aria-label="Choose product type" style={{ margin: '20px 0' }}>
          {[
            { id: 'All', label: 'All Fragrances' },
            { id: 'Attar', label: 'Pure Attar · Oil Concentrates' },
            { id: 'Perfume', label: 'Eau de Parfum · Fine Sprays' },
          ].map((t) => (
            <button
              key={t.id}
              className={type === t.id ? 'active' : ''}
              onClick={() => setType(t.id)}
              style={{ transition: 'all 0.18s ease' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filter Bar */}
        <div
          className="shop-filters"
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #ebdcd0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
            padding: '18px 20px',
            marginBottom: '20px',
          }}
        >
          <label>
            <span>Search Fragrance Or Notes</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. oud, damask rose, amber, vanilla..."
            />
          </label>
          <label>
            <span>Olfactory Family</span>
            <select value={family} onChange={(e) => setFamily(e.target.value)}>
              <option value="All">All Scent Families</option>
              {families.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Noble Note / Accord</span>
            <select value={note} onChange={(e) => setNote(e.target.value)}>
              <option value="All">All Noble Notes</option>
              {fragranceNoteLibrary.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Sort Hierarchy</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recommended">Curator's Recommendation</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </label>
        </div>

        {/* Toolbar with Results Count & Pagination Summary */}
        <div id="product-results" className="shop-toolbar" style={{ scrollMarginTop: '20px' }}>
          <span>
            Showing <strong>{products.length ? (page - 1) * pageSize + 1 : 0}–{Math.min(page * pageSize, products.length)}</strong> of <strong>{products.length}</strong> master creations (Page {page} of {totalPages})
          </span>
          {totalPages > 1 && (
            <div className="catalog-pagination top" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '7px 12px',
                  borderRadius: '999px',
                  border: '1px solid #d5c8b5',
                  background: '#ffffff',
                  color: page === 1 ? '#a89d91' : '#1e1b18',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                }}
              >
                <ChevronLeft size={14} />
                <span>Prev</span>
              </button>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#685c4f', minWidth: '60px', textAlign: 'center' }}>
                {page} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '7px 12px',
                  borderRadius: '999px',
                  border: '1px solid #d5c8b5',
                  background: '#ffffff',
                  color: page === totalPages ? '#a89d91' : '#1e1b18',
                  fontSize: '12.5px',
                  fontWeight: 600,
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                }}
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>

        <p className="catalog-disclaimer">
          Demonstration catalog: Concept names, fragrance profiles, notes and imagery represent the artisanal aesthetic of Motiwala Perfumes.
        </p>

        {/* Product Grid: 2 Lines of 3 Products = 6 items per page */}
        {products.length ? (
          <>
            <div
              className="product-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
                minHeight: '480px',
              }}
            >
              {products.slice((page - 1) * pageSize, page * pageSize).map((p) => (
                <ProductCard product={p} key={p.id} />
              ))}
            </div>

            {/* Haute Parfumerie Pagination Controls */}
            {totalPages > 1 && (
              <div
                className="catalog-pagination"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '8px',
                  flexWrap: 'wrap',
                  margin: '48px 0 24px',
                  padding: '16px 20px',
                  background: '#ffffff',
                  borderRadius: '999px',
                  border: '1px solid #ebdcd0',
                  boxShadow: '0 6px 20px rgba(0, 0, 0, 0.03)',
                  width: 'fit-content',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                <button
                  type="button"
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page === 1}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    border: '1px solid #d5c8b5',
                    background: '#ffffff',
                    color: page === 1 ? '#b8ad9e' : '#1a140e',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: page === 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  aria-label="Previous page"
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>

                <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  {getPageNumbers().map((pNum, idx) =>
                    pNum === '...' ? (
                      <span
                        key={`dots-${idx}`}
                        style={{
                          padding: '0 6px',
                          color: '#8c7e6d',
                          fontSize: '14px',
                          fontWeight: 700,
                        }}
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={pNum}
                        type="button"
                        onClick={() => handlePageChange(pNum)}
                        style={{
                          width: '36px',
                          height: '36px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: '50%',
                          border: page === pNum ? '1px solid #1a140e' : '1px solid #e2d7c7',
                          background: page === pNum ? '#1a140e' : '#ffffff',
                          color: page === pNum ? '#f4efe5' : '#4a4136',
                          fontSize: '13px',
                          fontWeight: page === pNum ? 700 : 500,
                          cursor: 'pointer',
                          boxShadow: page === pNum ? '0 4px 10px rgba(26, 20, 14, 0.2)' : 'none',
                          transition: 'all 0.15s ease',
                        }}
                        aria-label={`Page ${pNum}`}
                        aria-current={page === pNum ? 'page' : undefined}
                      >
                        {pNum}
                      </button>
                    )
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
                  disabled={page === totalPages}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 16px',
                    borderRadius: '999px',
                    border: '1px solid #d5c8b5',
                    background: '#ffffff',
                    color: page === totalPages ? '#b8ad9e' : '#1a140e',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: page === totalPages ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  aria-label="Next page"
                >
                  <span>Next</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="catalog-no-results" style={{ padding: '80px 20px', textAlign: 'center' }}>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: '28px' }}>
              No Matching Fragrances Found
            </h2>
            <p style={{ color: '#786d60', fontSize: '14px', maxWidth: '450px', margin: '8px auto 20px' }}>
              We could not find creations matching your active filters. Try exploring all fragrance families or reset the search query.
            </p>
            <button
              type="button"
              className="primary-btn"
              onClick={() => {
                setType('All');
                setQuery('');
                setFamily('All');
                setNote('All');
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
