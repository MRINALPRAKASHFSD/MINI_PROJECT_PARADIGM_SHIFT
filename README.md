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
| 🧑‍💻 AdiT0015         | Collaborator |
| 🧑‍💻 IshaanParashar2025 | Collaborator |
| 🧑‍💻 Mahin            | Collaborator |
| 🧑‍💻 Prarock83        | Collaborator |

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

> Made with teamwork, code, and 🚀 by the ParadigmShift crew.

┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   React UI   │  │  Mobile App  │  │   Admin UI   │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                  │
│                            │                                     │
│                       HTTPS/WSS                                  │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                       API GATEWAY                                │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  - Rate Limiting                                          │   │
│  │  - Request Validation                                     │   │
│  │  - SSL/TLS Termination                                    │   │
│  │  - Load Balancing                                         │   │
│  │  - API Versioning                                         │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                   AUTHENTICATION LAYER                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  JWT Token Validation                                     │   │
│  │  OAuth 2.0 / SSO Integration                              │   │
│  │  Role-Based Access Control (RBAC)                         │   │
│  │  Session Management                                       │   │
│  └───────────────────────────────────────────────��──────────┘   │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                    APPLICATION LAYER                             │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Auth      │  │   User      │  │   Task      │             │
│  │  Service    │  │  Service    │  │  Service    │             │
│  └──────┬──────┘  └──────���──────┘  └──────┬──────┘             │
│         │                │                │                     │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐             │
│  │   Time      │  │   Team      │  │  Proof      │             │
│  │  Tracking   │  │  Service    │  │  Service    │             │
│  │  Service    │  │             │  │             │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐             │
│  │  Analytics  │  │   Report    │  │Notification │             │
│  │  Service    │  │  Service    │  │  Service    │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                          │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  - Validation Rules                                       │   │
│  │  - Business Rules Engine                                  │   │
│  │  - Workflow Automation                                    │   │
│  │  - Data Transformation                                    │   │
│  │  - Event Processing                                       │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌───────────────��────────────┼─────────────────────────────────────┐
│                    DATA ACCESS LAYER                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  ORM (Mongoose/Prisma/Sequelize)                          │   │
│  │  Query Optimization                                       │   │
│  │  Connection Pooling                                       │   │
│  │  Transaction Management                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┼─────────────────────────────────────┘
                             │
┌────────────────────────────┼─────────────────────────────────────┐
│                      DATABASE LAYER                              │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  MongoDB    │  │   Redis     │  │ PostgreSQL  │             │
│  │  (Primary)  │  │  (Cache)    │  │ (Optional)  │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                             │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  AWS S3     │  │   SendGrid  │  │   Twilio    │             │
│  │  (Storage)  │  │   (Email)   │  │   (SMS)     │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   Stripe    │  │   Socket.io │  │  Cloudinary │             │
│  │  (Payment)  │  │  (Realtime) │  │   (Images)  │             │
│  └─────────────┘  └───────��─────┘  └─────────────┘             │
└──────────────────────────────────────────────────────────────────┘







┌───────────────────────────────────────────────────────────┐
│                 AUTHENTICATION FLOW                        │
└───────────────────────────────────────────────────────────┘

    User Request (Login/Register)
            │
            ▼
    ┌───────────────┐
    │ API Gateway   │
    └───────┬───────┘
            │
            ▼
    ┌───────────────────┐
    │ Auth Controller   │
    └───────┬───────────┘
            │
            ├──► Validate Input
            │
            ├──► Hash Password (bcrypt)
            │
            ├──► Check Database
            │         │
            ▼         ▼
    ┌─────────────────────┐
    │   User Database     │
    └─────────┬───────────┘
              │
              ├──► User Found?
              │
              ▼
    ┌─────────────────────┐
    │  Generate JWT Token │
    │  - Access Token     │
    │  - Refresh Token    │
    └─────────┬───────────┘
              │
              ├──► Store in Redis (Session)
              │
              ▼
    ┌─────────────────────┐
    │  Return Response    │
    │  - tokens           │
    │  - user data        │
    └─────────────────────┘








    ┌───────────────────────────────────────────────────────────┐
