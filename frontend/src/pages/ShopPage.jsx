import {useMemo,useState,useEffect} from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import {demoProducts,fragranceNoteLibrary} from '../data/products.js';

export default function ShopPage(){
 const [type,setType]=useState('All');
 const [query,setQuery]=useState('');
 const [family,setFamily]=useState('All');
 const [note,setNote]=useState('All');
 const [sort,setSort]=useState('recommended');
 const [page,setPage]=useState(1);
 const families=useMemo(()=>[...new Set(demoProducts.map(p=>p.family.split(' • ')[0]))].sort(),[]);
 const products=useMemo(()=>{
 let items=demoProducts.filter(p=>(type==='All'||p.type===type)&&(family==='All'||p.family.includes(family))&&(note==='All'||p.notes.some(n=>n.toLowerCase()===note.toLowerCase()))&&[p.name,p.type,p.family,p.description,...p.notes].join(' ').toLowerCase().includes(query.trim().toLowerCase()));
 if(sort==='price-low')items.sort((a,b)=>a.price-b.price);
 if(sort==='price-high')items.sort((a,b)=>b.price-a.price);
 if(sort==='name')items.sort((a,b)=>a.name.localeCompare(b.name));
 return items;
 },[type,query,family,note,sort]);
 useEffect(()=>setPage(1),[type,query,family,note,sort]);
 const pageSize=24,totalPages=Math.max(1,Math.ceil(products.length/pageSize));
 return <><div className="catalog-header"><Header/></div><main className="shell shop-page shop-v4">
 <p className="eyebrow">The Motiwala fragrance library</p>
 <div className="shop-intro"><div><h1>A world of scent,<br/><em>made personal.</em></h1><p>Browse attars and perfumes separately. Discover by name, fragrance family or ingredient.</p></div><div className="shop-count"><strong>{products.length}</strong><span>fragrance concepts found</span></div></div>
 <div className="type-segment" role="group" aria-label="Choose product type">{['All','Attar','Perfume'].map(t=><button key={t} className={type===t?'active':''} onClick={()=>setType(t)}>{t==='All'?'All fragrances':t==='Attar'?'Attars · Oil-based':'Perfumes · Spray'}</button>)}</div>
 <div className="shop-filters"><label><span>Search the collection</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Try: oud, rose, musk, vanilla..." /></label><label><span>Fragrance family</span><select value={family} onChange={e=>setFamily(e.target.value)}><option>All</option>{families.map(x=><option key={x}>{x}</option>)}</select></label><label><span>Ingredient / note</span><select value={note} onChange={e=>setNote(e.target.value)}><option>All</option>{fragranceNoteLibrary.map(x=><option key={x}>{x}</option>)}</select></label><label><span>Sort</span><select value={sort} onChange={e=>setSort(e.target.value)}><option value="recommended">Recommended</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name: A to Z</option></select></label></div>
 <p className="catalog-disclaimer">Demonstration catalog: concept names, fragrance profiles, prices and editorial images are placeholders, not verified Motiwala merchandise. Shop transactions should remain disabled until the owner approves real inventory.</p>
 {products.length?<><div className="product-grid">{products.slice((page-1)*pageSize,page*pageSize).map(p=><ProductCard product={p} key={p.id}/>)}</div><div className="catalog-pagination"><button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}>Previous</button><span>Page {page} of {totalPages}</span><button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}>Next</button></div></>:<div className="catalog-no-results"><h2>No matching fragrances</h2><p>Try a broader note or switch from Attars to Perfumes.</p><button onClick={()=>{setType('All');setQuery('');setFamily('All');setNote('All')}}>Clear filters</button></div>}
 </main><Footer/></>
}
