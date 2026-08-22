import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  Clock,
  CalendarCheck,
  CreditCard,
  User,
  Bell,
  BarChart3,
  Sparkles,
  Zap,
  RotateCcw,
  ArrowRight,
  Shield,
  FileText,
  Compass
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';

export const CommandPalette = ({ isOpen, onClose, onNavigate, onStartTour }) => {
  const { activeUser, switchPersona, isHRorAdmin } = useAuth();
  const { clockIn, clockOut, getTodayAttendance, resetDemoData } = useHRMS();
  
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const todayRecord = getTodayAttendance(activeUser.id);
  const isClockedIn = !!(todayRecord && todayRecord.checkIn && !todayRecord.checkOut);

  const items = [
    // Navigation Items
    {
      id: 'nav_dashboard',
      title: isHRorAdmin ? 'Admin Executive Dashboard' : 'Employee Workspace Dashboard',
      category: 'Navigation',
      icon: LayoutDashboard,
      shortcut: 'G D',
      action: () => { onNavigate(isHRorAdmin ? '/admin/dashboard' : '/dashboard'); onClose(); }
    },
    {
      id: 'nav_attendance',
      title: 'Time & Attendance Console',
      category: 'Navigation',
      icon: Clock,
      shortcut: 'G A',
      action: () => { onNavigate('/attendance'); onClose(); }
    },
    {
      id: 'nav_leave_apply',
      title: 'Apply for Leave / Time-Off',
      category: 'Navigation',
      icon: CalendarCheck,
      shortcut: 'G L',
      action: () => { onNavigate('/leave/apply'); onClose(); }
    },
    ...(isHRorAdmin ? [{
      id: 'nav_leave_approvals',
      title: 'Leave Approvals Triage Queue',
      category: 'Navigation',
      icon: Shield,
      shortcut: 'G R',
      action: () => { onNavigate('/leave/approvals'); onClose(); }
    }] : []),
    {
      id: 'nav_profile',
      title: 'Employee Profile & Vault',
      category: 'Navigation',
      icon: User,
      shortcut: 'G U',
      action: () => { onNavigate('/profile'); onClose(); }
    },
    {
      id: 'nav_notifications',
      title: 'Notifications & Activity Center',
      category: 'Navigation',
      icon: Bell,
      shortcut: 'G N',
      action: () => { onNavigate('/notifications'); onClose(); }
    },
    ...(isHRorAdmin ? [{
      id: 'nav_analytics',
      title: 'Workforce Analytics & Executive Reports',
      category: 'Navigation',
      icon: BarChart3,
      shortcut: 'G E',
      action: () => { onNavigate('/analytics'); onClose(); }
    }] : []),

    // Quick Actions
    {
      id: 'act_punch',
      title: isClockedIn ? 'Clock Out Shift (Stop live punch timer)' : 'Clock In Shift (Start live punch timer)',
      category: 'Quick Actions',
      icon: Zap,
      action: () => {
        if (isClockedIn) clockOut();
        else clockIn();
        onClose();
      }
    },
    {
      id: 'act_tour',
      title: 'Start Interactive Guided Product Tour (Evaluator Walkthrough)',
      category: 'Quick Actions',
      icon: Compass,
      shortcut: '?',
      action: () => {
        onClose();
        onStartTour?.();
      }
    },
    {
      id: 'act_apply_tomorrow',
      title: 'Quick Apply: Casual Leave for Tomorrow',
      category: 'Quick Actions',
      icon: CalendarCheck,
      action: () => {
        onNavigate('/leave/apply');
        onClose();
      }
    },
    {
      id: 'act_switch_sophia',
      title: 'Switch Persona: Sophia Vance (Senior Staff Engineer)',
      category: 'Persona Switchers',
      icon: Sparkles,
      action: () => { switchPersona('employee'); onClose(); }
    },
    {
      id: 'act_switch_marcus',
      title: 'Switch Persona: Marcus Chen (Lead HR Business Partner)',
      category: 'Persona Switchers',
      icon: Sparkles,
      action: () => { switchPersona('hr'); onClose(); }
    },
    {
      id: 'act_switch_elena',
      title: 'Switch Persona: Elena Rostova (VP People & Operations)',
      category: 'Persona Switchers',
      icon: Sparkles,
      action: () => { switchPersona('admin'); onClose(); }
    },
    {
      id: 'act_reset_data',
      title: 'Reset Demo Database to Seed State',
      category: 'System',
      icon: RotateCcw,
      action: () => { resetDemoData(); onClose(); }
    }
  ];

  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '12vh'
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '580px',
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid var(--color-border)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}
          >
            {/* Search Input */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '1rem 1.25rem',
                borderBottom: '1px solid var(--color-border)'
              }}
            >
              <Search size={18} color="var(--color-primary)" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command, screen, or action... (↑ ↓ to navigate, Enter to select)"
                style={{
                  width: '100%',
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.9375rem',
                  color: 'var(--color-text-main)',
                  fontFamily: 'inherit',
                  backgroundColor: 'transparent'
                }}
              />
              <span
                style={{
                  fontSize: '0.6875rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-text-muted)',
                  border: '1px solid var(--color-border)',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--color-bg-light)'
                }}
              >
                ESC
              </span>
            </div>

            {/* Results List */}
            <div style={{ maxHeight: '360px', overflowY: 'auto', padding: '0.5rem' }}>
              {filteredItems.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                  No matching screens or actions found for "{query}".
                </div>
              ) : (
                filteredItems.map((item, index) => {
                  const Icon = item.icon;
                  const isSelected = index === selectedIndex;

                  return (
                    <div
                      key={item.id}
                      onClick={item.action}
                      onMouseEnter={() => setSelectedIndex(index)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.625rem 0.875rem',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        backgroundColor: isSelected ? 'var(--color-primary-light)' : 'transparent',
                        color: isSelected ? 'var(--color-primary)' : 'var(--color-text-main)',
                        transition: 'background-color 0.1s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            borderRadius: '6px',
                            backgroundColor: isSelected ? 'rgba(113, 75, 103, 0.15)' : 'var(--color-bg-light)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Icon size={15} color={isSelected ? 'var(--color-primary)' : 'var(--color-text-body)'} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.875rem', fontWeight: isSelected ? 600 : 500 }}>
                            {item.title}
                          </div>
                          <div style={{ fontSize: '0.6875rem', color: isSelected ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                            {item.category}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {item.shortcut && (
                          <span
                            style={{
                              fontSize: '0.6875rem',
                              fontFamily: 'var(--font-mono)',
                              color: 'var(--color-text-muted)',
                              border: '1px solid var(--color-border)',
                              padding: '1px 5px',
                              borderRadius: '3px',
                              backgroundColor: '#FFFFFF'
                            }}
                          >
                            {item.shortcut}
                          </span>
                        )}
                        <ArrowRight size={14} color={isSelected ? 'var(--color-primary)' : 'transparent'} />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '0.625rem 1rem',
                backgroundColor: 'var(--color-bg-light)',
                borderTop: '1px solid var(--color-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.6875rem',
                color: 'var(--color-text-muted)'
              }}
            >
              <span>Navigation: <kbd style={{ fontFamily: 'var(--font-mono)' }}>↑</kbd> <kbd style={{ fontFamily: 'var(--font-mono)' }}>↓</kbd></span>
              <span>Select: <kbd style={{ fontFamily: 'var(--font-mono)' }}>ENTER</kbd></span>
              <span>Close: <kbd style={{ fontFamily: 'var(--font-mono)' }}>ESC</kbd></span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
