const aliases = {
  woody: ['oud','cedar','cedarwood','sandalwood','vetiver','patchouli'],
  sweet: ['vanilla','tonka','amber','gourmand'],
  fresh: ['bergamot','lemon','citrus','vetiver','clean','cotton'],
  floral: ['rose','iris','jasmine','floral'],
  musky: ['musk','white musk'],
  warm: ['amber','vanilla','oud','saffron','tonka'],
  deep: ['oud','patchouli','amber','leather','smoky'],
  clean: ['white musk','cotton','iris','fresh']
};

function normalizeTerms(input='') {
  const raw = input.toLowerCase().replace(/[^a-z0-9\s+-]/g,' ').split(/\s+/).filter(Boolean);
  const expanded = new Set(raw);
  raw.forEach((term) => (aliases[term] || []).forEach((x) => expanded.add(x)));
  return [...expanded];
}

export function scoreProduct(product, input='') {
  const terms = normalizeTerms(input);
  const notes = (product.notes || []).map((x)=>x.toLowerCase());
  const moods = (product.mood || []).map((x)=>x.toLowerCase());
  const haystack = [product.name,product.type,product.family,product.description,...notes,...moods,...(product.season||[]),...(product.occasion||[])].join(' ').toLowerCase();
  return terms.reduce((score, term) => {
    let next = score;
    if (notes.some((n)=>n.includes(term))) next += 5;
    if (moods.some((m)=>m.includes(term))) next += 4;
    if ((product.family||'').toLowerCase().includes(term)) next += 4;
    if (haystack.includes(term)) next += 2;
    return next;
  }, 0) + (product.featured ? 0.5 : 0);
}

export function rankProducts(products, input='') {
  return products.map((product)=>({product,score:scoreProduct(product,input)})).filter((x)=>x.score>0).sort((a,b)=>b.score-a.score).map((x)=>x.product);
}

export function buildSuggestions(query='') {
  const q = query.toLowerCase();
  if (q.includes('oud')) return ['Sweeter with vanilla','Cleaner with musk','Warmer with amber'];
  if (q.includes('rose')) return ['Deeper with oud','Softer with musk','Sweeter with vanilla'];
  if (q.includes('fresh') || q.includes('citrus')) return ['Drier with cedar','Greener with vetiver','Softer with musk'];
  if (q.includes('vanilla')) return ['Deeper with oud','Less sweet with cedar','Cleaner with musk'];
  return ['Make it sweeter','Make it fresher','Make it deeper'];
}

export function directionToTerms(direction='') {
  const d = direction.toLowerCase();
  if (d.includes('sweeter')) return 'vanilla amber tonka sweet';
  if (d.includes('fresher')) return 'bergamot citrus vetiver fresh';
  if (d.includes('deeper')) return 'oud patchouli amber deep';
  if (d.includes('musk')) return 'white musk clean musk';
  if (d.includes('amber')) return 'amber warm';
  if (d.includes('cedar')) return 'cedarwood woody dry';
  if (d.includes('vetiver')) return 'vetiver green fresh';
  return direction;
}
