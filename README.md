# M&M — Mentor–Mentee Academic Management Hub

Backend API and complete web application built for the **M&M Mentor–Mentee System**.

---

## 🌟 Key Features

1. **Role-Based Authentication (`Student` & `Faculty`)**:
   - Students authenticate via **University Roll Number** (e.g., `1CR21CS042`) or Campus Email.
   - Faculty members authenticate via **Institutional Faculty Email** (e.g., `dr.sharma@niet.edu`) or Faculty ID.
   - Secure passwords hashed with **bcrypt**.
   - Session management powered by **JSON Web Tokens (JWT)** with optional persistent "Remember this device" duration.
2. **Interactive Front-End & Dynamic Dashboards**:
   - Pixel-perfect integration with the provided HTML landing page.
   - Real-time client-to-backend fetch calls with inline error/success feedback.
   - **Student Dashboard (`/student-dashboard.html`)**: View CGPA, semester attendance bar, assigned faculty mentor, request mentorship reviews, track academic milestones.
   - **Faculty Dashboard (`/faculty-dashboard.html`)**: Cohort roster, at-risk flags (low attendance / low CGPA), log meeting notes, assign action items.
3. **Domain APIs**:
   - `/api/auth`: Login, profile lookup (`/me`), forgot password, logout.
   - `/api/students`: Student academic profile, meetings list, meeting booking, milestones tracker.
   - `/api/faculty`: Mentee cohort overview, statistics (at-risk count, avg attendance), meeting logging.
   - `/api/meetings`: Meeting status updates and review notes.
4. **Zero-Config File-Based Database**:
   - Seeded automatically on first run (`src/data/store.json`).
   - Easily reset or modified without installing external database servers.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Server
Development mode with live-reload:
```bash
npm run dev
```

Or production mode:
```bash
npm start
```

The server will launch at:
- **Web Portal / Landing Page**: [http://localhost:5000](http://localhost:5000)
- **API Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 🔑 Test Credentials (Pre-seeded)

### 👨‍🎓 Student Account
- **Role**: `Student`
- **Identifier**: `1CR21CS042` or `student@college.edu`
- **Password**: `academicPass@2025`
- **Student Profile**: Aarav Sharma (Semester 6, CSE, CGPA 8.64, Attendance 88.5%)

### 👩‍🎓 Student Account (At-Risk Example)
- **Role**: `Student`
- **Identifier**: `1CR21CS088` or `priya.nair@college.edu`
- **Password**: `academicPass@2025`
- **Student Profile**: Priya Nair (Semester 6, CSE, CGPA 6.85, Attendance 72.0%)

### 👨‍🏫 Faculty / Mentor Account
- **Role**: `Faculty`
- **Identifier**: `dr.sharma@niet.edu` or `FAC-CS-101`
- **Password**: `academicPass@2025`
- **Faculty Profile**: Dr. Rajesh Sharma (Associate Professor & Senior Mentor)

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/login` | Log in with credentials & role | No |
| `GET` | `/api/auth/me` | Fetch currently authenticated user profile | Bearer Token |
| `POST` | `/api/auth/forgot-password` | Request password reset instructions | No |
| `POST` | `/api/auth/logout` | End session | No |

### Student Endpoints (`/api/students`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/students/profile` | Student academic profile and mentor info | Student JWT |
| `GET` | `/api/students/meetings` | Mentorship session logs & scheduled reviews | Student JWT |
| `POST` | `/api/students/meetings/request` | Request a new mentorship meeting | Student JWT |
| `GET` | `/api/students/milestones` | Fetch academic goals | Student JWT |
| `POST` | `/api/students/milestones` | Create a new academic goal | Student JWT |
| `PATCH` | `/api/students/milestones/:id` | Update goal progress or status | Student JWT |

### Faculty Endpoints (`/api/faculty`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/faculty/profile` | Mentor profile details | Faculty JWT |
| `GET` | `/api/faculty/stats` | Cohort stats (at-risk count, avg attendance) | Faculty JWT |
| `GET` | `/api/faculty/mentees` | List of assigned student mentees | Faculty JWT |
| `GET` | `/api/faculty/mentees/:studentId` | Full record of specific mentee | Faculty JWT |
| `POST` | `/api/faculty/meetings/log` | Record notes & action items from a session | Faculty JWT |

### System & Health
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status and uptime check |
| `GET` | `/api/announcements` | General academic notices |

---

## 📁 Project Structure

```text
mentor-mentee-backend/
├── .env                  # Environment variables (port, JWT secret)
├── .env.example          # Sample environment configuration
├── package.json          # Node dependencies and npm scripts
├── README.md             # Project documentation
├── public/               # Client-facing static HTML & assets
│   ├── index.html        # Provided M&M login landing page (integrated)
│   ├── student-dashboard.html # Interactive scholar portal
│   └── faculty-dashboard.html # Interactive mentor portal
└── src/
    ├── config/           # App configuration
    │   └── index.js
    ├── controllers/      # Route controllers
    │   ├── authController.js
    │   ├── facultyController.js
    │   ├── meetingController.js
    │   └── studentController.js
    ├── data/             # Persistent JSON database & seed data
    │   ├── db.js
    │   └── store.json    # Created automatically on launch
    ├── middleware/       # JWT auth & error handling
    │   ├── authMiddleware.js
    │   └── errorHandler.js
    ├── routes/           # Express router endpoints
    │   ├── authRoutes.js
    │   ├── facultyRoutes.js
    │   ├── index.js
    │   ├── meetingRoutes.js
    │   └── studentRoutes.js
    └── server.js         # Main server entrypoint
```
