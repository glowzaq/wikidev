# 🚀 WikiDev: The Developer Knowledge Base

WikiDev is a high-performance, full-stack knowledge-sharing platform designed for developers. Built with **Next.js 16**, **React 19**, and a robust **GraphQL** backend, it empowers users to publish technical articles, engage with the community, and curate their own technical library.

## ✨ Core Features

- **🔐 Custom JWT Auth:** Secure authentication using `jose` and `bcryptjs` with session management via HTTP-only cookies.
- **📝 Advanced Article Editor:** Markdown-supported article creation with real-time preview and **input validation** (min/max length checks).
- **👤 Author Profiles:** Dedicated public profile pages showcasing a developer's bio and their entire catalog of published works.
- **🛡️ Admin Moderation:** A secure, high-privilege **Admin Console** for platform-wide content management and moderation.
- **🔖 Smart Bookmarks:** Save technical guides for later with a personalized bookmarking system integrated into the dashboard.
- **💬 Community Engagement:** Interactive features including **Likes** and **Nested Comments** on every article.
- **📜 Dynamic Table of Contents:** Automatically generated, smooth-scrolling TOC for long-form technical documentation.
- **🎨 Premium UI/UX:** A stunning, responsive design featuring **Glassmorphism**, smooth transitions, and a meticulously aligned dashboard layout.

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Library:** React 19
- **Styling:** Tailwind CSS 4 & Vanilla CSS
- **Icons:** Lucide React
- **Rendering:** React Markdown with GFM support

### Backend
- **API:** GraphQL with Apollo Server
- **Client:** Apollo Client (React Hooks)
- **Database:** MongoDB via Mongoose
- **Security:** JWT (jose) & BcryptJS

## 📁 Architecture

```bash
├── app/
│   ├── (admin)/        # Admin-only Moderation Dashboard
│   ├── (auth)/         # Login & Registration flows
│   ├── (landing)/      # Core app (Dashboard, Articles, Profiles)
│   ├── api/graphql/    # Unified GraphQL Endpoint
│   └── shared/         # Reusable UI Components & Hooks
├── lib/
│   └── graphql/        # Schemas (TypeDefs), Resolvers, and Queries
├── models/             # Mongoose Data Models (Article, Dev)
└── public/             # Static Assets
```

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v18.x or higher
- MongoDB (Local or Atlas)

### 2. Installation
```bash
git clone https://github.com/your-username/wiki-dev.git
cd wiki-dev
npm install
```

### 3. Environment Setup
Create a `.env` file in the root:
```env
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
```

### 4. Run Development
```bash
npm run dev
```

## 📊 Data Models

### Dev (User)
- `firstName`, `lastName`, `email`, `password` (hashed)
- `role`: (`user` | `admin`)
- `bio`: Short professional summary
- `bookmarks`: References to saved Articles

### Article
- `title`, `content` (Markdown)
- `category`: (Frontend, Backend, DevOps, etc.)
- `authorId`: Reference to the creator
- `likes`: Array of user IDs
- `comments`: Nested objects with `text`, `userName`, and `createdAt`

## 🛡️ Moderation & Safety
- **Input Sanitization:** Automatically trims and validates article length (Title: 5-100, Content: 20+).
- **Access Control:** Server-side role verification for administrative actions.
- **Scroll Margin:** Optimized for reading with `scroll-mt` headers to prevent overlap with sticky navigation.

---
Built with ❤️ by the WikiDev Team.
