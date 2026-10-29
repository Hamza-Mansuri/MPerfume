import ProductCard from './ProductCard.jsx';

export default function ProductCarousel({ products = [] }) {
  return (
    <div className="product-scroll">
      {products.map((product) => <ProductCard key={product.id || product._id} product={product} />)}
    </div>
  );
}
