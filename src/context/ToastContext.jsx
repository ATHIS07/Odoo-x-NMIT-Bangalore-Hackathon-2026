import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X, Bell } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, message, type = 'info', duration = 4500, link = null }) => {
    // Floating toast notifications disabled as requested
    return;
  }, []);

  const showSNSToast = useCallback(({ title, message, type = 'info' }) => {
    showToast({
      title,
      message,
      type
    });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showSNSToast }}>
      {children}
      
      {/* Floating System Alert Toast Stack */}
      <div className="toast-container" aria-live="polite">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const isWarning = toast.type === 'warning';

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } }}
                transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                className="toast-item"
                style={{
                  borderLeft: `4px solid ${
                    isSuccess ? 'var(--emerald-500)' : isError ? 'var(--rose-500)' : isWarning ? 'var(--amber-500)' : 'var(--primary-500)'
                  }`
                }}
              >
                <div style={{ flexShrink: 0 }}>
                  {isSuccess && <CheckCircle2 size={20} color="var(--emerald-500)" />}
                  {isError && <AlertCircle size={20} color="var(--rose-500)" />}
                  {isWarning && <AlertCircle size={20} color="var(--amber-500)" />}
                  {!isSuccess && !isError && !isWarning && <Bell size={20} color="var(--primary-500)" />}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
                    {toast.title}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '0.125rem', wordBreak: 'break-word', lineHeight: 1.4 }}>
                    {toast.message}
                  </div>
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  aria-label="Dismiss notification"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
