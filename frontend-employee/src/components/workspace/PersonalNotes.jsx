import React, { useState } from 'react';
import { Plus, X, Trash2, CheckCircle2, Pin, PinOff, Share2, Mail, Download } from 'lucide-react';
import { useDataStore } from '../../store/dataStore';
import { motion, AnimatePresence } from 'framer-motion';

import './PersonalNotes.css';

const PersonalNotes = () => {
  const { workspaceNotes, addWorkspaceNote, updateWorkspaceNote, deleteWorkspaceNote } = useDataStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const [selectedColor, setSelectedColor] = useState('#fef08a'); // yellow sticky

  const colors = ['#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#e2e8f0'];

  const handleCreate = async () => {
    if (!newText.trim()) return;
    await addWorkspaceNote({ content: newText, color: selectedColor, status: 'Todo' });
    setNewText('');
    setIsAdding(false);
  };

  const toggleStatus = async (note) => {
    const newStatus = note.status === 'Done' ? 'Todo' : 'Done';
    await updateWorkspaceNote(note._id, { status: newStatus });
  };

  const togglePin = async (note) => {
    await updateWorkspaceNote(note._id, { isPinned: !note.isPinned });
  };

  const shareViaWhatsApp = (content) => {
    const url = `https://wa.me/?text=${encodeURIComponent(content)}`;
    window.open(url, '_blank');
  };

  const shareViaEmail = (content) => {
    const url = `mailto:?subject=Personal Note&body=${encodeURIComponent(content)}`;
    window.location.href = url;
  };

  const exportAsDoc = (content) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `note-${new Date().getTime()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const sortedNotes = [...workspaceNotes].sort((a, b) => {
    if (a.isPinned === b.isPinned) return 0;
    return a.isPinned ? -1 : 1;
  });

  return (
    <div className="personal-notes-container">
      <div className="notes-actions">
        <button className="glass-btn primary-btn add-note-btn" onClick={() => setIsAdding(true)}>
          <Plus size={16} /> New Note
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: 'auto' }} 
            exit={{ opacity: 0, height: 0 }}
            className="add-note-form"
          >
            <div className="color-picker">
              {colors.map(c => (
                <div 
                  key={c} 
                  className={`color-swatch ${selectedColor === c ? 'active' : ''}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setSelectedColor(c)}
                />
              ))}
            </div>
            <textarea 
              autoFocus
              placeholder="Jot down a quick thought..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCreate(); } }}
            />
            <div className="add-note-controls">
              <button className="submit-btn" onClick={handleCreate}>Save</button>
              <button className="cancel-btn" onClick={() => setIsAdding(false)}>Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="notes-grid">
        <AnimatePresence>
          {sortedNotes.map(note => (
            <motion.div 
              key={note._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`sticky-note ${note.status === 'Done' ? 'is-done' : ''} ${note.isPinned ? 'is-pinned' : ''}`}
              style={{ '--note-color': note.color }}
            >
              <div className="note-pin-indicator">
                <button className={`pin-btn ${note.isPinned ? 'active' : ''}`} onClick={() => togglePin(note)}>
                  {note.isPinned ? <Pin size={14} fill="currentColor" /> : <Pin size={14} />}
                </button>
              </div>
              <div className="note-content">{note.content}</div>
              <div className="note-footer">
                <div className="share-actions">
                  <button className="icon-btn share-btn-small" onClick={() => shareViaWhatsApp(note.content)} title="Share on WhatsApp">
                    <Share2 size={12} />
                  </button>
                  <button className="icon-btn share-btn-small" onClick={() => shareViaEmail(note.content)} title="Share via Email">
                    <Mail size={12} />
                  </button>
                  <button className="icon-btn share-btn-small" onClick={() => exportAsDoc(note.content)} title="Download as Text">
                    <Download size={12} />
                  </button>
                </div>
                <div className="status-actions">
                  <button className="icon-btn check-btn" onClick={() => toggleStatus(note)}>
                    <CheckCircle2 size={16} />
                  </button>
                  <button className="icon-btn delete-btn" onClick={() => deleteWorkspaceNote(note._id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {workspaceNotes.length === 0 && !isAdding && (
          <div className="empty-notes">No notes stacked yet. Keep your desk clean!</div>
        )}
      </div>
    </div>
  );
};

export default PersonalNotes;
