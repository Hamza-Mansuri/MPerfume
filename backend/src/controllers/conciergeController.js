import Product from '../models/Product.js';
import {demoProducts} from '../data/demoProducts.js';
import {rankProducts} from '../services/fragranceEngine.js';

/** Server-side optional LLM concierge. Never expose API keys to the browser.
 * The model only explains candidates selected from the real catalog. */
export async function concierge(req,res){
 const {notes=[],mood='',description=''}=req.body||{};
 if(!Array.isArray(notes)||notes.length>5||notes.some(n=>typeof n!=='string'||n.length>60)||typeof mood!=='string'||typeof description!=='string'||description.length>500)return res.status(400).json({message:'Invalid scent profile'});
 const query=[notes.join(' '),mood.slice(0,80),description].join(' ').trim();
 if(!query)return res.status(400).json({message:'Choose at least one scent preference'});
 let catalog=demoProducts;
 try{const fromDb=await Product.find({active:true}).limit(300).lean();if(fromDb.length)catalog=fromDb}catch{}
 let ranked=rankProducts(catalog,query).slice(0,5);
 if(!ranked.length)ranked=catalog.slice(0,3);
 const products=ranked.map(p=>({id:String(p._id||p.id||p.slug),slug:p.slug,name:p.name,type:p.type,notes:p.notes,description:p.description,price:p.price,size:p.size,image:p.image}));
 let explanation='Based on your chosen notes and mood, these are the closest fragrances currently listed in the Motiwala catalog.';
 const suggestions=['Try a fresher variation','Explore a warmer direction','Compare a woody option'];
 let aiEnabled=false;
 if(process.env.OPENAI_API_KEY){
  try{
   const response=await fetch('https://api.openai.com/v1/chat/completions',{method:'POST',headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY,'Content-Type':'application/json'},signal:AbortSignal.timeout(8500),body:JSON.stringify({model:process.env.OPENAI_MODEL||'gpt-4o-mini',temperature:0.3,max_tokens:250,messages:[{role:'system',content:'You are a concise professional fragrance discovery assistant. Explain the provided catalog matches in 1-2 helpful sentences using only the supplied data. Do not invent note lists, formulations, availability, performance claims, prices, or products. Do not suggest physically mixing concentrates. Respond with explanation text only.'},{role:'user',content:JSON.stringify({preferences:{notes,mood,description},catalog:products.map(p=>({name:p.name,notes:p.notes,description:p.description}))})}]})});
   if(response.ok){const data=await response.json();const reply=data?.choices?.[0]?.message?.content?.trim();if(reply&&reply.length<1100){explanation=reply;aiEnabled=true}}
  }catch(e){console.warn('Concierge AI fallback:',e.message)}
 }
 return res.json({products,explanation,suggestions,mode:aiEnabled?'llm-grounded':'catalog-matching'});
}
