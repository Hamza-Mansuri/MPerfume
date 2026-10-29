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
/** Generic illustrated attar bottle, intentionally unbranded. No competitor imagery. */
const attarIllustration=(index=0)=>{
 const tones=[['#d9a448','#faf1dc'],['#ab7b43','#f4e6cc'],['#d5bc73','#faf5e8'],['#a57455','#f3e8dd'],['#c49b61','#fbf0db']];
 const [oil,bg]=tones[index%tones.length];
 const xml=`<svg xmlns="http://www.w3.org/2000/svg" width="700" height="840" viewBox="0 0 700 840"><defs><linearGradient id="glass" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".9"/><stop offset=".4" stop-color="#d5bf9b" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity=".8"/></linearGradient><linearGradient id="liquid" x2="0" y2="1"><stop stop-color="${oil}" stop-opacity=".62"/><stop offset="1" stop-color="${oil}"/></linearGradient></defs><rect width="700" height="840" fill="${bg}"/><circle cx="580" cy="160" r="230" fill="#fff" opacity=".3"/><ellipse cx="350" cy="710" rx="170" ry="26" fill="#a48a65" opacity=".13"/><rect x="287" y="135" width="126" height="115" rx="16" fill="#b38b4b"/><path d="M287 188H413" stroke="#f4d89b" stroke-width="9"/><path d="M287 214H413" stroke="#795b34" stroke-width="4"/><rect x="318" y="225" width="64" height="60" rx="10" fill="#e5d1a7"/><rect x="216" y="265" width="268" height="412" rx="62" fill="url(#glass)" stroke="#d0b990" stroke-width="9"/><path d="M228 435H472V614Q472 664 419 664H281Q228 664 228 614Z" fill="url(#liquid)"/><rect x="248" y="374" width="204" height="190" rx="8" fill="#fffaf0" opacity=".93"/><path d="M280 399H420M280 535H420" stroke="#b49a6c" stroke-width="2"/><text x="350" y="455" fill="#705738" text-anchor="middle" font-family="Georgia,serif" font-size="37">ATTAR</text><text x="350" y="488" fill="#937a57" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" letter-spacing="5">CONCEPT</text><path d="M245 330Q230 540 246 615" fill="none" stroke="#fff" stroke-opacity=".66" stroke-width="20" stroke-linecap="round"/></svg>`;
 return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(xml);
};
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
  image:type==='Attar'?attarIllustration(familyIndex+editionIndex):'https://images.unsplash.com/'+editorialPhotography[(familyIndex+editionIndex+typeIndex)%editorialPhotography.length]+'?auto=format&fit=crop&w=1000&q=85',
  imageIsIllustrative:true,isDemo:true,
  family,notes:selected,topNotes:selected.slice(0,1),heartNotes:selected.slice(1,3),baseNotes:selected.slice(3),
  longevity:'Varies by formulation',projection:'Not verified',
  season:['All season'],occasion:['Daily','Evening'],mood,
  description:'A concept '+type.toLowerCase()+' built around '+selected.join(', ')+'. Demonstration profile only; formulation and performance are not verified.'
 };
 })));
export const demoProducts=[...originalProducts.map((p,i)=>({...p,isDemo:true,imageIsIllustrative:true,image:p.type==='Attar'?attarIllustration(i):p.image})),...expandedDemoProducts];
export const fragranceNoteLibrary=[...new Set(families.flatMap(f=>f[2]))].sort();
