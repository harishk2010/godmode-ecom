# ⚡ GOD MODE — Full Stack E-Commerce Application

> A production-ready, full-stack e-commerce platform built with Next.js 14, Node.js, Express, and MongoDB — featuring a stunning dark UI, Repository Architecture, JWT auth, full cart system, admin dashboard, and much more.

---

## 🚀 Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | Next.js 14 (App Router), Tailwind CSS, Framer Motion, Zustand |
| Backend    | Node.js, Express.js, Repository Architecture    |
| Database   | MongoDB + Mongoose                              |
| Auth       | JWT + bcryptjs                                  |
| Payments   | Mock Razorpay integration (ready for real keys) |

---

## ✨ Features

### 🛒 E-Commerce Core
- Product listing with grid view, search, filters (category, price, rating), sorting & pagination
- Product detail page with image gallery, reviews, stock status
- Shopping cart with quantity controls, coupon codes, price breakdown
- Multi-step checkout (Address → Payment → Review)
- Order management with status tracking (7 statuses)
- Order cancellation with stock restoration

### 🔐 Authentication & Security
- JWT-based auth with 7-day tokens
- bcrypt password hashing (12 rounds)
- Protected routes (frontend + backend)
- Role-based access (user / admin)
- Rate limiting (200 req / 15 min)
- Helmet security headers

### 🧑‍💼 Admin Panel
- Dashboard with revenue, order, user & product stats
- Full product CRUD (create, edit, delete, toggle active/featured)
- Order status management
- User account management (activate/deactivate)
- Coupon system (percentage & fixed, with limits)

### 🎯 Bonus Features
- Wishlist (add/remove)
- Coupon system (WELCOME10, SAVE20, FLAT500, GODMODE)
- Product reviews & ratings
- Dark UI with glassmorphism design
- Fully responsive (mobile-first)
- Animated UI with Framer Motion
- Toast notifications
- Cart sidebar drawer

---

## 🏗️ Architecture

### Backend — Generic Repository Pattern

```
backend/
├── src/
│   ├── interfaces/
│   │   └── IRepository.js          ← Abstract interface
│   ├── repositories/
│   │   ├── GenericRepository.js    ← Base CRUD (findAll, create, update…)
│   │   └── index.js                ← UserRepo, ProductRepo, CartRepo, OrderRepo, CouponRepo
│   ├── models/                     ← Mongoose schemas
│   ├── controllers/                ← Request handlers
│   ├── services/                   ← Business logic layer
│   ├── middleware/                 ← JWT auth, admin guard
│   ├── routes/                     ← Express routers
│   ├── config/                     ← DB connection
│   ├── utils/                      ← ApiResponse, AppError
│   └── seed/                       ← Demo data seeder
└── server.js
```

### Frontend — Next.js 14 App Router

```
frontend/
├── src/
│   ├── app/                        ← Pages (App Router)
│   │   ├── page.js                 ← Homepage
│   │   ├── products/               ← Listing + Detail
│   │   ├── (auth)/login|register/  ← Auth pages
│   │   ├── cart/                   ← Cart page
│   │   ├── checkout/               ← Multi-step checkout
│   │   ├── orders/                 ← Order history + detail
│   │   ├── profile/                ← User profile
│   │   ├── wishlist/               ← Wishlist
│   │   └── admin/                  ← Admin panel (dashboard, products, orders, users, coupons)
│   ├── components/
│   │   ├── ui/                     ← Button, Input, Modal, Badge, Skeleton, Pagination…
│   │   ├── layout/                 ← Navbar, Footer, ShopLayout, CartDrawer
│   │   └── products/               ← ProductCard
│   ├── context/
│   │   ├── AuthStore.js            ← Zustand auth store
│   │   └── CartStore.js            ← Zustand cart store
│   └── lib/
│       └── api.js                  ← Axios instance + all API calls
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js ≥ 18
- MongoDB (local or Atlas)
- npm or yarn

---

### 1. Clone & Install

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend** — copy `.env.example` to `.env`:
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/godmode
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

**Frontend** — copy `.env.example` to `.env.local`:
```bash
cd frontend
cp .env.example .env.local
```

Edit `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 3. Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- 👤 Admin: `admin@godmode.com` / `admin123`
- 👤 User:  `user@godmode.com`  / `user1234`
- 📦 16 Products across all categories
- 🎟️ Coupons: `WELCOME10`, `SAVE20`, `FLAT500`, `GODMODE`

