import CnoSample from '../models/CnoSample.js';
import Product from '../models/Product.js';
import { demoProducts } from '../data/demoProducts.js';

// Generate next serial number: e.g. CNO-2026-0001
async function generateNextSerial() {
  const currentYear = new Date().getFullYear();
  const prefix = `CNO-${currentYear}-`;
  const last = await CnoSample.findOne({ serialNo: { $regex: `^${prefix}` } })
    .sort({ createdAt: -1 })
    .lean();

  if (!last || !last.serialNo) {
    return `${prefix}0001`;
  }

  const parts = last.serialNo.split('-');
  const lastNum = parseInt(parts[parts.length - 1], 10);
  const nextNum = isNaN(lastNum) ? 1 : lastNum + 1;
  return `${prefix}${String(nextNum).padStart(4, '0')}`;
}

// GET /api/cno/next-serial
export async function getNextSerial(req, res, next) {
  try {
    const nextSerial = await generateNextSerial();
    res.json({ nextSerial });
  } catch (err) {
    next(err);
  }
}

// POST /api/cno
export async function createSample(req, res, next) {
  try {
    const data = { ...req.body };
    if (!data.serialNo || !data.serialNo.trim()) {
      data.serialNo = await generateNextSerial();
    }
    const sample = await CnoSample.create(data);
    res.status(201).json({ success: true, sample });
  } catch (err) {
    next(err);
  }
}

// GET /api/cno
export async function getAllSamples(req, res, next) {
  try {
    const { q, idealFor, profile, supplier, status, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (q && q.trim()) {
      const searchRegex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { serialNo: searchRegex },
        { supplierName: searchRegex },
        { code: searchRegex },
        { inspiration: searchRegex },
        { usedInProduct: searchRegex },
        { profile: searchRegex },
        { remarks: searchRegex },
      ];
    }

    if (idealFor && idealFor !== 'All') {
      filter.idealFor = idealFor;
    }
    if (profile && profile !== 'All') {
      filter.profile = profile;
    }
    if (supplier && supplier.trim()) {
      filter.supplierName = new RegExp(supplier.trim(), 'i');
    }
    if (status && status !== 'All') {
      filter.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [total, samples] = await Promise.all([
      CnoSample.countDocuments(filter),
      CnoSample.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
    ]);

    res.json({
      success: true,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum) || 1,
      samples,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/cno/:id
export async function getSampleById(req, res, next) {
  try {
    const sample = await CnoSample.findById(req.params.id);
    if (!sample) {
      return res.status(404).json({ message: 'CNO Sample not found' });
    }
    res.json({ success: true, sample });
  } catch (err) {
    next(err);
  }
}

// PUT /api/cno/:id
export async function updateSample(req, res, next) {
  try {
    const sample = await CnoSample.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!sample) {
      return res.status(404).json({ message: 'CNO Sample not found' });
    }
    res.json({ success: true, sample });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/cno/:id
export async function deleteSample(req, res, next) {
  try {
    const sample = await CnoSample.findByIdAndDelete(req.params.id);
    if (!sample) {
      return res.status(404).json({ message: 'CNO Sample not found' });
    }
    res.json({ success: true, message: 'Sample deleted successfully' });
  } catch (err) {
    next(err);
  }
}

// GET /api/cno/suggestions?q=...
// Provides suggestions for "Used In Which Product" matching store catalog
export async function getProductSuggestions(req, res, next) {
  try {
    const query = (req.query.q || '').trim().toLowerCase();
    let dbProducts = [];

    try {
      if (query) {
        dbProducts = await Product.find({
          $or: [
            { name: new RegExp(query, 'i') },
            { notes: new RegExp(query, 'i') },
            { family: new RegExp(query, 'i') },
            { type: new RegExp(query, 'i') },
          ],
        })
          .limit(10)
          .lean();
      } else {
        dbProducts = await Product.find().limit(10).lean();
      }
    } catch {
      // Fallback to local demo catalog
      dbProducts = [];
    }

    // Merge or fallback to demo products
    const pool = dbProducts.length ? dbProducts : demoProducts;
    const filtered = query
      ? pool.filter((p) => {
          const haystack = `${p.name} ${p.family || ''} ${p.type || ''} ${(p.notes || []).join(' ')}`.toLowerCase();
          return haystack.includes(query);
        })
      : pool;

    const suggestions = filtered.slice(0, 8).map((p) => ({
      id: p._id || p.id || p.slug,
      name: p.name,
      type: p.type || 'Perfume',
      family: p.family || 'Fragrance',
      notes: p.notes || [],
      price: p.price,
      slug: p.slug,
    }));

    res.json({ success: true, suggestions });
  } catch (err) {
    next(err);
  }
}

