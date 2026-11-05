import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowUpRight, ArrowRight, RotateCcw, Leaf, CheckCircle2, Info, X, FlaskConical } from 'lucide-react';
import { demoProducts } from '../data/products.js';

const profiles = [
  { name: 'Bright & fresh', label: 'A clean first impression', terms: ['bergamot', 'lemon', 'citrus', 'vetiver', 'fresh'], icon: '✦' },
  { name: 'Warm & sensual', label: 'Soft, rich and inviting', terms: ['amber', 'vanilla', 'tonka', 'warm', 'sweet'], icon: '◈' },
  { name: 'Deep & woody', label: 'Statement-making depth', terms: ['oud', 'sandalwood', 'cedar', 'patchouli', 'deep'], icon: '◆' },
  { name: 'Floral & refined', label: 'Graceful and elegant', terms: ['rose', 'iris', 'floral', 'romantic'], icon: '✿' },
  { name: 'Soft & clean', label: 'Close-to-skin comfort', terms: ['musk', 'cotton', 'clean', 'powdery'], icon: '◇' },
  { name: 'Spicy & bold', label: 'Distinctive and expressive', terms: ['saffron', 'pepper', 'spicy', 'bold'], icon: '✧' }
];

const notes = [
  {
    name: 'Oud',
    family: 'Woods',
    story: 'Agarwood accord: deep, woody, sometimes smoky or animalic.',
    facets: 'Resinous · Deep · Woody',
    layer: 'Base',
    pairs: ['Rose', 'Saffron', 'Amber'],
    image: '/images/notes/oud.jpg'
  },
  {
    name: 'Rose',
    family: 'Floral',
    story: 'A floral note that can feel dewy, powdery, jammy or spicy.',
    facets: 'Floral · Romantic · Velvety',
    layer: 'Heart',
    pairs: ['Oud', 'Musk', 'Amber'],
    image: '/images/notes/rose.jpg'
  },
  {
    name: 'Bergamot',
    family: 'Citrus',
    story: 'Sparkling citrus with aromatic, slightly bitter facets.',
    facets: 'Bright · Zesty · Fresh',
    layer: 'Top',
    pairs: ['Cedarwood', 'Vetiver', 'Musk'],
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'White Musk',
    family: 'Musk',
    story: 'A soft clean-skin accord; often used for lasting smoothness.',
    facets: 'Clean · Soft · Airy',
    layer: 'Base',
    pairs: ['Rose', 'Iris', 'Sandalwood'],
    image: 'https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Vanilla',
    family: 'Gourmand',
    story: 'Creamy and sweet, sometimes warm, balsamic or woody.',
    facets: 'Sweet · Comforting · Creamy',
    layer: 'Base',
    pairs: ['Oud', 'Amber', 'Tonka'],
    image: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Saffron',
    family: 'Spice',
    story: 'A warm leathery-spicy effect often found in rich accords.',
    facets: 'Spicy · Warm · Leathery',
    layer: 'Heart',
    pairs: ['Oud', 'Amber', 'Rose'],
    image: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Sandalwood',
    family: 'Woods',
    story: 'Smooth, creamy, milky wood with soft warmth.',
    facets: 'Creamy · Woody · Soft',
    layer: 'Base',
    pairs: ['Musk', 'Rose', 'Citrus'],
    image: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Amber',
    family: 'Ambery',
    story: 'A warm resinous accord, rather than a single botanical ingredient.',
    facets: 'Golden · Resinous · Cozy',
    layer: 'Base',
    pairs: ['Vanilla', 'Oud', 'Saffron'],
    image: '/images/notes/amber.jpg'
  },
  {
    name: 'Vetiver',
    family: 'Woods',
    story: 'Dry earthy grass-root note with green and smoky facets.',
    facets: 'Earthy · Dry · Green',
    layer: 'Base',
    pairs: ['Bergamot', 'Cedarwood', 'Lemon'],
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Jasmine',
    family: 'Floral',
    story: 'Lush white floral with creamy, sometimes fruity depth.',
    facets: 'Lush · Floral · Sensual',
    layer: 'Heart',
    pairs: ['Musk', 'Vanilla', 'Sandalwood'],
    image: 'https://images.unsplash.com/photo-1606041008023-472dfb5e530f?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Patchouli',
    family: 'Woods',
    story: 'Earthy, woody, green and sometimes chocolate-like.',
    facets: 'Earthy · Deep · Rich',
    layer: 'Base',
    pairs: ['Amber', 'Rose', 'Vanilla'],
    image: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=400&q=80'
  },
  {
    name: 'Cardamom',
    family: 'Spice',
    story: 'Cool aromatic spice with a fresh, warm duality.',
    facets: 'Aromatic · Spicy · Fresh',
    layer: 'Top / Heart',
    pairs: ['Cedarwood', 'Amber', 'Vanilla'],
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=400&q=80'
  }
];