### 4. Run Development Servers

```bash
# Terminal 1 — Backend (port 5000)
cd backend
npm run dev

# Terminal 2 — Frontend (port 3000)
cd frontend
npm run dev
```

Open **http://localhost:3000**

---

## 🔑 API Reference

| Method | Endpoint                        | Auth     | Description             |
|--------|---------------------------------|----------|-------------------------|
| POST   | `/api/auth/register`            | Public   | Register user           |
| POST   | `/api/auth/login`               | Public   | Login                   |
| GET    | `/api/auth/me`                  | User     | Get current user        |
| GET    | `/api/products`                 | Public   | List products           |
| GET    | `/api/products/:id`             | Public   | Product detail          |
| GET    | `/api/products/featured`        | Public   | Featured products       |
| POST   | `/api/products/:id/reviews`     | User     | Add review              |
| GET    | `/api/cart`                     | User     | Get cart                |
| POST   | `/api/cart/add`                 | User     | Add to cart             |
| PUT    | `/api/cart/update`              | User     | Update quantity         |
| DELETE | `/api/cart/item/:productId`     | User     | Remove item             |
| POST   | `/api/cart/coupon`              | User     | Apply coupon            |
| POST   | `/api/orders`                   | User     | Place order             |
| GET    | `/api/orders/my-orders`         | User     | My orders               |
| PUT    | `/api/orders/:id/cancel`        | User     | Cancel order            |
| GET    | `/api/wishlist`                 | User     | Get wishlist            |
| POST   | `/api/wishlist`                 | User     | Add to wishlist         |
| GET    | `/api/admin/dashboard`          | Admin    | Dashboard stats         |
| POST   | `/api/admin/products`           | Admin    | Create product          |
| PUT    | `/api/admin/products/:id`       | Admin    | Update product          |
| DELETE | `/api/admin/products/:id`       | Admin    | Delete product          |
| GET    | `/api/admin/orders`             | Admin    | All orders              |
| PUT    | `/api/admin/orders/:id/status`  | Admin    | Update order status     |
| GET    | `/api/admin/users`              | Admin    | All users               |
| POST   | `/api/admin/coupons`            | Admin    | Create coupon           |

---

## 🚢 Deployment

### Backend → Render / Railway

```bash
# Set environment variables on your platform:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
CLIENT_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel
cd frontend
vercel

# Set env variable on Vercel:
NEXT_PUBLIC_API_URL=https://your-backend.render.com/api
```

---

## 🧪 Test Coupons

| Code       | Type       | Value | Min Order | Max Discount |
|------------|------------|-------|-----------|--------------|
| WELCOME10  | Percentage | 10%   | ₹500      | ₹500         |
| SAVE20     | Percentage | 20%   | ₹2000     | ₹1000        |
| FLAT500    | Fixed      | ₹500  | ₹3000     | —            |
| GODMODE    | Percentage | 15%   | ₹1000     | ₹750         |

---

## 📋 Platform Experience (God Particles Assessment)

| Platform   | Experience |
|------------|------------|
| WordPress  | Yes — Custom themes, plugins, WooCommerce |
| Shopify    | Yes — Liquid templates, custom apps, Shopify Plus |
| OpenCart   | Yes — Extension development, custom modules |
| CodeIgniter| Yes — MVC applications, REST APIs |

---

## 📁 Project Structure Summary

```
god-mode/
├── backend/                  ← Express API
│   ├── server.js
│   ├── src/
│   │   ├── config/database.js
│   │   ├── interfaces/IRepository.js
│   │   ├── repositories/     ← Generic + specific repos
│   │   ├── models/           ← User, Product, Cart, Order, Coupon
│   │   ├── controllers/      ← Auth, Product, Cart, Order, Admin, Wishlist
│   │   ├── middleware/       ← auth.js (JWT + admin guard)
│   │   ├── routes/           ← All Express routes
│   │   ├── utils/            ← ApiResponse, AppError
│   │   └── seed/seed.js      ← Demo data
│   ├── .env.example
│   └── package.json
├── frontend/                 ← Next.js 14
│   ├── src/
│   │   ├── app/              ← All pages
│   │   ├── components/       ← Reusable components
│   │   ├── context/          ← Zustand stores
│   │   ├── lib/api.js        ← Axios API client
│   │   └── styles/globals.css
│   ├── .env.example
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

Built with ❤️ 
