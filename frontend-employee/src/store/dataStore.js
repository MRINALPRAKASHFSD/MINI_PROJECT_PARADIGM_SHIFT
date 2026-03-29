import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ── helpers ──────────────────────────────────────────────────
const ts = () => Date.now();
const today = () => new Date().toISOString().split('T')[0];
const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

// ── seed data ────────────────────────────────────────────────
const SEED_TASKS = [
  { id: id(), title: 'Design new landing page', description: 'Create a modern responsive landing page with dark theme glassmorphism', priority: 'high', status: 'todo', assignee: 'Rajesh Kumar', tags: ['UI', 'React'], dueDate: '2026-04-02', subtasks: [{ text: 'Wireframe layout', done: true }, { text: 'Build hero section', done: false }, { text: 'Add animations', done: false }], createdAt: ts() - 86400000 * 3 },
  { id: id(), title: 'Razorpay checkout integration', description: 'Integrate Razorpay payment gateway with UPI, card and netbanking support', priority: 'high', status: 'inProgress', assignee: 'Priya Sharma', tags: ['Backend', 'Payments'], dueDate: '2026-04-05', subtasks: [{ text: 'Setup Razorpay SDK', done: true }, { text: 'Create order API', done: true }, { text: 'Handle webhooks', done: false }], createdAt: ts() - 86400000 * 5 },
  { id: id(), title: 'Code review: Payment module', description: 'Review the payment module code for security vulnerabilities and best practices', priority: 'medium', status: 'inProgress', assignee: 'Vikram Patel', tags: ['Review', 'Security'], dueDate: '2026-03-31', subtasks: [], createdAt: ts() - 86400000 * 2 },
  { id: id(), title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for automated testing and deployment to AWS', priority: 'medium', status: 'todo', assignee: 'Amit Joshi', tags: ['DevOps', 'AWS'], dueDate: '2026-04-10', subtasks: [{ text: 'Write test workflow', done: false }, { text: 'Add deploy stage', done: false }], createdAt: ts() - 86400000 },
  { id: id(), title: 'Aadhaar eKYC flow', description: 'Implement Aadhaar OTP-based eKYC verification with UIDAI APIs', priority: 'high', status: 'review', assignee: 'Ananya Gupta', tags: ['KYC', 'API'], dueDate: '2026-04-01', subtasks: [{ text: 'OTP request API', done: true }, { text: 'OTP verify API', done: true }, { text: 'Data masking', done: true }, { text: 'UI flow', done: false }], createdAt: ts() - 86400000 * 4 },
  { id: id(), title: 'Dashboard performance audit', description: 'Profile and optimize React rendering on employee dashboard', priority: 'low', status: 'completed', assignee: 'Rajesh Kumar', tags: ['Performance'], dueDate: '2026-03-28', subtasks: [], createdAt: ts() - 86400000 * 7 },
  { id: id(), title: 'Mobile responsive fixes', description: 'Fix layout issues on mobile devices for all portal pages', priority: 'medium', status: 'completed', assignee: 'Kavita Deshmukh', tags: ['CSS', 'Mobile'], dueDate: '2026-03-27', subtasks: [], createdAt: ts() - 86400000 * 6 },
  { id: id(), title: 'Write API documentation', description: 'Document all REST endpoints with request/response examples using Swagger', priority: 'low', status: 'todo', assignee: 'Sneha Iyer', tags: ['Docs', 'API'], dueDate: '2026-04-15', subtasks: [{ text: 'Auth endpoints', done: false }, { text: 'User endpoints', done: false }, { text: 'Payment endpoints', done: false }], createdAt: ts() - 86400000 * 2 },
  { id: id(), title: 'Unit tests for auth module', description: 'Write Jest unit tests for authentication and authorization flows', priority: 'medium', status: 'review', assignee: 'Rohit Saxena', tags: ['Testing', 'Jest'], dueDate: '2026-04-03', subtasks: [{ text: 'Login tests', done: true }, { text: 'Register tests', done: true }, { text: 'Token refresh tests', done: false }], createdAt: ts() - 86400000 * 3 },
  { id: id(), title: 'Redis caching layer', description: 'Add Redis caching for frequently accessed API responses', priority: 'medium', status: 'todo', assignee: 'Vikram Patel', tags: ['Backend', 'Redis'], dueDate: '2026-04-08', subtasks: [], createdAt: ts() - 86400000 },
  { id: id(), title: 'Employee onboarding form', description: 'Build a multi-step onboarding form with document upload for new hires', priority: 'high', status: 'inProgress', assignee: 'Deepika Nair', tags: ['UI', 'Forms'], dueDate: '2026-04-04', subtasks: [{ text: 'Personal info step', done: true }, { text: 'Document upload step', done: false }, { text: 'Bank details step', done: false }], createdAt: ts() - 86400000 * 2 },
  { id: id(), title: 'Slack notification integration', description: 'Send task assignment and deadline reminders to Slack channels', priority: 'low', status: 'todo', assignee: 'Arjun Reddy', tags: ['Integration', 'Slack'], dueDate: '2026-04-12', subtasks: [], createdAt: ts() - 86400000 },
];

const SEED_TIME_ENTRIES = [
  { id: id(), task: 'Frontend Development', project: 'Karmachari Portal', seconds: 13500, date: today(), createdAt: ts() - 3600000 },
  { id: id(), task: 'Code Review — Priya Sharma', project: 'Razorpay Integration', seconds: 5400, date: today(), createdAt: ts() - 7200000 },
  { id: id(), task: 'Bug Fixes — Login Flow', project: 'Dashboard Redesign', seconds: 8100, date: new Date(ts() - 86400000).toISOString().split('T')[0], createdAt: ts() - 86400000 },
  { id: id(), task: 'Sprint Planning Meeting', project: 'Karmachari Portal', seconds: 3600, date: new Date(ts() - 86400000).toISOString().split('T')[0], createdAt: ts() - 86400000 * 1.5 },
  { id: id(), task: 'Database Optimization', project: 'Razorpay Integration', seconds: 9000, date: new Date(ts() - 86400000 * 2).toISOString().split('T')[0], createdAt: ts() - 86400000 * 2 },
  { id: id(), task: 'UI Testing', project: 'Mobile App', seconds: 6300, date: new Date(ts() - 86400000 * 2).toISOString().split('T')[0], createdAt: ts() - 86400000 * 2 },
  { id: id(), task: 'API Documentation', project: 'Aadhaar KYC Module', seconds: 7200, date: new Date(ts() - 86400000 * 3).toISOString().split('T')[0], createdAt: ts() - 86400000 * 3 },
  { id: id(), task: 'Standup & Retro', project: 'Karmachari Portal', seconds: 2700, date: new Date(ts() - 86400000 * 3).toISOString().split('T')[0], createdAt: ts() - 86400000 * 3 },
  { id: id(), task: 'Design Review', project: 'Dashboard Redesign', seconds: 5400, date: new Date(ts() - 86400000 * 4).toISOString().split('T')[0], createdAt: ts() - 86400000 * 4 },
  { id: id(), task: 'Deployment & Monitoring', project: 'Mobile App', seconds: 10800, date: new Date(ts() - 86400000 * 5).toISOString().split('T')[0], createdAt: ts() - 86400000 * 5 },
];

const SEED_LEAVES = [
  { id: id(), type: 'Casual Leave', from: '2026-03-20', to: '2026-03-21', days: 2, reason: 'Personal work', status: 'approved', appliedAt: ts() - 86400000 * 9 },
  { id: id(), type: 'Sick Leave', from: '2026-03-10', to: '2026-03-10', days: 1, reason: 'Fever', status: 'approved', appliedAt: ts() - 86400000 * 19 },
  { id: id(), type: 'Work From Home', from: '2026-04-01', to: '2026-04-02', days: 2, reason: 'Internet installation at new flat', status: 'pending', appliedAt: ts() - 86400000 },
];

const SEED_NOTIFICATIONS = [
  { id: id(), type: 'task', title: 'New task assigned', message: 'Priya Sharma assigned you "Razorpay checkout integration"', read: false, createdAt: ts() - 600000, link: '/tasks' },
  { id: id(), type: 'system', title: 'Sprint 14 started', message: 'The new sprint has begun. Check your assigned tasks.', read: false, createdAt: ts() - 3600000, link: '/tasks' },
  { id: id(), type: 'team', title: 'Vikram Patel commented', message: 'Left a comment on "Code review: Payment module"', read: false, createdAt: ts() - 7200000, link: '/tasks' },
  { id: id(), type: 'achievement', title: 'Badge earned: Speed Demon 🏎️', message: 'You completed 5 tasks in a single day!', read: true, createdAt: ts() - 86400000, link: '/profile' },
  { id: id(), type: 'leave', title: 'Leave approved', message: 'Your casual leave (20-21 Mar) has been approved by Vikram Patel', read: true, createdAt: ts() - 86400000 * 2, link: '/leave' },
  { id: id(), type: 'task', title: 'Task deadline tomorrow', message: '"Aadhaar eKYC flow" is due tomorrow. Please update progress.', read: false, createdAt: ts() - 1800000, link: '/tasks' },
  { id: id(), type: 'system', title: 'Payslip generated', message: 'Your payslip for March 2026 is ready to download.', read: false, createdAt: ts() - 14400000, link: '/payslips' },
  { id: id(), type: 'team', title: 'Sneha Iyer mentioned you', message: 'Mentioned you in the QA testing thread for Payment Module', read: true, createdAt: ts() - 86400000 * 3, link: '/teams' },
];

const SEED_ACTIVITIES = [
  { id: id(), action: 'Completed "Dashboard Redesign" task', user: 'Rajesh Kumar', createdAt: ts() - 7200000, icon: 'task', color: '#3b82f6' },
  { id: id(), action: 'Logged 4h 30m on Razorpay Integration', user: 'Rajesh Kumar', createdAt: ts() - 10800000, icon: 'time', color: '#10b981' },
  { id: id(), action: 'Submitted work proof reviewed by Vikram Patel', user: 'Rajesh Kumar', createdAt: ts() - 18000000, icon: 'proof', color: '#a855f7' },
  { id: id(), action: 'Earned "Star Performer" badge from Arjun Reddy', user: 'Rajesh Kumar', createdAt: ts() - 86400000, icon: 'award', color: '#f59e0b' },
  { id: id(), action: 'Reviewed Sneha Iyer\'s code for Payment Module', user: 'Rajesh Kumar', createdAt: ts() - 86400000 * 1.5, icon: 'task', color: '#3b82f6' },
  { id: id(), action: 'Priya Sharma moved "Landing Page" to In Progress', user: 'Priya Sharma', createdAt: ts() - 86400000 * 2, icon: 'task', color: '#ec4899' },
  { id: id(), action: 'Amit Joshi deployed v2.4.1 to production', user: 'Amit Joshi', createdAt: ts() - 86400000 * 2.5, icon: 'deploy', color: '#06b6d4' },
  { id: id(), action: 'Ananya Gupta completed "Aadhaar OTP" subtask', user: 'Ananya Gupta', createdAt: ts() - 86400000 * 3, icon: 'task', color: '#10b981' },
];

const SEED_PAYSLIPS = [
  { id: id(), month: 'March 2026', date: '2026-03-28', basic: 62000, hra: 24800, da: 6200, special: 12400, pf: 7440, tax: 8250, pt: 200, insurance: 1500, netPay: 88010, status: 'generated' },
  { id: id(), month: 'February 2026', date: '2026-02-28', basic: 62000, hra: 24800, da: 6200, special: 12400, pf: 7440, tax: 8250, pt: 200, insurance: 1500, netPay: 88010, status: 'generated' },
  { id: id(), month: 'January 2026', date: '2026-01-31', basic: 60000, hra: 24000, da: 6000, special: 12000, pf: 7200, tax: 7950, pt: 200, insurance: 1500, netPay: 85150, status: 'generated' },
  { id: id(), month: 'December 2025', date: '2025-12-31', basic: 60000, hra: 24000, da: 6000, special: 12000, pf: 7200, tax: 7950, pt: 200, insurance: 1500, netPay: 85150, status: 'generated' },
  { id: id(), month: 'November 2025', date: '2025-11-30', basic: 60000, hra: 24000, da: 6000, special: 12000, pf: 7200, tax: 7950, pt: 200, insurance: 1500, netPay: 85150, status: 'generated' },
  { id: id(), month: 'October 2025', date: '2025-10-31', basic: 58000, hra: 23200, da: 5800, special: 11600, pf: 6960, tax: 7600, pt: 200, insurance: 1500, netPay: 82340, status: 'generated' },
];

const SEED_EXPENSES = [
  { id: id(), title: 'Client meeting cab', category: 'Travel', amount: 850, date: '2026-03-27', description: 'Uber to Andheri client office and back', status: 'approved', approvedBy: 'Vikram Patel', receiptNo: 'EXP-2026-047' },
  { id: id(), title: 'Team lunch - Sprint review', category: 'Food', amount: 3200, date: '2026-03-25', description: 'Team lunch at Mainland China after sprint review', status: 'approved', approvedBy: 'Vikram Patel', receiptNo: 'EXP-2026-045' },
  { id: id(), title: 'Mechanical keyboard', category: 'Equipment', amount: 6500, date: '2026-03-20', description: 'Keychron K2 for office use', status: 'pending', approvedBy: null, receiptNo: 'EXP-2026-041' },
  { id: id(), title: 'Figma Pro subscription', category: 'Software', amount: 1150, date: '2026-03-15', description: 'Monthly Figma Pro for design work', status: 'approved', approvedBy: 'Ananya Gupta', receiptNo: 'EXP-2026-038' },
  { id: id(), title: 'Conference registration', category: 'Training', amount: 4500, date: '2026-03-10', description: 'React India 2026 online conference pass', status: 'approved', approvedBy: 'Vikram Patel', receiptNo: 'EXP-2026-033' },
  { id: id(), title: 'AWS certification exam', category: 'Training', amount: 2600, date: '2026-03-05', description: 'AWS Solutions Architect Associate exam fee', status: 'rejected', approvedBy: null, receiptNo: 'EXP-2026-029' },
  { id: id(), title: 'Airport transfer', category: 'Travel', amount: 1200, date: '2026-02-28', description: 'Cab to BOM airport for Bengaluru office visit', status: 'approved', approvedBy: 'Vikram Patel', receiptNo: 'EXP-2026-025' },
];

const SEED_DOCUMENTS = [
  { id: id(), name: 'Offer Letter', category: 'Employment', fileName: 'OfferLetter_RajeshKumar_2024.pdf', size: '245 KB', uploadedAt: ts() - 86400000 * 400, verified: true },
  { id: id(), name: 'Aadhaar Card', category: 'Identity', fileName: 'Aadhaar_XXXX_4521.pdf', size: '1.2 MB', uploadedAt: ts() - 86400000 * 390, verified: true },
  { id: id(), name: 'PAN Card', category: 'Identity', fileName: 'PAN_ABCPK1234R.pdf', size: '380 KB', uploadedAt: ts() - 86400000 * 390, verified: true },
  { id: id(), name: 'Cancelled Cheque', category: 'Banking', fileName: 'CancelledCheque_HDFC.pdf', size: '520 KB', uploadedAt: ts() - 86400000 * 385, verified: true },
  { id: id(), name: 'B.Tech Degree Certificate', category: 'Education', fileName: 'BTech_VIT_2019.pdf', size: '3.8 MB', uploadedAt: ts() - 86400000 * 380, verified: true },
  { id: id(), name: 'Experience Letter (Previous)', category: 'Employment', fileName: 'ExpLetter_TCS_2023.pdf', size: '190 KB', uploadedAt: ts() - 86400000 * 375, verified: true },
  { id: id(), name: 'Form 16 (FY 2024-25)', category: 'Tax', fileName: 'Form16_FY2024-25.pdf', size: '890 KB', uploadedAt: ts() - 86400000 * 90, verified: false },
  { id: id(), name: 'Medical Insurance Card', category: 'Insurance', fileName: 'MedInsurance_Star_2026.pdf', size: '410 KB', uploadedAt: ts() - 86400000 * 60, verified: true },
  { id: id(), name: 'AWS Certificate', category: 'Certification', fileName: 'AWS_SAA_Certificate.pdf', size: '1.5 MB', uploadedAt: ts() - 86400000 * 30, verified: true },
  { id: id(), name: 'Passport', category: 'Identity', fileName: 'Passport_RK_2025.pdf', size: '2.1 MB', uploadedAt: ts() - 86400000 * 15, verified: false },
];

// ── store ────────────────────────────────────────────────────
export const useDataStore = create(
  persist(
    (set, get) => ({
      // ── data ─────────────────
      tasks: SEED_TASKS,
      timeEntries: SEED_TIME_ENTRIES,
      leaves: SEED_LEAVES,
      notifications: SEED_NOTIFICATIONS,
      activities: SEED_ACTIVITIES,
      payslips: SEED_PAYSLIPS,
      expenses: SEED_EXPENSES,
      documents: SEED_DOCUMENTS,

      leaveBalances: { casual: 10, sick: 7, earned: 15, wfh: 24 },

      // ── tasks ────────────────
      addTask: (task) => set(s => ({
        tasks: [{ ...task, id: id(), createdAt: ts(), subtasks: task.subtasks || [] }, ...s.tasks],
        activities: [{ id: id(), action: `Created task "${task.title}"`, user: 'Rajesh Kumar', createdAt: ts(), icon: 'task', color: '#3b82f6' }, ...s.activities],
        notifications: [{ id: id(), type: 'task', title: 'Task created', message: `You created "${task.title}"`, read: true, createdAt: ts(), link: '/tasks' }, ...s.notifications],
      })),
      updateTask: (taskId, updates) => set(s => ({ tasks: s.tasks.map(t => t.id === taskId ? { ...t, ...updates } : t) })),
      deleteTask: (taskId) => set(s => ({ tasks: s.tasks.filter(t => t.id !== taskId) })),
      moveTask: (taskId, status) => set(s => ({
        tasks: s.tasks.map(t => t.id === taskId ? { ...t, status } : t),
        activities: [{ id: id(), action: `Moved task to ${status}`, user: 'Rajesh Kumar', createdAt: ts(), icon: 'task', color: '#10b981' }, ...s.activities],
      })),
      toggleSubtask: (taskId, subtaskIndex) => set(s => ({
        tasks: s.tasks.map(t => {
          if (t.id !== taskId) return t;
          const subs = [...t.subtasks];
          subs[subtaskIndex] = { ...subs[subtaskIndex], done: !subs[subtaskIndex].done };
          return { ...t, subtasks: subs };
        }),
      })),

      // ── time entries ─────────
      addTimeEntry: (entry) => set(s => ({
        timeEntries: [{ ...entry, id: id(), createdAt: ts() }, ...s.timeEntries],
        activities: [{ id: id(), action: `Logged ${Math.round(entry.seconds / 60)}m on ${entry.project}`, user: 'Rajesh Kumar', createdAt: ts(), icon: 'time', color: '#10b981' }, ...s.activities],
      })),
      deleteTimeEntry: (entryId) => set(s => ({ timeEntries: s.timeEntries.filter(e => e.id !== entryId) })),

      // ── leaves ───────────────
      applyLeave: (leave) => {
        const leaveId = id();
        set(s => ({
          leaves: [{ ...leave, id: leaveId, status: 'pending', appliedAt: ts() }, ...s.leaves],
          notifications: [{ id: id(), type: 'leave', title: 'Leave applied', message: `Your ${leave.type} (${leave.from} to ${leave.to}) is pending approval`, read: true, createdAt: ts(), link: '/leave' }, ...s.notifications],
          activities: [{ id: id(), action: `Applied for ${leave.type} (${leave.days} day${leave.days > 1 ? 's' : ''})`, user: 'Rajesh Kumar', createdAt: ts(), icon: 'leave', color: '#f59e0b' }, ...s.activities],
        }));
      },
      cancelLeave: (leaveId) => set(s => ({ leaves: s.leaves.filter(l => l.id !== leaveId) })),

      // ── notifications ────────
      markRead: (notifId) => set(s => ({ notifications: s.notifications.map(n => n.id === notifId ? { ...n, read: true } : n) })),
      markAllRead: () => set(s => ({ notifications: s.notifications.map(n => ({ ...n, read: true })) })),
      clearNotification: (notifId) => set(s => ({ notifications: s.notifications.filter(n => n.id !== notifId) })),

      // ── expenses ─────────────
      addExpense: (expense) => set(s => ({
        expenses: [{ ...expense, id: id(), status: 'pending', approvedBy: null, receiptNo: `EXP-2026-${String(s.expenses.length + 50).padStart(3, '0')}` }, ...s.expenses],
        activities: [{ id: id(), action: `Submitted expense claim: ₹${expense.amount.toLocaleString('en-IN')}`, user: 'Rajesh Kumar', createdAt: ts(), icon: 'expense', color: '#f97316' }, ...s.activities],
      })),
      deleteExpense: (expId) => set(s => ({ expenses: s.expenses.filter(e => e.id !== expId) })),

      // ── documents ────────────
      addDocument: (doc) => set(s => ({
        documents: [{ ...doc, id: id(), uploadedAt: ts(), verified: false }, ...s.documents],
        activities: [{ id: id(), action: `Uploaded document: ${doc.name}`, user: 'Rajesh Kumar', createdAt: ts(), icon: 'doc', color: '#06b6d4' }, ...s.activities],
      })),
      deleteDocument: (docId) => set(s => ({ documents: s.documents.filter(d => d.id !== docId) })),

      // ── computed ─────────────
      get unreadCount() { return get().notifications.filter(n => !n.read).length; },
    }),
    {
      name: 'employee-data',
      version: 3,
    }
  )
);
