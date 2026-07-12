# Vacations Management System

A full-stack web application for browsing vacation packages, liking favorites, and managing vacations with admin capabilities.


## Project Structure

```
project-3/
├── Database/          # MySQL schema, seed data, and database export
├── Backend/           # Node.js + Express + TypeScript REST API
├── Frontend/          # React + TypeScript client application
└── docker-compose.yml # Docker orchestration
```

## Features

- **User Registration & Login** - JWT-based authentication with role-based access
- **Vacation Browsing** - Card-based display with pagination (9 per page)
- **Like System** - Users can like/unlike vacations
- **Filters** - All, Liked, Active, and Upcoming vacations
- **AI Recommendations** - OpenAI-powered travel suggestions
- **MCP Database Queries** - Natural language questions about the database
- **Admin Panel** - CRUD operations for vacations
- **Reports** - Bar chart of likes per destination with CSV export
- **Docker Support** - Full containerized deployment

## Technology Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Database | MySQL 8.0                           |
| Backend  | Node.js, Express, TypeScript        |
| Frontend | React, TypeScript, Vite, Recharts   |
| Auth     | JWT, bcrypt                         |
| AI       | OpenAI API                          |
| MCP      | Model Context Protocol SDK            |
| Deploy   | Docker & Docker Compose             |

## Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/project-3.git
cd project-3

# Start all services
docker compose up -d --build
```

The application will be available at:
- **Frontend:** http://localhost
- **Backend API:** http://localhost:3001
- **MySQL:** localhost:3306

## Manual Setup

### Prerequisites

- Node.js 20+
- MySQL 8.0+
- npm

### Database Setup

```bash
mysql -u root -p < Database/schema.sql
mysql -u root -p < Database/seed.sql
```

### Backend Setup

```bash
cd Backend
cp .env.example .env
# Edit .env with your database credentials and OpenAI API key
npm install
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173 with API proxy to backend.

### Setup Vacation Images

```bash
chmod +x Database/setup-images.sh
./Database/setup-images.sh
```

## Demo Accounts

| Role  | Email                | Password |
|-------|----------------------|----------|
| Admin | admin@vacations.com  | admin123 |
| User  | john@example.com     | user123  |

## API Endpoints

| Method | Endpoint                    | Auth     | Description              |
|--------|-----------------------------|----------|--------------------------|
| POST   | /api/auth/register          | Public   | Register new user        |
| POST   | /api/auth/login             | Public   | Login                    |
| GET    | /api/auth/me                | User     | Get current user         |
| GET    | /api/vacations              | User     | List vacations (paginated)|
| POST   | /api/vacations/:id/like     | User     | Toggle like              |
| POST   | /api/vacations              | Admin    | Create vacation          |
| PUT    | /api/vacations/:id          | Admin    | Update vacation          |
| DELETE | /api/vacations/:id        | Admin    | Delete vacation          |
| GET    | /api/vacations/report       | Admin    | Likes report             |
| GET    | /api/vacations/report/csv   | Admin    | Download CSV report      |
| POST   | /api/ai/recommend           | User     | AI travel recommendation |
| POST   | /api/mcp/query              | User     | MCP database query       |

A Postman collection is available at `Backend/Vacations-API.postman_collection.json`.

## MCP Server

The backend includes a standalone MCP server for database queries:

```bash
cd Backend
npx ts-node src/mcp/server.ts
```

## Developer

**Name:** Romi  
**Course:** Full Stack Web Developer - Project 3  

