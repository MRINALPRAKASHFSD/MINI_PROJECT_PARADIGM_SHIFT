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
  Trash2
} from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // Profile Information State
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email:  'john.doe@company. com',
    phone: '+91 98765 43210',
    dateOfBirth: '1990-05-15',
    gender: 'Male',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India'
  });

  // Employment Information State
  const [employment, setEmployment] = useState({
    employeeId: 'EMP001',
    designation: 'Senior Developer',
    department: 'Engineering',
    joiningDate: '2022-01-15',
    employmentType: 'Full-time',
    reportingManager: 'Jane Smith',
    workLocation: 'Mumbai Office',
    salary: '₹12,00,000'
  });

  // Documents State
  const [documents, setDocuments] = useState({
    aadhar: { uploaded: true, fileName: 'aadhar_card.pdf', date: '2024-01-10' },
    pan: { uploaded: true, fileName: 'pan_card.pdf', date: '2024-01-10' },
    offerLetter: { uploaded: true, fileName: 'offer_letter.pdf', date: '2024-01-10' },
    joiningLetter: { uploaded: false, fileName: '', date: '' },
    bankPassbook: { uploaded: false, fileName: '', date: '' },
    educationCertificate: { uploaded: true, fileName: 'degree_certificate.pdf', date: '2024-01-10' },
    experienceLetter: { uploaded: false, fileName: '', date: '' },
    photograph: { uploaded: true, fileName: 'passport_photo.jpg', date: '2024-01-10' }
  });

  // Bank Details State
  const [bankDetails, setBankDetails] = useState({
    accountNumber: '1234567890',
    ifscCode: 'HDFC0001234',
    bankName: 'HDFC Bank',
    branch: 'Mumbai Branch',
    accountHolderName: 'John Doe',
    accountType: 'Savings'
  });

  // Emergency Contact State
  const [emergencyContact, setEmergencyContact] = useState({
    name: 'Jane Doe',
    relationship: 'Spouse',
    phone: '+91 98765 12345',
    address: '123 Main Street, Mumbai'
  });

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskReminders: true,
    weeklyReports: false,
    projectUpdates: true
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id:  'employment', label: 'Employment', icon: Briefcase },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'bank', label: 'Bank Details', icon: CreditCard },
    { id: 'emergency', label: 'Emergency Contact', icon:  Shield },
    { id: 'security', label: 'Security', icon: Lock },
    { id:  'notifications', label: 'Notifications', icon: Bell }
  ];

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocumentUpload = (docType, e) => {
    const file = e.target.files[0];
    if (file) {
      setDocuments({
        ...documents,
        [docType]: {
          uploaded:  true,
          fileName: file. name,
          date: new Date().toISOString().split('T')[0]
        }
      });
    }
  };

  const handleSaveProfile = () => {
    alert('Profile updated successfully!');
  };

  return (
    <div className="settings-container dark">
      <div className="settings-header">
        <div className="header-left">
          <motion.div 
            className="header-icon"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <SettingsIcon size={28} />
          </motion.div>
          <div>
            <h1>Settings</h1>
            <p>Manage your profile and preferences</p>
          </div>
        </div>
      </div>

      <div className="settings-content">
        {/* Sidebar Tabs */}
        <div className="settings-sidebar">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              className={`tab-button ${activeTab === tab. id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.98 }}
            >
              <tab.icon size={20} />
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Content Area */}
        <div className="settings-main">
          <AnimatePresence mode="wait">
            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity:  0, x: -20 }}
                className="tab-content"
              >
                <h2>Personal Information</h2>

                {/* Profile Image */}
                <div className="profile-image-section">
                  <div className="profile-image-wrapper">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="profile-image" />
                    ) : (
                      <div className="profile-image-placeholder">
                        <User size={48} />
                      </div>
                    )}
                    <input
                      type="file"
                      id="profile-image"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      style={{ display: 'none' }}
                    />
                    <label htmlFor="profile-image" className="upload-image-btn">
                      <Camera size={18} />
                    </label>
                  </div>
                  <div className="profile-image-info">
                    <h4>Profile Picture</h4>
                    <p>Upload a professional photo (JPG, PNG - Max 5MB)</p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                      type="text"
                      value={profile. firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                      type="text"
                      value={profile. lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Date of Birth</label>
                    <input
                      type="date"
                      value={profile.dateOfBirth}
                      onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Gender</label>
                    <select
                      value={profile.gender}
                      onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <input
                      type="text"
                      value={profile. address}
                      onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      value={profile.state}
                      onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Pincode</label>
                    <input
                      type="text"
                      value={profile.pincode}
                      onChange={(e) => setProfile({ ...profile, pincode: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <input
                      type="text"
                      value={profile. country}
                      onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                    />
                  </div>
                </div>

                <motion.button
                  className="save-btn"
                  onClick={handleSaveProfile}
                  whileHover={{ scale:  1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={20} />
                  Save Changes
                </motion.button>
              </motion.div>
            )}

            {/* EMPLOYMENT TAB */}
            {activeTab === 'employment' && (
              <motion.div
                key="employment"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity:  1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="tab-content"
              >
                <h2>Employment Information</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Employee ID</label>
                    <input type="text" value={employment.employeeId} disabled />
                  </div>
                  <div className="form-group">
                    <label>Designation</label>
                    <input
                      type="text"
                      value={employment.designation}
                      onChange={(e) => setEmployment({ ...employment, designation: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      value={employment.department}
                      onChange={(e) => setEmployment({ ...employment, department: e.target.value })}
                    >
                      <option>Engineering</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                      <option>HR</option>
                      <option>Finance</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Joining Date</label>
                    <input type="date" value={employment.joiningDate} disabled />
                  </div>
                  <div className="form-group">
                    <label>Employment Type</label>
                    <input type="text" value={employment.employmentType} disabled />
                  </div>
                  <div className="form-group">
                    <label>Reporting Manager</label>
                    <input type="text" value={employment.reportingManager} disabled />
                  </div>
                  <div className="form-group">
                    <label>Work Location</label>
                    <select
                      value={employment.workLocation}
                      onChange={(e) => setEmployment({ ...employment, workLocation: e.target. value })}
                    >
                      <option>Mumbai Office</option>
                      <option>Delhi Office</option>
                      <option>Bangalore Office</option>
                      <option>Remote</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Annual Salary</label>
                    <input type="text" value={employment.salary} disabled />
                  </div>
                </div>

                <motion.button
                  className="save-btn"
                  onClick={handleSaveProfile}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={20} />
                  Save Changes
                </motion. button>
              </motion.div>
            )}

            {/* DOCUMENTS TAB */}
            {activeTab === 'documents' && (
              <motion.div
                key="documents"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x:  0 }}
                exit={{ opacity: 0, x: -20 }}
                className="tab-content"
              >
                <h2>Document Management</h2>
                <p className="section-description">
                  Upload and manage all your important documents
                </p>

                <div className="documents-grid">
                  {Object.entries(documents).map(([key, doc]) => (
                    <motion.div
                      key={key}
                      className="document-card"
                      whileHover={{ y: -5 }}
                    >
                      <div className="document-icon">
                        <FileText size={32} />
                      </div>
                      <div className="document-info">
                        <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                        {doc.uploaded ?  (
                          <>
                            <p className="document-name">{doc.fileName}</p>
                            <p className="document-date">Uploaded: {doc.date}</p>
                            <div className="document-status uploaded">
                              <CheckCircle size={16} />
                              <span>Verified</span>
                            </div>
                          </>
                        ) : (
                          <p className="document-pending">Not uploaded</p>
                        )}
                      </div>
                      <div className="document-actions">
                        {doc.uploaded ?  (
                          <>
                            <motion.button
                              className="action-btn view"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Eye size={18} />
                            </motion.button>
                            <motion.button
                              className="action-btn download"
                              whileHover={{ scale:  1.1 }}
                              whileTap={{ scale:  0.9 }}
                            >
                              <Download size={18} />
                            </motion.button>
                            <motion.button
                              className="action-btn delete"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 size={18} />
                            </motion. button>
                          </>
                        ) : (
                          <>
                            <input
                              type="file"
                              id={`upload-${key}`}
                              style={{ display: 'none' }}
                              onChange={(e) => handleDocumentUpload(key, e)}
                            />
                            <label htmlFor={`upload-${key}`} className="upload-btn">
                              <Upload size={18} />
                              Upload
                            </label>
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* BANK DETAILS TAB */}
            {activeTab === 'bank' && (
              <motion.div
                key="bank"
                initial={{ opacity: 0, x:  20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="tab-content"
              >
                <h2>Bank Account Details</h2>
                <p className="section-description">
                  For salary and reimbursement purposes
                </p>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Account Holder Name</label>
                    <input
                      type="text"
                      value={bankDetails.accountHolderName}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountHolderName: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Number</label>
                    <input
                      type="text"
                      value={bankDetails. accountNumber}
                      onChange={(e) => setBankDetails({ ... bankDetails, accountNumber: e. target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>IFSC Code</label>
                    <input
                      type="text"
                      value={bankDetails.ifscCode}
                      onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Bank Name</label>
                    <input
                      type="text"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target. value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Branch</label>
                    <input
                      type="text"
                      value={bankDetails.branch}
                      onChange={(e) => setBankDetails({ ...bankDetails, branch: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Account Type</label>
                    <select
                      value={bankDetails.accountType}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountType: e.target. value })}
                    >
                      <option>Savings</option>
                      <option>Current</option>
                    </select>
                  </div>
                </div>

                <motion.button
                  className="save-btn"
                  onClick={handleSaveProfile}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={20} />
                  Save Bank Details
                </motion.button>
              </motion.div>
            )}

            {/* EMERGENCY CONTACT TAB */}
            {activeTab === 'emergency' && (
              <motion.div
                key="emergency"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x:  0 }}
                exit={{ opacity: 0, x: -20 }}
                className="tab-content"
              >
                <h2>Emergency Contact</h2>
                <p className="section-description">
                  Person to contact in case of emergency
                </p>

                <div className="form-grid">
                  <div className="form-group">
                    <label>Contact Name</label>
                    <input
                      type="text"
                      value={emergencyContact.name}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, name: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Relationship</label>
                    <select
                      value={emergencyContact.relationship}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, relationship: e.target.value })}
                    >
                      <option>Spouse</option>
                      <option>Parent</option>
                      <option>Sibling</option>
                      <option>Friend</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      value={emergencyContact. phone}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Address</label>
                    <textarea
                      rows="3"
                      value={emergencyContact.address}
                      onChange={(e) => setEmergencyContact({ ...emergencyContact, address: e.target.value })}
                    />
                  </div>
                </div>

                <motion.button
                  className="save-btn"
                  onClick={handleSaveProfile}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={20} />
                  Save Emergency Contact
                </motion. button>
              </motion.div>
            )}

            {/* SECURITY TAB */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity:  1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="tab-content"
              >
                <h2>Security Settings</h2>
                <p className="section-description">
                  Manage your password and security preferences
                </p>

                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Current Password</label>
                    <div className="password-input">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter current password"
                      />
                      <button
                        className="toggle-password"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                  <div className="form-group full-width">
                    <label>New Password</label>
                    <input type="password" placeholder="Enter new password" />
                  </div>
                  <div className="form-group full-width">
                    <label>Confirm New Password</label>
                    <input type="password" placeholder="Confirm new password" />
                  </div>
                </div>

                <motion.button
                  className="save-btn"
                  onClick={() => alert('Password updated successfully!')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Lock size={20} />
                  Update Password
                </motion.button>

                <div className="security-info">
                  <h3>Password Requirements:</h3>
                  <ul>
                    <li>Minimum 8 characters long</li>
                    <li>At least one uppercase letter</li>
                    <li>At least one lowercase letter</li>
                    <li>At least one number</li>
                    <li>At least one special character</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* NOTIFICATIONS TAB */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity:  0, x: -20 }}
                className="tab-content"
              >
                <h2>Notification Preferences</h2>
                <p className="section-description">
                  Choose how you want to be notified
                </p>

                <div className="notification-settings">
                  {Object.entries(notifications).map(([key, value]) => (
                    <div key={key} className="notification-item">
                      <div className="notification-info">
                        <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                        <p>Receive notifications for {key. toLowerCase()}</p>
                      </div>
                      <label className="toggle-switch">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotifications({ ...notifications, [key]: e. target.checked })}
                        />
                        <span className="slider"></span>
                      </label>
                    </div>
                  ))}
                </div>

                <motion.button
                  className="save-btn"
                  onClick={handleSaveProfile}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Save size={20} />
                  Save Preferences
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Settings;