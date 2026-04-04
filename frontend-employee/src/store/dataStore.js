import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

// ── helpers ──────────────────────────────────────────────────
const ts = () => Date.now();
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ── store ────────────────────────────────────────────────────
export const useDataStore = create(
  persist(
    (set, get) => ({
      // ── data ─────────────────
      tasks: [],
      timeEntries: [],
      leaves: [],
      notifications: [],
      activities: [],
      payslips: [],
      expenses: [],
      documents: [],
      leaveBalances: { casual: 10, sick: 7, earned: 15, wfh: 24 },
      _loaded: false,

      // ── fetch all data from backend ──
      fetchAll: async () => {
        if (get()._loaded) return;
        try {
          const [tasksRes, leavesRes, expensesRes, docsRes, payslipsRes, notifRes] = await Promise.allSettled([
            api.get('/tasks'),
            api.get('/leaves'),
            api.get('/expenses'),
            api.get('/documents'),
            api.get('/payslips'),
            api.get('/notifications'),
          ]);

          const extract = (res, key) => res.status === 'fulfilled' ? (res.value.data[key] || []) : [];

          // Map backend fields to frontend-expected fields
          const mapTask = (t) => ({
            ...t,
            id: t._id || t.id,
            assignee: t.assigneeName || t.assignee?.name || 'Unassigned',
            dueDate: t.dueDate ? t.dueDate.split('T')[0] : '',
            createdAt: new Date(t.createdAt).getTime(),
            subtasks: t.subtasks || [],
            tags: t.tags || [],
          });

          const mapLeave = (l) => ({
            ...l,
            id: l._id || l.id,
            from: l.from ? new Date(l.from).toISOString().split('T')[0] : '',
            to: l.to ? new Date(l.to).toISOString().split('T')[0] : '',
            appliedAt: new Date(l.createdAt).getTime(),
          });

          const mapExpense = (e) => ({
            ...e,
            id: e._id || e.id,
            date: e.date ? new Date(e.date).toISOString().split('T')[0] : '',
          });

          const mapDoc = (d) => ({
            ...d,
            id: d._id || d.id,
            verified: d.status === 'verified',
            uploadedAt: new Date(d.createdAt).getTime(),
          });

          const mapPayslip = (p) => ({
            ...p,
            id: p._id || p.id,
            date: p.date ? new Date(p.date).toISOString().split('T')[0] : '',
          });

          const mapNotif = (n) => ({
            ...n,
            id: n._id || n.id,
            createdAt: new Date(n.createdAt).getTime(),
          });

          set({
            tasks: extract(tasksRes, 'tasks').map(mapTask),
            leaves: extract(leavesRes, 'leaves').map(mapLeave),
            expenses: extract(expensesRes, 'expenses').map(mapExpense),
            documents: extract(docsRes, 'documents').map(mapDoc),
            payslips: extract(payslipsRes, 'payslips').map(mapPayslip),
            notifications: extract(notifRes, 'notifications').map(mapNotif),
            _loaded: true,
          });
        } catch (err) {
          console.error('Failed to fetch data from backend:', err);
        }
      },

      // ── tasks ────────────────
      addTask: async (task) => {
        try {
          const { data } = await api.post('/tasks', task);
          const newTask = { ...data.task, id: data.task._id, createdAt: ts(), subtasks: data.task.subtasks || [], tags: data.task.tags || [] };
          set(s => ({ tasks: [newTask, ...s.tasks] }));
        } catch {
          // Fallback: add locally
          set(s => ({
            tasks: [{ ...task, id: id(), createdAt: ts(), subtasks: task.subtasks || [] }, ...s.tasks],
          }));
        }
      },
      updateTask: async (taskId, updates) => {
        set(s => ({ tasks: s.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t) }));
        try { await api.put(`/tasks/${taskId}`, updates); } catch {}
      },
      deleteTask: async (taskId) => {
        set(s => ({ tasks: s.tasks.filter(t => t.id !== taskId) }));
        try { await api.delete(`/tasks/${taskId}`); } catch {}
      },
      moveTask: async (taskId, status) => {
        set(s => ({
          tasks: s.tasks.map(t => t.id === taskId ? { ...t, status } : t),
          activities: [{ id: id(), action: `Moved task to ${status}`, user: 'You', createdAt: ts(), icon: 'task', color: '#10b981' }, ...s.activities],
        }));
        try { await api.put(`/tasks/${taskId}`, { status }); } catch {}
      },
      toggleSubtask: (taskId, subtaskIndex) => set(s => ({
        tasks: s.tasks.map(t => {
          if (t.id !== taskId) return t;
          const subs = [...(t.subtasks || [])];
          subs[subtaskIndex] = { ...subs[subtaskIndex], done: !subs[subtaskIndex].done };
          return { ...t, subtasks: subs };
        }),
      })),

      // ── time entries ─────────
      addTimeEntry: (entry) => set(s => ({
        timeEntries: [{ ...entry, id: id(), createdAt: ts() }, ...s.timeEntries],
        activities: [{ id: id(), action: `Logged ${Math.round(entry.seconds / 60)}m on ${entry.project}`, user: 'You', createdAt: ts(), icon: 'time', color: '#10b981' }, ...s.activities],
      })),
      deleteTimeEntry: (entryId) => set(s => ({ timeEntries: s.timeEntries.filter(e => e.id !== entryId) })),

      // ── leaves ───────────────
      applyLeave: async (leave) => {
        try {
          const { data } = await api.post('/leaves', leave);
          const newLeave = {
            ...data.leave,
            id: data.leave._id,
            from: new Date(data.leave.from).toISOString().split('T')[0],
            to: new Date(data.leave.to).toISOString().split('T')[0],
            appliedAt: ts(),
          };
          set(s => ({ leaves: [newLeave, ...s.leaves] }));
        } catch {
          set(s => ({
            leaves: [{ ...leave, id: id(), status: 'pending', appliedAt: ts() }, ...s.leaves],
          }));
        }
      },
      cancelLeave: async (leaveId) => {
        set(s => ({ leaves: s.leaves.filter(l => l.id !== leaveId) }));
        try { await api.delete(`/leaves/${leaveId}`); } catch {}
      },

      // ── notifications ────────
      markRead: async (notifId) => {
        set(s => ({ notifications: s.notifications.map(n => n.id === notifId ? { ...n, read: true } : n) }));
        try { await api.put(`/notifications/${notifId}/read`); } catch {}
      },
      markAllRead: async () => {
        set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) }));
        try { await api.put('/notifications/read-all'); } catch {}
      },
      clearNotification: async (notifId) => {
        set(s => ({ notifications: s.notifications.filter(n => n.id !== notifId) }));
        try { await api.delete(`/notifications/${notifId}`); } catch {}
      },

      // ── expenses ─────────────
      addExpense: async (expense) => {
        try {
          const { data } = await api.post('/expenses', expense);
          const newExp = { ...data.expense, id: data.expense._id, date: new Date(data.expense.date).toISOString().split('T')[0] };
          set(s => ({ expenses: [newExp, ...s.expenses] }));
        } catch {
          set(s => ({
            expenses: [{ ...expense, id: id(), status: 'pending', approvedBy: null, receiptNo: `EXP-2026-${String(s.expenses.length + 50).padStart(3, '0')}` }, ...s.expenses],
          }));
        }
      },
      deleteExpense: async (expId) => {
        set(s => ({ expenses: s.expenses.filter(e => e.id !== expId) }));
        try { await api.delete(`/expenses/${expId}`); } catch {}
      },

      // ── documents ────────────
      addDocument: async (doc) => {
        try {
          const { data } = await api.post('/documents', doc);
          const newDoc = { ...data.document, id: data.document._id, verified: false, uploadedAt: ts() };
          set(s => ({ documents: [newDoc, ...s.documents] }));
        } catch {
          set(s => ({
            documents: [{ ...doc, id: id(), uploadedAt: ts(), verified: false }, ...s.documents],
          }));
        }
      },
      deleteDocument: async (docId) => {
        set(s => ({ documents: s.documents.filter(d => d.id !== docId) }));
        try { await api.delete(`/documents/${docId}`); } catch {}
      },

      // ── refresh individual resource ──
      refreshTasks: async () => {
        try {
          const { data } = await api.get('/tasks');
          set({ tasks: (data.tasks || []).map(t => ({ ...t, id: t._id, assignee: t.assigneeName || 'Unassigned', dueDate: t.dueDate?.split('T')[0] || '', createdAt: new Date(t.createdAt).getTime(), subtasks: t.subtasks || [], tags: t.tags || [] })) });
        } catch {}
      },
      refreshLeaves: async () => {
        try {
          const { data } = await api.get('/leaves');
          set({ leaves: (data.leaves || []).map(l => ({ ...l, id: l._id, from: new Date(l.from).toISOString().split('T')[0], to: new Date(l.to).toISOString().split('T')[0], appliedAt: new Date(l.createdAt).getTime() })) });
        } catch {}
      },

      // ── computed ─────────────
      get unreadCount() { return get().notifications.filter(n => !n.read).length; },
    }),
    {
      name: 'employee-data',
      version: 4,
    }
  )
);