│                 TASK MANAGEMENT FLOW                       │
└───────��───────────────────────────────────────────────────┘

    Create/Update Task Request
            │
            ▼
    ┌───────────────────┐
    │ Auth Middleware   │
    └───────┬───────────┘
            │
            ▼
    ┌───────────────────┐
    │ Task Controller   │
    └───────┬───────────┘
            │
            ├──► Validate Task Data
            │
            ├──► Check Permissions
            │
            ▼
    ┌─────────────────────────┐
    │  Business Rules         │
    │  - Priority validation  │
    │  - Deadline validation  │
    │  - Assignment rules     │
    └─────────┬───────────────┘
              │
              ▼
    ┌─────────────────────┐
    │   Save to DB        │
    └─────────┬───────────┘
              │
              ├──► Trigger Events
              │    │
              │    ├──► Notification Service
              │    ├──► Analytics Service
              │    └──► Audit Log
              │
              ▼
    ┌─────────────────────┐
    │  Return Response    │
    └────────��────────────┘







    ┌───────────────────────────────────────────────────────────┐
│                TIME TRACKING FLOW                          │
└───────────────────────────────────────────────────────────┘

    Start/Stop Timer
            │
            ▼
    ┌───────────────────┐
    │ Auth Middleware   │
    └───────┬───────────┘
            │
            ▼
    ┌───────────────────────┐
    │ Time Track Controller │
    └───────┬───────────────┘
            │
            ├──► Start Timer
            │    └──► Create Time Entry
            │         └──► Store in Redis (Active)
            │
            ├──► Stop Timer
            │    ├──► Calculate Duration
            │    ├──► Move to MongoDB
            │    └──► Clear Redis Entry
            │
            ├──► Pause/Resume
            │
            ▼
    ┌─────────────────────┐
    │   Data Processing   │
    │  - Calculate hours  │
    │  - Generate reports │
    └─────────┬───────────┘
              │
              ▼
    ┌─────────────────────┐
    │  Store & Respond    │
    └─────────────────────┘








    ┌───────────────────────────────────────────────────────────┐
│              PROOF SUBMISSION FLOW                         │
└───────────────────────────────────────────────────────────��

    Upload Proof (Screenshot/File)
            │
            ▼
    ┌───────────────────┐
    │ Multer Middleware │
    │ - File validation │
    │ - Size limit      │
    └───────┬───────────┘
            │
            ▼
    ┌───────────────────────┐
    │ Proof Controller      │
    └───────┬───────────────┘
            │
            ├──► Validate File Type
            ├──► Compress Image
            │
            ▼
    ┌─────────────────────┐
    │  Upload to Cloud    │
    │  (AWS S3/Cloudinary)│
    └─────────┬───────────┘
              │
              ├──► Get URL
              │
              ▼
    ┌─────────────────────────┐
    │  Save Metadata to DB    │
    │  - file URL             │
    │  - task ID              │
    │  - user ID              │
    │  - timestamp            │
    └─────────┬───────────────┘
              │
              ├──► Notify Manager
              │
              ▼
    ┌─────────────────────┐
    │  Return Response    │
    └─────────────────────┘







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





    ┌───────────────────────────────────────────────────────────┐
│                  SECURITY LAYERS                           │
└───────────────────────────────────────────────────────────┘

1. Transport Security
   ├── HTTPS/TLS 1.3
   ├── Certificate Pinning
   └── HSTS Headers

2. Authentication
   ├── JWT (Access & Refresh Tokens)
   ├── Password Hashing (bcrypt, cost: 12)
   ├── Email Verification
   └── 2FA (Optional)

3. Authorization
   ├── Role-Based Access Control (RBAC)
   ├── Permission Matrix
   └── Resource-level permissions

4. Data Protection
   ├── Input Validation (Joi/Yup)
   ├── SQL Injection Prevention
   ├── XSS Protection
   ├── CSRF Tokens
   └── Data Encryption at Rest

5. API Security
   ├── Rate Limiting (Redis)
   ├── API Key Management
   ├── CORS Configuration
   └── Request Sanitization

6. Monitoring & Logging
   ├── Audit Logs
   ├── Error Tracking (Sentry)
   ├── Security Alerts
   └── Activity Monitoring






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
