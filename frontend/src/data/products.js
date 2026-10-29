const originalProducts = [
  {
    id: 'oud-royale',
    slug: 'oud-royale',
    name: 'Oud Royale',
    type: 'Attar',
    price: 1499,
    size: '12 ml',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85',
    family: 'Woody • Amber',
    notes: ['Oud', 'Amber', 'Saffron', 'Musk'],
    longevity: '10–12 hrs',
    projection: 'Strong',
    season: ['Winter', 'Evening'],
    occasion: ['Wedding', 'Formal', 'Night'],
    mood: ['luxurious', 'deep', 'warm', 'royal'],
    description: 'A deep, resinous oud wrapped in warm amber, saffron and clean musk.'
  },
  {
    id: 'rose-musk',
    slug: 'rose-musk-elixir',
    name: 'Rose Musk Elixir',
    type: 'Attar',
    price: 1099,
    size: '12 ml',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85',
    family: 'Floral • Musk',
    notes: ['Rose', 'White Musk', 'Amber', 'Vanilla'],
    longevity: '8–10 hrs',
    projection: 'Medium',
    season: ['All season'],
    occasion: ['Daily', 'Date night', 'Festive'],
    mood: ['romantic', 'soft', 'sweet', 'clean'],
    description: 'Velvety rose, airy white musk and a soft vanilla-amber finish.'
  },
  {
    id: 'amber-noir',
    slug: 'amber-noir',
    name: 'Amber Noir',
    type: 'Perfume',
    price: 2299,
    size: '50 ml',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1615634262417-98ba03d7ce2c?auto=format&fit=crop&w=1200&q=85',
    family: 'Amber • Spicy',
    notes: ['Amber', 'Black Pepper', 'Vanilla', 'Patchouli'],
    longevity: '7–9 hrs',
    projection: 'Strong',
    season: ['Winter', 'Monsoon'],
    occasion: ['Evening', 'Party', 'Formal'],
    mood: ['bold', 'warm', 'spicy', 'confident'],
    description: 'Dark amber and spice with a smooth vanilla dry-down.'
  },
  {
    id: 'musk-safa',
    slug: 'musk-safa',
    name: 'Musk Safa',
    type: 'Attar',
    price: 899,
    size: '10 ml',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?auto=format&fit=crop&w=1200&q=85',
    family: 'Clean • Musk',
    notes: ['White Musk', 'Cotton', 'Iris', 'Sandalwood'],
    longevity: '6–8 hrs',
    projection: 'Soft',
    season: ['Summer', 'All season'],
    occasion: ['Office', 'Prayer', 'Daily'],
    mood: ['clean', 'fresh', 'calm', 'minimal'],
    description: 'A clean, soft musk with iris and creamy sandalwood.'
  },
  {
    id: 'citrus-cedar',
    slug: 'citrus-cedar',
    name: 'Citrus Cedar',
    type: 'Perfume',
    price: 1799,
    size: '50 ml',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85',
    family: 'Fresh • Woody',
    notes: ['Bergamot', 'Lemon', 'Cedarwood', 'Vetiver'],
    longevity: '6–7 hrs',
    projection: 'Medium',
    season: ['Summer', 'Spring'],
    occasion: ['Office', 'Travel', 'Day'],
    mood: ['fresh', 'clean', 'energetic', 'modern'],
    description: 'Bright citrus over dry cedar and vetiver for an easy everyday signature.'
  },
  {
    id: 'vanilla-oud',
    slug: 'vanilla-oud-reserve',
    name: 'Vanilla Oud Reserve',
    type: 'Perfume',
    price: 2499,
    size: '50 ml',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1200&q=85',
    family: 'Gourmand • Woody',
    notes: ['Vanilla', 'Oud', 'Tonka', 'Amber'],
    longevity: '9–11 hrs',
    projection: 'Strong',
    season: ['Winter', 'Night'],
    occasion: ['Date night', 'Party', 'Festive'],
    mood: ['sweet', 'deep', 'warm', 'sensual'],
    description: 'Creamy vanilla meets dark oud and tonka for a rich, addictive trail.'
  }
 ];
/** Editorial demo catalog — not verified Motiwala inventory.
 * Replace with owner-approved SKUs, photography and pricing before commerce launch. */
