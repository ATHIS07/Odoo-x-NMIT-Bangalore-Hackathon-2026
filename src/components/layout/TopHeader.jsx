import React, { useState, useEffect } from 'react';
import { Bell, Search, Shield, Zap, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Badge } from '../common/CommonUI';

export const TopHeader = ({ onOpenNotifications, onRouteChange, onOpenCommandPalette }) => {
  const { activeUser, role, isAdmin, isHR, impersonatedUser, stopImpersonation } = useAuth();
  const { notifications, simulateLatency } = useHRMS();

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header
      style={{
        height: '64px',
        backgroundColor: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 90
      }}
    >
      {/* Search & Breadcrumbs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, maxWidth: '480px' }}>
        <div
          onClick={onOpenCommandPalette}
          style={{
            position: 'relative',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px' }} />
          <input
            type="text"
            readOnly
            onClick={onOpenCommandPalette}
            placeholder="Search employees, actions, or jump anywhere... (Ctrl+K)"
            style={{
              width: '100%',
              padding: '0.5rem 0.875rem 0.5rem 2.25rem',
              fontSize: '0.8125rem',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-sans)',
              cursor: 'pointer'
            }}
          />
          <kbd
            style={{
              position: 'absolute',
              right: '10px',
              fontSize: '0.6875rem',
              fontFamily: 'var(--font-mono)',
              color: 'var(--text-tertiary)',
              border: '1px solid var(--border-subtle)',
              padding: '2px 5px',
              borderRadius: '4px',
              backgroundColor: 'var(--bg-surface)'
            }}
          >
            Ctrl+K
          </kbd>
        </div>
      </div>

      {/* Right Action Icons & User Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Live Clock */}
        <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className="pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--emerald-500)' }} />
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} IST
        </div>

        {/* Lambda Latency Simulation Indicator */}
        {simulateLatency && (
          <span
            style={{
              fontSize: '0.6875rem',
              padding: '2px 8px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(217, 119, 6, 0.1)',
              color: '#D97706',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <Zap size={12} /> Lambda ~450ms
          </span>
        )}

        {/* Role Pill */}
        <Badge variant={role === 'hr' ? 'role-hr' : 'role-employee'}>
          {role === 'hr' ? 'HR LEAD' : 'EMPLOYEE'}
        </Badge>

        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          style={{
            position: 'relative',
            background: 'var(--bg-surface-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'var(--text-primary)'
          }}
          aria-label="Open notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: 'var(--rose-600)',
                color: '#FFFFFF',
                fontSize: '0.625rem',
                fontWeight: 800,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-surface)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Mini Avatar Trigger */}
        <div
          onClick={() => onRouteChange('profile')}
          style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', padding: '4px', borderRadius: '8px' }}
        >
          <img
            src={activeUser.avatar}
            alt={activeUser.name}
            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--border-subtle)' }}
          />
        </div>
      </div>
    </header>
  );
};
