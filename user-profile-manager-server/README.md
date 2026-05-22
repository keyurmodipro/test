# 🖥️ User Profile Manager — Server

REST API server for the User Profile Manager application, built with **Node.js**, **Express**, **TypeScript**, and **MySQL**.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?logo=mysql&logoColor=white)

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

Run the SQL script in your MySQL client:

```bash
mysql -u root -p < database/schema.sql
```

### Step 2 — Configure Environment Variables

```bash
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

### Step 3 — Install Dependencies

```bash
npm install
```

### Step 4 — Start the Server

```bash
npm run dev
```

The API will be available at **http://localhost:3001/api**

---

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot reload (tsx) |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server (requires build first) |
| `npm run typecheck` | Run TypeScript type checking without emitting |

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

---

## 📁 Project Structure

```
user-profile-manager-server/
├── src/
│   ├── index.ts              # Express app entry point
│   ├── config/
│   │   └── db.ts             # MySQL connection pool
│   ├── controllers/
│   │   └── userController.ts # Request handlers
│   ├── data/
│   │   └── locations.ts      # Country/city data
│   ├── middleware/
│   │   └── validation.ts     # express-validator rules
│   ├── models/
│   │   └── userModel.ts      # Database queries
│   ├── routes/
│   │   └── userRoutes.ts     # Route definitions
│   └── types/
│       └── index.ts          # TypeScript interfaces
├── database/
│   └── schema.sql            # Database schema
├── .env.example
├── tsconfig.json
└── package.json
```

---

## 🧰 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Express.js | REST API framework |
| TypeScript | Type-safe JavaScript |
| MySQL 8.0 | Relational data storage |
| mysql2 | Promise-based MySQL driver with connection pooling |
| express-validator | Server-side input validation |
| Helmet + CORS | HTTP security headers |
| tsx | TypeScript execution for development |
