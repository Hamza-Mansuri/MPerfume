import {lazy,Suspense} from 'react';
import {Routes,Route} from 'react-router-dom';
const HomePage=lazy(()=>import('./pages/HomePage.jsx'));
const ShopPage=lazy(()=>import('./pages/ShopPage.jsx'));
const ProductPage=lazy(()=>import('./pages/ProductPage.jsx'));
const LoginPage=lazy(()=>import('./pages/LoginPage.jsx'));
const AdminPage=lazy(()=>import('./pages/AdminPage.jsx'));
export default function App(){
 return <Suspense fallback={<main style={{minHeight:'75vh',display:'grid',placeItems:'center',background:'#fffdfa'}}><div style={{width:120,height:4,background:'#e6d4bb',borderRadius:20}} role="status" aria-label="Loading page"/></main>}><Routes>
  <Route path="/" element={<HomePage/>}/>
  <Route path="/shop" element={<ShopPage/>}/>
  <Route path="/product/:slug" element={<ProductPage/>}/>
  <Route path="/login" element={<LoginPage/>}/>
  <Route path="/admin" element={<AdminPage/>}/>
 </Routes></Suspense>
}
