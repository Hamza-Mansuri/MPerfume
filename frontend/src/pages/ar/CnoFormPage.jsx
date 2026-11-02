import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FlaskConical,
  Sparkles,
  Check,
  RotateCcw,
  Save,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Search,
  ExternalLink,
  ChevronDown,
  Clock,
  Calendar,
  Thermometer,
  Layers,
  FileCheck,
} from 'lucide-react';
import {
  getNextCnoSerial,
  getCnoProductSuggestions,
  createCnoSample,
} from '../../lib/api.js';
import ArSelect from '../../components/ar/ArSelect.jsx';
import ArDatePicker from '../../components/ar/ArDatePicker.jsx';
import IntelligentScentMatcher from '../../components/ar/IntelligentScentMatcher.jsx';

const APPLICATION_OPTIONS = [
  { id: 'Perfume', label: 'Perfume (EDP/EDT)' },
  { id: 'Attar', label: 'Attar (Pure Oil)' },
  { id: 'Deo', label: 'Deo (Body Spray)' },
  { id: 'Room Freshener (R/F)', label: 'Room Freshener (R/F)' },
  { id: 'Bakhoor', label: 'Bakhoor (Incense)' },
  { id: 'Cosmetics (Cos)', label: 'Cosmetics (Cos)' },
];

const PROFILE_PRESETS = [
  'French',
  'Oriental',
  'Arabic / Khaliji',
  'Fresh Aquatic',
  'Woody & Smoky',
  'Amber Gourmand',
  'Floral Musky',
  'Spicy Leather',
];

