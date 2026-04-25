import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDataStore } from '../store/dataStore';
import { formatDistanceToNow } from 'date-fns';
import {
  FileText, Upload, Trash2, Search, ShieldCheck, ShieldAlert,
  FolderOpen, File, X, Plus, Eye, Download,
  CreditCard, GraduationCap, Briefcase, Heart, Award, Building2,
  Info, ArrowRight, CloudUpload, Sparkles
} from 'lucide-react';

const categoryIcons = {
  Identity: { icon: CreditCard, color: 'var(--primary)' },
  Employment: { icon: Briefcase, color: 'var(--secondary)' },
  Education: { icon: GraduationCap, color: '#a855f7' },
  Banking: { icon: Building2, color: '#f59e0b' },
  Tax: { icon: FileText, color: '#f43f5e' },
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
    <div style={{ padding: '24px', minHeight: '100vh', position: 'relative' }}>
      {/* Background Ambient Glows */}
      <div className="ambient-glow" style={{ top: '5%', left: '15%', background: 'var(--primary-glow)', width: '380px', height: '380px' }} />
      <div className="ambient-glow" style={{ bottom: '15%', right: '5%', background: 'var(--secondary-glow)', width: '400px', height: '400px' }} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ width: '64px', height: '64px', borderRadius: '20px', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 12px 25px var(--primary-glow)' }}>
            <FolderOpen size={32} color="#fff" />
          </motion.div>
          <div>
            <h1 style={{ margin: 0, fontSize: '34px', fontWeight: '800', letterSpacing: '-1px' }}>Document Vault</h1>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '15px', fontWeight: '500' }}>Secure repository for your professional and identity credentials</p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05, boxShadow: '0 12px 30px var(--primary-glow)' }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUpload(true)}
          style={{ background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '18px', padding: '14px 32px', fontSize: '15px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <Upload size={20} strokeWidth={3} /> Upload New File
        </motion.button>
      </div>

      {/* Quick Summary Badges */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', flexWrap: 'wrap', position: 'relative', zIndex: 10 }}>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', borderRadius: '16px', border: '1px solid var(--border-glass)', background: 'rgba(16,185,129,0.05)' }}>
          <ShieldCheck size={18} color="#10b981" />
          <span style={{ fontSize: '14px', fontWeight: '800' }}>{verifiedCount} Verified</span>
        </div>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', borderRadius: '16px', border: '1px solid var(--border-glass)', background: 'rgba(245,158,11,0.05)' }}>
          <ShieldAlert size={18} color="#f59e0b" />
          <span style={{ fontSize: '14px', fontWeight: '800' }}>{pendingCount} Pending Verification</span>
        </div>
        <div className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 24px', borderRadius: '16px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)' }}>
          <File size={18} color="var(--text-muted)" />
          <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-muted)' }}>{documents.length} Total Documents</span>
        </div>
      </div>

      {/* Filters & Search */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '32px', flexWrap: 'wrap', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div className="glass-panel" style={{ position: 'relative', width: '320px', borderRadius: '16px', border: '1px solid var(--border-glass)', overflow: 'hidden' }}>
          <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by name or file..." 
            value={searchTerm} 
            onChange={e => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '14px 14px 14px 48px', background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', fontWeight: '600', outline: 'none' }} 
          />
        </div>
        <div className="glass-panel" style={{ display: 'flex', gap: '8px', padding: '6px', borderRadius: '16px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.02)' }}>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '10px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: '800', cursor: 'pointer', border: 'none',
                background: selectedCategory === cat ? 'var(--primary)' : 'transparent',
                color: selectedCategory === cat ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
        {filtered.map(doc => {
          const catConfig = categoryIcons[doc.category] || { icon: File, color: 'var(--text-muted)' };
          const CIcon = catConfig.icon;

          return (
            <motion.div 
              key={doc.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, borderColor: `${catConfig.color}40` }}
              className="glass-panel"
              style={{ borderRadius: '28px', padding: '28px', border: '1px solid var(--border-glass)', position: 'relative' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: `${catConfig.color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${catConfig.color}20` }}>
                  <CIcon size={28} color={catConfig.color} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '900', color: doc.verified ? '#10b981' : '#f59e0b', background: doc.verified ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', padding: '6px 14px', borderRadius: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {doc.verified ? <ShieldCheck size={14} strokeWidth={3} /> : <ShieldAlert size={14} strokeWidth={3} />}
                  {doc.verified ? 'Verified' : 'Pending'}
                </div>
              </div>

              <div style={{ fontWeight: '800', fontSize: '18px', color: 'var(--text-primary)', marginBottom: '6px' }}>{doc.name}</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '4px', fontFamily: '"JetBrains Mono", monospace', fontWeight: '500' }}>{doc.fileName}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '24px', fontWeight: '700' }}>
                {doc.size} · {formatDistanceToNow(new Date(doc.uploadedAt), { addSuffix: true })}
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <motion.button whileHover={{ scale: 1.05 }} style={{ flex: 1, padding: '12px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: 'var(--primary)', fontSize: '13px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Eye size={16} strokeWidth={2.5} /> View
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} style={{ flex: 1, padding: '12px', borderRadius: '14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-glass)', color: 'var(--primary)', fontSize: '13px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Download size={16} strokeWidth={2.5} /> Download
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.05, background: 'rgba(239,68,68,0.2)' }}
                  onClick={() => deleteDocument(doc.id)}
                  style={{ padding: '12px', borderRadius: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#f43f5e', cursor: 'pointer' }}
                >
                  <Trash2 size={16} strokeWidth={2.5} />
                </motion.button>
              </div>
            </motion.div>
          ))}
          
          {filtered.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '100px 40px', background: 'rgba(255,255,255,0.01)', borderRadius: '32px', border: '2px dashed var(--border-glass)' }}>
              <FileText size={64} style={{ opacity: 0.1, marginBottom: '24px' }} />
              <p style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-muted)' }}>No matches in your vault.</p>
            </div>
          )}
        </div>

      {/* Compliance Notice */}
      <div className="glass-panel" style={{ marginTop: '48px', padding: '32px', borderRadius: '28px', border: '1px solid var(--border-glass)', display: 'flex', alignItems: 'center', gap: '24px', background: 'linear-gradient(90deg, rgba(79,70,229,0.05), transparent)' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Info size={28} color="var(--primary)" /></div>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7', fontWeight: '600' }}>
            <span style={{ color: 'var(--primary)', fontWeight: '900' }}>Verification Sync:</span> HR compliance requires latest identity copies. 
            Aadhaar or Passport renewals must be updated within 15 days of issuance. Need help? 
            Visit our <span style={{ color: 'var(--primary)', fontWeight: '800', cursor: 'pointer' }}>Support Portal</span>.
          </p>
        </div>
        <motion.button whileHover={{ x: 5 }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
          Contact HR <ArrowRight size={18} />
        </motion.button>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setShowUpload(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
            <motion.div onClick={e => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-panel" style={{ padding: '40px', borderRadius: '40px', maxWidth: '500px', width: '100%', border: '1px solid var(--border-glass)', boxShadow: '0 30px 100px rgba(0,0,0,0.6)' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(79,70,229,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CloudUpload size={24} color="var(--primary)" /></div>
                  <h2 style={{ margin: 0, fontSize: '24px', fontWeight: '900' }}>Secure Upload</h2>
                </div>
                <button onClick={() => setShowUpload(false)} style={{ background: 'rgba(255,255,255,0.05)', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={24} /></button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', display: 'block', marginBottom: '10px' }}>Document Name</label>
                  <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g., Q3 Performance Award"
                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff', fontSize: '15px', fontWeight: '600', outline: 'none' }} />
                </div>

                <div>
                  <label style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: '800', display: 'block', marginBottom: '10px' }}>Classification</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-glass)', color: '#fff', fontSize: '15px', fontWeight: '600', outline: 'none', cursor: 'pointer' }}>
                    {Object.keys(categoryIcons).map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ border: '2px dashed var(--border-glass)', borderRadius: '24px', padding: '48px', textAlign: 'center', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.01)' }}>
                  <CloudUpload size={48} style={{ marginBottom: '16px', color: 'var(--primary)', opacity: 0.8 }} />
                  <p style={{ margin: '0 0 8px', fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>Select or Drag File</p>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600' }}>PDF, PNG, JPG (Max 10MB)</p>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.02, boxShadow: '0 12px 30px var(--primary-glow)' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpload}
                  style={{ width: '100%', padding: '20px', borderRadius: '20px', border: 'none', background: 'var(--primary)', color: '#fff', fontSize: '16px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                  <Sparkles size={20} strokeWidth={3} /> Finalize Upload
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Documents;
