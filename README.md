# Team Task Manager

A full-stack collaborative task management web application built with the MERN stack (MongoDB, Express.js, React, Node.js). Teams can create projects, assign tasks, and track progress in real-time.

## Features

- **User Authentication** — Signup/Login with JWT-based secure authentication
- **Project Management** — Create projects, add/remove team members
- **Task Management** — Create tasks with title, description, due date, and priority; assign to users; update status (To Do, In Progress, Done)
- **Dashboard** — View total tasks, tasks by status, tasks per user, and overdue tasks
- **Role-Based Access** — Admin can manage tasks and users; Members can view and update assigned tasks only
- **Kanban Board** — Visual task management with status columns

## Tech Stack

| Layer      | Technology                       |
|------------|----------------------------------|
| Frontend   | React 19, Vite, React Router v7 |
| Backend    | Node.js, Express 5              |
| Database   | MongoDB (with Mongoose ODM)     |
| Auth       | JWT (JSON Web Tokens)           |
| Styling    | Vanilla CSS with Inter font     |

## Project Structure

```
team_task_manager/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Route handlers
│   ├── middleware/       # Auth middleware
│   ├── models/          # Mongoose schemas (User, Project, Task)
│   ├── routes/          # API route definitions
│   └── server.js        # Express app entry point
├── frontend/
│   ├── public/          # Static assets
│   └── src/
│       ├── components/  # Reusable UI components
│       ├── context/     # Auth context provider
│       ├── pages/       # Page components
│       └── utils/       # API helper
└── package.json         # Root scripts
```

## Setup & Installation

### Prerequisites

- Node.js >= 18
- MongoDB (local or Atlas URI)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd team_task_manager
   ```

2. **Install dependencies**
   ```bash
   npm run build
   ```

3. **Configure environment variables**
   Create `backend/.env`:
   ```
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/team_task_manager
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

4. **Start backend**
   ```bash
   cd backend && npm start
   ```

5. **Start frontend (in a new terminal)**
   ```bash
   cd frontend && npm run dev
   ```

6. Open `http://localhost:5173` in your browser.

## API Endpoints

### Auth
| Method | Endpoint              | Description          | Access  |
|--------|-----------------------|----------------------|---------|
| POST   | `/api/auth/register`  | Register a new user  | Public  |
| POST   | `/api/auth/login`     | Login & get token    | Public  |
| GET    | `/api/auth/profile`   | Get user profile     | Private |
| GET    | `/api/auth/users`     | Get all users        | Private |

### Projects
| Method | Endpoint                            | Description         | Access        |
|--------|-------------------------------------|---------------------|---------------|
| POST   | `/api/projects`                     | Create project      | Private       |
| GET    | `/api/projects`                     | Get user's projects | Private       |
| GET    | `/api/projects/:id`                 | Get project by ID   | Private       |
| PUT    | `/api/projects/:id/members`         | Add member          | Private/Admin |
| DELETE | `/api/projects/:id/members/:userId` | Remove member       | Private/Admin |

### Tasks
| Method | Endpoint          | Description       | Access        |
|--------|-------------------|--------------------|---------------|
| POST   | `/api/tasks`      | Create task        | Private       |
| GET    | `/api/tasks`      | Get tasks          | Private       |
| PUT    | `/api/tasks/:id`  | Update task        | Private       |
| DELETE | `/api/tasks/:id`  | Delete task        | Private/Admin |

### Dashboard
| Method | Endpoint               | Description      | Access  |
|--------|------------------------|------------------|---------|
| GET    | `/api/dashboard/stats` | Get dashboard stats | Private |

## Deployment (Railway)

1. Push code to GitHub
2. Go to [Railway](https://railway.app) and create a new project
3. Connect your GitHub repository
4. Add a MongoDB service (or use MongoDB Atlas)
5. Set environment variables:
   ```
   MONGO_URI=<your_mongodb_uri>
   JWT_SECRET=<your_secret>
   NODE_ENV=production
   ```
6. Railway will auto-detect the `npm run build` and `npm start` scripts
7. Your app will be live at the Railway-provided URL

## License

MIT
