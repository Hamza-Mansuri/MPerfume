import Product from '../models/Product.js';
import { demoProducts } from '../data/demoProducts.js';
import { rankProducts, buildSuggestions, directionToTerms } from '../services/fragranceEngine.js';

export async function recommend(req,res){
  const query=(req.body.query||'').trim(); const direction=(req.body.direction||'').trim();
  if(!query) return res.status(400).json({message:'query is required'});
  let catalog=demoProducts;
  try{ const db=await Product.find({active:true}).lean(); if(db.length) catalog=db; }catch{}
  const combined=`${query} ${directionToTerms(direction)}`.trim(); let products=rankProducts(catalog,combined);
  if(!products.length) products=rankProducts(catalog,query);
  if(!products.length) products=catalog.slice(0,4);
  res.json({
    explanation: direction ? `To make “${query}” feel ${direction.toLowerCase()}, these are the closest products already available in the catalog.` : `These are the closest catalog matches for “${query}”, ranked by notes, family and mood.`,
    suggestions:buildSuggestions(query),
    products:products.slice(0,6)
  });
}
