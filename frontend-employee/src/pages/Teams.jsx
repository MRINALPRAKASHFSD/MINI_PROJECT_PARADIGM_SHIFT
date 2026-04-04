import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Plus, Mail, Phone, MapPin, Briefcase, Star, Award, X, MessageSquare, Calendar, Edit, ChevronRight } from 'lucide-react';
import './Teams.css';

const INITIAL_TEAMS = [
  { id: 1, name: 'Frontend Development', description: 'Building amazing user interfaces', icon: '💻', color: '#3b82f6', lead: 'Priya Sharma', members: 8, projects: 5, progress: 75, completedTasks: 45, totalTasks: 60 },
  { id: 2, name: 'Backend Development', description: 'Powering the core systems', icon: '⚙️', color: '#10b981', lead: 'Vikram Patel', members: 6, projects: 4, progress: 76, completedTasks: 38, totalTasks: 50 },
  { id: 3, name: 'UI/UX Design', description: 'Crafting beautiful experiences', icon: '🎨', color: '#ec4899', lead: 'Deepika Nair', members: 5, projects: 6, progress: 80, completedTasks: 52, totalTasks: 65 },
  { id: 4, name: 'DevOps', description: 'Infrastructure and deployment', icon: '🚀', color: '#f59e0b', lead: 'Amit Joshi', members: 4, projects: 3, progress: 82, completedTasks: 28, totalTasks: 34 },
  { id: 5, name: 'QA Testing', description: 'Ensuring quality and reliability', icon: '🔍', color: '#a855f7', lead: 'Sneha Iyer', members: 5, projects: 7, progress: 68, completedTasks: 34, totalTasks: 50 },
  { id: 6, name: 'Product Management', description: 'Strategy and roadmap planning', icon: '📊', color: '#06b6d4', lead: 'Arjun Reddy', members: 4, projects: 8, progress: 71, completedTasks: 30, totalTasks: 42 },
];

