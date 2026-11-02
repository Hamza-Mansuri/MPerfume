import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import cnoRoutes from './routes/cnoRoutes.js';

const app=express();
app.set('trust proxy',1);
app.use(helmet({crossOriginResourcePolicy:{policy:'cross-origin'}}));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    const allowed = (process.env.CLIENT_URL || 'http://localhost:5175,http://localhost:5176,http://localhost:5173,http://localhost:3000').split(',').map(s => s.trim());
    if (allowed.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json({limit:'1mb'}));
app.use(morgan(process.env.NODE_ENV==='production'?'combined':'dev'));
app.use(rateLimit({windowMs:Number(process.env.RATE_LIMIT_WINDOW_MS||900000),limit:Number(process.env.RATE_LIMIT_MAX||100),standardHeaders:true,legacyHeaders:false}));
app.get('/api/health',(req,res)=>res.json({ok:true,service:'MP API'}));
app.use('/api/auth',authRoutes); app.use('/api/products',productRoutes); app.use('/api/recommendations',recommendationRoutes); app.use('/api/cno',cnoRoutes);
app.use((err,req,res,next)=>{console.error(err);res.status(err.status||500).json({message:process.env.NODE_ENV==='production'?'Something went wrong':err.message});});
export default app;
