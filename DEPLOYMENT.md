# Vercel deployment

Deploy as two Vercel projects from the same GitHub repository.

## Frontend
- Root Directory: `frontend`
- Framework Preset: Vite
- Environment: `VITE_API_URL=https://YOUR-BACKEND.vercel.app/api`

## Backend
- Root Directory: `backend`
- Add all values from `.env.example` using secure Vercel Environment Variables.
- Set `CLIENT_URL` to the deployed frontend URL.
- Run `npm run seed` locally or from a one-off trusted environment after configuring MongoDB.

## Important
Do not commit `.env`. Rotate any credentials that have been exposed in a chat or log before production.
