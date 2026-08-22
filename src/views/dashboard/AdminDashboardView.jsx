import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Clock,
  CalendarCheck,
  CreditCard,
  Shield,
  CheckCircle,
  XCircle,
  Eye,
  Search,
  Filter,
  ArrowUpRight,
  Sparkles,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Button, Card, Badge, MetricCard, Modal } from '../../components/common/CommonUI';
import { AttendanceTrendChart, PayrollExpenseChart } from '../../components/charts/Charts';

export const AdminDashboardView = ({ onNavigate }) => {
  const { activeUser, startImpersonation } = useAuth();
  const { users, attendance, leaves, approveLeave, rejectLeave } = useHRMS();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [reviewModalLeave, setReviewModalLeave] = useState(null);
  const [adminComment, setAdminComment] = useState('');

  // Pending leaves queue
  const pendingLeaves = leaves.filter((l) => l.status === 'pending');

  // Stats calculation
  const totalEmployees = users.length;
  const todayStr = '2026-08-22';
  const todayRecords = attendance.filter((a) => a.date === todayStr);
  const presentToday = todayRecords.filter((a) => a.checkIn || a.status === 'present').length;
  const checkedOutToday = todayRecords.filter((a) => a.checkOut).length;
  const liveActiveToday = todayRecords.filter((a) => a.checkIn && !a.checkOut).length;
  const onLeaveToday = todayRecords.filter((a) => a.status === 'leave').length;
  const attendanceRate = totalEmployees > 0 ? Math.round((presentToday / totalEmployees) * 100) : 0;

  // Filtered employees
  const filteredUsers = users.filter((u) => {
    const matchName = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchDept = selectedDept === 'All' || u.department === selectedDept;
    return matchName && matchDept;
  });

  const departments = ['All', 'Engineering', 'People & Talent Operations', 'Product Design', 'Product Management', 'Finance & Strategy'];

  const handleAction = async (leaveId, action) => {
    if (action === 'approve') {
      await approveLeave(leaveId, adminComment || 'Approved by Executive Operations.');
    } else {
      await rejectLeave(leaveId, adminComment || 'Declined due to department coverage constraints.');
    }
    setReviewModalLeave(null);
    setAdminComment('');
  };

  return (
    <div className="page-wrapper">
      {/* Executive Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Executive Management & RBAC Console
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Logged as {activeUser.name} ({activeUser.role.toUpperCase()})
            </span>
          </div>
          <h1 className="page-title">Odoo Enterprise Control HQ</h1>
          <p className="page-subtitle">
            Unified workforce intelligence, sub-second approval pipelines, and organizational governance.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="secondary" icon={Users} onClick={() => onNavigate('org-chart')}>
            Org Tree
          </Button>
          <Button variant="secondary" icon={Clock} onClick={() => onNavigate('attendance')}>
            Workforce Roster
          </Button>
          <Button variant="primary" icon={CalendarCheck} onClick={() => onNavigate('leave-approvals')}>
            Review Leaves ({pendingLeaves.length})
          </Button>
        </div>
      </div>

      {/* KPI Metric Tiles */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard
          label="Total Headcount"
          value={totalEmployees}
          subtitle="7 Active • 0 Suspended"
          icon={Users}
          iconColor="var(--color-primary)"
          iconBg="var(--primary-50)"
          trend={{ value: '+8%', isPositive: true, text: 'YoY Growth' }}
        />

        <MetricCard
          label="Attendance Today"
          value={`${attendanceRate}%`}
          subtitle={`${liveActiveToday} In-Session • ${checkedOutToday} Checked Out • ${onLeaveToday} On Leave`}
          icon={Clock}
          iconColor="var(--color-success)"
          iconBg="var(--color-success-bg)"
          trend={{ value: '+3.2%', isPositive: true, text: 'Live Roster' }}
        />

        <MetricCard
          label="Pending Approvals"
          value={pendingLeaves.length}
          subtitle="Action required by HR/Admin"
          icon={CalendarCheck}
          iconColor="var(--color-warning)"
          iconBg="var(--color-warning-bg)"
          badge={{ text: 'Urgent Triage', variant: 'pending' }}
        />

        <MetricCard
          label="Monthly Payroll Run"
          value="₹82,50,000"
          subtitle="August 2026 Batch Reconciled"
          icon={CreditCard}
          iconColor="var(--color-primary)"
          iconBg="var(--primary-50)"
        />
      </div>

      {/* Middle Section: Pending Approvals Triage & Weekly Attendance Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Urgent Approvals Triage */}
        <Card elevated>
          <div className="card-header">
            <div className="card-title">
              <CalendarCheck size={18} color="var(--amber-600)" />
              Pending Leave Approvals ({pendingLeaves.length})
            </div>
            <button
              onClick={() => onNavigate('leave-approvals')}
              style={{ background: 'none', border: 'none', color: 'var(--primary-600)', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Full Queue →
            </button>
          </div>

          {pendingLeaves.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-tertiary)' }}>
              <CheckCircle size={32} color="var(--emerald-500)" style={{ margin: '0 auto 0.5rem' }} />
              <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>All Approvals Cleared</div>
              <div style={{ fontSize: '0.75rem' }}>Zero pending leave requests in the queue.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {pendingLeaves.slice(0, 3).map((l) => (
                <div
                  key={l.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-subtle)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {l.employeeName}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                        {l.department} • <strong style={{ color: 'var(--primary-700)' }}>{l.leaveType.toUpperCase()}</strong> ({l.daysCount} Days)
                      </div>
                    </div>
                    <Badge variant="pending">Pending Review</Badge>
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                    "{l.remarks}"
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    <Button size="sm" variant="ghost" onClick={() => setReviewModalLeave(l)}>
                      Review with Notes
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => rejectLeave(l.id, 'Declined by HR Admin')}>
                      Reject
                    </Button>
                    <Button size="sm" variant="success" onClick={() => approveLeave(l.id, 'Approved by HR Admin')}>
                      1-Click Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Weekly Attendance Rate Chart */}
        <Card elevated>
          <div className="card-header">
            <div className="card-title">
              <TrendingUp size={18} color="var(--primary-600)" />
              Workforce Presence & Punctuality
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>Week 34 (Current)</span>
          </div>

          <AttendanceTrendChart />
        </Card>
      </div>

      {/* Global Employee Roster with Impersonation Feature */}
      <Card>
        <div className="card-header">
          <div>
            <div className="card-title">Organization Employee Directory</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Select any employee to view their full dossier or test "Impersonate View" mode.
            </div>
          </div>

          {/* Search & Dept Filter */}
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="var(--text-tertiary)" style={{ position: 'absolute', left: '10px', top: '9px' }} />
              <input
                type="text"
                placeholder="Filter by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: '0.4rem 0.75rem 0.4rem 2rem',
                  fontSize: '0.8125rem',
                  border: '1px solid var(--border-default)',
                  borderRadius: '6px',
                  outline: 'none',
                  backgroundColor: 'var(--bg-surface)'
                }}
              />
            </div>

            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              style={{
                padding: '0.4rem 0.75rem',
                fontSize: '0.8125rem',
                border: '1px solid var(--border-default)',
                borderRadius: '6px',
                outline: 'none',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Employee Table */}
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee & ID</th>
                <th>Department</th>
                <th>Role Designation</th>
                <th>Location</th>
                <th>Today's Shift Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const userTodayAtt = attendance.find((a) => a.userId === u.id && a.date === '2026-08-22');
                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={u.avatar}
                          alt={u.name}
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{u.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                            {u.employeeId} • {u.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{u.department}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{u.designation}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{u.location}</span>
                    </td>
                    <td>
                      {userTodayAtt?.checkOut ? (
                        <div>
                          <Badge variant="present">Shift Done</Badge>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--color-primary)', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                            Out: {userTodayAtt.checkOut}
                          </div>
                        </div>
                      ) : userTodayAtt?.checkIn ? (
                        <div>
                          <Badge variant="present">Clocked In</Badge>
                          <div style={{ fontSize: '0.6875rem', color: 'var(--emerald-600)', fontWeight: 600, fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                            In: {userTodayAtt.checkIn}
                          </div>
                        </div>
                      ) : userTodayAtt?.status === 'leave' ? (
                        <Badge variant="leave">On Leave</Badge>
                      ) : (
                        <Badge variant="absent">Not Punched</Badge>
                      )}
                    </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={Eye}
                        onClick={() => {
                          startImpersonation(u);
                          onNavigate('employee-dashboard');
                        }}
                        title="Impersonate and preview exact employee UI view"
                      >
                        Preview View
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onNavigate('profile', { userId: u.id })}
                      >
                        Dossier
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
          </table>
        </div>
      </Card>

      {/* Review Modal with Notes */}
      <Modal
        isOpen={!!reviewModalLeave}
        onClose={() => setReviewModalLeave(null)}
        title="Leave Request Audit Review"
      >
        {reviewModalLeave && (
          <div>
            <div style={{ marginBottom: '1.25rem', padding: '1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.9375rem', fontWeight: 700 }}>{reviewModalLeave.employeeName}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {reviewModalLeave.department} • <strong>{reviewModalLeave.leaveType.toUpperCase()} LEAVE</strong> ({reviewModalLeave.daysCount} Days)
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', marginTop: '0.75rem' }}>
                Dates: <strong>{reviewModalLeave.startDate}</strong> to <strong>{reviewModalLeave.endDate}</strong>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                Remarks: "{reviewModalLeave.remarks}"
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Admin / HR Decision Comment</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Enter audit remarks or feedback for employee..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button variant="ghost" onClick={() => setReviewModalLeave(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleAction(reviewModalLeave.id, 'reject')}>
                Reject Request
              </Button>
              <Button variant="success" onClick={() => handleAction(reviewModalLeave.id, 'approve')}>
                Approve Leave
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
