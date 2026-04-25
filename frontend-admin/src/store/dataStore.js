import { create } from 'zustand';
import api from '../services/api';

export const useDataStore = create((set, get) => ({
  employees: [],
  leaves: [],
  tasks: [],
  expenses: [],
  documents: [],
  attendance: [],
  departments: [],
  announcements: [],
  dashboardStats: {},
  dashboardActivities: [],
  _loaded: false,
  loading: false,

  fetchAll: async (force = false) => {
    if (get()._loaded && !force) return;
    set({ loading: true });
    try {
      const [
        employeesRes, 
        leavesRes, 
        tasksRes, 
        expensesRes, 
        docsRes, 
        attendanceRes,
        departmentsRes,
        announcementsRes,
        dashboardRes
      ] = await Promise.allSettled([
        api.get('/employees'),
        api.get('/leaves'),
        api.get('/tasks'),
        api.get('/expenses'),
        api.get('/documents'),
        api.get('/attendance'),
        api.get('/departments'),
        api.get('/announcements'),
        api.get('/dashboard/stats')
      ]);

      const extract = (res, key) => res.status === 'fulfilled' ? (res.value.data[key] || []) : [];

      set({
        dashboardStats: dashboardRes.status === 'fulfilled' ? dashboardRes.value.data : {},
        employees: extract(employeesRes, 'employees').map(e => ({ ...e, id: e._id || e.id })),
        leaves: extract(leavesRes, 'leaves').map(l => {
          const fromDate = l.startDate || l.from;
          const toDate = l.endDate || l.to;
          let days = l.days;
          if (!days && fromDate && toDate) {
            const start = new Date(fromDate);
            const end = new Date(toDate);
            days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1);
          }
          return {
            ...l,
            id: l._id || l.id,
            name: l.employeeName || l.employee?.name || 'Unknown',
            type: l.leaveType || l.type || 'Leave',
            from: fromDate ? new Date(fromDate).toISOString().split('T')[0] : '',
            to: toDate ? new Date(toDate).toISOString().split('T')[0] : '',
            days: days || 1,
            appliedOn: l.createdAt || l.appliedOn || new Date().toISOString(),
            reason: l.reason || 'No reason provided'
          };
        }),
        tasks: extract(tasksRes, 'tasks').map(t => ({ 
          ...t, 
          id: t._id || t.id,
          assignee: t.assigneeName || t.assignee?.name || 'Unassigned',
          dueDate: t.dueDate ? t.dueDate.split('T')[0] : ''
        })),
        expenses: extract(expensesRes, 'expenses').map(e => ({ 
          ...e, 
          id: e._id || e.id,
          employeeName: e.employeeName || e.employee?.name || 'Unknown',
          date: e.date ? new Date(e.date).toISOString().split('T')[0] : ''
        })),
        documents: extract(docsRes, 'documents').map(d => ({ 
          ...d, 
          id: d._id || d.id,
          employeeName: d.employeeName || d.user?.name || 'Unknown',
          uploadedAt: new Date(d.createdAt).getTime()
        })),
        attendance: extract(attendanceRes, 'records').map(a => ({
          ...a,
          id: a._id || a.id,
          employeeName: a.employeeName || a.employee?.name || 'Unknown',
        })),
        departments: extract(departmentsRes, 'departments').map(d => ({ ...d, id: d._id || d.id })),
        announcements: extract(announcementsRes, 'announcements').map(a => ({ ...a, id: a._id || a.id })),
        dashboardStats: dashboardRes.status === 'fulfilled' ? dashboardRes.value.data.stats : {},
        dashboardActivities: dashboardRes.status === 'fulfilled' ? dashboardRes.value.data.activities : [],
        _loaded: true,
        loading: false
      });
    } catch (err) {
      console.error('Failed to fetch admin data from backend:', err);
      set({ loading: false });
    }
  },

  // Employees
  setEmployees: (employees) => set({ employees }),
  addEmployee: async (data) => {
    try {
      const res = await api.post('/employees', data);
      const newEmp = { ...res.data.employee, id: res.data.employee._id || res.data.employee.id };
      set(s => ({ employees: [newEmp, ...s.employees] }));
      return res.data;
    } catch (e) { throw e; }
  },
  updateEmployee: async (id, data) => {
    try {
      const res = await api.put(`/employees/${id}`, data);
      const updatedEmp = { ...res.data.employee, id: res.data.employee._id || res.data.employee.id };
      set(s => ({ employees: s.employees.map(e => e.id === id ? updatedEmp : e) }));
      return res.data;
    } catch (e) { throw e; }
  },
  deleteEmployee: async (id) => {
    try {
      await api.delete(`/employees/${id}`);
      set(s => ({ employees: s.employees.filter(e => e.id !== id) }));
    } catch (e) { throw e; }
  },

  // Leaves
  approveLeave: async (id) => {
    try {
      const res = await api.put(`/leaves/${id}/approve`);
      set(s => ({ leaves: s.leaves.map(l => l.id === id ? { ...l, status: 'approved' } : l) }));
    } catch (e) { throw e; }
  },
  rejectLeave: async (id) => {
    try {
      const res = await api.put(`/leaves/${id}/reject`);
      set(s => ({ leaves: s.leaves.map(l => l.id === id ? { ...l, status: 'rejected' } : l) }));
    } catch (e) { throw e; }
  },

  // Expenses
  approveExpense: async (id) => {
    try {
      const res = await api.put(`/expenses/${id}/approve`);
      set(s => ({ expenses: s.expenses.map(e => e.id === id ? { ...e, status: 'approved' } : e) }));
    } catch (e) { throw e; }
  },
  rejectExpense: async (id) => {
    try {
      const res = await api.put(`/expenses/${id}/reject`);
      set(s => ({ expenses: s.expenses.map(e => e.id === id ? { ...e, status: 'rejected' } : e) }));
    } catch (e) { throw e; }
  },

  // Documents
  verifyDocument: async (id) => {
    try {
      const res = await api.put(`/documents/${id}/verify`);
      set(s => ({ documents: s.documents.map(d => d.id === id ? { ...d, status: 'verified' } : d) }));
    } catch (e) { throw e; }
  },
  rejectDocument: async (id) => {
    try {
      const res = await api.put(`/documents/${id}/reject`);
      set(s => ({ documents: s.documents.map(d => d.id === id ? { ...d, status: 'rejected' } : d) }));
    } catch (e) { throw e; }
  },

  // Tasks
  addTask: async (taskData) => {
    try {
      const res = await api.post('/tasks', taskData);
      const data = res.data.task;
      const task = { ...data, id: data._id, assignee: data.assigneeName || 'Unassigned' };
      set(s => ({ tasks: [task, ...s.tasks] }));
    } catch (e) { throw e; }
  },
  updateTask: async (id, taskData) => {
    try {
      const res = await api.put(`/tasks/${id}`, taskData);
      set(s => ({ tasks: s.tasks.map(t => t.id === id ? { ...t, ...taskData } : t) }));
    } catch (e) { throw e; }
  },
  deleteTask: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      set(s => ({ tasks: s.tasks.filter(t => t.id !== id) }));
    } catch (e) { throw e; }
  },

  // Announcements
  addAnnouncement: async (data) => {
    try {
      const res = await api.post('/announcements', data);
      const ann = { ...res.data.announcement, id: res.data.announcement._id };
      set(s => ({ announcements: [ann, ...s.announcements] }));
    } catch (e) { throw e; }
  },
  deleteAnnouncement: async (id) => {
    try {
      await api.delete(`/announcements/${id}`);
      set(s => ({ announcements: s.announcements.filter(a => a.id !== id) }));
    } catch (e) { throw e; }
  }
}));
