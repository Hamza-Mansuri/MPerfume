import {useMemo,useState,useEffect} from 'react';
import {Link} from 'react-router-dom';
import {Sparkles,ArrowUpRight,ArrowRight,RotateCcw,Leaf,Layers,CheckCircle2} from 'lucide-react';
import {demoProducts} from '../data/products.js';

const profiles=[
 {name:'Bright & fresh',label:'A clean first impression',terms:['bergamot','lemon','citrus','vetiver','fresh'],icon:'✦'},
 {name:'Warm & sensual',label:'Soft, rich and inviting',terms:['amber','vanilla','tonka','warm','sweet'],icon:'◈'},
 {name:'Deep & woody',label:'Statement-making depth',terms:['oud','sandalwood','cedar','patchouli','deep'],icon:'◆'},
 {name:'Floral & refined',label:'Graceful and elegant',terms:['rose','iris','floral','romantic'],icon:'✿'},
 {name:'Soft & clean',label:'Close-to-skin comfort',terms:['musk','cotton','clean','powdery'],icon:'◇'},
 {name:'Spicy & bold',label:'Distinctive and expressive',terms:['saffron','pepper','spicy','bold'],icon:'✧'}
];
const notes=[
 {name:'Oud',family:'Woods',story:'Agarwood accord: deep, woody, sometimes smoky or animalic.',facets:'Resinous · Deep · Woody',layer:'Base',pairs:['Rose','Saffron','Amber']},
 {name:'Rose',family:'Floral',story:'A floral note that can feel dewy, powdery, jammy or spicy.',facets:'Floral · Romantic · Velvety',layer:'Heart',pairs:['Oud','Musk','Amber']},
 {name:'Bergamot',family:'Citrus',story:'Sparkling citrus with aromatic, slightly bitter facets.',facets:'Bright · Zesty · Fresh',layer:'Top',pairs:['Cedarwood','Vetiver','Musk']},
 {name:'White Musk',family:'Musk',story:'A soft clean-skin accord; often used for lasting smoothness.',facets:'Clean · Soft · Airy',layer:'Base',pairs:['Rose','Iris','Sandalwood']},
 {name:'Vanilla',family:'Gourmand',story:'Creamy and sweet, sometimes warm, balsamic or woody.',facets:'Sweet · Comforting · Creamy',layer:'Base',pairs:['Oud','Amber','Tonka']},
 {name:'Saffron',family:'Spice',story:'A warm leathery-spicy effect often found in rich accords.',facets:'Spicy · Warm · Leathery',layer:'Heart',pairs:['Oud','Amber','Rose']},
 {name:'Sandalwood',family:'Woods',story:'Smooth, creamy, milky wood with soft warmth.',facets:'Creamy · Woody · Soft',layer:'Base',pairs:['Musk','Rose','Citrus']},
 {name:'Amber',family:'Ambery',story:'A warm resinous accord, rather than a single botanical ingredient.',facets:'Golden · Resinous · Cozy',layer:'Base',pairs:['Vanilla','Oud','Saffron']},
 {name:'Vetiver',family:'Woods',story:'Dry earthy grass-root note with green and smoky facets.',facets:'Earthy · Dry · Green',layer:'Base',pairs:['Bergamot','Cedarwood','Lemon']},
 {name:'Jasmine',family:'Floral',story:'Lush white floral with creamy, sometimes fruity depth.',facets:'Lush · Floral · Sensual',layer:'Heart',pairs:['Musk','Vanilla','Sandalwood']},
 {name:'Patchouli',family:'Woods',story:'Earthy, woody, green and sometimes chocolate-like.',facets:'Earthy · Deep · Rich',layer:'Base',pairs:['Amber','Rose','Vanilla']},
 {name:'Cardamom',family:'Spice',story:'Cool aromatic spice with a fresh, warm duality.',facets:'Aromatic · Spicy · Fresh',layer:'Top / Heart',pairs:['Cedarwood','Amber','Vanilla']}
];
const norm=s=>String(s||'').toLowerCase().replace(/[^a-z0-9 ]/g,' ').trim();
const scoreProduct=(product,selected,profile,freeText)=>{
 const actual=(product.notes||[]).map(norm),other=[product.name,product.family,product.description,...(product.mood||[]),...(product.occasion||[])].map(norm).join(' ');let score=0;let reasons=[];
 selected.forEach(n=>{const t=norm(n);if(actual.some(x=>x.includes(t)||t.includes(x))){score+=15;reasons.push(n+' is listed in its scent notes')}else if(other.includes(t)){score+=4;reasons.push('shares the '+n+' character')}});
 if(profile){profile.terms.forEach(t=>{if(actual.some(n=>n.includes(t)))score+=5;else if(other.includes(t))score+=3})}
 norm(freeText).split(' ').filter(t=>t.length>2).forEach(t=>{if(actual.some(n=>n.includes(t)))score+=5;else if(other.includes(t))score+=2});
 return {...product,matchScore:score,reasons};
};
export default function ScentConcierge(){
 const [chosen,setChosen]=useState([]);
 const [mood,setMood]=useState('');
 const [text,setText]=useState('');
 const [focus,setFocus]=useState('All');
 const [request,setRequest]=useState(0);
 const [loading,setLoading]=useState(false);
 const [revealed,setRevealed]=useState(false);
 const [aiExplanation,setAiExplanation]=useState('');
 const [aiMode,setAiMode]=useState('catalog-matching');
 const groups=['All',...new Set(notes.map(n=>n.family))];
 const profile=profiles.find(p=>p.name===mood);
 const results=useMemo(()=>demoProducts.map(p=>scoreProduct(p,chosen,profile,text)).filter(p=>p.matchScore>0).sort((a,b)=>b.matchScore-a.matchScore).slice(0,3),[chosen,profile,text]);
 const ready=chosen.length>0||mood||text.trim();
 useEffect(()=>{
  if(!request)return;
  const abort=new AbortController();
  setLoading(true);setRevealed(false);setAiExplanation('');setAiMode('catalog-matching');
  const timer=setTimeout(async()=>{
   try{
    const base=import.meta.env.VITE_API_URL||'http://localhost:5000/api';
    const response=await fetch(base+'/recommendations/concierge',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({notes:chosen,mood,description:text}),signal:abort.signal});
    if(response.ok){const data=await response.json();if(!abort.signal.aborted){setAiExplanation(data.explanation||'');setAiMode(data.mode||'catalog-matching')}}
   }catch(e){if(e.name!=='AbortError')console.info('Using local fragrance matching')}
   if(!abort.signal.aborted){setLoading(false);setRevealed(true)}
  },500);
  return()=>{clearTimeout(timer);abort.abort()};
 },[request]);
 function chooseNote(name){setChosen(old=>old.includes(name)?old.filter(x=>x!==name):old.length<4?[...old,name]:old);setRevealed(false)}
 function reset(){setChosen([]);setMood('');setText('');setRevealed(false);setFocus('All')}
 const search=()=>{if(ready)setRequest(x=>x+1)};
 return <section className="concierge-section" id="scent-concierge"><div className="shell">
  <div className="concierge-heading"><div><p className="eyebrow">01 / Guided discovery</p><h2>Your fragrance, <em>beautifully understood.</em></h2><p>Explore the artistry behind perfumery, build your personal scent palette, then discover matches from the Motiwala collection.</p></div><div className="concierge-seal"><Sparkles size={20}/><span>INTELLIGENT<br/>SCENT MATCHING</span></div></div>
  <div className="concierge-layout"><div className="concierge-studio">
    <div className="concierge-step"><span>01</span><div><h3>Choose your feeling</h3><p>How should your fragrance make you feel?</p></div></div>
    <div className="mood-grid">{profiles.map(p=><button type="button" key={p.name} className={'mood-tile '+(mood===p.name?'on':'')} onClick={()=>{setMood(mood===p.name?'':p.name);setRevealed(false)}}><span>{p.icon}</span><strong>{p.name}</strong><small>{p.label}</small></button>)}</div>
    <div className="concierge-step ingredient-step"><span>02</span><div><h3>Play with ingredients</h3><p>Pick up to four notes. Tap any note to learn its character.</p></div></div>
    <div className="note-tabs">{groups.map(g=><button key={g} className={focus===g?'active':''} onClick={()=>setFocus(g)}>{g}</button>)}</div>
    <div className="concierge-notes">{notes.filter(n=>focus==='All'||n.family===focus).map(n=><button type="button" key={n.name} className={'ingredient-tile '+(chosen.includes(n.name)?'on':'')} onClick={()=>chooseNote(n.name)} aria-pressed={chosen.includes(n.name)}><div className="ingredient-tile-top"><span>{n.family} · {n.layer}</span>{chosen.includes(n.name)&&<CheckCircle2 size={16}/>}</div><strong>{n.name}</strong><small>{n.facets}</small><p>{n.story}</p><i>Pairs with {n.pairs.join(', ')}</i></button>)}</div>
    <div className="concierge-step ingredient-step"><span>03</span><div><h3>Tell us anything else</h3><p>An occasion, a memory, an ingredient or a mood.</p></div></div><div className="concierge-input-row"><input value={text} onChange={e=>{setText(e.target.value);setRevealed(false)}} onKeyDown={e=>e.key==='Enter'&&search()} placeholder="e.g. elegant evening scent with rose & oud" aria-label="Describe your ideal fragrance"/><button onClick={search} disabled={!ready||loading}><Sparkles size={16}/> Find my scent</button></div>
  </div><aside className="concierge-output" aria-live="polite"><div className="concierge-output-header"><div><span className="eyebrow">02 / Your fragrance profile</span><h3>Curated for you.</h3></div><button onClick={reset} aria-label="Reset choices"><RotateCcw size={17}/></button></div>
    <div className="selected-profile">{mood&&<span>{mood}</span>}{chosen.map(n=><span key={n}>{n}</span>)}{!ready&&<p>Your fragrance story begins with a single note.</p>}</div>
    {loading?<div className="concierge-skeleton"><span className="skeleton-bar"/><span className="skeleton-bar short"/>{[1,2,3].map(n=><div key={n} className="skeleton-card"><div className="skeleton-photo"/><div><span className="skeleton-bar"/><span className="skeleton-bar short"/><span className="skeleton-bar"/></div></div>)}</div>:revealed?<><div className="concierge-analysis"><Sparkles size={18}/><p>{results.length?''+(aiExplanation||('Your profile leans toward '+(mood||'the notes you selected').toLowerCase()+'. These recommendations are ranked by catalog note overlap and scent character.'))+'':'No matching product is listed in this demo catalog yet. Try a different note or mood.'}</p></div><div className="concierge-result-list">{results.map((p,i)=><Link key={p.slug} to={'/product/'+p.slug} className="concierge-result"><div className="concierge-result-image"><img src={p.image} alt={p.name} loading="lazy"/></div><div><span className="concierge-result-eyebrow">{i===0?'BEST MATCH':'ALTERNATIVE'} · {p.type}</span><h4>{p.name}</h4><p>{p.reasons.length?p.reasons.slice(0,2).join(' · '):p.notes.join(' · ')}</p><strong>₹{p.price.toLocaleString('en-IN')}</strong></div><ArrowUpRight size={18}/></Link>)}</div></>:<div className="concierge-placeholder"><div className="concierge-illustration"><span>OUD</span><span>ROSE</span><span>MUSK</span></div><h4>The art of finding your scent</h4><p>Choose the notes that speak to you, then reveal your personal fragrance recommendations.</p><button onClick={search} disabled={!ready}>Reveal my matches <ArrowRight size={16}/></button></div>}
    <div className="concierge-insight"><Leaf size={18}/><div><strong>Did you know?</strong><p>Top, heart and base notes describe how a fragrance may unfold over time. A fragrance “note” can be a complete accord—not necessarily one physical ingredient.</p></div></div>
    <p className="concierge-footnote">Interactive demo · {"AI explanation enabled when configured; otherwise local catalog matching."} Fragrance descriptions are educational; inventory, prices and actual formulas require merchant verification.</p>
  </aside></div></div></section>;
