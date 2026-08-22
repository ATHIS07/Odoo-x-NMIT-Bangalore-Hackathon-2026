import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, KeyRound, X, Database, Globe, Code, Sparkles, User, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/CommonUI';
import { ApiInspectorModal } from '../../components/common/ApiInspectorModal';

export const SignInView = ({ onNavigate }) => {
  const { signIn, requestPasswordReset, confirmPasswordReset } = useAuth();
  const [email, setEmail] = useState('sophia.vance@odoo.com');
  const [password, setPassword] = useState('Odoo@2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // API Inspector Modal State
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Forgot Password Modal State
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: OTP + New Password
  const [forgotEmail, setForgotEmail] = useState('sophia.vance@odoo.com');
  const [forgotOtp, setForgotOtp] = useState('932140');
  const [forgotNewPassword, setForgotNewPassword] = useState('Odoo@2026Secure!');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');

  const demoAccounts = [
    {
      badge: 'Emp 1',
      label: 'Employee 1',
      name: 'Sophia Vance',
      designation: 'Staff Architect',
      email: 'sophia.vance@odoo.com',
      password: 'Odoo@2026!',
      role: 'employee',
      icon: User
    },
    {
      badge: 'Emp 2',
      label: 'Employee 2',
      name: 'Liam Thorne',
      designation: 'Systems Engineer',
      email: 'liam.thorne@odoo.com',
      password: 'Odoo@2026!',
      role: 'employee',
      icon: User
    },
    {
      badge: 'HR 1',
      label: 'HR Lead',
      name: 'Marcus Chen',
      designation: 'Lead HR Partner',
      email: 'marcus.chen@odoo.com',
      password: 'Odoo@2026!',
      role: 'hr',
      icon: Shield
    }
  ];

  const handleQuickFill = (acc) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await signIn({ email, password });
      if (user.role === 'hr') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('employee-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
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

  return (
    <div className="auth-odoo-wrapper">
      {/* Odoo Enterprise Portal Header Bar */}
      <header className="odoo-portal-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#714B67',
              color: '#FFFFFF',
              fontWeight: 700,
              fontSize: '0.9375rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--font-sans)'
            }}
          >
            O
          </div>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.01em' }}>
            Odoo
          </span>
          <span style={{ fontSize: '0.75rem', color: '#8A8A8A', paddingLeft: '0.5rem', borderLeft: '1px solid #E5E5E5' }}>
            Employee Portal
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem', color: '#4C4C4C' }}>
          {/* API Inspector Button */}
          <button
            type="button"
            onClick={() => setIsApiModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '4px 10px',
              borderRadius: '6px',
              backgroundColor: '#F5EFF3',
              border: '1px solid #D5BDCF',
              color: '#714B67',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Inspect REST API Specs, Headers and Endpoints"
          >
            <Code size={13} />
            <span>API Docs</span>
          </button>

          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#8A8A8A' }}>
            <Database size={13} color="#714B67" />
            <span style={{ fontFamily: 'var(--font-sans)' }}>enterprise.odoo.com</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
            <Globe size={13} />
            <span>English (US)</span>
          </span>
        </div>
      </header>

      {/* Main Odoo Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="auth-odoo-card"
      >
        {/* Navigation Switcher Tabs (Sign In vs Sign Up) */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F5F5F5',
            padding: '3px',
            borderRadius: '8px',
            marginBottom: '1.5rem'
          }}
        >
          <button
            type="button"
            style={{
              flex: 1,
              padding: '0.5rem 0',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
              color: '#714B67',
              fontWeight: 600,
              fontSize: '0.875rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              cursor: 'default'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            style={{
              flex: 1,
              padding: '0.5rem 0',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: '#666666',
              fontWeight: 500,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Quiet Heading */}
        <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
          <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '0.25rem' }}>
            Sign in to Odoo
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#8A8A8A' }}>
            Access your employee management workspace
          </p>
        </div>

        {/* Quick Demo Fill Buttons (2 Employees & 1 HR) */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.6875rem', fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <Sparkles size={11} color="#714B67" />
            <span>1-Click Demo Accounts (2 Employees & 1 HR)</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.4rem' }}>
            {demoAccounts.map((acc) => {
              const Icon = acc.icon;
              const isSelected = email === acc.email;
              return (
                <button
                  key={acc.email}
                  type="button"
                  onClick={() => handleQuickFill(acc)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: '0.2rem',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    border: `1px solid ${isSelected ? '#714B67' : '#E5E5E5'}`,
                    backgroundColor: isSelected ? '#F5EFF3' : '#FFFFFF',
                    color: isSelected ? '#714B67' : '#4C4C4C',
                    fontSize: '0.75rem',
                    fontWeight: isSelected ? 600 : 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  title={`${acc.name} (${acc.designation})`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', width: '100%', justifyContent: 'space-between' }}>
                    <span
                      style={{
                        fontSize: '0.625rem',
                        fontWeight: 700,
                        padding: '1px 4px',
                        borderRadius: '3px',
                        backgroundColor: acc.role === 'hr' ? '#714B67' : '#EAEAEA',
                        color: acc.role === 'hr' ? '#FFFFFF' : '#4C4C4C'
                      }}
                    >
                      {acc.badge}
                    </span>
                    <Icon size={12} color={isSelected ? '#714B67' : '#8A8A8A'} />
                  </div>
                  <span style={{ fontSize: '0.6875rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                    {acc.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Email Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', marginBottom: '0.35rem' }}>
              Work Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-odoo-input"
              placeholder="yourname@company.com"
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', margin: 0 }}>
                Password
              </label>
              <button
                type="button"
                onClick={() => setIsForgotModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.8125rem',
                  color: '#714B67',
                  fontWeight: 500,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                Forgot password?
              </button>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-odoo-input"
                style={{ paddingRight: '2.5rem' }}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#8A8A8A',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me Checkbox */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#4C4C4C', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                style={{ accentColor: '#714B67', width: '15px', height: '15px', borderRadius: '4px' }}
              />
              Remember me on this device
            </label>
          </div>

          {error && (
            <div
              style={{
                padding: '0.625rem 0.875rem',
                borderRadius: '6px',
                backgroundColor: '#FBEAEA',
                color: '#DC3545',
                fontSize: '0.8125rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1.25rem'
              }}
            >
              <AlertCircle size={15} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="auth-odoo-btn"
          >
            {loading ? 'Authenticating via API...' : 'Log in'}
          </button>
        </form>

        {/* Bottom Plain Signup Link */}
        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.875rem', color: '#4C4C4C' }}>
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('signup')}
            style={{
              background: 'none',
              border: 'none',
              color: '#714B67',
              fontWeight: 600,
              cursor: 'pointer',
              padding: 0
            }}
          >
            Create an Account / Sign up
          </button>
        </div>
      </motion.div>

      {/* Odoo Enterprise Portal Footer */}
      <footer className="odoo-portal-footer">
        <div>
          Powered by <strong style={{ color: '#714B67' }}>Odoo Enterprise</strong> • Open Source Business Software
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            type="button"
            onClick={() => setIsApiModalOpen(true)}
            style={{ background: 'none', border: 'none', color: '#714B67', fontSize: '0.8125rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}
          >
            <Code size={13} /> REST API Endpoints
          </button>
          <span>•</span>
          <a href="#help" onClick={(e) => e.preventDefault()} style={{ color: '#8A8A8A', textDecoration: 'none' }}>Help</a>
          <span>•</span>
          <a href="#terms" onClick={(e) => e.preventDefault()} style={{ color: '#8A8A8A', textDecoration: 'none' }}>Terms</a>
          <span>•</span>
          <a href="#privacy" onClick={(e) => e.preventDefault()} style={{ color: '#8A8A8A', textDecoration: 'none' }}>Privacy</a>
        </div>
      </footer>

      {/* API Inspector Modal */}
      <ApiInspectorModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        defaultEndpoint="login"
      />

      {/* Password Reset Modal */}
      <AnimatePresence>
        {isForgotModalOpen && (
          <div className="auth-modal-backdrop" onClick={() => setIsForgotModalOpen(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              onClick={(e) => e.stopPropagation()}
              className="auth-modal-content"
              style={{ padding: '2rem' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#F5EFF3', color: '#714B67', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <KeyRound size={16} />
                  </div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1A1A1A' }}>Reset Password</h3>
                </div>
                <button
                  onClick={() => setIsForgotModalOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#8A8A8A', cursor: 'pointer', padding: '4px' }}
                >
                  <X size={18} />
                </button>
              </div>

              {forgotStep === 1 ? (
                <form onSubmit={handleRequestForgot}>
                  <p style={{ fontSize: '0.8125rem', color: '#4C4C4C', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    Enter your registered work email to receive a password reset token via the auth API.
                  </p>

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', marginBottom: '0.35rem' }}>
                      Work Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="auth-odoo-input"
                      placeholder="yourname@company.com"
                    />
                  </div>

                  {forgotError && (
                    <div style={{ color: '#DC3545', fontSize: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                  <p style={{ fontSize: '0.8125rem', color: '#4C4C4C', marginBottom: '1rem' }}>
                    Reset code sent. Enter the 6-digit code (Demo code: <strong>932140</strong>) and your new password.
                  </p>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', marginBottom: '0.35rem' }}>
                      6-Digit Code
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={forgotOtp}
                      onChange={(e) => setForgotOtp(e.target.value)}
                      className="auth-odoo-input"
                      placeholder="932140"
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', marginBottom: '0.35rem' }}>
                      New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      className="auth-odoo-input"
                      placeholder="Enter new password (min 8 chars)"
                    />
                  </div>

                  {forgotError && (
                    <div style={{ color: '#DC3545', fontSize: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
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
