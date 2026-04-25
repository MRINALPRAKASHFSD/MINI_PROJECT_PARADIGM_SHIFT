import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import {
  CheckSquare, Plus, Filter, Calendar, Clock, User, Flag, Search, MoreVertical, Edit, Trash2, Eye, X, Save, ArrowRight, ChevronDown, ListChecks
} from 'lucide-react';
import './Tasks.css';

const COLUMNS = [
  { id: 'todo', title: 'To Do', color: '#4f46e5', icon: '📋' },
  { id: 'inProgress', title: 'In Progress', color: '#8b5cf6', icon: '⚡' },
  { id: 'review', title: 'Review', color: '#0ea5e9', icon: '👀' },
  { id: 'completed', title: 'Completed', color: '#10b981', icon: '✅' }
];
const PRIORITY_COLORS = { high: '#f43f5e', medium: '#f59e0b', low: '#10b981' };
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

  const stats = [
    { label: 'Total Tasks', value: tasks.length, color: 'var(--primary)', icon: CheckSquare },
    { label: 'Working On', value: tasks.filter(t => t.status === 'inProgress').length, color: 'var(--secondary)', icon: Clock },
    { label: 'In Review', value: tasks.filter(t => t.status === 'review').length, color: '#0ea5e9', icon: Eye },
    { label: 'Finalized', value: tasks.filter(t => t.status === 'completed').length, color: '#10b981', icon: Save },
  ];

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

  const dueLabel = (dueDate) => {
    if (!dueDate) return null;
    const d = Math.ceil((new Date(dueDate) - new Date()) / 86400000);
    if (d < 0) return { text: `${Math.abs(d)}d overdue`, color: '#f43f5e' };
    if (d === 0) return { text: 'Due today', color: '#f59e0b' };
    if (d <= 2) return { text: `${d}d left`, color: '#f59e0b' };
    return { text: `${d}d left`, color: '#10b981' };
  };

  const inputStyle = { width: '100%', padding: '14px 18px', borderRadius: '16px', border: '1px solid var(--btn-ghost-border)', background: 'var(--btn-ghost-bg)', color: 'var(--text-primary)', fontSize: '15px', outline: 'none', transition: 'all 0.3s' };

  return (
    <div style={{ padding: '24px', minHeight: '100vh' }}>
      {/* Dynamic Background Accents */}
      <div style={{ position: 'fixed', top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--primary-glow)', filter: 'blur(100px)', zIndex: -1, opacity: 0.5 }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '10%', width: '400px', height: '400px', background: 'var(--secondary-glow)', filter: 'blur(120px)', zIndex: -1, opacity: 0.3 }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '800', letterSpacing: '-0.8px', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Project Workspace</h1>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500' }}>Manage tasks and collaborate in real-time</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, translateY: -2 }} whileTap={{ scale: 0.95 }}
          onClick={() => openAddModal('todo')}
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', border: 'none', borderRadius: '16px', padding: '14px 28px', color: '#fff', fontSize: '15px', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px var(--primary-glow)' }}>
          <Plus size={20} /> Create Task
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {stats.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="stat-card-smooth" style={{ background: 'var(--surface-panel)', border: '1px solid var(--border-glass)', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{s.label}</div>
                <div style={{ fontSize: '32px', fontWeight: '800' }}>{s.value}</div>
              </div>
              <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: `linear-gradient(135deg, ${s.color}20, ${s.color}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>
                <s.icon size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: '300px', position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: '18px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input placeholder="Search projects or task names..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            style={{ ...inputStyle, paddingLeft: '54px', height: '56px', fontSize: '16px', background: 'rgba(255,255,255,0.02)' }} />
        </div>
        <div style={{ display: 'flex', gap: '8px', padding: '6px', background: 'rgba(255,255,255,0.03)', borderRadius: '18px', border: '1px solid var(--border-glass)' }}>
          {['all', 'mine', 'high'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: '10px 24px', borderRadius: '14px', border: 'none', fontSize: '14px', fontWeight: '700', cursor: 'pointer', background: filter === f ? 'var(--primary)' : 'transparent', color: filter === f ? '#fff' : 'var(--text-secondary)', transition: 'all 0.3s' }}>
              {f === 'all' ? 'Everything' : f === 'mine' ? 'My Tasks' : 'Critical'}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {COLUMNS.map(col => {
          const colTasks = columnTasks(col.id);
          return (
            <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>{col.icon}</span>
                  <span style={{ fontWeight: '800', fontSize: '17px', letterSpacing: '-0.3px' }}>{col.title}</span>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#fff', background: `${col.color}40`, padding: '2px 10px', borderRadius: '10px', border: `1px solid ${col.color}60` }}>{colTasks.length}</span>
                </div>
                <button onClick={() => openAddModal(col.id)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={18} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minHeight: '300px' }}>
                {colTasks.map(task => {
                  const due = dueLabel(task.dueDate);
                  const subsDone = (task.subtasks || []).filter(s => s.done).length;
                  const subsTotal = (task.subtasks || []).length;
                  return (
                    <motion.div key={task.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ translateY: -4, background: 'rgba(255,255,255,0.06)' }}
                      style={{ background: 'var(--surface-panel)', borderRadius: '22px', padding: '24px', border: '1px solid var(--border-glass)', cursor: 'pointer', position: 'relative', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                        <span style={{ fontSize: '10px', fontWeight: '900', padding: '4px 12px', borderRadius: '8px', background: `${PRIORITY_COLORS[task.priority]}15`, color: PRIORITY_COLORS[task.priority], textTransform: 'uppercase', letterSpacing: '1px', border: `1px solid ${PRIORITY_COLORS[task.priority]}30` }}>
                          {task.priority}
                        </span>
                        <div style={{ position: 'relative' }}>
                          <button onClick={e => { e.stopPropagation(); setOpenMenuId(openMenuId === task.id ? null : task.id); }}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '6px', borderRadius: '8px' }}>
                            <MoreVertical size={18} />
                          </button>
                          {openMenuId === task.id && (
                            <div style={{ position: 'absolute', right: 0, top: '100%', background: '#161725', border: '1px solid var(--border-glass)', borderRadius: '18px', padding: '10px', minWidth: '200px', zIndex: 50, backdropFilter: 'blur(30px)', boxShadow: '0 20px 50px rgba(0,0,0,0.8)' }}>
                              {[
                                { label: '👁 View Full Details', action: () => { setViewingTask(task); setShowViewModal(true); setOpenMenuId(null); }},
                                { label: '✏️ Edit Description', action: () => openEditModal(task) },
                                ...COLUMNS.filter(c => c.id !== col.id).map(c => ({ label: `➡️ Move to ${c.title}`, action: () => { moveTask(task.id, c.id); setOpenMenuId(null); }})),
                                { label: '🗑 Delete Task', action: () => handleDelete(task.id), danger: true },
                              ].map((item, idx) => (
                                <button key={idx} onClick={item.action}
                                  style={{ display: 'block', width: '100%', padding: '12px 14px', border: 'none', background: 'none', color: item.danger ? '#f43f5e' : '#fff', fontSize: '14px', fontWeight: '600', textAlign: 'left', cursor: 'pointer', borderRadius: '12px', transition: 'background 0.2s' }}
                                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                  onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '700', lineHeight: '1.4', color: '#fff' }}>{task.title}</h3>
                      {task.description && <p style={{ margin: '0 0 20px', fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.6', fontWeight: '500' }}>{task.description.slice(0, 80)}{task.description.length > 80 ? '...' : ''}</p>}

                      {subsTotal > 0 && (
                        <div style={{ marginBottom: '20px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: '700' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ListChecks size={14} /> {subsDone}/{subsTotal} Checklist</span>
                            <span style={{ color: col.color }}>{Math.round((subsDone/subsTotal)*100)}%</span>
                          </div>
                          <div style={{ height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
                            <motion.div initial={{ width: 0 }} animate={{ width: `${(subsDone / subsTotal) * 100}%` }} style={{ height: '100%', borderRadius: '4px', background: `linear-gradient(to right, ${col.color}, var(--secondary))` }} />
                          </div>
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '20px' }}>
                        {task.tags && task.tags.slice(0, 3).map((tag, ti) => (
                          <span key={ti} style={{ fontSize: '11px', padding: '5px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)', fontWeight: '700', border: '1px solid var(--border-glass)' }}>#{tag}</span>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '16px', borderTop: '1px solid var(--border-glass)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '10px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: '#fff', fontWeight: '900', boxShadow: '0 4px 10px var(--primary-glow)' }}>
                            {(task.assignee || 'RK').split(' ').map(w => w[0]).join('')}
                          </div>
                          <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: '700' }}>{task.assignee?.split(' ')[0]}</span>
                        </div>
                        {due && <span style={{ fontSize: '12px', fontWeight: '800', color: due.color, display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={14} /> {due.text}</span>}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modern Modal Templates would follow same pattern with glass-panel utility */}
    </div>
  );
};

export default Tasks;