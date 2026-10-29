import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user','admin'], default: 'user' },
  favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  scentProfile: {
    families: [String],
    favouriteNotes: [String],
    dislikes: [String],
    occasions: [String]
  }
}, { timestamps: true });

export default mongoose.model('User', UserSchema);
