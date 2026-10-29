import { useMemo, useState } from 'react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { demoProducts } from '../data/products.js';

export default function ShopPage() {
  const [filter, setFilter] = useState('All');
  const [term, setTerm] = useState('');
  const products = useMemo(() => demoProducts.filter((p) => (filter === 'All' || p.type === filter) && [p.name,p.family,...p.notes].join(' ').toLowerCase().includes(term.toLowerCase())), [filter, term]);
  return <><Header/><main className="shell shop-page"><p className="eyebrow">The collection</p><div className="shop-head"><h1>Attars & perfumes</h1><input value={term} onChange={(e)=>setTerm(e.target.value)} placeholder="Search notes, family, name..."/></div><div className="filter-row">{['All','Attar','Perfume'].map((item)=><button className={filter===item?'active':''} onClick={()=>setFilter(item)} key={item}>{item}</button>)}</div><div className="product-grid">{products.map((p)=><ProductCard key={p.id} product={p}/>)}</div></main><Footer/></>;
}
