export const ATTAR_IMAGES = [
  'https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=1200&q=85', // crystal tola bottle with gold cap
  'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=1200&q=85', // amber oil flacon with gold applicator
  'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=1200&q=85', // pure essential perfume oil in amber glass
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=1200&q=85', // clear crystal luxury oil flacon
  'https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=1200&q=85', // golden elixir perfume oil
  'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=85', // crystal tola flacon with golden essence
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=85', // luxury glass perfume oil flacon
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=1200&q=85', // apothecary attar oil flacon
  'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1200&q=85'  // luxury glass dropper flacon
];

export const PERFUME_IMAGES = [
  'https://images.unsplash.com/photo-1523293182086-7651a899d37f?auto=format&fit=crop&w=1200&q=85', // classic luxury spray bottle with gold mist
  'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=85', // iconic fine fragrance spray flacon
  'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=85', // rose luxury perfume spray bottle
  'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1200&q=85', // citrus fresh perfume spray bottle
  'https://images.unsplash.com/photo-1619994403073-2cec844b8e63?auto=format&fit=crop&w=1200&q=85', // dark luxury vanilla oud spray bottle
  'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?auto=format&fit=crop&w=1200&q=85', // designer perfume spray flacon on pedestal
  'https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=1200&q=85', // niche luxury perfume spray bottle
  'https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=1200&q=85', // minimalist clear glass perfume bottle with black cap
  'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=1200&q=85', // crystal perfume spray bottle
  'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?auto=format&fit=crop&w=1200&q=85', // golden luxury perfume spray bottle
  'https://images.unsplash.com/photo-1582211594533-268f4f1edcb9?auto=format&fit=crop&w=1200&q=85', // haute parfumerie flacon
  'https://images.unsplash.com/photo-1590736704728-f4730bb30770?auto=format&fit=crop&w=1200&q=85', // crystal fine fragrance bottle
  'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=1200&q=85', // luxury spray bottle
  'https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?auto=format&fit=crop&w=1200&q=85'  // artisanal fragrance spray
];

