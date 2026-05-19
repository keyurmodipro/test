# 🧑‍💼 User Profile Manager

A full-stack CRUD application for creating and searching user profiles, built with **React**, **Node.js/Express**, and **MySQL**.

![React](https://img.shields.io/badge/React-18-61dafb?logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)

---

## 📋 Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [API Endpoints](#api-endpoints)
- [Design Decisions](#design-decisions)
- [Tech Stack](#tech-stack)
- [What I Would Do Next](#what-i-would-do-next-given-more-time)

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

## 🛠 Prerequisites

Make sure you have the following installed on your machine:

| Tool | Version | Check |
|------|---------|-------|
| **Node.js** | v18 or higher | `node --version` |
| **npm** | v9 or higher | `npm --version` |
| **MySQL** | v8.0 or higher | `mysql --version` |

---

## 🚀 Getting Started

Follow these steps to get the application running locally:

### Step 1 — Clone the Repository

```bash
git clone <repository-url>
cd user-profile-manager
```

### Step 2 — Set Up the Database

The SQL script is located at `database/schema.sql`. Run it in your MySQL client to create the database and table:

**Option A — via terminal:**
```bash
mysql -u root -p < database/schema.sql
```

**Option B — via MySQL Workbench or any GUI client:**
Open `database/schema.sql` and execute the entire script.

This will:
- Create a database called `user_profile_manager`
- Create the `users` table with proper constraints and indexes

### Step 3 — Configure Environment Variables

Create a `.env` file in the project root by copying the example:

```bash
cp .env.example .env
```

Then open `.env` and update it with **your MySQL credentials**:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=user_profile_manager
PORT=3001
NODE_ENV=development
```

### Step 4 — Install Dependencies

Run this single command from the project root — it installs dependencies for the root, server, and client:

```bash
npm run install:all
```

### Step 5 — Start the Application

```bash
npm run dev
```

This uses `concurrently` to start both servers simultaneously:

| Server | URL | Description |
|--------|-----|-------------|
| **Frontend** | http://localhost:5173 | React application |
| **Backend** | http://localhost:3001/api | REST API |

Open **http://localhost:5173** in your browser and you're good to go! 🎉

---

## 📁 Project Architecture

```
user-profile-manager/
├── client/                    # React frontend (Vite)
│   └── src/
│       ├── api/               # Centralized API service layer (Axios)
│       ├── components/
│       │   ├── common/        # Reusable: Input, Select, Toast
│       │   ├── Layout/        # App shell with header
│       │   ├── UserForm/      # Profile creation form
│       │   └── UserTable/     # Data table with search
│       └── hooks/             # Custom useForm hook
│
├── server/                    # Node.js/Express backend
│   └── src/
│       ├── config/            # MySQL connection pool configuration
│       ├── controllers/       # Request handlers
│       ├── data/              # Country/city mapping data
│       ├── middleware/        # Validation middleware (express-validator)
│       ├── models/            # Database queries (parameterized)
│       └── routes/            # Route definitions
│
├── database/
│   └── schema.sql             # SQL script — run manually to create DB & tables
│
├── .env.example               # Template for environment variables
├── .gitignore
├── package.json               # Root package with concurrently scripts
└── README.md
```

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
| Frontend | React 18 + Vite | UI framework + fast build tool |
| Styling | Vanilla CSS | Custom design system with CSS variables |
| Date Picker | react-datepicker | Accessible calendar/date picker component |
| HTTP Client | Axios | API calls with centralized config |
| Backend | Express.js | REST API framework |
| Validation | express-validator | Server-side input validation |
| Security | Helmet + CORS | HTTP security headers |
| Database | MySQL 8.0 | Relational data storage |
| DB Driver | mysql2 | Promise-based MySQL driver with connection pooling |
| Dev Tooling | concurrently | Run frontend + backend with a single command |

---

## 🔮 What I Would Do Next (Given More Time)

1. **Unit & Integration Tests** — Jest for backend API tests, React Testing Library for component tests
2. **Pagination** — Server-side pagination for the users table as the dataset grows
3. **Edit & Delete** — Full CRUD operations with confirmation modals for delete
4. **Authentication** — JWT-based auth to protect admin routes
