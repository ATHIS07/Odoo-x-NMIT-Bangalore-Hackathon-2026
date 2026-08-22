import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  CalendarCheck,
  CreditCard,
  User,
  ArrowUpRight,
  Sparkles,
  MapPin,
  Coffee,
  CheckCircle,
  AlertCircle,
  FileText,
  Building2,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Button, Card, Badge, MetricCard } from '../../components/common/CommonUI';
import { LeaveQuotaDonut } from '../../components/charts/Charts';

export const EmployeeDashboardView = ({ onNavigate }) => {
  const { activeUser } = useAuth();
  const { profiles, getTodayAttendance, clockIn, clockOut, leaves, notifications, companyHolidays } = useHRMS();

  const userProfile = profiles[activeUser.id] || {};
  const todayRecord = getTodayAttendance(activeUser.id);
  const isClockedIn = todayRecord && !todayRecord.checkOut;

  // Running work timer
  const [elapsedSeconds, setElapsedSeconds] = useState(28440); // ~7h 54m base
  const [isOnBreak, setIsOnBreak] = useState(false);

  useEffect(() => {
    let timer;
    if (isClockedIn && !isOnBreak) {
      timer = setInterval(() => setElapsedSeconds((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isClockedIn, isOnBreak]);

  const formatTimer = (totalSec) => {
    const hrs = Math.floor(totalSec / 3600);
    const mins = Math.floor((totalSec % 3600) / 60);
    const secs = totalSec % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const userLeaves = leaves.filter((l) => l.userId === activeUser.id);
  const recentLeaves = userLeaves.slice(0, 3);

  return (
    <div className="page-wrapper">
      {/* Welcome Banner */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Employee Self-Service Portal
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
              {activeUser.employeeId}
            </span>
          </div>
          <h1 className="page-title">Welcome back, {activeUser.name.split(' ')[0]}</h1>
          <p className="page-subtitle">
            {userProfile.jobDetails?.designation || activeUser.designation} • {userProfile.jobDetails?.department || activeUser.department}
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" icon={CalendarDays} onClick={() => onNavigate('leave-apply')}>
            Apply for Leave
          </Button>
          <Button variant="primary" icon={CreditCard} onClick={() => onNavigate('payroll')}>
            View July Payslip
          </Button>
        </div>
      </div>

      {/* Quick-Access Navigation Cards Grid (PDF Section 3.2.1 Mandate) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
        <Card
          onClick={() => onNavigate('profile')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.25rem', transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary-600)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--primary-50)', color: 'var(--primary-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>My Profile</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Dossier & Documents</div>
          </div>
        </Card>

        <Card
          onClick={() => onNavigate('attendance')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.25rem', transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--emerald-600)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--emerald-50)', color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Clock size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Attendance</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Daily/Weekly Logs</div>
          </div>
        </Card>

        <Card
          onClick={() => onNavigate('leave-apply')}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.25rem', transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#8B5CF6'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F5F3FF', color: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <CalendarCheck size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Leave Requests</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Apply & Track Quota</div>
          </div>
        </Card>

        <Card
          onClick={() => {
            if (confirm('Are you sure you want to sign out of Cognito?')) {
              localStorage.removeItem('dayflow_auth_user');
              window.location.reload();
            }
          }}
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '1rem 1.25rem', transition: 'all 0.2s ease' }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--rose-600)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-subtle)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: 'var(--rose-50)', color: 'var(--rose-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Sign Out</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Revoke Session</div>
          </div>
        </Card>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard
          label="Attendance Status"
          value={isClockedIn ? 'Clocked In' : todayRecord?.checkOut ? 'Shift Done' : 'Not Punched'}
          subtitle={todayRecord?.checkIn ? `Since ${todayRecord.checkIn}` : 'Standard shift starts 09:00 AM'}
          icon={Clock}
          iconColor={isClockedIn ? 'var(--emerald-600)' : 'var(--text-secondary)'}
          iconBg={isClockedIn ? 'var(--emerald-50)' : 'var(--bg-surface-subtle)'}
        />

        <MetricCard
          label="Leave Balance (Paid)"
          value={`${userProfile.leaveBalance?.paid?.remaining ?? 14} Days`}
          subtitle={`Used: ${userProfile.leaveBalance?.paid?.used ?? 6} of ${userProfile.leaveBalance?.paid?.total ?? 20} days`}
          icon={CalendarCheck}
          iconColor="var(--primary-600)"
          iconBg="var(--primary-50)"
        />

        <MetricCard
          label="Estimated Net Pay"
          value="$14,734"
          subtitle="August 2026 Cycle • Depositing Aug 31"
          icon={CreditCard}
          iconColor="var(--emerald-600)"
          iconBg="var(--emerald-50)"
        />

        <MetricCard
          label="Next Holiday"
          value="Labor Day"
          subtitle="Mon, Sep 07 (Federal Closure)"
          icon={Building2}
          iconColor="#8B5CF6"
          iconBg="#F5F3FF"
        />
      </div>

      {/* Main Console Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Interactive Live Clock-In Console */}
        <Card elevated>
          <div className="card-header">
            <div className="card-title">
              <Clock size={20} color="var(--primary-600)" />
              Daily Shift & Punch Console
            </div>
            <Badge variant={isClockedIn ? 'present' : 'pending'}>
              {isClockedIn ? 'Live Active' : 'Offline'}
            </Badge>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'center' }}>
            {/* Live Elapsed Stopwatch */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface-subtle)',
                padding: '1.5rem',
                borderRadius: '12px',
                textAlign: 'center',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Logged Today Duration
              </div>
              <div
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)',
                  color: isClockedIn ? 'var(--text-primary)' : 'var(--text-tertiary)',
                  marginTop: '0.25rem'
                }}
              >
                {isClockedIn ? formatTimer(elapsedSeconds) : '00:00:00'}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginTop: '0.5rem' }}>
                <MapPin size={13} color="var(--emerald-600)" />
                <span>San Francisco HQ Floor 4 Terminal</span>
              </div>
            </div>

            {/* Actions & Punch Controls */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {!isClockedIn ? (
                <Button
                  variant="success"
                  size="lg"
                  icon={Clock}
                  onClick={() => clockIn(activeUser.id)}
                  style={{ width: '100%' }}
                >
                  Clock In to Shift
                </Button>
              ) : (
                <Button
                  variant="danger"
                  size="lg"
                  icon={Clock}
                  onClick={() => clockOut(activeUser.id)}
                  style={{ width: '100%' }}
                >
                  Clock Out (End Shift)
                </Button>
              )}

              <Button
                variant={isOnBreak ? 'primary' : 'secondary'}
                size="md"
                icon={Coffee}
                disabled={!isClockedIn}
                onClick={() => setIsOnBreak(!isOnBreak)}
                style={{ width: '100%' }}
              >
                {isOnBreak ? 'Resume from Break' : 'Take Coffee Break'}
              </Button>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textAlign: 'center', marginTop: '0.25rem' }}>
                Shift Policy: 09:00 AM - 05:30 PM PST (1h mandatory break)
              </div>
            </div>
          </div>
        </Card>

        {/* Leave Quota Donut Meter */}
        <Card elevated>
          <div className="card-header">
            <div className="card-title">
              <CalendarCheck size={20} color="var(--primary-600)" />
              Leave Quota Balance
            </div>
            <button
              onClick={() => onNavigate('leave-apply')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
            >
              Apply <ArrowUpRight size={14} />
            </button>
          </div>

          <LeaveQuotaDonut balance={userProfile.leaveBalance} />
        </Card>
      </div>

      {/* Bottom Section: Recent Leaves & Activity Stream */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Recent Leave Requests */}
        <Card>
          <div className="card-header">
            <div className="card-title">My Recent Leave Requests</div>
            <button
              onClick={() => onNavigate('leave-apply')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
            >
              View All
            </button>
          </div>

          {recentLeaves.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
              No leave requests filed yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {recentLeaves.map((l) => (
                <div
                  key={l.id}
                  style={{
                    padding: '0.875rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {l.leaveType.toUpperCase()} LEAVE ({l.daysCount} Days)
                      </span>
                      <Badge variant={l.status === 'approved' ? 'approved' : l.status === 'rejected' ? 'rejected' : 'pending'}>
                        {l.status}
                      </Badge>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      {l.startDate} → {l.endDate} • {l.remarks}
                    </div>
                  </div>

                  {l.adminComment && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontStyle: 'italic', maxWidth: '200px', textAlign: 'right' }}>
                      "{l.adminComment}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Company Holidays & Events Radar */}
        <Card>
          <div className="card-header">
            <div className="card-title">Upcoming Company Holidays</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>2026 Calendar</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {companyHolidays.slice(0, 3).map((h, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface-subtle)'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{h.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>{h.type}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--primary-600)' }}>
                    {h.date}
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>{h.day}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
