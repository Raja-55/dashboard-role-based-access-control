# Role Based Access (RBAC) — Projects & Tasks (MERN)

Modern SaaS-style dashboard with secure JWT auth (HTTP-only cookies), role-based access (Admin/Member), projects, tasks, charts, and a premium UI.

## Stack

- **Frontend:** React + Vite, Tailwind CSS, Framer Motion, React Router, Axios, Recharts, react-hot-toast
- **Backend:** Node.js, Express, MongoDB Atlas (Mongoose)
- **Auth:** JWT stored in **HTTP-only cookies** (no localStorage)

## Roles

- **Admin:** create projects, manage members, create/assign tasks
- **Member:** view assigned tasks, update task status

## Getting started (local)

### 1) Backend env

Create `server/.env`:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_ATLAS_URI
JWT_SECRET=YOUR_LONG_RANDOM_SECRET
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173
```

### 2) Frontend env

Create `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 3) Install + run

```bash
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

## API overview

- Auth
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `POST /api/auth/logout`
- Projects
  - `GET /api/projects`
  - `POST /api/projects` (Admin)
  - `PUT /api/projects/:id` (Admin)
  - `DELETE /api/projects/:id` (Admin)
  - `POST /api/projects/:id/members` (Admin)
- Tasks
  - `GET /api/tasks`
  - `POST /api/tasks` (Admin)
  - `PUT /api/tasks/:id` (Admin, or Member for status only)
  - `DELETE /api/tasks/:id` (Admin)

