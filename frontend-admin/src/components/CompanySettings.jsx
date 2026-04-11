import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Settings, Palette, CheckCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import './CompanySettings.css';

const CompanySettings = () => {
  const [settings, setSettings] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data.settings);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      await api.put('/settings', {
        theme: settings.theme,
        features: settings.features
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  if (loading || !settings) return <div className="loading">Loading company settings...</div>;

  return (
    <div className="company-settings-container">
      <div className="header-section">
        <h2><Settings size={26} /> Portal Settings</h2>
        <p>Control the modules and appearance of the Employee Portal globally.</p>
        {saveStatus === 'saved' && <span style={{ color: '#10b981', marginLeft: '1rem' }}>Saved!</span>}
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <div className="card-header">
            <Settings size={20} />
            <h3>Feature Modules</h3>
          </div>
          <p>Toggle features available to employees. Disabled features will disappear from their sidebar entirely.</p>
          
          <div className="toggles-list">
            {Object.keys(settings.features).map((feature) => (
              <div key={feature} className="toggle-item">
                <span>{feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                <label className="switch">
                  <input 
                    type="checkbox" 
                    checked={settings.features[feature]}
                    onChange={(e) => setSettings({
                      ...settings,
                      features: { ...settings.features, [feature]: e.target.checked }
                    })}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="settings-card">
          <div className="card-header">
            <Palette size={20} />
            <h3>Branding & Theme</h3>
          </div>
          <p>Set the primary color and dark/light mode preference for your company portal.</p>
          
          <div className="theme-options">
            <div className="form-group">
              <label>Primary Brand Color</label>
              <div className="color-picker-wrapper">
                <input 
                  type="color" 
                  value={settings.theme.primaryColor}
                  onChange={(e) => setSettings({
                    ...settings,
                    theme: { ...settings.theme, primaryColor: e.target.value }
                  })}
                />
                <span>{settings.theme.primaryColor}</span>
              </div>
            </div>

            <div className="form-group">
              <label>Default Theme Mode</label>
              <select 
                value={settings.theme.mode}
                onChange={(e) => setSettings({
                  ...settings,
                  theme: { ...settings.theme, mode: e.target.value }
                })}
                style={{ background: '#1f2937', color: 'white', padding: '0.8rem', borderRadius: '8px', border: 'none', width: '100%', marginTop: '0.5rem' }}
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System Default</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <button className="save-btn" onClick={handleSave} disabled={saveStatus === 'saving'}>
        <Save size={18} /> {saveStatus === 'saving' ? 'Saving...' : 'Save All Settings'}
      </button>
    </div>
  );
};

export default CompanySettings;
