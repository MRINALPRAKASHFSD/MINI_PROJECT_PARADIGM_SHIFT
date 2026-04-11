import React, { useState } from 'react';
import { Target, ArrowRight, Plus, X, Bell, Calendar as CalIcon } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import './Widgets.css';

const PriorityTasksWidget = () => {
  const { tasks, addTask } = useDataStore();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({ title: '', priority: 'medium', dueDate: '', reminderDate: '' });

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    await addTask(formData);
    setFormData({ title: '', priority: 'medium', dueDate: '', reminderDate: '' });
    setIsAdding(false);
  };

  // Filter pending/in-progress and get top 3
  const activeTasks = tasks
    .filter(t => t.status === 'pending' || t.status === 'todo' || t.status === 'in-progress')
    .sort((a, b) => new Date(a.dueDate || Infinity) - new Date(b.dueDate || Infinity))
    .slice(0, 3);

  return (
    <div className="workspace-widget tasks-widget">
      <div className="widget-header">
        <h3><Target size={16} /> Priority Pipeline</h3>
        <div className="header-actions">
          <button className="icon-btn small-btn" onClick={() => setIsAdding(!isAdding)}>
            {isAdding ? <X size={14} /> : <Plus size={14} />}
          </button>
          <button className="text-btn" onClick={() => navigate('/tasks')}>All</button>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            className="inline-task-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleCreate}
          >
            <input 
              type="text" 
              placeholder="Task name..." 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              autoFocus
            />
            <div className="form-row">
              <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <div className="input-with-icon">
                <CalIcon size={12} />
                <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
              </div>
              <div className="input-with-icon">
                <Bell size={12} />
                <input type="datetime-local" value={formData.reminderDate} onChange={e => setFormData({...formData, reminderDate: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="glass-btn submit-small">Add Task</button>
          </motion.form>
        )}
      </AnimatePresence>
      <div className="widget-content list-content">
        {activeTasks.length === 0 ? (
          <p className="empty-state">No pending tasks. You're all caught up!</p>
        ) : (
          activeTasks.map(task => (
            <div key={task.id} className="list-item task-item" onClick={() => navigate('/tasks')}>
              <div className="task-info">
                <span className="task-title">{task.title}</span>
                <span className={`task-badge ${task.priority || 'medium'}`}>{task.priority || 'medium'}</span>
              </div>
              <ArrowRight size={14} className="task-arrow" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PriorityTasksWidget;
