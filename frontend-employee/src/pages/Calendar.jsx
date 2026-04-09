import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, MapPin, Users, Video } from 'lucide-react';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const events = {
    3: [{ title: 'Sprint Planning', time: '10:00 AM', type: 'meeting', color: '#3b82f6' }],
    7: [{ title: 'Code Review', time: '2:00 PM', type: 'task', color: '#10b981' }],
    10: [{ title: 'Team Standup', time: '9:30 AM', type: 'meeting', color: '#a855f7' }, { title: 'Design Review', time: '3:00 PM', type: 'meeting', color: '#f59e0b' }],
    14: [{ title: 'Sprint Demo', time: '11:00 AM', type: 'meeting', color: '#3b82f6' }],
    18: [{ title: 'HR Meeting', time: '1:00 PM', type: 'meeting', color: '#ec4899' }],
    21: [{ title: 'Deadline: API v2', time: '5:00 PM', type: 'deadline', color: '#ef4444' }],
    25: [{ title: 'Team Lunch', time: '12:30 PM', type: 'social', color: '#f97316' }],
    28: [{ title: 'Performance Review', time: '10:00 AM', type: 'meeting', color: '#8b5cf6' }],
  };

  const upcomingEvents = [
    { title: 'Sprint Planning with Vikram', time: '10:00 - 11:00 AM', date: 'Today', location: 'Meeting Room - Lotus', attendees: 8, type: 'video', color: '#3b82f6' },
    { title: 'Code Review - Priya Sharma', time: '2:00 - 3:30 PM', date: 'Today', location: 'Google Meet', attendees: 4, type: 'video', color: '#10b981' },
    { title: 'Design Review with Deepika', time: '9:00 - 10:00 AM', date: 'Tomorrow', location: 'Room - Tulsi', attendees: 6, type: 'in-person', color: '#a855f7' },
    { title: 'Sprint Demo - All Hands', time: '11:00 AM - 12:00 PM', date: 'Apr 14', location: 'Main Hall - Jasmine', attendees: 15, type: 'hybrid', color: '#f59e0b' },
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const cardStyle = { background: 'rgba(15,23,42,0.6)', borderRadius: '20px', padding: '28px', border: '1px solid rgba(255,255,255,0.06)' };

  const isToday = (day) => today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
  const isSelected = (day) => selectedDate.getDate() === day && selectedDate.getMonth() === month && selectedDate.getFullYear() === year;

  return (
    <div style={{ padding: '24px', color: '#e2e8f0', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}
            style={{ width: '52px', height: '52px', borderRadius: '16px', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CalendarIcon size={28} />
          </motion.div>
          <div>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '700' }}>Calendar</h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Manage your schedule and events</p>
          </div>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
        {/* Calendar Grid */}
        <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={cardStyle}>
          {/* Month Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prevMonth}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#e2e8f0' }}>
              <ChevronLeft size={20} />
            </motion.button>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '600' }}>{monthName} {year}</h2>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={nextMonth}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#e2e8f0' }}>
              <ChevronRight size={20} />
            </motion.button>
          </div>

          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
            {days.map(day => (
              <div key={day} style={{ textAlign: 'center', padding: '8px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>{day}</div>
            ))}
          </div>

          {/* Date Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
            {[...Array(firstDay)].map((_, i) => <div key={`empty-${i}`} />)}
            {[...Array(daysInMonth)].map((_, i) => {
              const day = i + 1;
              const hasEvents = events[day];
              return (
                <motion.button key={day} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedDate(new Date(year, month, day))}
                  style={{
                    width: '100%', aspectRatio: '1', borderRadius: '14px', cursor: 'pointer', position: 'relative',
                    background: isSelected(day) ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : isToday(day) ? 'rgba(59,130,246,0.15)' : 'transparent',
                    color: isSelected(day) ? '#fff' : isToday(day) ? '#3b82f6' : '#e2e8f0',
                    fontWeight: isToday(day) || isSelected(day) ? '700' : '400', fontSize: '15px',
                    border: isToday(day) && !isSelected(day) ? '2px solid #3b82f6' : '1px solid transparent',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '4px',
                  }}>
                  {day}
                  {hasEvents && (
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {hasEvents.slice(0, 3).map((e, ei) => (
                        <div key={ei} style={{ width: '5px', height: '5px', borderRadius: '50%', background: isSelected(day) ? '#fff' : e.color }} />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Upcoming Events Sidebar */}
        <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} style={cardStyle}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Clock size={20} style={{ color: '#3b82f6' }} /> Upcoming Events
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {upcomingEvents.map((event, i) => (
              <motion.div key={i} whileHover={{ x: 5, scale: 1.01 }}
                style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '16px', padding: '18px', border: '1px solid rgba(255,255,255,0.05)', borderLeft: `4px solid ${event.color}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: event.color, fontWeight: '600', background: `${event.color}15`, padding: '4px 10px', borderRadius: '8px' }}>{event.date}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{event.type === 'video' ? '📹' : event.type === 'hybrid' ? '🔄' : '📍'} {event.type}</span>
                </div>
                <h4 style={{ margin: '0 0 6px 0', fontSize: '15px', fontWeight: '600' }}>{event.title}</h4>
                <div style={{ display: 'flex', gap: '14px', fontSize: '13px', color: '#64748b' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {event.time}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={12} /> {event.attendees}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '12px', color: '#64748b' }}>
                  <MapPin size={12} /> {event.location}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Calendar;
