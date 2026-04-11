import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Key, ArrowRight, Building2 } from 'lucide-react';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const CompanySetupModal = () => {
  const { user, setUser } = useAuthStore();
  const [mode, setMode] = useState('join'); // 'join' or 'create'
  const [companyName, setCompanyName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  if (user?.companyName) return null; // Only show if companyName is blank

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const { data } = await api.post('/auth/setup-company', {
        mode,
        companyName,
        joinCode
      });
      // Updating user context to clear modal gracefully
      setUser(data.user, localStorage.getItem('token'));
      window.location.reload(); // Hard reload to refresh dataset queries
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to setup workspace');
    }
    setIsLoading(false);
  };

  return (
    <AnimatePresence>
      <div style={overlayStyle}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          style={modalStyle}
        >
          <div style={headerStyle}>
            <Building2 size={36} color="#3b82f6" style={{ marginBottom: 12 }} />
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>Welcome to Paradigm Shift</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', marginTop: 8 }}>
              To get started, please join or create a workspace.
            </p>
          </div>

          <div style={toggleContainerStyle}>
            <button 
              onClick={() => { setMode('join'); setError(''); }}
              style={mode === 'join' ? activeToggleStyle : inactiveToggleStyle}
            >
              Join Company
            </button>
            <button 
              onClick={() => { setMode('create'); setError(''); }}
              style={mode === 'create' ? activeToggleStyle : inactiveToggleStyle}
            >
              Create Hub
            </button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {mode === 'join' ? (
              <div style={inputGroupStyle}>
                <label style={labelStyle}><Briefcase size={16} /> Enter Organization Name</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Paradigm Shift Inc."
                  style={inputStyle}
                  required
                />
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: 6 }}>
                  You will instantly be connected to the team workspace.
                </p>
              </div>
            ) : (
              <div style={inputGroupStyle}>
                <label style={labelStyle}><Briefcase size={16} /> New Workspace Name</label>
                <input 
                  type="text" 
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your Company Name"
                  style={inputStyle}
                  required
                />
              </div>
            )}

            {error && <div style={{ color: '#ef4444', fontSize: '13px', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px' }}>{error}</div>}

            <button 
              type="submit" 
              disabled={isLoading || !companyName}
              style={{ ...submitBtnStyle, opacity: (isLoading || !companyName) ? 0.6 : 1 }}
            >
              {isLoading ? 'Configuring...' : (mode === 'join' ? 'Access Workspace' : 'Create Workspace')}
              <ArrowRight size={18} />
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// ── Styles (Inline for modularity without external bloated CSS) ──
const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 9999,
  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
};

const modalStyle = {
  background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '24px', width: '100%', maxWidth: '440px', padding: '32px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
};

const headerStyle = {
  textAlign: 'center', marginBottom: '24px'
};

const toggleContainerStyle = {
  display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: '12px',
  padding: '6px', marginBottom: '24px'
};

const activeToggleStyle = {
  flex: 1, padding: '10px', borderRadius: '8px', background: '#3b82f6', color: '#fff',
  border: 'none', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
};

const inactiveToggleStyle = {
  flex: 1, padding: '10px', borderRadius: '8px', background: 'transparent', color: '#94a3b8',
  border: 'none', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s'
};

const inputGroupStyle = {
  display: 'flex', flexDirection: 'column', gap: '8px'
};

const labelStyle = {
  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600', color: '#cbd5e1'
};

const inputStyle = {
  background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px',
  padding: '12px 16px', color: '#fff', fontSize: '15px', outline: 'none',
  transition: 'border-color 0.2s'
};

const submitBtnStyle = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)', color: '#fff',
  border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '600',
  cursor: 'pointer', marginTop: '8px'
};

export default CompanySetupModal;
