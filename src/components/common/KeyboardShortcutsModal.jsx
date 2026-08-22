import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, X, Keyboard, Compass, Clock, CalendarCheck, CreditCard, User, Bell, BarChart3 } from 'lucide-react';

export const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    {
      category: 'Global Navigation & Tools',
      items: [
        { keys: ['Ctrl', 'K'], label: 'Open Command Palette / Fast Search' },
        { keys: ['?'], label: 'Open Keyboard Shortcuts Legend' },
        { keys: ['ESC'], label: 'Close Any Open Modal or Drawer' }
      ]
    },
    {
      category: 'Direct Screen Jumps (Command Palette)',
      items: [
        { keys: ['G', 'D'], label: 'Jump to Workspace / Executive Dashboard' },
        { keys: ['G', 'A'], label: 'Jump to Time & Attendance Console' },
        { keys: ['G', 'L'], label: 'Jump to Apply for Leave' },
        { keys: ['G', 'R'], label: 'Jump to Leave Approvals Queue (HR)' },
        { keys: ['G', 'U'], label: 'Jump to Employee Dossier / Profile' },
        { keys: ['G', 'P'], label: 'Jump to My Payslips & Compensation' },
        { keys: ['G', 'O'], label: 'Jump to Org Hierarchy & Tree' },
        { keys: ['G', 'E'], label: 'Jump to Workforce Analytics (HR)' },
        { keys: ['G', 'N'], label: 'Jump to Notifications Center' }
      ]
    },
    {
      category: 'Rapid Actions & Controls',
      items: [
        { keys: ['Enter'], label: 'Execute Selected Command / Submit Form' },
        { keys: ['↑', '↓'], label: 'Navigate Up / Down in Lists & Palette' },
        { keys: ['Tab'], label: 'Cycle Next Input Field' }
      ]
    }
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          backgroundColor: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid var(--color-border)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-bg-secondary)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'var(--primary-50)',
                color: 'var(--color-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Keyboard size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.0625rem', fontWeight: 700, margin: 0, color: 'var(--color-text-heading)' }}>
                Keyboard Shortcuts Legend
              </h3>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                Power-user shortcuts for frictionless navigation
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close shortcuts"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '1.25rem 1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
          {shortcuts.map((sec, idx) => (
            <div key={idx} style={{ marginBottom: idx < shortcuts.length - 1 ? '1.25rem' : 0 }}>
              <div
                style={{
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  color: 'var(--color-text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '0.625rem'
                }}
              >
                {sec.category}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sec.items.map((item, itemIdx) => (
                  <div
                    key={itemIdx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '8px',
                      backgroundColor: 'var(--color-bg-secondary)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-body)', fontWeight: 500 }}>
                      {item.label}
                    </span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {item.keys.map((k, kIdx) => (
                        <kbd
                          key={kIdx}
                          style={{
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--color-border)',
                            fontSize: '0.6875rem',
                            fontFamily: 'var(--font-mono)',
                            color: 'var(--color-text-heading)',
                            fontWeight: 600,
                            boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                          }}
                        >
                          {k}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: 'var(--color-bg-secondary)',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--color-text-muted)'
          }}
        >
          <span>Press <kbd style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>?</kbd> anytime to toggle this modal</span>
          <button
            onClick={onClose}
            style={{
              background: 'var(--color-primary)',
              border: 'none',
              color: '#FFFFFF',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Got it
          </button>
        </div>
      </motion.div>
    </div>
  );
};
