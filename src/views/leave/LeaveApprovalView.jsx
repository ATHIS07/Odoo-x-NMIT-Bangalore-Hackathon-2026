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
  MessageSquare,
  Users,
  CheckSquare,
  Square
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Button, Card, Badge, Modal } from '../../components/common/CommonUI';
import { audioManager } from '../../utils/audioFeedback';

export const LeaveApprovalView = () => {
  const { activeUser } = useAuth();
  const { leaves, users, approveLeave, rejectLeave } = useHRMS();

  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'all'
  const [selectedDept, setSelectedDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewModalLeave, setReviewModalLeave] = useState(null);
  const [reviewActionType, setReviewActionType] = useState('approve'); // 'approve' | 'reject'
  const [adminComment, setAdminComment] = useState('');
  const [processingId, setProcessingId] = useState(null);
  
  // Bulk selection
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkProcessing, setIsBulkProcessing] = useState(false);

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

  const pendingLeaves = filteredLeaves.filter((l) => l.status === 'pending');
  const pendingCount = leaves.filter((l) => l.status === 'pending').length;

  const rejectionPresets = [
    'Critical sprint deliverable & release crunch',
    'Notice period submitted below 48-hour SLA policy',
    'Team concurrency limit reached for this window',
    'Mandatory corporate quarterly planning meetings'
  ];

  const handleQuickAction = async (leave, action) => {
    setProcessingId(leave.id);
    if (action === 'approve') {
      audioManager.playSuccessChime();
      await approveLeave(leave.id, 'Approved via 1-click HR triage.');
    } else {
      audioManager.playTap();
      await rejectLeave(leave.id, 'Declined due to department coverage constraints.');
    }
    setProcessingId(null);
    setSelectedIds((prev) => prev.filter((id) => id !== leave.id));
  };

  const handleModalSubmit = async (actionType) => {
    if (!reviewModalLeave) return;
    setProcessingId(reviewModalLeave.id);
    if (actionType === 'approve') {
      audioManager.playSuccessChime();
      await approveLeave(reviewModalLeave.id, adminComment || 'Accepted by HR Manager.');
    } else {
      audioManager.playTap();
      await rejectLeave(reviewModalLeave.id, adminComment || 'Rejected by HR Manager.');
    }
    setProcessingId(null);
    setSelectedIds((prev) => prev.filter((id) => id !== reviewModalLeave.id));
    setReviewModalLeave(null);
    setAdminComment('');
  };

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllPending = () => {
    if (selectedIds.length === pendingLeaves.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pendingLeaves.map((l) => l.id));
    }
  };

  const handleBulkApprove = async () => {
    setIsBulkProcessing(true);
    audioManager.playSuccessChime();
    for (const id of selectedIds) {
      await approveLeave(id, 'Bulk approved via HR governance queue.');
    }
    setSelectedIds([]);
    setIsBulkProcessing(false);
  };

  const handleBulkReject = async () => {
    setIsBulkProcessing(true);
    for (const id of selectedIds) {
      await rejectLeave(id, 'Declined in bulk review due to operational scheduling.');
    }
    setSelectedIds([]);
    setIsBulkProcessing(false);
  };

  // Helper to check if another team member is already on leave during the requested dates
  const getTeamOverlapWarning = (leave) => {
    const overlapping = leaves.filter((other) => {
      if (other.id === leave.id || other.department !== leave.department || other.status !== 'approved') return false;
      const startA = new Date(leave.startDate);
      const endA = new Date(leave.endDate);
      const startB = new Date(other.startDate);
      const endB = new Date(other.endDate);
      return startA <= endB && endA >= startB;
    });

    if (overlapping.length > 0) {
      return `${overlapping.length} other team member (${overlapping.map(o => o.employeeName).join(', ')}) on approved leave`;
    }
    return null;
  };

  return (
    <div className="page-wrapper" style={{ paddingBottom: selectedIds.length > 0 ? '6rem' : '3rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              HR Governance & Approvals
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Logged as {activeUser.name} ({activeUser.role.toUpperCase()})
            </span>
          </div>
          <h1 className="page-title">Leave Approvals & Triage Queue</h1>
          <p className="page-subtitle">
            Review, approve, or reject employee leave applications with automated notifications.
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
                onClick={() => {
                  setActiveTab(t.id);
                  setSelectedIds([]);
                }}
                style={{
                  padding: '0.45rem 0.875rem',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: activeTab === t.id ? 'var(--color-primary)' : 'var(--bg-surface-subtle)',
                  color: activeTab === t.id ? '#FFFFFF' : 'var(--text-secondary)',
                  fontSize: '0.8125rem',
                  fontWeight: activeTab === t.id ? 600 : 500,
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
                      borderRadius: '999px',
                      backgroundColor: activeTab === t.id ? 'rgba(255,255,255,0.25)' : 'var(--color-warning-bg)',
                      color: activeTab === t.id ? '#FFFFFF' : 'var(--color-warning)',
                      fontWeight: 600
                    }}
                  >
                    {t.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search & Dept Filter & Select All */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {activeTab === 'pending' && pendingLeaves.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAllPending}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  backgroundColor: 'var(--bg-surface)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  color: 'var(--text-secondary)',
                  cursor: 'pointer'
                }}
              >
                {selectedIds.length === pendingLeaves.length ? <CheckSquare size={14} color="var(--primary-600)" /> : <Square size={14} />}
                {selectedIds.length === pendingLeaves.length ? 'Deselect All' : 'Select All'}
              </button>
            )}

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
              const overlapWarning = getTeamOverlapWarning(l);
              const isSelected = selectedIds.includes(l.id);

              return (
                <motion.div
                  key={l.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                >
                  <Card
                    elevated
                    style={{
                      border: isSelected ? '1px solid var(--primary-600)' : '1px solid var(--border-subtle)',
                      backgroundColor: isSelected ? 'rgba(113, 75, 103, 0.02)' : 'var(--bg-surface)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
                      {/* Left: Checkbox & Applicant Dossier */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flex: 1, minWidth: '320px' }}>
                        {l.status === 'pending' && (
                          <div
                            onClick={() => toggleSelect(l.id)}
                            style={{ cursor: 'pointer', paddingTop: '10px' }}
                          >
                            {isSelected ? (
                              <CheckSquare size={20} color="var(--primary-600)" />
                            ) : (
                              <Square size={20} color="var(--text-tertiary)" />
                            )}
                          </div>
                        )}

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

                          {/* Team Concurrency Overlap Alert */}
                          {overlapWarning && (
                            <div
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                backgroundColor: 'var(--amber-50)',
                                border: '1px solid var(--amber-200)',
                                color: '#B45309',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                marginBottom: '0.5rem'
                              }}
                            >
                              <Users size={13} />
                              {overlapWarning}
                            </div>
                          )}

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
                              <FileText size={14} /> Attached: {l.attachment} (Verified Document)
                            </div>
                          )}

                          {/* Review metadata if decided */}
                          {l.reviewedBy && (
                            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                              Reviewed by <strong>{l.reviewedBy}</strong> • Comment: <em>"{l.adminComment}"</em>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      {l.status === 'pending' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '160px' }}>
                          <Button
                            variant="primary"
                            size="sm"
                            icon={MessageSquare}
                            onClick={() => {
                              setReviewModalLeave(l);
                              setAdminComment('');
                            }}
                            style={{ width: '100%' }}
                          >
                            Review Application
                          </Button>

                          <Button
                            variant="success"
                            size="sm"
                            icon={CheckCircle2}
                            loading={processingId === l.id}
                            onClick={() => handleQuickAction(l, 'approve')}
                            style={{ width: '100%' }}
                          >
                            Accept
                          </Button>

                          <Button
                            variant="danger"
                            size="sm"
                            icon={XCircle}
                            loading={processingId === l.id}
                            onClick={() => handleQuickAction(l, 'reject')}
                            style={{ width: '100%' }}
                          >
                            Reject
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

      {/* Floating Bulk Action Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 900,
              backgroundColor: '#1E293B',
              color: '#FFFFFF',
              padding: '0.75rem 1.5rem',
              borderRadius: '999px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem'
            }}
          >
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {selectedIds.length} Leave{selectedIds.length > 1 ? 's' : ''} Selected
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                size="sm"
                variant="success"
                icon={CheckCircle2}
                loading={isBulkProcessing}
                onClick={handleBulkApprove}
              >
                Approve Selected ({selectedIds.length})
              </Button>
              <Button
                size="sm"
                variant="danger"
                icon={XCircle}
                loading={isBulkProcessing}
                onClick={handleBulkReject}
              >
                Reject Selected
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setSelectedIds([])}
                style={{ color: '#94A3B8' }}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review & Decision Modal */}
      <Modal
        isOpen={!!reviewModalLeave}
        onClose={() => setReviewModalLeave(null)}
        title={`Review Leave Application: ${reviewModalLeave?.employeeName}`}
        maxWidth="540px"
      >
        {reviewModalLeave && (
          <div>
            <div style={{ padding: '0.875rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.8125rem' }}>
              <div><strong>Dates:</strong> {reviewModalLeave.startDate} → {reviewModalLeave.endDate} ({reviewModalLeave.daysCount} days)</div>
              <div><strong>Category:</strong> {reviewModalLeave.leaveType.toUpperCase()} Leave</div>
              <div style={{ marginTop: '4px' }}><strong>Employee Reason:</strong> "{reviewModalLeave.remarks}"</div>
            </div>

            <div className="form-group">
              <label className="form-label">
                HR Remarks / Review Notes
              </label>
              <textarea
                rows={3}
                placeholder="Enter HR approval remarks or rejection reasons here..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                className="form-textarea"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                Quick Preset Remarks:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {rejectionPresets.map((preset, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAdminComment(preset)}
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.25rem' }}>
              <Button variant="ghost" onClick={() => setReviewModalLeave(null)}>
                Cancel
              </Button>
              <Button
                variant="danger"
                icon={XCircle}
                loading={processingId === reviewModalLeave.id}
                onClick={() => handleModalSubmit('reject')}
              >
                Reject (Decline)
              </Button>
              <Button
                variant="success"
                icon={CheckCircle2}
                loading={processingId === reviewModalLeave.id}
                onClick={() => handleModalSubmit('approve')}
              >
                Accept (Approve)
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
