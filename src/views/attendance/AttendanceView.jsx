import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  Filter,
  Download,
  Search,
  CheckCircle2,
  AlertTriangle,
  User,
  MapPin,
  Sparkles,
  Coffee,
  Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Button, Card, Badge, MetricCard } from '../../components/common/CommonUI';

export const AttendanceView = () => {
  const { activeUser, isHRorAdmin } = useAuth();
  const { attendance, users, getTodayAttendance, clockIn, clockOut } = useHRMS();

  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'calendar'
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const todayRecord = getTodayAttendance(activeUser.id);
  const isClockedIn = todayRecord && !todayRecord.checkOut;

  // Filter records based on role and filters
  const displayRecords = attendance.filter((rec) => {
    // Role gating: Employee sees only their own; Admin sees all
    if (!isHRorAdmin && rec.userId !== activeUser.id) return false;

    // Status filter
    if (statusFilter !== 'all' && rec.status !== statusFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const user = users.find((u) => u.id === rec.userId);
      const name = user ? user.name.toLowerCase() : '';
      const date = rec.date.toLowerCase();
      const q = searchQuery.toLowerCase();
      if (!name.includes(q) && !date.includes(q) && !rec.notes?.toLowerCase().includes(q)) {
        return false;
      }
    }

    return true;
  });

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      ['Date,User ID,Check In,Check Out,Duration,Status,Location,Notes']
        .concat(displayRecords.map((r) => `${r.date},${r.userId},${r.checkIn || 'N/A'},${r.checkOut || 'N/A'},${r.duration},${r.status},"${r.location || ''}","${r.notes || ''}"`))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Dayflow_Attendance_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Attendance & Shifts OS
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {isHRorAdmin ? 'Organization-Wide View' : 'My Personal Log'}
            </span>
          </div>
          <h1 className="page-title">{isHRorAdmin ? 'Workforce Attendance Roster' : 'My Daily & Weekly Attendance'}</h1>
          <p className="page-subtitle">
            Sub-millisecond punch logging via DynamoDB streams with geolocation terminal tracking.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={Download} onClick={exportCSV}>
            Export CSV
          </Button>
          {!isHRorAdmin && (
            !isClockedIn ? (
              <Button variant="success" icon={Clock} onClick={() => clockIn(activeUser.id)}>
                Clock In
              </Button>
            ) : (
              <Button variant="danger" icon={Clock} onClick={() => clockOut(activeUser.id)}>
                Clock Out
              </Button>
            )
          )}
        </div>
      </div>

      {/* Top Attendance Metric Tiles */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard
          label="Today's Check-In"
          value={todayRecord?.checkIn || 'Not Punched'}
          subtitle={todayRecord?.checkOut ? `Checked out at ${todayRecord.checkOut}` : isClockedIn ? 'Active Work Session' : 'Shift Starts 09:00 AM'}
          icon={Clock}
          iconColor={isClockedIn ? 'var(--emerald-600)' : 'var(--text-secondary)'}
          iconBg={isClockedIn ? 'var(--emerald-50)' : 'var(--bg-surface-subtle)'}
        />

        <MetricCard
          label="On-Time Rate"
          value="98.2%"
          subtitle="24 on-time logs this month"
          icon={CheckCircle2}
          iconColor="var(--emerald-600)"
          iconBg="var(--emerald-50)"
        />

        <MetricCard
          label="Weekly Total Hours"
          value="39h 45m"
          subtitle="Target: 40h standard core"
          icon={Calendar}
          iconColor="var(--primary-600)"
          iconBg="var(--primary-50)"
        />

        <MetricCard
          label="Anomaly Flags"
          value="0 Flags"
          subtitle="Zero unexcused absences"
          icon={AlertTriangle}
          iconColor="var(--color-primary)"
          iconBg="var(--primary-50)"
        />
      </div>

      {/* Control Bar: Search, Filters & View Mode */}
      <Card style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, minWidth: '240px' }}>
            <div style={{ position: 'relative', width: '100%', maxWidth: '320px' }}>
              <Search size={15} color="var(--text-tertiary)" style={{ position: 'absolute', left: '10px', top: '9px' }} />
              <input
                type="text"
                placeholder="Search by date, employee or note..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.45rem 0.75rem 0.45rem 2rem',
                  fontSize: '0.8125rem',
                  border: '1px solid var(--border-default)',
                  borderRadius: '6px',
                  outline: 'none',
                  backgroundColor: 'var(--bg-surface)'
                }}
              />
            </div>

            {/* Status Filter Pills */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              {['all', 'present', 'half-day', 'leave', 'absent'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: statusFilter === st ? 'var(--primary-600)' : 'var(--border-subtle)',
                    backgroundColor: statusFilter === st ? 'var(--primary-50)' : 'transparent',
                    color: statusFilter === st ? 'var(--primary-700)' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: statusFilter === st ? 700 : 500,
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface-subtle)', padding: '2px', borderRadius: '8px' }}>
            <button
              onClick={() => setViewMode('daily')}
              style={{
                padding: '0.35rem 0.75rem',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: viewMode === 'daily' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'daily' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                fontWeight: viewMode === 'daily' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'daily' ? 'var(--shadow-xs)' : 'none'
              }}
            >
              Timeline Table
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              style={{
                padding: '0.35rem 0.75rem',
                border: 'none',
                borderRadius: '6px',
                backgroundColor: viewMode === 'calendar' ? 'var(--bg-surface)' : 'transparent',
                color: viewMode === 'calendar' ? 'var(--text-primary)' : 'var(--text-tertiary)',
                fontWeight: viewMode === 'calendar' ? 700 : 500,
                fontSize: '0.75rem',
                cursor: 'pointer',
                boxShadow: viewMode === 'calendar' ? 'var(--shadow-xs)' : 'none'
              }}
            >
              Monthly Calendar Grid
            </button>
          </div>
        </div>
      </Card>

      {/* View Content */}
      {viewMode === 'daily' ? (
        <Card elevated>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  {isHRorAdmin && <th>Employee</th>}
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Work Duration</th>
                  <th>Status</th>
                  <th>Terminal / Geolocation</th>
                  <th>Audit Notes</th>
                </tr>
              </thead>
              <tbody>
                {displayRecords.length === 0 ? (
                  <tr>
                    <td colSpan={isHRorAdmin ? 8 : 7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                      No attendance records found matching filters.
                    </td>
                  </tr>
                ) : (
                  displayRecords.map((rec) => {
                    const emp = users.find((u) => u.id === rec.userId);

                    return (
                      <tr key={rec.id}>
                        {isHRorAdmin && (
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                              {emp && (
                                <img
                                  src={emp.avatar}
                                  alt={emp.name}
                                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                                />
                              )}
                              <div>
                                <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{emp?.name || rec.userId}</div>
                                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                                  {emp?.employeeId}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{rec.date}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                          {rec.checkIn || '—'}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
                          {rec.checkOut || (rec.checkIn ? <span style={{ color: 'var(--emerald-600)', fontWeight: 700 }}>In Progress</span> : '—')}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{rec.duration}</td>
                        <td>
                          <Badge variant={rec.status}>{rec.status}</Badge>
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {rec.location || 'Remote Terminal'}
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                          {rec.notes || '—'}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        /* Monthly Calendar Grid View */
        <Card elevated>
          <div className="card-header">
            <div className="card-title">August 2026 Shift Calendar</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              Total Working Days: 21
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <div key={day} style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', padding: '0.5rem 0' }}>
                {day}
              </div>
            ))}

            {Array.from({ length: 31 }, (_, i) => {
              const dayNum = i + 1;
              const dateStr = `2026-08-${String(dayNum).padStart(2, '0')}`;
              const dayRec = attendance.find((a) => a.userId === activeUser.id && a.date === dateStr);
              const isToday = dayNum === 22;
              const isWeekend = (dayNum % 7 === 1 || dayNum % 7 === 2); // approximate weekends

              return (
                <div
                  key={dayNum}
                  style={{
                    minHeight: '80px',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: `1px solid ${isToday ? 'var(--primary-600)' : 'var(--border-subtle)'}`,
                    backgroundColor: isToday ? 'var(--primary-50)' : isWeekend ? 'var(--bg-surface-subtle)' : 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'left'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: isToday ? 800 : 600, color: isToday ? 'var(--primary-700)' : 'var(--text-primary)' }}>
                      {dayNum}
                    </span>
                    {isToday && <Badge variant="present" style={{ fontSize: '0.625rem', padding: '1px 4px' }}>Today</Badge>}
                  </div>

                  {dayRec ? (
                    <div style={{ marginTop: '0.25rem' }}>
                      <Badge variant={dayRec.status} style={{ fontSize: '0.6875rem', padding: '1px 5px' }}>
                        {dayRec.status}
                      </Badge>
                      <div style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                        {dayRec.duration}
                      </div>
                    </div>
                  ) : isWeekend ? (
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>Weekend</span>
                  ) : (
                    <span style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)' }}>—</span>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
};
