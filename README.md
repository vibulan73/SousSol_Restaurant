# Sous Sol — Restaurant Website

> *Hidden Below. Found By Few.*

A full-stack website for **Sous Sol**, a clandestine underground dining experience in Norwood, Adelaide.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| Backend | Spring Boot 3.4, Java 21, Spring Security + JWT |
| Database | PostgreSQL |
| Build tool | Maven (backend), npm (frontend) |

---

## Prerequisites

Make sure the following are installed before starting:

- **Java 21** — [Download](https://adoptium.net/)
- **Maven 3.9+** — [Download](https://maven.apache.org/download.cgi)
- **Node.js 18+** — [Download](https://nodejs.org/)
- **PostgreSQL 15+** — [Download](https://www.postgresql.org/download/)

---

## 1. Database Setup

Open **pgAdmin** or **psql** and run:

```sql
CREATE DATABASE soussol;
```

Default connection settings (already in `application.properties`):

| Setting | Default |
|---------|---------|
| Host | `localhost` |
| Port | `5432` |
| Database | `soussol` |
| Username | `postgres` |
| Password | `4321` |

> To use different credentials, set environment variables before starting the backend (see [Environment Variables](#environment-variables)).

---

## 2. Backend — Spring Boot

### Navigate to the backend folder

```bash
cd D:\Career\CodeGloFix\SousSol\soussol_backend
```

### Run with Maven wrapper

```bash
# Windows (Command Prompt)
mvnw.cmd spring-boot:run

# Windows (Git Bash / PowerShell)
./mvnw spring-boot:run
```

### Or build a JAR and run it

```bash
mvnw.cmd clean package -DskipTests
java -jar target/jacks_backend-0.0.1-SNAPSHOT.jar
```

The backend starts at **http://localhost:8080**

> On first run with the `dev` profile active, the `DataInitializer` will automatically seed the database with sample data (menu categories, items, etc.).

---

## 3. Frontend — Next.js

### Navigate to the frontend folder

```bash
cd D:\Career\CodeGloFix\SousSol\soussol_frontend
```

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The frontend starts at **http://localhost:3000**

---

## 4. CORS Fix (Required)

The backend's default CORS setting allows `http://localhost:5173` (Vite).
Since the frontend runs on port **3000**, update `application.properties`:

```properties
# soussol_backend/src/main/resources/application.properties
app.cors.allowed-origins=http://localhost:3000
```

Or set the environment variable:

```bash
# Windows Command Prompt
set CORS_ALLOWED_ORIGINS=http://localhost:3000

# PowerShell
$env:CORS_ALLOWED_ORIGINS="http://localhost:3000"
```

Restart the backend after this change.

---

## 5. Quick Start (Both Services)

Open **two terminal windows**:

**Terminal 1 — Backend**
```bash
cd D:\Career\CodeGloFix\SousSol\soussol_backend
mvnw.cmd spring-boot:run
```

**Terminal 2 — Frontend**
```bash
cd D:\Career\CodeGloFix\SousSol\soussol_frontend
npm run dev
```

Then open **http://localhost:3000** in your browser.

---

## Environment Variables

### Backend

Set these as system environment variables or in your IDE run configuration to override defaults:

| Variable | Default | Description |
|----------|---------|-------------|
| `DB_HOST` | `localhost` | PostgreSQL host |
| `DB_PORT` | `5432` | PostgreSQL port |
| `DB_NAME` | `soussol` | Database name |
| `DB_USERNAME` | `postgres` | Database user |
| `DB_PASSWORD` | `4321` | Database password |
| `JWT_SECRET` | *(long default)* | JWT signing secret (change in production) |
| `JWT_EXPIRATION` | `86400000` | Token expiry in ms (24 hours) |
| `CORS_ALLOWED_ORIGINS` | `http://localhost:5173` | Frontend origin — **set to `http://localhost:3000`** |
| `SPRING_PROFILES_ACTIVE` | `dev` | Use `prod` to skip DB seeding |
| `MAIL_HOST` | `smtp.gmail.com` | SMTP host for email features |
| `MAIL_PORT` | `587` | SMTP port |
| `MAIL_USERNAME` | *(empty)* | Email account for sending |
| `MAIL_PASSWORD` | *(empty)* | Email account password / app password |
| `RESTAURANT_EMAIL` | *(empty)* | Address that receives reservation notifications |

### Frontend

Stored in `soussol_frontend/.env.local`:

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Backend base URL |

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — Hero, About, Featured dishes, Events, Gallery, Newsletter |
| `/menu?tab=main` | Main Menu tab |
| `/menu?tab=drinks` | Drinks tab |
| `/menu?tab=wine` | Wine tab |
| `/reservations` | Reservation form + opening hours + contact |

---

## Backend API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/menu/categories` | All menu categories |
| `GET` | `/api/menu/category/{id}` | Items by category |
| `GET` | `/api/menu/subcategories/category/{id}` | Subcategories by category |
| `GET` | `/api/menu/popular` | Signature / popular items |
| `GET` | `/api/menu` | All active items |
| `POST` | `/api/reservations` | Submit reservation request |
| `GET` | `/api/events` | Upcoming events |
| `GET` | `/api/gallery` | Gallery images |
| `GET` | `/api/hero-images` | Active hero/banner images |
| `GET` | `/api/team` | Team members |
| `GET` | `/api/settings` | Site settings (key/value) |
| `POST` | `/api/contact` | Send contact message |
| `POST` | `/api/newsletter/subscribe` | Newsletter subscription |
| `POST` | `/api/auth/login` | Admin login (returns JWT) |

---

## Build for Production

### Backend

```bash
cd D:\Career\CodeGloFix\SousSol\soussol_backend
mvnw.cmd clean package -DskipTests
java -jar target/jacks_backend-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd D:\Career\CodeGloFix\SousSol\soussol_frontend
npm run build
npm start
```

---

## Project Structure

```
SousSol/
├── soussol_backend/          Spring Boot API (Java 21)
│   └── src/main/
│       ├── java/com/jacksnorwood/jacks_backend/
│       │   ├── controller/   REST endpoints
│       │   ├── entity/       JPA entities
│       │   ├── service/      Business logic
│       │   ├── repository/   Spring Data repositories
│       │   ├── config/       Security, CORS, DataInitializer
│       │   └── dto/          Request/response objects
│       └── resources/
│           └── application.properties
│
└── soussol_frontend/         Next.js 14 frontend
    └── src/
        ├── app/              Pages (App Router)
        │   ├── page.tsx      Home
        │   ├── menu/         Menu page (3 tabs)
        │   └── reservations/ Reservations & contact
        ├── components/
        │   ├── layout/       Navbar, Footer
        │   ├── home/         Hero, About, Featured, Events, Gallery
        │   └── ui/           Newsletter
        ├── lib/api.ts        Axios API client
        └── types/index.ts    TypeScript interfaces
```

---

*Sous Sol — No signage. No promotions. Just experience.*
