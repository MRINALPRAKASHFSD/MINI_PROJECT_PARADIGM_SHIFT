import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Mail, Phone, MapPin, Briefcase, Star, X, MessageSquare, ChevronRight, ArrowRight } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import './Teams.css';

const Teams = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [selectedMember, setSelectedMember] = useState(null);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const statusColors = { online: '#10b981', away: '#f59e0b', offline: '#64748b', Active: '#10b981', Inactive: '#64748b' };

  const fetchData = async () => {
    try {
      const [deptRes, empRes] = await Promise.all([
        axios.get('/api/departments'),
        axios.get('/api/employees')
      ]);
      setTeams(deptRes.data.departments || []);
      setMembers(empRes.data.employees || []);
    } catch (error) {
      console.error("Error fetching teams data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5050');
    socket.on('DATA_UPDATED', fetchData);
    return () => socket.disconnect();
  }, []);

  const filteredTeams = teams.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.head && t.head.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const teamMembers = selectedTeam ? members.filter(m => m.department === selectedTeam.name) : [];

  if (loading) {
    return (
      <div className="teams-page loading-state">
        <div className="pulse"></div>
        <p className="rgb-text">Syncing Ecosystem Data...</p>
      </div>
    );
  }

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
      </div>

      <div className="search-container glass-panel">
        <Search size={22} className="search-icon" />
        <input type="text" placeholder="Search departments or leads..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="search-input" />
      </div>

      {filteredTeams.length === 0 ? (
         <div className="empty-state">
           <p className="rgb-text">No departments found.</p>
         </div>
      ) : (
        <div className="teams-grid">
          {filteredTeams.map((team, i) => {
            const teamColor = team.color || 'var(--primary)';
            return (
              <motion.div key={team._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ translateY: -8, background: 'rgba(255,255,255,0.04)' }} onClick={() => setSelectedTeam(team)}
                className="team-card glass-panel"
              >
                <div className="team-accent" style={{ background: `linear-gradient(135deg, ${teamColor}40, transparent)` }} />

                <div className="team-card-header">
                  <div className="team-icon-box" style={{ background: `${teamColor}15`, border: `1px solid ${teamColor}30`, fontSize: '24px' }}>
                    {team.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="team-tag" style={{ color: teamColor, background: `${teamColor}10` }}>
                    {members.filter(m => m.department === team.name).length} Members
                  </span>
                </div>

                <h3 className="team-title">{team.name}</h3>
                <p className="team-desc">{team.description || 'No description provided.'}</p>
                
                <div className="team-stats-mini">
                  <div className="mini-stat">
                    <Briefcase size={14} />
                    <span>Budget: ${team.budget || 0}</span>
                  </div>
                  <div className="mini-stat">
                    <Users size={14} />
                    <span>Lead: {team.head || 'Unassigned'}</span>
                  </div>
                </div>

                <div className="team-card-footer">
                  <span>View Structure</span>
                  <ArrowRight size={16} />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Team Detail Modal */}
      <AnimatePresence>
        {selectedTeam && (
          <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTeam(null)}>
            <motion.div className="modal-content glass-panel larger" initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }} onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div className="header-info">
                  <div className="header-icon" style={{ background: `${selectedTeam.color || 'var(--primary)'}15`, border: `1px solid ${selectedTeam.color || 'var(--primary)'}30`, fontSize: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {selectedTeam.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 style={{ color: selectedTeam.color || 'var(--primary)' }}>{selectedTeam.name}</h2>
                    <p>{selectedTeam.description}</p>
                  </div>
                </div>
                <button className="btn-close" onClick={() => setSelectedTeam(null)}><X size={24} /></button>
              </div>

              <div className="modal-stats">
                {[
                  { label: 'Contributors', value: teamMembers.length, color: selectedTeam.color || 'var(--primary)' },
                  { label: 'Budget', value: `$${selectedTeam.budget || 0}`, color: 'var(--secondary)' },
                  { label: 'Lead', value: selectedTeam.head || 'Unassigned', color: 'var(--text-primary)' },
                ].map((stat, i) => (
                  <div key={i} className="stat-pill glass-panel">
                    <span className="stat-pill-val" style={{ color: stat.color }}>{stat.value}</span>
                    <span className="stat-pill-label">{stat.label}</span>
                  </div>
                ))}
              </div>

              <h3 className="sub-section-title">Core Members</h3>
              <div className="member-list">
                {teamMembers.length === 0 ? (
                  <p className="rgb-text" style={{textAlign: 'center', padding: '2rem'}}>No members in this department yet.</p>
                ) : (
                  teamMembers.map(member => (
                    <motion.div key={member._id} whileHover={{ x: 8, background: 'rgba(255,255,255,0.03)' }} onClick={() => setSelectedMember(member)} className="member-row glass-panel">
                      <div className="member-row-main">
                        <div className="member-row-avatar" style={{ background: `linear-gradient(135deg, ${selectedTeam.color || 'var(--primary)'}, transparent)` }}>
                          {member.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                        </div>
                        <div className="member-row-info">
                          <span className="m-name">{member.name}</span>
                          <span className="m-role">{member.designation || 'Employee'}</span>
                        </div>
                      </div>
                      <div className="member-row-status">
                        <div className="status-indicator" style={{ background: statusColors[member.status] || statusColors.Active }} />
                        <span>{member.status || 'Active'}</span>
                        <ChevronRight size={18} />
                      </div>
                    </motion.div>
                  ))
                )}
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
                  {selectedMember.name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase()}
                  <div className="profile-status-glow" style={{ background: statusColors[selectedMember.status] || statusColors.Active }} />
                </div>
                <h2 className="profile-name">{selectedMember.name}</h2>
                <p className="profile-role">{selectedMember.designation || 'Employee'}</p>
                <div className="profile-rating">
                  <Star size={16} fill="#f59e0b" color="#f59e0b" />
                  <span>ID: {selectedMember.employeeId}</span>
                </div>
              </div>

              <div className="profile-details">
                {[
                  { icon: Mail, label: selectedMember.email },
                  { icon: Phone, label: selectedMember.phone || 'N/A' },
                  { icon: MapPin, label: selectedMember.address || 'N/A' },
                  { icon: Briefcase, label: selectedMember.department || 'N/A' },
                ].map((item, i) => (
                  <div key={i} className="detail-item glass-panel">
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className="profile-skills">
                <h4>Status Overview</h4>
                <div className="skill-tags">
                  <span className="skill-tag">Joined: {new Date(selectedMember.joiningDate).toLocaleDateString()}</span>
                  <span className="skill-tag">Status: {selectedMember.status || 'Active'}</span>
                </div>
              </div>

              <motion.button className="btn-vibrant-full" whileHover={{ scale: 1.02, translateY: -2 }} whileTap={{ scale: 0.98 }} onClick={() => window.location.href=`mailto:${selectedMember.email}`}>
                <MessageSquare size={18} /> Start Conversation
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Teams;