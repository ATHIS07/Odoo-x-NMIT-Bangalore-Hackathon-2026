import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { UserCheck, Zap, RotateCcw, Compass, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

export const DemoToolbar = ({ currentRoute, onRouteChange }) => {
  const { currentUser, switchPersona, role } = useAuth();
  const { simulateLatency, setSimulateLatency, resetDemoData } = useHRMS();
  const [isExpanded, setIsExpanded] = useState(true);

  const personas = [
    { role: 'employee', name: 'Sophia (Employee)', id: 'usr_001', color: 'var(--color-primary)' },
    { role: 'hr', name: 'Marcus (HR Lead)', id: 'usr_002', color: 'var(--color-primary-hover)' },
    { role: 'admin', name: 'Elena (Admin / VP)', id: 'usr_003', color: 'var(--color-primary-active)' }
  ];

  const screens = [
    { id: 'employee-dashboard', label: '1. Employee Dashboard', roleReq: 'all' },
    { id: 'admin-dashboard', label: '2. Admin / HR Dashboard', roleReq: 'admin' },
    { id: 'attendance', label: '3. Attendance Console', roleReq: 'all' },
    { id: 'leave-apply', label: '4. Leave — Apply', roleReq: 'all' },
    { id: 'leave-approvals', label: '5. Leave — Approvals', roleReq: 'admin' },
    { id: 'payroll', label: '6. Payroll & Payslips', roleReq: 'all' },
    { id: 'profile', label: '7. Profile (View)', roleReq: 'all' },
    { id: 'profile-edit', label: '8. Profile (Edit RBAC)', roleReq: 'all' },
    { id: 'analytics', label: '9. Analytics & Reports', roleReq: 'admin' },
    { id: 'notifications', label: '10. Notifications Center', roleReq: 'all' },
    { id: 'signin', label: '11. Sign In (Cognito)', roleReq: 'all' },
    { id: 'signup', label: '12. Sign Up (OTP Flow)', roleReq: 'all' }
  ];

  if (currentRoute === 'signin' || currentRoute === 'signup') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9980,
        backgroundColor: '#1A1A1A',
        border: '1px solid #333333',
        borderRadius: '8px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        color: '#FFFFFF',
        padding: isExpanded ? '0.625rem 1rem' : '0.4rem 0.875rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '96vw',
        transition: 'all 0.2s ease',
        userSelect: 'none',
        fontFamily: 'var(--font-sans)'
      }}
    >
      {/* Demo Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '3px 8px',
            borderRadius: '6px',
            backgroundColor: 'var(--primary-50)',
            border: '1px solid var(--primary-200)',
            fontSize: '0.6875rem',
            fontWeight: 600,
            color: 'var(--color-primary)'
          }}
        >
          <Sparkles size={12} /> HACKATHON DEMO BAR
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Persona Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.6875rem', color: '#AAAAAA', fontWeight: 500, textTransform: 'uppercase' }}>Persona:</span>
            {personas.map((p) => {
              const isCurrent = currentUser?.role === p.role;
              return (
                <button
                  key={p.role}
                  onClick={() => switchPersona(p.role)}
                  style={{
                    padding: '4px 9px',
                    borderRadius: '6px',
                    border: `1px solid ${isCurrent ? 'var(--color-primary)' : '#444444'}`,
                    backgroundColor: isCurrent ? 'var(--color-primary)' : 'rgba(255,255,255,0.05)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: isCurrent ? 600 : 400,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p.name}
                </button>
              );
            })}
          </div>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#333333' }} />

          {/* Quick Route Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Compass size={14} color="#AAAAAA" />
            <select
              value={currentRoute}
              onChange={(e) => onRouteChange(e.target.value)}
              style={{
                backgroundColor: '#262626',
                border: '1px solid #444444',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                padding: '4px 8px',
                borderRadius: '6px',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {screens.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div style={{ width: '1px', height: '18px', backgroundColor: '#333333' }} />

          {/* Action Utilities */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={() => setSimulateLatency(!simulateLatency)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '4px 8px',
                borderRadius: '6px',
                border: `1px solid ${simulateLatency ? 'var(--color-warning)' : '#444444'}`,
                backgroundColor: simulateLatency ? 'rgba(240,173,78,0.15)' : 'transparent',
                color: simulateLatency ? 'var(--color-warning)' : '#AAAAAA',
                fontSize: '0.6875rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Toggle AWS Lambda Latency Simulator (450ms)"
            >
              <Zap size={11} />
              Latency: {simulateLatency ? '450ms' : 'Off'}
            </button>

            <button
              onClick={() => {
                if (confirm('Reset demo state to initial hackathon defaults?')) {
                  resetDemoData();
                }
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid #444444',
                backgroundColor: 'transparent',
                color: '#AAAAAA',
                fontSize: '0.6875rem',
                cursor: 'pointer'
              }}
              title="Reset Mock DynamoDB state"
            >
              <RotateCcw size={11} /> Reset
            </button>
          </div>
        </>
      )}

      {/* Collapse Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: 'none',
          border: 'none',
          color: '#AAAAAA',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
        aria-label="Toggle Demo Bar"
      >
        {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
    </div>
  );
};
