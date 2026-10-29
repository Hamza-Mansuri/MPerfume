import {useEffect,useMemo,useState} from 'react';
import {Link,useParams} from 'react-router-dom';
import {ArrowLeft,ArrowRight,CheckCircle2,ChevronLeft,ChevronRight,Heart,Leaf,Minus,Plus,ShieldCheck,Sparkles} from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import {demoProducts} from '../data/products.js';
import {getProduct} from '../lib/api.js';

const attarEditorial=[
 'https://images.pexels.com/photos/17155311/pexels-photo-17155311.jpeg?auto=compress&cs=tinysrgb&w=900',
 'https://images.pexels.com/photos/17155333/pexels-photo-17155333.jpeg?auto=compress&cs=tinysrgb&w=900',
 'https://images.pexels.com/photos/10533996/pexels-photo-10533996.jpeg?auto=compress&cs=tinysrgb&w=900',
 'https://images.pexels.com/photos/14490628/pexels-photo-14490628.jpeg?auto=compress&cs=tinysrgb&w=900'
];
export default function ProductPage(){
 const {slug}=useParams();
 const local=useMemo(()=>demoProducts.find(p=>p.slug===slug),[slug]);
 const [remote,setRemote]=useState(null);
 const [loading,setLoading]=useState(!local);
 const [qty,setQty]=useState(1);
 const [activePhoto,setActivePhoto]=useState(0);
 const [saved,setSaved]=useState(false);
 const [tab,setTab]=useState('Notes');
 const product=local||remote;
 useEffect(()=>{
  setActivePhoto(0);setQty(1);setRemote(null);setLoading(!local);
  if(local)return;
  let alive=true;
  getProduct(slug).then(p=>{if(alive)setRemote(p)}).finally(()=>{if(alive)setLoading(false)});
  return()=>{alive=false};
 },[slug,local]);
 const gallery=useMemo(()=>{
  if(!product)return [];
  if(product.type==='Attar')return [product.image,...attarEditorial.filter(x=>x!==product.image)];
  return [product.image];
 },[product]);
 const related=useMemo(()=>!product?[]:demoProducts.filter(p=>p.slug!==product.slug&&p.type===product.type&&p.family.split(' • ')[0]===product.family.split(' • ')[0]).slice(0,4),[product]);
 if(loading)return <><Header/><main className="shell pdp-shell"><div className="pdp-skeleton"><div className="pdp-skeleton-image"/><div className="pdp-skeleton-info">{[30,65,45,90,75,80].map((n,i)=><span key={i} style={{width:n+'%'}}/>)}</div></div></main><Footer/></>;
 if(!product)return <><Header/><main className="shell pdp-not-found"><h1>Fragrance not found</h1><Link to="/shop">Return to collection</Link></main><Footer/></>;
 const notes=product.notes||[];
 const hierarchy=product.topNotes?{Top:product.topNotes,Heart:product.heartNotes||[],Base:product.baseNotes||[]}:{Top:notes.slice(0,1),Heart:notes.slice(1,3),Base:notes.slice(3)};
 return <><Header/><main className="shell pdp-shell">
 <nav className="pdp-breadcrumb" aria-label="Breadcrumb"><Link to="/shop"><ArrowLeft size={15}/> Collection</Link><span>/</span><Link to="/shop">{product.type}s</Link><span>/</span><span>{product.name}</span></nav>
 <section className="pdp-grid"><div className="pdp-gallery">
   <div className="pdp-main-image"><img src={gallery[activePhoto]} alt={activePhoto===0?product.name:'Editorial example of a traditional perfume oil bottle'} fetchPriority={activePhoto===0?'high':'auto'} onError={e=>{if(activePhoto>0)setActivePhoto(0)}}/><span className="pdp-image-chip">{activePhoto===0?'Concept product imagery':'Editorial attar photography'}</span>{gallery.length>1&&<div className="pdp-photo-arrows"><button aria-label="Previous image" onClick={()=>setActivePhoto(n=>(n+gallery.length-1)%gallery.length)}><ChevronLeft size={20}/></button><button aria-label="Next image" onClick={()=>setActivePhoto(n=>(n+1)%gallery.length)}><ChevronRight size={20}/></button></div>}</div>
   <div className="pdp-thumbnails">{gallery.map((src,i)=><button key={src} className={activePhoto===i?'active':''} onClick={()=>setActivePhoto(i)} aria-label={'View image '+(i+1)} aria-pressed={activePhoto===i}><img src={src} alt="" loading={i===0?'eager':'lazy'}/></button>)}</div>
  </div><div className="pdp-information">
   <div className="pdp-micro"><span>{product.type==='Attar'?'TRADITIONAL OIL FRAGRANCE':'EAU DE PARFUM COLLECTION'}</span><span>·</span><span>{product.family}</span></div>
   <h1>{product.name}</h1><p className="pdp-lead">{product.description}</p><div className="pdp-price">₹{Number(product.price).toLocaleString('en-IN')} <span> / {product.size}</span></div>
   <div className="pdp-line"/>
   <div className="pdp-detail-label">FRAGRANCE CHARACTER</div><div className="pdp-tags">{notes.map(n=><span key={n}>{n}</span>)}</div>
   <div className="pdp-facts"><div><span>Style</span><strong>{product.family}</strong></div><div><span>Occasion</span><strong>{(product.occasion||[]).slice(0,2).join(' · ')||'Everyday'}</strong></div><div><span>Wear</span><strong>{product.longevity||'Depends on formulation'}</strong></div></div>
   <div className="pdp-line"/><div className="pdp-order"><div className="pdp-quantity"><button onClick={()=>setQty(q=>Math.max(1,q-1))} aria-label="Decrease quantity"><Minus size={16}/></button><strong>{qty}</strong><button onClick={()=>setQty(q=>Math.min(10,q+1))} aria-label="Increase quantity"><Plus size={16}/></button></div><button className="pdp-disabled-buy" disabled title="Demo products cannot be purchased until inventory is verified">Preview only · Checkout coming soon <ArrowRight size={17}/></button><button className={'pdp-heart '+(saved?'saved':'')} onClick={()=>setSaved(s=>!s)} aria-label={saved?'Remove from shortlist':'Save to shortlist'} aria-pressed={saved}><Heart size={20} fill={saved?'currentColor':'none'}/></button></div>
   <p className="pdp-honesty"><ShieldCheck size={15}/> Demonstration listing. Price, exact formulation, performance and availability are not merchant-verified.</p>
  </div></section>
  <section className="pdp-story"><div className="pdp-story-header"><p className="eyebrow">The scent experience</p><h2>Every note tells a story.</h2><p>Explore the aromatic character of this fragrance concept.</p></div><div className="pdp-tabs" role="tablist">{['Notes','Details','About attars'].map(t=><button key={t} role="tab" aria-selected={tab===t} className={tab===t?'active':''} onClick={()=>setTab(t)}>{t}</button>)}</div>
   {tab==='Notes'&&<div className="pdp-note-pyramid">{Object.entries(hierarchy).map(([stage,values],i)=><div key={stage}><span className="pdp-note-number">0{i+1}</span><h3>{stage} notes</h3><p>{values.length?values.join(' · '):'Not listed'}</p><small>{stage==='Top'?'The opening impression':stage==='Heart'?'The character at the centre':'The lingering foundation'}</small></div>)}</div>}
   {tab==='Details'&&<div className="pdp-story-body"><p>{product.description}</p><p>Type: {product.type} · Size: {product.size} · Fragrance family: {product.family}.</p><p>These note classifications are illustrative and must be confirmed against the finished formulation.</p></div>}
   {tab==='About attars'&&<div className="pdp-story-body"><Leaf size={22}/><p>Attar is traditionally associated with concentrated aromatic oils and small decorative glass bottles. Some traditional attars are made through distillation, while contemporary oil perfumes may be formulated differently. Check the actual product formulation and usage instructions before sale.</p></div>}
  </section>
  {related.length>0&&<section className="pdp-related"><div className="section-head"><div><p className="eyebrow">You might also enjoy</p><h2>Explore similar scents.</h2></div><Link to="/shop">Browse all <ArrowRight size={17}/></Link></div><div className="pdp-related-grid">{related.map(p=><ProductCard key={p.slug} product={p}/>)}</div></section>}
 </main><Footer/></>
}
