# Progress Report Card Maker

Makes a "Progress Report Card" for every student of Dr. Wakeel Nazeer Inter College
(Mani Kalan, Jaunpur). Login, school settings, students, marks, report card, PDF and print.

**Right now only the frontend (`frontend/`) is used.** All data is saved in the browser
(localStorage). The `backend/` folder (Node + Express + MongoDB) is not connected yet.

## Commands

Run these in the `schoolsystem` folder (the one that contains this file).

| What | Command | What it does |
|---|---|---|
| Install | `npm install` | Downloads all libraries (only needed once) |
| First-time setup | `copy frontend\.env.example frontend\.env` | Makes your own settings file with the first login |
| Run the app | `npm run dev:frontend` | Starts the app at http://localhost:5173 |
| Run the tests | `npm test -w frontend` | Checks that every calculation rule works |
| Build for production | `npm run build -w frontend` | Makes the finished files in `frontend/dist` |
| Preview the build | `npm run preview -w frontend` | Opens the finished build locally |

> `npm run dev` starts the frontend **and** the backend together. Use it only after MongoDB is set up;
> until then use `npm run dev:frontend`.

## First login

Set in `frontend/.env` (copy of `frontend/.env.example`):

```
VITE_DEFAULT_EMAIL=admin@school.com
VITE_DEFAULT_PASSWORD=ChangeMe@123
```

After logging in, use **Change password** in the top bar. The login is temporary and **not secure**
(see "Replacing with the backend" below).

If you change `.env` after someone already logged in on a browser, the old account stays in that
browser's storage. To start again, clear this site's data in the browser settings.

## Sample data

The first time you open the app it creates **3 sample students**, each marked with a yellow
**SAMPLE** tag:

| Student | Class | Shows |
|---|---|---|
| SAMPLE - Aarav Kumar | 9TH | First division, Position 1st, PASS |
| SAMPLE - Sana Khan | 9TH | Second division, Position 2nd, PASS |
| SAMPLE - Rohit Yadav | 10TH | Fails English, Result FAIL |

Delete them from the Students page when you start entering real students.

## Marks rules

- **Half Yearly marks are stored only.** They are saved and printed exactly as entered. They are
  never used in any total, G. Total, percentage, division, position, pass/fail or result.
- **Annual marks (I and II Pract.) are the only marks used for results.**
- A subject counts only if at least one annual mark is entered for it.
- Pass mark: 33% in every annual subject (change it on the School & Subjects page).
- Division: First ≥ 60%, Second ≥ 45%, Third otherwise, Fail if any subject fails.
- Position in Class: rank among passed students of the same class (same percentage = same position).

All of this is in `frontend/src/lib/calculations.js`, with tests in `calculations.test.js`.

## Folder map

```
frontend/src/
├── services/    authService, studentService, settingsService   ← the backend replaces these
├── lib/         calculations.js (+ tests), pdf.js, images.js
├── context/     AuthContext (shares the logged-in user)
├── pages/       LoginPage, SchoolPage, StudentsPage, ReportCardsPage
├── components/  Layout, TopBar, RequireAuth, ChangePasswordDialog, SchoolSettings, SubjectManager,
│                StudentList, StudentForm, MarksEntry, ClassFilter, ReportCard, ReportCardPreview
├── data/        sampleData.js (the 3 sample students)
└── assets/      logo.js (school logo)
```

## Replacing with the backend later

Only these three files talk to storage. Keep the same function names and return values and
no component needs to change:

| File | Functions | Backend idea |
|---|---|---|
| `services/authService.js` | `login`, `logout`, `changePassword`, `getCurrentUser` | `POST /api/auth/login`, `/logout`, `/change-password`, `GET /api/auth/me` (use a secure cookie or token and hashed passwords) |
| `services/studentService.js` | `listStudents`, `getStudent`, `createStudent`, `updateStudent`, `deleteStudent` | `GET/POST /api/students`, `GET/PUT/DELETE /api/students/:id` |
| `services/settingsService.js` | `getSettings`, `saveSettings`, `saveSchool`, `saveSubjects` | `GET/PUT /api/settings` |

Notes for the backend work:

- `frontend/vite.config.js` already sends `/api` requests to `http://localhost:5000`.
- No component reads localStorage for login. Components only use `AuthContext` → `authService`.
- Photos and the logo are small data-URL text strings. Store them as files or in the database later.
- The sample students are created by `studentService` on first run; remove that when real data exists.

