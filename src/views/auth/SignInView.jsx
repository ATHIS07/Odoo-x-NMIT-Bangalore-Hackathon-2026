import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Lock,
  Mail,
  ArrowRight,
  Shield,
  Sparkles,
  UserCheck,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  KeyRound,
  X,
  Server,
  Activity
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/CommonUI';

export const SignInView = ({ onNavigate }) => {
  const { signIn, switchPersona, requestPasswordReset, confirmPasswordReset } = useAuth();
  const [email, setEmail] = useState('sophia.vance@dayflow.io');
  const [password, setPassword] = useState('Dayflow@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP + New Password
  const [forgotEmail, setForgotEmail] = useState('sophia.vance@dayflow.io');
  const [forgotOtp, setForgotOtp] = useState('932140');
  const [forgotNewPassword, setForgotNewPassword] = useState('Dayflow@2026Secure!');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

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

  const handleRequestForgot = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);
    try {
      await requestPasswordReset(forgotEmail);
      setForgotStep(2);
    } catch (err) {
      setForgotError(err.message || 'Failed to send reset code');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleConfirmForgot = async (e) => {
    e.preventDefault();
    setForgotError('');
    setForgotLoading(true);
    try {
      await confirmPasswordReset({
        email: forgotEmail,
        code: forgotOtp,
        newPassword: forgotNewPassword
      });
      setIsForgotModalOpen(false);
      setForgotStep(1);
      setEmail(forgotEmail);
      setPassword(forgotNewPassword);
    } catch (err) {
      setForgotError(err.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleSSOLogin = (provider) => {
    // Quick demo login feedback
    handleQuickPersona('employee');
  };

  return (
    <div className="auth-wrapper">
      {/* Left Editorial Branding Hero */}
      <div className="auth-hero">
        <div className="auth-hero-glow" />
        <div className="auth-hero-glow-bottom" />
        <div className="auth-hero-grid-pattern" />

        {/* Top Brand Bar */}
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '2.5rem' }}>
            <div className="auth-brand-badge">
              D
            </div>
            <div>
              <span style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)', color: '#FFFFFF' }}>
                Dayflow
              </span>
              <span style={{ fontSize: '0.6875rem', color: '#64748B', display: 'block', fontWeight: 700, letterSpacing: '0.06em' }}>
                PEOPLE & WORK OS
              </span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '5px 12px',
                borderRadius: '9999px',
                backgroundColor: 'rgba(37, 99, 235, 0.15)',
                border: '1px solid rgba(37, 99, 235, 0.35)',
                color: '#60A5FA',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '1.5rem'
              }}
            >
              <Shield size={14} />
              AWS COGNITO AUTHENTICATED • SOC2 TYPE II
            </div>

            <h1
              style={{
                fontSize: '2.4rem',
                lineHeight: 1.18,
                fontWeight: 700,
                letterSpacing: '-0.035em',
                marginBottom: '1.25rem',
                color: '#F8FAFC'
              }}
            >
              Intelligent workforce orchestration for high-velocity teams.
            </h1>

            <p style={{ fontSize: '0.975rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '490px' }}>
              Precision real-time attendance streams, autonomous leave approval workflows, and role-governed compensation vaults on AWS serverless fabric.
            </p>
          </motion.div>
        </div>

        {/* Cloud Architecture Summary Pills & Live Health Bar */}
        <div style={{ position: 'relative', zIndex: 2, marginTop: '2.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Cognito RBAC', desc: 'Hardware Token Verified' },
              { label: 'DynamoDB Streams', desc: 'Sub-millisecond State' },
              { label: 'Encrypted S3', desc: '256-bit AES Vault' }
            ].map((item, idx) => (
              <div
                key={idx}
                style={{
                  padding: '0.75rem 0.875rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#F1F5F9' }}>{item.label}</div>
                <div style={{ fontSize: '0.6875rem', color: '#64748B', marginTop: '2px' }}>{item.desc}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.625rem 1rem',
              borderRadius: '8px',
              backgroundColor: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              fontSize: '0.75rem'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#94A3B8' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10B981', display: 'inline-block' }} className="pulse-dot" />
              All AWS Services Operational
            </span>
            <span style={{ color: '#64748B', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>us-west-2 (Oregon)</span>
          </div>
        </div>
      </div>

      {/* Right Login Form Container */}
      <div className="auth-form-container">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="auth-form-card"
        >
          {/* Top Auth Navigation Tabs (Sign In / Sign Up) */}
          <div className="auth-tab-group">
            <button
              type="button"
              className="auth-tab-btn active"
              onClick={() => {}}
            >
              <Lock size={14} />
              Sign In
            </button>
            <button
              type="button"
              className="auth-tab-btn"
              onClick={() => onNavigate('signup')}
            >
              <Sparkles size={14} />
              Create Account
            </button>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
              Sign in to Dayflow
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Enter your corporate credentials or use 1-click hackathon personas below.
            </p>
          </div>

          {/* 1-Click Fast Persona Switchers */}
          <div className="auth-persona-card">
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.625rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={13} color="var(--primary-600)" />
              1-Click Demo Personas:
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              <button
                type="button"
                className="auth-persona-btn"
                onClick={() => {
                  setEmail('sophia.vance@dayflow.io');
                  setPassword('Dayflow@2026!');
                  handleQuickPersona('employee');
                }}
                style={{
                  border: '1px solid var(--primary-200)',
                  backgroundColor: '#EFF6FF',
                  color: '#1D4ED8'
                }}
              >
                <span>👤 Employee</span>
                <span style={{ fontWeight: 500, fontSize: '0.6875rem', color: '#3B82F6' }}>Sophia (Staff Eng)</span>
              </button>

              <button
                type="button"
                className="auth-persona-btn"
                onClick={() => {
                  setEmail('marcus.chen@dayflow.io');
                  setPassword('Dayflow@2026!');
                  handleQuickPersona('hr');
                }}
                style={{
                  border: '1px solid #DDD6FE',
                  backgroundColor: '#F5F3FF',
                  color: '#6D28D9'
                }}
              >
                <span>👥 HR Lead</span>
                <span style={{ fontWeight: 500, fontSize: '0.6875rem', color: '#8B5CF6' }}>Marcus (People Ops)</span>
              </button>

              <button
                type="button"
                className="auth-persona-btn"
                onClick={() => {
                  setEmail('elena.rostova@dayflow.io');
                  setPassword('Dayflow@2026!');
                  handleQuickPersona('admin');
                }}
                style={{
                  border: '1px solid #FBCFE8',
                  backgroundColor: '#FDF2F8',
                  color: '#BE185D'
                }}
              >
                <span>👑 VP Admin</span>
                <span style={{ fontWeight: 500, fontSize: '0.6875rem', color: '#EC4899' }}>Elena (Exec Admin)</span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Corporate Email Address</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon-left">
                  <Mail size={16} />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="name@dayflow.io"
                />
              </div>
            </div>

            <div className="form-group">
              <div className="form-label">
                <span>Cognito Password</span>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '0.75rem',
                    color: 'var(--primary-600)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon-left">
                  <Lock size={16} />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-input-toggle-right"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ accentColor: 'var(--primary-600)', width: '15px', height: '15px', borderRadius: '4px' }}
                />
                Remember this workstation for 30 days
              </label>
            </div>

            {error && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--rose-50)',
                  color: 'var(--rose-700)',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '1.25rem',
                  border: '1px solid rgba(220, 38, 38, 0.2)'
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
              style={{ width: '100%', marginTop: '0.25rem' }}
              icon={ArrowRight}
              iconPosition="right"
            >
              Sign In to Session
            </Button>
          </form>

          {/* SSO Options */}
          <div className="auth-divider">Or continue with</div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => handleSSOLogin('google')}
              className="auth-sso-btn"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              Google
            </button>

            <button
              type="button"
              onClick={() => handleSSOLogin('microsoft')}
              className="auth-sso-btn"
            >
              <svg width="16" height="16" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              Microsoft
            </button>
          </div>

          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            New employee without credentials?{' '}
            <button
              type="button"
              onClick={() => onNavigate('signup')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary-600)',
                fontWeight: 700,
                cursor: 'pointer',
                padding: 0
              }}
            >
              Register & Verify via OTP →
            </button>
          </div>
        </motion.div>
      </div>

      {/* Interactive Forgot Password Modal */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="auth-modal-backdrop" onClick={() => setIsForgotModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="auth-modal-content"
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <KeyRound size={18} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Reset Cognito Credentials</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>AWS Secure Password Recovery</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsForgotModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {forgotStep === 1 ? (
                <form onSubmit={handleRequestForgot}>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    Enter your registered corporate email address to receive an AWS Cognito reset OTP.
                  </p>

                  <div className="form-group">
                    <label className="form-label">Corporate Email</label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="form-input"
                      placeholder="sophia.vance@dayflow.io"
                    />
                  </div>

                  {forgotError && (
                    <div style={{ color: 'var(--rose-600)', fontSize: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={14} /> {forgotError}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <Button variant="secondary" onClick={() => setIsForgotModalOpen(false)}>Cancel</Button>
                    <Button variant="primary" type="submit" loading={forgotLoading}>Send Reset Code</Button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleConfirmForgot}>
                  <div
                    style={{
                      padding: '0.625rem 0.875rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(37,99,235,0.08)',
                      border: '1px solid var(--primary-200)',
                      color: 'var(--primary-700)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      marginBottom: '1rem'
                    }}
                  >
                    Demo OTP Dispatched: <strong>932140</strong>
                  </div>

                  <div className="form-group">
                    <label className="form-label">6-Digit Reset Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      className="form-input font-mono"
                      placeholder="932140"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">New Password</label>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="form-input"
                      placeholder="Min 8 characters"
                    />
                  </div>

                  {forgotError && (
                    <div style={{ color: 'var(--rose-600)', fontSize: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <AlertCircle size={14} /> {forgotError}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                    <Button variant="secondary" onClick={() => setForgotStep(1)}>Back</Button>
                    <Button variant="primary" type="submit" loading={forgotLoading}>Update Password</Button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
