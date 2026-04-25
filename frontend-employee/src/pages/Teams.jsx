import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Plus, Mail, Phone, MapPin, Briefcase, Star, Award, X, MessageSquare, Calendar, Edit, ChevronRight, ArrowRight } from 'lucide-react';
import './Teams.css';

const INITIAL_TEAMS = [
  { id: 1, name: 'Frontend Development', description: 'Building high-fidelity interfaces', icon: '💻', color: '#4f46e5', lead: 'Priya Sharma', members: 8, projects: 5, progress: 75, completedTasks: 45, totalTasks: 60 },
  { id: 2, name: 'Backend Systems', description: 'Architecting core services', icon: '⚙️', color: '#8b5cf6', lead: 'Vikram Patel', members: 6, projects: 4, progress: 76, completedTasks: 38, totalTasks: 50 },
  { id: 3, name: 'Design Language', description: 'Defining the visual soul', icon: '🎨', color: '#ec4899', lead: 'Deepika Nair', members: 5, projects: 6, progress: 80, completedTasks: 52, totalTasks: 65 },
  { id: 4, name: 'Cloud Operations', description: 'Infrastructure at scale', icon: '🚀', color: '#0ea5e9', lead: 'Amit Joshi', members: 4, projects: 3, progress: 82, completedTasks: 28, totalTasks: 34 },
];

