import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Lock,
  Mail,
  User,
  CheckCircle2,
  XCircle,
  ArrowRight,
  KeyRound,
  Sparkles,
  AlertCircle,
  Eye,
  EyeOff,
  Building2,
  BadgeCheck,
  Check,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/CommonUI';

export const SignUpView = ({ onNavigate }) => {
  const { signUp, verifySignUp, pendingVerification } = useAuth();

  const [step, setStep] = useState(1); // 1: Form, 2: OTP Verification
  const [formData, setFormData] = useState({
    name: 'Julian Hayes',
    employeeId: 'DF-9210',
    email: 'julian.hayes@dayflow.io',
    password: 'Dayflow@2026Secure!',
    department: 'Engineering',
    role: 'employee'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [otpCode, setOtpCode] = useState(['8', '4', '9', '2', '0', '1']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);

  // Password Strength Calculation
  const hasMinLength = formData.password.length >= 8;
  const hasUpperLower = /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[^A-Za-z0-9]/.test(formData.password);
  const strengthScore = [hasMinLength, hasUpperLower, hasNumber, hasSpecial].filter(Boolean).length;

  const strengthLabel =
    strengthScore === 4
      ? 'Cognito Enterprise Certified'
      : strengthScore === 3
      ? 'Strong'
      : strengthScore === 2
      ? 'Moderate'
      : 'Weak';

  const strengthColor =
    strengthScore === 4
      ? 'var(--emerald-600)'
      : strengthScore === 3
      ? 'var(--primary-600)'
      : strengthScore === 2
      ? 'var(--amber-600)'
      : 'var(--rose-600)';

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

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!agreedTerms) {
      setError('Please accept the enterprise security policy to proceed.');
      return;
    }

    if (strengthScore < 3) {
      setError('Password does not meet enterprise security requirements (must be Strong).');
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

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const fullCode = otpCode.join('');
    try {
      const verified = await verifySignUp(fullCode);
      if (verified.role === 'admin' || verified.role === 'hr') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('employee-dashboard');
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    // Only accept numbers
    const cleanValue = value.replace(/[^0-9]/g, '');
    if (cleanValue.length > 1) {
      // Handle paste
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

    // Auto focus next input
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
      setError('Failed to resend token');
    }
  };

  const prefillDemo = (roleType = 'employee') => {
    if (roleType === 'employee') {
      setFormData({
        name: 'Julian Hayes',
        employeeId: 'DF-9210',
        email: 'julian.hayes@dayflow.io',
        password: 'Dayflow@2026Secure!',
        department: 'Engineering',
        role: 'employee'
      });
    } else if (roleType === 'hr') {
      setFormData({
        name: 'Claire Beauchamp',
        employeeId: 'DF-5521',
        email: 'claire.beauchamp@dayflow.io',
        password: 'Dayflow@2026Secure!',
        department: 'People & Talent Operations',
        role: 'hr'
      });
    }
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
                backgroundColor: 'rgba(5, 150, 105, 0.15)',
                border: '1px solid rgba(5, 150, 105, 0.35)',
                color: '#34D399',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: '1.5rem'
              }}
            >
              <Shield size={14} />
              STAGE {step === 1 ? '1: IDENTITY PROVISIONING' : '2: MULTI-FACTOR VERIFICATION'}
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
              Provision your identity onto the Dayflow infrastructure.
            </h1>

            <p style={{ fontSize: '0.975rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '490px' }}>
              Identity tokenization via AWS Cognito User Pool with 256-bit encrypted credential management, instant RBAC policy attachment, and verified hardware tokens.
            </p>
          </motion.div>
        </div>

        {/* Step Indicator & System Health */}
        <div style={{ position: 'relative', zIndex: 2, marginTop: '2.5rem' }}>
          {/* Step Progress Pills */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.875rem 1.25rem',
              borderRadius: '10px',
              backgroundColor: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '1.5rem'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: step >= 1 ? 'var(--primary-600)' : '#334155',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {step > 1 ? <Check size={14} /> : '1'}
              </span>
              <span style={{ fontSize: '0.8125rem', color: step === 1 ? '#FFFFFF' : '#94A3B8', fontWeight: 600 }}>
                Account Details
              </span>
            </div>

            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: step === 2 ? 'var(--primary-600)' : '#334155',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                2
              </span>
              <span style={{ fontSize: '0.8125rem', color: step === 2 ? '#FFFFFF' : '#64748B', fontWeight: 600 }}>
                OTP Verification
              </span>
            </div>
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
              Cognito User Pool Active
            </span>
            <span style={{ color: '#64748B', fontFamily: 'var(--font-mono)', fontSize: '0.6875rem' }}>Pool: us-west-2_DF2026</span>
          </div>
        </div>
      </div>

      {/* Right Form Card */}
      <div className="auth-form-container">
        <div className="auth-form-card">
          {/* Top Auth Navigation Tabs (Sign In / Sign Up) */}
          <div className="auth-tab-group">
            <button
              type="button"
              className="auth-tab-btn"
              onClick={() => onNavigate('signin')}
            >
              <Lock size={14} />
              Sign In
            </button>
            <button
              type="button"
              className="auth-tab-btn active"
              onClick={() => {}}
            >
              <Sparkles size={14} />
              Create Account
            </button>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.25 }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                      Create Dayflow Account
                    </h2>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      Provide your employee details for RBAC credential provisioning.
                    </p>
                  </div>

                  {/* 1-Click Fast Prefill Button for Demo */}
                  <button
                    type="button"
                    onClick={() => prefillDemo('employee')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.375rem 0.625rem',
                      borderRadius: '6px',
                      backgroundColor: 'var(--primary-50)',
                      border: '1px solid var(--primary-200)',
                      color: 'var(--primary-700)',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                    title="Fill demo user details"
                  >
                    <Sparkles size={12} />
                    Auto Fill
                  </button>
                </div>

                <form onSubmit={handleRegisterSubmit}>
                  {/* Name & Employee ID Grid */}
                  <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <div className="auth-input-wrapper">
                        <span className="auth-input-icon-left">
                          <User size={16} />
                        </span>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="form-input"
                          style={{ paddingLeft: '2.5rem' }}
                          placeholder="e.g. Julian Hayes"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Employee ID</label>
                      <input
                        type="text"
                        required
                        value={formData.employeeId}
                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
                        className="form-input font-mono"
                        placeholder="DF-9210"
                      />
                    </div>
                  </div>

                  {/* Corporate Email */}
                  <div className="form-group">
                    <label className="form-label">Corporate Email Address</label>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon-left">
                        <Mail size={16} />
                      </span>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="form-input"
                        style={{ paddingLeft: '2.5rem' }}
                        placeholder="julian.hayes@dayflow.io"
                      />
                    </div>
                  </div>

                  {/* Department & Role Grid */}
                  <div className="grid-2" style={{ gap: '0.75rem', marginBottom: '0.25rem' }}>
                    <div className="form-group">
                      <label className="form-label">Department</label>
                      <select
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        className="form-select"
                      >
                        <option value="Engineering">Engineering</option>
                        <option value="People & Talent Operations">People & Talent</option>
                        <option value="Executive Operations">Executive Ops</option>
                        <option value="Product Design">Product Design</option>
                        <option value="Finance & Payroll">Finance & Payroll</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">System Role</label>
                      <select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        className="form-select"
                      >
                        <option value="employee">Employee (Self-Service)</option>
                        <option value="hr">HR Business Partner</option>
                        <option value="admin">Executive Admin</option>
                      </select>
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                    <label className="form-label">Password Policy</label>
                    <div className="auth-input-wrapper">
                      <span className="auth-input-icon-left">
                        <Lock size={16} />
                      </span>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="form-input"
                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                        placeholder="Create enterprise password"
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

                  {/* Live Password Entropy Meter */}
                  <div
                    style={{
                      backgroundColor: 'var(--bg-surface-subtle)',
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border-subtle)',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--text-secondary)' }}>Security Entropy:</span>
                      <span style={{ fontWeight: 700, color: strengthColor }}>{strengthLabel}</span>
                    </div>

                    <div style={{ height: '5px', width: '100%', backgroundColor: 'var(--border-subtle)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                      <div
                        style={{
                          height: '100%',
                          width: `${(strengthScore / 4) * 100}%`,
                          backgroundColor: strengthColor,
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem', fontSize: '0.6875rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: hasMinLength ? 'var(--emerald-600)' : 'var(--text-tertiary)' }}>
                        {hasMinLength ? <CheckCircle2 size={12} /> : <XCircle size={12} />} 8+ Characters
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: hasUpperLower ? 'var(--emerald-600)' : 'var(--text-tertiary)' }}>
                        {hasUpperLower ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Upper & Lower
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: hasNumber ? 'var(--emerald-600)' : 'var(--text-tertiary)' }}>
                        {hasNumber ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Numeric Digit
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: hasSpecial ? 'var(--emerald-600)' : 'var(--text-tertiary)' }}>
                        {hasSpecial ? <CheckCircle2 size={12} /> : <XCircle size={12} />} Special Symbol
                      </span>
                    </div>
                  </div>

                  {/* Terms & Privacy Policy Checkbox */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        style={{ accentColor: 'var(--primary-600)', width: '15px', height: '15px', borderRadius: '4px', marginTop: '2px' }}
                      />
                      <span>
                        I agree to Dayflow's corporate governance policies and AWS identity telemetry.
                      </span>
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
                    style={{ width: '100%' }}
                    icon={ArrowRight}
                    iconPosition="right"
                  >
                    Proceed to OTP Verification
                  </Button>
                </form>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                  Already have an identity token?{' '}
                  <button
                    type="button"
                    onClick={() => onNavigate('signin')}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-600)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    Sign In →
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <div
                  style={{
                    width: '52px',
                    height: '52px',
                    borderRadius: '14px',
                    backgroundColor: 'var(--primary-50)',
                    color: 'var(--primary-600)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                    boxShadow: '0 0 20px rgba(37, 99, 235, 0.2)'
                  }}
                >
                  <KeyRound size={26} />
                </div>

                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)' }}>
                  Verify Cognito Code
                </h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: '1.5rem' }}>
                  We dispatched a 6-digit confirmation token via AWS SNS to <strong>{formData.email}</strong>.
                </p>

                {/* 1-Click Demo OTP Helper Card */}
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(37, 99, 235, 0.08)',
                    border: '1px solid var(--primary-200)',
                    color: 'var(--primary-700)',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    marginBottom: '1.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={16} />
                    <span>Demo OTP: <strong>849201</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOtpCode(['8', '4', '9', '2', '0', '1'])}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary-600)',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      textDecoration: 'underline'
                    }}
                  >
                    Auto-fill
                  </button>
                </div>

                <form onSubmit={handleVerifyOtp}>
                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'space-between', marginBottom: '1.75rem' }}>
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
                      />
                    ))}
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
                    style={{ width: '100%' }}
                    icon={BadgeCheck}
                    iconPosition="right"
                  >
                    Verify & Enter Workspace
                  </Button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.75rem', fontSize: '0.8125rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-tertiary)',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}
                  >
                    <ArrowLeft size={14} /> Back to Details
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={!canResend}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: canResend ? 'var(--primary-600)' : 'var(--text-tertiary)',
                      fontWeight: 600,
                      cursor: canResend ? 'pointer' : 'not-allowed',
                      padding: 0
                    }}
                  >
                    {canResend ? 'Resend OTP Token' : `Resend in ${resendTimer}s`}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
