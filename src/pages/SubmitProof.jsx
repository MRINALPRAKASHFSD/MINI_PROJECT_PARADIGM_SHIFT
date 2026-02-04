import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, 
  Upload, 
  X, 
  Check,
  Image as ImageIcon,
  File,
  Calendar,
  Clock,
  Eye,
  Download,
  Trash2
} from 'lucide-react';
import './SubmitProof.css';

const SubmitProof = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [description, setDescription] = useState('');
  const [taskName, setTaskName] = useState('');

  const submittedProofs = [
    {
      id: 1,
      task: 'Frontend Development',
      date: '2025-01-10',
      time: '14:30',
      status: 'approved',
      files: 2,
      thumbnail: '🖼️'
    },
    {
      id: 2,
      task: 'API Integration',
      date: '2025-01-09',
      time: '16:45',
      status: 'pending',
      files: 3,
      thumbnail: '📸'
    },
    {
      id: 3,
      task: 'Bug Fixes',
      date: '2025-01-09',
      time: '10:20',
      status: 'approved',
      files: 1,
      thumbnail: '🎯'
    },
    {
      id: 4,
      task: 'Code Review',
      date: '2025-01-08',
      time: '15:00',
      status: 'rejected',
      files: 2,
      thumbnail: '⚠️'
    }
  ];

  const stats = [
    { label: 'Total Submitted', value: '24', color: '#3b82f6' },
    { label: 'Approved', value: '20', color: '#10b981' },
    { label: 'Pending', value: '3', color: '#eab308' },
    { label: 'Rejected', value:  '1', color: '#ef4444' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer. files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e. target.files);
    }
  };

  const handleFiles = (files) => {
    const fileArray = Array.from(files).map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
    }));
    setSelectedFiles(prev => [...prev, ...fileArray]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev. filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Submit logic here
    alert(`Submitted ${selectedFiles.length} files for task: ${taskName}`);
    setSelectedFiles([]);
    setTaskName('');
    setDescription('');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#10b981';
      case 'pending': return '#eab308';
      case 'rejected':  return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="submit-proof-container dark">
      <div className="proof-header">
        <div className="header-left">
          <motion.div 
            className="header-icon"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.6 }}
          >
            <Camera size={28} />
          </motion.div>
          <div>
            <h1>Submit Proof</h1>
            <p>Upload screenshots and work proof</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="proof-stats">
        {stats. map((stat, index) => (
          <motion.div
            key={index}
            className="stat-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay:  index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <div className="stat-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <Check size={24} />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Upload Section */}
      <motion.div 
        className="upload-section"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3>Submit New Proof</h3>
        
        <input
          type="text"
          placeholder="Task Name"
          value={taskName}
          onChange={(e) => setTaskName(e.target. value)}
          className="task-name-input"
        />

        <div
          className={`upload-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="file-input"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            style={{ display: 'none' }}
          />
          <label htmlFor="file-input" className="upload-label">
            <motion.div 
              className="upload-icon"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Upload size={48} />
            </motion.div>
            <h4>Drag & Drop files here</h4>
            <p>or click to browse</p>
            <span className="upload-hint">Supports:  JPG, PNG, GIF (Max 10MB)</span>
          </label>
        </div>

        {/* Selected Files */}
        <AnimatePresence>
          {selectedFiles.length > 0 && (
            <motion.div 
              className="selected-files"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height:  'auto' }}
              exit={{ opacity: 0, height:  0 }}
            >
              <h4>Selected Files ({selectedFiles.length})</h4>
              <div className="files-grid">
                {selectedFiles.map((file, index) => (
                  <motion.div
                    key={index}
                    className="file-preview"
                    initial={{ opacity:  0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale:  0.8 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <img src={file.preview} alt={file.name} />
                    <div className="file-info">
                      <span className="file-name">{file.name}</span>
                      <span className="file-size">{file.size}</span>
                    </div>
                    <button 
                      className="remove-file-btn"
                      onClick={() => removeFile(index)}
                    >
                      <X size={16} />
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <textarea
          placeholder="Add description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="description-input"
          rows="4"
        />

        <motion.button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={selectedFiles.length === 0 || !taskName}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Upload size={20} />
          Submit Proof
        </motion.button>
      </motion.div>

      {/* Submitted Proofs History */}
      <div className="proofs-history">
        <h3>Submission History</h3>
        <div className="proofs-grid">
          {submittedProofs.map((proof, index) => (
            <motion.div
              key={proof.id}
              className="proof-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity:  1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="proof-header-card">
                <div className="proof-thumbnail">{proof.thumbnail}</div>
                <span 
                  className="proof-status"
                  style={{ 
                    backgroundColor: `${getStatusColor(proof.status)}20`,
                    color: getStatusColor(proof.status)
                  }}
                >
                  {proof.status}
                </span>
              </div>
              <h4>{proof.task}</h4>
              <div className="proof-meta">
                <span>
                  <Calendar size={14} />
                  {proof.date}
                </span>
                <span>
                  <Clock size={14} />
                  {proof.time}
                </span>
                <span>
                  <File size={14} />
                  {proof.files} files
                </span>
              </div>
              <div className="proof-actions">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Eye size={16} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Download size={16} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </motion. div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubmitProof;