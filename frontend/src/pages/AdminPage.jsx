import Header from '../components/Header.jsx';
import { demoProducts } from '../data/products.js';

export default function AdminPage(){return <><Header/><main className="shell admin-page"><div className="section-head"><div><p className="eyebrow">Admin workspace</p><h1>Catalog control</h1></div><button className="primary-btn">+ Add product</button></div><div className="admin-table"><div className="admin-row admin-head"><span>Product</span><span>Type</span><span>Price</span><span>Status</span></div>{demoProducts.map(p=><div className="admin-row" key={p.id}><span className="admin-product"><img src={p.image} alt=""/><strong>{p.name}</strong></span><span>{p.type}</span><span>₹{p.price.toLocaleString('en-IN')}</span><span className="status">Active</span></div>)}</div></main></>}
