# 🌐 User Profile Manager — Client

React frontend for the User Profile Manager application, built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)

---

## 🛠 Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| **Node.js** | v18 or higher | `node --version` |
| **npm** | v9 or higher | `npm --version` |
| **Backend Server** | Running on port 3001 | See `user-profile-manager-server` |

---

## 🚀 Getting Started

### Step 1 — Install Dependencies

```bash
npm install
```

### Step 2 — Start the Development Server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

> **Note:** The Vite dev server proxies `/api` requests to `http://localhost:3001`. Make sure the backend server is running.

---

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking without emitting |

---

## 📁 Project Structure

```
user-profile-manager-client/
├── src/
│   ├── main.tsx                 # Entry point
│   ├── App.tsx                  # Root component
│   ├── index.css                # Tailwind CSS + design tokens
│   ├── api/
│   │   └── userApi.ts           # Typed API service layer (Axios)
│   ├── hooks/
│   │   └── useForm.ts           # Custom form hook with validation
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   └── components/
│       ├── Layout/
│       │   └── Layout.tsx       # App shell with header
│       ├── UserForm/
│       │   └── UserForm.tsx     # Profile creation form
│       ├── UserTable/
│       │   └── UserTable.tsx    # Data table with search
│       └── common/
│           ├── Input.tsx        # Reusable input component
│           ├── Select.tsx       # Reusable select component
│           └── Toast.tsx        # Toast notifications
├── public/
│   └── favicon.svg
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── .env.example
└── package.json
```

---

## 🧰 Tech Stack

| Technology | Purpose |
|-----------|---------|
| React 19 | UI framework |
| TypeScript | Type-safe JavaScript |
| Vite 8 | Fast build tool with HMR |
| Tailwind CSS 4 | Utility-first CSS framework |
| Axios | HTTP client with typed responses |
| react-datepicker | Date picker component |

---

## 🎨 Design

- **Dark theme** with glassmorphism and teal accent gradients
- **Responsive** layout that works on mobile and desktop
- **Micro-animations** — shimmer loading, row fade-in, toast slide-in
- **Custom design tokens** via Tailwind CSS `@theme` directive
- **Inter** font from Google Fonts
