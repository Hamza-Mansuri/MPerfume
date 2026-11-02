import { demoProducts } from '../data/products.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function searchProducts(query) {
  if (!query?.trim()) return demoProducts;
  try {
    const response = await fetch(`${API_URL}/products/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('API unavailable');
    const data = await response.json();
    return data.products || [];
  } catch {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    return demoProducts
      .map((product) => {
        const haystack = [product.name, product.type, product.family, ...product.notes, ...product.mood].join(' ').toLowerCase();
        return { product, score: terms.reduce((sum, term) => sum + (haystack.includes(term) ? 3 : 0), 0) };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((item) => item.product);
  }
}

export async function getProduct(slug) {
  try {
    const response = await fetch(`${API_URL}/products/${slug}`);
    if (!response.ok) throw new Error('API unavailable');
    const data = await response.json();
    return data.product;
  } catch {
    return demoProducts.find((product) => product.slug === slug);
  }
}

export async function getRecommendations(query, direction = '') {
  try {
    const response = await fetch(`${API_URL}/recommendations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, direction })
    });
    if (!response.ok) throw new Error('API unavailable');
    return response.json();
  } catch {
    const enriched = `${query} ${direction}`.trim();
    const products = await searchProducts(enriched);
    return {
      explanation: buildFallbackExplanation(query, direction),
      suggestions: suggestionMap(direction || query),
      products: products.length ? products : demoProducts.slice(0, 4)
    };
  }
}

function suggestionMap(value = '') {
  const v = value.toLowerCase();
  if (v.includes('oud') || v.includes('deep')) return ['Sweeter with vanilla', 'Cleaner with musk', 'Warmer with amber'];
  if (v.includes('rose') || v.includes('floral')) return ['Deeper with oud', 'Softer with musk', 'Sweeter with vanilla'];
  if (v.includes('fresh') || v.includes('citrus')) return ['Drier with cedar', 'Greener with vetiver', 'Softer with musk'];
  return ['Make it sweeter', 'Make it fresher', 'Make it deeper'];
}

function buildFallbackExplanation(query, direction) {
  if (direction) return `If you want ${query || 'this profile'} to feel ${direction.toLowerCase()}, these catalog matches move the scent in that direction.`;
  return `These fragrances are the closest catalog matches for “${query}”, ranked by notes, scent family and mood.`;
}


// ============================================================================
// CNO (Chief Nose Officer) Sample Management & Database API
// ============================================================================

export async function getNextCnoSerial() {
  try {
    const res = await fetch(`${API_URL}/cno/next-serial`);
    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();
    return data.nextSerial;
  } catch {
    const year = new Date().getFullYear();
    const local = JSON.parse(localStorage.getItem('mp_cno_samples') || '[]');
    const nextNum = local.length + 1;
    return `CNO-${year}-${String(nextNum).padStart(4, '0')}`;
  }
}

export async function getCnoProductSuggestions(query = '') {
  try {
    const res = await fetch(`${API_URL}/cno/suggestions?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();
    return data.suggestions || [];
  } catch {
    const q = query.toLowerCase().trim();
    return demoProducts
      .filter((p) => {
        if (!q) return true;
        const haystack = `${p.name} ${p.family || ''} ${p.type || ''} ${(p.notes || []).join(' ')}`.toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, 8)
      .map((p) => ({
        id: p.slug,
        name: p.name,
        type: p.type || 'Perfume',
        family: p.family || 'Fragrance',
        notes: p.notes || [],
        price: p.price,
        slug: p.slug,
      }));
  }
}

export async function createCnoSample(sampleData) {
  try {
    const res = await fetch(`${API_URL}/cno`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sampleData),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || 'Failed to save CNO Sample');
    }
    const result = await res.json();
    syncSampleToLocalStorage(result.sample);
    return result.sample;
  } catch (err) {
    console.warn('Backend API request failed, persisting to local storage backup:', err.message);
    const fallbackSample = {
      ...sampleData,
      _id: 'local_' + Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    syncSampleToLocalStorage(fallbackSample);
    return fallbackSample;
  }
}

export async function getCnoSamples(params = {}) {
  const queryParams = new URLSearchParams();
  if (params.q) queryParams.set('q', params.q);
  if (params.idealFor) queryParams.set('idealFor', params.idealFor);
  if (params.profile) queryParams.set('profile', params.profile);
  if (params.supplier) queryParams.set('supplier', params.supplier);
  if (params.status) queryParams.set('status', params.status);
  if (params.page) queryParams.set('page', params.page);
  if (params.limit) queryParams.set('limit', params.limit);

  try {
    const res = await fetch(`${API_URL}/cno?${queryParams.toString()}`);
    if (!res.ok) throw new Error('API unavailable');
    const data = await res.json();
    return data;
  } catch {
    const local = JSON.parse(localStorage.getItem('mp_cno_samples') || '[]');
    let filtered = [...local];
    if (params.q) {
      const q = params.q.toLowerCase();
      filtered = filtered.filter((s) =>
        [s.serialNo, s.supplierName, s.code, s.inspiration, s.usedInProduct, s.profile]
          .join(' ')
          .toLowerCase()
          .includes(q)
      );
    }
    if (params.idealFor && params.idealFor !== 'All') {
      filtered = filtered.filter((s) => s.idealFor === params.idealFor);
    }
    if (params.profile && params.profile !== 'All') {
      filtered = filtered.filter((s) => s.profile === params.profile);
    }
    return {
      success: true,
      total: filtered.length,
      page: 1,
      totalPages: 1,
      samples: filtered,
    };
  }
}

export async function deleteCnoSample(id) {
  try {
    const res = await fetch(`${API_URL}/cno/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete sample');
  } catch {
    // Local fallback
  }
  const local = JSON.parse(localStorage.getItem('mp_cno_samples') || '[]');
  const updated = local.filter((s) => (s._id || s.id) !== id);
  localStorage.setItem('mp_cno_samples', JSON.stringify(updated));
  return true;
}

function syncSampleToLocalStorage(sample) {
  try {
    const local = JSON.parse(localStorage.getItem('mp_cno_samples') || '[]');
    const existingIndex = local.findIndex((s) => (s._id || s.id) === (sample._id || sample.id));
    if (existingIndex >= 0) {
      local[existingIndex] = sample;
    } else {
      local.unshift(sample);
    }
    localStorage.setItem('mp_cno_samples', JSON.stringify(local));
  } catch (e) {
    console.error('LocalStorage sync error:', e);
  }
}
