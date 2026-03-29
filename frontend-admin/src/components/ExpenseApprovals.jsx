import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Search, Filter, Download, IndianRupee } from 'lucide-react';
import './ExpenseApprovals.css';

const INITIAL_EXPENSES = [
  { id: 1, employee: 'Rajesh Kumar', empId: 'EMP001', dept: 'Engineering', title: 'Client meeting cab', category: 'Travel', amount: 850, date: '2026-03-27', receipt: 'EXP-2026-047', status: 'Pending', notes: 'Uber to Cyber Hub for client pitch' },
  { id: 2, employee: 'Ananya Gupta', empId: 'EMP003', dept: 'Design', title: 'Figma Pro subscription', category: 'Software', amount: 1150, date: '2026-03-15', receipt: 'EXP-2026-038', status: 'Pending', notes: 'Annual renewal for design team' },
  { id: 3, employee: 'Vikram Patel', empId: 'EMP002', dept: 'Engineering', title: 'Team lunch - Sprint review', category: 'Food', amount: 3200, date: '2026-03-25', receipt: 'EXP-2026-045', status: 'Approved', notes: '8 people at Barbeque Nation' },
  { id: 4, employee: 'Priya Sharma', empId: 'EMP005', dept: 'Marketing', title: 'Google Ads credit', category: 'Marketing', amount: 15000, date: '2026-03-20', receipt: 'EXP-2026-042', status: 'Pending', notes: 'Q1 campaign budget top-up' },
  { id: 5, employee: 'Rohit Saxena', empId: 'EMP004', dept: 'Engineering', title: 'Mechanical keyboard', category: 'Equipment', amount: 6500, date: '2026-03-20', receipt: 'EXP-2026-041', status: 'Pending', notes: 'Keychron K2 for home office' },
  { id: 6, employee: 'Sneha Iyer', empId: 'EMP008', dept: 'HR', title: 'Conference registration', category: 'Training', amount: 4500, date: '2026-03-10', receipt: 'EXP-2026-033', status: 'Approved', notes: 'HR Tech Summit 2026 early bird' },
  { id: 7, employee: 'Arjun Reddy', empId: 'EMP007', dept: 'R&D', title: 'AWS credits', category: 'Software', amount: 8200, date: '2026-03-18', receipt: 'EXP-2026-040', status: 'Rejected', notes: 'Exceeded monthly cloud budget' },
  { id: 8, employee: 'Diya Sharma', empId: 'EMP006', dept: 'Engineering', title: 'Monitor stand + cable organizer', category: 'Equipment', amount: 2800, date: '2026-03-22', receipt: 'EXP-2026-043', status: 'Pending', notes: 'Ergonomic setup improvement' },
];

const CATEGORY_ICONS = { Travel: '✈️', Food: '🍽️', Software: '💻', Equipment: '🖥️', Training: '🎓', Marketing: '📢' };