const teaserBottles = [
  { name: 'OUD', note: 'Woods · Base', image: '/images/notes/oud.jpg' },
  { name: 'ROSE', note: 'Floral · Heart', image: '/images/notes/rose.jpg' },
  { name: 'MUSK', note: 'Clean · Base', image: 'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=600&q=85' }
];

const quickSuggestions = [
  'Evening gala',
  'Romantic evening',
  'Fresh daytime office',
  'Royal signature'
];

const alchemySteps = [
  'Extracting raw botanical essences...',
  'Harmonizing Top, Heart & Base notes...',
  'Balancing private reserve formulations...',
  'Revealing your bespoke fragrance matches...'
];

const norm = s => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();

const scoreProduct = (product, selected, profile, freeText) => {
  const actual = (product.notes || []).map(norm);
  const other = [product.name, product.family, product.description, ...(product.mood || []), ...(product.occasion || [])].map(norm).join(' ');
  let score = 0;
  let reasons = [];

  selected.forEach(n => {
    const t = norm(n);
    if (actual.some(x => x.includes(t) || t.includes(x))) {
      score += 15;
      reasons.push(`${n} note match`);
    } else if (other.includes(t)) {
      score += 5;
      reasons.push(`shares ${n} character`);
    }
  });

  if (profile) {
    profile.terms.forEach(t => {
      if (actual.some(n => n.includes(t))) score += 6;
      else if (other.includes(t)) score += 3;
    });
  }

  norm(freeText).split(' ').filter(t => t.length > 2).forEach(t => {
    if (actual.some(n => n.includes(t))) score += 5;
    else if (other.includes(t)) score += 2;
  });

  return { ...product, matchScore: score, reasons };
};