const ALL_MEMBERS = [
  { id: 1, name: 'Rajesh Kumar', role: 'Senior Developer', email: 'rajesh.kumar@techsolutions.in', phone: '+91 98765 43210', location: 'Mumbai', team: 'Frontend Development', status: 'online', rating: 4.9, skills: ['React', 'Node.js', 'TypeScript'] },
  { id: 2, name: 'Priya Sharma', role: 'Lead Frontend Dev', email: 'priya.sharma@techsolutions.in', phone: '+91 99887 76655', location: 'Bengaluru', team: 'Frontend Development', status: 'online', rating: 4.8, skills: ['React', 'Vue.js', 'CSS'] },
  { id: 3, name: 'Vikram Patel', role: 'Lead Backend Dev', email: 'vikram.patel@techsolutions.in', phone: '+91 97654 32100', location: 'Ahmedabad', team: 'Backend Systems', status: 'online', rating: 4.7, skills: ['Python', 'Django', 'PostgreSQL'] },
  { id: 4, name: 'Ananya Gupta', role: 'Full Stack Developer', email: 'ananya.gupta@techsolutions.in', phone: '+91 96543 21000', location: 'Delhi', team: 'Backend Systems', status: 'away', rating: 4.6, skills: ['Java', 'Spring Boot', 'MongoDB'] },
  { id: 7, name: 'Deepika Nair', role: 'Lead UI/UX Designer', email: 'deepika.nair@techsolutions.in', phone: '+91 93210 98765', location: 'Kochi', team: 'Design Language', status: 'online', rating: 4.9, skills: ['Figma', 'Adobe XD', 'Sketch'] },
  { id: 8, name: 'Amit Joshi', role: 'DevOps Engineer', email: 'amit.joshi@techsolutions.in', phone: '+91 92109 87654', location: 'Pune', team: 'Cloud Operations', status: 'online', rating: 4.7, skills: ['Docker', 'Kubernetes', 'AWS'] },
];

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [teams, setTeams] = useState(INITIAL_TEAMS);

  const statusColors = { online: '#10b981', away: '#f59e0b', offline: '#64748b' };

  const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.lead.toLowerCase().includes(searchQuery.toLowerCase()));
  const teamMembers = selectedTeam ? ALL_MEMBERS.filter(m => m.team === selectedTeam.name) : [];

  const handleCreateTeam = () => {
    if (!newTeam.name.trim()) return;
    const team = { id: Date.now(), name: newTeam.name, description: newTeam.description || 'New team', icon: '🆕', color: 'var(--primary)', lead: 'Unassigned', members: 0, projects: 0, progress: 0, completedTasks: 0, totalTasks: 0 };
    setTeams(prev => [...prev, team]);
    setShowCreateModal(false);
    setNewTeam({ name: '', description: '' });
  };

  const inputStyle = { width: '100%', padding: '16px 20px', borderRadius: '18px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)', color: 'var(--text-primary)', fontSize: '16px', outline: 'none', transition: 'all 0.3s' };

  return (
    <div className="teams-page">
      {/* Background Ambient Glows */}
      <div className="ambient-glow" style={{ top: '10%', right: '5%', background: 'var(--primary-glow)', width: '400px', height: '400px' }} />
      <div className="ambient-glow" style={{ bottom: '20%', left: '10%', background: 'var(--secondary-glow)', width: '300px', height: '300px' }} />

      <div className="page-header">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="hero-title">Team Ecosystem</h1>
          <p className="hero-subtitle">Sync with your colleagues and project units</p>
        </motion.div>
        <motion.button 
          className="btn-primary-vibrant"
          whileHover={{ scale: 1.05, translateY: -2 }} whileTap={{ scale: 0.95 }} 
          onClick={() => setShowCreateModal(true)}
        >
          <Plus size={20} /> Build New Team
        </motion.button>
      </div>

      <div className="search-container glass-panel">
        <Search size={22} className="search-icon" />
        <input type="text" placeholder="Search departments, leads, or experts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="search-input" />
      </div>

      <div className="teams-grid">
        {filteredTeams.map((team, i) => (
          <motion.div key={team.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            whileHover={{ translateY: -8, background: 'rgba(255,255,255,0.04)' }} onClick={() => setSelectedTeam(team)}
            className="team-card glass-panel"
          >
            <div className="team-accent" style={{ background: `linear-gradient(135deg, ${team.color}40, transparent)` }} />

            <div className="team-card-header">
              <div className="team-icon-box" style={{ background: `${team.color}15`, border: `1px solid ${team.color}30` }}>{team.icon}</div>
              <span className="team-tag" style={{ color: team.color, background: `${team.color}10` }}>{team.members} Members</span>
            </div>

            <h3 className="team-title">{team.name}</h3>
            <p className="team-desc">{team.description}</p>
            
            <div className="team-stats-mini">
              <div className="mini-stat">
                <Briefcase size={14} />
                <span>{team.projects} Units</span>
              </div>
              <div className="mini-stat">
                <Users size={14} />
                <span>Lead: {team.lead.split(' ')[0]}</span>
              </div>
            </div>

            <div className="team-progress-area">
              <div className="progress-header">
                <span>Phase Completion</span>
                <span style={{ color: team.color }}>{team.progress}%</span>
              </div>
              <div className="progress-bar-container">
                <motion.div initial={{ width: 0 }} animate={{ width: `${team.progress}%` }} className="progress-bar-fill" style={{ background: team.color }} />
              </div>
            </div>

            <div className="team-card-footer">
              <span>View Structure</span>
              <ArrowRight size={16} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Team Detail Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTeam(null)}>
            <motion.div className="modal-content glass-panel larger" initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="header-info">
                  <div className="header-icon">{selectedTeam.icon}</div>
                  <div>
                    <h2 style={{ color: selectedTeam.color }}>{selectedTeam.name}</h2>
                    <p>{selectedTeam.description}</p>
                  </div>
                </div>
                <button className="btn-close" onClick={() => setSelectedTeam(null)}><X size={24} /></button>
              </div>

              <div className="modal-stats">
                {[
                  { label: 'Contributors', value: selectedTeam.members, color: selectedTeam.color },
                  { label: 'Active Projects', value: selectedTeam.projects, color: 'var(--primary)' },
                  { label: 'Overall Vibe', value: `${selectedTeam.progress}%`, color: 'var(--secondary)' },
                ].map((stat, i) => (
                  <div key={i} className="stat-pill glass-panel">
                    <span className="stat-pill-val" style={{ color: stat.color }}>{stat.value}</span>
                    <span className="stat-pill-label">{stat.label}</span>
                  </div>
                ))}
              </div>

              <h3 className="sub-section-title">Core Members</h3>
              <div className="member-list">
                {teamMembers.map(member => (
                  <motion.div key={member.id} whileHover={{ x: 8, background: 'rgba(255,255,255,0.03)' }} onClick={() => setSelectedMember(member)} className="member-row glass-panel">
                    <div className="member-row-main">
                      <div className="member-row-avatar" style={{ background: `linear-gradient(135deg, ${selectedTeam.color}, ${selectedTeam.color}aa)` }}>
                        {member.name.split(' ').map(w => w[0]).join('')}
                      </div>
                      <div className="member-row-info">
                        <span className="m-name">{member.name}</span>
                        <span className="m-role">{member.role}</span>
                      </div>
                    </div>
                    <div className="member-row-status">
                      <div className="status-indicator" style={{ background: statusColors[member.status] }} />
                      <span>{member.status}</span>
                      <ChevronRight size={18} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member Profile Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div className="modal-backdrop profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMember(null)}>
            <motion.div className="modal-content glass-panel profile-card" initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
              <button className="btn-close-abs" onClick={() => setSelectedMember(null)}><X size={20} /></button>
              
              <div className="profile-hero">
                <div className="profile-avatar-large">
                  {selectedMember.name.split(' ').map(w => w[0]).join('')}
                  <div className="profile-status-glow" style={{ background: statusColors[selectedMember.status] }} />
                </div>
                <h2 className="profile-name">{selectedMember.name}</h2>
                <p className="profile-role">{selectedMember.role}</p>
                <div className="profile-rating">
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  <span>{selectedMember.rating} Expert Rating</span>
                </div>
              </div>

              <div className="profile-details">
                {[
                  { icon: Mail, label: selectedMember.email },
                  { icon: Phone, label: selectedMember.phone },
                  { icon: MapPin, label: selectedMember.location },
                  { icon: Briefcase, label: selectedMember.team },
                ].map((item, i) => (
                  <div key={i} className="detail-item glass-panel">
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="profile-skills">
                <h4>Primary Expertise</h4>
                <div className="skill-tags">
                  {selectedMember.skills.map((skill, i) => <span key={i} className="skill-tag">{skill}</span>)}
                </div>
              </div>

              <motion.button className="btn-vibrant-full" whileHover={{ scale: 1.02, translateY: -2 }} whileTap={{ scale: 0.98 }}>
                <MessageSquare size={18} /> Start Conversation
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Team Form Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)}>
            <motion.div className="modal-content glass-panel form-card" initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header-simple">
                <h2>Initiate New Team</h2>
                <button className="btn-close" onClick={() => setShowCreateModal(false)}><X size={24} /></button>
              </div>
              <div className="form-body">
                <div className="form-group">
                  <label>Department Name</label>
                  <input value={newTeam.name} onChange={e => setNewTeam({ ...newTeam, name: e.target.value })} placeholder="e.g. Systems Architecture" />
                </div>
                <div className="form-group">
                  <label>Team Vision</label>
                  <textarea value={newTeam.description} onChange={e => setNewTeam({ ...newTeam, description: e.target.value })} placeholder="Briefly describe the team's mission..." rows="4" />
                </div>
              </div>
              <div className="form-footer">
                <button className="btn-ghost" onClick={() => setShowCreateModal(false)}>Cancel</button>
                <button className="btn-vibrant-action" onClick={handleCreateTeam}>Create Department</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teams;