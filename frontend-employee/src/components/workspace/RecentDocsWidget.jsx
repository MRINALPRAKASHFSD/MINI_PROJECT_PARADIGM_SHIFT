import React, { useState } from 'react';
import { FileText, Download, ExternalLink, Plus, X, UploadCloud } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { motion, AnimatePresence } from 'framer-motion';
import './Widgets.css';

const RecentDocsWidget = () => {
  const { documents, addDocument } = useDataStore();
  const [isUploading, setIsUploading] = useState(false);
  const [docTitle, setDocTitle] = useState('');

  const recentDocs = [...documents].sort((a, b) => b.uploadedAt - a.uploadedAt).slice(0, 3);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!docTitle.trim()) return;
    await addDocument({ 
      name: docTitle, 
      category: 'Other' 
    });
    setDocTitle('');
    setIsUploading(false);
  };

  return (
    <div className="workspace-widget docs-widget">
      <div className="widget-header">
        <h3><FileText size={16} /> Recent Files</h3>
        <button className="icon-btn small-btn" onClick={() => setIsUploading(!isUploading)}>
          {isUploading ? <X size={14} /> : <Plus size={14} />}
        </button>
      </div>

      <AnimatePresence>
        {isUploading && (
          <motion.form 
            className="inline-doc-form"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={handleUpload}
          >
            <div className="upload-input-group">
              <input 
                type="text" 
                placeholder="File name..." 
                value={docTitle}
                onChange={e => setDocTitle(e.target.value)}
                autoFocus
              />
              <button type="submit" className="glass-btn submit-small">
                <UploadCloud size={14} />
              </button>
            </div>
            <p className="upload-hint">Uploads to Global Vault</p>
          </motion.form>
        )}
      </AnimatePresence>
      <div className="widget-content list-content">
        {recentDocs.length === 0 ? (
          <p className="empty-state">No documents available.</p>
        ) : (
          recentDocs.map(doc => (
            <div key={doc.id} className="list-item doc-item">
              <div className="doc-info">
                <span className="doc-title">{doc.title}</span>
                <span className="doc-meta">{doc.type}</span>
              </div>
              <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="action-btn">
                <Download size={14} />
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentDocsWidget;
