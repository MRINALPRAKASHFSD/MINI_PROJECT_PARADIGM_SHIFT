import React, { useEffect } from 'react';
import { useDataStore } from '../../store/dataStore';
import toast from 'react-hot-toast';
import { Bell } from 'lucide-react';

const ReminderEngine = () => {
  const { tasks, updateTask } = useDataStore();

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();

      tasks.forEach(task => {
        if (task.reminderDate && !task.isReminderSent) {
          const reminderTime = new Date(task.reminderDate);
          
          // If reminder time has passed or is within the next minute
          if (reminderTime <= now) {
            triggerReminder(task);
          }
        }
      });
    };

    const triggerReminder = (task) => {
      toast((t) => (
        <span className="reminder-toast">
          <Bell size={18} style={{ color: '#3b82f6', marginRight: '10px' }} />
          <div>
            <b style={{ color: '#f8fafc' }}>Reminder: {task.title}</b>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Don't forget to complete this upcoming goal!</p>
          </div>
        </span>
      ), {
        duration: 8000,
        style: {
          background: '#1e293b',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '12px',
          color: '#fff',
          borderRadius: '12px'
        }
      });

      // Mark as sent in state and backend
      updateTask(task.id, { isReminderSent: true });
    };

    // Check every 30 seconds
    const interval = setInterval(checkReminders, 30000);
    checkReminders(); // Initial check

    return () => clearInterval(interval);
  }, [tasks, updateTask]);

  return null; // Logic only component
};

export default ReminderEngine;
