import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import {
  Plus, Trash2, Filter, IndianRupee, Receipt, Plane,
  UtensilsCrossed, Monitor, Code, GraduationCap, X,
  CheckCircle2, Clock as ClockIcon, XCircle, Search
} from 'lucide-react';

const categoryConfig = {
  Travel: { icon: Plane, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  Food: { icon: UtensilsCrossed, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  Equipment: { icon: Monitor, color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
  Software: { icon: Code, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' },
  Training: { icon: GraduationCap, color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
};

const statusConfig = {
  approved: { label: 'Approved', icon: CheckCircle2, color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  pending: { label: 'Pending', icon: ClockIcon, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  rejected: { label: 'Rejected', icon: XCircle, color: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
};

const Expenses = () => {
  const { expenses, addExpense, deleteExpense } = useDataStore();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ title: '', category: 'Travel', amount: '', date: new Date().toISOString().split('T')[0], description: '' });

  const filteredExpenses = expenses
    .filter(e => filter === 'all' || e.status === filter)
    .filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()) || e.category.toLowerCase().includes(searchTerm.toLowerCase()));

  const totalApproved = expenses.filter(e => e.status === 'approved').reduce((s, e) => s + e.amount, 0);
  const totalPending = expenses.filter(e => e.status === 'pending').reduce((s, e) => s + e.amount, 0);
  const totalThisMonth = expenses.filter(e => e.date.startsWith(new Date().toISOString().slice(0, 7))).reduce((s, e) => s + e.amount, 0);

  const handleSubmit = () => {
    if (!form.title || !form.amount) return;
    addExpense({ ...form, amount: Number(form.amount) });
    setForm({ title: '', category: 'Travel', amount: '', date: new Date().toISOString().split('T')[0], description: '' });
    setShowModal(false);
  };

  return (
    <div style={{ padding: '24px', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Header section — text only, no card wrapper */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 6px' }}>Expense Claims</h1>
          <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
            Submit claims for work-related expenses. Approved amounts are reimbursed in next month's salary.
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ padding: '10px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Plus size={18} /> New Claim
        </button>
      </div>

      {/* Quick stats — three different sized cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '24px' }}>
        <div style={{ background: 'var(--surface-panel)', borderRadius: '14px', padding: '20px', borderLeft: '4px solid #10b981' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Approved & Reimbursed</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>₹{totalApproved.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ background: 'var(--surface-panel)', borderRadius: '14px', padding: '20px', borderLeft: '4px solid #f59e0b' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Pending Approval</div>
          <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>₹{totalPending.toLocaleString('en-IN')}</div>
        </div>
        <div style={{ background: 'var(--surface-panel)', borderRadius: '14px', padding: '20px', borderLeft: '4px solid #a855f7' }}>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>This Month Total</div>
          <div style={{ fontSize: '24px', fontWeight: '700' }}>₹{totalThisMonth.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Search + Filter row */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input type="text" placeholder="Search expenses..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '10px', background: 'var(--btn-ghost-bg)', border: '1px solid var(--btn-ghost-border)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        {['all', 'approved', 'pending', 'rejected'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{
              padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '500', cursor: 'pointer', border: 'none',
              background: filter === f ? 'rgba(59,130,246,0.2)' : 'var(--surface-inset)',
              color: filter === f ? '#60a5fa' : 'var(--text-secondary)',
            }}>
            {f === 'all' ? `All (${expenses.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${expenses.filter(e => e.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Expense list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filteredExpenses.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)', background: 'var(--surface-panel)', borderRadius: '16px' }}>
            {searchTerm ? 'No expenses match your search.' : 'No expenses yet. Submit your first claim! ✨'}
          </div>
        )}

        {filteredExpenses.map(expense => {
          const cat = categoryConfig[expense.category] || categoryConfig.Travel;
          const status = statusConfig[expense.status];
          const CatIcon = cat.icon;
          const StatusIcon = status.icon;

          return (
            <div key={expense.id}
              style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', background: 'var(--surface-panel)', borderRadius: '14px', border: '1px solid var(--surface-inset)', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-panel)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--surface-panel)'}
            >
              {/* Category icon */}
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: cat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <CatIcon size={20} color={cat.color} />
              </div>

              {/* Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '3px' }}>{expense.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <span>{expense.category}</span>
                  <span>·</span>
                  <span>{new Date(expense.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  {expense.approvedBy && <><span>·</span><span>by {expense.approvedBy}</span></>}
                </div>
              </div>

              {/* Amount */}
              <div style={{ fontSize: '16px', fontWeight: '700', whiteSpace: 'nowrap', marginRight: '8px' }}>
                ₹{expense.amount.toLocaleString('en-IN')}
              </div>

              {/* Status badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 10px', borderRadius: '8px', background: status.bg, color: status.color, fontSize: '12px', fontWeight: '600', whiteSpace: 'nowrap' }}>
                <StatusIcon size={13} /> {status.label}
              </div>

              {/* Receipt # */}
              <span style={{ fontSize: '11px', color: 'var(--text-faint)', whiteSpace: 'nowrap', fontFamily: 'monospace' }}>
                {expense.receiptNo}
              </span>

              {/* Delete */}
              {expense.status === 'pending' && (
                <button onClick={() => deleteExpense(expense.id)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px' }}>
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Category breakdown — at the bottom, laid out differently */}
      <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
        {Object.entries(categoryConfig).map(([name, config]) => {
          const total = expenses.filter(e => e.category === name && e.status === 'approved').reduce((s, e) => s + e.amount, 0);
          const count = expenses.filter(e => e.category === name).length;
          const CIcon = config.icon;
          return (
            <div key={name} style={{ background: 'var(--surface-panel)', borderRadius: '12px', padding: '16px', textAlign: 'center', border: `1px solid ${config.color}15` }}>
              <CIcon size={22} color={config.color} style={{ marginBottom: '8px' }} />
              <div style={{ fontSize: '13px', fontWeight: '600', marginBottom: '4px' }}>{name}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{count} claim{count !== 1 ? 's' : ''} · ₹{total.toLocaleString('en-IN')}</div>
            </div>
          );
        })}
      </div>

      {/* New Expense Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowModal(false)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#0f172a', borderRadius: '20px', padding: '32px', width: '440px', maxWidth: '95vw', border: '1px solid var(--btn-ghost-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Submit Expense Claim</h2>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>What did you spend on?</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g., Cab to client office"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--btn-ghost-bg)', border: '1px solid var(--btn-ghost-border)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--btn-ghost-bg)', border: '1px solid var(--btn-ghost-border)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none' }}>
                    {Object.keys(categoryConfig).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Amount (₹)</label>
                  <input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0"
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--btn-ghost-bg)', border: '1px solid var(--btn-ghost-border)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--btn-ghost-bg)', border: '1px solid var(--btn-ghost-border)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Description (optional)</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Any additional details..."
                  rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'var(--btn-ghost-bg)', border: '1px solid var(--btn-ghost-border)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
              </div>

              <button onClick={handleSubmit}
                style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #f59e0b, #f97316)', border: 'none', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' }}>
                Submit Claim
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;
