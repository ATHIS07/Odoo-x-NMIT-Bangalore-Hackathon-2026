import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, ArrowLeft, Database, Globe, Code, Sparkles, UserCheck, Shield, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ApiInspectorModal } from '../../components/common/ApiInspectorModal';

export const SignUpView = ({ onNavigate }) => {
  const { signUp, verifySignUp, directSignUp } = useAuth();

  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
  const [formData, setFormData] = useState({
    name: 'Julian Hayes',
    employeeId: 'DF-9210',
    email: 'julian.hayes@odoo.com',
    password: 'Odoo@2026Secure!',
    department: 'Engineering',
    role: 'employee',
    phone: '+91 98450 78192'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [otpCode, setOtpCode] = useState(['8', '4', '9', '2', '0', '1']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [directLoading, setDirectLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);

  // API Inspector Modal State
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    let interval = null;
    if (step === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, resendTimer]);

  const handleGenerateId = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    setFormData((prev) => ({ ...prev, employeeId: `DF-${randomNum}` }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreedTerms) {
      setError('Please accept the Terms of Service to proceed.');
      return;
    }

    setLoading(true);
    try {
      await signUp(formData);
      setStep(2);
      setResendTimer(45);
      setCanResend(false);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDirectCreate = async () => {
    setError('');
    if (!agreedTerms) {
      setError('Please accept the Terms of Service to proceed.');
      return;
    }
    setDirectLoading(true);
    try {
      const verified = await directSignUp(formData);
      if (verified.role === 'hr') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('employee-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Direct creation failed');
    } finally {
      setDirectLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fullCode = otpCode.join('');
    try {
      const verified = await verifySignUp(fullCode);
      if (verified.role === 'hr') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('employee-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (cleanValue.length > 1) {
      const digits = cleanValue.slice(0, 6).split('');
      const newOtp = [...otpCode];
      digits.forEach((d, i) => {
        if (i < 6) newOtp[i] = d;
      });
      setOtpCode(newOtp);
      const targetInput = document.getElementById(`otp-input-${Math.min(digits.length, 5)}`);
      if (targetInput) targetInput.focus();
      return;
    }

    const newOtp = [...otpCode];
    newOtp[index] = cleanValue;
    setOtpCode(newOtp);

    if (cleanValue && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setResendTimer(45);
    setCanResend(false);
    try {
      await signUp(formData);
    } catch (err) {
      setError('Failed to resend verification code');
    }
  };

  const handleAutofillOtp = () => {
    setOtpCode(['8', '4', '9', '2', '0', '1']);
    setError('');
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
            Account Provisioning
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

      {/* Main Odoo Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="auth-odoo-card"
        style={{ maxWidth: '480px' }}
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
            onClick={() => onNavigate('signin')}
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
            Sign In
          </button>
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
            Sign Up
          </button>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="signup-step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Heading */}
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '0.25rem' }}>
                  Create your account
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#8A8A8A' }}>
                  Join your organization's Odoo workspace
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit}>
                {/* Full Name */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', marginBottom: '0.35rem' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="auth-odoo-input"
                    placeholder="Julian Hayes"
                  />
                </div>

                {/* Employee ID & Department Grid */}
                <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', margin: 0 }}>
                        Employee ID
                      </label>
                      <button
                        type="button"
                        onClick={handleGenerateId}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#714B67',
                          fontSize: '0.6875rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          padding: 0,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '2px'
                        }}
                        title="Auto-generate Employee ID"
                      >
                        <RefreshCw size={10} /> Auto
                      </button>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
                      className="auth-odoo-input"
                      placeholder="DF-9210"
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', marginBottom: '0.35rem' }}>
                      Department
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="auth-odoo-input"
                      style={{ cursor: 'pointer' }}
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="People & Talent Operations">People & Talent</option>
                      <option value="Executive Operations">Executive Ops</option>
                      <option value="Product Design">Product Design</option>
                      <option value="Finance & Payroll">Finance & Payroll</option>
                    </select>
                  </div>
                </div>

                {/* Role Selector (Employee vs HR) */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', marginBottom: '0.35rem' }}>
                    Account Role & Permissions
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'employee' })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: `1px solid ${formData.role === 'employee' ? '#714B67' : '#E5E5E5'}`,
                        backgroundColor: formData.role === 'employee' ? '#F5EFF3' : '#FFFFFF',
                        color: formData.role === 'employee' ? '#714B67' : '#4C4C4C',
                        fontSize: '0.75rem',
                        fontWeight: formData.role === 'employee' ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <UserCheck size={14} />
                      <div>
                        <div style={{ fontWeight: 600 }}>Employee</div>
                        <div style={{ fontSize: '0.6875rem', color: '#8A8A8A' }}>Self-Service</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'hr' })}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: `1px solid ${formData.role === 'hr' ? '#714B67' : '#E5E5E5'}`,
                        backgroundColor: formData.role === 'hr' ? '#F5EFF3' : '#FFFFFF',
                        color: formData.role === 'hr' ? '#714B67' : '#4C4C4C',
                        fontSize: '0.75rem',
                        fontWeight: formData.role === 'hr' ? 600 : 500,
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <Shield size={14} />
                      <div>
                        <div style={{ fontWeight: 600 }}>HR Admin</div>
                        <div style={{ fontSize: '0.6875rem', color: '#8A8A8A' }}>Full HQ Access</div>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Email Address */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', marginBottom: '0.35rem' }}>
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="auth-odoo-input"
                    placeholder="julian.hayes@odoo.com"
                  />
                </div>

                {/* Password */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', marginBottom: '0.35rem' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="auth-odoo-input"
                      style={{ paddingRight: '2.5rem' }}
                      placeholder="Create a secure password"
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

                {/* Terms Checkbox */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: '#4C4C4C', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={agreedTerms}
                      onChange={(e) => setAgreedTerms(e.target.checked)}
                      style={{ accentColor: '#714B67', width: '15px', height: '15px', borderRadius: '4px' }}
                    />
                    I agree to the Terms of Service and Privacy Policy
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

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  <button
                    type="submit"
                    disabled={loading || directLoading}
                    className="auth-odoo-btn"
                  >
                    {loading ? 'Dispatched OTP via API...' : 'Sign up (Verify with OTP)'}
                  </button>

                  <button
                    type="button"
                    onClick={handleDirectCreate}
                    disabled={loading || directLoading}
                    style={{
                      width: '100%',
                      backgroundColor: '#FFFFFF',
                      color: '#714B67',
                      border: '1px solid #714B67',
                      borderRadius: '6px',
                      padding: '0.625rem 1rem',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Sparkles size={13} color="#714B67" />
                    <span>{directLoading ? 'Creating identity...' : 'Instant Create & Sign In (Demo)'}</span>
                  </button>
                </div>
              </form>

              {/* Bottom Login Link */}
              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4C4C4C' }}>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('signin')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#714B67',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  Log in
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signup-step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Heading */}
              <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                <h1 style={{ fontSize: '1.375rem', fontWeight: 600, color: '#1A1A1A', marginBottom: '0.25rem' }}>
                  Verify your account
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#8A8A8A' }}>
                  Enter the 6-digit OTP code sent to <strong>{formData.email}</strong>
                </p>
              </div>

              {/* Quick autofill hint */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={handleAutofillOtp}
                  style={{
                    background: '#F5EFF3',
                    border: '1px solid #D5BDCF',
                    color: '#714B67',
                    borderRadius: '999px',
                    padding: '3px 10px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Sparkles size={11} /> Autofill Demo Code (849201)
                </button>
              </div>

              <form onSubmit={handleVerifyOtp}>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  {otpCode.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="auth-otp-input-box"
                      style={{ width: '46px', height: '52px', fontSize: '1.25rem', textAlign: 'center', borderRadius: '8px', border: '1px solid #CCCCCC' }}
                    />
                  ))}
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
                  {loading ? 'Verifying via API...' : 'Verify OTP & Activate Session'}
                </button>
              </form>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', fontSize: '0.8125rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8A8A8A',
                    cursor: 'pointer',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <ArrowLeft size={14} /> Back to details
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: canResend ? '#714B67' : '#8A8A8A',
                    fontWeight: 500,
                    cursor: canResend ? 'pointer' : 'not-allowed',
                    padding: 0
                  }}
                >
                  {canResend ? 'Resend code' : `Resend in ${resendTimer}s`}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
        defaultEndpoint="signup"
      />
    </div>
  );
};
