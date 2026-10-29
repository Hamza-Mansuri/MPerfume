import 'dotenv/config';
import app from './app.js';
import { connectDB } from './config/db.js';
const port=Number(process.env.PORT||5000);
connectDB().finally(()=>app.listen(port,()=>console.log(`MP API running on http://localhost:${port}`)));
