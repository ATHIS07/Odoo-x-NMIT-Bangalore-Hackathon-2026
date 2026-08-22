import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export const Badge = ({ children, variant = 'info', dot = true, className = '', style = {} }) => {
  return (
    <span className={`badge badge-${variant} ${className}`} style={style}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
};

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  style = {}
}) => {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = `btn-${variant}`;

  return (
    <motion.button
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      style={{ opacity: disabled || loading ? 0.6 : 1, ...style }}
    >
      {loading ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '14px',
              height: '14px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#FFFFFF',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite'
            }}
          />
          Processing...
        </span>
      ) : (
        <>
          {Icon && iconPosition === 'left' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
          {children}
          {Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
        </>
      )}
    </motion.button>
  );
};

export const Card = ({ children, className = '', elevated = false, style = {}, ...props }) => {
  return (
    <div className={`card ${elevated ? 'card-elevated' : ''} ${className}`} style={style} {...props}>
      {children}
    </div>
  );
};

export const MetricCard = ({
  label,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'var(--primary-600)',
  iconBg = 'var(--primary-50)',
  trend = null, // { value: '+12%', isPositive: true, text: 'vs last month' }
  badge = null
}) => {
  return (
    <div className="metric-card">
      <div className="metric-header">
        <div className="metric-label">{label}</div>
        <div className="metric-icon-wrap" style={{ backgroundColor: iconBg, color: iconColor }}>
          {Icon && <Icon size={18} />}
        </div>
      </div>
      <div>
        <div className="metric-value">{value}</div>
        {subtitle && <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>{subtitle}</div>}
        {trend && (
          <div className="metric-trend" style={{ color: trend.isPositive ? 'var(--emerald-600)' : 'var(--rose-600)' }}>
            <span>{trend.value}</span>
            <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>{trend.text}</span>
          </div>
        )}
        {badge && (
          <div style={{ marginTop: '0.5rem' }}>
            <Badge variant={badge.variant}>{badge.text}</Badge>
          </div>
        )}
      </div>
    </div>
  );
};

export const Modal = ({ isOpen, onClose, title, children, maxWidth = '540px' }) => {
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

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
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
          maxWidth,
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '16px',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0 }}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close modal"
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
        <div style={{ padding: '1.5rem', maxHeight: '80vh', overflowY: 'auto' }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
};
