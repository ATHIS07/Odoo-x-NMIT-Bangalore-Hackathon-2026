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
        backgroundColor: 'var(--color-bg-secondary)',
        borderRight: '1px solid var(--color-border)',
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
          borderBottom: '1px solid var(--color-border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: 700,
            fontFamily: 'var(--font-sans)',
            fontSize: '1.125rem'
          }}
        >
          O
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-text-heading)', fontFamily: 'var(--font-sans)' }}>
              Odoo
            </span>
            <span style={{ fontSize: '0.625rem', padding: '1px 5px', borderRadius: '4px', backgroundColor: 'var(--primary-50)', color: 'var(--color-primary)', fontWeight: 600 }}>
              ENTERPRISE
            </span>
          </div>
          <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem', marginTop: '2px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-success)' }} />
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
            borderRadius: '6px',
            backgroundColor: 'var(--color-warning-bg)',
            border: '1px solid var(--color-warning-bg)',
            color: 'var(--color-warning)',
            fontSize: '0.75rem'
          }}
        >
          <div style={{ fontWeight: 600 }}>Previewing as {impersonatedUser.name}</div>
          <button
            onClick={stopImpersonation}
            style={{
              marginTop: '4px',
              background: 'none',
              border: 'none',
              color: 'var(--color-warning)',
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
        <div style={{ padding: '0.5rem 0.75rem 0.25rem', fontSize: '0.6875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
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
                borderRadius: '6px',
                border: 'none',
                borderLeft: isActive ? '3px solid var(--color-primary)' : '3px solid transparent',
                backgroundColor: isActive ? 'var(--primary-50)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-body)',
                cursor: 'pointer',
                fontSize: '0.8125rem',
                fontWeight: 500,
                fontFamily: 'var(--font-sans)',
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
                <Icon size={17} color={isActive ? 'var(--color-primary)' : 'var(--color-text-muted)'} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  style={{
                    fontSize: '0.6875rem',
                    padding: '2px 6px',
                    borderRadius: '999px',
                    backgroundColor: 'var(--color-warning-bg)',
                    color: 'var(--color-warning)',
                    fontWeight: 600
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
          borderTop: '1px solid var(--color-border)',
          backgroundColor: '#FFFFFF'
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
              style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--color-border)' }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-heading)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {activeUser.name}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
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
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--color-danger)')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--color-text-muted)')}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
