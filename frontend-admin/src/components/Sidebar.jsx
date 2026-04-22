import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  CheckSquare, 
  BarChart3, 
  Banknote, 
  Building2, 
  Megaphone, 
  Receipt, 
  FileCheck, 
  ClipboardList, 
  Settings,
  Shield 
} from 'lucide-react';
import './Sidebar.css';

function Sidebar() {
  const menuItems = [
    { 
      path: '/dashboard', 
      icon: <LayoutDashboard size={20} />, 
      label: 'Dashboard', 
      color:  '#6366f1'
    },
    { 
      path: '/employees', 
      icon: <Users size={20} />, 
      label: 'Employees', 
      color: '#8b5cf6'
    },
    { 
      path: '/leaves', 
      icon: <Calendar size={20} />, 
      label: 'Leave Management', 
      color: '#06b6d4'
    },
    { 
      path: '/attendance', 
      icon: <CheckSquare size={20} />, 
      label: 'Attendance', 
      color: '#10b981'
    },
    { 
      path: '/reports', 
      icon: <BarChart3 size={20} />, 
      label: 'Reports', 
      color: '#f59e0b'
    },
    { 
      path: '/payroll', 
      icon: <Banknote size={20} />, 
      label:  'Payroll', 
      color: '#ef4444'
    },
    { 
      path: '/departments', 
      icon: <Building2 size={20} />, 
      label:  'Departments', 
      color: '#3b82f6'
    },
    { 
      path: '/announcements', 
      icon: <Megaphone size={20} />, 
      label:  'Announcements', 
      color: '#ec4899'
    },
    { 
      path: '/expense-approvals', 
      icon: <Receipt size={20} />, 
      label: 'Expense Approvals', 
      color: '#14b8a6'
    },
    { 
      path: '/document-verification', 
      icon: <FileCheck size={20} />, 
      label: 'Document Verification', 
      color: '#a78bfa'
    },
    { 
      path: '/task-assignment', 
      icon: <ClipboardList size={20} />, 
      label: 'Task Assignment', 
      color: '#f97316'
    },
    { 
      path: '/settings', 
      icon: <Settings size={20} />, 
      label: 'Portal Settings', 
      color: '#94a3b8'
    },
  ];

  return (
    <aside className="sidebar admin-sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon-container">
          <Shield size={28} color="#6366f1" />
        </div>
        <div className="brand-info">
          <h1 className="brand-title">PARADIGM</h1>
          <p className="brand-subtitle">Admin Panel</p>
        </div>
      </div>

      <div className="sidebar-divider">
        <span className="divider-text">Navigation</span>
      </div>

      <nav className="sidebar-navigation">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <div className="nav-link-content">
              <span className="nav-icon" style={{ color: item.color }}>{item.icon}</span>
              <span className="nav-text">{item.label}</span>
            </div>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <div className="status-indicator">
            <div className="status-dot" />
            <span className="status-text">Online</span>
          </div>
          <div className="version-badge">
            <span className="version-label">v1.2.0</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;