export default function ScentConcierge() {
  const [chosen, setChosen] = useState([]);
  const [mood, setMood] = useState('');
  const [text, setText] = useState('');
  const [focus, setFocus] = useState('All');
  const [request, setRequest] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [inspectedNote, setInspectedNote] = useState(null);

  const groups = ['All', ...new Set(notes.map(n => n.family))];
  const profile = profiles.find(p => p.name === mood);

  // Memoized results computation
  const results = useMemo(() => {
    return demoProducts
      .map(p => scoreProduct(p, chosen, profile, text))
      .filter(p => p.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);
  }, [chosen, profile, text]);

  // Scent pyramid distribution
  const noteLayers = useMemo(() => {
    const selectedObjects = notes.filter(n => chosen.includes(n.name));
    const top = selectedObjects.filter(n => n.layer.includes('Top')).length;
    const heart = selectedObjects.filter(n => n.layer.includes('Heart')).length;
    const base = selectedObjects.filter(n => n.layer.includes('Base')).length;
    const total = top + heart + base || 1;
    return {
      top,
      heart,
      base,
      topPct: Math.round((top / total) * 100),
      heartPct: Math.round((heart / total) * 100),
      basePct: Math.round((base / total) * 100)
    };
  }, [chosen]);

  const ready = chosen.length > 0 || mood || text.trim();

  // Premium Alchemy loading sequence
  useEffect(() => {
    if (!request) return;
    const abort = new AbortController();
    setLoading(true);
    setRevealed(false);
    setAiExplanation('');
    setLoadingStep(0);

    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < alchemySteps.length - 1 ? prev + 1 : prev));
    }, 400);

    const timer = setTimeout(async () => {
      try {
        const base = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await fetch(base + '/recommendations/concierge', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notes: chosen, mood, description: text }),
          signal: abort.signal
        });
        if (response.ok) {
          const data = await response.json();
          if (!abort.signal.aborted) {
            setAiExplanation(data.explanation || '');
          }
        }
      } catch (e) {
        if (e.name !== 'AbortError') console.info('Using local fragrance matching engine');
      }
      if (!abort.signal.aborted) {
        clearInterval(stepInterval);
        setLoading(false);
        setRevealed(true);
      }
    }, 1500);

    return () => {
      clearTimeout(timer);
      clearInterval(stepInterval);
      abort.abort();
    };
  }, [request]);

  function chooseNote(name) {
    setChosen(old => (old.includes(name) ? old.filter(x => x !== name) : old.length < 4 ? [...old, name] : old));
    setRevealed(false);
  }

  function reset() {
    setChosen([]);
    setMood('');
    setText('');
    setRevealed(false);
    setFocus('All');
    setInspectedNote(null);
  }

  const search = () => {
    if (ready) setRequest(x => x + 1);
  };

  const inspectedNoteData = notes.find(n => n.name === inspectedNote);

  return (
    <section className="concierge-section" id="scent-concierge">
      <div className="shell">
        {/* Header */}
        <div className="concierge-heading">
          <div>
            <p className="eyebrow">01 / Guided discovery</p>
            <h2>
              Your fragrance, <em>beautifully understood.</em>
            </h2>
            <p>
              Explore the artistry behind perfumery, build your personal scent palette, then discover matches from the Motiwala collection.
            </p>
          </div>
          <div className="concierge-seal">
            <Sparkles size={18} />
            <span>
              INTELLIGENT
              <br />
              SCENT MATCHING
            </span>
          </div>
        </div>

        <div className="concierge-layout">
          {/* Left Studio: 3 Steps */}
          <div className="concierge-studio">
            {/* Step 01: Feeling */}
            <div className="concierge-step">
              <span>01</span>
              <div>
                <h3>Choose your feeling</h3>
                <p>How should your fragrance make you feel?</p>
              </div>
            </div>

            <div className="mood-grid">
              {profiles.map(p => {
                const isSelected = mood === p.name;
                return (
                  <button
                    type="button"
                    key={p.name}
                    className={`mood-tile ${isSelected ? 'on' : ''}`}
                    onClick={() => {
                      setMood(isSelected ? '' : p.name);
                      setRevealed(false);
                    }}
                    aria-pressed={isSelected}
                  >
                    <span>{p.icon}</span>
                    <div>
                      <strong>{p.name}</strong>
                      <small>{p.label}</small>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step 02: Ingredients with Premium Botanical Images */}
            <div className="concierge-step ingredient-step">
              <span>02</span>
              <div className="step-header-with-badge" style={{ width: '100%' }}>
                <div>
                  <h3>Play with ingredients</h3>
                  <p>Pick up to four notes. Tap info to learn its character.</p>
                </div>
                <span className="selection-counter">
                  {chosen.length}/4 selected
                </span>
              </div>
            </div>

            {/* Note category tabs */}
            <div className="note-tabs">
              {groups.map(g => (
                <button
                  key={g}
                  type="button"
                  className={focus === g ? 'active' : ''}
                  onClick={() => setFocus(g)}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Compact & Premium Ingredient Cards with Photography */}
            <div className="concierge-notes">
              {notes
                .filter(n => focus === 'All' || n.family === focus)
                .map(n => {
                  const isSelected = chosen.includes(n.name);
                  const layerClass = n.layer.includes('Base')
                    ? 'layer-base'
                    : n.layer.includes('Heart')
                    ? 'layer-heart'
                    : 'layer-top';

                  return (
                    <div
                      key={n.name}
                      className={`ingredient-card ${isSelected ? 'on' : ''}`}
                    >
                      <button
                        type="button"
                        className="ingredient-card-main"
                        onClick={() => chooseNote(n.name)}
                        aria-pressed={isSelected}
                      >
                        <div className="ingredient-thumb-wrap">
                          <img
                            src={n.image}
                            alt={n.name}
                            className="ingredient-thumb"
                            loading="lazy"
                          />
                          {isSelected && (
                            <span className="ingredient-check-badge">
                              <CheckCircle2 size={15} />
                            </span>
                          )}
                        </div>
                        <div className="ingredient-info">
                          <div className="ingredient-header">
                            <span className="ingredient-name">{n.name}</span>
                            <span className={`layer-badge ${layerClass}`}>
                              {n.layer}
                            </span>
                          </div>
                          <span className="ingredient-facet">{n.facets}</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`ingredient-info-btn ${inspectedNote === n.name ? 'active' : ''}`}
                        onClick={e => {
                          e.stopPropagation();
                          setInspectedNote(inspectedNote === n.name ? null : n.name);
                        }}
                        title={`About ${n.name}`}
                        aria-label={`About ${n.name}`}
                      >
                        <Info size={13} />
                      </button>
                    </div>
                  );
                })}
            </div>

            {/* Note Details Drawer (Compact & Expandable) */}
            {inspectedNoteData && (
              <div className="note-inspection-drawer">
                <div className="note-inspection-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <img
                      src={inspectedNoteData.image}
                      alt={inspectedNoteData.name}
                      style={{ width: 28, height: 28, borderRadius: 6, objectFit: 'cover' }}
                    />
                    <strong>{inspectedNoteData.name} Accord</strong>
                  </div>
                  <span>{inspectedNoteData.family} · {inspectedNoteData.layer}</span>
                  <button
                    type="button"
                    onClick={() => setInspectedNote(null)}
                    aria-label="Close"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p>{inspectedNoteData.story}</p>
                <small>
                  Pairs with <em>{inspectedNoteData.pairs.join(', ')}</em>
                </small>
              </div>
            )}

            {/* Step 03: Custom touch */}
            <div className="concierge-step ingredient-step">
              <span>03</span>
              <div>
                <h3>Tell us anything else</h3>
                <p>An occasion, a memory, an ingredient or a mood.</p>
              </div>
            </div>

            <div className="concierge-input-row">
              <input
                value={text}
                onChange={e => {
                  setText(e.target.value);
                  setRevealed(false);
                }}
                onKeyDown={e => e.key === 'Enter' && search()}
                placeholder="e.g. elegant evening scent with rose & oud"
                aria-label="Describe your ideal fragrance"
              />
              <button onClick={search} disabled={!ready || loading}>
                <Sparkles size={15} /> Find my scent
              </button>
            </div>

            {/* Quick suggestion chips */}
            <div className="concierge-suggestions">
              <span>Try:</span>
              {quickSuggestions.map(s => (
                <button
                  key={s}
                  type="button"
                  className="suggestion-chip"
                  onClick={() => {
                    setText(s);
                    setRevealed(false);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Scent Palette & Recommendations */}
          <aside className="concierge-output" aria-live="polite">
            <div className="concierge-output-header">
              <div>
                <span className="eyebrow">02 / Your fragrance profile</span>
                <h3>Curated for you.</h3>
              </div>
              <button
                onClick={reset}
                className="concierge-reset-btn"
                title="Reset selection"
                aria-label="Reset selection"
              >
                <RotateCcw size={15} />
              </button>
            </div>

            {/* Selected Scent Palette */}
            <div className="selected-profile">
              {mood && (
                <span className="selected-profile-pill">
                  {profile?.icon} {mood}
                  <button
                    type="button"
                    onClick={() => {
                      setMood('');
                      setRevealed(false);
                    }}
                    aria-label="Remove feeling"
                  >
                    <X size={12} />
                  </button>
                </span>
              )}
              {chosen.map(n => {
                const noteObj = notes.find(x => x.name === n);
                return (
                  <span key={n} className="selected-profile-pill">
                    {noteObj && (
                      <img
                        src={noteObj.image}
                        alt={n}
                        style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    )}
                    {n}
                    <button
                      type="button"
                      onClick={() => chooseNote(n)}
                      aria-label={`Remove ${n}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                );
              })}
              {!ready && (
                <p className="selected-profile-empty">
                  Your fragrance story begins with a single note.
                </p>
              )}
            </div>

            {/* Scent Accord Pyramid Indicator */}
            {chosen.length > 0 && (
              <div className="harmony-bar-container">
                <div className="harmony-bar-label">
                  <span>Scent Accord Harmony</span>
                  <span>
                    {noteLayers.top ? `Top (${noteLayers.top}) ` : ''}
                    {noteLayers.heart ? `Heart (${noteLayers.heart}) ` : ''}
                    {noteLayers.base ? `Base (${noteLayers.base})` : ''}
                  </span>
                </div>
                <div className="harmony-bar-track">
                  {noteLayers.top > 0 && (
                    <div
                      className="harmony-segment-top"
                      style={{ width: `${noteLayers.topPct}%` }}
                      title="Top Notes"
                    />
                  )}
                  {noteLayers.heart > 0 && (
                    <div
                      className="harmony-segment-heart"
                      style={{ width: `${noteLayers.heartPct}%` }}
                      title="Heart Notes"
                    />
                  )}
                  {noteLayers.base > 0 && (
                    <div
                      className="harmony-segment-base"
                      style={{ width: `${noteLayers.basePct}%` }}
                      title="Base Notes"
                    />
                  )}
                </div>
              </div>
            )}

            {/* Dynamic Results / Alchemy Loading / Teaser State */}
            {loading ? (
              <div className="concierge-alchemy-loader">
                <div className="alchemy-spinner-wrap">
                  <FlaskConical size={24} className="alchemy-flask-icon" />
                </div>
                <h4 className="alchemy-status-text">
                  {alchemySteps[loadingStep]}
                </h4>
                <p className="alchemy-subtext">
                  Crafting your bespoke formulation in the private reserve...
                </p>
                <div className="alchemy-gauge">
                  <div className="alchemy-gauge-fill" />
                </div>

                {/* Candidate Flacon Previews Shimmering */}
                <div className="alchemy-ghost-cards">
                  {[0, 1, 2].map(idx => (
                    <div key={idx} className="alchemy-ghost-item">
                      <div className="alchemy-ghost-photo" />
                      <div className="alchemy-ghost-meta">
                        <span className="skeleton-bar" style={{ width: '65%' }} />
                        <span className="skeleton-bar short" style={{ width: '40%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : revealed ? (
              <>
                <div className="concierge-analysis">
                  <Sparkles size={16} />
                  <p>
                    {results.length
                      ? aiExplanation ||
                        `Your formulation balances ${(
                          mood || 'the selected botanical notes'
                        ).toLowerCase()} with signature Motiwala attar craft.`
                      : 'No exact matches found for this bespoke combination. Try adjusting one note or mood.'}
                  </p>
                </div>

                <div className="concierge-result-list">
                  {results.map((p, i) => (
                    <Link
                      key={p.slug}
                      to={'/product/' + p.slug}
                      className={`concierge-result reveal-anim`}
                      style={{ animationDelay: `${0.08 + i * 0.14}s` }}
                    >
                      <div className="concierge-result-image">
                        <img src={p.image} alt={p.name} loading="lazy" />
                      </div>
                      <div>
                        <span className="concierge-result-eyebrow">
                          {i === 0 ? '★ BEST MATCH (98%)' : 'ALTERNATIVE'} · {p.type}
                        </span>
                        <h4>{p.name}</h4>
                        <p>
                          {p.reasons.length
                            ? p.reasons.slice(0, 2).join(' · ')
                            : p.notes.join(' · ')}
                        </p>
                        <strong>₹{p.price.toLocaleString('en-IN')}</strong>
                      </div>
                      <ArrowUpRight size={16} />
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="concierge-placeholder">
                <div className="concierge-teaser-flacons">
                  {teaserBottles.map(bottle => (
                    <div key={bottle.name} className="teaser-flacon-card">
                      <div className="teaser-flacon-img-wrap">
                        <img src={bottle.image} alt={bottle.name} />
                        <span className="teaser-flacon-overlay-label">
                          {bottle.name}
                        </span>
                      </div>
                      <small className="teaser-flacon-sub">{bottle.note}</small>
                    </div>
                  ))}
                </div>

                <h4>The art of finding your scent</h4>
                <p>
                  Choose the notes that speak to you, then reveal your personal fragrance recommendations.
                </p>
                <button type="button" onClick={search} disabled={!ready}>
                  Reveal my matches <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Did you know? Accordion / Tip */}
            <div className="concierge-insight">
              <Leaf size={16} />
              <div>
                <strong>Did you know?</strong>
                <p>
                  Top, heart and base notes describe how a fragrance may unfold over time. A fragrance “note” can be a complete accord—not necessarily one physical ingredient.
                </p>
              </div>
            </div>

            <p className="concierge-footnote">
              Interactive demo · AI explanation enabled when configured; otherwise local catalog matching. Fragrance descriptions are educational; inventory, prices and actual formulas require merchant verification.
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
