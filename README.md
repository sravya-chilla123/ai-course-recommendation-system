# PathPilot: AI-Based Personalized Course Recommendation System

> **SRS Version:** 1.0 College MVP  
> **Architecture:** Modern 3-Tier MERN Stack (React.js + Node.js + Express + MongoDB Atlas + Rule-Based AI Engine)  
> **Cost Profile:** 100% Free Tier Compliant • Zero Paid API Dependencies • Zero Setup Failure Resilience  

---

## 1. Project Overview & SRS Summary

Traditional course discovery platforms overwhelm students with uncurated catalogs and lack personalized direction. **PathPilot** is an intelligent web application built strictly according to the **AI-Based Personalized Course Recommendation System Software Requirements Specification (SRS v1.0)**. 

The platform collects a college student's skills, interests, career aspirations, experience level, and preferred technologies. It evaluates this profile against a structured catalog across **7 technical domains**, pinpoints skill gaps relative to the chosen career goal, and generates an ordered, personalized learning path with transparent explanations for each recommendation.

---

## 2. 5 Core Features Mapped to SRS Section 3

In strict adherence to **SRS Section 3 (Functional Requirements)**, the five primary pillars of the system are:

1. **Feature 1: Student Profile Management (FR2)**
   - Collects and manages: `name`, `email`, `skills` (multi-select), `interests` (multi-select), `careerGoal`, `experienceLevel` (`Beginner` / `Intermediate` / `Advanced`), and `preferredTechnologies` (multi-select).
   - Real-time profile completion percentage algorithm ($0\% - 100\%$).
   - Full student editability at any time.

2. **Feature 2: Course Catalog, Search & Course Details (FR3 & FR4)**
   - Pre-seeded database featuring 19 verified sample courses spanning **7 categories**: *Web Development*, *Programming*, *Data*, *AI*, *Cloud*, *Security*, and *Database*.
   - Multi-criteria real-time search by title, technology keywords, category tabs, and difficulty filters (*All*, *Beginner*, *Intermediate*, *Advanced*).
   - Dedicated course details page presenting full curriculum overview, competencies gained, external course launch, bookmarking, and student progress status.

3. **Feature 3: AI-Powered Course Recommendation Engine (FR5)**
   - Reads student profile and scores courses following the 5 SRS prioritization rules:
     1. Direct match with target career goal.
     2. Building upon current existing skills.
     3. Resolving critical skill gaps needed for the role.
     4. Strict alignment with experience level.
     5. Logical progression sequence (prevents redundant intro courses for known skills).
   - Structured JSON response containing `courseName`, `reason`, `difficulty`, `skillsGained`, and `learningOrder`.
   - Incomplete profile validation check with guided redirection to profile completion.

4. **Feature 4: Personalized Learning Path / Roadmap (FR6)**
   - Sequences recommended courses into an interactive step-by-step visual timeline and connected cards view.
   - Embeds an **Employability Readiness & Skill Gap Audit Tool** and an **AI Advisor Q&A** interface.

5. **Feature 5: Saved Courses & Real-Time Progress Tracker (FR7 & FR8)**
   - Students bookmark courses for later review with duplicate prevention.
   - Real-time progress updates with standardized milestones: $0\%$, $25\%$, $50\%$, $75\%$, and $100\%$.
   - Three discrete course states: `Not Started`, `In Progress`, and `Completed`.
   - Visual progress bars and analytics summary.

*Additional Modules:*
- **FR1: User Authentication & RBAC**: JWT-based session management, bcrypt password hashing, student and admin roles.
- **FR9: Student Dashboard**: Profile completion meter, 3-5 recommended course previews, saved courses, progress summary, and quick action shortcuts.
- **FR10: Admin Course Management**: Admin analytics console, curriculum distribution chart, full catalog table, and Add/Edit/Delete modals.
- **FR11: Error Handling & Loading States**: Transparent user alerts and custom AI inference loading banners.

---

## 3. SRS Traceability Matrix (Final Year Project Verification)

