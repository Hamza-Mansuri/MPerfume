import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ListFilter,
  Search,
  Plus,
  FileDown,
  FileSpreadsheet,
  FileText,
  Eye,
  Trash2,
  X,
  RotateCw,
  FlaskConical,
  Calendar,
  Layers,
  Thermometer,
  Clock,
  Tag,
  CheckCircle,
} from 'lucide-react';
import { getCnoSamples, deleteCnoSample } from '../../lib/api.js';
import { exportCnoToExcel, exportSingleCnoPdf } from '../../utils/cnoExport.js';

export default function CnoListPage() {
  const navigate = useNavigate();

  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [idealForFilter, setIdealForFilter] = useState('All');
  const [profileFilter, setProfileFilter] = useState('All');

  // Selected sample for view modal
  const [activeModalSample, setActiveModalSample] = useState(null);

  useEffect(() => {
    loadSamples();
  }, [idealForFilter, profileFilter]);

  async function loadSamples() {
    setLoading(true);
    try {
      const res = await getCnoSamples({
        q: searchTerm,
        idealFor: idealForFilter,
        profile: profileFilter,
      });
      setSamples(res.samples || []);
    } catch (e) {
      console.error('Error loading samples:', e);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadSamples();
  };

  const handleDelete = async (id, serial) => {
    if (!window.confirm(`Are you sure you want to remove sample ${serial}?`)) return;
    try {
      await deleteCnoSample(id);
      setSamples((prev) => prev.filter((s) => (s._id || s.id) !== id));
      if (activeModalSample && (activeModalSample._id || activeModalSample.id) === id) {
        setActiveModalSample(null);
      }
    } catch (err) {
      alert('Error deleting sample: ' + err.message);
    }
  };

  // Helper date formatter
  const formatDate = (dateVal) => {
    if (!dateVal) return '—';
    try {
      return new Date(dateVal).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return String(dateVal);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="ar-page-header">
        <div>
          <h1>
            <ListFilter size={24} style={{ color: 'var(--ar-green)' }} />
            <span>CNO Sample Registry</span>
          </h1>
          <p>
            Review all incoming fragrance formulation samples, view full technical evaluations, and export PDF / Excel sheets.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="ar-btn-secondary"
            onClick={() => exportCnoToExcel(samples, `Motiwala_CNO_Registry_${new Date().toISOString().slice(0, 10)}.xlsx`)}
            disabled={!samples.length}
            title="Download full registry as Excel (.xlsx)"
          >
            <FileSpreadsheet size={16} style={{ color: '#16a34a' }} />
            <span>Export All to Excel</span>
          </button>

          <button
            type="button"
            className="ar-btn-primary"
            onClick={() => navigate('/ar/cno')}
          >
            <Plus size={16} />
            <span>New CNO Sample</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="ar-table-container">
        {/* Search & Filter Bar */}
        <div className="ar-filter-bar">
          <form onSubmit={handleSearchSubmit} className="ar-search-box">
            <Search size={16} className="ar-search-icon" />
            <input
              type="text"
              className="ar-input"
              placeholder="Search serial, code, supplier, inspiration..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>

          <div className="ar-filter-actions">
            {/* Filter by Ideal For */}
            <select
              className="ar-select"
              style={{ width: 140, height: 38 }}
              value={idealForFilter}
              onChange={(e) => setIdealForFilter(e.target.value)}
            >
              <option value="All">All Genders</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>

            {/* Filter by Profile */}
            <select
              className="ar-select"
              style={{ width: 150, height: 38 }}
              value={profileFilter}
              onChange={(e) => setProfileFilter(e.target.value)}
            >
              <option value="All">All Profiles</option>
              <option value="French">French</option>
              <option value="Oriental">Oriental</option>
              <option value="Arabic / Khaliji">Arabic / Khaliji</option>
              <option value="Fresh Aquatic">Fresh Aquatic</option>
              <option value="Woody & Smoky">Woody & Smoky</option>
              <option value="Amber Gourmand">Amber Gourmand</option>
            </select>

            <button
              type="button"
              className="ar-btn-secondary"
              onClick={loadSamples}
              title="Refresh Registry"
              style={{ padding: '8px 12px' }}
            >
              <RotateCw size={15} />
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="ar-table">
            <thead>
              <tr>
                <th>Serial / Code</th>
                <th>Supplier</th>
                <th>Sample Date</th>
                <th>Inspiration</th>
                <th>Ideal For</th>
                <th>Suitable Uses</th>
                <th>Profile</th>
                <th>Boxes</th>
                <th>Used In Product</th>
                <th style={{ textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '40px 0', color: 'var(--ar-text-muted)' }}>
                    Loading samples from MongoDB Atlas...
                  </td>
                </tr>
              ) : samples.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '50px 0' }}>
                    <FlaskConical size={36} style={{ color: 'var(--ar-text-sub)', margin: '0 auto 10px', display: 'block' }} />
                    <strong style={{ display: 'block', fontSize: 14, color: 'var(--ar-text-main)' }}>
                      No CNO Samples Found
                    </strong>
                    <p style={{ margin: '4px 0 14px', fontSize: 12.5, color: 'var(--ar-text-muted)' }}>
                      Register your first supplier fragrance sample using the CNO Form.
                    </p>
                    <button
                      type="button"
                      className="ar-btn-primary"
                      onClick={() => navigate('/ar/cno')}
                      style={{ margin: '0 auto' }}
                    >
                      <Plus size={15} />
                      <span>Create CNO Sample</span>
                    </button>
                  </td>
                </tr>
              ) : (
                samples.map((s) => (
                  <tr key={s._id || s.id || s.serialNo}>
                    {/* Serial & Code */}
                    <td>
                      <strong style={{ display: 'block', color: 'var(--ar-text-main)' }}>
                        {s.serialNo}
                      </strong>
                      <span className="ar-code-badge">{s.code}</span>
                    </td>

                    {/* Supplier */}
                    <td>
                      <span style={{ fontWeight: 600 }}>{s.supplierName}</span>
                    </td>

                    {/* Sample Date */}
                    <td>
                      <span style={{ color: 'var(--ar-text-muted)', fontSize: 12 }}>
                        {formatDate(s.sampleDate)}
                      </span>
                    </td>

                    {/* Inspiration */}
                    <td>
                      {s.inspiration ? (
                        <strong style={{ color: '#1e293b' }}>{s.inspiration}</strong>
                      ) : (
                        <span style={{ color: 'var(--ar-text-sub)' }}>—</span>
                      )}
                    </td>

                    {/* Ideal For */}
                    <td>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          background:
                            s.idealFor === 'Men'
                              ? '#e0f2fe'
                              : s.idealFor === 'Women'
                              ? '#fce7f3'
                              : '#f1f5f9',
                          color:
                            s.idealFor === 'Men'
                              ? '#0369a1'
                              : s.idealFor === 'Women'
                              ? '#be185d'
                              : '#334155',
                        }}
                      >
                        {s.idealFor || 'Unisex'}
                      </span>
                    </td>

                    {/* Suitable Uses */}
                    <td style={{ maxWidth: 220 }}>
                      {s.suitableFor && s.suitableFor.length ? (
                        s.suitableFor.map((item) => (
                          <span key={item} className="ar-format-pill">
                            {item}
                          </span>
                        ))
                      ) : (
                        <span style={{ color: 'var(--ar-text-sub)' }}>—</span>
                      )}
                    </td>

                    {/* Profile */}
                    <td>
                      <span style={{ fontSize: 12.5, fontWeight: 600, color: '#334155' }}>
                        {s.profile || 'French'}
                      </span>
                    </td>

                    {/* Boxes */}
                    <td>
                      <span style={{ fontWeight: 700 }}>{s.boxesReceived ?? 1}</span>
                    </td>

                    {/* Used In Product */}
                    <td style={{ maxWidth: 160 }}>
                      <span style={{ fontSize: 12, color: '#0f172a', fontWeight: 600 }}>
                        {s.usedInProduct || 'Direct Formulation'}
                      </span>
                    </td>

                    {/* Action Button Group */}
                    <td>
                      <div className="ar-action-btn-group" style={{ justifyContent: 'center' }}>
                        {/* View Full Info */}
                        <button
                          type="button"
                          className="ar-icon-action"
                          title="View Full Sample Sheet"
                          onClick={() => setActiveModalSample(s)}
                        >
                          <Eye size={15} />
                        </button>

                        {/* Download PDF */}
                        <button
                          type="button"
                          className="ar-icon-action"
                          title="Download PDF Report"
                          onClick={() => exportSingleCnoPdf(s)}
                        >
                          <FileText size={15} style={{ color: '#0284c7' }} />
                        </button>

                        {/* Export Excel (Single) */}
                        <button
                          type="button"
                          className="ar-icon-action"
                          title="Export to Excel"
                          onClick={() => exportCnoToExcel([s], `${s.serialNo}_Evaluation.xlsx`)}
                        >
                          <FileSpreadsheet size={15} style={{ color: '#16a34a' }} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          className="ar-icon-action"
                          title="Delete Sample"
                          onClick={() => handleDelete(s._id || s.id, s.serialNo)}
                        >
                          <Trash2 size={15} style={{ color: '#e11d48' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ==================== ACTION MODAL: VIEW FULL INFORMATION ==================== */}
      {activeModalSample && (
        <div className="ar-modal-backdrop" onClick={() => setActiveModalSample(null)}>
          <div className="ar-modal" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="ar-modal-header">
              <div>
                <span className="ar-section-legend" style={{ margin: 0 }}>
                  Chief Nose Officer Evaluation Dossier
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: 18, color: 'var(--ar-text-main)' }}>
                  {activeModalSample.serialNo} · {activeModalSample.code}
                </h3>
              </div>
              <button
                type="button"
                className="ar-icon-action"
                onClick={() => setActiveModalSample(null)}
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="ar-modal-body">
              {/* Top Meta Pill */}
              <div
                style={{
                  background: '#f8fafc',
                  border: '1px solid var(--ar-border)',
                  borderRadius: 10,
                  padding: '12px 16px',
                  marginBottom: '1.25rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <div>
                  <small style={{ color: 'var(--ar-text-muted)', display: 'block', fontSize: 11 }}>
                    SUPPLIER
                  </small>
                  <strong style={{ fontSize: 14 }}>{activeModalSample.supplierName}</strong>
                </div>
                <div>
                  <small style={{ color: 'var(--ar-text-muted)', display: 'block', fontSize: 11 }}>
                    INSPIRATION
                  </small>
                  <strong style={{ fontSize: 14, color: 'var(--ar-green)' }}>
                    {activeModalSample.inspiration || 'Original Formula'}
                  </strong>
                </div>
                <div>
                  <small style={{ color: 'var(--ar-text-muted)', display: 'block', fontSize: 11 }}>
                    SAMPLE DATE
                  </small>
                  <strong style={{ fontSize: 13 }}>{formatDate(activeModalSample.sampleDate)}</strong>
                </div>
              </div>

              {/* Section 1: Specifications */}
              <div className="ar-form-section">
                <div className="ar-section-legend">
                  <span>01. Sample & Product Mapping</span>
                </div>
                <div className="ar-grid-3">
                  <div>
                    <small style={{ color: 'var(--ar-text-muted)', display: 'block', fontSize: 11 }}>
                      Ideal For
                    </small>
                    <strong style={{ fontSize: 13 }}>{activeModalSample.idealFor || 'Unisex'}</strong>
                  </div>
                  <div>
                    <small style={{ color: 'var(--ar-text-muted)', display: 'block', fontSize: 11 }}>
                      Boxes / Vials Received
                    </small>
                    <strong style={{ fontSize: 13 }}>{activeModalSample.boxesReceived ?? 1} Units</strong>
                  </div>
                  <div>
                    <small style={{ color: 'var(--ar-text-muted)', display: 'block', fontSize: 11 }}>
                      Used In Which Product
                    </small>
                    <strong style={{ fontSize: 13, color: '#0f172a' }}>
                      {activeModalSample.usedInProduct || 'Direct Accord'}
                    </strong>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <small style={{ color: 'var(--ar-text-muted)', display: 'block', fontSize: 11, marginBottom: 5 }}>
                    Suitable Applications / Formats
                  </small>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {(activeModalSample.suitableFor || []).map((app) => (
                      <span
                        key={app}
                        style={{
                          background: 'var(--ar-green-light)',
                          color: '#365314',
                          border: '1px solid rgba(153, 194, 41, 0.4)',
                          borderRadius: 999,
                          padding: '3px 10px',
                          fontSize: 11.5,
                          fontWeight: 700,
                        }}
                      >
                        ✓ {app}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 2: Technical Longevity */}
              <div className="ar-form-section">
                <div className="ar-section-legend">
                  <span>02. Olfactory Profile & Technical Evaluation</span>
                </div>
                <div className="ar-grid-3">
                  <div>
                    <small style={{ color: 'var(--ar-text-muted)', display: 'block', fontSize: 11 }}>
                      Profile
                    </small>
                    <strong style={{ fontSize: 13 }}>{activeModalSample.profile || 'French'}</strong>
                  </div>
                  <div>
                    <small style={{ color: 'var(--ar-text-muted)', display: 'block', fontSize: 11 }}>
                      Concentrate Longevity
                    </small>
                    <strong style={{ fontSize: 13, color: 'var(--ar-green)' }}>
                      {activeModalSample.concentrateLongevity || '8h+'}
                    </strong>
                  </div>
                  <div>
                    <small style={{ color: 'var(--ar-text-muted)', display: 'block', fontSize: 11 }}>
                      Spray Longevity
                    </small>
                    <strong style={{ fontSize: 13, color: 'var(--ar-green)' }}>
                      {activeModalSample.sprayLongevity || '12h+'}
                    </strong>
                  </div>
                </div>

                <div className="ar-grid-3" style={{ marginTop: 12 }}>
                  <div>
                    <small style={{ color: 'var(--ar-text-muted)', display: 'block', fontSize: 11 }}>
                      Date of Receiving
                    </small>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {formatDate(activeModalSample.receivedDate)}
                    </span>
                  </div>
                  <div>
                    <small style={{ color: 'var(--ar-text-muted)', display: 'block', fontSize: 11 }}>
                      Time of Receiving
                    </small>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {activeModalSample.receivedTime || '—'}
                    </span>
                  </div>
                  <div>
                    <small style={{ color: 'var(--ar-text-muted)', display: 'block', fontSize: 11 }}>
                      Ambient Temperature
                    </small>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>
                      {activeModalSample.temperature || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 3: Remarks */}
              <div className="ar-form-section">
                <div className="ar-section-legend">
                  <span>03. Nose Remarks & Formulation Notes</span>
                </div>
                <p
                  style={{
                    background: '#f8fafc',
                    padding: '12px 14px',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#334155',
                    margin: 0,
                    lineHeight: 1.6,
                    border: '1px solid var(--ar-border)',
                  }}
                >
                  {activeModalSample.remarks || 'No remarks recorded for this evaluation sample.'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="ar-modal-footer">
              <div style={{ display: 'flex', gap: 8 }}>
                {/* Download PDF button */}
                <button
                  type="button"
                  className="ar-btn-primary"
                  onClick={() => exportSingleCnoPdf(activeModalSample)}
                >
                  <FileText size={15} />
                  <span>Download PDF Report</span>
                </button>

                {/* Export Excel button */}
                <button
                  type="button"
                  className="ar-btn-secondary"
                  onClick={() => exportCnoToExcel([activeModalSample], `${activeModalSample.serialNo}.xlsx`)}
                >
                  <FileSpreadsheet size={15} style={{ color: '#16a34a' }} />
                  <span>Export Excel</span>
                </button>
              </div>

              <button
                type="button"
                className="ar-btn-secondary"
                onClick={() => setActiveModalSample(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

