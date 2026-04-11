import React from 'react';
import { motion } from 'framer-motion';
import PersonalNotes from '../components/workspace/PersonalNotes';
import PeerChat from '../components/workspace/PeerChat';
import { Sparkles, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

import './Workspace.css';

const Workspace = () => {
  const { user } = useAuthStore();
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="workspace-page">
      <div className="workspace-header-section">
        <motion.div 
          className="welcome-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="welcome-content">
            <h1>Your Operations Center, <span>{user?.name?.split(' ')[0]}</span></h1>
            <p className="welcome-subtext">Manage your personal tasks, drop quick notes, and collaborate with your peers.</p>
            <div className="welcome-meta">
              <span className="meta-pill"><CalendarIcon size={14} /> {today}</span>
            </div>
          </div>
          <div className="welcome-icon">
            <Sparkles size={64} className="sparkle-svg" />
          </div>
        </motion.div>
      </div>

      <div className="workspace-grid">
        <motion.div 
          className="workspace-col notes-col"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="col-header">
            <h2>Personal Workflow</h2>
            <p>Private sticky notes & to-dos</p>
          </div>
          <PersonalNotes />
        </motion.div>

        <motion.div 
          className="workspace-col chat-col"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="col-header">
            <h2>Team Pipeline</h2>
            <p>{user?.companyName} Live Chat</p>
          </div>
          <PeerChat />
        </motion.div>
      </div>
    </div>
  );
};

export default Workspace;
