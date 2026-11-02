import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Boxes,
  Search,
  ExternalLink,
  FileSpreadsheet,
  Eye,
  Star,
  RotateCw,
  X,
  Layers,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { demoProducts } from '../../data/products.js';
import ArSelect from '../../components/ar/ArSelect.jsx';
import ArPagination from '../../components/ar/ArPagination.jsx';
import { exportCnoToExcel } from '../../utils/cnoExport.js';

export default function ArProductsPage() {
  const navigate = useNavigate();

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [familyFilter, setFamilyFilter] = useState('All');
  const [sortBy, setSortBy] = useState('recommended');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected product for modal view
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Extract unique families for filter dropdown
  const familyOptions = useMemo(() => {
    const set = new Set();
    demoProducts.forEach((p) => {
      if (p.family) {
        p.family.split('•').forEach((f) => set.add(f.trim()));
      }
    });
    return ['All', ...Array.from(set).sort()];
  }, []);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let items = demoProducts.filter((p) => {
      // Type filter
      if (typeFilter !== 'All' && p.type !== typeFilter) {
        return false;
      }

      // Family filter
      if (familyFilter !== 'All' && !p.family.toLowerCase().includes(familyFilter.toLowerCase())) {
        return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchFamily = (p.family || '').toLowerCase().includes(q);
        const matchType = (p.type || '').toLowerCase().includes(q);
        const matchDesc = (p.description || '').toLowerCase().includes(q);
        const matchNotes = (p.notes || []).some((n) => n.toLowerCase().includes(q));
        if (!matchName && !matchFamily && !matchType && !matchDesc && !matchNotes) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    if (sortBy === 'price-low') items.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') items.sort((a, b) => b.price - a.price);
    if (sortBy === 'rating') items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === 'name') items.sort((a, b) => a.name.localeCompare(b.name));

    return items;
  }, [searchTerm, typeFilter, familyFilter, sortBy]);

  // Reset page when filters change
  const handleFilterChange = (setter, val) => {
    setter(val);
    setCurrentPage(1);
  };

  const isFiltered = searchTerm.trim() !== '' || typeFilter !== 'All' || familyFilter !== 'All' || sortBy !== 'recommended';

  const handleClearFilters = () => {
    setSearchTerm('');
    setTypeFilter('All');
    setFamilyFilter('All');
    setSortBy('recommended');
    setCurrentPage(1);
  };

  // Slice for pagination
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize]);

  // Export to Excel
  const handleExportExcel = () => {
    const rows = filteredProducts.map((p) => ({
      ID: p.id,
      Name: p.name,
      Type: p.type,
      Price: `₹${p.price}`,
      Size: p.size,
      Family: p.family,
      Notes: (p.notes || []).join(', '),
      Rating: p.rating || 'N/A',
      Longevity: p.longevity || 'N/A',
      Projection: p.projection || 'N/A',
      Description: p.description || '',
    }));
    exportCnoToExcel(rows, `Motiwala_Store_Products_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div>
      {/* Header */}
      <div className="ar-page-header">
        <div>
          <h1>
            <Boxes size={24} style={{ color: 'var(--ar-green)' }} />
            <span>Store Products Registry</span>
          </h1>
          <p>
            Commercial store catalog with separate URL routing, live reactive filters, and custom pagination.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="ar-btn-secondary"
            onClick={handleExportExcel}
            disabled={!filteredProducts.length}
            title="Download products as Excel (.xlsx)"
          >
            <FileSpreadsheet size={16} style={{ color: '#16a34a' }} />
            <span>Export Excel ({filteredProducts.length})</span>
          </button>

          <Link
            to="/shop"
            target="_blank"
            className="ar-btn-primary"
            style={{ textDecoration: 'none' }}
          >
            <ExternalLink size={15} />
            <span>View Public Storefront</span>
          </Link>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="ar-table-container">
        {/* Filter Bar */}
        <div className="ar-filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 260 }}>
            <div className="ar-search-box" style={{ flex: 1 }}>
              <Search size={16} className="ar-search-icon" />
              <input
                type="text"
                className="ar-input"
                placeholder="Search products by title, ingredient, family..."
                value={searchTerm}
                onChange={(e) => handleFilterChange(setSearchTerm, e.target.value)}
              />
            </div>

            {/* Rows selector shifted beside search filter */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              <span style={{ fontSize: '12.5px', fontWeight: 600, color: '#64748b', whiteSpace: 'nowrap' }}>
                Rows:
              </span>
              <ArSelect
                value={String(pageSize)}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                options={[
                  { label: '5', value: '5' },
                  { label: '10', value: '10' },
                  { label: '25', value: '25' },
                  { label: '50', value: '50' },
                ]}
                width={70}
                minWidth={70}
                searchable={false}
              />
            </div>
          </div>

          <div className="ar-filter-actions">
            {/* Type Filter */}
            <ArSelect
              value={typeFilter}
              onChange={(e) => handleFilterChange(setTypeFilter, e.target.value)}
              options={[
                { label: 'All Types', value: 'All' },
                { label: 'Attars (Oil)', value: 'Attar' },
                { label: 'Perfumes (Spray)', value: 'Perfume' },
              ]}
              width={140}
              searchable={false}
            />

            {/* Fragrance Family Filter */}
            <ArSelect
              value={familyFilter}
              onChange={(e) => handleFilterChange(setFamilyFilter, e.target.value)}
              options={familyOptions.map((f) => ({
                label: f === 'All' ? 'All Families' : f,
                value: f,
              }))}
              width={150}
              searchable={true}
            />

            {/* Sort Filter */}
            <ArSelect
              value={sortBy}
              onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
              options={[
                { label: 'Recommended', value: 'recommended' },
                { label: 'Price: Low to High', value: 'price-low' },
                { label: 'Price: High to Low', value: 'price-high' },
                { label: 'Rating: High to Low', value: 'rating' },
                { label: 'Name: A to Z', value: 'name' },
              ]}
              width={160}
              searchable={false}
            />

            {/* Clear Filters */}
            {isFiltered && (
              <button
                type="button"
                className="ar-btn-secondary"
                onClick={handleClearFilters}
                style={{
                  padding: '7px 11px',
                  fontSize: 12,
                  color: '#e11d48',
                  borderColor: '#fecdd3',
                  background: '#fff1f2',
                }}
                title="Reset all filters"
              >
                <X size={13} />
                <span>Clear</span>
              </button>
            )}

            <span
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: 'var(--ar-text-muted)',
                whiteSpace: 'nowrap',
              }}
            >
              {filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Products Table */}
        <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
          <table className="ar-table">
            <thead>
              <tr>
                <th style={{ width: 60 }}>Item</th>
                <th>Product Name & Type</th>
                <th>Fragrance Family</th>
                <th>Key Olfactory Notes</th>
                <th>Size</th>
                <th>Price</th>
                <th>Longevity</th>
                <th>Rating</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '50px 0' }}>
                    <Boxes
                      size={36}
                      style={{ color: 'var(--ar-text-sub)', margin: '0 auto 10px', display: 'block' }}
                    />
                    <strong style={{ display: 'block', fontSize: 14, color: 'var(--ar-text-main)' }}>
                      No Store Products Found
                    </strong>
                    <p style={{ margin: '4px 0 14px', fontSize: 12.5, color: 'var(--ar-text-muted)' }}>
                      Try adjusting your search query or fragrance family filter.
                    </p>
                    <button
                      type="button"
                      className="ar-btn-secondary"
                      onClick={handleClearFilters}
                      style={{ margin: '0 auto' }}
                    >
                      Clear All Filters
                    </button>
                  </td>
                </tr>
              ) : (
                paginatedProducts.map((p) => (
                  <tr key={p.id}>
                    {/* Thumbnail */}
                    <td>
                      <div
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 8,
                          overflow: 'hidden',
                          border: '1px solid var(--ar-border)',
                          backgroundColor: '#f8fafc',
                        }}
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          loading="lazy"
                        />
                      </div>
                    </td>

                    {/* Product Name & Type */}
                    <td>
                      <strong style={{ display: 'block', color: 'var(--ar-text-main)', fontSize: 13.5 }}>
                        {p.name}
                      </strong>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 7px',
                          borderRadius: 999,
                          fontSize: 10.5,
                          fontWeight: 700,
                          marginTop: 3,
                          background: p.type === 'Attar' ? '#fef3c7' : '#e0f2fe',
                          color: p.type === 'Attar' ? '#92400e' : '#0369a1',
                        }}
                      >
                        {p.type}
                      </span>
                    </td>

                    {/* Family */}
                    <td>
                      <span style={{ fontSize: 12.5, color: '#334155', fontWeight: 600 }}>
                        {p.family}
                      </span>
                    </td>

                    {/* Notes */}
                    <td style={{ maxWidth: 220 }}>
                      {(p.notes || []).map((n) => (
                        <span key={n} className="ar-format-pill">
                          {n}
                        </span>
                      ))}
                    </td>

                    {/* Size */}
                    <td>
                      <span style={{ fontSize: 12.5, color: '#64748b', fontWeight: 600 }}>
                        {p.size}
                      </span>
                    </td>

                    {/* Price */}
                    <td>
                      <strong style={{ fontSize: 14, color: '#0f172a' }}>
                        ₹{p.price.toLocaleString('en-IN')}
                      </strong>
                    </td>

                    {/* Longevity */}
                    <td>
                      <span style={{ fontSize: 12, color: 'var(--ar-green)', fontWeight: 700 }}>
                        {p.longevity || '8–10 hrs'}
                      </span>
                    </td>

                    {/* Rating */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Star size={13} fill="#f59e0b" color="#f59e0b" />
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: '#0f172a' }}>
                          {p.rating || 4.8}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="ar-action-btn-group" style={{ justifyContent: 'center' }}>
                        <button
                          type="button"
                          className="ar-icon-action"
                          title="View Product Dossier"
                          onClick={() => setSelectedProduct(p)}
                        >
                          <Eye size={15} />
                        </button>

                        <Link
                          to={`/product/${p.slug}`}
                          target="_blank"
                          className="ar-icon-action"
                          title="Open Storefront Page"
                          style={{ textDecoration: 'none' }}
                        >
                          <ArrowUpRight size={15} style={{ color: 'var(--ar-green)' }} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Enterprise Pagination */}
        <ArPagination
          currentPage={currentPage}
          totalItems={filteredProducts.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          showRowsSelector={false}
        />
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="ar-modal-backdrop" onClick={() => setSelectedProduct(null)}>
          <div className="ar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ar-modal-header">
              <div>
                <span className="ar-section-legend" style={{ margin: 0 }}>
                  Product Specification File
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: 18, color: 'var(--ar-text-main)' }}>
                  {selectedProduct.name}
                </h3>
              </div>
              <button
                type="button"
                className="ar-icon-action"
                onClick={() => setSelectedProduct(null)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="ar-modal-body">
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  alignItems: 'center',
                  padding: 16,
                  background: '#f8fafc',
                  borderRadius: 12,
                  marginBottom: '1.25rem',
                }}
              >
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  style={{ width: 80, height: 80, borderRadius: 10, objectFit: 'cover' }}
                />
                <div>
                  <h4 style={{ margin: '0 0 4px', fontSize: 16, color: '#0f172a' }}>
                    {selectedProduct.name}
                  </h4>
                  <p style={{ margin: '0 0 6px', fontSize: 12.5, color: '#64748b' }}>
                    {selectedProduct.family} · {selectedProduct.type} · {selectedProduct.size}
                  </p>
                  <strong style={{ fontSize: 16, color: 'var(--ar-green)' }}>
                    ₹{selectedProduct.price.toLocaleString('en-IN')}
                  </strong>
                </div>
              </div>

              <div className="ar-form-section">
                <div className="ar-section-legend">
                  <span>Olfactory Profile & Ingredients</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {selectedProduct.notes.map((n) => (
                    <span
                      key={n}
                      style={{
                        padding: '4px 10px',
                        borderRadius: 6,
                        backgroundColor: '#f1f5f9',
                        fontSize: 12,
                        fontWeight: 600,
                        color: '#334155',
                      }}
                    >
                      {n}
                    </span>
                  ))}
                </div>
                <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, margin: 0 }}>
                  {selectedProduct.description}
                </p>
              </div>

              <div className="ar-form-section">
                <div className="ar-section-legend">
                  <span>Technical Longevity</span>
                </div>
                <div className="ar-grid-3">
                  <div>
                    <small style={{ color: '#64748b', display: 'block', fontSize: 11 }}>
                      Longevity
                    </small>
                    <strong style={{ fontSize: 13 }}>{selectedProduct.longevity || '8–10 hrs'}</strong>
                  </div>
                  <div>
                    <small style={{ color: '#64748b', display: 'block', fontSize: 11 }}>
                      Projection
                    </small>
                    <strong style={{ fontSize: 13 }}>{selectedProduct.projection || 'Strong'}</strong>
                  </div>
                  <div>
                    <small style={{ color: '#64748b', display: 'block', fontSize: 11 }}>
                      Rating
                    </small>
                    <strong style={{ fontSize: 13, color: '#f59e0b' }}>
                      ★ {selectedProduct.rating || 4.9} / 5.0
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="ar-modal-footer">
              <button
                type="button"
                className="ar-btn-secondary"
                onClick={() => setSelectedProduct(null)}
              >
                Close
              </button>
              <Link
                to={`/product/${selectedProduct.slug}`}
                target="_blank"
                className="ar-btn-primary"
                style={{ textDecoration: 'none' }}
              >
                <ExternalLink size={15} />
                <span>Open Store Page</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

