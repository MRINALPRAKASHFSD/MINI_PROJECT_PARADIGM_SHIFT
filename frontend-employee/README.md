# 🚀 MINI PROJECT:  PARADIGM SHIFT

## 📋 Project Overview

**Paradigm Shift** is a comprehensive Employee Management System built with modern web technologies. This project provides a complete solution for managing employee data, attendance, leave requests, and administrative tasks through separate portals for employees and administrators.

---

## 🎯 Features

### 👤 Employee Portal
- ✅ Employee login and authentication
- 📊 View personal dashboard
- 📅 Apply for leave requests
- 🕒 Check attendance records
- 📝 Update personal information
- 📧 View notifications and announcements

### 👨‍💼 Admin Portal
- ✅ Admin login and authentication
- 👥 Manage employee records (Add/Edit/Delete)
- 📋 Approve/Reject leave requests
- 📊 View attendance reports
- 📈 Generate analytics and reports
- 🔔 Send notifications to employees

---

## 🛠️ Tech Stack

### Frontend
- **React. js** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Navigation
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Bcrypt** - Password hashing

---

## 📁 Project Structure

```
MINI_PROJECT_PARADIGM_SHIFT/
│
├── frontend-employee/          # Employee portal
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── assets/           # Images, icons, etc.
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── public/
│   └── package.json
│
├── frontend-admin/            # Admin portal
│   ├── src/
│   │   ├── components/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── public/
│   └── package.json
│
└── backend/                   # Backend API
    ├── models/               # Database models
    ├── routes/               # API routes
    ├── controllers/          # Business logic
    ├── middleware/           # Authentication, etc.
    ├── config/               # Configuration files
    └── server.js             # Entry point
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/MRINALPRAKASHFSD/MINI_PROJECT_PARADIGM_SHIFT.git
cd MINI_PROJECT_PARADIGM_SHIFT
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

Start the backend server:
```bash
npm start
```

### 3️⃣ Employee Portal Setup
```bash
cd frontend-employee
npm install
npm run dev
```

### 4️⃣ Admin Portal Setup
```bash
cd frontend-admin
npm install
npm run dev
```

---

## 🌐 Access the Application

- **Employee Portal:** `http://localhost:5173`
- **Admin Portal:** `http://localhost:5174`
- **Backend API:** `http://localhost:5000`

---

## 📸 Screenshots

### Employee Dashboard
![Employee Dashboard](./screenshots/employee-dashboard.png)

### Admin Panel
![Admin Panel](./screenshots/admin-panel.png)

---

## 🔐 Default Login Credentials

### Employee
- **Email:** employee@paradigmshift.com
- **Password:** employee123

### Admin
- **Email:** admin@paradigmshift.com
- **Password:** admin123

> ⚠️ **Note:** Change these credentials in production! 

---

## 📝 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout

### Employee Routes
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get employee by ID
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Leave Management
- `POST /api/leaves` - Apply for leave
- `GET /api/leaves` - Get all leaves
- `PUT /api/leaves/:id` - Update leave status

### Attendance
- `POST /api/attendance` - Mark attendance
- `GET /api/attendance/:employeeId` - Get attendance records

---

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend-employee
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Mrinal Prakash**
- GitHub: [@MRINALPRAKASHFSD](https://github.com/MRINALPRAKASHFSD)
- Project: [Paradigm Shift](https://github.com/MRINALPRAKASHFSD/MINI_PROJECT_PARADIGM_SHIFT)

---

## 🙏 Acknowledgments

- Thanks to all contributors
- Inspired by modern HR management systems
- Built with ❤️ for learning and development

---

## 📞 Support

For support, email mrinalprakash@example.com or create an issue in the repository.

---

## 🔄 Version History

- **v1.0.0** (2026-01-01)
  - Initial release
  - Employee and Admin portals
  - Basic CRUD operations
  - Authentication system

---

**⭐ If you find this project helpful, please give it a star! **
