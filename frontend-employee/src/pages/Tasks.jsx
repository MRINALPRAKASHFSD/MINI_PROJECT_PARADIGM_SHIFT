import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckSquare, Plus, Filter, Calendar, Clock, User, Flag, Search, MoreVertical, Edit, Trash2, Eye, X, Save, ArrowRight, ChevronDown
} from 'lucide-react';
import './Tasks.css';

const INITIAL_TASKS = {
  todo: [
    { id: 1, title: 'Design new landing page', description: 'Create modern and responsive design for client portal', priority: 'high', dueDate: '2026-04-15', assignee: 'Priya Sharma', avatar: 'PS', tags: ['UI/UX', 'Frontend'] },
    { id: 2, title: 'Setup CI/CD pipeline', description: 'Configure automated deployment with Jenkins', priority: 'medium', dueDate: '2026-04-18', assignee: 'Vikram Patel', avatar: 'VP', tags: ['DevOps', 'Automation'] },
    { id: 3, title: 'Write API documentation', description: 'Document all REST endpoints with Swagger', priority: 'low', dueDate: '2026-04-20', assignee: 'Ananya Gupta', avatar: 'AG', tags: ['Documentation', 'API'] },
  ],
  inProgress: [
    { id: 4, title: 'Implement authentication', description: 'Add JWT-based auth with OTP verification', priority: 'high', dueDate: '2026-04-12', assignee: 'Rajesh Kumar', avatar: 'RK', tags: ['Security', 'Auth'] },
    { id: 5, title: 'Optimize database queries', description: 'Improve MongoDB aggregation performance', priority: 'medium', dueDate: '2026-04-14', assignee: 'Sneha Iyer', avatar: 'SI', tags: ['Database', 'Performance'] },
  ],
  review: [
    { id: 6, title: 'Code review: Payment module', description: 'Review Razorpay integration code', priority: 'high', dueDate: '2026-04-10', assignee: 'Arjun Reddy', avatar: 'AR', tags: ['Review', 'Payment'] },
  ],
  completed: [
    { id: 7, title: 'Setup project structure', description: 'Initialize React project with Vite', priority: 'medium', dueDate: '2026-04-05', assignee: 'Priya Sharma', avatar: 'PS', tags: ['Setup', 'React'] },
    { id: 8, title: 'Database schema design', description: 'Design complete MongoDB schema', priority: 'high', dueDate: '2026-04-08', assignee: 'Ananya Gupta', avatar: 'AG', tags: ['Database', 'Design'] },
  ]
};

const columns = [
  { id: 'todo', title: 'To Do', color: '#3b82f6', icon: '📋' },
  { id: 'inProgress', title: 'In Progress', color: '#eab308', icon: '⚡' },
  { id: 'review', title: 'Review', color: '#a855f7', icon: '👀' },
  { id: 'completed', title: 'Completed', color: '#10b981', icon: '✅' }
];

const priorityColors = { high: '#ef4444', medium: '#f97316', low: '#10b981' };

const TEAM_MEMBERS = ['Rajesh Kumar', 'Priya Sharma', 'Vikram Patel', 'Ananya Gupta', 'Sneha Iyer', 'Arjun Reddy', 'Deepika Nair', 'Amit Joshi'];

