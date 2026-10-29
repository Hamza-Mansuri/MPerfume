import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import User from '../models/User.js';

const credentialsSchema = z.object({email:z.string().email(),password:z.string().min(8)});
const registerSchema = credentialsSchema.extend({name:z.string().min(2).max(80)});

function sign(user){
  const payload={sub:user._id.toString(),email:user.email,role:user.role,name:user.name};
  return {
    accessToken:jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{expiresIn:process.env.JWT_ACCESS_EXPIRY||'15m'}),
    refreshToken:jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{expiresIn:process.env.JWT_REFRESH_EXPIRY||'7d'})
  };
}

export async function register(req,res){
  const parsed=registerSchema.safeParse(req.body); if(!parsed.success) return res.status(400).json({message:'Invalid input'});
  const exists=await User.findOne({email:parsed.data.email.toLowerCase()}); if(exists) return res.status(409).json({message:'Email already registered'});
  const passwordHash=await bcrypt.hash(parsed.data.password,12); const user=await User.create({name:parsed.data.name,email:parsed.data.email,passwordHash});
  res.status(201).json({user:{id:user._id,name:user.name,email:user.email,role:user.role},...sign(user)});
}

export async function login(req,res){
  const parsed=credentialsSchema.safeParse(req.body); if(!parsed.success) return res.status(400).json({message:'Invalid credentials'});
  const user=await User.findOne({email:parsed.data.email.toLowerCase()});
  if(!user || !(await bcrypt.compare(parsed.data.password,user.passwordHash))) return res.status(401).json({message:'Invalid email or password'});
  res.json({user:{id:user._id,name:user.name,email:user.email,role:user.role},...sign(user)});
}
