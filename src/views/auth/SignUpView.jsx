import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Mail, User, CheckCircle2, XCircle, ArrowRight, KeyRound, Sparkles, AlertCircle } from 'lucide-react';
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
    role: 'employee'
  });

  const [otpCode, setOtpCode] = useState(['8', '4', '9', '2', '0', '1']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  // Password Strength Criteria Calculation
  const hasMinLength = formData.password.length >= 8;
  const hasUpperLower = /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[^A-Za-z0-9]/.test(formData.password);
  const strengthScore = [hasMinLength, hasUpperLower, hasNumber, hasSpecial].filter(Boolean).length;

  const strengthLabel = strengthScore === 4 ? 'Very Strong (Cognito Certified)' : strengthScore === 3 ? 'Strong' : strengthScore === 2 ? 'Moderate' : 'Weak';
  const strengthColor = strengthScore === 4 ? 'var(--emerald-600)' : strengthScore === 3 ? 'var(--primary-600)' : strengthScore === 2 ? 'var(--amber-600)' : 'var(--rose-600)';

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (strengthScore < 3) {
      setError('Password does not meet enterprise security requirements');
      return;
    }

    setLoading(true);
    try {
      await signUp(formData);
      setStep(2);
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
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) nextInput.focus();
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
      {/* Left Branding Hero */}
      <div
        style={{
          backgroundColor: '#0A0D14',
          color: '#FFFFFF',
          padding: '4rem 3.5rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          borderRight: '1px solid #1E293B'
        }}
      >
        <div>
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
                color: '#FFFFFF'
              }}
            >
              D
            </div>
            <div>
              <span style={{ fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)' }}>
                Dayflow
              </span>
              <span style={{ fontSize: '0.6875rem', color: '#64748B', display: 'block', fontWeight: 600 }}>
                AWS COGNITO USER POOL
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(5, 150, 105, 0.15)',
              border: '1px solid rgba(5, 150, 105, 0.3)',
              color: '#34D399',
              fontSize: '0.75rem',
              fontWeight: 700,
              marginBottom: '1.5rem'
            }}
          >
            <Shield size={13} />
            STAGE 2: MULTI-FACTOR VERIFICATION
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
            Provision your identity onto the Dayflow infrastructure.
          </h1>

          <p style={{ fontSize: '1rem', color: '#94A3B8', lineHeight: 1.6, maxWidth: '480px' }}>
            Identity tokenization via Cognito User Pool with 256-bit encrypted credential management and RBAC policy attachment.
          </p>
        </div>

        {/* Step Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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
              1
            </span>
            <span style={{ fontSize: '0.8125rem', color: step === 1 ? '#FFFFFF' : '#64748B', fontWeight: 600 }}>
              Account Details
            </span>
          </div>

          <div style={{ width: '40px', height: '1px', backgroundColor: '#334155' }} />

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
              OTP Email Verification
            </span>
          </div>
        </div>
      </div>

      {/* Right Form Card */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem 2.5rem',
          backgroundColor: 'var(--bg-surface)'
        }}
      >
        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              style={{ width: '100%', maxWidth: '440px' }}
            >
              <div style={{ marginBottom: '1.75rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Create Dayflow Account</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                  Provide your company details for RBAC credential provisioning.
                </p>
              </div>

              <form onSubmit={handleRegisterSubmit}>
                <div className="grid-2" style={{ gap: '0.75rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="form-input"
                      placeholder="e.g. Sophia Vance"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Employee ID</label>
                    <input
                      type="text"
                      required
                      value={formData.employeeId}
                      onChange={(e) => setFormData({ ...formData, employeeId: e.target.value.toUpperCase() })}
                      className="form-input font-mono"
                      placeholder="DF-8824"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="form-input"
                    placeholder="name@dayflow.io"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">System Role Assignment</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="form-select"
                  >
                    <option value="employee">Employee (Self-Service Attendance & Leave)</option>
                    <option value="hr">HR Business Partner (Talent & Approvals)</option>
                    <option value="admin">Executive Admin (Full Org & Payroll Governance)</option>
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                  <label className="form-label">Password Policy</label>
                  <input
                    type="password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="form-input"
                    placeholder="Create secure password"
                  />
                </div>

                {/* Live Password Strength Meter */}
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
                    <span style={{ color: 'var(--text-secondary)' }}>Entropy Strength:</span>
                    <span style={{ fontWeight: 700, color: strengthColor }}>{strengthLabel}</span>
                  </div>

                  <div style={{ height: '4px', width: '100%', backgroundColor: 'var(--border-subtle)', borderRadius: '9999px', overflow: 'hidden', marginBottom: '0.5rem' }}>
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

                {error && (
                  <div style={{ color: 'var(--rose-600)', fontSize: '0.8125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }} icon={ArrowRight} iconPosition="right">
                  Proceed to OTP Verification
                </Button>
              </form>

              <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
                Already have an identity token?{' '}
                <button
                  onClick={() => onNavigate('signin')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Sign In
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ width: '100%', maxWidth: '420px' }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--primary-50)',
                  color: 'var(--primary-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1.25rem'
                }}
              >
                <KeyRound size={24} />
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: 700, letterSpacing: '-0.03em' }}>Verify Cognito Code</h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem', marginBottom: '1.75rem' }}>
                We sent a 6-digit confirmation token via SNS to <strong>{formData.email}</strong>.
              </p>

              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  backgroundColor: 'rgba(37,99,235,0.08)',
                  border: '1px solid var(--primary-200)',
                  color: 'var(--primary-700)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  marginBottom: '1.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Sparkles size={16} />
                <span>Demo OTP Auto-Filled: <strong>849201</strong></span>
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
                      style={{
                        width: '48px',
                        height: '56px',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        border: '2px solid var(--border-default)',
                        borderRadius: '10px',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        outline: 'none'
                      }}
                    />
                  ))}
                </div>

                {error && (
                  <div style={{ color: 'var(--rose-600)', fontSize: '0.8125rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={14} /> {error}
                  </div>
                )}

                <Button type="submit" variant="primary" size="lg" loading={loading} style={{ width: '100%' }}>
                  Verify & Enter Workspace
                </Button>
              </form>

              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', fontSize: '0.8125rem' }}>
                <button
                  onClick={() => setStep(1)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 0 }}
                >
                  ← Edit Information
                </button>
                <button
                  onClick={() => alert('New code re-sent via Cognito SNS: 849201')}
                  style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Resend OTP Token
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