const Tasks = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [addToColumn, setAddToColumn] = useState('todo');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium', dueDate: '', assignee: '', tags: '' });

  let nextId = useRef(9);

  const allTasks = Object.values(tasks).flat();
  const stats = [
    { label: 'Total Tasks', value: allTasks.length, color: '#3b82f6' },
    { label: 'In Progress', value: tasks.inProgress.length, color: '#eab308' },
    { label: 'Completed', value: tasks.completed.length, color: '#10b981' },
    { label: 'Pending Review', value: tasks.review.length, color: '#a855f7' }
  ];

  const openAddModal = (columnId) => {
    setEditingTask(null);
    setAddToColumn(columnId);
    setFormData({ title: '', description: '', priority: 'medium', dueDate: '', assignee: '', tags: '' });
    setShowModal(true);
  };

  const openEditModal = (task, columnId) => {
    setEditingTask({ ...task, columnId });
    setFormData({ title: task.title, description: task.description, priority: task.priority, dueDate: task.dueDate, assignee: task.assignee, tags: task.tags.join(', ') });
    setShowModal(true);
    setOpenMenuId(null);
  };

  const openViewModal = (task) => {
    setViewingTask(task);
    setShowViewModal(true);
    setOpenMenuId(null);
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;
    const tagsList = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    const initials = (formData.assignee || 'UN').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

    if (editingTask) {
      setTasks(prev => {
        const updated = { ...prev };
        updated[editingTask.columnId] = updated[editingTask.columnId].map(t =>
          t.id === editingTask.id ? { ...t, title: formData.title, description: formData.description, priority: formData.priority, dueDate: formData.dueDate, assignee: formData.assignee || t.assignee, avatar: initials, tags: tagsList.length ? tagsList : t.tags } : t
        );
        return updated;
      });
    } else {
      const newTask = { id: nextId.current++, title: formData.title, description: formData.description, priority: formData.priority, dueDate: formData.dueDate, assignee: formData.assignee || 'Unassigned', avatar: initials || 'UN', tags: tagsList.length ? tagsList : ['General'] };
      setTasks(prev => ({ ...prev, [addToColumn]: [...prev[addToColumn], newTask] }));
    }
    setShowModal(false);
  };

  const handleDelete = (taskId, columnId) => {
    setTasks(prev => ({ ...prev, [columnId]: prev[columnId].filter(t => t.id !== taskId) }));
    setOpenMenuId(null);
  };

  const moveTask = (taskId, fromCol, toCol) => {
    const task = tasks[fromCol].find(t => t.id === taskId);
    if (!task) return;
    setTasks(prev => ({
      ...prev,
      [fromCol]: prev[fromCol].filter(t => t.id !== taskId),
      [toCol]: [...prev[toCol], task]
    }));
    setOpenMenuId(null);
  };

  const getFilteredTasks = (columnTasks) => {
    let filtered = columnTasks;
    if (searchQuery) filtered = filtered.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.description.toLowerCase().includes(searchQuery.toLowerCase()));
    if (filter === 'priority') filtered = filtered.filter(t => t.priority === 'high');
    if (filter === 'my') filtered = filtered.filter(t => t.assignee === 'Rajesh Kumar');
    return filtered;
  };

  return (
    <div className="tasks-container dark">
      <div className="tasks-header">
        <div className="header-left">
          <motion.div className="header-icon" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}><CheckSquare size={28} /></motion.div>
          <div><h1>Tasks</h1><p>Manage and track your tasks</p></div>
        </div>
        <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => openAddModal('todo')}>
          <Plus size={20} /> New Task
        </motion.button>
      </div>

      <div className="tasks-stats">
        {stats.map((stat, i) => (
          <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}>
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}><CheckSquare size={24} /></div>
            <div className="stat-info"><span className="stat-label">{stat.label}</span><span className="stat-value">{stat.value}</span></div>
          </motion.div>
        ))}
      </div>

      <div className="tasks-controls">
        <div className="search-box"><Search size={20} /><input type="text" placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
        <div className="filter-buttons">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>All Tasks</button>
          <button className={filter === 'my' ? 'active' : ''} onClick={() => setFilter('my')}>My Tasks</button>
          <button className={filter === 'priority' ? 'active' : ''} onClick={() => setFilter('priority')}>High Priority</button>
        </div>
        <button className="filter-btn"><Filter size={20} /> Filters</button>
      </div>

      <div className="kanban-board">
        {columns.map((column, colIdx) => {
          const filtered = getFilteredTasks(tasks[column.id]);
          return (
            <motion.div key={column.id} className="kanban-column" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: colIdx * 0.1 }}>
              <div className="column-header" style={{ borderColor: column.color }}>
                <div className="column-title"><span className="column-icon">{column.icon}</span><h3>{column.title}</h3><span className="task-count">{filtered.length}</span></div>
                <button className="column-menu"><MoreVertical size={18} /></button>
              </div>
              <div className="column-body">
                {filtered.map((task, taskIdx) => (
                  <motion.div key={task.id} className="task-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: colIdx * 0.1 + taskIdx * 0.05 }} whileHover={{ scale: 1.02, y: -3 }}>
                    <div className="task-card-header">
                      <span className="priority-badge" style={{ backgroundColor: `${priorityColors[task.priority]}20`, color: priorityColors[task.priority] }}><Flag size={12} /> {task.priority.toUpperCase()}</span>
                      <div style={{ position: 'relative' }}>
                        <button className="task-menu" onClick={() => setOpenMenuId(openMenuId === task.id ? null : task.id)}><MoreVertical size={16} /></button>
                        <AnimatePresence>
                          {openMenuId === task.id && (
                            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                              style={{ position: 'absolute', right: 0, top: '100%', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '8px', zIndex: 100, minWidth: '180px', backdropFilter: 'blur(20px)' }}>
                              <button onClick={() => openViewModal(task)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', border: 'none', background: 'none', color: '#e2e8f0', cursor: 'pointer', borderRadius: '8px', fontSize: '13px' }}><Eye size={14} /> View Details</button>
                              <button onClick={() => openEditModal(task, column.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', border: 'none', background: 'none', color: '#e2e8f0', cursor: 'pointer', borderRadius: '8px', fontSize: '13px' }}><Edit size={14} /> Edit Task</button>
                              {columns.filter(c => c.id !== column.id).map(c => (
                                <button key={c.id} onClick={() => moveTask(task.id, column.id, c.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', border: 'none', background: 'none', color: c.color, cursor: 'pointer', borderRadius: '8px', fontSize: '13px' }}><ArrowRight size={14} /> Move to {c.title}</button>
                              ))}
                              <button onClick={() => handleDelete(task.id, column.id)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', border: 'none', background: 'none', color: '#ef4444', cursor: 'pointer', borderRadius: '8px', fontSize: '13px' }}><Trash2 size={14} /> Delete</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                    <h4>{task.title}</h4>
                    <p className="task-description">{task.description}</p>
                    <div className="task-tags">{task.tags.map((tag, i) => <span key={i} className="task-tag">{tag}</span>)}</div>
                    <div className="task-footer">
                      <div className="task-meta"><div className="meta-item"><Calendar size={14} /><span>{new Date(task.dueDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span></div></div>
                      <div className="task-assignee"><div className="assignee-avatar" title={task.assignee}>{task.avatar}</div></div>
                    </div>
                  </motion.div>
                ))}
                <motion.button className="add-task-btn" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => openAddModal(column.id)}><Plus size={18} /> Add Task</motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} onClick={e => e.stopPropagation()}
              style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '520px', color: '#e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '22px' }}>{editingTask ? 'Edit Task' : 'New Task'}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Title *</label>
                  <input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Enter task title..." style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Describe the task..." rows="3" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: '14px', resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Priority</label>
                    <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.9)', color: '#e2e8f0', fontSize: '14px', outline: 'none' }}>
                      <option value="high">🔴 High</option><option value="medium">🟠 Medium</option><option value="low">🟢 Low</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Due Date</label>
                    <input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.9)', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Assignee</label>
                  <select value={formData.assignee} onChange={e => setFormData({ ...formData, assignee: e.target.value })} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.9)', color: '#e2e8f0', fontSize: '14px', outline: 'none' }}>
                    <option value="">Select assignee...</option>
                    {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px', display: 'block' }}>Tags (comma separated)</label>
                  <input value={formData.tags} onChange={e => setFormData({ ...formData, tags: e.target.value })} placeholder="React, Frontend, Bug Fix" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Save size={16} /> {editingTask ? 'Update' : 'Create'}</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && viewingTask && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowViewModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}
              style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '520px', color: '#e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span className="priority-badge" style={{ backgroundColor: `${priorityColors[viewingTask.priority]}20`, color: priorityColors[viewingTask.priority], padding: '6px 14px', borderRadius: '8px', fontWeight: '600', fontSize: '13px' }}><Flag size={12} /> {viewingTask.priority.toUpperCase()}</span>
                <button onClick={() => setShowViewModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <h2 style={{ margin: '0 0 8px 0', fontSize: '22px' }}>{viewingTask.title}</h2>
              <p style={{ color: '#94a3b8', margin: '0 0 20px 0', lineHeight: '1.6' }}>{viewingTask.description}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px' }}><div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Assignee</div><div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><User size={16} /> {viewingTask.assignee}</div></div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px' }}><div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Due Date</div><div style={{ fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}><Calendar size={16} /> {new Date(viewingTask.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>{viewingTask.tags.map((tag, i) => <span key={i} style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', fontSize: '13px', fontWeight: '500' }}>{tag}</span>)}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;