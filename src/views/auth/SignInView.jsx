import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight, Shield, Sparkles, UserCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/CommonUI';

export const SignInView = ({ onNavigate }) => {
  const { signIn, switchPersona } = useAuth();
  const [email, setEmail] = useState('sophia.vance@dayflow.io');
  const [password, setPassword] = useState('Dayflow@2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await signIn({ email, password });
      if (user.role === 'admin' || user.role === 'hr') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('employee-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Failed to authenticate via Cognito');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPersona = (role) => {
    switchPersona(role);
    if (role === 'admin' || role === 'hr') {
      onNavigate('admin-dashboard');
    } else {
      onNavigate('employee-dashboard');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        backgroundColor: 'var(--bg-app)'
      }}
    >
      {/* Left Editorial Branding Hero */}
      <div
        style={{
          backgroundColor: '#0A0D14',
          color: '#FFFFFF',
          padding: '4rem 3.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid #1E293B',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '3rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: 'var(--primary-600)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '1.25rem',
                color: '#FFFFFF',
                boxShadow: '0 0 24px rgba(37,99,235,0.4)'
              }}
            >
              D
            </div>
            <div>
              <span style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)' }}>
                Dayflow
              </span>
              <span style={{ fontSize: '0.6875rem', color: '#64748B', display: 'block', fontWeight: 600 }}>
                PEOPLE & WORK OS
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '4px 10px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(37,99,235,0.15)',
                border: '1px solid rgba(37,99,235,0.3)',
                color: '#60A5FA',
                fontSize: '0.75rem',
                fontWeight: 700,
                marginBottom: '1.5rem'
              }}
            >
              <Shield size={13} />
              AWS COGNITO AUTHENTICATED
            </div>

            <h1
              style={{
                fontSize: '2.5rem',
                lineHeight: 1.15,
                fontWeight: 700,
                letterSpacing: '-0.035em',
                marginBottom: '1.25rem',
                color: '#F8FAFC'
              }}
            >
              Intelligent workforce orchestration for high-velocity teams.
            </h1>

            <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '480px' }}>
              Precision real-time attendance streams, autonomous leave approval workflows, and role-governed compensation vaults.
            </p>
          </motion.div>
        </div>

        {/* Cloud Architecture Summary Pills */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Cognito RBAC', desc: 'Hardware Token Verified' },
            { label: 'DynamoDB Streams', desc: 'Sub-millisecond State' },
            { label: 'Encrypted S3', desc: 'Vault Documents' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}
            >
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F1F5F9' }}>{item.label}</div>
              <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Login Form */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 2.5rem',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: '420px' }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Sign in to Dayflow</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Enter your corporate credentials or use 1-click hackathon personas below.
            </p>
          </div>

          {/* 1-Click Fast Persona Switchers */}
          <div
            style={{
              padding: '1rem',
              borderRadius: '10px',
              backgroundColor: 'var(--bg-surface-subtle)',
              border: '1px solid var(--border-subtle)',
              marginBottom: '1.75rem'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={13} color="var(--primary-600)" />
              1-Click Demo Personas:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => {
                  setEmail('sophia.vance@dayflow.io');
                  setPassword('Dayflow@2026!');
                  handleQuickPersona('employee');
                }}
                style={{
                  padding: '0.5rem 0.4rem',
                  borderRadius: '6px',
                  border: '1px solid var(--primary-200)',
                  backgroundColor: '#EFF6FF',
                  color: '#1D4ED8',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                👤 Employee<br /><span style={{ fontWeight: 400, fontSize: '0.625rem' }}>Sophia</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('marcus.chen@dayflow.io');
                  setPassword('Dayflow@2026!');
                  handleQuickPersona('hr');
                }}
                style={{
                  padding: '0.5rem 0.4rem',
                  borderRadius: '6px',
                  border: '1px solid #DDD6FE',
                  backgroundColor: '#F5F3FF',
                  color: '#6D28D9',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                👥 HR Lead<br /><span style={{ fontWeight: 400, fontSize: '0.625rem' }}>Marcus</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('elena.rostova@dayflow.io');
                  setPassword('Dayflow@2026!');
                  handleQuickPersona('admin');
                }}
                style={{
                  padding: '0.5rem 0.4rem',
                  borderRadius: '6px',
                  border: '1px solid #FBCFE8',
                  backgroundColor: '#FDF2F8',
                  color: '#BE185D',
                  fontSize: '0.6875rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'center'
                }}
              >
                👑 VP Admin<br /><span style={{ fontWeight: 400, fontSize: '0.625rem' }}>Elena</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Corporate Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="name@dayflow.io"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span>Cognito Password</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--primary-600)', cursor: 'pointer' }}>Forgot?</span>
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.25rem' }}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {error && (
              <div
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--rose-50)',
                  color: 'var(--rose-700)',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem'
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              style={{ width: '100%', marginTop: '0.5rem' }}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to Session
            </Button>
          </form>

          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            New employee without credentials?{' '}
            <button
              onClick={() => onNavigate('signup')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
            >
              Register & Verify via OTP
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