const originalProducts = [
  {
    id: 'oud-royale',
    slug: 'oud-royale',
    name: 'Oud Royale',
    type: 'Attar',
    price: 1499,
    size: '12 ml',
    rating: 4.9,
    image: ATTAR_IMAGES[0],
    family: 'Woody • Amber',
    notes: ['Oud', 'Amber', 'Saffron', 'Musk'],
    longevity: '10–12 hrs',
    projection: 'Strong',
    season: ['Winter', 'Evening'],
    occasion: ['Wedding', 'Formal', 'Night'],
    mood: ['luxurious', 'deep', 'warm', 'royal'],
    description: 'A deep, resinous wild oud wrapped in warm amber, saffron and clean musk in a traditional crystal tola flacon.'
  },
  {
    id: 'rose-musk',
    slug: 'rose-musk-elixir',
    name: 'Rose Musk Elixir',
    type: 'Attar',
    price: 1099,
    size: '12 ml',
    rating: 4.8,
    image: ATTAR_IMAGES[3],
    family: 'Floral • Musk',
    notes: ['Rose', 'White Musk', 'Amber', 'Vanilla'],
    longevity: '8–10 hrs',
    projection: 'Medium',
    season: ['All season'],
    occasion: ['Daily', 'Date night', 'Festive'],
    mood: ['romantic', 'soft', 'sweet', 'clean'],
    description: 'Velvety Taif rose, airy white musk and a soft vanilla-amber finish in concentrated perfume oil.'
  },
  {
    id: 'amber-noir',
    slug: 'amber-noir',
    name: 'Amber Noir',
    type: 'Perfume',
    price: 2299,
    size: '50 ml',
    rating: 4.9,
    image: PERFUME_IMAGES[0],
    family: 'Amber • Spicy',
    notes: ['Amber', 'Black Pepper', 'Vanilla', 'Patchouli'],
    longevity: '7–9 hrs',
    projection: 'Strong',
    season: ['Winter', 'Monsoon'],
    occasion: ['Evening', 'Party', 'Formal'],
    mood: ['bold', 'warm', 'spicy', 'confident'],
    description: 'Dark amber and spice with a smooth vanilla dry-down. Haute Parfumerie fine mist spray.'
  },
  {
    id: 'musk-safa',
    slug: 'musk-safa',
    name: 'Musk Safa',
    type: 'Attar',
    price: 899,
    size: '10 ml',
    rating: 4.7,
    image: ATTAR_IMAGES[2],
    family: 'Clean • Musk',
    notes: ['White Musk', 'Cotton', 'Iris', 'Sandalwood'],
    longevity: '6–8 hrs',
    projection: 'Soft',
    season: ['Summer', 'All season'],
    occasion: ['Office', 'Prayer', 'Daily'],
    mood: ['clean', 'fresh', 'calm', 'minimal'],
    description: 'A clean, soft white musk with powdery iris and creamy sandalwood in pure oil form.'
  },
  {
    id: 'citrus-cedar',
    slug: 'citrus-cedar',
    name: 'Citrus Cedar',
    type: 'Perfume',
    price: 1799,
    size: '50 ml',
    rating: 4.6,
    image: PERFUME_IMAGES[3],
    family: 'Fresh • Woody',
    notes: ['Bergamot', 'Lemon', 'Cedarwood', 'Vetiver'],
    longevity: '6–7 hrs',
    projection: 'Medium',
    season: ['Summer', 'Spring'],
    occasion: ['Office', 'Travel', 'Day'],
    mood: ['fresh', 'clean', 'energetic', 'modern'],
    description: 'Bright citrus over dry cedar and vetiver for an easy everyday signature Eau de Parfum.'
  },
  {
    id: 'vanilla-oud',
    slug: 'vanilla-oud-reserve',
    name: 'Vanilla Oud Reserve',
    type: 'Perfume',
    price: 2499,
    size: '50 ml',
    rating: 4.9,
    image: PERFUME_IMAGES[4],
    family: 'Gourmand • Woody',
    notes: ['Vanilla', 'Oud', 'Tonka', 'Amber'],
    longevity: '9–11 hrs',
    projection: 'Strong',
    season: ['Winter', 'Night'],
    occasion: ['Date night', 'Party', 'Festive'],
    mood: ['sweet', 'deep', 'warm', 'sensual'],
    description: 'Creamy Madagascar vanilla meets dark oud and tonka for a rich, addictive luxury spray trail.'
  }
];

const families = [
  ['Oud', 'Woody • Amber', ['Oud', 'Saffron', 'Amber', 'Patchouli', 'Rose', 'Labdanum', 'Leather', 'Cedarwood'], ['luxurious', 'warm', 'deep']],
  ['Rose', 'Floral • Musk', ['Rose', 'Jasmine', 'Peony', 'White Musk', 'Geranium', 'Iris', 'Amber', 'Violet'], ['romantic', 'soft', 'floral']],
  ['Musk', 'Clean • Musk', ['White Musk', 'Ambrette', 'Cotton', 'Iris', 'Sandalwood', 'Aldehydes', 'Cashmeran', 'Lily'], ['clean', 'soft', 'calm']],
  ['Citrus', 'Fresh • Citrus', ['Bergamot', 'Lemon', 'Mandarin', 'Grapefruit', 'Neroli', 'Petitgrain', 'Green Tea', 'Vetiver'], ['fresh', 'clean', 'energetic']],
  ['Amber', 'Amber • Resin', ['Amber', 'Labdanum', 'Benzoin', 'Vanilla', 'Myrrh', 'Frankincense', 'Tonka', 'Cistus'], ['warm', 'bold', 'sensual']],
  ['Sandal', 'Woody • Creamy', ['Sandalwood', 'Cedarwood', 'Vetiver', 'Cardamom', 'Musk', 'Iris', 'Fig', 'Guaiac Wood'], ['calm', 'creamy', 'woody']],
  ['Floral', 'White Floral', ['Jasmine', 'Tuberose', 'Orange Blossom', 'Ylang-Ylang', 'Gardenia', 'Magnolia', 'Neroli', 'Lily'], ['floral', 'elegant', 'romantic']],
  ['Spice', 'Spicy • Woody', ['Cardamom', 'Saffron', 'Black Pepper', 'Cinnamon', 'Clove', 'Nutmeg', 'Ginger', 'Cedarwood'], ['bold', 'spicy', 'warm']],
  ['Gourmand', 'Gourmand • Amber', ['Vanilla', 'Tonka', 'Cacao', 'Coffee', 'Praline', 'Caramel', 'Benzoin', 'Honey'], ['sweet', 'comforting', 'warm']],
  ['Green', 'Green • Aromatic', ['Vetiver', 'Green Tea', 'Basil', 'Mint', 'Sage', 'Lavender', 'Galbanum', 'Fig Leaf'], ['green', 'fresh', 'earthy']],
  ['Aquatic', 'Aquatic • Fresh', ['Sea Salt', 'Marine Accord', 'Calone', 'Lemon', 'Water Lily', 'Driftwood', 'Musk', 'Bergamot'], ['aquatic', 'fresh', 'clean']],
  ['Leather', 'Leather • Smoky', ['Leather', 'Birch Tar', 'Oud', 'Tobacco', 'Amber', 'Saffron', 'Patchouli', 'Incense'], ['smoky', 'deep', 'bold']],
  ['Fruit', 'Fruity • Floral', ['Pear', 'Apple', 'Blackcurrant', 'Peach', 'Raspberry', 'Rose', 'Musk', 'Mandarin'], ['juicy', 'fresh', 'playful']],
  ['Incense', 'Resin • Woody', ['Frankincense', 'Myrrh', 'Olibanum', 'Amber', 'Cedarwood', 'Elemi', 'Oud', 'Benzoin'], ['resinous', 'deep', 'meditative']]
];