| SRS Req ID | Requirement Name | Implemented As | API Endpoint | Page / Route |
|---|---|---|---|---|
| **FR1** | User Authentication | JWT Auth + Bcrypt password hashing + RBAC | `POST /api/auth/register`<br>`POST /api/auth/login` | `/login`<br>`/register` |
| **FR2** | Student Profile Management | Multi-tag skill manager & dynamic completion % | `GET /api/users/profile`<br>`PUT /api/users/profile` | `/profile` |
| **FR3** | Course Database & Search | Multi-filter search (category, difficulty, tech) | `GET /api/courses` | `/courses` |
| **FR4** | Course Details | Comprehensive course info, start link & progress | `GET /api/courses/:id` | `/courses/:id` |
| **FR5** | AI Course Recommendation | Rule-based AI engine + structured JSON & reasons | `POST /api/recommendations/generate`<br>`GET /api/recommendations` | `/recommendations` |
| **FR6** | Personalized Learning Path | Interactive timeline & connected card roadmap | `GET /api/recommendations` | `/learning-path` |
| **FR7** | Save Courses | Course bookmarking with duplicate prevention | `POST /api/saved-courses`<br>`GET /api/saved-courses`<br>`DELETE /api/saved-courses/:id` | `/saved-courses` |
| **FR8** | Progress Tracking | Milestone tracking (0%, 25%, 50%, 75%, 100%) | `GET /api/progress`<br>`PUT /api/progress/:courseId` | `/saved-courses`<br>`/courses/:id` |
| **FR9** | Student Dashboard | KPI metrics, progress charts, quick actions | Aggregated Dashboard API calls | `/dashboard` |
| **FR10** | Admin Course Management | Admin KPI metrics, chart, course table & CRUD modal | `GET /api/admin/stats`<br>`POST /api/courses`<br>`PUT /api/courses/:id`<br>`DELETE /api/courses/:id` | `/admin` |
| **FR11** | Error Handling & Loading States | User error toasts & AI loading state indicators | Global Express Error Handler + ToastContext | System-wide |

---

## 4. Technology Stack (Strictly Free Tier Only)

- **Frontend:**
  - React.js 18 + Vite
  - Tailwind CSS + Custom Glassmorphism styles
  - React Router v6
  - Axios (with centralized JWT request & error interceptors)
  - Recharts (Donut Pie Charts & Category Bar Charts)
  - Lucide React (Sleek modern iconography)
- **Backend:**
  - Node.js + Express.js
  - JSON Web Tokens (JWT) + Bcryptjs password hashing
  - CORS + Dotenv
- **Database:**
  - **MongoDB Atlas FREE Tier (M0)**: Production-grade cloud document storage.
  - **In-Memory Fallback Store**: `server/config/db.js` automatically activates a high-performance in-memory mock collection if `MONGO_URI` is not provided or unreachable. **The application never crashes or fails to demo.**
- **AI Engine (`client/src/services/aiService.js` & Backend Controller):**
  - Rule-based AI Engine adhering strictly to SRS Section 3 FR5 and Appendix C prompt design.
  - Generates structured JSON with $800\text{ ms}$ simulated inference delay.
  - **Zero paid API keys, zero credit cards, zero billing risk.**

---

## 5. Folder Structure

```
pathpilot/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env.example
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   ├── Loader.jsx
│       │   ├── CourseCard.jsx
│       │   ├── CourseModal.jsx
│       │   └── ProgressChart.jsx
│       ├── context/
│       │   ├── AuthContext.jsx
│       │   └── ToastContext.jsx
│       ├── services/
│       │   ├── api.js
│       │   └── aiService.js
│       └── pages/
│           ├── Landing.jsx
│           ├── Login.jsx
│           ├── Register.jsx
│           ├── Dashboard.jsx
│           ├── Profile.jsx              (FR2: Feature 1)
│           ├── CourseCatalog.jsx        (FR3: Feature 2)
│           ├── CourseDetails.jsx        (FR4: Feature 2)
│           ├── Recommendations.jsx      (FR5: Feature 3)
│           ├── LearningPath.jsx         (FR6: Feature 4)
│           ├── SavedCourses.jsx         (FR7 & FR8: Feature 5)
│           └── AdminDashboard.jsx       (FR10: Admin Management)
├── server/
│   ├── package.json
│   ├── server.js
│   ├── .env.example
│   ├── config/
│   │   ├── db.js                        (Dual-mode Atlas & In-Memory Fallback)
│   │   └── seedData.js                  (19 Seeded Courses across 7 categories)
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── SavedCourse.js
│   │   ├── Progress.js
│   │   └── Recommendation.js
│   ├── middleware/
│   │   ├── authMiddleware.js            (JWT & RBAC Guards)
│   │   └── errorHandler.js              (Uniform JSON Error Handler)
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── courseController.js
│   │   ├── recommendationController.js
│   │   ├── savedCourseController.js
│   │   ├── progressController.js
│   │   └── adminController.js
│   └── routes/
│       ├── auth.js
│       ├── users.js
│       ├── courses.js
│       ├── recommendations.js
│       ├── savedCourses.js
│       ├── progress.js
│       └── admin.js
├── .env.example
├── README.md
└── package.json
```

