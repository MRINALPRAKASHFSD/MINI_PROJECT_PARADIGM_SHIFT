import { useState, useEffect } from 'react';
import { Save, Settings, Palette } from 'lucide-react';
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
        features: settings.features,
        maintenanceMode: settings.maintenanceMode
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      console.error(err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  if (loading || !settings) return (
    <div className="loading-state">
      <div className="spinner"></div>
      <p>Loading configuration...</p>
    </div>
  );

  return (
    <div className="company-settings">
      <div className="settings-header">
        <div>
          <h1><Settings size={24} /> Portal Configuration</h1>
          <p>Global control for modules and appearance across the organization.</p>
        </div>
        <div className="header-status">
          {saveStatus === 'saved' && <span className="status-success">Changes saved successfully</span>}
          {saveStatus === 'error' && <span className="status-error">Error saving changes</span>}
        </div>
      </div>

      <div className="settings-grid">
        <section className="settings-section">
          <div className="section-header">
            <Settings size={20} />
            <h2>System Controls</h2>
          </div>
          <p className="section-desc">Global access controls for the entire employee portal.</p>
          
          <div className="features-list">
            <div className="feature-item" style={{ borderLeft: '4px solid #ef4444' }}>
              <div className="feature-info">
                <span className="feature-name" style={{ color: '#ef4444', fontWeight: 'bold' }}>Maintenance Mode</span>
                <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Block all employee access to the portal. Admin access remains active.
                </span>
              </div>
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({
                    ...settings,
                    maintenanceMode: e.target.checked
                  })}
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </section>

        <section className="settings-section">
          <div className="section-header">
            <Settings size={20} />
            <h2>Feature Modules</h2>
          </div>
          <p className="section-desc">Enable or disable specific modules for employees. Hidden modules will not appear in the employee portal.</p>
          
          <div className="features-list">
            {Object.keys(settings.features).map((feature) => (
              <div key={feature} className="feature-item">
                <div className="feature-info">
                  <span className="feature-name">{feature.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                </div>
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
        </section>

        <section className="settings-section">
          <div className="section-header">
            <Palette size={20} />
            <h2>Branding & Identity</h2>
          </div>
          <p className="section-desc">Customize the visual identity of the portal to match your corporate branding.</p>
          
          <div className="branding-controls">
            <div className="control-group">
              <label>Primary Brand Color</label>
              <div className="color-control">
                <input 
                  type="color" 
                  value={settings.theme.primaryColor}
                  onChange={(e) => setSettings({
                    ...settings,
                    theme: { ...settings.theme, primaryColor: e.target.value }
                  })}
                />
                <code className="color-value">{settings.theme.primaryColor}</code>
              </div>
            </div>

            <div className="control-group">
              <label>Default Interface Mode</label>
              <select 
                className="theme-select"
                value={settings.theme.mode}
                onChange={(e) => setSettings({
                  ...settings,
                  theme: { ...settings.theme, mode: e.target.value }
                })}
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
                <option value="system">System Preference</option>
              </select>
            </div>
          </div>
        </section>
      </div>

      <div className="settings-actions">
        <button className="save-button" onClick={handleSave} disabled={saveStatus === 'saving'}>
          <Save size={18} />
          {saveStatus === 'saving' ? 'Saving...' : 'Apply Changes'}
        </button>
      </div>
    </div>
  );
};

export default CompanySettings;