function ExpenseApprovals() {
  const [expenses, setExpenses] = useState(INITIAL_EXPENSES);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const handleApprove = (id) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'Approved' } : e));
  };
  const handleReject = (id) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, status: 'Rejected' } : e));
  };
  const handleBulkApprove = () => {
    setExpenses(prev => prev.map(e => e.status === 'Pending' ? { ...e, status: 'Approved' } : e));
  };

  const filtered = expenses.filter(e => {
    const matchFilter = filter === 'All' || e.status === filter;
    const matchSearch = !search || e.employee.toLowerCase().includes(search.toLowerCase()) || e.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totals = {
    pending: expenses.filter(e => e.status === 'Pending').reduce((s, e) => s + e.amount, 0),
    approved: expenses.filter(e => e.status === 'Approved').reduce((s, e) => s + e.amount, 0),
    rejected: expenses.filter(e => e.status === 'Rejected').reduce((s, e) => s + e.amount, 0),
    total: expenses.reduce((s, e) => s + e.amount, 0),
  };

  return (
    <div className="expense-approvals">
      <motion.div className="ea-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1><IndianRupee size={28} style={{ display: 'inline', verticalAlign: 'middle' }} /> Expense Approvals</h1>
          <p>Review and approve employee expense claims</p>
        </div>
        <div className="ea-header-actions">
          <button className="ea-bulk-btn" onClick={handleBulkApprove}>
            <CheckCircle size={16} /> Approve All Pending
          </button>
          <button className="ea-export-btn">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </motion.div>

      {/* Summary cards */}
      <motion.div className="ea-summary" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="ea-sum-card pending-card">
          <Clock size={20} />
          <div>
            <div className="ea-sum-val">₹{totals.pending.toLocaleString('en-IN')}</div>
            <div className="ea-sum-label">Pending ({expenses.filter(e => e.status === 'Pending').length})</div>
          </div>
        </div>
        <div className="ea-sum-card approved-card">
          <CheckCircle size={20} />
          <div>
            <div className="ea-sum-val">₹{totals.approved.toLocaleString('en-IN')}</div>
            <div className="ea-sum-label">Approved ({expenses.filter(e => e.status === 'Approved').length})</div>
          </div>
        </div>
        <div className="ea-sum-card rejected-card">
          <XCircle size={20} />
          <div>
            <div className="ea-sum-val">₹{totals.rejected.toLocaleString('en-IN')}</div>
            <div className="ea-sum-label">Rejected ({expenses.filter(e => e.status === 'Rejected').length})</div>
          </div>
        </div>
        <div className="ea-sum-card total-card">
          <IndianRupee size={20} />
          <div>
            <div className="ea-sum-val">₹{totals.total.toLocaleString('en-IN')}</div>
            <div className="ea-sum-label">Total Claims</div>
          </div>
        </div>
      </motion.div>

      {/* Filters row */}
      <motion.div className="ea-filters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="ea-search-box">
          <Search size={16} />
          <input placeholder="Search by employee or expense..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="ea-filter-tabs">
          {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
            <button key={f} className={`ea-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f} ({f === 'All' ? expenses.length : expenses.filter(e => e.status === f).length})
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div className="ea-table-wrap glass" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <table className="ea-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Expense</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Receipt</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((exp, i) => (
              <motion.tr key={exp.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}>
                <td>
                  <div className="ea-emp-cell">
                    <div className="ea-emp-avatar">{exp.employee.charAt(0)}</div>
                    <div>
                      <div className="ea-emp-name">{exp.employee}</div>
                      <div className="ea-emp-dept">{exp.dept} · {exp.empId}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="ea-exp-title">{exp.title}</div>
                  <div className="ea-exp-note">{exp.notes}</div>
                </td>
                <td><span className="ea-cat-badge">{CATEGORY_ICONS[exp.category] || '📋'} {exp.category}</span></td>
                <td className="ea-amount">₹{exp.amount.toLocaleString('en-IN')}</td>
                <td className="ea-date">{new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                <td className="ea-receipt">{exp.receipt}</td>
                <td>
                  <span className={`ea-status-badge ${exp.status.toLowerCase()}`}>
                    {exp.status === 'Approved' && <CheckCircle size={12} />}
                    {exp.status === 'Pending' && <Clock size={12} />}
                    {exp.status === 'Rejected' && <XCircle size={12} />}
                    {exp.status}
                  </span>
                </td>
                <td>
                  {exp.status === 'Pending' ? (
                    <div className="ea-action-btns">
                      <button className="ea-approve" onClick={() => handleApprove(exp.id)} title="Approve"><CheckCircle size={16} /></button>
                      <button className="ea-reject" onClick={() => handleReject(exp.id)} title="Reject"><XCircle size={16} /></button>
                    </div>
                  ) : (
                    <span className="ea-done">{exp.status === 'Approved' ? '✓ Done' : '— Declined'}</span>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="ea-empty">No expenses match your filter. 🧾</div>}
      </motion.div>
    </div>
  );
}

export default ExpenseApprovals;
