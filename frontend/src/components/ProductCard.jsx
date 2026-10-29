import { ArrowUpRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.slug}`} className="product-image-wrap">
        <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
        <span className="product-type">{product.type}</span>{product.isDemo&&<span className="product-demo-tag">Concept</span>}
      </Link>
      <div className="product-card-body">
        <div className="product-row">
          <div>
            <p className="eyebrow">{product.family}</p>
            <h3>{product.name}</h3>
          </div>
          {product.rating!=null&&<span className="rating"><Star size={14} fill="currentColor"/> {product.rating}</span>}
        </div>
        <p className="notes">{product.notes.slice(0, 4).join(' · ')}</p>
        <div className="product-row product-bottom">
          <div><strong>₹{product.price.toLocaleString('en-IN')}</strong><small>{product.size}</small></div>
          <Link to={`/product/${product.slug}`} className="round-link" aria-label={`View ${product.name}`}><ArrowUpRight size={17}/></Link>
        </div>
      </div>
    </article>
  );
}
