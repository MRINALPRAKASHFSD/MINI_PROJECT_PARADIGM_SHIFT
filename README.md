# 🚀 ParadigmShift Monorepo

Welcome to **ParadigmShift**, a modern HRMS (Human Resource Management System) built by and for teams!  
This repo contains **two powerful React apps** for seamless HR and employee management.

---

## 🏗️ Project Structure

```
ParadigmShift/
  frontend-admin/      # Admin Panel (HR/Manager control)
  frontend-employee/   # Employee Panel (Employee dashboard)
  README.md            # You're reading it!
```

---

## 🧑‍💻 About ParadigmShift

ParadigmShift is a feature-rich HRMS portal that brings your organization’s people and performance data together.
Built for flexibility and ease of use, our platform offers:

- **Admin Panel:**  
  - Manage all employees, departments, announcements.
  - Handle attendance, payroll, leaves, reports, and more.
  - Approve or reject employee proofs/tasks.
  - Real-time analytics and monitoring.
- **Employee Panel:**  
  - Dashboard for employees to view tasks, meeting schedules.
  - Submit work proofs, check attendance, leave status, and pay slips.
  - Receive organizational updates and resources in real time.

All built with ❤️ using **ReactJS + Firebase**.  
**Collaborative, scalable, and made for your org’s productivity!**

---

## 📋 Team & Contributors

> Proudly crafted by our collaborative team:

| Name/ID               | Role         |
|-----------------------|-------------|
| 👑 MRINALPRAKASHFSD   | Maintainer / Lead Developer |
| 🧑‍💻 AdiT0015         | Frontend Devloper & Admin Portal manager|
| 🧑‍💻 IshaanParashar2025 | Backend Integration & Database Manager |
| 🧑‍💻 Mahin            | UI/UX & Software Testing|
| 🧑‍💻 Prarock83        | Lead Backend Developer & Employee and Admin Portal Manager |
| 👩 Diyagoel08       | Documentation & Testing|

> _Contributions welcome from all!_

---

## 🚦 Quick Setup Guide

#### 1️⃣ Clone the repository:
```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd ParadigmShift
```

#### 2️⃣ Run the **Admin Panel**
```bash
cd frontend-admin
npm install
npm run dev
# Go to http://localhost:5173/admin
```

#### 3️⃣ Run the **Employee Panel**
```bash
cd ../frontend-employee
npm install
npm run dev
# Go to http://localhost:5173/
```

---

## 🌍 Deployment

- Host each panel separately (Vercel/Netlify/Firebase Hosting).
- **Admin Panel Deploy root:** `frontend-admin`
- **Employee Panel Deploy root:** `frontend-employee`
- Each panel will have its **own site url** (e.g. `paradigmshift-admin.vercel.app` and `paradigmshift-employee.vercel.app`).

---

## 📝 Contribution Workflow

1. **Accept your collaborator invite!** (See “Pending Invite” above 🚦)
2. Pull the latest main branch:  
   `git pull origin main`
3. Create a new feature branch:  
   `git checkout -b feat/<feature-name>`
4. Make your changes and commit:
   ```
   git add .
   git commit -m "✨ [panel] <feature>: short summary"
   ```
5. Push and make a Pull Request!

**Please:**
- Make descriptive PR titles and messages 🙏
- Ask questions or open issues for any blockers 💬

---

## 📚 Tech Stack

- ⚛️ React (Vite)
- 🔥 Firebase (Auth, RTDB, Storage)
- ☁️ Hosting: Vercel / Netlify / Firebase Hosting

---

## 📢 Contact / Support

