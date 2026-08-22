import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, X, ArrowUpRight, Sparkles, Clock, CreditCard, CalendarCheck, ShieldAlert } from 'lucide-react';
import { useHRMS } from '../../context/HRMSContext';
import { Button, Badge } from '../common/CommonUI';

export const NotificationDrawer = ({ isOpen, onClose, onNavigate }) => {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useHRMS();
  const [filter, setFilter] = useState('all');

  const filtered = notifications.filter((n) => {
    if (filter === 'unread') return !n.read;
    if (filter === 'leaves') return n.type.includes('leave');
    if (filter === 'payroll') return n.type.includes('payroll');
    if (filter === 'attendance') return n.type.includes('attendance');
    return true;
  });

  const getIcon = (type) => {
    if (type.includes('leave')) return <CalendarCheck size={16} color="var(--emerald-600)" />;
    if (type.includes('payroll')) return <CreditCard size={16} color="var(--primary-600)" />;
    if (type.includes('attendance')) return <Clock size={16} color="var(--amber-600)" />;
    return <Bell size={16} color="var(--purple-600)" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 9995,
            display: 'flex',
            justifyContent: 'flex-end'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 400, damping: 35 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '440px',
              height: '100%',
              backgroundColor: 'var(--bg-surface)',
              borderLeft: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Drawer Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={20} color="var(--primary-600)" />
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>Notification Stream</h3>
                <span
                  style={{
                    fontSize: '0.6875rem',
                    padding: '2px 7px',
                    borderRadius: '9999px',
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary-700)',
                    fontWeight: 700
                  }}
                >
                  SNS Live
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={markAllNotificationsAsRead}
                  title="Mark all as read"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <CheckCheck size={16} /> Mark all read
                </button>
                <button
                  onClick={onClose}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-tertiary)',
                    cursor: 'pointer',
                    padding: '4px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div
              style={{
                display: 'flex',
                padding: '0.75rem 1.5rem',
                gap: '0.5rem',
                borderBottom: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-subtle)',
                overflowX: 'auto'
              }}
            >
              {[
                { id: 'all', label: 'All Alerts' },
                { id: 'unread', label: 'Unread' },
                { id: 'leaves', label: 'Leaves' },
                { id: 'payroll', label: 'Payroll' },
                { id: 'attendance', label: 'Attendance' }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setFilter(t.id)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: filter === t.id ? 'var(--bg-surface)' : 'transparent',
                    color: filter === t.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: filter === t.id ? 700 : 500,
                    boxShadow: filter === t.id ? 'var(--shadow-xs)' : 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Notifications List */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filtered.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-tertiary)' }}>
                  <Bell size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>No notifications found</div>
                  <div style={{ fontSize: '0.75rem' }}>You're completely caught up on all stream alerts.</div>
                </div>
              ) : (
                filtered.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => {
                      markNotificationAsRead(item.id);
                      if (item.link && onNavigate) {
                        const target = item.link.replace('/', '').replace('/', '-');
                        onNavigate(target);
                        onClose();
                      }
                    }}
                    style={{
                      padding: '1rem',
                      borderRadius: '10px',
                      border: '1px solid',
                      borderColor: item.read ? 'var(--border-subtle)' : 'var(--primary-200)',
                      backgroundColor: item.read ? 'var(--bg-surface)' : 'var(--primary-50)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative'
                    }}
                  >
                    {!item.read && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: 'var(--primary-600)'
                        }}
                      />
                    )}

                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          backgroundColor: 'var(--bg-surface)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: 'var(--shadow-xs)'
                        }}
                      >
                        {getIcon(item.type)}
                      </div>

                      <div style={{ flex: 1, minWidth: 0, paddingRight: '1rem' }}>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                          {item.message}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                          {item.timestamp} • AWS SNS Stream
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
