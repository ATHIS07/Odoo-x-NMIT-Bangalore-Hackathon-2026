import React from 'react';
import {
  LayoutDashboard,
  User,
  Clock,
  CalendarDays,
  CheckSquare,
  CreditCard,
  BarChart3,
  Bell,
  LogOut,
  ShieldCheck,
  Zap,
  Building2,
  Users
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = ({ currentRoute, onRouteChange, onOpenNotifications }) => {
  const { activeUser, role, isAdmin, isHR, isHRorAdmin, signOut, impersonatedUser, stopImpersonation } = useAuth();

  // Role-based navigation structure
  const navItems = [
    {
      id: isHRorAdmin ? 'admin-dashboard' : 'employee-dashboard',
      label: isHRorAdmin ? 'Executive HQ' : 'My Workspace',
      icon: LayoutDashboard,
      roles: ['employee', 'hr', 'admin']
    },
    {
      id: 'attendance',
      label: isHRorAdmin ? 'Attendance Roster' : 'My Attendance',
      icon: Clock,
      roles: ['employee', 'hr', 'admin']
    },
    {
      id: 'leave-apply',
      label: 'Apply for Leave',
      icon: CalendarDays,
      roles: ['employee', 'hr', 'admin']
    },
    {
      id: 'leave-approvals',
      label: 'Leave Approvals',
      icon: CheckSquare,
      roles: ['hr', 'admin'],
      badge: '3 Pending'
    },
    {
      id: 'payroll',
      label: isHRorAdmin ? 'Payroll & CTC' : 'My Payslips',
      icon: CreditCard,
      roles: ['employee', 'hr', 'admin']
    },
    {
      id: 'profile',
      label: 'My Dossier / Profile',
      icon: User,
      roles: ['employee', 'hr', 'admin']
    },
    {
      id: 'analytics',
      label: 'Workforce Analytics',
      icon: BarChart3,
      roles: ['hr', 'admin']
    },
    {
      id: 'notifications',
      label: 'Alerts & Activity',
      icon: Bell,
      roles: ['employee', 'hr', 'admin']
    }
  ];

  const visibleNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--bg-sidebar)',
        borderRight: '1px solid var(--border-sidebar)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100vh',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        userSelect: 'none'
      }}
    >
      {/* Brand Identity */}
      <div
        style={{
          padding: '1.5rem 1.25rem',
          borderBottom: '1px solid var(--border-sidebar)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem'
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: 'var(--primary-600)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 800,
            boxShadow: '0 0 16px rgba(37,99,235,0.4)',
            fontFamily: 'var(--font-display)',
            fontSize: '1.125rem'
          }}
        >
          D
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 800, color: '#FFFFFF', letterSpacing: '-0.03em', fontFamily: 'var(--font-display)' }}>
              Dayflow
            </span>
            <span style={{ fontSize: '0.625rem', padding: '1px 5px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.1)', color: '#94A3B8', fontWeight: 700 }}>
              ENTERPRISE
            </span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
            <span className="pulse-dot" style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'var(--emerald-500)' }} />
            AWS DynamoDB Connected
          </div>
        </div>
      </div>

      {/* Impersonation Banner if active */}
      {impersonatedUser && (
        <div
          style={{
            margin: '0.75rem',
            padding: '0.625rem 0.75rem',
            borderRadius: '8px',
            backgroundColor: 'rgba(217, 119, 6, 0.15)',
            border: '1px solid rgba(217, 119, 6, 0.3)',
            color: '#FDE68A',
            fontSize: '0.75rem'
          }}
        >
          <div style={{ fontWeight: 700 }}>Previewing as {impersonatedUser.name}</div>
          <button
            onClick={stopImpersonation}
            style={{
              marginTop: '4px',
              background: 'none',
              border: 'none',
              color: '#F59E0B',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '0.6875rem',
              padding: 0
            }}
          >
            Exit Employee View
          </button>
        </div>
      )}

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '1rem 0.75rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <div style={{ padding: '0.5rem 0.75rem 0.25rem', fontSize: '0.6875rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {isHRorAdmin ? 'Executive Management' : 'Employee Self-Service'}
        </div>

        {visibleNav.map((item) => {
          const isActive = currentRoute === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'notifications' && onOpenNotifications) {
                  onOpenNotifications();
                } else {
                  onRouteChange(item.id);
                }
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.625rem 0.75rem',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: isActive ? 'var(--bg-sidebar-active)' : 'transparent',
                color: isActive ? '#FFFFFF' : '#94A3B8',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 600 : 500,
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'var(--bg-sidebar-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Icon size={17} color={isActive ? 'var(--primary-500)' : '#64748B'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  style={{
                    fontSize: '0.6875rem',
                    padding: '2px 6px',
                    borderRadius: '9999px',
                    backgroundColor: 'rgba(217, 119, 6, 0.2)',
                    color: '#F59E0B',
                    fontWeight: 700,
                    fontFamily: 'var(--font-mono)'
                  }}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Badge & Signout Footer */}
      <div
        style={{
          padding: '1rem',
          borderTop: '1px solid var(--border-sidebar)',
          backgroundColor: 'rgba(0,0,0,0.2)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            onClick={() => onRouteChange('profile')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', cursor: 'pointer', flex: 1, minWidth: 0 }}
          >
            <img
              src={activeUser.avatar}
              alt={activeUser.name}
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid #334155' }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#F8FAFC', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeUser.name}
              </div>
              <div style={{ fontSize: '0.6875rem', color: '#64748B', fontFamily: 'var(--font-mono)', textTransform: 'uppercase' }}>
                {activeUser.employeeId} • {activeUser.role}
              </div>
            </div>
          </div>

          <button
            onClick={signOut}
            title="Sign out of Cognito"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--rose-500)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748B')}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
