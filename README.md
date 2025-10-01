# ScanSetu (Frontend)

Barcode-based inventory management for labs and workshops. Scan items with phone cameras or USB scanners, issue/return with Google login, and track assignments with an audit trail.

## Overview

- **Goal**: Make issuing and returning lab/workshop tools fast, accurate, and auditable.
- **Users**:
  - **Admin**: Manage products, items, barcodes, users, and review logs.
  - **User**: Sign in, scan to issue/return items.
- **Devices**: Works on desktop and mobile. Camera access requires HTTPS or localhost.

## Core Features

- **Role-based access**: Admin vs User capabilities.
- **Product & item model**: A product has many physical items, each with a unique code (e.g., `objA1…objA10`).
- **Barcode scanning**: Use phone camera (WebRTC) and, later, decoding via ZXing/Quagga. USB scanners type codes into focused inputs.
- **Issue & return**: Assign an item to a user when issued; set it back to stock on return; due dates and overdue tracking.
- **Activity log**: Recent activity view shows who has what and when.

## Architecture

- **Stack**: React 18 + Vite + TypeScript, TailwindCSS, React Router.
  - Entry: `src/main.tsx`
  - Landing: `src/App.tsx`
  - Dashboard: `src/pages/Dashboard.tsx`
- **Data**: Supabase (Postgres + RLS)
  - Client: `src/lib/supabaseClient.ts`
  - Schema: `db/supabase_schema.sql`
- **Hosting**: Vercel (static frontend) + Supabase (managed DB/Auth/Storage).

### Data Model (Supabase)

- `products`: id, name, sku
- `items`: id, product_id, code, status ('in_stock'|'issued'|'lost'|'damaged')
- `users`: id, full_name, email
- `assignments`: id, item_id, user_id, status ('issued'|'returned'), issued_at, returned_at, due_at
- `recent_activity` (view): code, product, holder, status, updated

See `db/supabase_schema.sql` to create tables, enable RLS, add dev policies, and seed sample data.

### Frontend Data Fetching

- Stats (Dashboard):
  - Total products: count of `products`
  - Items in stock: `items.status = 'in_stock'`
  - Currently issued: `items.status = 'issued'`
  - Overdue: `assignments.status = 'issued' AND due_at < now()`
- Recent activity: `recent_activity` view (last 6 entries)
- If Supabase env vars are missing, the UI falls back to mock data.

## Scanning & Camera

- Camera modal uses `getUserMedia` for live preview.
- Mobile browsers require a secure origin:
  - **Works**: HTTPS (e.g., Vercel) or true `localhost` on the device.
  - **Does not work**: http://LAN-IP during local dev.
- For local phone testing, either run HTTPS dev or use a tunnel (ngrok) or Android `adb reverse`.

## Setup

### Prerequisites
- Node.js 18+
- A Supabase project

### Install & Run

```bash
npm install
cp .env.example .env
# set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
npm run dev
```

Open `http://localhost:5173` (desktop). For phone testing, see HTTPS dev below.

### Supabase

1. Create a new project in Supabase.
2. Open SQL Editor and run `db/supabase_schema.sql`.
3. In the Dashboard project settings, note your Project URL and anon key.
4. In `.env` set:
   - `VITE_SUPABASE_URL=...`
   - `VITE_SUPABASE_ANON_KEY=...`

### Local HTTPS Dev (optional for mobile camera)

- Vite is configured to auto-enable HTTPS if certificates are present.
- Create `certs/` and add:
  - `certs/key.pem`
  - `certs/cert.pem`
- Or provide file paths via env:
  - `VITE_DEV_HTTPS_KEY=C:\path\to\key.pem`
  - `VITE_DEV_HTTPS_CERT=C:\path\to\cert.pem`
- Start dev server and open `https://<PC-LAN-IP>:5173` on your phone.

## Deployment

### Vercel

- Project root: this `Frontend/` directory.
- Build command: `npm run build`
- Output: `dist`
- Env vars (Vercel → Settings → Environment Variables):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- Client routing: `vercel.json` rewrites all routes to `index.html`.

When deployed on Vercel (HTTPS), mobile camera permission prompts will work.

## Roadmap

- Google Sign-In and user session context.
- Barcode decoding using `@zxing/browser` or `quagga`.
- Admin screens for Product/Item/User CRUD.
- Issue/Return flows with validations and receipts.
- Pagination, search, and export.
- Hardened RLS policies for production.
