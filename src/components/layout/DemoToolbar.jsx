import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { UserCheck, Zap, RotateCcw, Compass, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

export const DemoToolbar = ({ currentRoute, onRouteChange }) => {
  const { currentUser, switchPersona, role } = useAuth();
  const { simulateLatency, setSimulateLatency, resetDemoData } = useHRMS();
  const [isExpanded, setIsExpanded] = useState(true);

  const personas = [
    { role: 'employee', name: 'Sophia (Employee)', id: 'usr_001', color: '#2563EB' },
    { role: 'hr', name: 'Marcus (HR Lead)', id: 'usr_002', color: '#7C3AED' },
    { role: 'admin', name: 'Elena (Admin / VP)', id: 'usr_003', color: '#BE185D' }
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

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9980,
        backgroundColor: '#0F131C',
        border: '1px solid #2A364F',
        borderRadius: '14px',
        boxShadow: '0 12px 36px rgba(0, 0, 0, 0.45)',
        color: '#FFFFFF',
        padding: isExpanded ? '0.625rem 1rem' : '0.4rem 0.875rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        maxWidth: '96vw',
        transition: 'all 0.2s ease',
        userSelect: 'none'
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
            backgroundColor: 'rgba(37, 99, 235, 0.25)',
            border: '1px solid rgba(37, 99, 235, 0.4)',
            fontSize: '0.6875rem',
            fontWeight: 800,
            letterSpacing: '0.05em',
            color: '#60A5FA',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <Sparkles size={12} /> HACKATHON DEMO BAR
        </div>
      </div>

      {isExpanded && (
        <>
          {/* Persona Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase' }}>Persona:</span>
            {personas.map((p) => {
              const isCurrent = currentUser?.role === p.role;
              return (
                <button
                  key={p.role}
                  onClick={() => switchPersona(p.role)}
                  style={{
                    padding: '4px 9px',
                    borderRadius: '6px',
                    border: `1px solid ${isCurrent ? p.color : '#1E293B'}`,
                    backgroundColor: isCurrent ? p.color : 'rgba(255,255,255,0.05)',
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: isCurrent ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {p.name}
                </button>
              );
            })}
          </div>

          {/* Screen Jump Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Compass size={14} color="#64748B" />
            <select
              value={currentRoute}
              onChange={(e) => onRouteChange(e.target.value)}
              style={{
                backgroundColor: '#161D2B',
                color: '#E2E8F0',
                border: '1px solid #2A364F',
                borderRadius: '6px',
                padding: '4px 8px',
                fontSize: '0.75rem',
                outline: 'none',
                fontFamily: 'var(--font-sans)',
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

          {/* Latency Toggle */}
          <button
            onClick={() => setSimulateLatency(!simulateLatency)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid',
              borderColor: simulateLatency ? '#D97706' : '#2A364F',
              backgroundColor: simulateLatency ? 'rgba(217, 119, 6, 0.2)' : 'transparent',
              color: simulateLatency ? '#FBBF24' : '#94A3B8',
              fontSize: '0.6875rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Simulate realistic AWS API Gateway + Lambda execution delay"
          >
            <Zap size={12} />
            {simulateLatency ? 'Lambda Latency: ON (450ms)' : 'Latency: OFF (0ms)'}
          </button>

          {/* Reset Seed Button */}
          <button
            onClick={resetDemoData}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #2A364F',
              backgroundColor: 'transparent',
              color: '#94A3B8',
              fontSize: '0.6875rem',
              cursor: 'pointer'
            }}
            title="Reset all DynamoDB mock datasets to fresh state"
          >
            <RotateCcw size={12} />
            Reset Data
          </button>
        </>
      )}

      {/* Collapse/Expand Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: 'none',
          border: 'none',
          color: '#64748B',
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>
    </div>
  );
};
