import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  FileText,
  CalendarCheck,
  AlertTriangle,
  User,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Button, Card, Badge, Modal } from '../../components/common/CommonUI';

export const LeaveApprovalView = () => {
  const { activeUser, role } = useAuth();
  const { leaves, users, approveLeave, rejectLeave } = useHRMS();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewModalLeave, setReviewModalLeave] = useState(null);
  const [reviewActionType, setReviewActionType] = useState('approve'); // 'approve' | 'reject'
  const [adminComment, setAdminComment] = useState('');
  const [processingId, setProcessingId] = useState(null);

  // Filter requests
  const filteredLeaves = leaves.filter((l) => {
    if (activeTab !== 'all' && l.status !== activeTab) return false;
    if (selectedDept !== 'All' && l.department !== selectedDept) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = l.employeeName.toLowerCase().includes(q);
      const matchRemarks = l.remarks.toLowerCase().includes(q);
      if (!matchName && !matchRemarks) return false;
    }
    return true;
  });

  const pendingCount = leaves.filter((l) => l.status === 'pending').length;

  const handleQuickAction = async (leave, action) => {
    setProcessingId(leave.id);
    if (action === 'approve') {
      await approveLeave(leave.id, 'Approved via 1-click HR triage.');
    } else {
      await rejectLeave(leave.id, 'Declined due to department coverage constraints.');
    }
    setProcessingId(null);
  };

  const handleModalSubmit = async () => {
    if (!reviewModalLeave) return;
    setProcessingId(reviewModalLeave.id);
    if (reviewActionType === 'approve') {
      await approveLeave(reviewModalLeave.id, adminComment || 'Approved with HR notes.');
    } else {
      await rejectLeave(reviewModalLeave.id, adminComment || 'Declined with HR notes.');
    }
    setProcessingId(null);
    setReviewModalLeave(null);
    setAdminComment('');
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#BE185D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              HR Governance & Approvals
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Logged as {activeUser.name} ({activeUser.role.toUpperCase()})
            </span>
          </div>
          <h1 className="page-title">Leave Approvals & Triage Queue</h1>
          <p className="page-subtitle">
            Sub-millisecond status transitions wired to DynamoDB streams and automated employee SNS alerts.
          </p>
        </div>
      </div>

      {/* Tabs & Controls */}
      <Card style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {[
              { id: 'pending', label: 'Action Required', badge: pendingCount },
              { id: 'approved', label: 'Approved' },
              { id: 'rejected', label: 'Declined' },
              { id: 'all', label: 'All History' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                style={{
                  padding: '0.45rem 0.875rem',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeTab === t.id ? 'var(--primary-600)' : 'var(--bg-surface-subtle)',
                  color: activeTab === t.id ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '0.8125rem',
                  fontWeight: activeTab === t.id ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{t.label}</span>
                {t.badge !== undefined && t.badge > 0 && (
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      padding: '1px 6px',
                      borderRadius: '9999px',
                      backgroundColor: activeTab === t.id ? 'rgba(255,255,255,0.25)' : 'var(--amber-500)',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontFamily: 'var(--font-mono)'
                    }}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search & Dept Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ position: 'relative' }}>
              <Search size={15} color="var(--text-tertiary)" style={{ position: 'absolute', left: '10px', top: '9px' }} />
              <input
                type="text"
                placeholder="Search applicant or remarks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
              <option value="All">All Departments</option>
              <option value="Engineering">Engineering</option>
              <option value="People & Talent Operations">People & Talent</option>
              <option value="Product Design">Product Design</option>
              <option value="Product Management">Product Management</option>
              <option value="Finance & Strategy">Finance</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Leave Cards List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AnimatePresence>
          {filteredLeaves.length === 0 ? (
            <Card style={{ textAlign: 'center', padding: '3.5rem 1rem', color: 'var(--text-tertiary)' }}>
              <CalendarCheck size={40} style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>No Leave Requests in this view</div>
              <div style={{ fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                All requests matching the current filter have been reconciled.
              </div>
            </Card>
          ) : (
            filteredLeaves.map((l) => {
              const applicant = users.find((u) => u.id === l.userId);

              return (
                <motion.div
                  key={l.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                >
                  <Card elevated>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                      {/* Left: Applicant Dossier Summary */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: '320px' }}>
                        <img
                          src={applicant?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'}
                          alt={l.employeeName}
                          style={{ width: '48px', height: '48px', borderRadius: '12px', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                        />

                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', marginBottom: '0.25rem' }}>
                            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                              {l.employeeName}
                            </span>
                            <Badge variant={l.leaveType === 'sick' ? 'sick' : l.leaveType === 'paid' ? 'present' : 'unpaid'}>
                              {l.leaveType.toUpperCase()} LEAVE
                            </Badge>
                            <Badge variant={l.status === 'approved' ? 'approved' : l.status === 'rejected' ? 'rejected' : 'pending'}>
                              {l.status}
                            </Badge>
                          </div>

                          <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                            {l.department} • <strong style={{ color: 'var(--primary-600)', fontFamily: 'var(--font-mono)' }}>{l.daysCount} Working Days</strong> ({l.startDate} → {l.endDate})
                          </div>

                          <div
                            style={{
                              backgroundColor: 'var(--bg-surface-subtle)',
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              border: '1px solid var(--border-subtle)',
                              fontSize: '0.8125rem',
                              color: 'var(--text-primary)',
                              lineHeight: 1.5
                            }}
                          >
                            <strong>Remarks:</strong> "{l.remarks}"
                          </div>

                          {/* Medical certificate attachment if available */}
                          {l.attachment && (
                            <div style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--primary-600)', fontWeight: 600 }}>
                              <FileText size={14} /> Attached: {l.attachment} (Verified in S3)
                            </div>
                          )}

                          {/* Review notes if already reviewed */}
                          {l.adminComment && (
                            <div style={{ marginTop: '0.625rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                              Audit Decision: "{l.adminComment}" — <em>{l.reviewedBy}</em>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      {l.status === 'pending' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '180px' }}>
                          <Button
                            variant="success"
                            size="md"
                            icon={CheckCircle2}
                            loading={processingId === l.id}
                            onClick={() => handleQuickAction(l, 'approve')}
                            style={{ width: '100%' }}
                          >
                            1-Click Approve
                          </Button>

                          <Button
                            variant="danger"
                            size="md"
                            icon={XCircle}
                            loading={processingId === l.id}
                            onClick={() => handleQuickAction(l, 'reject')}
                            style={{ width: '100%' }}
                          >
                            Reject Request
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            icon={MessageSquare}
                            onClick={() => {
                              setReviewModalLeave(l);
                              setReviewActionType('approve');
                            }}
                            style={{ width: '100%' }}
                          >
                            Audit Notes...
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Decision Review Modal */}
      <Modal
        isOpen={!!reviewModalLeave}
        onClose={() => setReviewModalLeave(null)}
        title="Leave Audit Decision"
      >
        {reviewModalLeave && (
          <div>
            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem' }}>{reviewModalLeave.employeeName}</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                {reviewModalLeave.department} • {reviewModalLeave.leaveType.toUpperCase()} ({reviewModalLeave.daysCount} Days)
              </div>
              <div style={{ fontSize: '0.8125rem', marginTop: '0.5rem' }}>
                Span: <strong>{reviewModalLeave.startDate}</strong> to <strong>{reviewModalLeave.endDate}</strong>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Decision Remarks / Employee Feedback</label>
              <textarea
                rows={3}
                className="form-textarea"
                placeholder="Enter comments or audit rationale for employee records..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button variant="ghost" onClick={() => setReviewModalLeave(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  setReviewActionType('reject');
                  handleModalSubmit();
                }}
              >
                Reject Request
              </Button>
              <Button
                variant="success"
                onClick={() => {
                  setReviewActionType('approve');
                  handleModalSubmit();
                }}
              >
                Approve Leave
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
