import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Calendar,
  Upload,
  Save,
  Camera,
  FileText,
  CreditCard,
  Shield,
  Bell,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  X,
  Download,
  Trash2,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe,
  BellRing
} from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [saveStatus, setSaveStatus] = useState('');

  const { user, updateUser } = useAuthStore();
  
  const nameParts = (user?.name || '').split(' ');
  const fName = nameParts[0] || '';
  const lName = nameParts.slice(1).join(' ') || '';

  const [profile, setProfile] = useState({
    firstName: fName,
    lastName: lName,
    email: user?.email || '',
    phone: user?.phone || '',
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    gender: user?.gender || 'Male',
    address: user?.address || '',
    city: user?.city || '',
    state: user?.state || '',
    pincode: user?.pincode || '',
    country: user?.country || 'India'
  });

  const [employment, setEmployment] = useState({
    employeeId: user?.employeeId || '',
    designation: user?.designation || '',
    department: user?.department || '',
    joiningDate: user?.joiningDate ? new Date(user.joiningDate).toISOString().split('T')[0] : '',
    employmentType: user?.employmentType || 'Full-time',
    reportingManager: user?.reportingManager || '',
    workLocation: user?.workLocation || '',
    salary: user?.salary ? `₹${user.salary}` : ''
  });

  const [documents, setDocuments] = useState({
    aadhar: { uploaded: true, fileName: 'aadhar_card.pdf', date: '2024-01-10' },
    pan: { uploaded: true, fileName: 'pan_card.pdf', date: '2024-01-10' },
    offerLetter: { uploaded: true, fileName: 'offer_letter.pdf', date: '2024-01-10' },
    educationCertificate: { uploaded: true, fileName: 'degree_certificate.pdf', date: '2024-01-10' },
  });

  const [bankDetails, setBankDetails] = useState({
    accountNumber: user?.bankDetails?.accountNumber || '',
    ifscCode: user?.bankDetails?.ifscCode || '',
    bankName: user?.bankDetails?.bankName || '',
    branch: user?.bankDetails?.branch || '',
    accountHolderName: user?.bankDetails?.accountHolderName || '',
    accountType: user?.bankDetails?.accountType || 'Savings'
  });

  const [emergencyContact, setEmergencyContact] = useState({
    name: user?.emergencyContact?.name || '',
    relationship: user?.emergencyContact?.relationship || '',
    phone: user?.emergencyContact?.phone || '',
    address: user?.emergencyContact?.address || ''
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: user?.notifications?.emailNotifications ?? true,
    pushNotifications: user?.notifications?.pushNotifications ?? true,
    taskReminders: user?.notifications?.taskReminders ?? true,
    weeklyReports: user?.notifications?.weeklyReports ?? false,
    projectUpdates: user?.notifications?.projectUpdates ?? true
  });

  const tabs = [
    { id: 'profile', label: 'Identity', icon: User, desc: 'Personal details & profile' },
    { id: 'employment', label: 'Career', icon: Briefcase, desc: 'Role & organization' },
    { id: 'documents', label: 'Vault', icon: FileText, desc: 'KYC & compliance docs' },
    { id: 'bank', label: 'Finance', icon: CreditCard, desc: 'Payroll & accounts' },
    { id: 'emergency', label: 'Safety', icon: Shield, desc: 'Contact points' },
    { id: 'security', label: 'Privacy', icon: Lock, desc: 'Passwords & access' },
    { id: 'notifications', label: 'Alerts', icon: Bell, desc: 'Preference center' }
  ];

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    setSaveStatus('saving');
    try {
      await updateUser({
        name: `${profile.firstName} ${profile.lastName}`.trim(),
        email: profile.email,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        pincode: profile.pincode,
        country: profile.country,
        bankDetails,
        emergencyContact,
        notifications
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    } catch (err) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 2000);
    }
  };

  return (
    <div style={{ padding: '24px', minHeight: '100vh', position: 'relative' }}>
      {/* Background Glows */}
      <div className="ambient-glow" style={{ top: '-10%', left: '10%', background: 'var(--primary-glow)', width: '500px', height: '500px' }} />
      <div className="ambient-glow" style={{ bottom: '5%', right: '5%', background: 'var(--secondary-glow)', width: '400px', height: '400px' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <motion.div 
            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            style={{ width: '72px', height: '72px', borderRadius: '24px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 15px 35px var(--primary-glow)' }}>
            <SettingsIcon size={36} color="#fff" />
          </motion.div>
          <div>
            <h1 style={{ margin: 0, fontSize: '38px', fontWeight: '900', letterSpacing: '-1.5px' }}>Control Center</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '16px', fontWeight: '500' }}>Customize your professional workspace and security</p>
          </div>
        </div>
        <AnimatePresence>
          {saveStatus && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}
              style={{ padding: '14px 28px', borderRadius: '20px', background: saveStatus === 'saved' ? 'rgba(16,185,129,0.1)' : 'rgba(79,70,229,0.1)', color: saveStatus === 'saved' ? '#10b981' : 'var(--primary)', fontSize: '14px', fontWeight: '800', border: '1px solid currentColor', display: 'flex', alignItems: 'center', gap: '10px' }}>
              {saveStatus === 'saving' ? <Zap size={18} className="pulse" /> : <ShieldCheck size={18} />}
              {saveStatus === 'saving' ? 'Applying changes...' : 'System Updated Successfully'}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '32px', position: 'relative', zIndex: 10 }}>
        {/* Navigation Sidebar */}
        <div className="glass-panel" style={{ padding: '16px', borderRadius: '32px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)', height: 'fit-content' }}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ x: 5, background: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.98 }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: activeTab === tab.id ? 'var(--primary)' : 'transparent',
                color: activeTab === tab.id ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                marginBottom: '8px'
              }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: activeTab === tab.id ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <tab.icon size={22} strokeWidth={activeTab === tab.id ? 3 : 2} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '800' }}>{tab.label}</div>
                <div style={{ fontSize: '11px', fontWeight: '500', opacity: activeTab === tab.id ? 0.8 : 0.5 }}>{tab.desc}</div>
              </div>
              {activeTab === tab.id && <ChevronRight size={18} />}
            </motion.button>
          ))}
        </div>

        {/* Form Main Area */}
        <div className="glass-panel" style={{ padding: '48px', borderRadius: '40px', border: '1px solid var(--border-glass)', background: 'rgba(15,23,42,0.3)', boxShadow: '0 40px 100px rgba(0,0,0,0.4)' }}>
          <AnimatePresence mode="wait">
            {activeTab === 'profile' && (
              <motion.div key="profile" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px' }}>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '900' }}>Personal Identity</h2>
                    <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontWeight: '500' }}>Update your core profile information</p>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '100px', height: '100px', borderRadius: '32px', background: 'rgba(255,255,255,0.03)', border: '2px solid var(--border-glass)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {profileImage ? <img src={profileImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <User size={48} color="var(--primary)" />}
                    </div>
                    <label htmlFor="p-img" style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '40px', height: '40px', borderRadius: '14px', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 8px 20px var(--primary-glow)' }}>
                      <Camera size={18} color="#fff" />
                    </label>
                    <input type="file" id="p-img" hidden onChange={handleProfileImageChange} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                  {['firstName', 'lastName', 'email', 'phone'].map(field => (
                    <div key={field}>
                      <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{field.replace(/([A-Z])/g, ' $1')}</label>
                      <input 
                        type="text" 
                        value={profile[field]} 
                        onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                        style={{ width: '100%', padding: '16px 20px', borderRadius: '18px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff', fontSize: '15px', fontWeight: '600', outline: 'none' }} 
                      />
                    </div>
                  ))}
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Permanent Address</label>
                    <input 
                      type="text" 
                      value={profile.address} 
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                      style={{ width: '100%', padding: '16px 20px', borderRadius: '18px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff', fontSize: '15px', fontWeight: '600', outline: 'none' }} 
                    />
                  </div>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: '0 15px 35px var(--primary-glow)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveProfile}
                  style={{ width: '100%', padding: '20px', borderRadius: '20px', background: 'var(--primary)', color: '#fff', border: 'none', fontSize: '16px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <Save size={22} strokeWidth={3} /> Save Identity Profile
                </motion.button>
              </motion.div>
            )}

            {activeTab === 'employment' && (
              <motion.div key="employment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '900' }}>Career Statistics</h2>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontWeight: '500' }}>Official organization records (Read-only)</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  {Object.entries(employment).map(([key, value]) => (
                    <div key={key} style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                      <label style={{ fontSize: '11px', fontWeight: '900', color: 'var(--primary)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>{key.replace(/([A-Z])/g, ' $1')}</label>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>{value}</div>
                    </div>
                  ))}
                </div>
                
                <div style={{ marginTop: '40px', padding: '24px', borderRadius: '24px', background: 'rgba(79,70,229,0.05)', border: '1px solid rgba(79,70,229,0.1)', display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={24} color="var(--primary)" /></div>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', fontWeight: '600' }}>Organization data is locked by HR. Contact <span style={{ color: 'var(--primary)' }}>admin@paradigmshift.in</span> to request changes to these records.</p>
                </div>
              </motion.div>
            )}

            {activeTab === 'security' && (
              <motion.div key="security" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '900' }}>Privacy Shield</h2>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontWeight: '500' }}>Manage credentials and multi-factor security</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>New Access Key</label>
                    <div style={{ position: 'relative' }}>
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••••••"
                        style={{ width: '100%', padding: '18px 60px 18px 24px', borderRadius: '20px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff', fontSize: '16px', fontWeight: '600', outline: 'none' }} 
                      />
                      <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                        {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>
                  </div>
                  
                  <div style={{ padding: '32px', borderRadius: '28px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Lock size={20} color="var(--primary)" /></div>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '800' }}>Two-Factor Shield</div>
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Highly recommended for remote work</div>
                        </div>
                      </div>
                      <div style={{ padding: '6px 14px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', color: '#10b981', fontSize: '12px', fontWeight: '900' }}>ACTIVE</div>
                    </div>
                    <motion.button whileHover={{ scale: 1.02 }} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: '#fff', fontWeight: '800', cursor: 'pointer' }}>Reconfigure MFA</motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'notifications' && (
              <motion.div key="notifications" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <div style={{ marginBottom: '40px' }}>
                  <h2 style={{ margin: 0, fontSize: '28px', fontWeight: '900' }}>Alert Intelligence</h2>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontWeight: '500' }}>Control how the platform speaks to you</p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} style={{ padding: '24px', borderRadius: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><BellRing size={20} color={value ? 'var(--primary)' : 'var(--text-muted)'} /></div>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                          <div style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '500' }}>Real-time push alerts via browser and email</div>
                        </div>
                      </div>
                      <label style={{ position: 'relative', display: 'inline-block', width: '56px', height: '30px' }}>
                        <input 
                          type="checkbox" 
                          checked={value} 
                          onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                          style={{ opacity: 0, width: 0, height: 0 }} 
                        />
                        <span style={{ position: 'absolute', cursor: 'pointer', inset: 0, background: value ? 'var(--primary)' : 'rgba(255,255,255,0.1)', borderRadius: '34px', transition: '0.4s' }}>
                          <span style={{ position: 'absolute', height: '22px', width: '22px', left: value ? '30px' : '4px', bottom: '4px', background: 'white', borderRadius: '50%', transition: '0.4s', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }} />
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;