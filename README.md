# 🧑‍💼 User Profile Manager

A full-stack CRUD application for creating and searching user profiles, built with **React**, **Node.js/Express**, **TypeScript**, **Tailwind CSS**, and **MySQL**.

![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)

---

## 📋 Table of Contents

- [Features](#-features)
- [Project Structure](#-project-structure)
- [What Changed (Refactor Summary)](#-what-changed-refactor-summary)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Design Decisions](#-design-decisions)
- [Tech Stack](#-tech-stack)
- [What I Would Do Next](#-what-i-would-do-next-given-more-time)

---

## ✨ Features

- **Profile Creation Form** — First Name, Last Name, Date of Birth (date picker), Email, Country & City (cascading dropdowns)
- **Cascading Dropdowns** — City options dynamically populate based on selected Country (US / India)
- **Client-Side Validation** — All fields required, email format validation, contextual inline error messages
- **Server-Side Validation** — Mirrors client-side validation for defense in depth (`express-validator`)
- **Data Persistence** — MySQL with connection pooling, parameterized queries (SQL injection safe)
- **Search & Display** — Table view with debounced search filtering by First Name or Last Name
- **Modern UI** — Dark theme, glassmorphism, micro-animations, responsive design

---

## 📁 Project Structure

The client and server are **separated into distinct, independent projects**, each with their own dependencies, configuration, and build pipeline:

```
user-profile-manager/
│
├── user-profile-manager-client/       # React frontend (standalone)
│   ├── src/
│   │   ├── main.tsx                   # Entry point
│   │   ├── App.tsx                    # Root component
│   │   ├── index.css                  # Tailwind CSS + design tokens
│   │   ├── api/
│   │   │   └── userApi.ts             # Typed API service layer (Axios)
│   │   ├── hooks/
│   │   │   └── useForm.ts            # Custom form hook with validation
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript interfaces
│   │   └── components/
│   │       ├── Layout/
│   │       │   └── Layout.tsx         # App shell with header
│   │       ├── UserForm/
│   │       │   └── UserForm.tsx       # Profile creation form
│   │       ├── UserTable/
│   │       │   └── UserTable.tsx      # Data table with search
│   │       └── common/
│   │           ├── Input.tsx          # Reusable input component
│   │           ├── Select.tsx         # Reusable select component
│   │           └── Toast.tsx          # Toast notifications
│   ├── public/
│   │   └── favicon.svg
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
│   ├── eslint.config.js
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── user-profile-manager-server/       # Node.js/Express backend (standalone)
│   ├── src/
│   │   ├── index.ts                   # Express app entry point
│   │   ├── config/
│   │   │   └── db.ts                  # MySQL connection pool
│   │   ├── controllers/
│   │   │   └── userController.ts      # Request handlers
│   │   ├── data/
│   │   │   └── locations.ts           # Country/city data
│   │   ├── middleware/
│   │   │   └── validation.ts          # express-validator rules
│   │   ├── models/
│   │   │   └── userModel.ts           # Database queries
│   │   ├── routes/
│   │   │   └── userRoutes.ts          # Route definitions
│   │   └── types/
│   │       └── index.ts               # TypeScript interfaces
│   ├── database/
│   │   └── schema.sql                 # Database schema
│   ├── tsconfig.json
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── old/                               # Original code (kept for reference)
│   ├── client/                        # Original React frontend (.jsx, vanilla CSS)
│   ├── server/                        # Original Express backend (.js)
│   ├── database/
│   ├── package.json                   # Old monorepo root package
│   └── README.md                      # Old README
│
├── .gitignore
└── README.md                          # ← You are here
```

---

## 🔄 What Changed (Refactor Summary)

The original project was refactored to address three key improvements. Below is a detailed summary of every change made.

### 1. Separated Client & Server into Distinct Projects

**Before:** The client and server shared a single root `package.json` that used `concurrently` to run both. The `.env` file was shared at the root, and both projects lived as subdirectories of one monorepo.

**After:** Each is now a **fully independent project** with:

| Aspect | Before | After |
|--------|--------|-------|
| Structure | Monorepo (`client/` + `server/` under one root) | Two standalone projects side by side |
| Dependencies | Shared root `package.json` + sub-packages | Each has its own `package.json` |
| Environment | Single shared `.env` at root | Each project has its own `.env` |
| Dev Server | `npm run dev` from root (concurrently) | Start each separately |
| README | Single shared README | Each project has its own README |

---

### 2. Converted JavaScript to TypeScript

**Before:** All files used `.js` (server) and `.jsx` (client) — no type safety.

**After:** All files are now `.ts` (server) and `.tsx` (client) with full type annotations.

#### Server TypeScript Changes

| File | Key Type Additions |
|------|--------------------|
| `src/types/index.ts` | **New file** — `User`, `CreateUserRequest`, `UserRow`, `Country`, `LocationMap`, `ApiResponse<T>` |
| `src/index.ts` | Typed `Request`, `Response`, `NextFunction` from Express |
| `src/config/db.ts` | Typed `Pool` from `mysql2/promise` |
| `src/models/userModel.ts` | `ResultSetHeader` for inserts, `RowDataPacket` for queries, typed return values |
| `src/controllers/userController.ts` | `Request<Params, ResBody, ReqBody>` generics for each handler |
| `src/middleware/validation.ts` | `ValidationChain[]` type, typed `validate` middleware |
| `src/routes/userRoutes.ts` | `Router` import from Express |
| `src/data/locations.ts` | Typed `LocationMap`, `Country`, return types on all functions |

**Dev tooling:** Uses `tsx` (fast TypeScript execution) for development, `tsc` for production builds.

#### Client TypeScript Changes

| File | Key Type Additions |
|------|--------------------|
| `src/types/index.ts` | **New file** — `User`, `FormValues`, `FormErrors`, `FormTouched`, `SelectOption`, `Country`, `ToastData`, `ApiResponse<T>` |
| `src/api/userApi.ts` | Generic `axios.get<ApiResponse<T>>()` responses |
| `src/hooks/useForm.ts` | Typed `FormValues`, `FormErrors`, `FormTouched` state; typed `UseFormReturn` interface |
| `src/App.tsx` | Typed `ToastData[]` state |
| `src/main.tsx` | Non-null assertion on `getElementById` |
| All components | Typed prop interfaces (`InputProps`, `SelectProps`, `UserFormProps`, `UserTableProps`, `LayoutProps`, `ToastProps`, `ToastContainerProps`) |

**TypeScript config:** Uses project references (`tsconfig.json` → `tsconfig.app.json` + `tsconfig.node.json`) for separate browser and Node.js environments.

---

### 3. Replaced Vanilla CSS with Tailwind CSS v4

**Before:** 5 separate CSS files with hand-written classes:
- `index.css` (global reset + design tokens)
- `Layout.css`
- `UserForm.css`
- `UserTable.css`
- `common.css` (Input, Select, Toast styles)

**After:** Single `index.css` file + Tailwind utility classes inline in components.

| Aspect | Before | After |
|--------|--------|-------|
| CSS Framework | Vanilla CSS | Tailwind CSS v4 |
| Design Tokens | CSS custom properties in `:root` | `@theme` directive (Tailwind v4 native) |
| Component Styles | Separate `.css` files with BEM-like classes | Tailwind utility classes in `className` |
| Global Styles | Reset + scrollbar + selection | `@layer base` in `index.css` |
| Datepicker Theme | CSS overrides in `UserForm.css` | `@layer base` in `index.css` |
| Animations | `@keyframes` in various CSS files | `@keyframes` in `index.css`, referenced via `animate-[...]` |
| Build | No CSS processing needed | `@tailwindcss/vite` plugin (instant compilation) |

**Design is identical** — same dark theme, glassmorphism, teal/cyan gradients, Inter font, micro-animations, responsive breakpoints.

#### Design Tokens Mapping

```css
/* Tailwind v4 @theme — maps to the same CSS variables as before */
@theme {
  --color-bg-primary: #0a0e1a;
  --color-surface: rgba(15, 23, 42, 0.8);
  --color-accent: #14b8a6;
  --color-error: #ef4444;
  --color-text-primary: #f1f5f9;
  --font-family-sans: 'Inter', sans-serif;
  /* ... etc */
}
```

These tokens are used as `bg-bg-primary`, `text-text-primary`, `border-accent`, etc. in Tailwind classes.

---

## 🛠 Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| **Node.js** | v18 or higher | `node --version` |
| **npm** | v9 or higher | `npm --version` |
| **MySQL** | v8.0 or higher | `mysql --version` |

---

## 🚀 Getting Started

### Step 1 — Set Up the Database

The SQL script is at `user-profile-manager-server/database/schema.sql`:

```bash
mysql -u root -p < user-profile-manager-server/database/schema.sql
```

### Step 2 — Configure the Server

```bash
cd user-profile-manager-server
cp .env.example .env
```

Update `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=user_profile_manager
PORT=3001
NODE_ENV=development
```

### Step 3 — Install Dependencies (Both Projects)

```bash
# Server
cd user-profile-manager-server
npm install

# Client
cd ../user-profile-manager-client
npm install
```

### Step 4 — Start the Application

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
cd user-profile-manager-server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd user-profile-manager-client
npm run dev
```

| Server | URL | Description |
|--------|-----|-------------|
| **Frontend** | http://localhost:5173 | React application |
| **Backend** | http://localhost:3001/api | REST API |

Open **http://localhost:5173** in your browser and you're good to go! 🎉

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users` | Create a new user profile |
| `GET` | `/api/users` | Fetch all user profiles |
| `GET` | `/api/users?search=john` | Search users by first or last name |
| `GET` | `/api/locations/countries` | Get list of available countries |
| `GET` | `/api/locations/cities/:country` | Get cities for a specific country |
| `GET` | `/api/health` | Health check |

### Example — Create User (POST `/api/users`)

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1990-05-15",
  "email": "john@example.com",
  "country": "US",
  "city": "New York"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User profile created successfully",
  "data": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-05-15",
    "email": "john@example.com",
    "country": "US",
    "city": "New York"
  }
}
```

**Validation Error (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": "Please enter a valid email address",
    "country": "Country is required"
  }
}
```

---

## 🧠 Design Decisions

| Decision | Rationale |
|----------|-----------| 
| **Separate Client & Server Projects** | Clean separation of concerns — each project can be deployed, versioned, and scaled independently |
| **TypeScript** | Type safety catches bugs at compile time, improves IDE autocomplete, and makes the codebase self-documenting |
| **Tailwind CSS v4** | Utility-first approach eliminates CSS file sprawl, `@theme` directive provides first-class design token support |
| **MySQL Connection Pool** | Better concurrency, automatic reconnection, and connection reuse compared to a single connection |
| **Parameterized Queries** | Prevents SQL injection — no string concatenation in any query |
| **API-served Location Data** | Country/city data is served from the backend — single source of truth for cascading dropdowns |
| **Custom `useForm` Hook** | Cleanly separates form state management, validation logic, and submission handling from UI components |
| **Debounced Search (300ms)** | Prevents excessive API calls while the user is still typing |
| **Dual Validation** | Client-side for instant UX feedback + server-side for security (defense in depth) |
| **Field-keyed Error Responses** | API returns `{ errors: { fieldName: "message" } }` so the frontend can map errors directly to form fields |
| **Helmet + CORS** | Security best practices — HTTP security headers and controlled cross-origin access |

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------| 
| Frontend | React 19 + Vite 8 | UI framework + fast build tool |
| Styling | Tailwind CSS 4 | Utility-first CSS with custom design tokens |
| Language | TypeScript 5 | Type-safe JavaScript (both client & server) |
| Date Picker | react-datepicker | Accessible calendar/date picker component |
| HTTP Client | Axios | API calls with typed responses |
| Backend | Express.js | REST API framework |
| Validation | express-validator | Server-side input validation |
| Security | Helmet + CORS | HTTP security headers |
| Database | MySQL 8.0 | Relational data storage |
| DB Driver | mysql2 | Promise-based MySQL driver with connection pooling |
| Dev Tooling | tsx | TypeScript execution for server development |

---

## 🔮 What I Would Do Next (Given More Time)

1. **Unit & Integration Tests** — Jest for backend API tests, React Testing Library for component tests
2. **Pagination** — Server-side pagination for the users table as the dataset grows
3. **Edit & Delete** — Full CRUD operations with confirmation modals for delete
4. **Authentication** — JWT-based auth to protect admin routes
5. **Docker** — Containerize both projects with Docker Compose for consistent environments
6. **CI/CD** — GitHub Actions pipeline for lint, typecheck, test, and deploy
