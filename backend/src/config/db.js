import mongoose from 'mongoose';

export async function connectDB() {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is missing. API will start, but database-backed routes may fail.');
    return;
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(process.env.MONGODB_URI, { autoIndex: process.env.NODE_ENV !== 'production' });
  console.log('MongoDB connected');
}
