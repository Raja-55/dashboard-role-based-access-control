# Role Based Access (RBAC) — Projects & Tasks (MERN)
# Project Progress and Issues

## Project Overview


This project is a role-based access control (RBAC) dashboard application. It consists of a client-side React application and a server-side Node.js application. Below is a detailed breakdown of the project structure, progress, and issues.

---
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
CLIENT_ORIGINS=http://localhost:5173
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

## Deployment notes (Vercel + Railway)

- **Vercel (frontend):** set `VITE_API_URL` to your API origin (example: `https://rbac-server-production.up.railway.app`) for **Production + Preview + Development** environments, then redeploy.
- **Railway (backend):** set `CLIENT_ORIGINS` to a comma-separated allowlist of frontend origins (example: `https://dashboard-role-based-access-control.vercel.app`). If you want preview deployments to work too, set `ALLOW_VERCEL_PREVIEWS=true`.

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


## Client-Side (React)

### **Progress**

- **Main Files:**
  - `App.jsx`: Main application component.
  - `main.jsx`: Entry point for the React application.
  - `styles.css`: Global styles.

- **Components:**
  - `ToasterRoot.jsx`: Handles toast notifications.
  - `ui/`:
    - `Badge.jsx`: Badge component.
    - `Button.jsx`: Button component.
    - `Card.jsx`: Card component.
    - `Input.jsx`: Input component.

- **Context:**
  - `AuthContext.jsx`: Provides authentication context.

- **Layouts:**
  - `AppLayout.jsx`: Layout for authenticated users.
  - `PublicLayout.jsx`: Layout for unauthenticated users.

- **Pages:**
  - `Dashboard.jsx`: Dashboard page.
  - `Landing.jsx`: Landing page.
  - `Login.jsx`: Login page.
  - `Projects.jsx`: Projects page.
  - `Signup.jsx`: Signup page.
  - `Tasks.jsx`: Tasks page.

- **Routes:**
  - `ProtectedRoute.jsx`: Handles route protection.

- **Services:**
  - `api.js`: Base API service.
  - `authApi.js`: Authentication API service.
  - `projectApi.js`: Project-related API service.
  - `taskApi.js`: Task-related API service.
  - `userApi.js`: User-related API service.

### **Issues**

1. **CORS Errors:**
   - The client is unable to communicate with the server due to missing `Access-Control-Allow-Origin` headers.
   - **Solution:** Update the server to include proper CORS configuration.

2. **Authentication Issues:**
   - 401 Unauthorized errors when accessing protected routes.
   - **Solution:** Ensure tokens are sent in the `Authorization` header and validate them on the server.

3. **Bad Request on Login/Register:**
   - 400 errors due to invalid payloads.
   - **Solution:** Validate request payloads on both client and server.

---

## Server-Side (Node.js)

### **Progress**

- **Main Files:**
  - `server.js`: Entry point for the server.

- **Configuration:**
  - `db.js`: Database connection.
  - `env.js`: Environment variable configuration.

- **Controllers:**
  - `authController.js`: Handles authentication logic.
  - `projectController.js`: Handles project-related logic.
  - `taskController.js`: Handles task-related logic.
  - `userController.js`: Handles user-related logic.

- **Middleware:**
  - `authMiddleware.js`: Authentication middleware.
  - `errorMiddleware.js`: Error handling middleware.
  - `roleMiddleware.js`: Role-based access control middleware.

- **Models:**
  - `Project.js`: Project schema.
  - `Task.js`: Task schema.
  - `User.js`: User schema.

- **Routes:**
  - `authRoutes.js`: Authentication routes.
  - `projectRoutes.js`: Project-related routes.
  - `taskRoutes.js`: Task-related routes.
  - `userRoutes.js`: User-related routes.

- **Utilities:**
  - `cookie.js`: Cookie utilities.
  - `jwt.js`: JWT utilities.
  - `resetDB.js`: Database reset script.

### **Issues**

1. **CORS Configuration:**
   - Missing `Access-Control-Allow-Origin` headers.
   - **Solution:** Use the `cors` package to configure CORS.

2. **Token Validation:**
   - Tokens are not being validated properly.
   - **Solution:** Ensure `authMiddleware.js` correctly verifies tokens.

3. **Error Handling:**
   - Errors are not being logged or returned consistently.
   - **Solution:** Improve `errorMiddleware.js` to handle and log errors.

---

## Next Steps

1. Fix CORS issues on the server.
2. Validate tokens and improve authentication flow.
3. Test all API endpoints using Postman.
4. Debug and fix payload validation issues for login and registration.
5. Write unit tests for critical components and routes.

---

## Summary

The project is well-structured but requires fixes for CORS, authentication, and error handling. Once these issues are resolved, the application should function as expected.
