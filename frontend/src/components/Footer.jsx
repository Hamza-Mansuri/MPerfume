import { Instagram, MessageCircle, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-grid">
        <div><div className="brand footer-brand"><span className="brand-mark">MP</span><span className="brand-copy"><strong>Motiwala</strong><small>Perfumes</small></span></div><p>Traditional attar craft, modern fragrance discovery.</p></div>
        <div><p className="eyebrow">Explore</p><a href="/shop">Attars</a><a href="/shop">Perfumes</a><a href="#discover">AI Discovery</a></div>
        <div><p className="eyebrow">Help</p><a href="#">Shipping</a><a href="#">Returns</a><a href="#">Contact</a></div>
        <div><p className="eyebrow">Stay close</p><a href="#" className="social-link"><Instagram size={16}/> Instagram</a><a href="#" className="social-link"><MessageCircle size={16}/> WhatsApp</a></div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 Motiwala Perfumes</span><span>Crafted for modern scent discovery <ArrowUpRight size={14}/></span></div>
    </footer>
  );
}
