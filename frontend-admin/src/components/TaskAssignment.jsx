import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  X, 
  User, 
  Calendar, 
  Tag 
} from 'lucide-react';
import { useDataStore } from '../store/dataStore';
import './TaskAssignment.css';

const PRIORITY_COLORS = { 
  high: '#ef4444', 
  medium: '#f59e0b', 
  low: '#10b981',
  high: '#ef4444', // Backward compat
  medium: '#f59e0b',
  low: '#10b981'
};

const STATUS_ICONS = { 
  todo: Clock, 
  inProgress: AlertCircle, 
  completed: CheckSquare 
};

function TaskAssignment() {
  const { tasks = [], employees = [], addTask, deleteTask, updateTask } = useDataStore();
  const [showModal, setShowModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [newTask, setNewTask] = useState({ 
    title: '', 
    assigneeId: '', 
    priority: 'medium', 
    dueDate: '', 
    category: 'Engineering', 
    description: '' 
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assigneeId) return;
    
    const assignedUser = employees.find(emp => emp.id === newTask.assigneeId);
    
    try {
      await addTask({
        ...newTask,
        assignee: newTask.assigneeId,
        assigneeName: assignedUser ? assignedUser.name : 'Unassigned',
        status: 'todo'
      });
      setNewTask({ 
        title: '', 
        assigneeId: '', 
        priority: 'medium', 
        dueDate: '', 
        category: 'Engineering', 
        description: '' 
      });
      setShowModal(false);
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await updateTask(id, { status });
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
    } catch (err) { console.error(err); }
  };

  const filtered = filterStatus === 'All' 
    ? tasks 
    : tasks.filter(t => (t.status || '').toLowerCase() === filterStatus.toLowerCase().replace(' ', ''));

  const counts = { 
    todo: tasks.filter(t => (t.status || '').toLowerCase() === 'todo').length, 
    inProgress: tasks.filter(t => (t.status || '').toLowerCase() === 'inprogress').length, 
    done: tasks.filter(t => (t.status || '').toLowerCase() === 'completed').length 
  };

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

      <motion.div className="ta-stats" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div className="ta-stat todo"><Clock size={16} /> <span>{counts.todo} To Do</span></div>
        <div className="ta-stat progress"><AlertCircle size={16} /> <span>{counts.inProgress} In Progress</span></div>
        <div className="ta-stat done"><CheckSquare size={16} /> <span>{counts.done} Completed</span></div>
        <div className="ta-stat total"><span>{tasks.length} Total Tasks</span></div>
      </motion.div>

      <div className="ta-filter-row">
        {['All', 'Todo', 'In Progress', 'Done'].map(f => (
          <button key={f} className={`ta-filter ${filterStatus === f ? 'active' : ''}`} onClick={() => setFilterStatus(f)}>{f}</button>
        ))}
      </div>

      <div className="ta-list">
        {filtered.map((task, i) => {
          const statusKey = (task.status || 'todo').toLowerCase();
          const StatusIcon = STATUS_ICONS[statusKey] || Clock;
          const priorityKey = (task.priority || 'medium').toLowerCase();
          const priorityColor = PRIORITY_COLORS[priorityKey] || '#64748b';

          return (
            <motion.div key={task.id || task._id || i} className="ta-card glass" initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.04 * i }}>
              <div className="ta-card-left">
                <div className="ta-priority-bar" style={{ background: priorityColor }} />
                <div className="ta-card-body">
                  <div className="ta-card-top-row">
                    <h3>{task.title}</h3>
                    <span className="ta-priority-badge" style={{ background: `${priorityColor}18`, color: priorityColor }}>
                      {task.priority || 'Medium'}
                    </span>
                  </div>
                  <p className="ta-card-desc">{task.description}</p>
                  <div className="ta-card-meta">
                    <span className="ta-meta-item"><User size={12} /> {task.assigneeName || 'Unassigned'}</span>
                    <span className="ta-meta-item"><Tag size={12} /> {task.category || 'General'}</span>
                    <span className="ta-meta-item">
                      <Calendar size={12} /> {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : 'No date'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ta-card-right">
                <select 
                  className="ta-status-select" 
                  value={task.status || 'todo'} 
                  onChange={e => handleUpdateStatus(task.id, e.target.value)}
                >
                  <option value="todo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="completed">Done</option>
                </select>
                <button className="ta-delete-btn" onClick={() => handleDelete(task.id)} title="Delete"><X size={14} /></button>
              </div>
            </motion.div>
          );
        })}
        {filtered.length === 0 && <div className="ta-empty">No tasks for this filter. Assign one! 🎯</div>}
      </div>

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
                  <select value={newTask.assigneeId} onChange={e => setNewTask(p => ({ ...p, assigneeId: e.target.value }))} required>
                    <option value="">Select employee</option>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div className="ta-form-field">
                  <label>Priority</label>
                  <select value={newTask.priority} onChange={e => setNewTask(p => ({ ...p, priority: e.target.value }))}>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
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
