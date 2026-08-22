import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  CalendarCheck,
  UploadCloud,
  FileText,
  CheckCircle,
  AlertCircle,
  Clock,
  ArrowRight,
  Info,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Button, Card, Badge, MetricCard } from '../../components/common/CommonUI';
import { FileUpload } from '../../components/common/FileUpload';

export const LeaveApplyView = ({ onNavigate }) => {
  const { activeUser } = useAuth();
  const { profiles, applyLeave, leaves } = useHRMS();

  const userProfile = profiles[activeUser?.id] || {};
  const balance = userProfile.leaveBalance || {
    paid: { total: 20, used: 6, remaining: 14 },
    sick: { total: 12, used: 2, remaining: 10 },
    unpaid: { total: 15, used: 0, remaining: 15 },
    compensatory: { total: 5, used: 1, remaining: 4 }
  };

  const [leaveType, setLeaveType] = useState('paid');
  const [startDate, setStartDate] = useState('2026-09-04');
  const [endDate, setEndDate] = useState('2026-09-08');
  const [remarks, setRemarks] = useState('');
  const [attachedDoc, setAttachedDoc] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Auto-calculate working days (excluding weekends)
  const calculateWorkingDays = (start, end) => {
    if (!start || !end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    if (e < s) return 0;
    
    let count = 0;
    let cur = new Date(s);
    while (cur <= e) {
      const dayOfWeek = cur.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sat or Sun
        count++;
      }
      cur.setDate(cur.getDate() + 1);
    }
    return Math.max(1, count);
  };

  const daysCount = calculateWorkingDays(startDate, endDate);
  const currentRemaining = balance[leaveType]?.remaining || 10;
  const isQuotaExceeded = leaveType !== 'unpaid' && daysCount > currentRemaining;
  const remainingAfter = Math.max(0, currentRemaining - daysCount);

  // Check for date overlaps with existing leaves
  const userLeaveHistory = leaves.filter((l) => l.userId === activeUser.id);
  const conflictingLeave = userLeaveHistory.find((l) => {
    if (l.status === 'rejected') return false;
    const reqStart = new Date(startDate);
    const reqEnd = new Date(endDate);
    const existingStart = new Date(l.startDate);
    const existingEnd = new Date(l.endDate);
    return (reqStart <= existingEnd && reqEnd >= existingStart);
  });

  const reasonPresets = [
    'Attending tech conference & outstation workshops',
    'Personal / family commitment & travel',
    'Viral fever & doctor advised bed rest',
    'Routine dental / medical follow-up consultation',
    'Personal sabbatical & continuous learning'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isQuotaExceeded) {
      alert(`Cannot submit: requested duration (${daysCount} days) exceeds your available ${leaveType} balance (${currentRemaining} days).`);
      return;
    }
    if (!remarks.trim()) {
      alert('Please provide a brief reason / remarks for your leave application');
      return;
    }

    setIsSubmitting(true);
    await applyLeave({
      leaveType,
      startDate,
      endDate,
      daysCount,
      remarks,
      attachment: attachedDoc?.name || null
    });
    setIsSubmitting(false);
    setSubmittedSuccess(true);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Time-Off & Leave Management
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {activeUser.name} ({activeUser.employeeId})
            </span>
          </div>
          <h1 className="page-title">Apply for Leave</h1>
          <p className="page-subtitle">
            Submit leave applications for manager review and entitlement tracking.
          </p>
        </div>
      </div>

      {/* Quota Metric Tiles */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard
          label="Paid Leave Balance"
          value={`${balance.paid.remaining} Days`}
          subtitle={`${balance.paid.used} used of ${balance.paid.total} total`}
          icon={CalendarCheck}
          iconColor="var(--emerald-600)"
          iconBg="var(--emerald-50)"
        />

        <MetricCard
          label="Sick Leave Balance"
          value={`${balance.sick.remaining} Days`}
          subtitle={`${balance.sick.used} used of ${balance.sick.total} total`}
          icon={Clock}
          iconColor="var(--sky-600)"
          iconBg="var(--sky-50)"
        />

        <MetricCard
          label="Unpaid Leave Available"
          value={`${balance.unpaid.remaining} Days`}
          subtitle={`${balance.unpaid.used} used of ${balance.unpaid.total} max`}
          icon={FileText}
          iconColor="var(--color-primary)"
          iconBg="var(--primary-50)"
        />

        <MetricCard
          iconBg="var(--bg-surface-subtle)"
        />
      </div>

      {/* Main Apply Form & Live Preview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Form Card */}
        <Card elevated>
          <div className="card-header">
            <div className="card-title">
              <CalendarDays size={18} color="var(--primary-600)" />
              New Leave Application Form
            </div>
            <Badge variant="info">Stream Synced</Badge>
          </div>

          {submittedSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: 'center', padding: '3rem 1.5rem' }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--emerald-50)',
                  color: 'var(--emerald-600)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}
              >
                <CheckCircle size={32} />
              </div>
              <h2 style={{ fontSize: '1.375rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                Leave Application Dispatched!
              </h2>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                Your request for <strong>{daysCount} working days</strong> ({leaveType.toUpperCase()}) was submitted and sent to your manager.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                <Button variant="secondary" onClick={() => setSubmittedSuccess(false)}>
                  Apply Another
                </Button>
                <Button variant="primary" onClick={() => onNavigate('employee-dashboard')}>
                  Return to Dashboard
                </Button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Overlap Alert Banner */}
              {conflictingLeave && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#DC2626',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <AlertTriangle size={18} />
                  <div>
                    <strong>Date Conflict:</strong> You already have a {conflictingLeave.leaveType.toUpperCase()} leave ({conflictingLeave.startDate} to {conflictingLeave.endDate}) during this window.
                  </div>
                </div>
              )}

              {/* Quota Exceeded Banner */}
              {isQuotaExceeded && (
                <div
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#DC2626',
                    fontSize: '0.8125rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.625rem',
                    marginBottom: '1.25rem'
                  }}
                >
                  <AlertCircle size={18} />
                  <div>
                    <strong>Quota Limit Exceeded:</strong> You requested {daysCount} days, but only have {currentRemaining} {leaveType} days remaining.
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Leave Category</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                  {[
                    { id: 'paid', label: 'Paid / Casual', balance: balance.paid.remaining },
                    { id: 'sick', label: 'Sick / Medical', balance: balance.sick.remaining },
                    { id: 'unpaid', label: 'Unpaid Leave', balance: balance.unpaid?.remaining || 15 }
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setLeaveType(t.id)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: leaveType === t.id ? 'var(--primary-600)' : 'var(--border-default)',
                        backgroundColor: leaveType === t.id ? 'var(--primary-50)' : 'var(--bg-surface)',
                        color: leaveType === t.id ? 'var(--primary-700)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        textAlign: 'left',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{t.label}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                        {t.balance} Days Left
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid-2" style={{ gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-input font-mono"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-input font-mono"
                  />
                </div>
              </div>

              {/* Quick Reason Presets */}
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Quick Fill Reason:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {reasonPresets.map((preset, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setRemarks(preset)}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        border: '1px solid var(--border-subtle)',
                        backgroundColor: 'var(--bg-surface-subtle)',
                        fontSize: '0.6875rem',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                    >
                      + {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Reason / Remarks for Absence</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide context for your manager & HR..."
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="form-textarea"
                />
              </div>

              {leaveType === 'sick' && (
                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Medical Certificate / Proof</label>
                    {daysCount >= 2 && (
                      <span style={{ fontSize: '0.6875rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                        * Required for medical leave ≥ 2 days
                      </span>
                    )}
                  </div>
                  <FileUpload onUpload={(file) => setAttachedDoc(file)} />
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                disabled={isQuotaExceeded}
                style={{ width: '100%', marginTop: '1rem', opacity: isQuotaExceeded ? 0.6 : 1 }}
                icon={ArrowRight}
                iconPosition="right"
              >
                Submit Application ({daysCount} Working Days)
              </Button>
            </form>
          )}
        </Card>

        {/* Live Calculation Preview Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card elevated>
            <div className="card-header">
              <div className="card-title">
                <Sparkles size={16} color="var(--primary-600)" />
                Impact & Quota Preview
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Selected Type:</span>
                <span style={{ fontWeight: 700, textTransform: 'uppercase' }}>{leaveType} Leave</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Requested Span:</span>
                <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{startDate} → {endDate}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Calculated Working Days:</span>
                <span style={{ fontWeight: 800, color: 'var(--primary-600)', fontFamily: 'var(--font-mono)' }}>
                  {daysCount} Days (Excl. Weekends)
                </span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Current Remaining:</span>
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{currentRemaining} Days</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Remaining After Approval:</span>
                  <span style={{ fontWeight: 700, color: isQuotaExceeded ? 'var(--rose-600)' : remainingAfter <= 2 ? 'var(--amber-600)' : 'var(--emerald-600)', fontFamily: 'var(--font-mono)' }}>
                    {isQuotaExceeded ? 'Deficit' : `${remainingAfter} Days`}
                  </span>
                </div>
              </div>

              <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={14} color="var(--color-primary)" />
                <span><strong>Auto-Routing Policy:</strong> Requests under 3 days are reviewed by Lead HR. Extended leaves over 5 days require Executive Admin audit.</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Historical Leave Applications Table */}
      <Card>
        <div className="card-header">
          <div className="card-title">My Application History & Status</div>
        </div>

        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Dates</th>
                <th>Duration</th>
                <th>Remarks</th>
                <th>Status</th>
                <th>Reviewer Notes</th>
              </tr>
            </thead>
            <tbody>
              {userLeaveHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-tertiary)' }}>
                    No leave requests filed yet.
                  </td>
                </tr>
              ) : (
                userLeaveHistory.map((l) => (
                  <tr key={l.id}>
                    <td>
                      <span style={{ fontWeight: 700, textTransform: 'uppercase', fontSize: '0.8125rem' }}>
                        {l.leaveType}
                      </span>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem' }}>
                      {l.startDate} → {l.endDate}
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{l.daysCount} Days</td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{l.remarks}</td>
                    <td>
                      <Badge variant={l.status === 'approved' ? 'approved' : l.status === 'rejected' ? 'rejected' : 'pending'}>
                        {l.status}
                      </Badge>
                    </td>
                    <td style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                      {l.adminComment || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
