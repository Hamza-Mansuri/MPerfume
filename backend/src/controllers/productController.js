import Product from '../models/Product.js';
import { demoProducts } from '../data/demoProducts.js';
import { rankProducts } from '../services/fragranceEngine.js';

async function catalog(){
  try{ const count=await Product.countDocuments(); return count ? await Product.find({active:true}).lean() : demoProducts; }
  catch{ return demoProducts; }
}

export async function listProducts(req,res){
  const products=await catalog(); res.json({products});
}

export async function searchProducts(req,res){
  const q=(req.query.q||'').trim(); const products=await catalog();
  res.json({query:q,products:q?rankProducts(products,q):products});
}

export async function getProduct(req,res){
  try{ const db=await Product.findOne({slug:req.params.slug,active:true}).lean(); if(db) return res.json({product:db}); }catch{}
  const product=demoProducts.find((p)=>p.slug===req.params.slug); if(!product) return res.status(404).json({message:'Product not found'}); res.json({product});
}

export async function createProduct(req,res){
  const product=await Product.create(req.body); res.status(201).json({product});
}
