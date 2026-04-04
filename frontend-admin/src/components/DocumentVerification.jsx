import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import { FileCheck2, FileX2, Clock, Search, Shield, Download, Eye, AlertTriangle } from 'lucide-react';
import './DocumentVerification.css';

const CAT_COLORS = {
  Identity: '#3b82f6', Tax: '#ef4444', Education: '#8b5cf6', Employment: '#10b981',
  Banking: '#f59e0b', Insurance: '#06b6d4', Certification: '#ec4899',
};

function DocumentVerification() {
  const { documents: dataStoreDocs, verifyDocument, rejectDocument } = useDataStore();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const docs = dataStoreDocs || [];

  const handleVerify = async (id) => {
    try { await verifyDocument(id); } catch (e) { console.error(e); }
  };
  const handleReject = async (id) => {
    try { await rejectDocument(id); } catch (e) { console.error(e); }
  };

  const filtered = docs.filter(d => {
    const statusLabel = (d.status || '').toLowerCase();
    const matchF = filter === 'All' || statusLabel === filter.toLowerCase();
    const employeeName = d.employeeName || d.employee || '';
    const matchS = !search || employeeName.toLowerCase().includes(search.toLowerCase()) || (d.docName || '').toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const counts = { verified: docs.filter(d => (d.status || '').toLowerCase() === 'verified').length, pending: docs.filter(d => (d.status || '').toLowerCase() === 'pending').length, rejected: docs.filter(d => (d.status || '').toLowerCase() === 'rejected').length };
  return (
    <div className="doc-verification">
      <motion.div className="dv-header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1><Shield size={28} style={{ display: 'inline', verticalAlign: 'middle' }} /> Document Verification</h1>
          <p>Verify and manage employee documents for compliance</p>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div className="dv-stats" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="dv-stat-card">
          <div className="dv-stat-icon verified"><FileCheck2 size={22} /></div>
          <div className="dv-stat-val">{counts.verified}</div>
          <div className="dv-stat-label">Verified</div>
        </div>
        <div className="dv-stat-card">
          <div className="dv-stat-icon pending"><Clock size={22} /></div>
          <div className="dv-stat-val">{counts.pending}</div>
          <div className="dv-stat-label">Pending Review</div>
        </div>
        <div className="dv-stat-card">
          <div className="dv-stat-icon rejected"><FileX2 size={22} /></div>
          <div className="dv-stat-val">{counts.rejected}</div>
          <div className="dv-stat-label">Rejected</div>
        </div>
        <div className="dv-stat-card">
          <div className="dv-stat-icon total"><Shield size={22} /></div>
          <div className="dv-stat-val">{Math.round(counts.verified / docs.length * 100)}%</div>
          <div className="dv-stat-label">Compliance Rate</div>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div className="dv-filters" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div className="dv-search">
          <Search size={16} />
          <input placeholder="Search by employee or document..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="dv-tabs">
          {['All', 'Pending', 'Verified', 'Rejected'].map(f => (
            <button key={f} className={`dv-tab ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Document cards */}
      <div className="dv-grid">
        {filtered.map((doc, i) => (
          <motion.div key={doc.id} className="dv-card glass" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 * i }}>
            <div className="dv-card-top">
              <div className="dv-card-cat" style={{ background: `${CAT_COLORS[doc.category] || '#64748b'}18`, color: CAT_COLORS[doc.category] || '#64748b' }}>
                {doc.category || 'Document'}
              </div>
              <span className={`dv-status ${(doc.status || '').toLowerCase()}`}>
                {(doc.status || '').toLowerCase() === 'verified' && <FileCheck2 size={12} />}
                {(doc.status || '').toLowerCase() === 'pending' && <Clock size={12} />}
                {(doc.status || '').toLowerCase() === 'rejected' && <AlertTriangle size={12} />}
                <span style={{textTransform:'capitalize'}}>{doc.status || 'Pending'}</span>
              </span>
            </div>

            <h3 className="dv-card-title">{doc.docName || doc.fileName}</h3>

            <div className="dv-card-emp">
              <div className="dv-card-avatar">{(doc.employeeName || doc.employee || '?').charAt(0)}</div>
              <div>
                <div className="dv-card-name">{doc.employeeName || doc.employee}</div>
                <div className="dv-card-dept">{doc.dept || 'Engineering'} · {doc.empId || 'EMPX'}</div>
              </div>
            </div>

            <div className="dv-card-meta">
              <span>{doc.fileName}</span>
              <span>{doc.size || '1.0 MB'}</span>
              <span>{doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : 'N/A'}</span>
            </div>

            <div className="dv-card-actions">
              <button className="dv-view-btn" onClick={() => setSelectedDoc(doc)}><Eye size={14} /> View</button>
              <button className="dv-dl-btn"><Download size={14} /></button>
              {(doc.status || '').toLowerCase() === 'pending' && (
                <>
                  <button className="dv-verify-btn" onClick={() => handleVerify(doc.id)}><FileCheck2 size={14} /> Verify</button>
                  <button className="dv-reject-btn" onClick={() => handleReject(doc.id)}><FileX2 size={14} /></button>
                </>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && <div className="dv-empty">No documents found matching your criteria.</div>}

      {/* Detail Modal */}
      {selectedDoc && (
        <div className="dv-modal-overlay" onClick={() => setSelectedDoc(null)}>
          <motion.div className="dv-modal" onClick={e => e.stopPropagation()} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <h2>{selectedDoc.docName || selectedDoc.fileName}</h2>
            <div className="dv-modal-body">
              <div className="dv-modal-row"><span>Employee</span><strong>{selectedDoc.employeeName || selectedDoc.employee} ({selectedDoc.empId || 'EMP00X'})</strong></div>
              <div className="dv-modal-row"><span>Department</span><strong>{selectedDoc.dept || 'Engineering'}</strong></div>
              <div className="dv-modal-row"><span>Category</span><strong>{selectedDoc.category}</strong></div>
              <div className="dv-modal-row"><span>File</span><strong>{selectedDoc.fileName} ({selectedDoc.size || '1.0 MB'})</strong></div>
              <div className="dv-modal-row"><span>Uploaded</span><strong>{selectedDoc.uploadedAt ? new Date(selectedDoc.uploadedAt).toLocaleDateString('en-IN') : 'N/A'}</strong></div>
              <div className="dv-modal-row"><span>Status</span><span className={`dv-status ${(selectedDoc.status || '').toLowerCase()}`} style={{textTransform:'capitalize'}}>{selectedDoc.status || 'Pending'}</span></div>
            </div>
            <div className="dv-modal-actions">
              {(selectedDoc.status || '').toLowerCase() === 'pending' && (
                <>
                  <button className="dv-verify-btn" onClick={() => { handleVerify(selectedDoc.id); setSelectedDoc(null); }}><FileCheck2 size={14} /> Verify Document</button>
                  <button className="dv-reject-btn" onClick={() => { handleReject(selectedDoc.id); setSelectedDoc(null); }}><FileX2 size={14} /> Reject</button>
                </>
              )}
              <button className="dv-close-btn" onClick={() => setSelectedDoc(null)}>Close</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default DocumentVerification;
