import { useState } from 'react';
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

  const counts = { 
    verified: docs.filter(d => (d.status || '').toLowerCase() === 'verified').length, 
    pending: docs.filter(d => (d.status || '').toLowerCase() === 'pending').length, 
    rejected: docs.filter(d => (d.status || '').toLowerCase() === 'rejected').length 
  };
  
  const complianceRate = docs.length > 0 ? Math.round(counts.verified / docs.length * 100) : 0;

  return (
    <div className="doc-verification">
      <div className="dv-header">
        <div>
          <h1><Shield size={24} /> Document Compliance</h1>
          <p>Systematic verification of employee documentation and regulatory compliance.</p>
        </div>
      </div>

      <div className="dv-stats-grid">
        <div className="dv-stat-card">
          <div className="dv-stat-icon verified"><FileCheck2 size={20} /></div>
          <div className="dv-stat-info">
            <div className="dv-stat-val">{counts.verified}</div>
            <div className="dv-stat-label">Verified Docs</div>
          </div>
        </div>
        <div className="dv-stat-card">
          <div className="dv-stat-icon pending"><Clock size={20} /></div>
          <div className="dv-stat-info">
            <div className="dv-stat-val">{counts.pending}</div>
            <div className="dv-stat-label">Pending Review</div>
          </div>
        </div>
        <div className="dv-stat-card">
          <div className="dv-stat-icon rejected"><FileX2 size={20} /></div>
          <div className="dv-stat-info">
            <div className="dv-stat-val">{counts.rejected}</div>
            <div className="dv-stat-label">Action Required</div>
          </div>
        </div>
        <div className="dv-stat-card">
          <div className="dv-stat-icon total"><Shield size={20} /></div>
          <div className="dv-stat-info">
            <div className="dv-stat-val">{complianceRate}%</div>
            <div className="dv-stat-label">Compliance Rate</div>
          </div>
        </div>
      </div>

      <div className="dv-controls">
        <div className="dv-search-box">
          <Search size={18} />
          <input 
            placeholder="Filter by employee, document ID, or category..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
          />
        </div>
        <div className="dv-filter-tabs">
          {['All', 'Pending', 'Verified', 'Rejected'].map(f => (
            <button 
              key={f} 
              className={`dv-tab-btn ${filter === f ? 'active' : ''}`} 
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="dv-card-container">
        {filtered.map((doc) => (
          <div key={doc.id} className="dv-document-card">
            <div className="dv-doc-top">
              <span className="dv-doc-category" style={{ borderLeft: `3px solid ${CAT_COLORS[doc.category] || '#64748b'}` }}>
                {doc.category || 'Standard'}
              </span>
              <span className={`dv-badge ${(doc.status || '').toLowerCase()}`}>
                <span className="badge-dot"></span>
                {doc.status || 'Pending'}
              </span>
            </div>

            <h3 className="dv-doc-title">{doc.docName || doc.fileName}</h3>

            <div className="dv-doc-owner">
              <div className="owner-avatar">{(doc.employeeName || doc.employee || '?').charAt(0)}</div>
              <div className="owner-details">
                <div className="owner-name">{doc.employeeName || doc.employee}</div>
                <div className="owner-meta">{doc.dept || 'Department'} · {doc.empId || 'EMP ID'}</div>
              </div>
            </div>

            <div className="dv-doc-meta-info">
              <div className="meta-item">
                <span className="meta-label">File:</span>
                <span className="meta-value">{doc.fileName}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Date:</span>
                <span className="meta-value">
                  {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString('en-GB') : 'N/A'}
                </span>
              </div>
            </div>

            <div className="dv-doc-footer">
              <button className="btn-secondary" onClick={() => setSelectedDoc(doc)}><Eye size={14} /> Review</button>
              <button className="btn-icon"><Download size={14} /></button>
              {(doc.status || '').toLowerCase() === 'pending' && (
                <div className="action-group">
                  <button className="btn-approve" onClick={() => handleVerify(doc.id)}><FileCheck2 size={14} /> Approve</button>
                  <button className="btn-reject-icon" onClick={() => handleReject(doc.id)}><FileX2 size={14} /></button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="dv-no-results">
          <Shield size={48} />
          <p>No documents match the current security filters.</p>
        </div>
      )}

      {selectedDoc && (
        <div className="dv-overlay" onClick={() => setSelectedDoc(null)}>
          <div className="dv-modal-window" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Document Detail</h2>
              <button className="modal-close" onClick={() => setSelectedDoc(null)}>&times;</button>
            </div>
            <div className="modal-content">
              <div className="detail-row"><span>Document Name</span><strong>{selectedDoc.docName || selectedDoc.fileName}</strong></div>
              <div className="detail-row"><span>Employee</span><strong>{selectedDoc.employeeName || selectedDoc.employee}</strong></div>
              <div className="detail-row"><span>Employee ID</span><strong>{selectedDoc.empId || 'N/A'}</strong></div>
              <div className="detail-row"><span>Department</span><strong>{selectedDoc.dept || 'N/A'}</strong></div>
              <div className="detail-row"><span>Category</span><strong>{selectedDoc.category}</strong></div>
              <div className="detail-row"><span>File Size</span><strong>{selectedDoc.size || '1.0 MB'}</strong></div>
              <div className="detail-row"><span>Upload Date</span><strong>{selectedDoc.uploadedAt ? new Date(selectedDoc.uploadedAt).toLocaleString() : 'N/A'}</strong></div>
              <div className="detail-row">
                <span>Current Status</span>
                <span className={`dv-badge ${(selectedDoc.status || '').toLowerCase()}`}>{selectedDoc.status || 'Pending'}</span>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setSelectedDoc(null)}>Close</button>
              {(selectedDoc.status || '').toLowerCase() === 'pending' && (
                <>
                  <button className="btn-approve" onClick={() => { handleVerify(selectedDoc.id); setSelectedDoc(null); }}>Approve Verification</button>
                  <button className="btn-reject" onClick={() => { handleReject(selectedDoc.id); setSelectedDoc(null); }}>Reject</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentVerification;
