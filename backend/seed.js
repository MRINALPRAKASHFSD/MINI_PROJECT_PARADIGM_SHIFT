require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Task = require('./models/Task');
const Leave = require('./models/Leave');
const Expense = require('./models/Expense');
const Doc = require('./models/Document');
const Attendance = require('./models/Attendance');
const Department = require('./models/Department');
const Announcement = require('./models/Announcement');
const Payslip = require('./models/Payslip');
const Notification = require('./models/Notification');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/paradigm_shift';

async function seed() {
  // Try external MongoDB, fall back to in-memory
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB:', MONGODB_URI);
  } catch (err) {
    console.log('⚠️  External MongoDB not available. Using in-memory...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
    console.log('Connected to in-memory MongoDB.');
  }

  // Clear all collections
  await Promise.all([
    User.deleteMany({}), Task.deleteMany({}), Leave.deleteMany({}),
    Expense.deleteMany({}), Doc.deleteMany({}), Attendance.deleteMany({}),
    Department.deleteMany({}), Announcement.deleteMany({}),
    Payslip.deleteMany({}), Notification.deleteMany({}),
  ]);
  console.log('Cleared existing data.');

  const hashedPw = await bcrypt.hash('password123', 12);
  const adminPw = await bcrypt.hash('admin123', 12);

  // ── DEPARTMENTS ──
  const departments = await Department.insertMany([
    { name: 'Engineering', head: 'Vikram Patel', employeeCount: 4, description: 'Software development and architecture', budget: 2500000, color: '#4F46E5' },
    { name: 'Design', head: 'Ananya Gupta', employeeCount: 2, description: 'UI/UX design and brand identity', budget: 800000, color: '#EC4899' },
    { name: 'Human Resources', head: 'Sneha Iyer', employeeCount: 2, description: 'Employee welfare and recruitment', budget: 600000, color: '#10B981' },
    { name: 'Marketing', head: 'Priya Sharma', employeeCount: 2, description: 'Growth, brand, and digital campaigns', budget: 1200000, color: '#F59E0B' },
    { name: 'Finance', head: 'Mahin Khan', employeeCount: 1, description: 'Accounts, payroll, and compliance', budget: 500000, color: '#06B6D4' },
    { name: 'R&D', head: 'Arjun Reddy', employeeCount: 1, description: 'Research and innovation lab', budget: 1000000, color: '#8B5CF6' },
    { name: 'Sales', head: 'Rohan Kapoor', employeeCount: 1, description: 'Client acquisition and partnerships', budget: 900000, color: '#EF4444' },
    { name: 'Legal', head: 'Kavita Deshmukh', employeeCount: 1, description: 'Contracts and regulatory compliance', budget: 400000, color: '#64748B' },
  ]);
  console.log(`✅ ${departments.length} departments created.`);

  // ── USERS ──
  const usersData = [
    { name: 'Vikram Patel', email: 'admin@paradigmshift.com', password: adminPw, role: 'admin', employeeId: 'ADM001', department: 'Engineering', designation: 'CTO & Admin', salary: 180000, phone: '+91 98765 10001', joiningDate: new Date('2021-01-15') },
    { name: 'Ananya Gupta', email: 'hr@paradigmshift.com', password: adminPw, role: 'hr', employeeId: 'HR001', department: 'Human Resources', designation: 'HR Director', salary: 120000, phone: '+91 98765 10002', joiningDate: new Date('2021-06-01') },
    { name: 'Rajesh Kumar', email: 'rajesh.kumar@paradigmshift.com', password: hashedPw, role: 'employee', employeeId: 'EMP001', department: 'Engineering', designation: 'Senior Developer', salary: 95000, phone: '+91 98765 43210', joiningDate: new Date('2023-03-15') },
    { name: 'Priya Sharma', email: 'priya.sharma@paradigmshift.com', password: hashedPw, role: 'employee', employeeId: 'EMP002', department: 'Marketing', designation: 'Marketing Lead', salary: 85000, phone: '+91 98765 43211', joiningDate: new Date('2022-06-20') },
    { name: 'Rohit Saxena', email: 'rohit.saxena@paradigmshift.com', password: hashedPw, role: 'employee', employeeId: 'EMP003', department: 'Engineering', designation: 'Full Stack Developer', salary: 75000, phone: '+91 98765 43212', joiningDate: new Date('2023-01-10') },
    { name: 'Diya Sharma', email: 'diya.sharma@paradigmshift.com', password: hashedPw, role: 'employee', employeeId: 'EMP004', department: 'Engineering', designation: 'Frontend Developer', salary: 70000, phone: '+91 98765 43213', joiningDate: new Date('2023-05-30') },
    { name: 'Arjun Reddy', email: 'arjun.reddy@paradigmshift.com', password: hashedPw, role: 'employee', employeeId: 'EMP005', department: 'R&D', designation: 'Research Analyst', salary: 72000, phone: '+91 98765 43214', joiningDate: new Date('2023-04-22') },
    { name: 'Sneha Iyer', email: 'sneha.iyer@paradigmshift.com', password: hashedPw, role: 'employee', employeeId: 'EMP006', department: 'Human Resources', designation: 'HR Executive', salary: 55000, phone: '+91 98765 43215', joiningDate: new Date('2023-05-30') },
    { name: 'Mahin Khan', email: 'mahin.khan@paradigmshift.com', password: hashedPw, role: 'employee', employeeId: 'EMP007', department: 'Finance', designation: 'Financial Analyst', salary: 68000, phone: '+91 98765 43216', joiningDate: new Date('2022-09-05') },
    { name: 'Rohan Kapoor', email: 'rohan.kapoor@paradigmshift.com', password: hashedPw, role: 'employee', employeeId: 'EMP008', department: 'Sales', designation: 'Sales Manager', salary: 78000, phone: '+91 98765 43217', joiningDate: new Date('2022-08-14') },
    { name: 'Kavita Deshmukh', email: 'kavita.deshmukh@paradigmshift.com', password: hashedPw, role: 'employee', employeeId: 'EMP009', department: 'Legal', designation: 'Legal Advisor', salary: 82000, phone: '+91 98765 43218', joiningDate: new Date('2022-07-25') },
    { name: 'Deepika Nair', email: 'deepika.nair@paradigmshift.com', password: hashedPw, role: 'employee', employeeId: 'EMP010', department: 'Design', designation: 'UI/UX Designer', salary: 65000, phone: '+91 98765 43219', joiningDate: new Date('2023-08-01') },
  ];

  const users = await User.insertMany(usersData);
  const userMap = {};
  users.forEach(u => { userMap[u.employeeId] = u; });
  console.log(`✅ ${users.length} users created (2 admins + ${users.length - 2} employees).`);

  // Helper refs
  const emp = (id) => userMap[id];

  // ── TASKS ──
  const tasks = await Task.insertMany([
    { title: 'Design new landing page', description: 'Create a modern responsive landing page with dark theme', priority: 'high', status: 'todo', assignee: emp('EMP001')._id, assigneeName: 'Rajesh Kumar', category: 'Engineering', tags: ['UI', 'React'], dueDate: new Date('2026-04-10') },
    { title: 'Razorpay checkout integration', description: 'Integrate Razorpay with UPI, card, and netbanking', priority: 'high', status: 'inProgress', assignee: emp('EMP002')._id, assigneeName: 'Priya Sharma', category: 'Engineering', tags: ['Backend', 'Payments'], dueDate: new Date('2026-04-15') },
    { title: 'Code review: Payment module', description: 'Review payment module for security vulnerabilities', priority: 'medium', status: 'inProgress', assignee: emp('EMP001')._id, assigneeName: 'Rajesh Kumar', category: 'Engineering', tags: ['Review', 'Security'], dueDate: new Date('2026-04-08') },
    { title: 'Aadhaar eKYC flow', description: 'Implement Aadhaar OTP-based verification with UIDAI APIs', priority: 'high', status: 'review', assignee: emp('EMP010')._id, assigneeName: 'Deepika Nair', category: 'Design', tags: ['KYC', 'API'], dueDate: new Date('2026-04-09') },
    { title: 'Unit tests for auth module', description: 'Write Jest tests for login, register, forgot password', priority: 'medium', status: 'todo', assignee: emp('EMP003')._id, assigneeName: 'Rohit Saxena', category: 'Engineering', tags: ['Testing', 'Jest'], dueDate: new Date('2026-04-12') },
    { title: 'Q1 marketing report', description: 'Compile social media + ad performance data', priority: 'low', status: 'completed', assignee: emp('EMP002')._id, assigneeName: 'Priya Sharma', category: 'Marketing', tags: ['Reports'], dueDate: new Date('2026-03-28') },
    { title: 'Employee onboarding docs', description: 'Update the welcome kit and employee handbook', priority: 'medium', status: 'inProgress', assignee: emp('EMP006')._id, assigneeName: 'Sneha Iyer', category: 'HR', tags: ['Docs'], dueDate: new Date('2026-04-08') },
    { title: 'AWS cost optimization', description: 'Analyze unused EC2 instances and RDS costs', priority: 'high', status: 'todo', assignee: emp('EMP005')._id, assigneeName: 'Arjun Reddy', category: 'DevOps', tags: ['AWS', 'Cost'], dueDate: new Date('2026-04-14') },
    { title: 'Client presentation deck', description: 'Prepare investor pitch deck for Series A', priority: 'medium', status: 'completed', assignee: emp('EMP008')._id, assigneeName: 'Rohan Kapoor', category: 'Sales', tags: ['Pitch'], dueDate: new Date('2026-03-26') },
    { title: 'Setup CI/CD pipeline', description: 'Configure GitHub Actions for auto testing and deploy to AWS', priority: 'medium', status: 'todo', assignee: emp('EMP003')._id, assigneeName: 'Rohit Saxena', category: 'Engineering', tags: ['DevOps', 'AWS'], dueDate: new Date('2026-04-18') },
  ]);
  console.log(`✅ ${tasks.length} tasks created.`);

  // ── LEAVES ──
  const leaves = await Leave.insertMany([
    { employee: emp('EMP001')._id, employeeName: 'Rajesh Kumar', type: 'Casual Leave', from: new Date('2026-03-20'), to: new Date('2026-03-21'), days: 2, reason: 'Personal work', status: 'approved' },
    { employee: emp('EMP001')._id, employeeName: 'Rajesh Kumar', type: 'Work From Home', from: new Date('2026-04-07'), to: new Date('2026-04-08'), days: 2, reason: 'Internet installation at new flat', status: 'pending' },
    { employee: emp('EMP004')._id, employeeName: 'Diya Sharma', type: 'Sick Leave', from: new Date('2026-04-05'), to: new Date('2026-04-07'), days: 3, reason: 'Medical checkup and recovery', status: 'pending' },
    { employee: emp('EMP002')._id, employeeName: 'Priya Sharma', type: 'Vacation', from: new Date('2026-04-15'), to: new Date('2026-04-20'), days: 6, reason: 'Family vacation to Goa', status: 'pending' },
    { employee: emp('EMP007')._id, employeeName: 'Mahin Khan', type: 'Sick Leave', from: new Date('2026-03-28'), to: new Date('2026-03-29'), days: 2, reason: 'Fever and cold', status: 'approved' },
    { employee: emp('EMP005')._id, employeeName: 'Arjun Reddy', type: 'Casual Leave', from: new Date('2026-04-06'), to: new Date('2026-04-06'), days: 1, reason: 'Wedding to attend', status: 'pending' },
    { employee: emp('EMP009')._id, employeeName: 'Kavita Deshmukh', type: 'Personal Leave', from: new Date('2026-04-10'), to: new Date('2026-04-11'), days: 2, reason: 'Property registration', status: 'pending' },
  ]);
  console.log(`✅ ${leaves.length} leaves created.`);

  // ── EXPENSES ──
  const expenses = await Expense.insertMany([
    { employee: emp('EMP001')._id, employeeName: 'Rajesh Kumar', department: 'Engineering', title: 'Client meeting cab', category: 'Travel', amount: 850, date: new Date('2026-03-27'), receiptNo: 'EXP-2026-047', status: 'approved', description: 'Uber to Cyber Hub for client pitch' },
    { employee: emp('EMP010')._id, employeeName: 'Deepika Nair', department: 'Design', title: 'Figma Pro subscription', category: 'Software', amount: 1150, date: new Date('2026-03-15'), receiptNo: 'EXP-2026-038', status: 'pending', description: 'Annual renewal for design team' },
    { employee: emp('EMP001')._id, employeeName: 'Rajesh Kumar', department: 'Engineering', title: 'Team lunch - Sprint review', category: 'Food', amount: 3200, date: new Date('2026-03-25'), receiptNo: 'EXP-2026-045', status: 'approved', description: '8 people at Barbeque Nation' },
    { employee: emp('EMP002')._id, employeeName: 'Priya Sharma', department: 'Marketing', title: 'Google Ads credit', category: 'Marketing', amount: 15000, date: new Date('2026-03-20'), receiptNo: 'EXP-2026-042', status: 'pending', description: 'Q1 campaign budget top-up' },
    { employee: emp('EMP003')._id, employeeName: 'Rohit Saxena', department: 'Engineering', title: 'Mechanical keyboard', category: 'Equipment', amount: 6500, date: new Date('2026-03-20'), receiptNo: 'EXP-2026-041', status: 'pending', description: 'Keychron K2 for home office' },
    { employee: emp('EMP006')._id, employeeName: 'Sneha Iyer', department: 'Human Resources', title: 'Conference registration', category: 'Training', amount: 4500, date: new Date('2026-03-10'), receiptNo: 'EXP-2026-033', status: 'approved', description: 'HR Tech Summit 2026 early bird' },
    { employee: emp('EMP005')._id, employeeName: 'Arjun Reddy', department: 'R&D', title: 'AWS credits', category: 'Software', amount: 8200, date: new Date('2026-03-18'), receiptNo: 'EXP-2026-040', status: 'rejected', description: 'Exceeded monthly cloud budget' },
    { employee: emp('EMP004')._id, employeeName: 'Diya Sharma', department: 'Engineering', title: 'Monitor stand', category: 'Equipment', amount: 2800, date: new Date('2026-03-22'), receiptNo: 'EXP-2026-043', status: 'pending', description: 'Ergonomic setup improvement' },
  ]);
  console.log(`✅ ${expenses.length} expenses created.`);

  // ── DOCUMENTS ──
  const docs = await Doc.insertMany([
    { employee: emp('EMP001')._id, employeeName: 'Rajesh Kumar', department: 'Engineering', name: 'Aadhaar Card', category: 'Identity', fileName: 'aadhaar_rajesh.pdf', size: '1.2 MB', status: 'verified' },
    { employee: emp('EMP001')._id, employeeName: 'Rajesh Kumar', department: 'Engineering', name: 'PAN Card', category: 'Tax', fileName: 'pan_rajesh.pdf', size: '0.8 MB', status: 'verified' },
    { employee: emp('EMP001')._id, employeeName: 'Rajesh Kumar', department: 'Engineering', name: 'B.Tech Degree', category: 'Education', fileName: 'degree_rajesh.pdf', size: '2.1 MB', status: 'verified' },
    { employee: emp('EMP002')._id, employeeName: 'Priya Sharma', department: 'Marketing', name: 'Passport', category: 'Identity', fileName: 'passport_priya.pdf', size: '1.5 MB', status: 'pending' },
    { employee: emp('EMP003')._id, employeeName: 'Rohit Saxena', department: 'Engineering', name: 'Experience Letter', category: 'Employment', fileName: 'exp_letter_rohit.pdf', size: '0.6 MB', status: 'pending' },
    { employee: emp('EMP006')._id, employeeName: 'Sneha Iyer', department: 'Human Resources', name: 'Bank Statement', category: 'Banking', fileName: 'bank_sneha.pdf', size: '3.4 MB', status: 'verified' },
    { employee: emp('EMP007')._id, employeeName: 'Mahin Khan', department: 'Finance', name: 'AWS Certification', category: 'Certification', fileName: 'aws_cert_mahin.pdf', size: '0.4 MB', status: 'pending' },
    { employee: emp('EMP004')._id, employeeName: 'Diya Sharma', department: 'Engineering', name: 'Health Insurance', category: 'Insurance', fileName: 'insurance_diya.pdf', size: '1.8 MB', status: 'rejected' },
    { employee: emp('EMP008')._id, employeeName: 'Rohan Kapoor', department: 'Sales', name: 'Voter ID', category: 'Identity', fileName: 'voter_rohan.pdf', size: '0.7 MB', status: 'pending' },
    { employee: emp('EMP005')._id, employeeName: 'Arjun Reddy', department: 'R&D', name: 'Offer Letter', category: 'Employment', fileName: 'offer_arjun.pdf', size: '0.9 MB', status: 'verified' },
  ]);
  console.log(`✅ ${docs.length} documents created.`);

  // ── ATTENDANCE (last 5 days) ──
  const attendanceRecords = [];
  const statuses = ['Present', 'Present', 'Present', 'Present', 'WFH', 'Half Day'];
  const empUsers = users.filter(u => u.role === 'employee');
  for (let d = 0; d < 5; d++) {
    const date = new Date();
    date.setDate(date.getDate() - d);
    date.setHours(0, 0, 0, 0);
    for (const u of empUsers) {
      const st = statuses[Math.floor(Math.random() * statuses.length)];
      attendanceRecords.push({
        employee: u._id,
        employeeName: u.name,
        date,
        checkIn: st === 'Absent' ? '' : `09:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}`,
        checkOut: st === 'Absent' ? '' : `18:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}`,
        status: st,
        hoursWorked: st === 'Present' ? 8 + Math.random() * 1.5 : st === 'Half Day' ? 4 : st === 'WFH' ? 7.5 : 0,
      });
    }
  }
  await Attendance.insertMany(attendanceRecords);
  console.log(`✅ ${attendanceRecords.length} attendance records created.`);

  // ── PAYSLIPS (last 6 months for Rajesh) ──
  const payslips = [];
  const months = ['March 2026', 'February 2026', 'January 2026', 'December 2025', 'November 2025', 'October 2025'];
  months.forEach((month, i) => {
    const basic = i < 2 ? 62000 : i < 4 ? 60000 : 58000;
    const hra = Math.round(basic * 0.4);
    const da = Math.round(basic * 0.1);
    const special = Math.round(basic * 0.2);
    const pf = Math.round(basic * 0.12);
    const tax = Math.round(basic * 0.133);
    payslips.push({
      employee: emp('EMP001')._id, employeeName: 'Rajesh Kumar', month,
      date: new Date(2026 - (i >= 3 ? 1 : 0), i >= 3 ? 12 - (i - 2) : 3 - i, 0),
      basic, hra, da, special, pf, tax, pt: 200, insurance: 1500,
      netPay: basic + hra + da + special - pf - tax - 200 - 1500,
      status: 'generated',
    });
  });
  await Payslip.insertMany(payslips);
  console.log(`✅ ${payslips.length} payslips created.`);

  // ── ANNOUNCEMENTS ──
  const announcements = await Announcement.insertMany([
    { title: 'Q2 Planning Kickoff', content: 'All teams to submit sprint plans by April 5th. Department leads to present roadmaps.', category: 'General', priority: 'high', author: emp('ADM001')._id, authorName: 'Vikram Patel', pinned: true },
    { title: 'New Health Insurance Policy', content: 'Star Health coverage upgraded to ₹10L. Family floater now includes parents. Effective from April 1st.', category: 'HR', priority: 'medium', author: emp('HR001')._id, authorName: 'Ananya Gupta' },
    { title: 'Office Renovation Schedule', content: 'Floor 3 and 4 will be under renovation from April 10-20. Please use co-working space on Floor 2.', category: 'General', priority: 'low', author: emp('ADM001')._id, authorName: 'Vikram Patel' },
    { title: 'Annual Hackathon 2026', content: 'Register your team of 3-4 members for the 48-hour hackathon on April 25-27. Theme: AI-powered HR tools.', category: 'Event', priority: 'high', author: emp('ADM001')._id, authorName: 'Vikram Patel', pinned: true },
    { title: 'Payroll Processing Change', content: 'Starting April, salaries will be credited on the 28th instead of the last day of the month.', category: 'Policy', priority: 'medium', author: emp('HR001')._id, authorName: 'Ananya Gupta' },
  ]);
  console.log(`✅ ${announcements.length} announcements created.`);

  // ── NOTIFICATIONS (for Rajesh) ──
  const rajesh = emp('EMP001');
  await Notification.insertMany([
    { user: rajesh._id, type: 'task', title: 'New task assigned', message: 'Vikram Patel assigned you "Design new landing page"', read: false, link: '/tasks' },
    { user: rajesh._id, type: 'system', title: 'Sprint 14 started', message: 'The new sprint has begun. Check your assigned tasks.', read: false, link: '/tasks' },
    { user: rajesh._id, type: 'leave', title: 'Leave approved', message: 'Your casual leave (20-21 Mar) has been approved.', read: true, link: '/leave' },
    { user: rajesh._id, type: 'expense', title: 'Expense approved', message: 'Your cab expense (₹850) has been approved by Vikram Patel.', read: true, link: '/expenses' },
    { user: rajesh._id, type: 'system', title: 'Payslip generated', message: 'Your payslip for March 2026 is ready to download.', read: false, link: '/payslips' },
    { user: rajesh._id, type: 'achievement', title: 'Badge earned: Speed Demon 🏎️', message: 'You completed 5 tasks in a single day!', read: true, link: '/profile' },
  ]);
  console.log('✅ 6 notifications created for Rajesh Kumar.');

  console.log('\n🎉 Seed complete!');
  console.log('─────────────────────────────────────────');
  console.log('Admin login:    admin@paradigmshift.com / admin123');
  console.log('HR login:       hr@paradigmshift.com / admin123');
  console.log('Employee login: rajesh.kumar@paradigmshift.com / password123');
  console.log('(All employees use password: password123)');
  console.log('─────────────────────────────────────────');

  // If running directly as script, disconnect and exit
  if (require.main === module) {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Check if running as a standalone script
if (require.main === module) {
  seed().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
  });
}

module.exports = { runSeed: seed };
