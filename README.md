# Cooking Recipe Frontend

Frontend for the Cooking Recipe app, built with React, TypeScript, and Vite.

## What it does

- Browse and search recipes
- View recipe details and videos
- Cart, checkout, and order history
- Purchased recipes and profile picture updates
- Admin recipe and transaction management

## Stack

- React 19
- TypeScript
- Vite
- React Router
- CSS
- EmailJS for the contact form

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- Backend API running

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the frontend root:
```env
VITE_API_BASE=http://localhost:5000/api
```

If `VITE_API_BASE` is not set, the app falls back to the deployed API URL in `src/services/api.ts`.

## Run locally

Development:
```bash
npm run dev
```

Build:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

Type check:
```bash
npm run typecheck
```

Local app URL:
- `http://localhost:5173`

## Key folders

- `src/components` - shared UI components
- `src/pages` - page-level screens
- `src/services` - API and auth helpers
- `src/types` - shared TypeScript types
- `src/styles` - global styles

## Routing

- Public routes: home, recipes, recipe detail, about, contact, login, register
- Protected routes: cart, checkout, orders, purchased recipes, profile picture
- Admin routes: admin recipes and admin transactions

## Deployment

This frontend is prepared for Vercel or Netlify.

1. Build the app with `npm run build`.
2. Set `VITE_API_BASE` to your production backend URL.
3. Deploy the `dist` folder.
4. Ensure SPA routing is configured so all routes resolve to `index.html`.

## Notes

- `src/services/api.ts` is the main API entry point.
- `src/App.tsx` and `src/route.tsx` define application routing.
