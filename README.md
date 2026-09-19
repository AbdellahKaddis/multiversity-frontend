# MultiVersity — Frontend

**React web app for the MultiVersity university management platform.**

A role-aware dashboard and public-facing site that digitizes the full academic lifecycle — from a student's first application to their final transcript.

---

## 🎯 Overview

This is the **client application** for MultiVersity. It serves two audiences:

1. **Public visitors** — browse universities, faculties, programs, and apply
2. **Authenticated users** — role-based dashboards for admins, deans, professors, and students

Every role sees exactly what they need. No more, no less.

---

## ✨ Features

### 🌐 Public

- **Landing page** — selling page with features, roles, and CTAs
- **University profiles** — browse faculties, programs, and admissions
- **Program details** — admission periods, requirements, apply button
- **Student application wizard** — 5 steps with autosave, uploads, and review

### 🏛️ University Admin Dashboard

- Manage faculties, degrees
- University profile (logo, contact, description)
- Overview stats

### 🎓 Faculty Dean Dashboard

- Departments, programs, courses
- Professors and professor-course assignments
- Admissions, applications, enrollments
- Student registry

### 👨‍🏫 Professor Dashboard

- Assigned courses
- Grade entry (inline, per course/semester/session)
- Publish grades to students

### 🎒 Student Dashboard

- Application tracking with status badges
- Download application receipt (PDF)
- Accept/decline approved offers
- View published grades with semester averages, rattrapage, and compensation

---

## 🛠️ Tech Stack

- **React 18** — component-based UI
- **Redux Toolkit** — global state (auth, university, faculty, professor, applicant)
- **React Router v6** — client-side routing
- **CSS Modules** — scoped styling, camelCase classes
- **React Toastify** — notifications
- **SweetAlert2** — confirmations
- **jsPDF** — client-side PDF generation
- **React Icons** — icon library
- **Vite** — dev server and build tool

---

## 📁 Project Structure

multiversity-frontend/
├── src/
│ ├── api/ # API clients (one per resource)
│ │ ├── apiClient.js # fetch wrapper: token injection + 401 handling
│ │ ├── authApi.js
│ │ ├── universityApi.js
│ │ ├── facultyApi.js
│ │ ├── applicationApi.js
│ │ ├── enrollmentApi.js
│ │ ├── gradeApi.js
│ │ └── ...
│ │
│ ├── components/
│ │ ├── common/ # Button, PageHeader, EmptyState, ErrorState
│ │ ├── auth/ # Login, signup, password reset
│ │ ├── ApplicationWizard/ # Multi-step application flow
│ │ ├── Applications/ # Application lists + review
│ │ ├── Enrollments/ # Enrollment management
│ │ ├── Students/ # Student registry
│ │ ├── Grades/ # Grade entry + student grade view
│ │ ├── Faculties/ # Faculties + faculty detail
│ │ ├── Departments/ # Departments management
│ │ ├── Programs/ # Programs + program courses
│ │ ├── Courses/ # Courses + professor assignments
│ │ ├── Professors/ # Professors + professor courses
│ │ ├── Admissions/ # Admissions management
│ │ └── UniversityAdmin/ # Admin-specific components
│ │
│ ├── features/ # Redux slices
│ │ ├── auth/authSlice.js
│ │ ├── university/universitySlice.js
│ │ ├── faculty/facultySlice.js
│ │ ├── Professor/professorSlice.js
│ │ └── applicant/applicantSlice.js
│ │
│ ├── pages/ # Public pages
│ │ ├── LandingPage.jsx
│ │ ├── UniversityProfilePage.jsx
│ │ ├── FacultiesPage.jsx
│ │ ├── FacultyDetailsPage.jsx
│ │ ├── ProgramsPage.jsx
│ │ ├── ProgramDetailsPage.jsx
│ │ └── ProfessorDetailsPage.jsx
│ │
│ ├── Layouts/
│ │ ├── AdminDashboardLayout.jsx # Sidebar + header + role-aware nav
│ │ └── UniversityLayout.jsx # Public university pages
│ │
│ ├── router/index.jsx # Route definitions
│ ├── utils/
│ │ ├── apiUrl.js # Prefix relative URLs with API base
│ │ └── ...
│ └── app/store.js # Redux store

text

---

## 🚀 Getting Started

