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
  Check,
  Send,
  Info,
  CalendarDays
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { useToast } from '../../context/ToastContext';
import { Button, Card, Badge, MetricCard, Modal } from '../../components/common/CommonUI';

export const AttendanceView = () => {
  const { activeUser, isHRorAdmin } = useAuth();
  const { attendance, users, getTodayAttendance, clockIn, clockOut } = useHRMS();
  const { showToast, showSNSToast } = useToast();

  const [viewMode, setViewMode] = useState('daily'); // 'daily' | 'calendar'
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isRegularizeModalOpen, setIsRegularizeModalOpen] = useState(false);
  const [selectedDayRecord, setSelectedDayRecord] = useState(null);

  // Regularization form state
  const [regularizeForm, setRegularizeForm] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'both',
    checkIn: '09:30 AM',
    checkOut: '06:30 PM',
    reason: 'Biometric Reader Hardware Glitch',
    notes: 'Attended office on-time. Biometric machine failed to register badge.'
  });

  const todayRecord = getTodayAttendance(activeUser.id);
  const isClockedIn = todayRecord && !todayRecord.checkOut;

  // Live workforce attendance metrics for today
  const todayDateStr = '2026-08-22';
  const todayAttendanceRecords = attendance.filter((a) => a.date === todayDateStr);
  const liveInSessionCount = todayAttendanceRecords.filter((a) => a.checkIn && !a.checkOut).length;
  const checkedOutCount = todayAttendanceRecords.filter((a) => a.checkOut).length;
  const onLeaveCount = todayAttendanceRecords.filter((a) => a.status === 'leave').length;
  const totalPresentToday = todayAttendanceRecords.filter((a) => a.checkIn || a.status === 'present').length;
  const orgAttendanceRate = users.length > 0 ? Math.round((totalPresentToday / users.length) * 100) : 0;

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

  const handleRegularizeSubmit = (e) => {
    e.preventDefault();
    setIsRegularizeModalOpen(false);
    showToast({
      title: 'Regularization Submitted',
      message: `Request for ${regularizeForm.date} sent to HR Operations.`,
      type: 'success'
    });
    showSNSToast({
      title: 'Attendance Regularization Submitted',
      message: `Pending approval for ${activeUser.name} (${regularizeForm.date})`,
      source: 'Attendance OS'
    });
  };

  const exportCSV = () => {
    const csvContent = 'data:text/csv;charset=utf-8,' +
      ['Date,Employee ID,Check In,Check Out,Duration,Status,Location,Notes']
        .concat(displayRecords.map((r) => {
          const user = users.find((u) => u.id === r.userId);
          const empId = user?.employeeId || r.userId;
          return `${r.date},${empId},${r.checkIn || 'N/A'},${r.checkOut || 'N/A'},${r.duration},${r.status},"${r.location || ''}","${r.notes || ''}"`;
        }))
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Odoo_Attendance_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast({
      title: 'Export Generated',
      message: `${displayRecords.length} attendance rows exported to CSV.`,
      type: 'info'
    });
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Attendance & Shift Management
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {isHRorAdmin ? 'Organization-Wide View' : 'My Personal Log'}
            </span>
          </div>
          <h1 className="page-title">{isHRorAdmin ? 'Workforce Attendance Roster' : 'My Daily & Weekly Attendance'}</h1>
          <p className="page-subtitle">
            Track daily check-ins, check-outs, shift durations, and geo-verified locations.
          </p>
        </div>

        {/* Header Action Buttons */}
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="secondary" icon={Download} onClick={exportCSV}>
            Export Log
          </Button>
          {!isHRorAdmin && (
            <Button variant="secondary" icon={CalendarDays} onClick={() => setIsRegularizeModalOpen(true)}>
              Regularize Attendance
            </Button>
          )}
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

      {/* KPI Metrics */}
      <div className="grid-4" data-tour="attendance-metrics" style={{ marginBottom: '1.5rem' }}>
        {isHRorAdmin ? (
          <>
            <MetricCard
              label="Live In-Session"
              value={`${liveInSessionCount} Active`}
              subtitle="Punched in and currently working"
              icon={Clock}
              iconColor="var(--emerald-600)"
              iconBg="var(--emerald-50)"
            />

            <MetricCard
              label="Shift Completed"
              value={`${checkedOutCount} Checked Out`}
              subtitle="Shift completed & checked out"
              icon={CheckCircle2}
              iconColor="var(--color-primary)"
              iconBg="var(--primary-50)"
            />

            <MetricCard
              label="On Approved Leave"
              value={`${onLeaveCount} Employees`}
              subtitle="Approved time off today"
              icon={Calendar}
              iconColor="var(--color-warning)"
              iconBg="var(--color-warning-bg)"
            />

            <MetricCard
              label="Today's Attendance Rate"
              value={`${orgAttendanceRate}%`}
              subtitle={`${totalPresentToday} of ${users.length} Total Headcount`}
              icon={User}
              iconColor="#8B5CF6"
              iconBg="#F5F3FF"
            />
          </>
        ) : (
          <>
            <MetricCard
              label="Today's Shift Punch"
              value={todayRecord?.checkOut ? 'Shift Completed' : todayRecord?.checkIn ? todayRecord.checkIn : 'Not Clocked In'}
              subtitle={todayRecord?.checkOut ? `Checked out at ${todayRecord.checkOut} • Total ${todayRecord.duration}` : isClockedIn ? 'Active Work Session' : 'Shift Starts 09:30 AM IST'}
              icon={Clock}
              iconColor={todayRecord?.checkOut ? 'var(--color-primary)' : isClockedIn ? 'var(--emerald-600)' : 'var(--text-secondary)'}
              iconBg={todayRecord?.checkOut ? 'var(--primary-50)' : isClockedIn ? 'var(--emerald-50)' : 'var(--bg-surface-subtle)'}
            />

            <MetricCard
              label="August Present Rate"
              value="96.2%"
              subtitle="20 Days Logged • 1 Half-Day"
              icon={CheckCircle2}
              iconColor="var(--emerald-600)"
              iconBg="var(--emerald-50)"
              trend={{ value: '+2.1%', isPositive: true, text: 'vs July' }}
            />

            <MetricCard
              label="Average Daily Hours"
              value="8h 42m"
              subtitle="Target: 8h 00m standard shift"
              icon={Clock}
              iconColor="var(--primary-600)"
              iconBg="var(--primary-50)"
            />

            <MetricCard
              label="Shift Timing"
              value="09:30 AM - 06:00 PM"
              subtitle="General Shift (Bangalore HQ)"
              icon={MapPin}
              iconColor="#8B5CF6"
              iconBg="#F5F3FF"
            />
          </>
        )}
      </div>

      {/* Control Bar: View Switcher, Filter & Search */}
      <div
        data-tour="attendance-controls"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.25rem',
          padding: '0.875rem 1.25rem',
          backgroundColor: 'var(--bg-surface)',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}
      >
        {/* Left: View Mode Toggle */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', padding: '3px' }}>
          <button
            onClick={() => setViewMode('daily')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: viewMode === 'daily' ? 'var(--bg-surface)' : 'transparent',
              color: viewMode === 'daily' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: viewMode === 'daily' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Daily Timeline
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.8125rem',
              fontWeight: 600,
              cursor: 'pointer',
              backgroundColor: viewMode === 'calendar' ? 'var(--bg-surface)' : 'transparent',
              color: viewMode === 'calendar' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: viewMode === 'calendar' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            Monthly Calendar
          </button>
        </div>

        {/* Right: Filters & Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, justifyContent: 'flex-end' }}>
          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {['all', 'present', 'half-day', 'leave', 'absent'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: statusFilter === status ? 'var(--primary-600)' : 'transparent',
                  backgroundColor: statusFilter === status ? 'var(--primary-50)' : 'transparent',
                  color: statusFilter === status ? 'var(--primary-600)' : 'var(--text-secondary)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  cursor: 'pointer'
                }}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: 'relative', minWidth: '220px' }}>
            <Search size={14} color="var(--text-tertiary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              placeholder="Search by date or note..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.45rem 0.75rem 0.45rem 2rem',
                fontSize: '0.8125rem',
                borderRadius: '6px',
                border: '1px solid var(--border-subtle)',
                backgroundColor: 'var(--bg-surface-subtle)',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'daily' ? (
        /* Daily Timeline Table */
        <Card elevated data-tour="attendance-roster">
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  {isHRorAdmin && <th>Employee</th>}
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Total Duration</th>
                  <th>Status</th>
                  <th>Terminal / Geolocation</th>
                  <th>Remarks / Notes</th>
                </tr>
              </thead>
              <tbody>
                {displayRecords.length === 0 ? (
                  <tr>
                    <td colSpan={isHRorAdmin ? 8 : 7} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-tertiary)' }}>
                      No attendance entries matched the selected filters.
                    </td>
                  </tr>
                ) : (
                  displayRecords.map((rec) => {
                    const user = users.find((u) => u.id === rec.userId);
                    return (
                      <tr key={rec.id}>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{rec.date}</td>
                        {isHRorAdmin && (
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <img
                                src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240'}
                                alt=""
                                style={{ width: '24px', height: '24px', borderRadius: '50%', objectFit: 'cover' }}
                              />
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '0.8125rem' }}>{user?.name || rec.userId}</div>
                                <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                                  {user?.employeeId}
                                </div>
                              </div>
                            </div>
                          </td>
                        )}
                        <td style={{ fontFamily: 'var(--font-mono)', color: rec.checkIn ? 'var(--emerald-600)' : 'var(--text-tertiary)', fontWeight: 600 }}>
                          {rec.checkIn || '—'}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>
                          {rec.checkOut ? (
                            <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{rec.checkOut}</span>
                          ) : rec.checkIn && rec.date === '2026-08-22' ? (
                            <span style={{ color: 'var(--emerald-600)', fontWeight: 600, fontSize: '0.75rem', backgroundColor: 'var(--emerald-50)', padding: '2px 6px', borderRadius: '4px' }}>
                              ● Live Active
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-tertiary)' }}>—</span>
                          )}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                          {rec.duration}
                        </td>
                        <td>
                          {rec.checkOut ? (
                            <Badge variant="present">Shift Done</Badge>
                          ) : rec.checkIn && rec.date === '2026-08-22' ? (
                            <Badge variant="present">Clocked In</Badge>
                          ) : rec.status === 'leave' ? (
                            <Badge variant="leave">On Leave</Badge>
                          ) : rec.status === 'half-day' ? (
                            <Badge variant="warning">Half Day</Badge>
                          ) : (
                            <Badge variant="absent">Not Punched</Badge>
                          )}
                        </td>
                        <td style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {rec.location || 'Bangalore HQ Terminal'}
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
            <div className="card-title">August 2026 Shift Calendar (Click any day to inspect)</div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
              Total Working Days: 21 • Standard 8h Shift
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
              const isWeekend = (dayNum % 7 === 1 || dayNum % 7 === 2);

              return (
                <div
                  key={dayNum}
                  onClick={() => {
                    if (dayRec || isToday) {
                      setSelectedDayRecord(dayRec || { date: dateStr, status: 'present', checkIn: '09:24 AM', checkOut: 'Live Active', duration: 'Live', location: 'Bangalore HQ Floor 4', notes: 'Active shift' });
                    }
                  }}
                  style={{
                    minHeight: '80px',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    border: `1px solid ${isToday ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                    backgroundColor: isToday ? 'var(--color-primary-light)' : isWeekend ? 'var(--bg-surface-subtle)' : 'var(--bg-surface)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    cursor: (dayRec || isToday) ? 'pointer' : 'default',
                    transition: 'transform 0.1s ease, box-shadow 0.1s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: isToday ? 800 : 600, color: isToday ? 'var(--color-primary)' : 'var(--text-primary)' }}>
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

      {/* Attendance Regularization Modal */}
      <Modal
        isOpen={isRegularizeModalOpen}
        onClose={() => setIsRegularizeModalOpen(false)}
        title="Request Attendance Regularization"
        maxWidth="540px"
      >
        <form onSubmit={handleRegularizeSubmit}>
          <div style={{ marginBottom: '1rem', padding: '0.75rem', borderRadius: '6px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--border-subtle)', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            Missed a punch due to device glitch or client on-duty visit? Submit your actual shift hours for HR approval.
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Shift Date</label>
              <input
                type="date"
                required
                value={regularizeForm.date}
                onChange={(e) => setRegularizeForm({ ...regularizeForm, date: e.target.value })}
                className="form-input font-mono"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Regularization Type</label>
              <select
                value={regularizeForm.type}
                onChange={(e) => setRegularizeForm({ ...regularizeForm, type: e.target.value })}
                className="form-input"
              >
                <option value="both">Both (Check In & Out)</option>
                <option value="in">Missing Check In</option>
                <option value="out">Missing Check Out</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Actual Check In</label>
              <input
                type="text"
                required
                placeholder="09:30 AM"
                value={regularizeForm.checkIn}
                onChange={(e) => setRegularizeForm({ ...regularizeForm, checkIn: e.target.value })}
                className="form-input font-mono"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Actual Check Out</label>
              <input
                type="text"
                required
                placeholder="06:30 PM"
                value={regularizeForm.checkOut}
                onChange={(e) => setRegularizeForm({ ...regularizeForm, checkOut: e.target.value })}
                className="form-input font-mono"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Reason for Missed Punch</label>
            <select
              value={regularizeForm.reason}
              onChange={(e) => setRegularizeForm({ ...regularizeForm, reason: e.target.value })}
              className="form-input"
            >
              <option value="Biometric Reader Hardware Glitch">Biometric Reader Hardware Glitch</option>
              <option value="On-Duty Client / Partner Visit">On-Duty Client / Partner Visit</option>
              <option value="Network / Power Outage at Terminal">Network / Power Outage at Terminal</option>
              <option value="Forgot to Punch RFID Card">Forgot to Punch RFID Card</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Additional Explanatory Notes</label>
            <textarea
              rows={2}
              value={regularizeForm.notes}
              onChange={(e) => setRegularizeForm({ ...regularizeForm, notes: e.target.value })}
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
            <Button variant="ghost" type="button" onClick={() => setIsRegularizeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" icon={Send}>
              Submit to HR
            </Button>
          </div>
        </form>
      </Modal>

      {/* Calendar Day Inspector Modal */}
      <Modal
        isOpen={!!selectedDayRecord}
        onClose={() => setSelectedDayRecord(null)}
        title={`Attendance Record: ${selectedDayRecord?.date}`}
        maxWidth="480px"
      >
        {selectedDayRecord && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Employee</div>
                <div style={{ fontWeight: 700 }}>{activeUser.name} ({activeUser.employeeId})</div>
              </div>
              <Badge variant={selectedDayRecord.status}>{selectedDayRecord.status}</Badge>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Check-In Time</div>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--emerald-600)' }}>
                  {selectedDayRecord.checkIn || '—'}
                </div>
              </div>
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Check-Out Time</div>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {selectedDayRecord.checkOut || '—'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Logged Duration:</span>
                <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{selectedDayRecord.duration}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Terminal / IP Location:</span>
                <span style={{ fontWeight: 600 }}>{selectedDayRecord.location || 'Bangalore HQ Terminal'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-tertiary)' }}>Notes / Activity:</span>
                <span>{selectedDayRecord.notes || 'Normal working hours logged.'}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button variant="secondary" onClick={() => setSelectedDayRecord(null)}>
                Close Record
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
