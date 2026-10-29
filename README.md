# MP — Motiwala Perfumes

Premium AI-assisted fragrance discovery and commerce experience for attars, perfumes, and future fragrance categories.

## Structure
- `frontend/` — React + Vite storefront and admin-ready UI
- `backend/` — Express + MongoDB API, JWT auth, fragrance search/recommendation engine

## Demo goals
- Search by ingredient, fragrance note, mood, family, or use case
- Product carousel with premium imagery, pricing, notes, longevity, projection, season and occasion
- "Make it more..." recommendation chips (sweeter, fresher, deeper, warmer, cleaner)
- Real catalog matching: recommendations always map back to catalog products
- User authentication and admin-ready role support
- Responsive luxury UI with mobile-first behavior

## Setup
1. Copy `backend/.env.example` to `backend/.env` and add your own secrets.
2. `npm run install:all`
3. `npm run dev`

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## Security
Never commit a real `.env`. Rotate any secrets that have been shared in chats, screenshots, or logs before production.
