import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileCheck2, FileX2, Clock, Search, Shield, Download, Eye, AlertTriangle } from 'lucide-react';
import './DocumentVerification.css';

const DOCS = [
  { id: 1, employee: 'Rajesh Kumar', empId: 'EMP001', dept: 'Engineering', docName: 'Aadhaar Card', category: 'Identity', fileName: 'aadhaar_rajesh.pdf', uploadedOn: '2026-03-10', status: 'Pending', size: '1.2 MB' },
  { id: 2, employee: 'Ananya Gupta', empId: 'EMP003', dept: 'Design', docName: 'PAN Card', category: 'Tax', fileName: 'pan_ananya.pdf', uploadedOn: '2026-03-08', status: 'Verified', size: '0.8 MB' },
  { id: 3, employee: 'Vikram Patel', empId: 'EMP002', dept: 'Engineering', docName: 'B.Tech Degree', category: 'Education', fileName: 'degree_vikram.pdf', uploadedOn: '2026-03-05', status: 'Verified', size: '2.1 MB' },
  { id: 4, employee: 'Priya Sharma', empId: 'EMP005', dept: 'Marketing', docName: 'Passport', category: 'Identity', fileName: 'passport_priya.pdf', uploadedOn: '2026-03-12', status: 'Pending', size: '1.5 MB' },
  { id: 5, employee: 'Rohit Saxena', empId: 'EMP004', dept: 'Engineering', docName: 'Experience Letter', category: 'Employment', fileName: 'exp_letter_rohit.pdf', uploadedOn: '2026-03-14', status: 'Pending', size: '0.6 MB' },
  { id: 6, employee: 'Sneha Iyer', empId: 'EMP008', dept: 'HR', docName: 'Bank Statement', category: 'Banking', fileName: 'bank_sneha.pdf', uploadedOn: '2026-03-01', status: 'Verified', size: '3.4 MB' },
  { id: 7, employee: 'Arjun Reddy', empId: 'EMP007', dept: 'R&D', docName: 'Offer Letter', category: 'Employment', fileName: 'offer_arjun.pdf', uploadedOn: '2026-03-02', status: 'Verified', size: '0.9 MB' },
  { id: 8, employee: 'Diya Sharma', empId: 'EMP006', dept: 'Engineering', docName: 'Health Insurance', category: 'Insurance', fileName: 'insurance_diya.pdf', uploadedOn: '2026-03-18', status: 'Rejected', size: '1.8 MB' },
  { id: 9, employee: 'Mahin Khan', empId: 'EMP009', dept: 'Finance', docName: 'AWS Certification', category: 'Certification', fileName: 'aws_cert_mahin.pdf', uploadedOn: '2026-03-20', status: 'Pending', size: '0.4 MB' },
  { id: 10, employee: 'Rohan Kapoor', empId: 'EMP010', dept: 'Legal', docName: 'Voter ID', category: 'Identity', fileName: 'voter_rohan.pdf', uploadedOn: '2026-03-22', status: 'Pending', size: '0.7 MB' },
];

const CAT_COLORS = {
  Identity: '#3b82f6', Tax: '#ef4444', Education: '#8b5cf6', Employment: '#10b981',
  Banking: '#f59e0b', Insurance: '#06b6d4', Certification: '#ec4899',
};

function DocumentVerification() {
  const [docs, setDocs] = useState(DOCS);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);

  const handleVerify = (id) => setDocs(d => d.map(doc => doc.id === id ? { ...doc, status: 'Verified' } : doc));
  const handleReject = (id) => setDocs(d => d.map(doc => doc.id === id ? { ...doc, status: 'Rejected' } : doc));

  const filtered = docs.filter(d => {
    const matchF = filter === 'All' || d.status === filter;
    const matchS = !search || d.employee.toLowerCase().includes(search.toLowerCase()) || d.docName.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });

  const counts = { verified: docs.filter(d => d.status === 'Verified').length, pending: docs.filter(d => d.status === 'Pending').length, rejected: docs.filter(d => d.status === 'Rejected').length };

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
                {doc.category}
              </div>
              <span className={`dv-status ${doc.status.toLowerCase()}`}>
                {doc.status === 'Verified' && <FileCheck2 size={12} />}
                {doc.status === 'Pending' && <Clock size={12} />}
                {doc.status === 'Rejected' && <AlertTriangle size={12} />}
                {doc.status}
              </span>
            </div>

            <h3 className="dv-card-title">{doc.docName}</h3>

            <div className="dv-card-emp">
              <div className="dv-card-avatar">{doc.employee.charAt(0)}</div>
              <div>
                <div className="dv-card-name">{doc.employee}</div>
                <div className="dv-card-dept">{doc.dept} · {doc.empId}</div>
              </div>
            </div>

            <div className="dv-card-meta">
              <span>{doc.fileName}</span>
              <span>{doc.size}</span>
              <span>{new Date(doc.uploadedOn).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            </div>

            <div className="dv-card-actions">
              <button className="dv-view-btn" onClick={() => setSelectedDoc(doc)}><Eye size={14} /> View</button>
              <button className="dv-dl-btn"><Download size={14} /></button>
              {doc.status === 'Pending' && (
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
            <h2>{selectedDoc.docName}</h2>
            <div className="dv-modal-body">
              <div className="dv-modal-row"><span>Employee</span><strong>{selectedDoc.employee} ({selectedDoc.empId})</strong></div>
              <div className="dv-modal-row"><span>Department</span><strong>{selectedDoc.dept}</strong></div>
              <div className="dv-modal-row"><span>Category</span><strong>{selectedDoc.category}</strong></div>
              <div className="dv-modal-row"><span>File</span><strong>{selectedDoc.fileName} ({selectedDoc.size})</strong></div>
              <div className="dv-modal-row"><span>Uploaded</span><strong>{new Date(selectedDoc.uploadedOn).toLocaleDateString('en-IN')}</strong></div>
              <div className="dv-modal-row"><span>Status</span><span className={`dv-status ${selectedDoc.status.toLowerCase()}`}>{selectedDoc.status}</span></div>
            </div>
            <div className="dv-modal-actions">
              {selectedDoc.status === 'Pending' && (
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
