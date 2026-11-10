# Progress Report Card Maker

Full-stack application (React frontend + Node/Express backend + MongoDB) for
"Dr. Wakeel Nazeer Inter College, Mani Kalan, Jaunpur (U.P.)".
It generates official "Progress Report Cards" with custom school header & logo,
student details & photo, and complete marks entry with PDF download and print.

---

## 1. Quick Start Commands

Run these inside the `schoolsystem` folder.

| Task | Command | Description |
|---|---|---|
| **Install all packages** | `npm install` | Installs root, frontend, and backend packages |
| **Run both servers** | `npm run dev` | Runs backend (port 5000) and React frontend (port 5173) together |
| **Run backend only** | `npm run dev:backend` | Runs Node/Express with nodemon |
| **Run frontend only** | `npm run dev:frontend` | Runs Vite React dev server with proxy to `/api` |
| **Run unit tests** | `npm test -w frontend` | Runs Vitest tests for calculation logic |
| **Build for production** | `npm run build` | Compiles the React app into `frontend/dist` |
| **Start production server** | `npm start` | Express server runs API and serves production React app |

---

## 2. Configuration (`.env`)

### Backend (`backend/.env`)
Copy `backend/.env.example` to `backend/.env`:
```env
PORT=5000
# Local MongoDB:
MONGO_URI=mongodb://127.0.0.1:27017/schoolsystem
# Or MongoDB Atlas:
# MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/schoolsystem

JWT_SECRET=school_report_card_jwt_secret_key_change_in_production
DEFAULT_EMAIL=admin@school.com
DEFAULT_PASSWORD=ChangeMe@123
```

When backend starts and connects to MongoDB, it automatically seeds:
1. The initial admin user with `DEFAULT_EMAIL` and `DEFAULT_PASSWORD` (hashed with `bcryptjs`).
2. Default school details and subjects if none exist.
3. Three initial sample students with sample marks.

---

## 3. Architecture & Security

### Backend (Node + Express + MongoDB)
- **`backend/src/models/User.js`**: Users collection with bcrypt password hashing.
- **`backend/src/models/Student.js`**: Students collection storing personal info, photos, and marks.
- **`backend/src/models/Settings.js`**: School info, pass %, and subjects collection.
- **`backend/src/middleware/auth.js`**: JWT Bearer token authentication guard.
- **`backend/src/routes/auth.js`**:
  - `POST /api/auth/login` (checks password, issues 7-day JWT)
  - `GET /api/auth/me` (gets current user session)
  - `POST /api/auth/change-password` (verifies current password, saves new hashed password)
  - `POST /api/auth/logout`
- **`backend/src/routes/students.js`**: Full CRUD for student records and marks.
- **`backend/src/routes/settings.js`**: Read/write school settings and subjects.

### Frontend (React + Vite + Tailwind CSS)
- **`frontend/src/services/apiClient.js`**: Centralized HTTP client attaching JWT token to all requests.
- **`frontend/src/services/authService.js`**: Login, logout, change password, get current user via backend API.
- **`frontend/src/services/studentService.js`**: Student CRUD via `/api/students`.
- **`frontend/src/services/settingsService.js`**: Settings via `/api/settings`.
- **`frontend/vite.config.js`**: Proxies `/api` requests to `http://localhost:5000`.

---

## 4. Marks & Calculation Rules

### Two-Stage Marks System:
- **Stage 1 (Half Yearly only)**:
  - Active when only Half Yearly marks (I and/or II Pract.) are entered across all subjects.
  - Totals, Percentage, Division, and Result (PASS/FAIL) are calculated strictly from Half Yearly marks.
  - Annual Exam and G. Total columns remain empty on the printed report card.
- **Stage 2 (Annual / Combined)**:
  - Active when at least one Annual mark is entered.
  - G. Total M.M. = Half Yearly M.M. + Annual M.M.
  - G. Total M.O. = Half Yearly Obtained + Annual Obtained.
  - Totals, Percentage, Division, and Result (PASS/FAIL) are calculated from G. Total.
- **Pass mark**: 33% in every subject (customizable in School Settings). Stage 1 checks against Half Yearly M.M., Stage 2 checks against G. Total M.M.
- **Division**: First ≥ 60%, Second ≥ 45%, Third otherwise. Any subject failing makes the final result FAIL.
- **Position in Class**: Kept blank for manual handwriting on the physical report card.

---

## 5. Sample Data Included

| Student | Class | Result | Stage |
|---|---|---|---|
| **SAMPLE - Aarav Kumar** | 9TH | 1st Division, PASS | Stage 2 (Combined Half Yearly + Annual) |
| **SAMPLE - Sana Khan** | 9TH | 1st Division, PASS | Stage 1 (Half Yearly only, Annual empty) |
| **SAMPLE - Rohit Yadav** | 10TH | Fails English (<33%), FAIL | Stage 2 (Annual entered) |