const editions = ['Signature', 'Noir', 'Elixir', 'Reserve', 'Velvet', 'Soleil', 'Imperial', 'Safa', 'Dusk', 'Essence'];

export const expandedDemoProducts = families.flatMap(([name, family, notes, mood], familyIndex) =>
  editions.flatMap((edition, editionIndex) =>
    ['Attar', 'Perfume'].map((type, typeIndex) => {
      const id = 'demo-' + name.toLowerCase() + '-' + edition.toLowerCase() + '-' + type.toLowerCase();
      const rotation = (editionIndex * 2 + typeIndex) % notes.length;
      const selected = [
        notes[rotation],
        notes[(rotation + 1) % notes.length],
        notes[(rotation + 3) % notes.length],
        notes[(rotation + 5) % notes.length]
      ];

      // Exact photography matching product type:
      const image =
        type === 'Attar'
          ? ATTAR_IMAGES[(familyIndex * 3 + editionIndex) % ATTAR_IMAGES.length]
          : PERFUME_IMAGES[(familyIndex * 3 + editionIndex + 1) % PERFUME_IMAGES.length];

      return {
        id,
        slug: id,
        name: name + ' ' + edition,
        type,
        price: type === 'Attar' ? 699 + (familyIndex % 6) * 140 + editionIndex * 45 : 1299 + (familyIndex % 6) * 190 + editionIndex * 75,
        size: type === 'Attar' ? '12 ml' : '50 ml',
        rating: 4.7 + ((familyIndex + editionIndex) % 4) * 0.1,
        image,
        imageIsIllustrative: false,
        isDemo: true,
        family,
        notes: selected,
        topNotes: selected.slice(0, 1),
        heartNotes: selected.slice(1, 3),
        baseNotes: selected.slice(3),
        longevity: type === 'Attar' ? '10–14 hrs' : '7–9 hrs',
        projection: type === 'Attar' ? 'Intimate to Moderate Sillage' : 'Strong Radiant Projection',
        season: ['All season'],
        occasion: ['Daily', 'Evening'],
        mood,
        description:
          type === 'Attar'
            ? `An artisanal concentrated perfume oil formulation built around ${selected.join(', ')}. Alcohol-free pure attar in classic tola crystal.`
            : `A luxury fine fragrance Eau de Parfum atomizer featuring notes of ${selected.join(', ')}. Long-lasting spray projection.`
      };
    })
  )
);

export const demoProducts = [
  ...originalProducts.map((p) => ({
    ...p,
    isDemo: true,
    imageIsIllustrative: false
  })),
  ...expandedDemoProducts
];

export const fragranceNoteLibrary = [...new Set(families.flatMap((f) => f[2]))].sort();
