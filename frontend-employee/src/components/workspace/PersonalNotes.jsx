import React, { useState } from 'react';
import { Plus, X, Trash2, CheckCircle2 } from 'lucide-react';
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
          {workspaceNotes.map(note => (
            <motion.div 
              key={note._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`sticky-note ${note.status === 'Done' ? 'is-done' : ''}`}
              style={{ '--note-color': note.color }}
            >
              <div className="note-content">{note.content}</div>
              <div className="note-footer">
                <button className="icon-btn check-btn" onClick={() => toggleStatus(note)}>
                  <CheckCircle2 size={16} />
                </button>
                <button className="icon-btn delete-btn" onClick={() => deleteWorkspaceNote(note._id)}>
                  <Trash2 size={14} />
                </button>
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
