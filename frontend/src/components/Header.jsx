import { Menu, Search, ShoppingBag, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="header shell">
      <Link to="/" className="brand" aria-label="Motiwala Perfumes home">
        <span className="brand-mark">MP</span>
        <span className="brand-copy"><strong>Motiwala</strong><small>Perfumes</small></span>
      </Link>
      <nav className="desktop-nav">
        <Link to="/shop">Shop</Link>
        <a href="#discover">AI Discovery</a>
        <a href="#story">Our Story</a>
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="Search"><Search size={19}/></button>
        <Link className="icon-button" to="/login" aria-label="Account"><UserRound size={19}/></Link>
        <button className="icon-button" aria-label="Cart"><ShoppingBag size={19}/></button>
        <button className="icon-button mobile-only" aria-label="Menu"><Menu size={20}/></button>
      </div>
    </header>
  );
}
