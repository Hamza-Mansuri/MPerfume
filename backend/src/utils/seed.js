import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { demoProducts } from '../data/demoProducts.js';

await connectDB();
await Product.deleteMany({});
await Product.insertMany(demoProducts);
if(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD){
  const passwordHash=await bcrypt.hash(process.env.ADMIN_PASSWORD,12);
  await User.findOneAndUpdate({email:process.env.ADMIN_EMAIL.toLowerCase()},{name:'Motiwala Admin',email:process.env.ADMIN_EMAIL.toLowerCase(),passwordHash,role:'admin'},{upsert:true,new:true,setDefaultsOnInsert:true});
}
console.log(`Seeded ${demoProducts.length} products${process.env.ADMIN_EMAIL?' and admin user':''}.`);
process.exit(0);
