import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Check,
  Plus,
  X,
  Layers,
  ArrowRight,
  Flame,
  Globe,
  Store,
  RefreshCw,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import { demoProducts } from '../../data/products.js';
import { globalFragrances } from '../../data/globalFragrances.js';

const QUICK_TOP_PRESETS = [
  'Bergamot',
  'Rose',
  'Lemon',
  'Pink Pepper',
  'Grapefruit',
  'Lavender',
  'Mint',
  'Saffron',
];

const QUICK_HEART_PRESETS = [
  'Jasmine',
  'Bulgarian Rose',
  'Cardamom',
  'Nutmeg',
  'Lavender',
  'Cinnamon',
  'Geranium',
  'Iris',
];

const QUICK_BASE_PRESETS = [
  'Oud (Agarwood)',
  'White Musk',
  'Amber',
  'Sandalwood',
  'Vanilla',
  'Patchouli',
  'Cedarwood',
  'Leather',
];

export default function IntelligentScentMatcher({
  onAdoptInspiration,
  onApplyUsedInProduct,
  currentUsedInProduct = '',
  currentInspiration = '',
}) {
  // Pyramid Notes State
  const [topNotes, setTopNotes] = useState(['Bergamot', 'Rose']);
  const [heartNotes, setHeartNotes] = useState(['Jasmine', 'Cardamom']);
  const [baseNotes, setBaseNotes] = useState(['Oud (Agarwood)', 'White Musk', 'Amber']);

  // Tag inputs
  const [newTopNote, setNewTopNote] = useState('');
  const [newHeartNote, setNewHeartNote] = useState('');
  const [newBaseNote, setNewBaseNote] = useState('');

  // Active view tab: 'store' (Motiwala Catalog) or 'global' (Internet Benchmark Fragrances)
  const [activeTab, setActiveTab] = useState('store');

  // Load from store catalog preset dropdown
  const [selectedCatalogProduct, setSelectedCatalogProduct] = useState('');

  // Notification feedback
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const triggerFeedback = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => setFeedbackMsg(''), 3000);
  };

  // Add note helpers
  const addNote = (setter, val, currentList) => {
    const trimmed = val.trim();
    if (!trimmed) return;
    if (!currentList.some((n) => n.toLowerCase() === trimmed.toLowerCase())) {
      setter([...currentList, trimmed]);
    }
  };

  const removeNote = (setter, noteToRemove, currentList) => {
    setter(currentList.filter((n) => n !== noteToRemove));
  };

  // Preset chip toggle
  const togglePreset = (note, list, setter) => {
    if (list.some((n) => n.toLowerCase() === note.toLowerCase())) {
      removeNote(setter, note, list);
    } else {
      addNote(setter, note, list);
    }
  };

  // Sync with left form's "Used In Product" or catalog preset
  const handleLoadStoreProduct = (prodName) => {
    if (!prodName) return;
    const found = demoProducts.find(
      (p) =>
        p.name.toLowerCase().includes(prodName.toLowerCase()) ||
        prodName.toLowerCase().includes(p.name.toLowerCase())
    );
    if (found) {
      const all = found.notes || [];
      setTopNotes(all.slice(0, Math.ceil(all.length / 3)));
      setHeartNotes(all.slice(Math.ceil(all.length / 3), Math.ceil((all.length * 2) / 3)));
      setBaseNotes(all.slice(Math.ceil((all.length * 2) / 3)));
      triggerFeedback(`Loaded notes from ${found.name} (${found.type})!`);
    } else {
      triggerFeedback(`Could not find "${prodName}" in catalog.`);
    }
  };

  // Calculate matching scores
  const allUserNotes = useMemo(() => {
    return [...topNotes, ...heartNotes, ...baseNotes].map((n) => n.toLowerCase().trim());
  }, [topNotes, heartNotes, baseNotes]);

  // Match in-store Motiwala products
  const storeMatches = useMemo(() => {
    if (!allUserNotes.length) return [];

    const scored = demoProducts.map((p) => {
      const pNotes = (p.notes || []).map((n) => n.toLowerCase().trim());
      const matchedNotes = [];

      allUserNotes.forEach((un) => {
        pNotes.forEach((pn) => {
          if (pn.includes(un) || un.includes(pn)) {
            if (!matchedNotes.includes(pn)) matchedNotes.push(pn);
          }
        });
      });

      // Calculate score percentage
      const matchRatio = (matchedNotes.length * 2) / (allUserNotes.length + pNotes.length);
      const score = Math.min(98, Math.round(matchRatio * 75 + matchedNotes.length * 10 + 20));

      return {
        product: p,
        score,
        matchedCount: matchedNotes.length,
        matchedNotes,
      };
    });

    return scored
      .filter((m) => m.matchedCount > 0 || m.score >= 50)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [allUserNotes]);

  // Match global benchmark iconic perfumes
  const globalMatches = useMemo(() => {
    if (!allUserNotes.length) return [];

    const scored = globalFragrances.map((gf) => {
      const gNotes = [
        ...gf.topNotes,
        ...gf.heartNotes,
        ...gf.baseNotes,
      ].map((n) => n.toLowerCase().trim());

      const matchedNotes = [];

      allUserNotes.forEach((un) => {
        gNotes.forEach((gn) => {
          if (gn.includes(un) || un.includes(gn)) {
            if (!matchedNotes.includes(gn)) matchedNotes.push(gn);
          }
        });
      });

      const matchRatio = (matchedNotes.length * 2) / (allUserNotes.length + gNotes.length);
      const score = Math.min(99, Math.round(matchRatio * 70 + matchedNotes.length * 12 + 25));

      return {
        fragrance: gf,
        score,
        matchedCount: matchedNotes.length,
        matchedNotes,
      };
    });

    return scored
      .filter((m) => m.matchedCount > 0 || m.score >= 55)
      .sort((a, b) => b.score - a.score)
      .slice(0, 8);
  }, [allUserNotes]);

  return (
    <div className="ar-matching-panel" style={{ position: 'sticky', top: '84px' }}>
      {/* Header Banner */}
      <div className="ar-matching-banner">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
          <span className="ar-matching-badge">
            <Sparkles size={12} />
            <span>AI Olfactory Intelligence</span>
          </span>
          {feedbackMsg && (
            <span
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                color: '#bbf447',
                background: 'rgba(153, 194, 41, 0.25)',
                padding: '3px 9px',
                borderRadius: 999,
                border: '1px solid #99c229',
              }}
            >
              {feedbackMsg}
            </span>
          )}
        </div>
        <h3 style={{ margin: '6px 0 4px', fontSize: 18, color: '#ffffff', fontWeight: 800 }}>
          Intelligent Scent Matching
        </h3>
        <p style={{ margin: 0, fontSize: 12.5, color: '#cbd5e1', lineHeight: 1.5 }}>
          Input the fragrance pyramid notes to instantly match formulation equivalents in Motiwala's store catalog and international iconic benchmarks.
        </p>
      </div>

      {/* Sync with "Used In Product" Quick Action */}
      {currentUsedInProduct && (
        <div
          style={{
            background: 'rgba(153, 194, 41, 0.08)',
            border: '1px dashed #99c229',
            borderRadius: 10,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <div>
            <small style={{ color: '#64748b', fontSize: 11, display: 'block', fontWeight: 600 }}>
              DETECTED IN FORM:
            </small>
            <strong style={{ fontSize: 13, color: '#0f172a' }}>{currentUsedInProduct}</strong>
          </div>
          <button
            type="button"
            className="ar-btn-primary"
            style={{ padding: '6px 12px', fontSize: 12 }}
            onClick={() => handleLoadStoreProduct(currentUsedInProduct)}
            title="Load this product's formulation pyramid into AI Matcher"
          >
            <Sparkles size={13} />
            <span>Sync with AI Scent</span>
          </button>
        </div>
      )}

      {/* INTERACTIVE FRAGRANCE PYRAMID EDITOR */}
      <div
        style={{
          background: '#f8fafc',
          border: '1px solid var(--ar-border)',
          borderRadius: 12,
          padding: '14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <strong style={{ fontSize: 13, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Layers size={15} style={{ color: 'var(--ar-green)' }} />
            <span>Fragrance Note Pyramid</span>
          </strong>
          <span style={{ fontSize: 11, color: '#64748b' }}>
            {allUserNotes.length} notes active
          </span>
        </div>

        {/* 1. TOP NOTES (Head Notes) */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ▲ Top Notes (First 15m)
            </span>
            <small style={{ fontSize: 11, color: '#94a3b8' }}>Citrus, light florals, herbal sparkle</small>
          </div>

          {/* Quick presets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
            {QUICK_TOP_PRESETS.map((p) => {
              const active = topNotes.some((n) => n.toLowerCase() === p.toLowerCase());
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePreset(p, topNotes, setTopNotes)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: active ? '1px solid #d97706' : '1px solid #e2e8f0',
                    background: active ? '#fef3c7' : '#f8fafc',
                    color: active ? '#92400e' : '#475569',
                    transition: 'all 0.12s ease',
                  }}
                >
                  {active ? '✓ ' : '+ '}
                  {p}
                </button>
              );
            })}
          </div>

          {/* Tag Pill List */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
            {topNotes.map((n) => (
              <span
                key={n}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: '#fef3c7',
                  color: '#92400e',
                  fontSize: 11.5,
                  fontWeight: 700,
                }}
              >
                {n}
                <X
                  size={12}
                  style={{ cursor: 'pointer' }}
                  onClick={() => removeNote(setTopNotes, n, topNotes)}
                />
              </span>
            ))}
            <input
              type="text"
              placeholder="+ add top note..."
              value={newTopNote}
              onChange={(e) => setNewTopNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addNote(setTopNotes, newTopNote, topNotes);
                  setNewTopNote('');
                }
              }}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 11.5,
                color: '#111827',
                padding: '3px 6px',
                minWidth: 100,
              }}
            />
          </div>
        </div>

        {/* 2. HEART / MIDDLE NOTES */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#0284c7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ◆ Heart / Middle Notes (2–4h)
            </span>
            <small style={{ fontSize: 11, color: '#94a3b8' }}>Floral core, warm spices, aromatics</small>
          </div>

          {/* Quick presets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
            {QUICK_HEART_PRESETS.map((p) => {
              const active = heartNotes.some((n) => n.toLowerCase() === p.toLowerCase());
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePreset(p, heartNotes, setHeartNotes)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: active ? '1px solid #0284c7' : '1px solid #e2e8f0',
                    background: active ? '#e0f2fe' : '#f8fafc',
                    color: active ? '#0369a1' : '#475569',
                    transition: 'all 0.12s ease',
                  }}
                >
                  {active ? '✓ ' : '+ '}
                  {p}
                </button>
              );
            })}
          </div>

          {/* Tag Pill List */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
            {heartNotes.map((n) => (
              <span
                key={n}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: '#e0f2fe',
                  color: '#0369a1',
                  fontSize: 11.5,
                  fontWeight: 700,
                }}
              >
                {n}
                <X
                  size={12}
                  style={{ cursor: 'pointer' }}
                  onClick={() => removeNote(setHeartNotes, n, heartNotes)}
                />
              </span>
            ))}
            <input
              type="text"
              placeholder="+ add heart note..."
              value={newHeartNote}
              onChange={(e) => setNewHeartNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addNote(setHeartNotes, newHeartNote, heartNotes);
                  setNewHeartNote('');
                }
              }}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 11.5,
                color: '#111827',
                padding: '3px 6px',
                minWidth: 110,
              }}
            />
          </div>
        </div>

        {/* 3. BASE NOTES */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 10, padding: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ▼ Base Notes (6–12h+ Drydown)
            </span>
            <small style={{ fontSize: 11, color: '#94a3b8' }}>Oud, amber, musk, woody fixatives</small>
          </div>

          {/* Quick presets */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
            {QUICK_BASE_PRESETS.map((p) => {
              const active = baseNotes.some((n) => n.toLowerCase() === p.toLowerCase());
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePreset(p, baseNotes, setBaseNotes)}
                  style={{
                    padding: '2px 8px',
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: active ? '1px solid #16a34a' : '1px solid #e2e8f0',
                    background: active ? '#dcfce7' : '#f8fafc',
                    color: active ? '#15803d' : '#475569',
                    transition: 'all 0.12s ease',
                  }}
                >
                  {active ? '✓ ' : '+ '}
                  {p}
                </button>
              );
            })}
          </div>

          {/* Tag Pill List */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, alignItems: 'center' }}>
            {baseNotes.map((n) => (
              <span
                key={n}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 8px',
                  borderRadius: 6,
                  background: '#dcfce7',
                  color: '#15803d',
                  fontSize: 11.5,
                  fontWeight: 700,
                }}
              >
                {n}
                <X
                  size={12}
                  style={{ cursor: 'pointer' }}
                  onClick={() => removeNote(setBaseNotes, n, baseNotes)}
                />
              </span>
            ))}
            <input
              type="text"
              placeholder="+ add base note..."
              value={newBaseNote}
              onChange={(e) => setNewBaseNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addNote(setBaseNotes, newBaseNote, baseNotes);
                  setNewBaseNote('');
                }
              }}
              style={{
                border: 'none',
                outline: 'none',
                background: 'transparent',
                fontSize: 11.5,
                color: '#111827',
                padding: '3px 6px',
                minWidth: 100,
              }}
            />
          </div>
        </div>
      </div>

      {/* DUAL MATCH RESULTS TABS */}
      <div>
        <div
          style={{
            display: 'flex',
            borderRadius: 10,
            background: '#f1f5f9',
            padding: 4,
            marginBottom: 12,
            gap: 4,
          }}
        >
          <button
            type="button"
            onClick={() => setActiveTab('store')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: activeTab === 'store' ? 700 : 600,
              background: activeTab === 'store' ? '#ffffff' : 'transparent',
              color: activeTab === 'store' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'store' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            <Store size={15} style={{ color: activeTab === 'store' ? 'var(--ar-green)' : 'inherit' }} />
            <span>Motiwala In-Store ({storeMatches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('global')}
            style={{
              flex: 1,
              padding: '8px 10px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              fontSize: 12.5,
              fontWeight: activeTab === 'global' ? 700 : 600,
              background: activeTab === 'global' ? '#ffffff' : 'transparent',
              color: activeTab === 'global' ? '#0f172a' : '#64748b',
              boxShadow: activeTab === 'global' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              transition: 'all 0.15s ease',
            }}
          >
            <Globe size={15} style={{ color: activeTab === 'global' ? '#0284c7' : 'inherit' }} />
            <span>Global Benchmarks ({globalMatches.length})</span>
          </button>
        </div>

        {/* TAB 1: IN-STORE MOTIWALA MATCHES */}
        {activeTab === 'store' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 380, overflowY: 'auto' }}>
            {storeMatches.length === 0 ? (
              <div style={{ padding: '30px 15px', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
                <p style={{ margin: 0 }}>No direct store matches for this pyramid combination.</p>
                <small>Try selecting notes like Oud, Rose, Amber, Bergamot, or Musk.</small>
              </div>
            ) : (
              storeMatches.map(({ product, score, matchedNotes }) => (
                <div
                  key={product.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--ar-border)',
                    borderRadius: 10,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                    transition: 'transform 0.15s ease, border-color 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{ width: 44, height: 44, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }}
                    />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        <strong style={{ fontSize: 13.5, color: '#0f172a' }}>{product.name}</strong>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            padding: '1px 6px',
                            borderRadius: 999,
                            background: product.type === 'Attar' ? '#fef3c7' : '#e0f2fe',
                            color: product.type === 'Attar' ? '#92400e' : '#0369a1',
                          }}
                        >
                          {product.type}
                        </span>
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 800,
                            padding: '1px 7px',
                            borderRadius: 999,
                            background: 'rgba(153, 194, 41, 0.16)',
                            color: '#365314',
                            border: '1px solid rgba(153, 194, 41, 0.3)',
                          }}
                        >
                          {score}% Match
                        </span>
                      </div>
                      <p style={{ margin: '3px 0 0', fontSize: 11.5, color: '#64748b' }}>
                        Matched: <strong style={{ color: '#15803d' }}>{matchedNotes.join(', ')}</strong> · ₹{product.price}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="ar-btn-secondary"
                    style={{
                      padding: '6px 10px',
                      fontSize: 11.5,
                      fontWeight: 700,
                      color: '#273c09',
                      borderColor: '#99c229',
                      background: 'rgba(153, 194, 41, 0.1)',
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      if (onApplyUsedInProduct) {
                        onApplyUsedInProduct(`${product.name} (${product.type})`);
                        triggerFeedback(`Applied "${product.name}" to form!`);
                      }
                    }}
                    title="Insert this product into 'Used In Which Product' field on the left"
                  >
                    <span>Use in Form</span>
                    <ArrowRight size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: GLOBAL INTERNET BENCHMARK EQUIVALENTS */}
        {activeTab === 'global' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 380, overflowY: 'auto' }}>
            {globalMatches.length === 0 ? (
              <div style={{ padding: '30px 15px', textAlign: 'center', color: '#64748b', fontSize: 13 }}>
                <p style={{ margin: 0 }}>No benchmark equivalents found.</p>
                <small>Try selecting notes like Bergamot, Pineapple, Rose, Saffron, or Oud.</small>
              </div>
            ) : (
              globalMatches.map(({ fragrance, score, matchedNotes }) => (
                <div
                  key={fragrance.id}
                  style={{
                    background: '#ffffff',
                    border: '1px solid var(--ar-border)',
                    borderRadius: 10,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <strong style={{ fontSize: 14, color: '#0f172a' }}>{fragrance.name}</strong>
                      <small style={{ color: '#64748b', fontSize: 12 }}>({fragrance.house})</small>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 800,
                          padding: '1px 7px',
                          borderRadius: 999,
                          background: '#e0f2fe',
                          color: '#0369a1',
                          border: '1px solid #bae6fd',
                        }}
                      >
                        {score}% Benchmark Match
                      </span>
                    </div>

                    <p style={{ margin: '3px 0 2px', fontSize: 11.5, color: '#475569' }}>
                      {fragrance.vibe}
                    </p>

                    <div style={{ fontSize: 11, color: '#64748b' }}>
                      Matched Notes: <strong style={{ color: '#0369a1' }}>{matchedNotes.join(', ')}</strong>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="ar-btn-primary"
                    style={{
                      padding: '6px 12px',
                      fontSize: 11.5,
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                    onClick={() => {
                      if (onAdoptInspiration) {
                        onAdoptInspiration(`${fragrance.name} (${fragrance.house})`);
                        triggerFeedback(`Adopted "${fragrance.name}" as Inspiration!`);
                      }
                    }}
                    title="Insert this perfume as the Inspiration on the left form"
                  >
                    <Sparkles size={12} />
                    <span>Adopt Inspiration</span>
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

