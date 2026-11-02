import React, { useState, useEffect, useMemo } from 'react';
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
  RotateCcw,
  FlaskConical,
  Calendar,
  Layers,
  Thermometer,
  Clock,
  Tag,
  CheckCircle,
  Sparkles,
  Printer,
  Download,
} from 'lucide-react';
import { startOfDay, endOfDay } from 'date-fns';
import { getCnoSamples, deleteCnoSample } from '../../lib/api.js';
import { exportCnoToExcel, exportSingleCnoPdf } from '../../utils/cnoExport.js';
import ArSelect from '../../components/ar/ArSelect.jsx';
import ArDateRangePicker from '../../components/ar/ArDateRangePicker.jsx';
import ArPagination from '../../components/ar/ArPagination.jsx';

export default function CnoListPage() {
  const navigate = useNavigate();

  const [samples, setSamples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [idealForFilter, setIdealForFilter] = useState('All');
  const [profileFilter, setProfileFilter] = useState('All');
  const [dateRange, setDateRange] = useState(null); // [start, end]

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Selected sample for view modal
  const [activeModalSample, setActiveModalSample] = useState(null);

  useEffect(() => {
    loadSamples();
  }, []);

  async function loadSamples() {
    setLoading(true);
    try {
      const res = await getCnoSamples({ limit: 100 });
      setSamples(res.samples || []);
    } catch (e) {
      console.error('Error loading samples:', e);
    } finally {
      setLoading(false);
    }
  }

  // Reactive live filtering across all dimensions
  const filteredSamples = useMemo(() => {
    return samples.filter((s) => {
      // 1. Gender / Ideal For
      if (idealForFilter !== 'All') {
        const itemGender = (s.idealFor || '').trim().toLowerCase();
        const targetGender = idealForFilter.toLowerCase();
        if (itemGender !== targetGender) return false;
      }

      // 2. Olfactory Profile
      if (profileFilter !== 'All') {
        const itemProfile = (s.profile || '').trim().toLowerCase();
        const targetProfile = profileFilter.toLowerCase();
        if (!itemProfile.includes(targetProfile)) return false;
      }

      // 3. Date Range Filter
      if (dateRange && (dateRange[0] || dateRange[1])) {
        const start = startOfDay(dateRange[0] || dateRange[1]);
        const end = endOfDay(dateRange[1] || dateRange[0] || start);

        let match = false;
        if (s.sampleDate) {
          const sd = new Date(s.sampleDate);
          if (!isNaN(sd) && sd >= start && sd <= end) match = true;
        }
        if (!match && s.receivedDate) {
          const rd = new Date(s.receivedDate);
          if (!isNaN(rd) && rd >= start && rd <= end) match = true;
        }
        if (!match) return false;
      }

      // 4. Search query
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchSerial = (s.serialNo || '').toLowerCase().includes(q);
        const matchCode = (s.code || '').toLowerCase().includes(q);
        const matchSupplier = (s.supplierName || '').toLowerCase().includes(q);
        const matchInspiration = (s.inspiration || '').toLowerCase().includes(q);
        const matchProduct = (s.usedInProduct || '').toLowerCase().includes(q);
        const matchRemarks = (s.remarks || '').toLowerCase().includes(q);
        const matchProfile = (s.profile || '').toLowerCase().includes(q);
        if (!matchSerial && !matchCode && !matchSupplier && !matchInspiration && !matchProduct && !matchRemarks && !matchProfile) {
          return false;
        }
      }

      return true;
    });
  }, [samples, searchTerm, idealForFilter, profileFilter, dateRange]);

  const isFiltered =
    searchTerm.trim() !== '' ||
    idealForFilter !== 'All' ||
    profileFilter !== 'All' ||
    Boolean(dateRange);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleGenderChange = (val) => {
    setIdealForFilter(val);
    setCurrentPage(1);
  };

  const handleProfileChange = (val) => {
    setProfileFilter(val);
    setCurrentPage(1);
  };

  const handleDateRangeChange = (range) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setIdealForFilter('All');
    setProfileFilter('All');
    setDateRange(null);
    setCurrentPage(1);
  };

  // Pagination Slice
  const paginatedSamples = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSamples.slice(start, start + pageSize);
  }, [filteredSamples, currentPage, pageSize]);

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

  // KPI Statistics Calculation
  const stats = useMemo(() => {
    const total = samples.length;
    const inspired = samples.filter((s) => s.inspiration && s.inspiration.trim()).length;
    const beastMode = samples.filter((s) => {
      const spray = String(s.sprayLongevity || '');
      const conc = String(s.concentrateLongevity || '');
      return spray.includes('12') || spray.includes('24') || conc.includes('12') || conc.includes('24') || spray.includes('8') || conc.includes('8');
    }).length;
    const suppliers = new Set(samples.map((s) => (s.supplierName || '').trim()).filter(Boolean)).size;
    return { total, inspired, beastMode, suppliers };
  }, [samples]);

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
            onClick={() => exportCnoToExcel(filteredSamples, `Motiwala_CNO_Registry_${new Date().toISOString().slice(0, 10)}.xlsx`)}
            disabled={!filteredSamples.length}
            title="Download active registry as Excel (.xlsx)"
          >
            <FileSpreadsheet size={16} style={{ color: '#16a34a' }} />
            <span>Export Excel {filteredSamples.length ? `(${filteredSamples.length})` : ''}</span>
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

      {/* KPI METRIC CARDS */}
      <div className="ar-kpi-grid">
        <div className="ar-kpi-card">
          <div className="ar-kpi-icon">
            <FlaskConical size={22} />
          </div>
          <div className="ar-kpi-content">
            <span className="ar-kpi-label">Total Formulations</span>
            <span className="ar-kpi-value">{stats.total}</span>
            <span className="ar-kpi-sub">Verified Laboratory Entries</span>
          </div>
        </div>

        <div className="ar-kpi-card gold">
          <div className="ar-kpi-icon">
            <Sparkles size={22} />
          </div>
          <div className="ar-kpi-content">
            <span className="ar-kpi-label">Benchmark Accords</span>
            <span className="ar-kpi-value">{stats.inspired}</span>
            <span className="ar-kpi-sub">Global Icons Matched</span>
          </div>
        </div>

        <div className="ar-kpi-card amber">
          <div className="ar-kpi-icon">
            <Clock size={22} />
          </div>
          <div className="ar-kpi-content">
            <span className="ar-kpi-label">All-Day Longevity</span>
            <span className="ar-kpi-value">{stats.beastMode}</span>
            <span className="ar-kpi-sub">8h+ & 12h+ Sillage Endurance</span>
          </div>
        </div>

        <div className="ar-kpi-card emerald">
          <div className="ar-kpi-icon">
            <Tag size={22} />
          </div>
          <div className="ar-kpi-content">
            <span className="ar-kpi-label">Master Suppliers</span>
            <span className="ar-kpi-value">{stats.suppliers}</span>
            <span className="ar-kpi-sub">International Fragrance Houses</span>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="ar-table-container">
        {/* Search & Filter Bar */}
        <div className="ar-filter-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 260 }}>
            <div className="ar-search-box" style={{ flex: 1 }}>
              <Search size={16} className="ar-search-icon" />
              <input
                type="text"
                className="ar-input"
                placeholder="Search serial, code, supplier, inspiration..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
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
            {/* Filter by Ideal For (Gender) with ArSelect (Image 1 replica) */}
            <ArSelect
              value={idealForFilter}
              onChange={(e) => handleGenderChange(e.target.value)}
              options={[
                { label: 'All Genders', value: 'All' },
                { label: 'Men', value: 'Men' },
                { label: 'Women', value: 'Women' },
                { label: 'Unisex', value: 'Unisex' },
              ]}
              width={140}
              searchable={false}
            />

            {/* Filter by Profile with ArSelect (Image 1 replica) */}
            <ArSelect
              value={profileFilter}
              onChange={(e) => handleProfileChange(e.target.value)}
              options={[
                { label: 'All Profiles', value: 'All' },
                { label: 'French', value: 'French' },
                { label: 'Oriental', value: 'Oriental' },
                { label: 'Arabic / Khaliji', value: 'Arabic / Khaliji' },
                { label: 'Fresh Aquatic', value: 'Fresh Aquatic' },
                { label: 'Woody & Smoky', value: 'Woody & Smoky' },
                { label: 'Amber Gourmand', value: 'Amber Gourmand' },
                { label: 'Floral Musky', value: 'Floral Musky' },
                { label: 'Spicy Leather', value: 'Spicy Leather' },
              ]}
              width={160}
              searchable={true}
            />

            {/* Filter by Date Range (Image 2 replica) */}
            <ArDateRangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              placeholder="Filter by Date Range"
            />

            {/* Clear All Filters Button */}
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
                title="Reset all active filters"
              >
                <X size={13} />
                <span>Clear</span>
              </button>
            )}

            {/* Filter count indicator */}
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ar-text-muted)', whiteSpace: 'nowrap' }}>
              {filteredSamples.length} {filteredSamples.length === 1 ? 'sample' : 'samples'}
            </span>

            {/* Refresh Button */}
            <button
              type="button"
              className="ar-btn-secondary"
              onClick={loadSamples}
              title="Refresh Registry from Atlas"
              style={{ padding: '8px 12px' }}
            >
              <RotateCw size={15} />
            </button>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="table-responsive" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch', width: '100%' }}>
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
              ) : paginatedSamples.length === 0 ? (
                <tr>
                  <td colSpan="10" style={{ textAlign: 'center', padding: '50px 0' }}>
                    <FlaskConical size={36} style={{ color: 'var(--ar-text-sub)', margin: '0 auto 10px', display: 'block' }} />
                    <strong style={{ display: 'block', fontSize: 14, color: 'var(--ar-text-main)' }}>
                      {isFiltered ? 'No CNO Samples Match the Active Filters' : 'No CNO Samples Found'}
                    </strong>
                    <p style={{ margin: '4px 0 14px', fontSize: 12.5, color: 'var(--ar-text-muted)' }}>
                      {isFiltered
                        ? 'Try clearing search terms or selecting different gender or date options.'
                        : 'Register your first supplier fragrance sample using the CNO Form.'}
                    </p>
                    {isFiltered ? (
                      <button
                        type="button"
                        className="ar-btn-secondary"
                        onClick={handleClearFilters}
                        style={{ margin: '0 auto' }}
                      >
                        <RotateCcw size={14} />
                        <span>Reset All Filters</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        className="ar-btn-primary"
                        onClick={() => navigate('/ar/cno')}
                        style={{ margin: '0 auto' }}
                      >
                        <Plus size={15} />
                        <span>Create CNO Sample</span>
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                paginatedSamples.map((s) => (
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

        {/* Enterprise Pagination */}
        <ArPagination
          currentPage={currentPage}
          totalItems={filteredSamples.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          showRowsSelector={false}
        />
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

