import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { motion } from 'framer-motion';
import { 
  User, 
  Briefcase, 
  Code, 
  Award, 
  MapPin, 
  Phone,
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import './ProfileSetup.css';

const ProfileSetup = () => {
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?. email || '',
    phone: '',
    dateOfBirth: '',
    address: '',
    role: 'Software Developer',
    department: 'Engineering',
    employeeId: `EMP${Math.floor(Math.random() * 10000)}`,
    joinDate: new Date().toISOString().split('T')[0],
    skills: [],
    experience: '',
    education: '',
    emergencyContact: '',
    emergencyPhone: ''
  });

  const [selectedSkills, setSelectedSkills] = useState([]);

  const skillOptions = [
    'JavaScript', 'React', 'Node.js', 'Python', 'Java', 'SQL',
    'MongoDB', 'AWS', 'Docker', 'Git', 'TypeScript', 'Angular',
    'Vue.js', 'C++', 'PHP', 'Ruby', 'Go', 'Kubernetes'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProfile({
      ...formData,
      skills: selectedSkills,
      profileComplete: true
    });
    navigate('/dashboard');
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="profile-setup-container dark">
      <div className="setup-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="grid-pattern"></div>
      </div>

      <div className="setup-content">
        <motion.div 
          className="setup-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="setup-header">
            <h1>Complete Your Profile</h1>
            <p>Let's get to know you better</p>
            <div className="progress-steps">
              {[1, 2, 3]. map((s) => (
                <div key={s} className={`step ${step >= s ? 'active' : ''}`}>
                  {step > s ?  <CheckCircle2 size={20} /> : s}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {step === 1 && (
              <motion.div 
                className="form-step"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <h3><User size={20} /> Personal Information</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><Phone size={16} /> Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label><Calendar size={16} /> Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label><MapPin size={16} /> Address</label>
                    <textarea
                      name="address"
                      value={formData. address}
                      onChange={handleChange}
                      rows="3"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                className="form-step"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <h3><Briefcase size={20} /> Professional Details</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Role/Position</label>
                    <select
                      name="role"
                      value={formData. role}
                      onChange={handleChange}
                      required
                    >
                      <option>Software Developer</option>
                      <option>Senior Developer</option>
                      <option>Team Lead</option>
                      <option>Project Manager</option>
                      <option>QA Engineer</option>
                      <option>DevOps Engineer</option>
                      <option>UI/UX Designer</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Department</label>
                    <select
                      name="department"
                      value={formData. department}
                      onChange={handleChange}
                      required
                    >
                      <option>Engineering</option>
                      <option>Design</option>
                      <option>Product</option>
                      <option>Marketing</option>
                      <option>Sales</option>
                      <option>HR</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label>Join Date</label>
                    <input
                      type="date"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Experience (years)</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData. experience}
                      onChange={handleChange}
                      min="0"
                      required
                    />
                  </div>
                  <div className="form-group full-width">
                    <label><Award size={16} /> Education</label>
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="e.g., B.Tech in Computer Science"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                className="form-step"
                initial={{ x: 20, opacity:  0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <h3><Code size={20} /> Skills & Emergency Contact</h3>
                <div className="form-group">
                  <label>Select Your Skills</label>
                  <div className="skills-grid">
                    {skillOptions.map((skill) => (
                      <motion.button
                        key={skill}
                        type="button"
                        className={`skill-tag ${selectedSkills.includes(skill) ? 'selected' : ''}`}
                        onClick={() => toggleSkill(skill)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {skill}
                      </motion.button>
                    ))}
                  </div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Emergency Contact Name</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Emergency Contact Phone</label>
                    <input
                      type="tel"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div className="form-actions">
              {step > 1 && (
                <motion.button
                  type="button"
                  className="btn-secondary"
                  onClick={prevStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Previous
                </motion.button>
              )}
              {step < 3 ?  (
                <motion.button
                  type="button"
                  className="btn-primary"
                  onClick={nextStep}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Next <ArrowRight size={18} />
                </motion.button>
              ) : (
                <motion.button
                  type="submit"
                  className="btn-primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Complete Profile <CheckCircle2 size={18} />
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSetup;