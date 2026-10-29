import {useMemo,useState} from 'react';
import {Link} from 'react-router-dom';
import {ArrowRight,Check,ChevronRight,FlaskConical,RotateCcw,Sparkles,Search,SlidersHorizontal} from 'lucide-react';
import {demoProducts} from '../data/products.js';

const families=[
{key:'Floral',desc:'Romantic & expressive',notes:['Rose','Jasmine','Iris','Peony','Orange Blossom','Tuberose'],color:'#b07b7d'},
{key:'Woody',desc:'Deep & grounded',notes:['Oud','Sandalwood','Cedarwood','Vetiver','Patchouli','Guaiac Wood'],color:'#866d52'},
{key:'Amber',desc:'Warm & enveloping',notes:['Amber','Benzoin','Labdanum','Myrrh','Frankincense','Tonka'],color:'#c69a54'},
{key:'Fresh',desc:'Bright & effortless',notes:['Bergamot','Lemon','Grapefruit','Mandarin','Mint','Green Tea'],color:'#7b927f'},
{key:'Gourmand',desc:'Soft & indulgent',notes:['Vanilla','Cacao','Caramel','Coffee','Praline','Honey'],color:'#a87e68'},
{key:'Musk',desc:'Clean & intimate',notes:['White Musk','Musk','Ambrette','Cotton','Powder','Cashmere'],color:'#a8a2a0'},
{key:'Spicy',desc:'Bold & distinctive',notes:['Saffron','Cardamom','Cinnamon','Black Pepper','Clove','Nutmeg'],color:'#b77c59'}
];
const aliases={oud:['agarwood','woody','deep'],rose:['floral','romantic'],vanilla:['sweet','gourmand'],musk:['clean','powdery'],bergamot:['citrus','fresh'],sandalwood:['creamy','woody'],amber:['warm','resinous'],saffron:['warm','spicy']};
const clean=s=>String(s||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();
const texts=p=>[p.name,p.family,p.description,...(p.notes||[]),...(p.mood||[]),...(p.occasion||[]),...(p.season||[])].map(clean);
function rank(p,notes,query,mood){
 const data=texts(p), itemNotes=(p.notes||[]).map(clean);
 let score=0;
 for(const n of notes){const term=clean(n);if(itemNotes.some(x=>x.includes(term)||term.includes(x)))score+=13;else if(data.some(x=>x.includes(term)))score+=4;else if((aliases[term]||[]).some(x=>data.some(t=>t.includes(x))))score+=2;}
 for(const t of clean(query).split(' ').filter(x=>x.length>2)){if(itemNotes.some(x=>x.includes(t)))score+=6;else if(data.some(x=>x.includes(t)))score+=2;}
 if(mood&&data.some(x=>x.includes(clean(mood))))score+=5;
 return score;
}
export default function IngredientAtelier(){
 const [selected,setSelected]=useState([]);
 const [query,setQuery]=useState('');
 const [mood,setMood]=useState('');
 const [onlyMatches,setOnlyMatches]=useState(false);
 const toggle=n=>setSelected(s=>s.includes(n)?s.filter(x=>x!==n):s.length<5?[...s,n]:s);
 const ranked=useMemo(()=>demoProducts.map(p=>({...p,matchScore:rank(p,selected,query,mood)})).sort((a,b)=>b.matchScore-a.matchScore),[selected,query,mood]);
 const active=selected.length||query.trim()||mood;
 const results=onlyMatches&&active?ranked.filter(p=>p.matchScore>0):ranked;
 const suggestions=useMemo(()=>{
  const pairs=[['Oud','Rose','A classic woody-floral direction'],['Rose','White Musk','Soft, romantic and close to skin'],['Vanilla','Amber','A warmer, sweeter direction'],['Bergamot','Cedarwood','Freshness with a dry woody finish'],['Saffron','Oud','Rich, spicy and evening-ready']];
  return pairs.filter(p=>selected.length===0||p.slice(0,2).some(n=>selected.includes(n))).slice(0,3);
 },[selected]);
 return <section className="atelier-section" id="ingredient-atelier">
  <div className="shell">
   <div className="atelier-intro"><p className="eyebrow">The Motiwala scent atelier · interactive discovery</p><h2>Explore ingredients.<br/><em>Discover your signature.</em></h2><p>Build a scent profile using real fragrance notes. Discover attars and perfumes from our catalog that share your preferences — without invented products or prices.</p></div>
   <div className="atelier-layout">
    <div className="atelier-controls">
     <div className="atelier-control-head"><span><FlaskConical size={17}/> Your scent palette</span><button className="atelier-clear" onClick={()=>{setSelected([]);setQuery('');setMood('');setOnlyMatches(false)}}><RotateCcw size={14}/> Clear</button></div>
     <label className="atelier-search"><Search size={18}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search an ingredient or a feeling..." aria-label="Search fragrance ingredient"/></label>
     <p className="atelier-caption">SELECT UP TO FIVE NOTES · {selected.length}/5</p>
     <div className="atelier-selected">{selected.length?selected.map(n=><button key={n} className="atelier-selected-chip" onClick={()=>toggle(n)}>{n} ×</button>):<span>Try oud, rose, amber, bergamot, musk…</span>}</div>
     <div className="atelier-families">{families.map(f=><div className="atelier-family" key={f.key}><div className="atelier-family-head"><span className="family-dot" style={{background:f.color}}/><strong>{f.key}</strong><small>{f.desc}</small></div><div className="atelier-note-row">{f.notes.map(n=><button type="button" key={n} aria-pressed={selected.includes(n)} className={selected.includes(n)?'selected':''} onClick={()=>toggle(n)}>{selected.includes(n)&&<Check size={12}/>} {n}</button>)}</div></div>)}</div>
     <label className="atelier-caption" htmlFor="atelier-mood">WHAT SHOULD IT FEEL LIKE?</label><select id="atelier-mood" value={mood} onChange={e=>setMood(e.target.value)} className="atelier-select"><option value="">Any mood or occasion</option><option value="clean">Clean and subtle</option><option value="warm">Warm and comforting</option><option value="deep">Deep and luxurious</option><option value="fresh">Fresh for daytime</option><option value="romantic">Romantic and floral</option><option value="office">Office and everyday</option><option value="wedding">Wedding and festive</option></select>
    </div>
    <div className="atelier-results">
      <div className="atelier-results-top"><div><span className="eyebrow">Curated for your palette</span><h3>{active?'Your closest fragrance matches':'Begin with a signature scent'}</h3><p>{active?'Matches are based on note overlap, scent descriptions and mood — not a claim of exact formula composition.':'Choose ingredients on the left to personalise this collection.'}</p></div><Sparkles size={23}/></div>
      <label className="atelier-switch"><input type="checkbox" checked={onlyMatches} onChange={e=>setOnlyMatches(e.target.checked)}/> Show only matching fragrances</label>
      {results.length===0?<div className="atelier-empty"><SlidersHorizontal size={28}/><h4>No exact catalog match yet</h4><p>Try removing one note, or explore related scent families. We never fabricate products.</p></div>:<div className="atelier-match-list">{results.slice(0,4).map((p,index)=><Link to={`/product/${p.slug}`} className="atelier-match-card" key={p.slug}><div className="atelier-match-photo"><img src={p.image} alt={p.name} loading="lazy"/></div><div className="atelier-match-copy"><small>{index===0&&active?'TOP MATCH · ':''}{p.type} · {p.family}</small><strong>{p.name}</strong><span>{p.notes.join(' · ')}</span><b>₹{p.price.toLocaleString('en-IN')} <small> / {p.size}</small></b></div><ChevronRight className="atelier-match-arrow" size={18}/></Link>)}</div>}
      <div className="atelier-combinations"><div><p className="eyebrow">The art of combining</p><h4>What if you added another note?</h4></div>{suggestions.map(([a,b,description])=><button key={a+b} onClick={()=>{setSelected([a,b]);setOnlyMatches(true)}}><span><strong>{a} + {b}</strong><small>{description}</small></span><ArrowRight size={16}/></button>)}<p className="atelier-disclaimer">These are scent-direction suggestions, not instructions to physically mix perfume concentrates. Recommendations show existing demo products only; final notes and stock must be approved by Motiwala.</p></div>
    </div>
   </div>
  </div>
 </section>;
}
