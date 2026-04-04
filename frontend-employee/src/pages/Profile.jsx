import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { User, Mail, Phone, MapPin, Briefcase, Award, Star, Activity, Clock, CheckSquare, TrendingUp, Edit3, Save, Zap, Target } from 'lucide-react';

const Profile = () => {
  const { user } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);

  const profileData = {
    name: user?.displayName || user?.name || 'John Doe',
    email: user?.email || 'john.doe@company.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    department: 'Engineering',
    designation: 'Senior Developer',
    bio: 'Passionate full-stack developer with 5+ years of experience building scalable web applications.',
  };

  const stats = [
    { label: 'Tasks Done', value: '247', icon: CheckSquare, color: '#3b82f6' },
    { label: 'Hours Logged', value: '1,842', icon: Clock, color: '#10b981' },
    { label: 'Projects', value: '18', icon: Briefcase, color: '#a855f7' },
    { label: 'Rating', value: '4.9', icon: Star, color: '#f59e0b' },
  ];

  const skills = [
    { name: 'React.js', level: 95, color: '#61dafb' },
    { name: 'Node.js', level: 88, color: '#68a063' },
    { name: 'TypeScript', level: 82, color: '#3178c6' },
    { name: 'Python', level: 75, color: '#3776ab' },
    { name: 'AWS', level: 70, color: '#ff9900' },
    { name: 'Docker', level: 78, color: '#2496ed' },
  ];

  const achievements = [
    { title: 'Top Performer', desc: 'Q4 2024', icon: '🏆', color: '#f59e0b' },
    { title: 'Bug Slayer', desc: '100+ bugs fixed', icon: '🐛', color: '#ef4444' },
    { title: 'Team Player', desc: 'Best collaboration', icon: '🤝', color: '#10b981' },
    { title: 'Fast Learner', desc: '5 courses completed', icon: '📚', color: '#3b82f6' },
    { title: 'Mentor', desc: '3 juniors mentored', icon: '🎓', color: '#a855f7' },
    { title: 'Innovator', desc: '2 patents filed', icon: '💡', color: '#f97316' },
  ];

  const cardStyle = { background: 'var(--surface-panel)', borderRadius: '20px', padding: '28px', border: '1px solid var(--border-soft)' };

  return (
    <div style={{ padding: '24px', color: 'var(--text-primary)', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{ ...cardStyle, background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(139,92,246,0.15) 50%, rgba(236,72,153,0.15) 100%)', marginBottom: '24px', padding: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
          <motion.div whileHover={{ scale: 1.05 }}
            style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px', fontWeight: '700', color: '#fff', boxShadow: '0 8px 32px rgba(59,130,246,0.4)', flexShrink: 0 }}>
            {profileData.name.charAt(0).toUpperCase()}
          </motion.div>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '700', margin: '0 0 4px 0' }}>{profileData.name}</h1>
            <p style={{ fontSize: '18px', color: 'var(--text-secondary)', margin: '0 0 12px 0' }}>{profileData.designation} · {profileData.department}</p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '14px', color: 'var(--text-muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> {profileData.email}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> {profileData.phone}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} /> {profileData.location}</span>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsEditing(!isEditing)}
            style={{ background: isEditing ? 'linear-gradient(135deg, #10b981, #34d399)' : 'linear-gradient(135deg, #3b82f6, #60a5fa)', border: 'none', borderRadius: '14px', padding: '12px 24px', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {isEditing ? <><Save size={18} /> Save</> : <><Edit3 size={18} /> Edit</>}
          </motion.button>
        </div>
        <p style={{ marginTop: '20px', color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '15px' }}>{profileData.bio}</p>
      </motion.div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, i) => (
          <motion.div key={i} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }}
            style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '16px', padding: '24px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `${stat.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
              <stat.icon size={26} />
            </div>
            <div>
              <div style={{ fontSize: '28px', fontWeight: '700' }}>{stat.value}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Skills & Achievements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={cardStyle}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '18px' }}>
            <Zap size={22} style={{ color: '#f59e0b' }} /> Skills
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {skills.map((skill, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                  <span>{skill.name}</span>
                  <span style={{ color: skill.color, fontWeight: '600' }}>{skill.level}%</span>
                </div>
                <div style={{ height: '8px', borderRadius: '4px', background: 'var(--border-soft)', overflow: 'hidden' }}>
                  <motion.div initial={{ width: 0 }} animate={{ width: `${skill.level}%` }} transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                    style={{ height: '100%', borderRadius: '4px', background: skill.color }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={cardStyle}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', fontSize: '18px' }}>
            <Award size={22} style={{ color: '#f59e0b' }} /> Achievements
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {achievements.map((ach, i) => (
              <motion.div key={i} whileHover={{ scale: 1.03 }}
                style={{ background: `${ach.color}10`, borderRadius: '14px', padding: '16px', border: `1px solid ${ach.color}20`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>{ach.icon}</span>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{ach.title}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{ach.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