const ALL_MEMBERS = [
  { id: 1, name: 'Rajesh Kumar', role: 'Senior Developer', email: 'rajesh.kumar@techsolutions.in', phone: '+91 98765 43210', location: 'Mumbai', team: 'Frontend Development', status: 'online', rating: 4.9, skills: ['React', 'Node.js', 'TypeScript'] },
  { id: 2, name: 'Priya Sharma', role: 'Lead Frontend Dev', email: 'priya.sharma@techsolutions.in', phone: '+91 99887 76655', location: 'Bengaluru', team: 'Frontend Development', status: 'online', rating: 4.8, skills: ['React', 'Vue.js', 'CSS'] },
  { id: 3, name: 'Vikram Patel', role: 'Lead Backend Dev', email: 'vikram.patel@techsolutions.in', phone: '+91 97654 32100', location: 'Ahmedabad', team: 'Backend Development', status: 'online', rating: 4.7, skills: ['Python', 'Django', 'PostgreSQL'] },
  { id: 4, name: 'Ananya Gupta', role: 'Full Stack Developer', email: 'ananya.gupta@techsolutions.in', phone: '+91 96543 21000', location: 'Delhi', team: 'Backend Development', status: 'away', rating: 4.6, skills: ['Java', 'Spring Boot', 'MongoDB'] },
  { id: 5, name: 'Sneha Iyer', role: 'QA Lead', email: 'sneha.iyer@techsolutions.in', phone: '+91 95432 10009', location: 'Chennai', team: 'QA Testing', status: 'online', rating: 4.8, skills: ['Selenium', 'Jest', 'Cypress'] },
  { id: 6, name: 'Arjun Reddy', role: 'Product Manager', email: 'arjun.reddy@techsolutions.in', phone: '+91 94321 09876', location: 'Hyderabad', team: 'Product Management', status: 'offline', rating: 4.5, skills: ['Jira', 'Analytics', 'Strategy'] },
  { id: 7, name: 'Deepika Nair', role: 'Lead UI/UX Designer', email: 'deepika.nair@techsolutions.in', phone: '+91 93210 98765', location: 'Kochi', team: 'UI/UX Design', status: 'online', rating: 4.9, skills: ['Figma', 'Adobe XD', 'Sketch'] },
  { id: 8, name: 'Amit Joshi', role: 'DevOps Engineer', email: 'amit.joshi@techsolutions.in', phone: '+91 92109 87654', location: 'Pune', team: 'DevOps', status: 'online', rating: 4.7, skills: ['Docker', 'Kubernetes', 'AWS'] },
  { id: 9, name: 'Kavita Deshmukh', role: 'Frontend Developer', email: 'kavita.deshmukh@techsolutions.in', phone: '+91 91098 76543', location: 'Nagpur', team: 'Frontend Development', status: 'away', rating: 4.4, skills: ['React', 'Tailwind', 'Redux'] },
  { id: 10, name: 'Rohit Saxena', role: 'Backend Developer', email: 'rohit.saxena@techsolutions.in', phone: '+91 90987 65432', location: 'Jaipur', team: 'Backend Development', status: 'online', rating: 4.6, skills: ['Node.js', 'Express', 'Redis'] },
];

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTeam, setNewTeam] = useState({ name: '', description: '' });
  const [teams, setTeams] = useState(INITIAL_TEAMS);

  const statusColors = { online: '#10b981', away: '#eab308', offline: '#6b7280' };

  const filteredTeams = teams.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()) || t.lead.toLowerCase().includes(searchQuery.toLowerCase()));
  const teamMembers = selectedTeam ? ALL_MEMBERS.filter(m => m.team === selectedTeam.name) : [];

  const handleCreateTeam = () => {
    if (!newTeam.name.trim()) return;
    const team = { id: Date.now(), name: newTeam.name, description: newTeam.description || 'New team', icon: '🆕', color: `hsl(${Math.random() * 360}, 70%, 55%)`, lead: 'Unassigned', members: 0, projects: 0, progress: 0, completedTasks: 0, totalTasks: 0 };
    setTeams(prev => [...prev, team]);
    setShowCreateModal(false);
    setNewTeam({ name: '', description: '' });
  };

  const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid var(--btn-ghost-border)', background: 'var(--btn-ghost-bg)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };

  return (
    <div className="teams-container dark">
      <div className="teams-header">
        <div className="header-left">
          <motion.div className="header-icon" whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}><Users size={28} /></motion.div>
          <div><h1>Teams</h1><p>Collaborate with your team members</p></div>
        </div>
        <motion.button className="btn-primary" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowCreateModal(true)}><Plus size={20} /> Create Team</motion.button>
      </div>

      <div className="search-bar"><Search size={20} /><input type="text" placeholder="Search teams or members..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>

      <div className="teams-grid">
        {filteredTeams.map((team, i) => (
          <motion.div key={team.id} className="team-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            whileHover={{ y: -5, scale: 1.02 }} style={{ borderColor: `${team.color}40` }} onClick={() => setSelectedTeam(team)}>
            <div className="team-card-header">
              <div className="team-icon" style={{ backgroundColor: `${team.color}20` }}>{team.icon}</div>
              <button className="team-menu" onClick={e => e.stopPropagation()} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>⋮</button>
            </div>
            <h3 style={{ color: team.color }}>{team.name}</h3>
            <p className="team-description">{team.description}</p>
            <div className="team-stats">
              <span><Users size={14} /> {team.members} members</span>
              <span><Briefcase size={14} /> {team.projects} projects</span>
            </div>
            <div className="team-progress">
              <div className="progress-header"><span>Progress</span><span>{team.progress}%</span></div>
              <div className="progress-bar-bg"><motion.div className="progress-bar-fill" style={{ backgroundColor: team.color }} initial={{ width: 0 }} animate={{ width: `${team.progress}%` }} transition={{ duration: 1, delay: i * 0.1 }} /></div>
              <span className="progress-tasks">{team.completedTasks} of {team.totalTasks} tasks completed</span>
            </div>
            <div className="team-lead"><Award size={16} /> Led by {team.lead}</div>
          </motion.div>
        ))}
      </div>

      {/* Team Detail Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTeam(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)', padding: '20px' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface-panel)', border: '1px solid var(--btn-ghost-border)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '640px', color: 'var(--text-primary)', maxHeight: '80vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '36px' }}>{selectedTeam.icon}</span>
                  <div><h2 style={{ margin: 0, color: selectedTeam.color }}>{selectedTeam.name}</h2><p style={{ margin: '4px 0 0', color: 'var(--text-muted)' }}>{selectedTeam.description}</p></div>
                </div>
                <button onClick={() => setSelectedTeam(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                <div style={{ background: 'var(--surface-inset)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: selectedTeam.color }}>{selectedTeam.members}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Members</div>
                </div>
                <div style={{ background: 'var(--surface-inset)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{selectedTeam.projects}</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Projects</div>
                </div>
                <div style={{ background: 'var(--surface-inset)', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>{selectedTeam.progress}%</div><div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Progress</div>
                </div>
              </div>
              <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Team Members</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {teamMembers.map(member => (
                  <motion.div key={member.id} whileHover={{ x: 5 }} onClick={() => setSelectedMember(member)}
                    style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px', background: 'var(--surface-inset)', borderRadius: '14px', border: '1px solid var(--btn-ghost-bg)', cursor: 'pointer' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `linear-gradient(135deg, ${selectedTeam.color}, ${selectedTeam.color}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0 }}>
                      {member.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '14px' }}>{member.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{member.role}</div>
                    </div>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: statusColors[member.status] }} title={member.status} />
                    <ChevronRight size={16} style={{ color: 'var(--text-muted)' }} />
                  </motion.div>
                ))}
                {teamMembers.length === 0 && <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px' }}>No members in this team yet</p>}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Member Detail Modal */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedMember(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface-panel)', border: '1px solid var(--btn-ghost-border)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px', color: 'var(--text-primary)' }}>
              <button onClick={() => setSelectedMember(null)} style={{ position: 'absolute', right: '16px', top: '16px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '28px', margin: '0 auto 16px', boxShadow: '0 8px 32px rgba(59,130,246,0.3)' }}>
                  {selectedMember.name.split(' ').map(w => w[0]).join('')}
                </div>
                <h2 style={{ margin: '0 0 4px' }}>{selectedMember.name}</h2>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>{selectedMember.role}</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginTop: '8px' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.round(selectedMember.rating) ? '#f59e0b' : 'none'} color={i < Math.round(selectedMember.rating) ? '#f59e0b' : '#4a5568'} />)}
                  <span style={{ marginLeft: '6px', fontSize: '14px', color: '#f59e0b' }}>{selectedMember.rating}</span>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                {[
                  { icon: Mail, label: selectedMember.email },
                  { icon: Phone, label: selectedMember.phone },
                  { icon: MapPin, label: selectedMember.location },
                  { icon: Users, label: selectedMember.team },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: 'var(--surface-inset)', borderRadius: '10px' }}>
                    <item.icon size={16} style={{ color: 'var(--text-muted)' }} /><span style={{ fontSize: '14px' }}>{item.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px' }}>Skills</h4>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedMember.skills.map((skill, i) => <span key={i} style={{ padding: '6px 14px', borderRadius: '8px', background: 'rgba(59,130,246,0.15)', color: '#60a5fa', fontSize: '13px', fontWeight: '500' }}>{skill}</span>)}
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                style={{ width: '100%', padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                <MessageSquare size={16} /> Send Message
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Team Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCreateModal(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}
              style={{ background: 'var(--surface-panel)', border: '1px solid var(--btn-ghost-border)', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '440px', color: 'var(--text-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <h2 style={{ margin: 0 }}>Create Team</h2>
                <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={24} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div><label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Team Name *</label><input value={newTeam.name} onChange={e => setNewTeam({ ...newTeam, name: e.target.value })} placeholder="e.g. Mobile Development" style={inputStyle} /></div>
                <div><label style={{ fontSize: '13px', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Description</label><textarea value={newTeam.description} onChange={e => setNewTeam({ ...newTeam, description: e.target.value })} placeholder="What does this team do?" rows="3" style={{ ...inputStyle, resize: 'vertical' }} /></div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <motion.button whileHover={{ scale: 1.02 }} onClick={() => setShowCreateModal(false)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid var(--btn-ghost-border)', background: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Cancel</motion.button>
                <motion.button whileHover={{ scale: 1.02 }} onClick={handleCreateTeam} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }}>Create Team</motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teams;