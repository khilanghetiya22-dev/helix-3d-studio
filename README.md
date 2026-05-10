# PrintForge 3D — 3D Printing Order Management Platform

A full-stack 3D printing order management web application built with **Next.js 14** (App Router), **Tailwind CSS**, and **Supabase**.

## Features

- 🔐 **Authentication** — Email/password signup & login via Supabase Auth
- 📦 **Order Management** — Multi-step order form with material, color, infill, quality selection
- 📁 **File Upload** — Drag-and-drop upload zone supporting 20+ CAD formats (STL, OBJ, STEP, F3D, SolidWorks, CATIA, etc.)
- 📊 **Dashboard** — Customer dashboard with order stats and recent orders
- 🔄 **Order Tracking** — Visual status stepper: Received → Printing → Quality Check → Shipped → Delivered
- 🛡️ **Admin Panel** — Admin dashboard with order management, status updates, and customer info
- 🎨 **Dark Industrial Theme** — Glassmorphism, gradient borders, smooth animations

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth & DB | Supabase (Auth + PostgreSQL) |
| File Storage | Supabase Storage |
| Validation | Zod |
| Icons | Lucide React |
| Language | TypeScript |

## Local Setup

### Prerequisites

- Node.js 18+
- npm
- A Supabase project ([create one here](https://supabase.com))

### 1. Install Dependencies

```bash
cd printforge-3d
npm install
```

### 2. Configure Environment

Copy the example env file and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ADMIN_EMAIL=admin@yourdomain.com
```

### 3. Set Up Database

Run the SQL migration in your Supabase SQL Editor:

1. Go to your Supabase Dashboard → SQL Editor
2. Paste the contents of `supabase/migrations/001_initial_schema.sql`
3. Execute the query

Also create a storage bucket:
1. Go to Storage → New Bucket
2. Name: `order-files`
3. Set to **Private**

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Create Admin Account

1. Sign up with the email matching `ADMIN_EMAIL` in your `.env.local`
2. The database trigger will automatically set your role to `admin`

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Design system
│   ├── (auth)/
│   │   ├── login/page.tsx          # Login
│   │   └── signup/page.tsx         # Signup
│   ├── (customer)/
│   │   ├── layout.tsx              # Customer layout
│   │   ├── dashboard/page.tsx      # Dashboard
│   │   └── orders/
│   │       ├── new/page.tsx        # New order form
│   │       └── [id]/page.tsx       # Order details
│   └── (admin)/
│       ├── layout.tsx              # Admin layout
│       └── admin/orders/
│           ├── page.tsx            # All orders
│           └── [id]/page.tsx       # Order detail + status update
├── components/
│   ├── ui/                         # Reusable UI primitives
│   ├── AuthForm.tsx                # Login/signup form
│   ├── Navbar.tsx                  # Navigation bar
│   ├── FileUploadZone.tsx          # Drag-and-drop uploads
│   └── OrderStatusStepper.tsx      # Visual order progress
├── lib/
│   ├── supabase/                   # Supabase client configs
│   ├── constants.ts                # App constants
│   ├── types.ts                    # TypeScript types
│   └── validations.ts             # Zod schemas
└── middleware.ts                   # Auth middleware
```

## Supported File Formats

STL, 3MF, OBJ, PLY, AMF, STEP, STP, IGES, IGS, F3D, F3Z, SLDPRT, SLDASM, CATPART, CATPRODUCT, X_T, X_B, DXF, DWG, GCODE, ZIP, RAR
