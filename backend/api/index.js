import 'dotenv/config';
import app from '../src/app.js';
import { connectDB } from '../src/config/db.js';

let connectionPromise;
function ensureDB(){
  if(!connectionPromise) connectionPromise=connectDB().catch((error)=>{connectionPromise=null; throw error;});
  return connectionPromise;
}

export default async function handler(req,res){
  if(process.env.MONGODB_URI) await ensureDB();
  return app(req,res);
}
