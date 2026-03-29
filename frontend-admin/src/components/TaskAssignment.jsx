import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, CheckSquare, Clock, AlertCircle, X, User, Calendar, Tag } from 'lucide-react';
import './TaskAssignment.css';

const EMPLOYEES = [
  'Rajesh Kumar', 'Ananya Gupta', 'Vikram Patel', 'Priya Sharma',
  'Rohit Saxena', 'Diya Sharma', 'Arjun Reddy', 'Sneha Iyer',
  'Mahin Khan', 'Rohan Kapoor'
];

const INITIAL_TASKS = [
  { id: 1, title: 'Code review: Payment module', assignee: 'Vikram Patel', priority: 'High', status: 'In Progress', dueDate: '2026-04-01', category: 'Engineering', description: 'Review the Razorpay integration PR' },
  { id: 2, title: 'Aadhaar eKYC flow', assignee: 'Ananya Gupta', priority: 'High', status: 'Todo', dueDate: '2026-04-03', category: 'Design', description: 'Design the Aadhaar verification screens' },
  { id: 3, title: 'Design new landing page', assignee: 'Rajesh Kumar', priority: 'Medium', status: 'In Progress', dueDate: '2026-04-05', category: 'Engineering', description: 'Build responsive landing with new brand guidelines' },
  { id: 4, title: 'Unit tests for auth module', assignee: 'Rohit Saxena', priority: 'Medium', status: 'Todo', dueDate: '2026-04-06', category: 'Engineering', description: 'Add Jest tests for login, register, forgot password flows' },
  { id: 5, title: 'Q1 marketing report', assignee: 'Priya Sharma', priority: 'Low', status: 'Done', dueDate: '2026-03-28', category: 'Marketing', description: 'Compile social media + ad performance data' },
  { id: 6, title: 'Employee onboarding docs', assignee: 'Sneha Iyer', priority: 'Medium', status: 'In Progress', dueDate: '2026-04-02', category: 'HR', description: 'Update the welcome kit and handbook' },
  { id: 7, title: 'AWS cost optimization', assignee: 'Arjun Reddy', priority: 'High', status: 'Todo', dueDate: '2026-04-04', category: 'DevOps', description: 'Analyze unused EC2 instances and RDS costs' },
  { id: 8, title: 'Client presentation deck', assignee: 'Mahin Khan', priority: 'Medium', status: 'Done', dueDate: '2026-03-26', category: 'Sales', description: 'Prepare investor pitch deck for Series A' },
];

const PRIORITY_COLORS = { High: '#ef4444', Medium: '#f59e0b', Low: '#10b981' };
const STATUS_ICONS = { 'Todo': Clock, 'In Progress': AlertCircle, 'Done': CheckSquare };

