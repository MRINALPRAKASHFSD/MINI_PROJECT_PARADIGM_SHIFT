import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import {
  CheckSquare, Plus, Filter, Calendar, Clock, User, Flag, Search, MoreVertical, Edit, Trash2, Eye, X, Save, ArrowRight, ChevronDown, ListChecks
} from 'lucide-react';
import './Tasks.css';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: '#3b82f6', icon: '📋' },
  { id: 'inProgress', title: 'In Progress', color: '#eab308', icon: '⚡' },
  { id: 'review', title: 'Review', color: '#a855f7', icon: '👀' },
  { id: 'completed', title: 'Completed', color: '#10b981', icon: '✅' }
];
const PRIORITY_COLORS = { high: '#ef4444', medium: '#f97316', low: '#10b981' };
const TEAM = ['Rajesh Kumar', 'Priya Sharma', 'Vikram Patel', 'Ananya Gupta', 'Sneha Iyer', 'Arjun Reddy', 'Deepika Nair', 'Amit Joshi', 'Kavita Deshmukh', 'Rohit Saxena'];

const Tasks = () => {
  const { tasks, addTask, updateTask, deleteTask, moveTask, toggleSubtask } = useDataStore();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);
  const [addToColumn, setAddToColumn] = useState('todo');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'medium', dueDate: '', assignee: '', tags: '', subtasks: '' });

  // Close dropdown on outside click
  useEffect(() => {
    const h = () => setOpenMenuId(null);
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  // ── Filtering ──────────────────────────────────────────────
  const filterTasks = (list) => {
    let result = list;
    if (filter === 'mine') result = result.filter(t => t.assignee === 'Rajesh Kumar');
    if (filter === 'high') result = result.filter(t => t.priority === 'high');
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(t => t.title.toLowerCase().includes(q) || (t.description || '').toLowerCase().includes(q));
    }
    return result;
  };

  const columnTasks = (status) => filterTasks(tasks.filter(t => t.status === status));

  const allFiltered = filterTasks(tasks);
  const stats = [
    { label: 'Total', value: tasks.length, color: '#3b82f6' },
    { label: 'In Progress', value: tasks.filter(t => t.status === 'inProgress').length, color: '#eab308' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981' },
    { label: 'Review', value: tasks.filter(t => t.status === 'review').length, color: '#a855f7' },
  ];

  // ── Handlers ───────────────────────────────────────────────
  const openAddModal = (col) => {
    setEditingTask(null);
    setAddToColumn(col);
    setFormData({ title: '', description: '', priority: 'medium', dueDate: '', assignee: '', tags: '', subtasks: '' });
    setShowModal(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title, description: task.description || '', priority: task.priority, dueDate: task.dueDate || '',
      assignee: task.assignee || '', tags: (task.tags || []).join(', '), subtasks: (task.subtasks || []).map(s => s.text).join('\n'),
    });
    setShowModal(true);
    setOpenMenuId(null);
  };

  const handleSave = () => {
    if (!formData.title.trim()) return;
    const tagsArr = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
    const subsArr = formData.subtasks.split('\n').map(s => s.trim()).filter(Boolean).map(text => ({ text, done: false }));
    if (editingTask) {
      updateTask(editingTask.id, { ...formData, tags: tagsArr, subtasks: subsArr.length > 0 ? subsArr : editingTask.subtasks });
    } else {
      addTask({ ...formData, status: addToColumn, tags: tagsArr, subtasks: subsArr, avatar: (formData.assignee || 'RK').split(' ').map(w => w[0]).join('') });
    }
    setShowModal(false);
  };

  const handleDelete = (id) => { deleteTask(id); setOpenMenuId(null); };

  const daysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    return Math.ceil((new Date(dueDate) - new Date()) / 86400000);
  };

  const dueLabel = (dueDate) => {
    const d = daysUntilDue(dueDate);
    if (d === null) return null;
    if (d < 0) return { text: `${Math.abs(d)}d overdue`, color: '#ef4444' };
    if (d === 0) return { text: 'Due today', color: '#f59e0b' };
    if (d <= 2) return { text: `${d}d left`, color: '#f59e0b' };
    return { text: `${d}d left`, color: '#10b981' };
  };

  const cardStyle = { background: 'rgba(15,23,42,0.6)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.06)' };
  const inputStyle = { width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: '#e2e8f0', fontSize: '14px', boxSizing: 'border-box' };

  return (
    <div style={{ padding: '24px', color: '#e2e8f0', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckSquare size={28} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Tasks</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Manage and track your work</p>
          </div>
        </div>
        <button onClick={() => openAddModal('todo')}
          style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', border: 'none', borderRadius: '14px', padding: '12px 28px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> New Task
        </button>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{ ...cardStyle, padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '14px', color: '#94a3b8' }}>{s.label}</span>
            <span style={{ fontSize: '24px', fontWeight: '700', color: s.color }}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '200px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input placeholder="Search tasks..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '40px' }} />
        </div>
        {['all', 'mine', 'high'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', background: filter === f ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)', color: filter === f ? '#fff' : '#94a3b8', transition: 'all 0.2s' }}>
            {f === 'all' ? 'All Tasks' : f === 'mine' ? 'My Tasks' : 'High Priority'}
          </button>
        ))}
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
        {COLUMNS.map(col => {
          const colTasks = columnTasks(col.id);
          return (
            <div key={col.id} style={{ ...cardStyle, padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', padding: '0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{col.icon}</span>
                  <span style={{ fontWeight: '600', fontSize: '15px' }}>{col.title}</span>
                  <span style={{ fontSize: '12px', color: '#64748b', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '8px' }}>{colTasks.length}</span>
                </div>
                <button onClick={() => openAddModal(col.id)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}><Plus size={16} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', minHeight: '120px' }}>
                {colTasks.map(task => {
                  const due = dueLabel(task.dueDate);
                  const subsDone = (task.subtasks || []).filter(s => s.done).length;
                  const subsTotal = (task.subtasks || []).length;
                  return (
                    <div key={task.id} className="stat-card-smooth"
                      style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '14px', padding: '16px', border: '1px solid rgba(255,255,255,0.05)', cursor: 'default', transition: 'transform 0.15s, box-shadow 0.15s', position: 'relative' }}>
                      {/* Priority & Due */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontSize: '11px', fontWeight: '600', padding: '3px 8px', borderRadius: '6px', background: `${PRIORITY_COLORS[task.priority]}20`, color: PRIORITY_COLORS[task.priority], textTransform: 'capitalize' }}>
                          {task.priority}
                        </span>
                        <div style={{ position: 'relative' }}>
                          <button onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === task.id ? null : task.id); }}
                            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '2px' }}>
                            <MoreVertical size={14} />
                          </button>
                          {openMenuId === task.id && (
                            <div style={{ position: 'absolute', right: 0, top: '100%', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', padding: '6px', minWidth: '160px', zIndex: 50, backdropFilter: 'blur(10px)' }}>
                              {[
                                { label: '👁 View Details', action: () => { setViewingTask(task); setShowViewModal(true); setOpenMenuId(null); }},
                                { label: '✏️ Edit', action: () => openEditModal(task) },
                                ...COLUMNS.filter(c => c.id !== col.id).map(c => ({ label: `➡️ ${c.title}`, action: () => { moveTask(task.id, c.id); setOpenMenuId(null); }})),
                                { label: '🗑 Delete', action: () => handleDelete(task.id), danger: true },
                              ].map((item, idx) => (
                                <button key={idx} onClick={item.action}
                                  style={{ display: 'block', width: '100%', padding: '8px 12px', border: 'none', background: 'none', color: item.danger ? '#ef4444' : '#e2e8f0', fontSize: '13px', textAlign: 'left', cursor: 'pointer', borderRadius: '8px', transition: 'background 0.15s' }}
                                  onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                  onMouseLeave={e => e.target.style.background = 'none'}>
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '6px', lineHeight: '1.4' }}>{task.title}</div>
                      {task.description && <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '10px', lineHeight: '1.5' }}>{task.description.slice(0, 80)}{task.description.length > 80 ? '...' : ''}</div>}

                      {/* Subtasks progress */}
                      {subsTotal > 0 && (
                        <div style={{ marginBottom: '10px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#64748b', marginBottom: '4px' }}>
                            <span><ListChecks size={12} style={{ verticalAlign: 'middle' }} /> Subtasks</span>
                            <span>{subsDone}/{subsTotal}</span>
                          </div>
                          <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)' }}>
                            <div style={{ height: '100%', borderRadius: '2px', background: '#10b981', width: `${subsTotal > 0 ? (subsDone / subsTotal) * 100 : 0}%`, transition: 'width 0.3s' }} />
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      {task.tags && task.tags.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                          {task.tags.slice(0, 3).map((tag, ti) => (
                            <span key={ti} style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>{tag}</span>
                          ))}
                        </div>
                      )}

                      {/* Footer */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#64748b' }}>
                          <span style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', color: '#fff', fontWeight: '600' }}>
                            {(task.assignee || '').split(' ').map(w => w[0]).join('')}
                          </span>
                          {task.assignee && task.assignee.split(' ')[0]}
                        </div>
                        {due && <span style={{ fontSize: '11px', fontWeight: '600', color: due.color }}>{due.text}</span>}
                      </div>
                    </div>
                  );
                })}
                {colTasks.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '24px', color: '#475569', fontSize: '13px' }}>No tasks</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div onClick={e => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ ...cardStyle, width: '100%', maxWidth: '520px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ margin: 0, fontSize: '22px' }}>{editingTask ? 'Edit Task' : 'New Task'}</h2>
                <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Title *</label>
                  <input placeholder="Task title" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} style={inputStyle} /></div>
                <div><label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Description</label>
                  <textarea placeholder="Describe the task..." rows={3} value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div><label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Priority</label>
                    <select value={formData.priority} onChange={e => setFormData(p => ({ ...p, priority: e.target.value }))} style={inputStyle}>
                      <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                    </select></div>
                  <div><label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Due Date</label>
                    <input type="date" value={formData.dueDate} onChange={e => setFormData(p => ({ ...p, dueDate: e.target.value }))} style={inputStyle} /></div>
                </div>
                <div><label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Assignee</label>
                  <select value={formData.assignee} onChange={e => setFormData(p => ({ ...p, assignee: e.target.value }))} style={inputStyle}>
                    <option value="">Select member</option>{TEAM.map(m => <option key={m} value={m}>{m}</option>)}
                  </select></div>
                <div><label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Tags (comma separated)</label>
                  <input placeholder="e.g. React, API, UI" value={formData.tags} onChange={e => setFormData(p => ({ ...p, tags: e.target.value }))} style={inputStyle} /></div>
                <div><label style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Subtasks (one per line)</label>
                  <textarea placeholder="e.g.\nBuild header\nAdd footer\nWrite tests" rows={3} value={formData.subtasks} onChange={e => setFormData(p => ({ ...p, subtasks: e.target.value }))} style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }} /></div>
                <button onClick={handleSave}
                  style={{ padding: '14px', borderRadius: '14px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Task Modal */}
      <AnimatePresence>
        {showViewModal && viewingTask && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowViewModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <motion.div onClick={e => e.stopPropagation()}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ ...cardStyle, width: '100%', maxWidth: '520px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ margin: 0, fontSize: '22px' }}>{viewingTask.title}</h2>
                <button onClick={() => setShowViewModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
              </div>
              <p style={{ color: '#94a3b8', lineHeight: '1.6', fontSize: '14px', marginBottom: '20px' }}>{viewingTask.description || 'No description'}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {[
                  { label: 'Priority', value: viewingTask.priority, color: PRIORITY_COLORS[viewingTask.priority] },
                  { label: 'Status', value: COLUMNS.find(c => c.id === viewingTask.status)?.title || viewingTask.status },
                  { label: 'Assignee', value: viewingTask.assignee || 'Unassigned' },
                  { label: 'Due', value: viewingTask.dueDate || 'No due date' },
                ].map((item, i) => (
                  <div key={i} style={{ padding: '12px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{item.label}</div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: item.color || '#e2e8f0', textTransform: 'capitalize' }}>{item.value}</div>
                  </div>
                ))}
              </div>
              {/* Subtasks with toggleable checkboxes */}
              {viewingTask.subtasks && viewingTask.subtasks.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ margin: '0 0 12px', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}><ListChecks size={18} /> Subtasks</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {viewingTask.subtasks.map((sub, si) => (
                      <label key={si} onClick={() => toggleSubtask(viewingTask.id, si)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'background 0.15s' }}>
                        <div style={{ width: '20px', height: '20px', borderRadius: '6px', border: sub.done ? 'none' : '2px solid rgba(255,255,255,0.2)', background: sub.done ? '#10b981' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                          {sub.done && <span style={{ color: '#fff', fontSize: '12px' }}>✓</span>}
                        </div>
                        <span style={{ fontSize: '14px', textDecoration: sub.done ? 'line-through' : 'none', color: sub.done ? '#64748b' : '#e2e8f0' }}>{sub.text}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {viewingTask.tags && viewingTask.tags.length > 0 && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {viewingTask.tags.map((tag, i) => (
                    <span key={i} style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '8px', background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>{tag}</span>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tasks;