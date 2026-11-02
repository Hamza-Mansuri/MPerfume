import 'dotenv/config';
import { connectDB } from '../config/db.js';
import CnoSample from '../models/CnoSample.js';

const richSamples = [
  {
    serialNo: 'CNO-2026-0001',
    sampleDate: new Date('2026-10-28T10:30:00Z'),
    supplierName: 'Givaudan Fine Fragrances (Vernier)',
    code: 'BDC-BLU-902-V2',
    inspiration: 'Bleu de Chanel',
    idealFor: 'Men',
    suitableFor: ['Perfume', 'Attar', 'Deo'],
    boxesReceived: 3,
    usedInProduct: 'Motiwala Royal Blue Attar',
    profile: 'French',
    receivedDate: new Date('2026-10-28T14:30:00Z'),
    receivedTime: '14:30',
    concentrateLongevity: '8h+',
    temperature: '29°C',
    sprayLongevity: '12h+',
    remarks: 'Vibrant sparkling grapefruit and Italian mint on opening. Dry-down evolves into refined vetiver, Iso E Super, and frankincense. Approved for luxury spray blend.',
    status: 'Approved'
  },
  {
    serialNo: 'CNO-2026-0002',
    sampleDate: new Date('2026-10-29T11:15:00Z'),
    supplierName: 'Firmenich SA (Geneva)',
    code: 'BR540-EXT-771',
    inspiration: 'Baccarat Rouge 540 Extrait',
    idealFor: 'Unisex',
    suitableFor: ['Perfume', 'Attar', 'Bakhoor'],
    boxesReceived: 2,
    usedInProduct: 'Motiwala Amber Noir Reserve',
    profile: 'Amber Gourmand',
    receivedDate: new Date('2026-10-29T15:00:00Z'),
    receivedTime: '15:00',
    concentrateLongevity: '12h+',
    temperature: '31°C',
    sprayLongevity: '24h+',
    remarks: 'Hypnotic bitter almond and saffron overture followed by crystalline ethyl maltol and ambergris. Enormous olfactory sillage with 24h+ fabric retention.',
    status: 'Approved'
  },
  {
    serialNo: 'CNO-2026-0003',
    sampleDate: new Date('2026-10-30T09:45:00Z'),
    supplierName: 'IFF (International Flavors & Fragrances)',
    code: 'AVN-CRD-884-X',
    inspiration: 'Creed Aventus',
    idealFor: 'Men',
    suitableFor: ['Perfume', 'Attar', 'Deo'],
    boxesReceived: 4,
    usedInProduct: 'Citrus Cedar',
    profile: 'French',
    receivedDate: new Date('2026-10-30T13:45:00Z'),
    receivedTime: '13:45',
    concentrateLongevity: '8h+',
    temperature: '32°C',
    sprayLongevity: '12h+',
    remarks: 'Smoky French birch tar seamlessly intertwined with blackcurrant bud and roasted pineapple. Rich oakmoss and patchouli foundation.',
    status: 'Approved'
  },
  {
    serialNo: 'CNO-2026-0004',
    sampleDate: new Date('2026-10-31T10:00:00Z'),
    supplierName: 'Robertet Grasse (France)',
    code: 'ROSE-TAIF-501',
    inspiration: 'Taif Rose Pure Distillate',
    idealFor: 'Women',
    suitableFor: ['Attar', 'Cosmetics Cos', 'Perfume'],
    boxesReceived: 2,
    usedInProduct: 'Rose Musk Elixir',
    profile: 'Floral Musky',
    receivedDate: new Date('2026-10-31T12:30:00Z'),
    receivedTime: '12:30',
    concentrateLongevity: '12h+',
    temperature: '28°C',
    sprayLongevity: '10h+',
    remarks: 'First extraction pure steam-distilled Taif rose petals. Honeyed petal nuances with natural dewdrop clarity and white musk cushion.',
    status: 'Approved'
  },
  {
    serialNo: 'CNO-2026-0005',
    sampleDate: new Date('2026-11-01T08:30:00Z'),
    supplierName: 'Mane Fils & Co (Bar-sur-Loup)',
    code: 'OUD-CAMB-339',
    inspiration: 'Royal Cambodian Aged Oud',
    idealFor: 'Unisex',
    suitableFor: ['Attar', 'Bakhoor'],
    boxesReceived: 5,
    usedInProduct: 'Oud Royale',
    profile: 'Arabic / Khaliji',
    receivedDate: new Date('2026-11-01T11:00:00Z'),
    receivedTime: '11:00',
    concentrateLongevity: '24h+',
    temperature: '30°C',
    sprayLongevity: '16h+',
    remarks: 'Naturally aged 18-year wild agarwood heartwood oil. Thick molasses hue, animalic resinous warmth with zero sharp barnyard notes. Supreme grade attar.',
    status: 'Approved'
  },
  {
    serialNo: 'CNO-2026-0006',
    sampleDate: new Date('2026-11-01T14:15:00Z'),
    supplierName: 'Expressions Parfumees Grasse',
    code: 'SAUV-ELX-611',
    inspiration: 'Dior Sauvage Elixir',
    idealFor: 'Men',
    suitableFor: ['Perfume', 'Attar', 'Deo'],
    boxesReceived: 3,
    usedInProduct: 'Motiwala Royal Blue Attar',
    profile: 'Spicy Leather',
    receivedDate: new Date('2026-11-01T16:20:00Z'),
    receivedTime: '16:20',
    concentrateLongevity: '12h+',
    temperature: '32°C',
    sprayLongevity: '16h+',
    remarks: 'Piquant nutmeg, cinnamon, and Sri Lankan cardamom balanced by lavender absolute and rich licorice-amber base. Maximum impact test batch.',
    status: 'Under Review'
  },
  {
    serialNo: 'CNO-2026-0007',
    sampleDate: new Date('2026-11-02T09:00:00Z'),
    supplierName: 'Symrise Paris Atelier',
    code: 'DEL-TURK-208',
    inspiration: 'Parfums de Marly Delina',
    idealFor: 'Women',
    suitableFor: ['Perfume', 'Cosmetics Cos', 'Attar'],
    boxesReceived: 2,
    usedInProduct: 'Rose Musk Elixir',
    profile: 'Floral Musky',
    receivedDate: new Date('2026-11-02T11:30:00Z'),
    receivedTime: '11:30',
    concentrateLongevity: '8h+',
    temperature: '30°C',
    sprayLongevity: '12h+',
    remarks: 'Sparkling Turkish rose paired with tart rhubarb, lychee, and Cashmeran base. Fresh, opulent, feminine silage with radiant projection.',
    status: 'Under Review'
  },
  {
    serialNo: 'CNO-2026-0008',
    sampleDate: new Date('2026-11-02T11:00:00Z'),
    supplierName: 'CPL Aromas UK',
    code: 'MSK-WH-105',
    inspiration: 'Musk Tahara Royal White',
    idealFor: 'Unisex',
    suitableFor: ['Attar', 'Bakhoor', 'Cosmetics Cos'],
    boxesReceived: 4,
    usedInProduct: 'Musk Safa',
    profile: 'Oriental',
    receivedDate: new Date('2026-11-02T13:00:00Z'),
    receivedTime: '13:00',
    concentrateLongevity: '12h+',
    temperature: '33°C',
    sprayLongevity: '8h+',
    remarks: 'Ultra-creamy white lotus and powdery Tahara musk concentrate. Velvety skin-scent profile with sandalwood and iris nuances. Ideal for daily attar application.',
    status: 'Approved'
  },
  {
    serialNo: 'CNO-2026-0009',
    sampleDate: new Date('2026-11-02T13:30:00Z'),
    supplierName: 'Eurofragance Barcelona',
    code: 'BAK-ROY-419',
    inspiration: 'Bukhoor Al-Multaqa',
    idealFor: 'Unisex',
    suitableFor: ['Bakhoor', 'Room Freshener R/F'],
    boxesReceived: 6,
    usedInProduct: 'Direct Formulation',
    profile: 'Arabic / Khaliji',
    receivedDate: new Date('2026-11-02T15:00:00Z'),
    receivedTime: '15:00',
    concentrateLongevity: '24h+',
    temperature: '31°C',
    sprayLongevity: '16h+',
    remarks: 'Traditional incense formulation with agarwood chips impregnated with musk, taif rose, benzoin, and amber resins. Superb aromatic diffusion over charcoal.',
    status: 'Sample Retained'
  },
  {
    serialNo: 'CNO-2026-0010',
    sampleDate: new Date('2026-11-02T14:45:00Z'),
    supplierName: 'Givaudan Fine Fragrances (Dubai Creation Center)',
    code: 'VAN-OUD-882',
    inspiration: 'Tom Ford Tobacco Vanille & Oud',
    idealFor: 'Unisex',
    suitableFor: ['Perfume', 'Attar'],
    boxesReceived: 3,
    usedInProduct: 'Vanilla Oud Reserve',
    profile: 'Amber Gourmand',
    receivedDate: new Date('2026-11-02T16:30:00Z'),
    receivedTime: '16:30',
    concentrateLongevity: '12h+',
    temperature: '32°C',
    sprayLongevity: '16h+',
    remarks: 'Madagascar bourbon vanilla pod extract with aromatic blonde pipe tobacco, cacao, roasted tonka bean, and sweet Assam oud base.',
    status: 'Approved'
  }
];

async function seed() {
  await connectDB();
  console.log('Connected to Atlas DB');

  // Upsert all samples by serialNo so we don't wipe out any user-created samples
  for (const item of richSamples) {
    await CnoSample.findOneAndUpdate(
      { serialNo: item.serialNo },
      item,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  }

  const total = await CnoSample.countDocuments();
  console.log(`Successfully synced CNO Samples to Atlas. Total samples in DB: ${total}`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});