const families=[
 ['Oud','Woody • Amber',['Oud','Saffron','Amber','Patchouli','Rose','Labdanum','Leather','Cedarwood'],['luxurious','warm','deep']],
 ['Rose','Floral • Musk',['Rose','Jasmine','Peony','White Musk','Geranium','Iris','Amber','Violet'],['romantic','soft','floral']],
 ['Musk','Clean • Musk',['White Musk','Ambrette','Cotton','Iris','Sandalwood','Aldehydes','Cashmeran','Lily'],['clean','soft','calm']],
 ['Citrus','Fresh • Citrus',['Bergamot','Lemon','Mandarin','Grapefruit','Neroli','Petitgrain','Green Tea','Vetiver'],['fresh','clean','energetic']],
 ['Amber','Amber • Resin',['Amber','Labdanum','Benzoin','Vanilla','Myrrh','Frankincense','Tonka','Cistus'],['warm','bold','sensual']],
 ['Sandal','Woody • Creamy',['Sandalwood','Cedarwood','Vetiver','Cardamom','Musk','Iris','Fig','Guaiac Wood'],['calm','creamy','woody']],
 ['Floral','White Floral',['Jasmine','Tuberose','Orange Blossom','Ylang-Ylang','Gardenia','Magnolia','Neroli','Lily'],['floral','elegant','romantic']],
 ['Spice','Spicy • Woody',['Cardamom','Saffron','Black Pepper','Cinnamon','Clove','Nutmeg','Ginger','Cedarwood'],['bold','spicy','warm']],
 ['Gourmand','Gourmand • Amber',['Vanilla','Tonka','Cacao','Coffee','Praline','Caramel','Benzoin','Honey'],['sweet','comforting','warm']],
 ['Green','Green • Aromatic',['Vetiver','Green Tea','Basil','Mint','Sage','Lavender','Galbanum','Fig Leaf'],['green','fresh','earthy']],
 ['Aquatic','Aquatic • Fresh',['Sea Salt','Marine Accord','Calone','Lemon','Water Lily','Driftwood','Musk','Bergamot'],['aquatic','fresh','clean']],
 ['Leather','Leather • Smoky',['Leather','Birch Tar','Oud','Tobacco','Amber','Saffron','Patchouli','Incense'],['smoky','deep','bold']],
 ['Fruit','Fruity • Floral',['Pear','Apple','Blackcurrant','Peach','Raspberry','Rose','Musk','Mandarin'],['juicy','fresh','playful']],
 ['Incense','Resin • Woody',['Frankincense','Myrrh','Olibanum','Amber','Cedarwood','Elemi','Oud','Benzoin'],['resinous','deep','meditative']]
];
const editions=['Signature','Noir','Elixir','Reserve','Velvet','Soleil','Imperial','Safa','Dusk','Essence'];
const editorialPhotography=[
 'photo-1541643600914-78b084683601','photo-1594035910387-fea47794261f',
 'photo-1615634262417-98ba03d7ce2c','photo-1587017539504-67cfbddac569',
 'photo-1592945403244-b3fbafd7f539','photo-1619994403073-2cec844b8e63'
];
export const expandedDemoProducts=families.flatMap(([name,family,notes,mood],familyIndex)=>
 editions.flatMap((edition,editionIndex)=>['Attar','Perfume'].map((type,typeIndex)=>{
 const id='demo-'+name.toLowerCase()+'-'+edition.toLowerCase()+'-'+type.toLowerCase();
 const rotation=(editionIndex*2+typeIndex)%notes.length;
 const selected=[notes[rotation],notes[(rotation+1)%notes.length],notes[(rotation+3)%notes.length],notes[(rotation+5)%notes.length]];
 return {
  id,slug:id,name:name+' '+edition,type,
  price:type==='Attar'?699+(familyIndex%6)*140+editionIndex*45:1299+(familyIndex%6)*190+editionIndex*75,
  size:type==='Attar'?'12 ml':'50 ml',
  rating:null, 
  image:'https://images.unsplash.com/'+editorialPhotography[(familyIndex+editionIndex+typeIndex)%editorialPhotography.length]+'?auto=format&fit=crop&w=1000&q=85',
  imageIsIllustrative:true,isDemo:true,
  family,notes:selected,topNotes:selected.slice(0,1),heartNotes:selected.slice(1,3),baseNotes:selected.slice(3),
  longevity:'Varies by formulation',projection:'Not verified',
  season:['All season'],occasion:['Daily','Evening'],mood,
  description:'A concept '+type.toLowerCase()+' built around '+selected.join(', ')+'. Demonstration profile only; formulation and performance are not verified.'
 };
 })));
export const demoProducts=[...originalProducts.map(p=>({...p,isDemo:true,imageIsIllustrative:true})),...expandedDemoProducts];
export const fragranceNoteLibrary=[...new Set(families.flatMap(f=>f[2]))].sort();
