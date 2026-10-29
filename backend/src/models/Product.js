import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  type: { type: String, enum: ['Attar','Perfume','Oil','Gift Set','Other'], required: true },
  price: { type: Number, required: true, min: 0 },
  compareAtPrice: { type: Number, default: null },
  size: { type: String, required: true },
  image: { type: String, required: true },
  gallery: [{ type: String }],
  family: { type: String, required: true, index: true },
  notes: [{ type: String, index: true }],
  topNotes: [String],
  middleNotes: [String],
  baseNotes: [String],
  mood: [{ type: String, index: true }],
  season: [String],
  occasion: [String],
  longevity: String,
  projection: String,
  gender: { type: String, enum: ['Men','Women','Unisex'], default: 'Unisex' },
  description: { type: String, required: true },
  stock: { type: Number, default: 0 },
  rating: { type: Number, default: 4.8 },
  featured: { type: Boolean, default: false },
  active: { type: Boolean, default: true }
}, { timestamps: true });

ProductSchema.index({ name: 'text', family: 'text', notes: 'text', mood: 'text', description: 'text' });
export default mongoose.model('Product', ProductSchema);
