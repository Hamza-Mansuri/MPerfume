import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Minus, Plus, ShoppingBag, Sparkles } from 'lucide-react';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { getProduct } from '../lib/api.js';

export default function ProductPage(){
 const {slug}=useParams(); const [product,setProduct]=useState(null); const [qty,setQty]=useState(1);
 useEffect(()=>{getProduct(slug).then(setProduct)},[slug]);
 if(!product) return <><Header/><div className="shell loading">Loading fragrance…</div></>;
 return <><Header/><main className="shell product-page"><div className="product-detail-image"><img src={product.image} alt={product.name}/></div><div className="product-detail-copy"><p className="eyebrow">{product.type} · {product.family}</p><h1>{product.name}</h1><p className="detail-price">₹{product.price.toLocaleString('en-IN')} <span>{product.size}</span></p><p className="detail-description">{product.description}</p><div className="note-pills">{product.notes.map(n=><span key={n}>{n}</span>)}</div><div className="detail-grid"><div><small>Longevity</small><strong>{product.longevity}</strong></div><div><small>Projection</small><strong>{product.projection}</strong></div><div><small>Best for</small><strong>{product.occasion.slice(0,2).join(', ')}</strong></div><div><small>Season</small><strong>{product.season.join(', ')}</strong></div></div><div className="purchase-row"><div className="qty"><button onClick={()=>setQty(Math.max(1,qty-1))}><Minus size={15}/></button><span>{qty}</span><button onClick={()=>setQty(qty+1)}><Plus size={15}/></button></div><button className="primary-btn wide"><ShoppingBag size={17}/> Add to cart</button></div><button className="ai-inline"><Sparkles size={16}/> Ask AI how to make this sweeter, fresher or deeper</button></div></main><Footer/></>;
}
