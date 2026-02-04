import { useState, useEffect } from 'react';
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

import { storage, auth, realtimeDb } from '../config/firebase';
import { ref as dbRef, onValue, push, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';

import './SubmitProof.css';

const SubmitProof = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [description, setDescription] = useState('');
  const [taskName, setTaskName] = useState('');
  const [submittedProofs, setSubmittedProofs] = useState([]);
  const [stats, setStats] = useState({
    total: 0, approved: 0, pending: 0, rejected: 0
  });
  const [uploading, setUploading] = useState(false);
  const currentUser = auth.currentUser;

  // ---- LIVE DB: Fetch proofs and stats for the current user ----
  useEffect(() => {
    if (!currentUser) return;
    const proofsRef = dbRef(realtimeDb, `users/${currentUser.uid}/proofs`);
    onValue(proofsRef, snap => {
      const val = snap.val() || {};
      const arr = Object.values(val).sort((a, b) => b.submittedAt - a.submittedAt);
      setSubmittedProofs(arr);
      setStats({
        total: arr.length,
        approved: arr.filter(p => p.status === 'approved').length,
        pending: arr.filter(p => p.status === 'pending').length,
        rejected: arr.filter(p => p.status === 'rejected').length
      });
    });
  }, [currentUser]);

  // --- Drag & drop logic (no changes) ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) handleFiles(e.target.files);
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
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // --- Submit and upload files ---
  const handleSubmit = async () => {
    if (!taskName || selectedFiles.length === 0) {
      alert("Task name and file(s) required");
      return;
    }
    setUploading(true);
    const proofDownloads = [];
    for (const fileObj of selectedFiles) {
      const file = fileObj.file;
      const proofStorageRef = storageRef(
        storage,
        `proofs/${currentUser.uid}/${Date.now()}_${file.name}`
      );
      await uploadBytes(proofStorageRef, file);
      const url = await getDownloadURL(proofStorageRef);
      proofDownloads.push({ name: file.name, url });
    }

    // Compose proof entry
    const proofData = {
      id: Date.now(),
      task: taskName,
      description,
      files: proofDownloads, // array of {name, url}
      status: 'pending',
      submittedAt: Date.now(),
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    await push(dbRef(realtimeDb, `users/${currentUser.uid}/proofs`), proofData);
    setTaskName('');
    setDescription('');
    setSelectedFiles([]);
    setUploading(false);
  };

  // --- Status color for cards ---
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#10b981';
      case 'pending': return '#eab308';
      case 'rejected': return '#ef4444';
      default: return '#6b7280';
    }
  };

  // --- Delete proof ---
  const handleDeleteProof = async (proofId) => {
    // Find the Firebase key of the proof
    const proofsRef = dbRef(realtimeDb, `users/${currentUser.uid}/proofs`);
    onValue(proofsRef, snap => {
      snap.forEach(childSnap => {
        if (childSnap.val().id === proofId) {
          remove(dbRef(realtimeDb, `users/${currentUser.uid}/proofs/${childSnap.key}`));
        }
      });
    }, { onlyOnce: true });
  };

  if (!currentUser) return <div>Loading user...</div>;

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
        <motion.div
          className="stat-card"
          style={{ color: '#3b82f6' }}
        >
          <Check size={24} />
          <div className="stat-info">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Submitted</span>
          </div>
        </motion.div>
        <motion.div
          className="stat-card"
          style={{ color: '#10b981' }}
        >
          <Check size={24} />
          <div className="stat-info">
            <span className="stat-value">{stats.approved}</span>
            <span className="stat-label">Approved</span>
          </div>
        </motion.div>
        <motion.div
          className="stat-card"
          style={{ color: '#eab308' }}
        >
          <Check size={24} />
          <div className="stat-info">
            <span className="stat-value">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
        </motion.div>
        <motion.div
          className="stat-card"
          style={{ color: '#ef4444' }}
        >
          <Check size={24} />
          <div className="stat-info">
            <span className="stat-value">{stats.rejected}</span>
            <span className="stat-label">Rejected</span>
          </div>
        </motion.div>
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
          onChange={(e) => setTaskName(e.target.value)}
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
          disabled={selectedFiles.length === 0 || !taskName || uploading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Upload size={20} />
          {uploading ? "Uploading..." : "Submit Proof"}
        </motion.button>
      </motion.div>

      {/* Submitted Proofs History */}
      <div className="proofs-history">
        <h3>Submission History</h3>
        <div className="proofs-grid">
          {submittedProofs.length === 0 && <div>No proofs submitted yet.</div>}
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
                <div className="proof-thumbnail">
                  <ImageIcon />
                </div>
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
                  {proof.files.length} files
                </span>
              </div>
              <div className="proof-actions">
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <a href={proof.files[0]?.url} target="_blank" rel="noopener noreferrer">
                    <Eye size={16} />
                  </a>
                </motion.button>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <a href={proof.files[0]?.url} target="_blank" rel="noopener noreferrer" download>
                    <Download size={16} />
                  </a>
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.1 }} 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleDeleteProof(proof.id)}
                >
                  <Trash2 size={16} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default SubmitProof;