---

## 6. Database Models (Mongoose Schemas)

1. **User (`models/User.js`)**
   - `name`: String (Required)
   - `email`: String (Required, Unique, Lowercase)
   - `password`: String (Hashed with bcrypt, minlength 6)
   - `role`: Enum `['student', 'admin']` (Default: `student`)
   - `skills`: `[String]`
   - `interests`: `[String]`
   - `careerGoal`: String
   - `experienceLevel`: Enum `['Beginner', 'Intermediate', 'Advanced']`
   - `preferredTechnologies`: `[String]`
   - `createdAt`: Date

2. **Course (`models/Course.js`)**
   - `courseName`: String (Required)
   - `category`: Enum `['Web Development', 'Programming', 'Data', 'AI', 'Cloud', 'Security', 'Database']`
   - `description`: String (Required)
   - `skills`: `[String]` (Required)
   - `difficulty`: Enum `['Beginner', 'Intermediate', 'Advanced']`
   - `duration`: String (e.g., `"6 weeks"`)
   - `courseLink`: String (URL)
   - `createdAt`: Date

3. **SavedCourse (`models/SavedCourse.js`)**
   - `userId`: ObjectId (Ref: `User`)
   - `courseId`: ObjectId (Ref: `Course`)
   - `createdAt`: Date
   - *Compound Index:* `{ userId: 1, courseId: 1 }` (Unique)

4. **Progress (`models/Progress.js`)**
   - `userId`: ObjectId (Ref: `User`)
   - `courseId`: ObjectId (Ref: `Course`)
   - `status`: Enum `['Not Started', 'In Progress', 'Completed']`
   - `completionPercentage`: Enum `[0, 25, 50, 75, 100]`
   - `updatedAt`: Date

5. **Recommendation (`models/Recommendation.js`)**
   - `userId`: ObjectId (Ref: `User`)
   - `courseId`: ObjectId (Ref: `Course`)
   - `reason`: String (Personalized explanation)
   - `learningOrder`: Number (Sequence in learning path)
   - `createdAt`: Date

---

## 7. REST API Endpoints Table

| Method | Endpoint | Access Level | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new student or admin |
| `POST` | `/api/auth/login` | Public | Login and receive JWT token |
| `GET` | `/api/users/profile` | Authenticated | Get current user profile & completion % |
| `PUT` | `/api/users/profile` | Authenticated | Update user profile fields |
| `GET` | `/api/courses` | Public / Auth | List, search, and filter courses |
| `GET` | `/api/courses/:id` | Public / Auth | Get course details & student progress status |
| `POST` | `/api/courses` | Admin Only | Add a new course to catalog |
| `PUT` | `/api/courses/:id` | Admin Only | Edit existing course |
| `DELETE` | `/api/courses/:id` | Admin Only | Delete course from catalog |
| `POST` | `/api/recommendations/generate` | Student | Generate AI course recommendations |
| `GET` | `/api/recommendations` | Student | Retrieve previously saved recommendations |
| `POST` | `/api/saved-courses` | Student | Save / bookmark a course |
| `GET` | `/api/saved-courses` | Student | List all saved courses with progress |
| `DELETE` | `/api/saved-courses/:courseId` | Student | Remove course from saved bookmarks |
| `GET` | `/api/progress` | Student | Retrieve course progress list & summary stats |
| `PUT` | `/api/progress/:courseId` | Student | Update course status & milestone percentage |
| `GET` | `/api/admin/stats` | Admin Only | Get total courses, students & category metrics |
| `GET` | `/api/health` | Public | System uptime & healthcheck |

---

## 8. How the AI Recommendation Engine Works

1. **Input Parameters:**
   The advisor inspects `careerGoal`, `skills[]`, `interests[]`, `experienceLevel`, and `preferredTechnologies[]`.
2. **Scoring Priorities (SRS Section 3 FR5):**
   - $+35\text{ pts}$: Course title or skills align directly with target career goal.
   - $+25\text{ pts}$: Course teaches competencies that fill student's identified skill gaps.
   - $+20\text{ pts}$: Course builds on existing foundational skills.
   - $+20\text{ pts}$: Course difficulty matches student experience level.
   - $+15\text{ pts}$: Course uses preferred technologies.
   - $+10\text{ pts}$: Course aligns with category interests.
3. **Redundancy Suppression:**
   Introductory beginner courses are suppressed if the student already possesses those exact skills.
4. **Logical Sequencing (FR6):**
   Selected courses are sequenced ($1 \to N$) in ascending order of difficulty (Beginner $\to$ Intermediate $\to$ Advanced) to produce an ordered roadmap.

---

## 9. Instant Demo Credentials (1-Click Fillers Included)

For rapid evaluation and grading, pre-seeded accounts are provided:

| Role | Email | Password |
|---|---|---|
| **Demo Student** | `student@pathpilot.com` | `student123` |
| **Demo Admin** | `admin@pathpilot.com` | `admin123` |

*Note: On the `/login` screen, click the **"Demo Student"** or **"Demo Admin"** button for instant one-click login!*

---

## 10. How to Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Option A: Quickstart (Both Client & Server)

1. **Install Dependencies:**
   ```bash
   npm run install-all
   ```
   *(Or individually inside `client/` and `server/` via `npm install`)*

2. **Start Both Dev Servers Concurrently:**
   ```bash
   npm run dev
   ```

3. **Open Application in Browser:**
   - Client: `http://localhost:5173`
   - Server API: `http://localhost:5000/api/health`

### Option B: Running Separately

**Backend:**
```bash
cd server
npm install
npm run dev
```

**Frontend:**
```bash
cd client
npm install
npm run dev
```

---

## 11. Deployment Guide

### Deploying Frontend to Vercel (Free)
1. Push this repository to GitHub.
2. Log into [Vercel](https://vercel.com) and click **"New Project"**.
3. Select your repository and choose **Root Directory**: `client`.
4. Framework preset: **Vite**.
5. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g. `https://pathpilot-api.onrender.com/api`).
6. Click **Deploy**.

### Deploying Backend to Render (Free)
1. Log into [Render](https://render.com) and click **"New Web Service"**.
2. Select your repository and set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `JWT_SECRET`: `your_secure_random_jwt_secret`
   - `CLIENT_URL`: Your deployed Vercel frontend URL
   - `MONGO_URI`: (Optional) Your free MongoDB Atlas connection string. If omitted, the server runs seamlessly using its built-in in-memory database!
4. Click **Deploy Web Service**.

---

## 12. Verification & Validation Summary

- [x] **FR1:** Auth flow with password hashing, JWT session, and role redirection tested.
- [x] **FR2:** Profile management with live completion percentage tested.
- [x] **FR3 & FR4:** 19 seeded courses, live multi-filter search, and course details verified.
- [x] **FR5:** AI recommendation generation with reason explanations and skills gained verified.
- [x] **FR6:** Visual learning path timeline and connected cards tested.
- [x] **FR7 & FR8:** Save/unsave bookmarks and $0\% - 100\%$ progress milestone tracking tested.
- [x] **FR9:** Student Dashboard with Recharts analytics and quick actions verified.
- [x] **FR10:** Admin console with statistics, curriculum chart, and Add/Edit/Delete table verified.
- [x] **FR11:** Error boundaries, incomplete profile guards, and loading states verified.
- [x] **Free Tier Compliance:** 100% free tier, zero billing dependencies, zero setup barriers.
