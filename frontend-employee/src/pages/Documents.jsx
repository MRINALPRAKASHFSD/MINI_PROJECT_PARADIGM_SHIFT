import { useState } from 'react';
import { useDataStore } from '../store/dataStore';
import { formatDistanceToNow } from 'date-fns';
import {
  FileText, Upload, Trash2, Search, ShieldCheck, ShieldAlert,
  FolderOpen, File, X, Plus, Filter, Eye, Download,
  CreditCard, GraduationCap, Briefcase, Heart, Award, Building2
} from 'lucide-react';

const categoryIcons = {
  Identity: { icon: CreditCard, color: '#3b82f6' },
  Employment: { icon: Briefcase, color: '#10b981' },
  Education: { icon: GraduationCap, color: '#a855f7' },
  Banking: { icon: Building2, color: '#f59e0b' },
  Tax: { icon: FileText, color: '#ef4444' },
  Insurance: { icon: Heart, color: '#ec4899' },
  Certification: { icon: Award, color: '#06b6d4' },
};

const Documents = () => {
  const { documents, addDocument, deleteDocument } = useDataStore();
  const [showUpload, setShowUpload] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ name: '', category: 'Identity', fileName: '' });

  const categories = ['All', ...Object.keys(categoryIcons)];

  const filtered = documents
    .filter(d => selectedCategory === 'All' || d.category === selectedCategory)
    .filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.fileName.toLowerCase().includes(searchTerm.toLowerCase()));

  const verifiedCount = documents.filter(d => d.verified).length;
  const pendingCount = documents.filter(d => !d.verified).length;

  const handleUpload = () => {
    if (!form.name || !form.fileName) return;
    addDocument({ name: form.name, category: form.category, fileName: form.fileName, size: `${(Math.random() * 3 + 0.2).toFixed(1)} MB` });
    setForm({ name: '', category: 'Identity', fileName: '' });
    setShowUpload(false);
  };

  return (
    <div style={{ padding: '24px', color: '#e2e8f0', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '700', margin: '0 0 6px' }}>My Documents</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '14px', lineHeight: '1.5' }}>
            All your personal and professional documents in one place. Keep them updated for HR compliance.
          </p>
        </div>
        <button onClick={() => setShowUpload(true)}
          style={{ padding: '10px 20px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Upload size={18} /> Upload Document
        </button>
      </div>

      {/* Stats — two small badges, not full cards */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}>
          <ShieldCheck size={16} color="#10b981" />
          <span style={{ fontSize: '13px' }}><strong>{verifiedCount}</strong> verified</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.15)' }}>
          <ShieldAlert size={16} color="#f59e0b" />
          <span style={{ fontSize: '13px' }}><strong>{pendingCount}</strong> pending verification</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <FolderOpen size={16} color="#94a3b8" />
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>{documents.length} total documents</span>
        </div>
      </div>

      {/* Search + Category tabs */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input type="text" placeholder="Search documents..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '9px 14px 9px 38px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#e2e8f0', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: '500', cursor: 'pointer', border: 'none',
                background: selectedCategory === cat ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.03)',
                color: selectedCategory === cat ? '#60a5fa' : '#94a3b8',
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Document grid — intentionally 3 columns, not 2 or 4 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {filtered.length === 0 && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px', color: '#64748b', background: 'rgba(15,23,42,0.4)', borderRadius: '16px' }}>
            {searchTerm ? 'No documents match your search.' : 'No documents in this category yet.'}
          </div>
        )}

        {filtered.map(doc => {
          const catConfig = categoryIcons[doc.category] || { icon: File, color: '#94a3b8' };
          const CIcon = catConfig.icon;

          return (
            <div key={doc.id}
              style={{ background: 'rgba(15,23,42,0.5)', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.05)', transition: 'border-color 0.2s, transform 0.15s', cursor: 'default' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${catConfig.color}30`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {/* Top row: icon + verification badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: `${catConfig.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CIcon size={20} color={catConfig.color} />
                </div>
                {doc.verified ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                    <ShieldCheck size={12} /> Verified
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#f59e0b', background: 'rgba(245,158,11,0.1)', padding: '3px 8px', borderRadius: '6px' }}>
                    <ShieldAlert size={12} /> Pending
                  </div>
                )}
              </div>

              {/* Name and file info */}
              <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{doc.name}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '2px', fontFamily: 'monospace' }}>{doc.fileName}</div>
              <div style={{ fontSize: '11px', color: '#475569', marginBottom: '14px' }}>
                {doc.size} · Uploaded {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button style={{ flex: 1, padding: '7px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Eye size={13} /> View
                </button>
                <button style={{ flex: 1, padding: '7px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <Download size={13} /> Download
                </button>
                <button onClick={() => deleteDocument(doc.id)}
                  style={{ padding: '7px 10px', borderRadius: '8px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.1)', color: '#f87171', fontSize: '12px', cursor: 'pointer' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reminder note */}
      <div style={{ marginTop: '28px', padding: '16px 20px', borderRadius: '12px', background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.1)', fontSize: '13px', color: '#94a3b8', lineHeight: '1.6' }}>
        <strong style={{ color: '#60a5fa' }}>Reminder:</strong> Please ensure all identity documents are up-to-date. Expired documents may affect your KYC compliance status. Contact <span style={{ color: '#60a5fa' }}>compliance@paradigmshift.in</span> for help.
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}
          onClick={() => setShowUpload(false)}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: '#0f172a', borderRadius: '20px', padding: '32px', width: '420px', maxWidth: '95vw', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Upload Document</h2>
              <button onClick={() => setShowUpload(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Document Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Aadhaar Card"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '14px', outline: 'none' }}>
                  {Object.keys(categoryIcons).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', color: '#94a3b8', display: 'block', marginBottom: '6px' }}>File Name</label>
                <input type="text" value={form.fileName} onChange={e => setForm({ ...form, fileName: e.target.value })} placeholder="e.g., Aadhaar_1234.pdf"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#e2e8f0', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>

              {/* Simulated upload area */}
              <div style={{ border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '12px', padding: '32px', textAlign: 'center', color: '#64748b' }}>
                <Upload size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p style={{ margin: '0 0 4px', fontSize: '14px' }}>Drag & drop your file here</p>
                <p style={{ margin: 0, fontSize: '12px' }}>PDF, JPG, PNG up to 10MB</p>
              </div>

              <button onClick={handleUpload}
                style={{ padding: '12px', borderRadius: '12px', background: 'linear-gradient(135deg, #06b6d4, #3b82f6)', border: 'none', color: '#fff', fontSize: '15px', fontWeight: '600', cursor: 'pointer' }}>
                Upload Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Documents;
