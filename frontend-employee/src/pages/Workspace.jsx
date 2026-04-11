import React from 'react';
import { motion } from 'framer-motion';
import PersonalNotes from '../components/workspace/PersonalNotes';
import PeerChat from '../components/workspace/PeerChat';
import SpotifyWidget from '../components/workspace/SpotifyWidget';
import FocusTimer from '../components/workspace/FocusTimer';
import RecentDocsWidget from '../components/workspace/RecentDocsWidget';
import PriorityTasksWidget from '../components/workspace/PriorityTasksWidget';
import { Sparkles, Calendar as CalendarIcon } from 'lucide-react';
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

      <div className="workspace-bento-grid">
        {/* Left column: Personal Notes takes up significant space */}
        <motion.div 
          className="bento-item span-row-2 col-notes"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="col-header">
            <h2>Personal Workflow</h2>
            <p>Private sticky notes & to-dos</p>
          </div>
          <PersonalNotes />
        </motion.div>

        {/* Middle column items */}
        <motion.div 
          className="bento-item col-timer"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <FocusTimer />
        </motion.div>

        <motion.div 
          className="bento-item col-spotify"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <SpotifyWidget />
        </motion.div>

        {/* Right column: Chat takes up height */}
        <motion.div 
          className="bento-item span-row-2 col-chat"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div className="col-header">
            <h2>Team Pipeline</h2>
            <p>{user?.companyName} Live Chat</p>
          </div>
          <PeerChat />
        </motion.div>

        {/* Bottom row items */}
        <motion.div 
          className="bento-item col-tasks"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <PriorityTasksWidget />
        </motion.div>

        <motion.div 
          className="bento-item col-docs"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <RecentDocsWidget />
        </motion.div>
      </div>
    </div>
  );
};

export default Workspace;
