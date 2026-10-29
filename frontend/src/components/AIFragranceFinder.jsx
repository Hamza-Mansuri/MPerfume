import { useMemo, useState } from 'react';
import { Sparkles, Search, WandSparkles } from 'lucide-react';
import ProductCarousel from './ProductCarousel.jsx';
import { getRecommendations } from '../lib/api.js';

const starterQueries = ['Oud + rose', 'Clean musk', 'Fresh for office', 'Sweet vanilla', 'Wedding attar'];

export default function AIFragranceFinder() {
  const [query, setQuery] = useState('oud');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const suggestions = useMemo(() => result?.suggestions || ['Make it sweeter', 'Make it fresher', 'Make it deeper'], [result]);

  async function runSearch(value = query, direction = '') {
    const q = value.trim();
    if (!q) return;
    setLoading(true);
    setQuery(q);
    const data = await getRecommendations(q, direction);
    setResult(data);
    setLoading(false);
  }

  return (
    <section className="ai-section shell" id="discover">
      <div className="ai-panel">
        <div className="ai-copy">
          <span className="pill"><Sparkles size={15}/> Scent Intelligence</span>
          <h2>Tell us a note.<br/><em>We’ll find your fragrance.</em></h2>
          <p>Search by ingredient, mood, occasion or fragrance family. Our discovery engine only recommends products that exist in the Motiwala catalog.</p>
          <div className="search-box">
            <Search size={20}/>
            <input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && runSearch()} placeholder="Try: oud, rose, vanilla, fresh office scent..." />
            <button onClick={() => runSearch()}>{loading ? 'Finding…' : 'Discover'}</button>
          </div>
          <div className="query-chips">
            {starterQueries.map((item) => <button key={item} onClick={() => runSearch(item)}>{item}</button>)}
          </div>
        </div>
        <div className="ai-orb-card">
          <div className="orb"><WandSparkles size={30}/></div>
          <p>“I want something rich, woody and warm for evenings.”</p>
          <div className="mini-match"><span>Best match</span><strong>Oud Royale</strong><small>Oud · Amber · Saffron · Musk</small></div>
        </div>
      </div>

      {result && (
        <div className="ai-results">
          <div className="result-head">
            <div><p className="eyebrow">AI recommendation</p><h3>{result.explanation}</h3></div>
            <div className="query-chips suggestion-chips">
              {suggestions.map((item) => <button key={item} onClick={() => runSearch(query, item)}>{item}</button>)}
            </div>
          </div>
          <ProductCarousel products={result.products} />
        </div>
      )}
    </section>
  );
}