### Prerequisites

- [Node.js 18+](https://nodejs.org/)
- The MultiVersity backend running locally

### Setup

```bash
# Clone
git clone https://github.com/your-org/multiversity-frontend.git
cd multiversity-frontend

# Install
npm install

# Configure the API base URL
# Edit src/api/authApi.js:
#   export const baseUrl = "https://localhost:5001/api/";

# Run
npm run dev
App opens on http://localhost:5173.

Build for production
bash
npm run build
npm run preview
🔐 Authentication Flow
User submits credentials at /login

API returns a JWT

authSlice stores { user, accessToken } in Redux and localStorage

On refresh: authSlice rehydrates from localStorage, checks token expiry via jwtDecode

Every API call goes through apiClient.js which:

Reads the token from Redux

Injects Authorization: Bearer <token>

Handles 401 globally: logout + toast + redirect to login

On logout: state cleared, localStorage cleared, redirect to /login (or /login/student for students)

Role-based routing
Role	Entry route
UniversityAdmin	/university-admin-dashboard
Dean	/faculty-dean-dashboard
Professor	/professor-dashboard/courses
Applicant	/student/applications
Student	/student/grades
🎨 UI/UX Standards
Design System
Primary color: #2C3E50 (dark blue — text, headings)

Accent color: #16A085 (green — buttons, actions, success)

Error: #C0392B

Warning: #E67E22

Info: #3498DB

Patterns (used consistently across all lists)
Three-state rendering — loading → empty → data

jsx
{loading ? <Spinner /> : data.length === 0 ? <EmptyState /> : <Grid />}
Spinner with context — "Loading applications…", not just "Loading…"

Empty states — icon + title + next-action hint

"No applications found. Apply for a program."

Status badges — color-coded pills

Blue (Submitted), Amber (UnderReview), Green (Approved), Red (Rejected)

Confirmations — SweetAlert2 for any destructive action

Toasts — every async action gives feedback

Optional chaining everywhere — never crash on undefined nested data

CSS Modules — every component has ComponentName.module.css, camelCase classes

🔄 Key Workflows
Student Application
text
1. Browse university → faculty → program
2. Click "Apply Now" (only shown when admission is active)
3. Complete 5-step wizard:
   - Personal info (name, CIN, Massar code, DOB)
   - Academic info (Bac series, year, mention, grade)
   - Profile photo upload
   - Documents PDF upload
   - Review & submit
4. Dashboard shows status badge
5. If approved → Accept/Decline buttons appear
6. If accepted → download receipt (PDF)
Professor Grade Entry
text
1. Open "My Courses"
2. Select a course
3. Choose academic year, semester, session
4. Student list loads (only those in programs with that course)
5. Enter grades inline
6. Save (bulk creates/updates)
7. Publish → grades visible to students
8. Inline status pills: "Unsaved" / "Saved" / "Not graded"
Student Grade View
text
1. Open "My Grades"
2. Semester tabs (S1, S2, ...)
3. Summary card: average, credits earned, courses passed, decision
4. Table per course: Normale, Rattrapage, Final, Result pill
5. Result types: Validated | Validated après rattrapage | Validated par compensation | Failed
🛠️ API Client Pattern
Every API file follows the same shape:

js
// src/api/exampleApi.js
import { baseUrl } from "./authApi";
import { apiFetch } from "../utils/apiClient";

const exampleApi = {
  getItems: async ({ filter1, filter2 } = {}) => {
    const params = new URLSearchParams();
    if (filter1) params.append("filter1", filter1);
    if (filter2) params.append("filter2", filter2);
    const query = params.toString();
    const url = `${baseUrl}items${query ? `?${query}` : ""}`;
    return await apiFetch(url);
  },

  createItem: async (data) =>
    await apiFetch(`${baseUrl}items`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateItem: async ({ id, ...data }) =>
    await apiFetch(`${baseUrl}items/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteItem: async (id) =>
    await apiFetch(`${baseUrl}items/${id}`, { method: "DELETE" }),
};

export default exampleApi;
apiFetch handles:

Token injection (Authorization: Bearer <token>)

Content-Type: application/json (except for FormData)

401 → logout + toast + redirect

Network error normalization

JSON parsing

No component should call fetch directly. Always go through an *Api.js file.

```