function TaskAssignment() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [newTask, setNewTask] = useState({ title: '', assignee: '', priority: 'Medium', dueDate: '', category: 'Engineering', description: '' });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignee) return;
    setTasks(prev => [...prev, { ...newTask, id: Date.now(), status: 'Todo' }]);
    setNewTask({ title: '', assignee: '', priority: 'Medium', dueDate: '', category: 'Engineering', description: '' });
    setShowModal(false);
  };

  const updateStatus = (id, status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filtered = filterStatus === 'All' ? tasks : tasks.filter(t => t.status === filterStatus);
  const counts = { todo: tasks.filter(t => t.status === 'Todo').length, inProgress: tasks.filter(t => t.status === 'In Progress').length, done: tasks.filter(t => t.status === 'Done').length };

  return (
    <div className="task-assignment">
      <motion.div className="ta-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1><CheckSquare size={28} style={{ display: 'inline', verticalAlign: 'middle' }} /> Task Assignment</h1>
          <p>Create and assign tasks to employees</p>
        </div>
        <button className="ta-create-btn" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Assign New Task
        </button>
      </motion.div>

      {/* Stats bar */}
      <motion.div className="ta-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="ta-stat todo"><Clock size={16} /> <span>{counts.todo} To Do</span></div>
        <div className="ta-stat progress"><AlertCircle size={16} /> <span>{counts.inProgress} In Progress</span></div>
        <div className="ta-stat done"><CheckSquare size={16} /> <span>{counts.done} Completed</span></div>
        <div className="ta-stat total"><span>{tasks.length} Total Tasks</span></div>
      </motion.div>

      {/* Filters */}
      <div className="ta-filter-row">
        {['All', 'Todo', 'In Progress', 'Done'].map(f => (
          <button key={f} className={`ta-filter ${filterStatus === f ? 'active' : ''}`} onClick={() => setFilterStatus(f)}>{f}</button>
        ))}
      </div>

      {/* Task list */}
      <div className="ta-list">
        {filtered.map((task, i) => {
          const Icon = STATUS_ICONS[task.status] || Clock;
          const daysLeft = Math.ceil((new Date(task.dueDate) - new Date()) / 86400000);
          return (
            <motion.div key={task.id} className="ta-card glass" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
              <div className="ta-card-left">
                <div className="ta-priority-bar" style={{ background: PRIORITY_COLORS[task.priority] }} />
                <div className="ta-card-body">
                  <div className="ta-card-top-row">
                    <h3>{task.title}</h3>
                    <span className="ta-priority-badge" style={{ background: `${PRIORITY_COLORS[task.priority]}18`, color: PRIORITY_COLORS[task.priority] }}>{task.priority}</span>
                  </div>
                  <p className="ta-card-desc">{task.description}</p>
                  <div className="ta-card-meta">
                    <span className="ta-meta-item"><User size={12} /> {task.assignee}</span>
                    <span className="ta-meta-item"><Tag size={12} /> {task.category}</span>
                    <span className="ta-meta-item"><Calendar size={12} /> {new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                    {task.status !== 'Done' && (
                      <span className={`ta-meta-item ${daysLeft <= 2 ? 'urgent' : ''}`}>
                        {daysLeft > 0 ? `${daysLeft}d left` : 'Overdue'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="ta-card-right">
                <select className="ta-status-select" value={task.status} onChange={e => updateStatus(task.id, e.target.value)}>
                  <option value="Todo">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
                <button className="ta-delete-btn" onClick={() => deleteTask(task.id)} title="Delete"><X size={14} /></button>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && <div className="ta-empty">No tasks for this filter. Assign one! 🎯</div>}
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="ta-modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div className="ta-modal" onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="ta-modal-header">
              <h2>Assign New Task</h2>
              <button className="ta-modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreate}>
              <div className="ta-form-field">
                <label>Task Title *</label>
                <input value={newTask.title} onChange={e => setNewTask(p => ({ ...p, title: e.target.value }))} placeholder="e.g. Build user dashboard" required />
              </div>
              <div className="ta-form-row">
                <div className="ta-form-field">
                  <label>Assign To *</label>
                  <select value={newTask.assignee} onChange={e => setNewTask(p => ({ ...p, assignee: e.target.value }))} required>
                    <option value="">Select employee</option>
                    {EMPLOYEES.map(e => <option key={e} value={e}>{e}</option>)}
                  </select>
                </div>
                <div className="ta-form-field">
                  <label>Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>
              <div className="ta-form-row">
                <div className="ta-form-field">
                  <label>Category</label>
                  <select value={newTask.category} onChange={e => setNewTask(p => ({ ...p, category: e.target.value }))}>
                    {['Engineering', 'Design', 'Marketing', 'HR', 'Sales', 'DevOps', 'Finance', 'Legal'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="ta-form-field">
                  <label>Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={e => setNewTask(p => ({ ...p, dueDate: e.target.value }))} />
                </div>
              </div>
              <div className="ta-form-field">
                <label>Description</label>
                <textarea rows={3} value={newTask.description} onChange={e => setNewTask(p => ({ ...p, description: e.target.value }))} placeholder="Brief description..." />
              </div>
              <div className="ta-modal-foot">
                <button type="button" className="ta-cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="ta-submit-btn"><Plus size={16} /> Create Task</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default TaskAssignment;
