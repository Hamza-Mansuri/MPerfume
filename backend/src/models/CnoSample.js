import mongoose from 'mongoose';

const cnoSampleSchema = new mongoose.Schema(
  {
    serialNo: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    sampleDate: {
      type: Date,
      default: Date.now,
    },
    supplierName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    inspiration: {
      type: String,
      trim: true,
      default: '',
    },
    idealFor: {
      type: String,
      enum: ['Men', 'Women', 'Unisex'],
      default: 'Unisex',
    },
    // Applicable fragrance uses (Perfume, Attar, Deo, Room Freshener R/F, Bakhoor, Cosmetics Cos)
    suitableFor: {
      type: [String],
      default: [],
    },
    boxesReceived: {
      type: Number,
      default: 1,
      min: 0,
    },
    usedInProduct: {
      type: String,
      trim: true,
      default: '',
    },
    matchedProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    // Profile & Technical Evaluation
    profile: {
      type: String,
      trim: true,
      default: 'French',
    },
    receivedDate: {
      type: Date,
      default: Date.now,
    },
    receivedTime: {
      type: String,
      trim: true,
      default: '',
    },
    concentrateLongevity: {
      type: String,
      trim: true,
      default: '8h+',
    },
    temperature: {
      type: String,
      trim: true,
      default: '',
    },
    sprayLongevity: {
      type: String,
      trim: true,
      default: '12h+',
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Under Review', 'Approved', 'Sample Retained', 'Archived'],
      default: 'Under Review',
    },
  },
  { timestamps: true }
);

// Text indexing for fast search across inspiration, supplier, code and usedInProduct
cnoSampleSchema.index({
  serialNo: 'text',
  supplierName: 'text',
  code: 'text',
  inspiration: 'text',
  usedInProduct: 'text',
  profile: 'text',
});

const CnoSample = mongoose.models.CnoSample || mongoose.model('CnoSample', cnoSampleSchema);

export default CnoSample;