export default function CnoFormPage() {
  const navigate = useNavigate();

  // Form State
  const [serialNo, setSerialNo] = useState('');
  const [sampleDate, setSampleDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [supplierName, setSupplierName] = useState('');
  const [code, setCode] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [idealFor, setIdealFor] = useState('Unisex');
  const [suitableFor, setSuitableFor] = useState(['Perfume', 'Attar']);
  const [boxesReceived, setBoxesReceived] = useState(1);
  const [usedInProduct, setUsedInProduct] = useState('');

  // Profile & Longevity
  const [profile, setProfile] = useState('French');
  const [receivedDate, setReceivedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [receivedTime, setReceivedTime] = useState(() => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  });
  const [concentrateLongevity, setConcentrateLongevity] = useState('8h+');
  const [temperature, setTemperature] = useState('32°C');
  const [sprayLongevity, setSprayLongevity] = useState('12h+');
  const [remarks, setRemarks] = useState('');

  // Suggestions state
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Status & submission state
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Mobile split view tab ('form' or 'matcher')
  const [mobileTab, setMobileTab] = useState('form');

  const handleAdoptInspiration = (name) => {
    setInspiration(name);
    setMobileTab('form');
  };

  const handleApplyUsedInProduct = (name) => {
    setUsedInProduct(name);
    setMobileTab('form');
  };

  // Load next serial number on mount
  useEffect(() => {
    loadSerial();
  }, []);

  async function loadSerial() {
    try {
      const next = await getNextCnoSerial();
      setSerialNo(next);
    } catch {
      setSerialNo(`CNO-${new Date().getFullYear()}-0001`);
    }
  }

  // Load product suggestions when user types in 'usedInProduct' or 'inspiration'
  useEffect(() => {
    const query = usedInProduct || inspiration;
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoadingSuggestions(true);
      const res = await getCnoProductSuggestions(query);
      setSuggestions(res);
      setLoadingSuggestions(false);
    }, 250);
    return () => clearTimeout(timer);
  }, [usedInProduct, inspiration]);

  const toggleSuitable = (formatId) => {
    setSuitableFor((prev) =>
      prev.includes(formatId) ? prev.filter((item) => item !== formatId) : [...prev, formatId]
    );
  };

  const handleSelectSuggestion = (prod) => {
    setUsedInProduct(`${prod.name} (${prod.type})`);
    setShowSuggestions(false);
  };

  const handleReset = () => {
    loadSerial();
    setSampleDate(new Date().toISOString().slice(0, 10));
    setSupplierName('');
    setCode('');
    setInspiration('');
    setIdealFor('Unisex');
    setSuitableFor(['Perfume', 'Attar']);
    setBoxesReceived(1);
    setUsedInProduct('');
    setProfile('French');
    setConcentrateLongevity('8h+');
    setTemperature('32°C');
    setSprayLongevity('12h+');
    setRemarks('');
    setSuccessResult(null);
    setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessResult(null);

    if (!supplierName.trim()) {
      setErrorMsg('Please provide the supplier name.');
      return;
    }
    if (!code.trim()) {
      setErrorMsg('Please enter the supplier batch / formulation code.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        serialNo: serialNo.trim(),
        sampleDate,
        supplierName: supplierName.trim(),
        code: code.trim(),
        inspiration: inspiration.trim(),
        idealFor,
        suitableFor,
        boxesReceived: Number(boxesReceived) || 1,
        usedInProduct: usedInProduct.trim(),
        profile: profile.trim(),
        receivedDate,
        receivedTime,
        concentrateLongevity,
        temperature,
        sprayLongevity,
        remarks: remarks.trim(),
      };

      const result = await createCnoSample(payload);
      setSuccessResult(result);
      setLoading(false);

      // Reset / empty all form input fields ready for next sample
      setSupplierName('');
      setCode('');
      setInspiration('');
      setIdealFor('Unisex');
      setSuitableFor(['Perfume', 'Attar']);
      setBoxesReceived(1);
      setUsedInProduct('');
      setProfile('French');
      setSampleDate(new Date().toISOString().slice(0, 10));
      setReceivedDate(new Date().toISOString().slice(0, 10));
      const now = new Date();
      setReceivedTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
      setConcentrateLongevity('8h+');
      setTemperature('32°C');
      setSprayLongevity('12h+');
      setRemarks('');
      setSuggestions([]);
      setShowSuggestions(false);

      // Auto reload next sequential serial number
      await loadSerial();
    } catch (err) {
      setErrorMsg(err.message || 'Error saving CNO sample to database.');
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="ar-page-header">
        <div>
          <h1>
            <FlaskConical size={24} style={{ color: 'var(--ar-green)' }} />
            <span>Chief Nose Officer (CNO) Entry</span>
          </h1>
          <p>Register new fragrance supplier samples, olfactory profiles, and technical evaluations into MongoDB Atlas.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="ar-btn-secondary"
            onClick={() => navigate('/ar/cno-list')}
          >
            <span>View CNO Registry</span>
          </button>
        </div>
      </div>

      {/* Success Notification */}
      {successResult && (
        <div
          style={{
            background: 'rgba(153, 194, 41, 0.15)',
            border: '1.5px solid var(--ar-green)',
            borderRadius: 12,
            padding: '14px 18px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <CheckCircle2 size={22} style={{ color: '#3f6212' }} />
            <div>
              <strong style={{ color: '#273c09', display: 'block', fontSize: 14 }}>
                Sample Successfully Recorded in MongoDB Atlas!
              </strong>
              <small style={{ color: '#4d7313' }}>
                Serial: <strong>{successResult.serialNo}</strong> · Code: {successResult.code} · Supplier: {successResult.supplierName}
              </small>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              type="button"
              className="ar-btn-primary"
              style={{ padding: '6px 14px', fontSize: 12 }}
              onClick={() => navigate('/ar/cno-list')}
            >
              Open in CNO List
            </button>
            <button
              type="button"
              className="ar-btn-secondary"
              style={{ padding: '6px 12px', fontSize: 12 }}
              onClick={handleReset}
            >
              New Entry
            </button>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div
          style={{
            background: '#fff1f2',
            border: '1px solid #fecdd3',
            borderRadius: 12,
            padding: '12px 16px',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            color: '#be123c',
            fontSize: 13,
          }}
        >
          <AlertCircle size={18} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Mobile Tab Switcher */}
      <div className="cno-mobile-tab-switcher">
        <button
          type="button"
          className={`cno-mobile-tab-btn ${mobileTab === 'form' ? 'active' : ''}`}
          onClick={() => setMobileTab('form')}
        >
          <span>📝 CNO Form</span>
        </button>
        <button
          type="button"
          className={`cno-mobile-tab-btn ${mobileTab === 'matcher' ? 'active' : ''}`}
          onClick={() => setMobileTab('matcher')}
        >
          <Sparkles size={14} style={{ color: 'var(--ar-green)' }} />
          <span>✨ AI Scent Matcher</span>
        </button>
      </div>

      {/* SPLIT SCREEN GRID: LEFT 50% FORM | RIGHT 50% INTELLIGENT SCENT MATCHING */}
      <div className="cno-split-grid">
        {/* ==================== LEFT COLUMN: CNO FORM (HALF SCREEN) ==================== */}
        <div className={`ar-card ${mobileTab !== 'form' ? 'cno-col-hidden-mobile' : ''}`}>
          <div className="ar-card-header">
            <h2>
              <span>Sample Details & Formulation Form</span>
            </h2>
            <span className="ar-code-badge">{serialNo || 'CNO-NEW'}</span>
          </div>

          <form onSubmit={handleSubmit} className="ar-card-body">
            {/* SECTION 1: SAMPLE & SUPPLIER */}
            <div className="ar-form-section">
              <div className="ar-section-legend">
                <span>01. Sample & Supplier Information</span>
              </div>

              <div className="ar-grid-2">
                {/* Serial No */}
                <div className="ar-field">
                  <label className="ar-label">
                    <span>Serial No <span className="req">*</span></span>
                  </label>
                  <input
                    type="text"
                    className="ar-input"
                    value={serialNo}
                    onChange={(e) => setSerialNo(e.target.value)}
                    placeholder="e.g. CNO-2026-0001"
                    required
                  />
                </div>

                {/* Sample Date */}
                <div className="ar-field">
                  <ArDatePicker
                    label="Sample Date"
                    required
                    title="Select Sample Date"
                    value={sampleDate}
                    onChange={(e) => setSampleDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="ar-grid-2">
                {/* Supplier Name */}
                <div className="ar-field">
                  <label className="ar-label">
                    <span>Name of Supplier <span className="req">*</span></span>
                  </label>
                  <input
                    type="text"
                    className="ar-input"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="e.g. Givaudan, Firmenich, IFF"
                    required
                  />
                </div>

                {/* Code */}
                <div className="ar-field">
                  <label className="ar-label">
                    <span>Code <span className="req">*</span></span>
                  </label>
                  <input
                    type="text"
                    className="ar-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. BDC-9042-V1"
                    required
                  />
                </div>
              </div>

              <div className="ar-grid-2">
                {/* Inspiration */}
                <div className="ar-field">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <label className="ar-label" style={{ margin: 0 }}>
                      <span>Inspiration</span>
                      <small>Benchmark perfume</small>
                    </label>
                  </div>
                  <input
                    type="text"
                    className="ar-input"
                    value={inspiration}
                    onChange={(e) => setInspiration(e.target.value)}
                    placeholder="e.g. Bleu de Chanel, Baccarat 540"
                  />
                  <div className="ar-sensory-chips" style={{ marginTop: 6 }}>
                    {['Bleu de Chanel', 'Baccarat Rouge 540', 'Creed Aventus', 'Oud Wood', 'Delina', 'Santal 33'].map((item) => (
                      <button
                        key={item}
                        type="button"
                        className="ar-sensory-chip"
                        onClick={() => setInspiration(item)}
                        style={{
                          fontSize: 10.5,
                          padding: '2px 8px',
                          background: inspiration === item ? 'var(--ar-gold-light)' : '#fdfbf7',
                          borderColor: inspiration === item ? 'var(--ar-gold)' : 'var(--ar-border)',
                          color: inspiration === item ? '#8c6f3d' : '#64748b',
                        }}
                      >
                        ✦ {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ideal For */}
                <div className="ar-field">
                  <label className="ar-label">
                    <span>Ideal For</span>
                  </label>
                  <ArSelect
                    value={idealFor}
                    onChange={(e) => setIdealFor(e.target.value)}
                    options={[
                      { label: 'Men', value: 'Men' },
                      { label: 'Women', value: 'Women' },
                      { label: 'Unisex', value: 'Unisex' },
                    ]}
                    searchable={false}
                    width="100%"
                  />
                </div>
              </div>

              {/* Checkboxes: Suitable uses */}
              <div className="ar-field">
                <label className="ar-label">
                  <span>Suitable Applications / Formats</span>
                  <small>Select all that apply</small>
                </label>
                <div className="ar-checkbox-grid">
                  {APPLICATION_OPTIONS.map((opt) => {
                    const isChecked = suitableFor.includes(opt.id);
                    return (
                      <div
                        key={opt.id}
                        className={`ar-check-pill ${isChecked ? 'checked' : ''}`}
                        onClick={() => toggleSuitable(opt.id)}
                      >
                        <div className="ar-check-box">
                          {isChecked && <Check size={12} strokeWidth={3} />}
                        </div>
                        <span>{opt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="ar-grid-2">
                {/* Boxes Received */}
                <div className="ar-field">
                  <label className="ar-label">
                    <span>Boxes / Vials Received</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    className="ar-input"
                    value={boxesReceived}
                    onChange={(e) => setBoxesReceived(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>

                {/* Used In Which Product (Interactive Suggestions) */}
                <div className="ar-field ar-suggestion-container">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <label className="ar-label" style={{ margin: 0 }}>
                      <span>Used In Which Product</span>
                    </label>
                    {usedInProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileTab('matcher');
                          const el = document.getElementById('ai-scent-matcher-section');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        style={{
                          background: 'rgba(153, 194, 41, 0.15)',
                          border: '1px solid var(--ar-green)',
                          color: '#273c09',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          padding: '2px 8px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Sparkles size={11} />
                        <span>Match with AI Scent?</span>
                      </button>
                    )}
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      className="ar-input"
                      value={usedInProduct}
                      onChange={(e) => {
                        setUsedInProduct(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Type or click catalog suggestion..."
                    />
                    {loadingSuggestions && (
                      <span
                        style={{
                          position: 'absolute',
                          right: 12,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          fontSize: 11,
                          color: 'var(--ar-text-sub)',
                        }}
                      >
                        Searching...
                      </span>
                    )}
                  </div>

                  {/* Suggestion Dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="ar-suggestion-dropdown">
                      <div
                        style={{
                          padding: '6px 12px',
                          background: '#f8fafc',
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'var(--ar-text-sub)',
                          textTransform: 'uppercase',
                        }}
                      >
                        Store Catalog Suggestions ({suggestions.length})
                      </div>
                      {suggestions.map((prod) => (
                        <div
                          key={prod.id || prod.slug}
                          className="ar-suggestion-item"
                          onClick={() => handleSelectSuggestion(prod)}
                        >
                          <div>
                            <strong>{prod.name}</strong>
                            <small>
                              {prod.family} · {(prod.notes || []).slice(0, 3).join(', ')}
                            </small>
                          </div>
                          <span className="ar-suggestion-badge">{prod.type}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 2: PROFILE & EVALUATION */}
            <div className="ar-form-section">
              <div className="ar-section-legend">
                <span>02. Olfactory Profile & Technical Longevity</span>
              </div>

              <div className="ar-grid-2">
                {/* Profile */}
                <div className="ar-field">
                  <label className="ar-label">
                    <span>Profile</span>
                    <small>e.g. French, Oriental</small>
                  </label>
                  <input
                    type="text"
                    list="profile-presets"
                    className="ar-input"
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    placeholder="e.g. French"
                  />
                  <datalist id="profile-presets">
                    {PROFILE_PRESETS.map((p) => (
                      <option key={p} value={p} />
                    ))}
                  </datalist>
                </div>

                {/* Date of Receiving */}
                <div className="ar-field">
                  <ArDatePicker
                    label="Date of Receiving"
                    title="Select Date of Receiving"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="ar-grid-3">
                {/* Time */}
                <div className="ar-field">
                  <label className="ar-label">
                    <span>Time</span>
                  </label>
                  <div className="ar-date-input-wrap">
                    <Clock size={15} className="ar-date-icon" />
                    <input
                      type="time"
                      className="ar-input"
                      value={receivedTime}
                      onChange={(e) => setReceivedTime(e.target.value)}
                    />
                  </div>
                </div>

                {/* Concentrate Longevity */}
                <div className="ar-field">
                  <label className="ar-label">
                    <span>Concentrate</span>
                  </label>
                  <input
                    type="text"
                    className="ar-input"
                    value={concentrateLongevity}
                    onChange={(e) => setConcentrateLongevity(e.target.value)}
                    placeholder="e.g. 8h+"
                  />
                </div>

                {/* Temperature */}
                <div className="ar-field">
                  <label className="ar-label">
                    <span>Temperature</span>
                  </label>
                  <input
                    type="text"
                    className="ar-input"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    placeholder="e.g. 32°C"
                  />
                </div>
              </div>

              <div className="ar-field">
                <label className="ar-label">
                  <span>Spray Longevity & Sillage</span>
                  <small>Skin & fabric projection aura</small>
                </label>
                <input
                  type="text"
                  className="ar-input"
                  value={sprayLongevity}
                  onChange={(e) => setSprayLongevity(e.target.value)}
                  placeholder="e.g. 12h+"
                />
                <div className="ar-sensory-chips" style={{ marginTop: 6 }}>
                  {['6h+ Intimate Scent', '8h+ Moderate Aura', '12h+ Radiant Sillage', '24h+ Beast Mode'].map((item) => (
                    <button
                      key={item}
                      type="button"
                      className="ar-sensory-chip"
                      onClick={() => setSprayLongevity(item)}
                      style={{
                        fontSize: 10.5,
                        padding: '2px 8px',
                        background: sprayLongevity === item ? 'var(--ar-green-light)' : '#fdfbf7',
                        borderColor: sprayLongevity === item ? 'var(--ar-green)' : 'var(--ar-border)',
                        color: sprayLongevity === item ? 'var(--ar-green-dark)' : '#64748b',
                      }}
                    >
                      ✦ {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* SECTION 3: REMARKS */}
            <div className="ar-form-section">
              <div className="ar-section-legend">
                <span>03. Master Nose Remarks & Sensory Tasting Notes</span>
              </div>

              <div className="ar-field">
                <label className="ar-label">
                  <span>Sensory Evaluation Impressions</span>
                  <small>Maceration, top note punch, dry down character</small>
                </label>
                <textarea
                  className="ar-textarea"
                  style={{ minHeight: '85px' }}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder="Write sensory impressions, dry-down longevity, feedback to supplier, or formulation verdict..."
                />

                {/* Quick Olfactory Notes Helper Chips */}
                <div className="ar-sensory-chips" style={{ marginTop: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--ar-text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, width: '100%', marginBottom: 2 }}>
                    <Sparkles size={12} style={{ color: 'var(--ar-gold)' }} />
                    <span>Quick Master Nose Accord Impressions (Tap to add):</span>
                  </span>
                  {[
                    'Sparkling Bergamot Opening',
                    'Velvety Damask Rose',
                    'Royal Dehn Al Oud',
                    'Warm Ambergris Sillage',
                    'Smoky Birch & Leather',
                    'Creamy Mysore Sandalwood',
                    'Bourbon Vanilla Drydown',
                    'Spicy Cardamom Punch',
                    'Silky White Musk Glow',
                    'Powdery Tuscan Iris',
                  ].map((phrase) => (
                    <button
                      key={phrase}
                      type="button"
                      className="ar-sensory-chip"
                      onClick={() => {
                        setRemarks((prev) => (prev ? `${prev}. ${phrase}` : phrase));
                      }}
                    >
                      + {phrase}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="ar-form-actions">
              <button
                type="button"
                className="ar-btn-secondary"
                onClick={handleReset}
                disabled={loading}
              >
                <RotateCcw size={15} />
                <span>Reset</span>
              </button>
              <button
                type="submit"
                className="ar-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save size={16} />
                    <span>Save</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ==================== RIGHT COLUMN: INTELLIGENT SCENT MATCHING (HALF SCREEN) ==================== */}
        <div
          id="ai-scent-matcher-section"
          className={`cno-right-col ${mobileTab !== 'matcher' ? 'cno-col-hidden-mobile' : ''}`}
        >
          <IntelligentScentMatcher
            onAdoptInspiration={handleAdoptInspiration}
            onApplyUsedInProduct={handleApplyUsedInProduct}
            currentUsedInProduct={usedInProduct}
            currentInspiration={inspiration}
          />
        </div>
      </div>
    </div>
  );
}

