import { useState } from 'react';
import Header from '../components/Header.jsx';

export default function LoginPage(){
 const [mode,setMode]=useState('login');
 return <><Header/><main className="auth-page shell"><div className="auth-card"><p className="eyebrow">Motiwala account</p><h1>{mode==='login'?'Welcome back':'Create your account'}</h1><p>Save favourites, get better scent matches and manage orders.</p>{mode==='register'&&<input placeholder="Full name"/>}<input placeholder="Email address" type="email"/><input placeholder="Password" type="password"/><button className="primary-btn wide">{mode==='login'?'Sign in':'Create account'}</button><button className="text-btn" onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?'New here? Create an account':'Already have an account? Sign in'}</button></div></main></>;
}
