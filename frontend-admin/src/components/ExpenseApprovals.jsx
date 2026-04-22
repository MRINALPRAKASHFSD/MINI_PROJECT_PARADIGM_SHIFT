import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { CheckCircle, XCircle, Clock, Search, Download, IndianRupee, FileText } from 'lucide-react';
import './ExpenseApprovals.css';

function ExpenseApprovals() {
  const { expenses: dataStoreExpenses, approveExpense, rejectExpense } = useDataStore();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const expenses = dataStoreExpenses || [];

  const handleApprove = async (id) => {
    try { await approveExpense(id); } catch(e) { console.error(e); }
  };
  const handleReject = async (id) => {
    try { await rejectExpense(id); } catch(e) { console.error(e); }
  };
  const handleBulkApprove = async () => {
    for (const e of expenses) {
      if ((e.status || '').toLowerCase() === 'pending') {
        try { await approveExpense(e.id); } catch(err) { console.error(err); }
      }
    }
  };

  const filtered = expenses.filter(e => {
    const statusLabel = (e.status || '').toLowerCase();
    const matchFilter = filter === 'All' || statusLabel === filter.toLowerCase();
    const employeeName = e.employeeName || e.employee || '';
    const matchSearch = !search || employeeName.toLowerCase().includes(search.toLowerCase()) || (e.title || e.category || '').toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totals = {
    pending: expenses.filter(e => (e.status || '').toLowerCase() === 'pending').reduce((s, e) => s + (e.amount || 0), 0),
    approved: expenses.filter(e => (e.status || '').toLowerCase() === 'approved').reduce((s, e) => s + (e.amount || 0), 0),
    rejected: expenses.filter(e => (e.status || '').toLowerCase() === 'rejected').reduce((s, e) => s + (e.amount || 0), 0),
    total: expenses.reduce((s, e) => s + (e.amount || 0), 0),
  };


  return (
    <div className="expense-approvals">
      <div className="ea-header">
        <div>
          <h1><IndianRupee size={24} /> Expense Approvals</h1>
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
      </div>

      <div className="ea-summary">
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
      </div>

      <div className="ea-filters">
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
      </div>

      <div className="ea-table-wrap">
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
            {filtered.map((exp) => (
              <tr key={exp.id}>
                <td>
                  <div className="ea-emp-cell">
                    <div className="ea-emp-avatar">{(exp.employeeName || '?').charAt(0)}</div>
                    <div>
                      <div className="ea-emp-name">{exp.employeeName}</div>
                      <div className="ea-emp-dept">{exp.dept || 'Engineering'} · {exp.empId || 'EMP00X'}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="ea-exp-title">{exp.title}</div>
                  <div className="ea-exp-note">{exp.notes}</div>
                </td>
                <td>
                  <span className="ea-cat-badge">
                    <FileText size={12} style={{marginRight: '4px'}} />
                    {exp.category}
                  </span>
                </td>
                <td className="ea-amount">₹{(exp.amount || 0).toLocaleString('en-IN')}</td>
                <td className="ea-date">{new Date(exp.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                <td className="ea-receipt">{exp.receiptNo || exp.receipt || 'N/A'}</td>
                <td>
                  <span className={`ea-status-badge ${(exp.status || '').toLowerCase()}`}>
                    <span style={{textTransform:'capitalize'}}>{exp.status}</span>
                  </span>
                </td>
                <td>
                  {(exp.status || '').toLowerCase() === 'pending' ? (
                    <div className="ea-action-btns">
                      <button className="ea-approve" onClick={() => handleApprove(exp.id)} title="Approve"><CheckCircle size={16} /></button>
                      <button className="ea-reject" onClick={() => handleReject(exp.id)} title="Reject"><XCircle size={16} /></button>
                    </div>
                  ) : (
                    <span className="ea-done">{(exp.status || '').toLowerCase() === 'approved' ? '✓ Approved' : '× Rejected'}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="ea-empty">No expense claims found matching the criteria.</div>}
      </div>
    </div>
  );
}

export default ExpenseApprovals;
