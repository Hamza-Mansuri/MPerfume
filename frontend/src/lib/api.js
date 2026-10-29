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
