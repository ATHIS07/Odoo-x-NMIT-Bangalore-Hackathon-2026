import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  CalendarCheck,
  CreditCard,
  Clock,
  Shield,
  ArrowUpRight,
  Filter,
  Sparkles,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Button, Card, Badge } from '../../components/common/CommonUI';

export const NotificationsView = ({ onNavigate }) => {
  const { activeUser } = useAuth();
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useHRMS();

  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = notifications.filter((n) => {
    if (activeFilter === 'unread') return !n.read;
    if (activeFilter === 'leaves') return n.type.includes('leave');
    if (activeFilter === 'payroll') return n.type.includes('payroll');
    if (activeFilter === 'attendance') return n.type.includes('attendance');
    return true;
  });

  const getIcon = (type) => {
    if (type.includes('leave')) return <CalendarCheck size={18} color="var(--emerald-600)" />;
    if (type.includes('payroll')) return <CreditCard size={18} color="var(--primary-600)" />;
    if (type.includes('attendance')) return <Clock size={18} color="var(--amber-600)" />;
    return <Bell size={18} color="var(--purple-600)" />;
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              AWS SNS Event Bus
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Real-Time Push Subscriptions
            </span>
          </div>
          <h1 className="page-title">Notifications & Stream Alerts</h1>
          <p className="page-subtitle">
            Live stream event bus capturing leave status changes, biometric punch events, and payroll disbursement notices.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={CheckCheck} onClick={markAllNotificationsAsRead}>
            Mark All as Read
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <Card style={{ marginBottom: '1.5rem', padding: '0.875rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Alerts' },
            { id: 'unread', label: 'Unread Alerts', badge: notifications.filter((n) => !n.read).length },
            { id: 'leaves', label: 'Leave Workflows' },
            { id: 'payroll', label: 'Payroll & CTC' },
            { id: 'attendance', label: 'Attendance Pushes' }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveFilter(t.id)}
              style={{
                padding: '0.4rem 0.875rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeFilter === t.id ? 'var(--color-primary)' : 'var(--bg-surface-subtle)',
                color: activeFilter === t.id ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '0.8125rem',
                fontWeight: activeFilter === t.id ? 600 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{t.label}</span>
              {t.badge !== undefined && t.badge > 0 && (
                <span
                  style={{
                    fontSize: '0.6875rem',
                    padding: '1px 6px',
                    borderRadius: '999px',
                    backgroundColor: activeFilter === t.id ? 'rgba(255,255,255,0.25)' : 'var(--primary-50)',
                    color: activeFilter === t.id ? '#FFFFFF' : 'var(--color-primary)',
                    fontWeight: 600
                  }}
                >
                  {t.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </Card>

      {/* Notifications Stream Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        <AnimatePresence>
          {filtered.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-tertiary)' }}>
              <Bell size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>No stream events found</div>
              <div style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                You have cleared all alerts for this category.
              </div>
            </Card>
          ) : (
            filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 450, damping: 35 }}
              >
                <Card
                  elevated={!item.read}
                  style={{
                    borderLeft: `4px solid ${
                      item.type.includes('approval') ? 'var(--emerald-500)' : item.type.includes('payroll') ? 'var(--primary-600)' : 'var(--amber-500)'
                    }`,
                    backgroundColor: item.read ? 'var(--bg-surface)' : 'var(--primary-50)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1 }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          backgroundColor: 'var(--bg-surface)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow-xs)',
                          flexShrink: 0
                        }}
                      >
                        {getIcon(item.type)}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
                            {item.title}
                          </span>
                          {!item.read && <Badge variant="active">New Alert</Badge>}
                        </div>

                        <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                          {item.message}
                        </p>

                        <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', marginTop: '0.5rem', fontFamily: 'var(--font-mono)' }}>
                          {item.timestamp} • AWS SNS Stream (ARN: arn:aws:sns:us-west-2:dayflow-events)
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {!item.read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markNotificationAsRead(item.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                      {item.link && (
                        <Button
                          size="sm"
                          variant="secondary"
                          icon={ArrowUpRight}
                          iconPosition="right"
                          onClick={() => {
                            markNotificationAsRead(item.id);
                            const target = item.link.replace('/', '').replace('/', '-');
                            onNavigate(target);
                          }}
                        >
                          View Action
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
