import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, AlertCircle, ArrowLeft, Database, Globe, Code, Sparkles, UserCheck, Shield, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ApiInspectorModal } from '../../components/common/ApiInspectorModal';

export const SignUpView = ({ onNavigate }) => {
  const { signUp, confirmSignUp, resendConfirmationCode } = useAuth();

  const [step, setStep] = useState(1); // 1: Registration Form, 2: Cognito OTP Confirmation
  const [formData, setFormData] = useState({
    employeeId: 'ADMIN001',
    email: 'athishm.cs24@bitsathy.ac.in',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(true);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
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

  const handleQuickFillAdmin = () => {
    setFormData({
      employeeId: 'ADMIN001',
      email: 'athishm.cs24@bitsathy.ac.in',
      password: 'Password@2026!',
      confirmPassword: 'Password@2026!'
    });
    setError('');
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!formData.employeeId.trim()) {
      setError('Employee ID is required.');
      return;
    }

    if (!formData.email.trim()) {
      setError('Official email address is required.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long and include numbers/symbols.');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!agreedTerms) {
      setError('Please accept the Terms of Service to proceed.');
      return;
    }

    setLoading(true);
    try {
      // Real Amazon Cognito User Pool SignUp
      const result = await signUp({
        employeeId: formData.employeeId.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });

      if (result.userConfirmed) {
        setSuccessMessage('Account created and confirmed! Redirecting to login...');
        setTimeout(() => onNavigate('signin'), 1500);
      } else {
        setStep(2);
        setResendTimer(45);
        setCanResend(false);
      }
    } catch (err) {
      setError(err.message || 'Cognito registration failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    const fullCode = otpCode.join('').trim();
    if (fullCode.length < 6) {
      setError('Please enter the complete 6-digit confirmation code.');
      return;
    }

    setLoading(true);
    try {
      // Real Amazon Cognito ConfirmSignUp
      await confirmSignUp({
        email: formData.email.trim().toLowerCase(),
        code: fullCode
      });

      setSuccessMessage('Verification confirmed with Cognito! Redirecting to Sign In...');
      setTimeout(() => {
        onNavigate('signin');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Cognito code verification failed.');
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
    setError('');
    setResendTimer(45);
    setCanResend(false);
    try {
      await resendConfirmationCode(formData.email.trim().toLowerCase());
    } catch (err) {
      setError(err.message || 'Failed to resend confirmation code from Cognito.');
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
            Identity Provisioning (AWS Cognito)
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
            <span style={{ fontFamily: 'var(--font-sans)' }}>ap-south-1 • Cognito</span>
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}>
            <Globe size={13} />
            <span>English (US)</span>
          </span>
        </div>
      </header>

      {/* Main Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="auth-odoo-card"
        style={{ maxWidth: '460px' }}
      >
        {/* Navigation Switcher Tabs (Sign In vs Sign Up) */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#F5F5F5',
            padding: '3px',
            borderRadius: '8px',
            marginBottom: '1.25rem'
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
                  Register employee account
                </h1>
                <p style={{ fontSize: '0.8125rem', color: '#8A8A8A' }}>
                  Validated against your organization's employee directory via Amazon Cognito
                </p>
              </div>

              {/* Seeded Admin_HR test helper chip */}
              <div style={{ marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={handleQuickFillAdmin}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: '1px dashed #714B67',
                    backgroundColor: '#F5EFF3',
                    color: '#714B67',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                  title="Autofill seeded Admin_HR test credentials"
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} color="#714B67" />
                    <strong>Seeded Test Admin:</strong> ADMIN001 (athishm.cs24@...)
                  </span>
                  <span style={{ fontWeight: 700, textDecoration: 'underline' }}>Autofill</span>
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit}>
                {/* Employee ID */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', marginBottom: '0.35rem' }}>
                    Employee ID <span style={{ color: '#DC3545' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.employeeId}
                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.trim().toUpperCase() })}
                    className="auth-odoo-input"
                    placeholder="e.g. ADMIN001"
                  />
                  <span style={{ fontSize: '0.6875rem', color: '#8A8A8A', marginTop: '2px', display: 'block' }}>
                    Pre-validated against RDS employee database during Pre Sign-up trigger
                  </span>
                </div>

                {/* Official Email */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', marginBottom: '0.35rem' }}>
                    Official Email <span style={{ color: '#DC3545' }}>*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="auth-odoo-input"
                    placeholder="e.g. athishm.cs24@bitsathy.ac.in"
                  />
                </div>

                {/* Password */}
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', marginBottom: '0.35rem' }}>
                    Password <span style={{ color: '#DC3545' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="auth-odoo-input"
                      style={{ paddingRight: '2.5rem' }}
                      placeholder="Minimum 8 characters with numbers & symbols"
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

                {/* Confirm Password */}
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 500, color: '#4C4C4C', marginBottom: '0.35rem' }}>
                    Confirm Password <span style={{ color: '#DC3545' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="auth-odoo-input"
                      style={{ paddingRight: '2.5rem' }}
                      placeholder="Re-enter password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
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
                    I agree to the Enterprise Terms of Service and Privacy Policy
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

                {successMessage && (
                  <div
                    style={{
                      padding: '0.625rem 0.875rem',
                      borderRadius: '6px',
                      backgroundColor: '#E6F4EA',
                      color: '#28A745',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <CheckCircle2 size={15} />
                    <span>{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-odoo-btn"
                >
                  {loading ? 'Creating Cognito User...' : 'Sign Up with Cognito'}
                </button>
              </form>

              {/* Bottom Login Link */}
              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: '#4C4C4C' }}>
                Already registered with Cognito?{' '}
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

              {/* Already have code shortcut */}
              <div style={{ marginTop: '0.5rem', textAlign: 'center', fontSize: '0.75rem', color: '#8A8A8A' }}>
                Have an unconfirmed account?{' '}
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#714B67',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: 0,
                    textDecoration: 'underline'
                  }}
                >
                  Enter confirmation code
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
                  Verify your email
                </h1>
                <p style={{ fontSize: '0.875rem', color: '#8A8A8A' }}>
                  Enter the 6-digit confirmation code sent by Amazon Cognito to:
                </p>
                <div style={{ fontWeight: 600, color: '#1A1A1A', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                  {formData.email || 'your email'}
                </div>
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

                {successMessage && (
                  <div
                    style={{
                      padding: '0.625rem 0.875rem',
                      borderRadius: '6px',
                      backgroundColor: '#E6F4EA',
                      color: '#28A745',
                      fontSize: '0.8125rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      marginBottom: '1.25rem'
                    }}
                  >
                    <CheckCircle2 size={15} />
                    <span>{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="auth-odoo-btn"
                >
                  {loading ? 'Confirming with Cognito...' : 'Confirm Account & Proceed'}
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
          Powered by <strong style={{ color: '#714B67' }}>Amazon Cognito & Odoo Enterprise</strong>
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
