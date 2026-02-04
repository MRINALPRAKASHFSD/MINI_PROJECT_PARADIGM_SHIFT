import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckSquare, 
  Plus, 
  Filter, 
  Calendar,
  Clock,
  User,
  Flag,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import './Tasks.css';

const Tasks = () => {
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const tasks = {
    todo: [
      {
        id: 1,
        title: 'Design new landing page',
        description: 'Create modern and responsive design',
        priority: 'high',
        dueDate: '2025-01-15',
        assignee: 'Sarah Johnson',
        avatar: 'SJ',
        category: 'Design',
        tags: ['UI/UX', 'Frontend']
      },
      {
        id: 2,
        title: 'Setup CI/CD pipeline',
        description:  'Configure automated deployment',
        priority: 'medium',
        dueDate: '2025-01-18',
        assignee: 'David Wilson',
        avatar: 'DW',
        category: 'DevOps',
        tags: ['Infrastructure', 'Automation']
      },
      {
        id: 3,
        title: 'Write API documentation',
        description: 'Document all REST endpoints',
        priority: 'low',
        dueDate:  '2025-01-20',
        assignee: 'Michael Chen',
        avatar: 'MC',
        category: 'Backend',
        tags: ['Documentation', 'API']
      }
    ],
    inProgress:  [
      {
        id:  4,
        title: 'Implement authentication',
        description: 'Add JWT-based auth system',
        priority:  'high',
        dueDate: '2025-01-12',
        assignee: 'John Smith',
        avatar: 'JS',
        category: 'Backend',
        tags: ['Security', 'Auth']
      },
      {
        id: 5,
        title: 'Optimize database queries',
        description: 'Improve query performance',
        priority: 'medium',
        dueDate: '2025-01-14',
        assignee: 'Emma Wilson',
        avatar: 'EW',
        category: 'Backend',
        tags: ['Database', 'Performance']
      }
    ],
    review: [
      {
        id: 6,
        title:  'Code review:  Payment module',
        description: 'Review payment integration code',
        priority: 'high',
        dueDate: '2025-01-10',
        assignee: 'Lisa Anderson',
        avatar: 'LA',
        category: 'QA',
        tags: ['Review', 'Payment']
      }
    ],
    completed: [
      {
        id: 7,
        title:  'Setup project structure',
        description: 'Initialize React project',
        priority: 'medium',
        dueDate: '2025-01-05',
        assignee: 'Sarah Johnson',
        avatar: 'SJ',
        category: 'Frontend',
        tags: ['Setup', 'React']
      },
      {
        id: 8,
        title: 'Database schema design',
        description: 'Design complete database schema',
        priority: 'high',
        dueDate: '2025-01-08',
        assignee: 'Michael Chen',
        avatar: 'MC',
        category: 'Backend',
        tags: ['Database', 'Design']
      }
    ]
  };

  const columns = [
    { id: 'todo', title: 'To Do', color: '#3b82f6', icon: '📋' },
    { id: 'inProgress', title:  'In Progress', color: '#eab308', icon: '⚡' },
    { id:  'review', title: 'Review', color: '#a855f7', icon: '👀' },
    { id: 'completed', title: 'Completed', color: '#10b981', icon: '✅' }
  ];

  const priorityColors = {
    high:  '#ef4444',
    medium:  '#f97316',
    low: '#10b981'
  };

  const stats = [
    { label: 'Total Tasks', value:  Object.values(tasks).flat().length, color: '#3b82f6' },
    { label: 'In Progress', value: tasks.inProgress.length, color: '#eab308' },
    { label: 'Completed', value: tasks.completed. length, color: '#10b981' },
    { label: 'Pending Review', value: tasks.review.length, color: '#a855f7' }
  ];

  return (
    <div className="tasks-container dark">
      <div className="tasks-header">
        <div className="header-left">
          <motion.div 
            className="header-icon"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <CheckSquare size={28} />
          </motion.div>
          <div>
            <h1>Tasks</h1>
            <p>Manage and track your tasks</p>
          </div>
        </div>
        <motion.button 
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus size={20} />
          New Task
        </motion.button>
      </div>

      {/* Stats */}
      <div className="tasks-stats">
        {stats. map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <CheckSquare size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </motion. div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="tasks-controls">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-buttons">
          <button className={filter === 'all' ? 'active' : ''} onClick={() => setFilter('all')}>
            All Tasks
          </button>
          <button className={filter === 'my' ? 'active' : ''} onClick={() => setFilter('my')}>
            My Tasks
          </button>
          <button className={filter === 'priority' ?  'active' : ''} onClick={() => setFilter('priority')}>
            High Priority
          </button>
        </div>
        <button className="filter-btn">
          <Filter size={20} />
          Filters
        </button>
      </div>

      {/* Kanban Board */}
      <div className="kanban-board">
        {columns.map((column, colIndex) => (
          <motion.div
            key={column.id}
            className="kanban-column"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay:  colIndex * 0.1 }}
          >
            <div className="column-header" style={{ borderColor: column.color }}>
              <div className="column-title">
                <span className="column-icon">{column.icon}</span>
                <h3>{column.title}</h3>
                <span className="task-count">{tasks[column.id].length}</span>
              </div>
              <button className="column-menu">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="column-body">
              {tasks[column. id].map((task, taskIndex) => (
                <motion.div
                  key={task.id}
                  className="task-card"
                  initial={{ opacity: 0, y:  20 }}
                  animate={{ opacity: 1, y:  0 }}
                  transition={{ delay: colIndex * 0.1 + taskIndex * 0.05 }}
                  whileHover={{ scale: 1.02, y: -3 }}
                  drag
                  dragConstraints={{ left: 0, right: 0, top: 0, bottom:  0 }}
                >
                  <div className="task-card-header">
                    <span 
                      className="priority-badge" 
                      style={{ backgroundColor:  `${priorityColors[task.priority]}20`, color: priorityColors[task. priority] }}
                    >
                      <Flag size={12} />
                      {task. priority}
                    </span>
                    <button className="task-menu">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <h4>{task.title}</h4>
                  <p className="task-description">{task.description}</p>

                  <div className="task-tags">
                    {task.tags.map((tag, i) => (
                      <span key={i} className="task-tag">{tag}</span>
                    ))}
                  </div>

                  <div className="task-footer">
                    <div className="task-meta">
                      <div className="meta-item">
                        <Calendar size={14} />
                        <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="task-assignee">
                      <div className="assignee-avatar">{task.avatar}</div>
                    </div>
                  </div>

                  <div className="task-actions">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Eye size={16} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale:  0.9 }}>
                      <Edit size={16} />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale:  0.9 }}>
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}

              <motion.button 
                className="add-task-btn"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus size={18} />
                Add Task
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;