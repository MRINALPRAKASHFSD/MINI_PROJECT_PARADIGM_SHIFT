import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  UserPlus, 
  Search, 
  Mail, 
  MessageCircle,
  Phone,
  MoreVertical,
  Crown,
  Shield,
  Star,
  Video,
  Calendar,
  Briefcase
} from 'lucide-react';
import './Teams.css';

const Teams = () => {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const teams = [
    {
      id: 1,
      name: 'Frontend Development',
      description: 'Building amazing user interfaces',
      members: 8,
      color: '#3b82f6',
      icon:  '💻',
      lead: 'Sarah Johnson',
      projects: 5,
      tasks: { completed: 45, total: 60 }
    },
    {
      id: 2,
      name: 'Backend Development',
      description: 'Powering the core systems',
      members: 6,
      color: '#10b981',
      icon: '⚙️',
      lead:  'Michael Chen',
      projects: 4,
      tasks: { completed:  38, total: 50 }
    },
    {
      id: 3,
      name: 'UI/UX Design',
      description: 'Crafting beautiful experiences',
      members: 5,
      color: '#a855f7',
      icon: '🎨',
      lead:  'Emily Davis',
      projects: 6,
      tasks: { completed:  52, total: 65 }
    },
    {
      id: 4,
      name: 'DevOps',
      description: 'Infrastructure and deployment',
      members: 4,
      color: '#f97316',
      icon: '🚀',
      lead: 'David Wilson',
      projects:  3,
      tasks: { completed: 28, total: 40 }
    },
    {
      id: 5,
      name:  'QA Testing',
      description: 'Ensuring quality and reliability',
      members: 5,
      color: '#ec4899',
      icon: '🔍',
      lead:  'Lisa Anderson',
      projects: 7,
      tasks: { completed: 65, total: 80 }
    },
    {
      id: 6,
      name: 'Product Management',
      description: 'Strategy and roadmap planning',
      members: 4,
      color: '#eab308',
      icon: '📊',
      lead: 'James Martinez',
      projects: 8,
      tasks: { completed:  72, total: 90 }
    }
  ];

  const teamMembers = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Team Lead',
      avatar: 'SJ',
      status: 'online',
      email: 'sarah.j@company.com',
      phone: '+1 234 567 8901',
      skills: ['React', 'TypeScript', 'Node.js'],
      tasksCompleted: 45,
      rating: 4.9
    },
    {
      id: 2,
      name:  'John Smith',
      role: 'Senior Developer',
      avatar: 'JS',
      status: 'online',
      email: 'john.s@company.com',
      phone: '+1 234 567 8902',
      skills: ['Vue.js', 'Python', 'AWS'],
      tasksCompleted:  38,
      rating: 4.7
    },
    {
      id: 3,
      name: 'Emma Wilson',
      role: 'Developer',
      avatar: 'EW',
      status: 'away',
      email: 'emma.w@company.com',
      phone: '+1 234 567 8903',
      skills: ['Angular', 'Java', 'Docker'],
      tasksCompleted:  32,
      rating: 4.6
    },
    {
      id: 4,
      name: 'Michael Brown',
      role: 'Junior Developer',
      avatar: 'MB',
      status: 'offline',
      email: 'michael.b@company.com',
      phone: '+1 234 567 8904',
      skills: ['JavaScript', 'MongoDB', 'Git'],
      tasksCompleted:  28,
      rating: 4.5
    },
    {
      id: 5,
      name: 'Olivia Davis',
      role:  'Developer',
      avatar: 'OD',
      status: 'online',
      email: 'olivia.d@company.com',
      phone: '+1 234 567 8905',
      skills: ['React', 'GraphQL', 'PostgreSQL'],
      tasksCompleted: 35,
      rating: 4.8
    }
  ];

  return (
    <div className="teams-container dark">
      <div className="teams-header">
        <div className="header-left">
          <motion.div 
            className="header-icon"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Users size={28} />
          </motion.div>
          <div>
            <h1>Teams</h1>
            <p>Collaborate with your team members</p>
          </div>
        </div>
        <motion.button 
          className="btn-primary"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <UserPlus size={20} />
          Create Team
        </motion.button>
      </div>

      <div className="search-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search teams or members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target. value)}
          />
        </div>
      </div>

      <div className="teams-grid">
        {teams.map((team, index) => (
          <motion.div
            key={team. id}
            className="team-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => setSelectedTeam(team)}
            style={{ borderColor: team.color }}
          >
            <div className="team-card-header">
              <div 
                className="team-icon" 
                style={{ background: `${team.color}20`, color: team.color }}
              >
                <span>{team.icon}</span>
              </div>
              <button className="team-menu-btn">
                <MoreVertical size={18} />
              </button>
            </div>
            
            <h3>{team.name}</h3>
            <p className="team-description">{team.description}</p>

            <div className="team-stats">
              <div className="stat-item">
                <Users size={16} />
                <span>{team.members} members</span>
              </div>
              <div className="stat-item">
                <Briefcase size={16} />
                <span>{team.projects} projects</span>
              </div>
            </div>

            <div className="team-progress">
              <div className="progress-info">
                <span>Progress</span>
                <span>{Math.round((team.tasks.completed / team.tasks.total) * 100)}%</span>
              </div>
              <div className="progress-bar">
                <motion.div
                  className="progress-fill"
                  style={{ backgroundColor: team.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${(team.tasks.completed / team.tasks.total) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
              <p className="progress-text">
                {team.tasks.completed} of {team.tasks.total} tasks completed
              </p>
            </div>

            <div className="team-lead">
              <Crown size={16} />
              <span>Led by {team.lead}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="team-members-section">
        <h2>
          <Users size={24} />
          Team Members
        </h2>
        <div className="members-grid">
          {teamMembers. map((member, index) => (
            <motion.div
              key={member. id}
              className="member-card"
              initial={{ opacity:  0, scale: 0.9 }}
              animate={{ opacity:  1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="member-header">
                <div className="member-avatar-wrapper">
                  <div className="member-avatar">
                    {member.avatar}
                  </div>
                  <span className={`status-indicator ${member.status}`}></span>
                </div>
                <button className="member-menu-btn">
                  <MoreVertical size={16} />
                </button>
              </div>

              <h4>{member.name}</h4>
              <p className="member-role">{member.role}</p>

              <div className="member-rating">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill={i < Math.floor(member.rating) ? '#fbbf24' : 'none'}
                    color="#fbbf24"
                  />
                ))}
                <span>{member.rating}</span>
              </div>

              <div className="member-skills">
                {member.skills. slice(0, 3).map((skill, i) => (
                  <span key={i} className="skill-badge">{skill}</span>
                ))}
              </div>

              <div className="member-stat">
                <span className="stat-label">Tasks Completed</span>
                <span className="stat-value">{member.tasksCompleted}</span>
              </div>

              <div className="member-actions">
                <motion.button 
                  className="action-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <MessageCircle size={18} />
                </motion.button>
                <motion.button 
                  className="action-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Mail size={18} />
                </motion.button>
                <motion.button 
                  className="action-btn"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Video size={18} />
                </motion.button>
              </div>
            </motion. div>
          ))}
        </div>
      </div>

      {/* Team Detail Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <motion. div
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTeam(null)}
          >
            <motion.div
              className="modal-content"
              initial={{ scale:  0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale:  0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header" style={{ borderColor: selectedTeam.color }}>
                <div className="modal-icon" style={{ background: `${selectedTeam.color}20`, color: selectedTeam.color }}>
                  <span>{selectedTeam.icon}</span>
                </div>
                <div>
                  <h2>{selectedTeam.name}</h2>
                  <p>{selectedTeam.description}</p>
                </div>
                <button className="modal-close" onClick={() => setSelectedTeam(null)}>×</button>
              </div>
              <div className="modal-body">
                <div className="detail-grid">
                  <div className="detail-item">
                    <Users size={20} />
                    <span>{selectedTeam.members} Members</span>
                  </div>
                  <div className="detail-item">
                    <Briefcase size={20} />
                    <span>{selectedTeam.projects} Projects</span>
                  </div>
                  <div className="detail-item">
                    <Crown size={20} />
                    <span>{selectedTeam.lead}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={20} />
                    <span>Active since 2024</span>
                  </div>
                </div>
              </div>
            </motion. div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teams;