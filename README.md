# AI Deployed — Bespoke CMS & Operations Hub

> Tailored Content Management System, AI CLI Knowledge Engine, and Inbound Lead Pipeline built specifically for [AI Deployed](https://www.aideployed.io/) ([nibir404/Ai-deployed](https://github.com/nibir404/Ai-deployed)).

---

## 🏛️ Architecture: The Micro-Monolith

This application is built as a **Micro-Monolith** using Next.js 16 (App Router), Tailwind CSS, and Prisma ORM with SQLite. Each domain is self-contained with decoupled services, schemas, and UI components:

```
src/
├── core/                       # Shared cross-cutting layer
│   ├── db/prisma.ts            # Singleton Prisma database client
│   ├── lib/cn.ts               # Tailwind class merging utility
│   └── ui/                     # Shared design system, Sidebar & Header layouts
│
├── modules/                    # Self-contained domain modules
│   ├── content/                # Page sections editor (Hero, Why FDE, Demo, Use Cases, Steps)
│   ├── platform/               # 7-module platform architecture manager with live mock cards
│   ├── faqs/                   # FAQ directory with category tagging & HTML answers
│   ├── cli-knowledge/          # AI CLI Assistant topics, keyword matcher & Live Simulator
│   ├── leads/                  # Inbound enterprise leads CRM & CSV exporter
│   └── revalidation/           # Next.js on-demand ISR webhook dispatcher
│
└── app/                        # App Router controllers & public delivery APIs
    ├── page.tsx                # Dashboard Overview & Metrics
    ├── content/page.tsx        # Section Content Studio
    ├── platform/page.tsx       # Platform Architecture Studio
    ├── faqs/page.tsx           # FAQ Directory
    ├── cli-knowledge/page.tsx  # CLI Knowledge Base & Simulator
    ├── leads/page.tsx          # Leads CRM & Dossier
    ├── settings/page.tsx       # Webhook Audit Logs & API Catalog
    └── api/v1/                 # Public Headless Content Delivery REST APIs
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Initialize & Seed Database
Populate the database with all real initial content from `aideployed.io`:
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### 4. Run Development Server
```bash
npm run dev
# Or run on port 3001 if port 3000 is used by the marketing site:
npx next dev -p 3001
```

The CMS will be available at **http://localhost:3001**.

---

## 📡 Public Delivery REST APIs

These endpoints are consumed by the marketing site (`Ai-deployed`):

| Method | Endpoint | Description | Cache Tag |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/content?page=home` | Returns all home page sections parsed as JSON | `cms-content` |
| `GET` | `/api/v1/platform` | Returns the 7 anchored platform modules & mock cards | `platform-modules` |
| `GET` | `/api/v1/faqs` | Returns published FAQ questions & answers | `faqs` |
| `GET` | `/api/v1/cli-knowledge` | Returns CLI topics matching `SITE_DATA` format | `cli-knowledge` |
| `POST`| `/api/v1/cli-knowledge/simulate` | Simulates CLI query matching and score calculation | — |
| `POST`| `/api/v1/leads` | Ingests contact form inquiries (CORS enabled + honeypot) | — |
| `POST`| `/api/v1/revalidate` | Triggers Next.js on-demand ISR cache refresh | — |

---

## 🔗 Integration with `Ai-deployed`

See [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) for code snippets and instructions on connecting `https://github.com/nibir404/Ai-deployed` to this CMS.