- Raise an [issue](https://github.com/<your-username>/<your-repo>/issues) for help or bugs.
- Or ping **MRINALPRAKASHFSD** directly in the repo discussions.
- More docs/features coming soon!

---

## Architecture 

```mermaid
flowchart TB
  subgraph Client["Client Layer"]
    A1["Employee Portal (React)"]
    A2["Admin Portal (React)"]
  end

  A1 -->|HTTPS| G["API Gateway / Backend API"]
  A2 -->|HTTPS| G

  subgraph Auth["Authentication"]
    F["Firebase Auth"]
    J["JWT Session / RBAC"]
  end

  G --> F
  G --> J

  subgraph App["Application Layer (Services)"]
    S1["Employees Service"]
    S2["Departments Service"]
    S3["Attendance Service"]
    S4["Leaves Service"]
    S5["Announcements Service"]
    S6["Payroll Service"]
    S7["Reports Service"]
  end

  G --> S1
  G --> S2
  G --> S3
  G --> S4
  G --> S5
  G --> S6
  G --> S7

  subgraph Data["Data Layer"]
    DB["Database (MongoDB/Postgres)"]
    FS["File Storage (Payslips/Exports)"]
  end

  S1 --> DB
  S2 --> DB
  S3 --> DB
  S4 --> DB
  S5 --> DB
  S6 --> DB
  S7 --> DB
  S6 --> FS
  S7 --> FS
```




## Authentication Flow (Flowchart)

```mermaid
flowchart TB
  U["User"] --> FE["Frontend (React)"]
  FE -->|Login request| FB["Firebase Auth"]
  FB -->|Returns Firebase ID Token| FE
  FE -->|POST /api/auth/firebase\nBearer Firebase Token| API["Backend API"]

  API -->|Verify token| FB
  API --> DB["Database"]
  DB -->|User + Role| API

  API -->|Access Token + Refresh Token| FE
  FE -->|Protected Routes Enabled| APP["Admin Portal / Employee Portal"]

  APP -->|API calls with Access Token| API
  API --> RBAC["RBAC Middleware"]
  RBAC -->|Allow/Deny| API
```


## Task Management Flow (Flowchart)

```mermaid
flowchart TB
  U["User"] --> FE["Frontend (React)"]
  FE -->|"POST /api/tasks\nPATCH /api/tasks/:id\nBearer token"| API["Backend API"]

  API --> AUTH["Auth Middleware\nVerify JWT"]
  AUTH --> RBAC["RBAC / Permissions\ncreate_task / update_task"]
  RBAC --> VAL["Validate Task Payload\n(zod/joi)"]
  VAL --> RULES["Business Rules\nPriority/Due date/Assignee rules"]
  RULES --> DB["Save to Database"]
  DB --> EVT["Emit Events (Optional)\nTASK_CREATED / TASK_UPDATED"]
  EVT --> NOTIF["Notification Service (Optional)"]
  EVT --> AUD["Audit Log (Optional)"]

  DB --> RESP["Return Task JSON"]
  RESP --> FE
  FE --> UI["Update UI\n(list / kanban / details)"]
```



## Proof Submission Flow (Flowchart)

```mermaid
flowchart TB
  U["User"] --> FE["Frontend: pick file + comment"]
  FE -->|"POST /api/proofs\nmultipart/form-data\nBearer token"| API["Backend API"]

  API --> AUTH["Auth Middleware\nVerify JWT"]
  AUTH --> UP["Multer Upload Middleware\nType + Size validation"]
  UP --> RULES["Business Rules\nOwnership + taskId + time window"]
  RULES --> OPT["(Optional) Compress/Resize"]
  OPT --> STORE["Upload to Cloud Storage\nS3 / Cloudinary"]
  STORE --> META["Save Metadata to DB\nuserId, taskId, fileUrl, mime, size"]
  META --> EVT["(Optional) Events\nNotify + Audit Log"]
  META --> RESP["Return 201 + proof JSON"]
  RESP --> FE
```





    ┌───────────────────────────────────────────────────────────┐
│              TEAM MANAGEMENT FLOW                          │
└───────────────────────────────────────────────────────────┘

    Team Operation Request
            │
            ▼
    ┌───────────────────────┐
    │ RBAC Middleware       │
    │ - Check admin/manager │
    └───────┬───────────────┘
            │
            ▼
    ┌───────────────────────┐
    │ Team Controller       │
    └───────┬───────────────┘
            │
            ├──► Create Team
            ├──► Add Member
            ├──► Remove Member
            ├──► Update Roles
            │
            ▼
    ┌─────────────────────────┐
    │  Business Logic         │
    │  - Validate hierarchy   │
    │  - Check permissions    │
    └─────────┬───────────────┘
              │
              ▼
    ┌─────────────────────┐
    │   Update Database   │
    └─────────┬───────────┘
              │
              ├──► Send Invites
              ├──► Update Cache
              │
              ▼
    ┌─────────────────────┐
    │  Return Response    │
    └─────────────────────┘





    ┌───────────────────────────────────────────────────────────┐
│            ANALYTICS & REPORTING FLOW                      │
└───────────────────────────────────────────────────────────┘

    Request Analytics Data
            │
            ▼
    ┌───────────────────────┐
    │ Auth Middleware       │
    └───────┬───────────────┘
            │
            ▼
    ┌───────────────────────┐
    │ Analytics Controller  │
    └───────┬───────────────┘
            │
            ├──► Parse Query Parameters
            │    └──► Date range, filters
            │
            ▼
    ┌─────────────────────────────┐
    │  Data Aggregation           │
    │  - MongoDB Aggregation      │
    │  - Redis for real-time data │
    └─────────┬───────────────────┘
              │
              ▼
    ┌─────────────────────────┐
    │  Data Processing        │
    │  - Calculate metrics    │
    │  - Generate charts data │
    │  - Format response      │
    └─────────┬───────────────┘
              │
              ├──► Cache Results (Redis)
              │
              ▼
    ┌─────────────────────┐
    │  Return Analytics   │
    └─────────────────────┘





## Security Layers (Advanced)

```mermaid
flowchart TB
  %% ===== Clients =====
  subgraph C["Clients"]
    A1["Employee Portal"]
    A2["Admin Portal"]
    A3["Mobile App (Optional)"]
  end

  %% ===== Edge / Transport =====
  subgraph T["Transport & Edge Security"]
    T1["TLS 1.3 / HTTPS"]
    T2["HSTS"]
    T3["WAF / DDoS Protection"]
    T4["Certificate Management"]
  end

  %% ===== Gateway =====
  subgraph G["API Gateway"]
    G1["Rate Limiting"]
    G2["Request Validation"]
    G3["CORS Policy"]
    G4["API Versioning"]
    G5["Request Sanitization"]
  end

  %% ===== AuthN/AuthZ =====
  subgraph A["Authentication & Authorization"]
    A1a["Firebase Auth / Identity"]
    A2a["JWT Access Tokens"]
    A3a["Refresh Tokens"]
    A4a["RBAC Roles: ADMIN | HR | FINANCE | EMPLOYEE"]
    A5a["Resource-level Permissions"]
    A6a["MFA (Optional)"]
  end

  %% ===== App Layer =====
  subgraph S["Application Services"]
    S1["Employees Service"]
    S2["Departments Service"]
    S3["Attendance Service"]
    S4["Leaves Service"]
    S5["Announcements Service"]
    S6["Payroll Service"]
    S7["Reports Service"]
  end

  %% ===== Data Security =====
  subgraph D["Data Protection"]
    D1["Encryption at Rest"]
    D2["Secrets Management"]
    D3["Audit Logs"]
    D4["Backup & Restore"]
  end

  %% ===== Monitoring =====
  subgraph M["Monitoring & Logging"]
    M1["Centralized Logs (ELK)"]
    M2["Metrics (Prometheus/Grafana)"]
    M3["Error Tracking (Sentry)"]
    M4["Security Alerts"]
  end

  %% ===== Relationships =====
  C --> T
  T --> G
  G --> A
  A --> S

  S --> D
  S --> M
  G --> M
  A --> M
```
   ┌───────────────────────────────────────────────────────────┐
│              CLOUD DEPLOYMENT (AWS/Azure/GCP)              │
└───────────────────────────────────────────────────────────┘

                    Load Balancer
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼────┐     ┌─────▼────┐    ┌─────▼────┐
    │  API    │     │   API    │    │   API    │
    │ Server 1│     │ Server 2 │    │ Server 3 │
    └────┬────┘     └─────┬────┘    └─────┬────��
         │                │                │
         └────────────────┼────────────────┘
                          │
         ┌────────────────┼────────────────┐
         │                │                │
    ┌────▼────┐     ┌─────▼────┐    ┌─────▼────┐
    │ MongoDB │     │  Redis   │    │   S3     │
    │ Cluster │     │  Cache   │    │ Storage  │
    └─────────┘     └──────────┘    └──────────┘

Monitoring & Logging
    ├── CloudWatch / Azure Monitor
    ├── ELK Stack (Logs)
    ├── Prometheus + Grafana (Metrics)
    └── Sentry (Error Tracking)




# ParadigmShift HRMS (Admin Console + Employee Portal)

A modern HRMS-style project with:
- **Admin Console (frontend-admin):** manage Employees, Departments, Leaves, Attendance, Payroll, Reports, Announcements.
- **Employee Portal (frontend-employee):** employees can view profile, attendance, payslips, apply for leave, read announcements, etc.
- **Backend (recommended):** REST API + DB + Auth to connect both apps reliably.

> **Current date reference:** This README assumes development around **2026-03-18**.

---

## Table of Contents
- [Project Goals](#project-goals)
- [Architecture Overview](#architecture-overview)
- [Monorepo Layout](#monorepo-layout)
- [Local Development Workflow](#local-development-workflow)
- [Data Flow & Storage](#data-flow--storage)
- [How Admin & Employee Portal Connect](#how-admin--employee-portal-connect)
- [Backend Structure (Recommended)](#backend-structure-recommended)
- [Database Schema (Recommended)](#database-schema-recommended)
- [API Endpoints (Proposed)](#api-endpoints-proposed)
- [Auth & Roles](#auth--roles)
- [Reports & Downloads](#reports--downloads)
- [Deployment Workflow](#deployment-workflow)
- [Roadmap](#roadmap)
- [Conventions](#conventions)

---

## Project Goals
1. **Professional UI** (dark-only modern design, glassmorphism, animations via Framer Motion).
2. **Fully working CRUD** for all modules (Employees, Departments, Announcements, Payroll, etc.).
3. **Single source of truth**: backend database (no reliance on localStorage in production).
4. **Two experiences**:
   - Admin Console for HR/Finance/Admin roles
   - Employee Portal for employees

---

## Architecture Overview
### Current (Frontend-only / Prototype)
- Admin Console stores data in `localStorage` keys such as:
  - `ps_admin_employees_v1`
  - `ps_admin_departments_v1`
  - `ps_admin_announcements_v1`
  - `ps_admin_payroll_v1`

This is great for demos and fast iteration, but **not multi-user safe**.

### Target (Production)
- **Backend API** with database + JWT auth.
- Admin Console and Employee Portal both talk to the same API.
- Reports/payslips generated on backend (CSV/PDF) and downloaded securely.

---

## Monorepo Layout
Recommended structure:

```text
/
├─ frontend-admin/              # Admin Console (React)
├─ frontend-employee/           # Employee Portal (React)
└─ backend/                     # API Server (Node/Nest/Express)
   ├─ src/
   ├─ prisma/ (or migrations/)
   └─ ...
```

---

## Local Development Workflow

### 1) Install dependencies
Run from each app directory:

```bash
cd frontend-admin
npm i
npm run dev
```

```bash
cd frontend-employee
npm i
npm run dev
```

When backend exists:

```bash
cd backend
npm i
npm run dev
```

### 2) Environment variables
Use `.env` files:

**frontend-admin/.env**
```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

**frontend-employee/.env**
```bash
VITE_API_BASE_URL=http://localhost:4000/api
```

**backend/.env**
```bash
PORT=4000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/hrms
JWT_SECRET=super_secret_change_me
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

> Ports: your Vite apps might run on different ports (ex: 5173 and 5174).

---

## Data Flow & Storage

### Prototype mode (localStorage)
Each module reads/writes a localStorage key.

Example:
- Employees page saves to `ps_admin_employees_v1`
- Departments page saves to `ps_admin_departments_v1`

### Production mode (backend)
Replace localStorage logic with API calls:
- `GET /api/employees`
- `POST /api/employees`
- `PATCH /api/employees/:id`
- `DELETE /api/employees/:id`

> You can keep localStorage as an offline cache, but backend should be the source of truth.

---

## How Admin & Employee Portal Connect
Both apps connect to the same backend.

### Admin Console does:
- creates employees
- assigns department + designation
- processes payroll
- publishes announcements
- approves leaves

### Employee Portal does:
- login as employee
- sees their own profile
- applies for leave
- views attendance history
- downloads payslips
- reads announcements

### Shared Entities
- **Employee** is the core entity connecting everything.
- Leaves, Attendance, Payroll, Announcements reference employees or departments.

---

## Backend Structure (Recommended)

You can implement backend using:
- **Node + Express** (simple)
- **NestJS** (enterprise structure)
- **Fastify** (performance)
- **Django / Spring Boot** (also fine)

Below is a recommended Node structure.

### Backend folder layout
```text
backend/
├─ src/
│  ├─ main.ts (or server.ts)
│  ├─ config/
│  │  ├─ env.ts
│  │  └─ cors.ts
│  ├─ middleware/
│  │  ├─ auth.ts              # verifies JWT
│  │  ├─ roles.ts             # role-based access
│  │  └─ validate.ts          # request validation
│  ├─ modules/
│  │  ├─ auth/
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.service.ts
│  │  │  └─ auth.routes.ts
│  │  ├─ employees/
│  │  ├─ departments/
│  │  ├─ announcements/
│  │  ├─ leaves/
│  │  ├─ attendance/
│  │  ├─ payroll/
│  │  └─ reports/
│  ├─ db/
│  │  ├─ prisma.ts (or db.ts)
│  │  └─ migrations/
│  └─ utils/
│     ├─ csv.ts
│     ├─ pdf.ts
│     └─ logger.ts
├─ prisma/
│  ├─ schema.prisma
│  └─ migrations/
└─ package.json
```

### Recommended backend tech
- DB: **PostgreSQL**
- ORM: **Prisma**
- Auth: **JWT** + refresh tokens
- Validation: **zod** or **joi**
- Reports: CSV generation + PDF generation for payslips (later)

---

## Database Schema (Recommended)

### Core tables
- `users`
- `employees`
- `departments`
- `announcements`
- `leaves`
- `attendance`
- `payroll_runs` (batch payroll)
- `payslips` (per employee per payroll run)

### Minimal schema idea (high-level)
```text
users
- id (uuid)
- email (unique)
- password_hash
- role: ADMIN | HR | FINANCE | EMPLOYEE
- employee_id (nullable, FK employees.id)

employees
- id (uuid)
- employee_code (EMP001)
- name
- email (unique)
- phone
- department_id
- designation
- joining_date
- status

departments
- id (uuid)
- name
- short_name
- head_employee_id (nullable)
- budget
- performance

announcements
- id (uuid)
- title
- content
- type
- priority
- created_by_user_id
- publish_date
- views_count

leaves
- id (uuid)
- employee_id
- type (CASUAL/SICK/etc.)
- start_date
- end_date
- reason
- status (PENDING/APPROVED/REJECTED)
- reviewed_by_user_id
- reviewed_at

attendance
- id (uuid)
- employee_id
- date
- status (PRESENT/ABSENT/LATE/WFH)
- check_in_time
- check_out_time

payroll_runs
- id (uuid)
- month (YYYY-MM)
- processed_by_user_id
- processed_at
- status

payslips
- id (uuid)
- payroll_run_id
- employee_id
- basic
- allowances
- deductions
- net
- payment_date
- status
```

---

## API Endpoints (Proposed)

### Auth
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`

### Employees
- `GET /api/employees` (Admin/HR)
- `POST /api/employees` (Admin/HR)
- `GET /api/employees/:id` (Admin/HR; Employee can access self)
- `PATCH /api/employees/:id` (Admin/HR)
- `DELETE /api/employees/:id` (Admin only)

### Departments
- `GET /api/departments`
- `POST /api/departments` (Admin)
- `PATCH /api/departments/:id` (Admin)
- `DELETE /api/departments/:id` (Admin)

### Announcements
- `GET /api/announcements` (All authenticated)
- `POST /api/announcements` (Admin/HR)
- `PATCH /api/announcements/:id` (Admin/HR)
- `DELETE /api/announcements/:id` (Admin)
- `POST /api/announcements/:id/view` (increments view count)

### Leaves
- `GET /api/leaves` (Admin/HR)
- `POST /api/leaves` (Employee)
- `PATCH /api/leaves/:id/approve` (HR)
- `PATCH /api/leaves/:id/reject` (HR)

### Attendance
- `GET /api/attendance` (Admin/HR)
- `GET /api/attendance/me` (Employee)
- `POST /api/attendance/checkin` (Employee)
- `POST /api/attendance/checkout` (Employee)

### Payroll
- `GET /api/payroll/runs` (Finance/Admin)
- `POST /api/payroll/runs` (Finance)  # create payroll run for month
- `POST /api/payroll/runs/:runId/process` (Finance) # process pending
- `GET /api/payslips/me` (Employee)
- `GET /api/payslips/:id/download` (Employee/Admin/Finance) # PDF or CSV

### Reports
- `GET /api/reports/payroll?month=YYYY-MM&format=csv`
- `GET /api/reports/departments?format=csv`
- `GET /api/reports/employees?format=csv`

---

## Auth & Roles

### Roles
- **ADMIN**: full access
- **HR**: employees + leaves + announcements
- **FINANCE**: payroll + payslips + payroll reports
- **EMPLOYEE**: self profile + leaves + attendance + payslips + announcements

### JWT Flow
1. User logs in → gets `accessToken` + `refreshToken`
2. Frontend stores:
   - access token in memory (recommended) or localStorage (simple)
   - refresh token in httpOnly cookie (recommended)
3. Frontend calls APIs with `Authorization: Bearer <token>`

---

## Reports & Downloads

### Prototype (Frontend)
- CSV generation happens inside UI modules and downloads directly.

### Production (Backend)
- CSV/PDF generation should be done on backend:
  - ensures correct data
  - enforces permissions
  - supports audit logs

Recommended:
- CSV: generate server-side and return as `text/csv`
- PDF: generate using a template and return as `application/pdf`

---

## Deployment Workflow

### Recommended
- Host backend on:
  - Render / Railway / Fly.io / AWS
- Host frontends on:
  - Vercel / Netlify

### Steps
1. Deploy backend (Postgres + API)
2. Configure `VITE_API_BASE_URL` for both frontends
3. Deploy both frontends

---

## Roadmap

### Phase 1 (Demo-ready)
- [x] CRUD modules using localStorage
- [x] Downloads (CSV)
- [x] UI polish + animations

### Phase 2 (Backend integration)
- [ ] Build backend + DB
- [ ] Replace localStorage with API
- [ ] Proper login roles
- [ ] Employee portal integration

### Phase 3 (Enterprise features)
- [ ] Audit logs
- [ ] PDF payslips
- [ ] Command palette (Cmd+K)
- [ ] Dashboards with charts
- [ ] Notifications + undo

---

## Conventions
- **Storage keys**: `ps_admin_<module>_v1`
- **Dates**: use ISO `YYYY-MM-DD`
- **Currency**: INR formatting `en-IN`
- **Animations**: Framer Motion; respect reduced motion where possible

---
If you want, next we can create the backend folder with Prisma + Express/Nest skeleton and connect Admin Console to API (starting with Employees).
