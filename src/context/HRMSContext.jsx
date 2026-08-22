import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  INITIAL_USERS,
  INITIAL_PROFILES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_PAYROLL,
  INITIAL_NOTIFICATIONS,
  COMPANY_HOLIDAYS
} from '../data/mockData';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import confetti from 'canvas-confetti';

const HRMSContext = createContext(null);

export const HRMSProvider = ({ children }) => {
  const { currentUser, isHRorAdmin } = useAuth();
  const { showToast, showSNSToast } = useToast();

  // Simulated AWS Lambda Latency setting
  const [simulateLatency, setSimulateLatency] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load from LocalStorage or seed fallback safely
  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('df_users');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_USERS;
    } catch (e) {
      return INITIAL_USERS;
    }
  });

  const [profiles, setProfiles] = useState(() => {
    try {
      const saved = localStorage.getItem('df_profiles');
      const parsed = saved ? JSON.parse(saved) : null;
      return parsed && typeof parsed === 'object' ? parsed : INITIAL_PROFILES;
    } catch (e) {
      return INITIAL_PROFILES;
    }
  });

  const [attendance, setAttendance] = useState(() => {
    try {
      const saved = localStorage.getItem('df_attendance');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_ATTENDANCE;
    } catch (e) {
      return INITIAL_ATTENDANCE;
    }
  });

  const [leaves, setLeaves] = useState(() => {
    try {
      const saved = localStorage.getItem('df_leaves');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_LEAVES;
    } catch (e) {
      return INITIAL_LEAVES;
    }
  });

  const [payroll, setPayroll] = useState(() => {
    try {
      const saved = localStorage.getItem('df_payroll');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_PAYROLL;
    } catch (e) {
      return INITIAL_PAYROLL;
    }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('df_notifs');
      const parsed = saved ? JSON.parse(saved) : null;
      return Array.isArray(parsed) ? parsed : INITIAL_NOTIFICATIONS;
    } catch (e) {
      return INITIAL_NOTIFICATIONS;
    }
  });

  // Sync state to local storage
  useEffect(() => { localStorage.setItem('df_users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('df_profiles', JSON.stringify(profiles)); }, [profiles]);
  useEffect(() => { localStorage.setItem('df_attendance', JSON.stringify(attendance)); }, [attendance]);
  useEffect(() => { localStorage.setItem('df_leaves', JSON.stringify(leaves)); }, [leaves]);
  useEffect(() => { localStorage.setItem('df_payroll', JSON.stringify(payroll)); }, [payroll]);
  useEffect(() => { localStorage.setItem('df_notifs', JSON.stringify(notifications)); }, [notifications]);

  // Helper to simulate Lambda processing delay
  const runWithLatency = useCallback(async (actionFn) => {
    if (simulateLatency) {
      setIsProcessing(true);
      await new Promise((res) => setTimeout(res, 450));
      setIsProcessing(false);
    }
    return actionFn();
  }, [simulateLatency]);

  // ==========================================
  // ATTENDANCE ACTIONS
  // ==========================================
  const getTodayAttendance = useCallback((userId) => {
    const todayStr = '2026-08-22';
    return attendance.find((a) => a.userId === userId && a.date === todayStr);
  }, [attendance]);

  const clockIn = useCallback(async (userId) => {
    return runWithLatency(() => {
      const todayStr = '2026-08-22';
      const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setAttendance((prev) => {
        const filtered = prev.filter((a) => !(a.userId === userId && a.date === todayStr));
        const newRecord = {
          id: `att_${Date.now()}`,
          userId,
          date: todayStr,
          checkIn: nowTimeStr,
          checkOut: null,
          duration: 'Live Active',
          status: 'present',
          location: 'Bangalore HQ (Outer Ring Road Tech Center)',
          notes: 'Shift clock-in recorded via Employee Portal'
        };
        return [newRecord, ...filtered];
      });

      showToast({
        title: 'Shift Clocked In',
        message: `Check-in punch recorded at ${nowTimeStr} IST. Work session active.`,
        type: 'success'
      });
    });
  }, [runWithLatency, showToast]);

  const clockOut = useCallback(async (userId, formattedDuration) => {
    return runWithLatency(() => {
      const todayStr = '2026-08-22';
      const nowTimeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

      setAttendance((prev) => {
        const hasExisting = prev.some((rec) => rec.userId === userId && rec.date === todayStr);
        if (hasExisting) {
          return prev.map((rec) => {
            if (rec.userId === userId && rec.date === todayStr) {
              return {
                ...rec,
                checkOut: nowTimeStr,
                duration: formattedDuration || '8h 02m',
                status: 'present',
                notes: 'Shift completed & checked out via Employee Portal'
              };
            }
            return rec;
          });
        } else {
          const newRecord = {
            id: `att_${Date.now()}`,
            userId,
            date: todayStr,
            checkIn: '09:24 AM',
            checkOut: nowTimeStr,
            duration: formattedDuration || '8h 02m',
            status: 'present',
            location: 'Bangalore HQ (Outer Ring Road Tech Center)',
            notes: 'Shift completed & checked out via Employee Portal'
          };
          return [newRecord, ...prev];
        }
      });

      showToast({
        title: 'Shift Clocked Out',
        message: `Check-out punch recorded at ${nowTimeStr} IST. Shift duration: ${formattedDuration || '8h 02m'}.`,
        type: 'info'
      });
    });
  }, [runWithLatency, showToast]);

  // ==========================================
  // LEAVE ACTIONS
  // ==========================================
  const applyLeave = useCallback(async (leaveData) => {
    return runWithLatency(() => {
      const newLeave = {
        id: `lve_${Date.now()}`,
        userId: currentUser.id,
        employeeName: currentUser.name,
        department: currentUser.department,
        leaveType: leaveData.leaveType,
        startDate: leaveData.startDate,
        endDate: leaveData.endDate,
        daysCount: leaveData.daysCount || 1,
        remarks: leaveData.remarks,
        attachment: leaveData.attachment || null,
        status: 'pending',
        adminComment: null,
        reviewedBy: null,
        reviewedAt: null,
        submittedAt: new Date().toISOString()
      };

      setLeaves((prev) => [newLeave, ...prev]);

      // Deduct or mark pending in profile leave balance
      setProfiles((prev) => {
        const userProfile = prev[currentUser.id];
        if (!userProfile) return prev;
        return {
          ...prev,
          [currentUser.id]: {
            ...userProfile,
            leaveBalance: {
              ...userProfile.leaveBalance,
              [leaveData.leaveType]: {
                ...userProfile.leaveBalance?.[leaveData.leaveType],
                remaining: Math.max(0, (userProfile.leaveBalance?.[leaveData.leaveType]?.remaining || 10) - (leaveData.daysCount || 1)),
                used: (userProfile.leaveBalance?.[leaveData.leaveType]?.used || 0) + (leaveData.daysCount || 1)
              }
            }
          }
        };
      });

      // Dispatch notification
      showSNSToast({
        title: 'New Leave Application',
        message: `${currentUser.name} applied for ${leaveData.daysCount} days (${leaveData.leaveType.toUpperCase()})`,
        source: 'Odoo HRMS'
      });

      // Add to notifications
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          userId: 'usr_002', // Marcus HR
          type: 'leave_request',
          title: 'New Leave Request Received',
          message: `${currentUser.name} requested ${leaveData.daysCount} days of ${leaveData.leaveType} leave.`,
          read: false,
          timestamp: 'Just now',
          link: '/leave/approvals'
        },
        ...prev
      ]);
    });
  }, [currentUser, runWithLatency, showSNSToast]);

  const approveLeave = useCallback(async (leaveId, adminComment = '') => {
    return runWithLatency(() => {
      let targetLeave = null;

      setLeaves((prev) =>
        prev.map((l) => {
          if (l.id === leaveId) {
            targetLeave = l;
            return {
              ...l,
              status: 'approved',
              adminComment: adminComment || 'Approved by HR Administrator.',
              reviewedBy: currentUser.name,
              reviewedAt: new Date().toISOString()
            };
          }
          return l;
        })
      );

      if (targetLeave) {
        showSNSToast({
          title: 'Leave Application Approved',
          message: `Leave ${leaveId} for ${targetLeave.employeeName} status updated to APPROVED`,
          source: 'Odoo HRMS'
        });

        // Trigger celebratory confetti for approval
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (e) { /* ignore */ }

        // Send notification to applicant
        setNotifications((prev) => [
          {
            id: `notif_${Date.now()}`,
            userId: targetLeave.userId,
            type: 'leave_approval',
            title: 'Leave Approved',
            message: `Your leave request for ${targetLeave.startDate} to ${targetLeave.endDate} was approved by ${currentUser.name}.`,
            read: false,
            timestamp: 'Just now',
            link: '/leave/apply'
          },
          ...prev
        ]);
      }
    });
  }, [currentUser, runWithLatency, showSNSToast]);

  const rejectLeave = useCallback(async (leaveId, adminComment = '') => {
    return runWithLatency(() => {
      let targetLeave = null;

      setLeaves((prev) =>
        prev.map((l) => {
          if (l.id === leaveId) {
            targetLeave = l;
            return {
              ...l,
              status: 'rejected',
              adminComment: adminComment || 'Request declined by HR administration.',
              reviewedBy: currentUser.name,
              reviewedAt: new Date().toISOString()
            };
          }
          return l;
        })
      );

      if (targetLeave) {
        // Revert profile leave balance
        setProfiles((prev) => {
          const userProfile = prev[targetLeave.userId];
          if (!userProfile) return prev;
          const type = targetLeave.leaveType;
          return {
            ...prev,
            [targetLeave.userId]: {
              ...userProfile,
              leaveBalance: {
                ...userProfile.leaveBalance,
                [type]: {
                  ...userProfile.leaveBalance?.[type],
                  remaining: (userProfile.leaveBalance?.[type]?.remaining || 10) + targetLeave.daysCount,
                  used: Math.max(0, (userProfile.leaveBalance?.[type]?.used || 0) - targetLeave.daysCount)
                }
              }
            }
          };
        });

        showSNSToast({
          title: 'Leave Application Declined',
          message: `Leave ${leaveId} for ${targetLeave.employeeName} status updated to DECLINED`,
          source: 'Odoo HRMS'
        });

        setNotifications((prev) => [
          {
            id: `notif_${Date.now()}`,
            userId: targetLeave.userId,
            type: 'leave_rejected',
            title: 'Leave Request Declined',
            message: `Your leave request was declined: ${adminComment || 'Administrative conflict'}`,
            read: false,
            timestamp: 'Just now',
            link: '/leave/apply'
          },
          ...prev
        ]);
      }
    });
  }, [currentUser, runWithLatency, showSNSToast]);

  // ==========================================
  // PROFILE & RBAC EDIT ACTIONS
  // ==========================================
  const updateProfile = useCallback(async (targetUserId, updatedFields) => {
    return runWithLatency(() => {
      setProfiles((prev) => {
        const existing = prev[targetUserId] || {
          userId: targetUserId,
          personalDetails: {},
          jobDetails: {},
          salaryStructure: {},
          documents: [],
          address: {},
          phone: ''
        };

        const merged = {
          ...existing,
          ...updatedFields,
          personalDetails: { ...existing.personalDetails, ...(updatedFields.personalDetails || {}) },
          jobDetails: { ...existing.jobDetails, ...(updatedFields.jobDetails || {}) },
          salaryStructure: { ...existing.salaryStructure, ...(updatedFields.salaryStructure || {}) },
          address: { ...existing.address, ...(updatedFields.address || {}) }
        };

        return { ...prev, [targetUserId]: merged };
      });

      // Update User summary table as well
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === targetUserId) {
            return {
              ...u,
              name: updatedFields.personalDetails?.fullName || u.name,
              phone: updatedFields.phone || u.phone,
              avatar: updatedFields.avatar || u.avatar,
              department: updatedFields.jobDetails?.department || u.department,
              designation: updatedFields.jobDetails?.designation || u.designation
            };
          }
          return u;
        })
      );

      showToast({
        title: 'Profile Updated',
        message: 'Changes saved and updated successfully',
        type: 'success'
      });
    });
  }, [runWithLatency, showToast]);

  // Document Upload Simulation
  const uploadDocument = useCallback(async (userId, fileData) => {
    return runWithLatency(() => {
      const newDoc = {
        id: `doc_${Date.now()}`,
        name: fileData.name,
        type: fileData.type || 'PDF',
        size: fileData.size || '1.8 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        s3Key: `vault/${userId}/documents/${fileData.name}`
      };

      setProfiles((prev) => {
        const userProf = prev[userId];
        if (!userProf) return prev;
        return {
          ...prev,
          [userId]: {
            ...userProf,
            documents: [newDoc, ...(userProf.documents || [])]
          }
        };
      });

      showSNSToast({
        title: 'Document Uploaded',
        message: `File saved to ${newDoc.name}`,
        source: 'Storage Vault'
      });
    });
  }, [runWithLatency, showSNSToast]);

  // ==========================================
  // PAYROLL ACTIONS
  // ==========================================
  const updateSalaryStructure = useCallback(async (userId, newSalaryStructure) => {
    return runWithLatency(() => {
      setProfiles((prev) => {
        const userProf = prev[userId];
        if (!userProf) return prev;
        return {
          ...prev,
          [userId]: {
            ...userProf,
            salaryStructure: { ...(userProf.salaryStructure || {}), ...newSalaryStructure }
          }
        };
      });

      showToast({
        title: 'Salary Structure Updated',
        message: 'Compensation changes saved',
        type: 'success'
      });
    });
  }, [runWithLatency, showToast]);

  const triggerMonthlyPayrollRun = useCallback(async () => {
    return runWithLatency(() => {
      const augustRun = {
        id: `pay_run_${Date.now()}`,
        cycleMonth: 'August 2026',
        period: 'Aug 01, 2026 - Aug 31, 2026',
        totalDisbursed: '₹82,50,000',
        totalEmployees: 7,
        disbursementDate: '2026-08-31',
        status: 'Completed',
        breakdown: {
          basic: '₹41,25,000',
          hra: '₹20,62,500',
          special: '₹12,37,500',
          pfDeduction: '₹4,95,000',
          tdsDeduction: '₹4,12,500'
        }
      };

      setPayroll((prev) => [augustRun, ...prev]);

      showSNSToast({
        title: 'August Payroll Completed',
        message: 'Disbursed ₹82,50,000 across 7 active employee accounts.',
        source: 'Payroll Engine'
      });
    });
  }, [runWithLatency, showSNSToast]);

  // ==========================================
  // NOTIFICATION ACTIONS
  // ==========================================
  const markNotificationAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast({
      title: 'Notifications Cleared',
      message: 'All alerts marked as read',
      type: 'info'
    });
  }, [showToast]);

  // Reset demo state
  const resetDemoData = useCallback(() => {
    setUsers(INITIAL_USERS);
    setProfiles(INITIAL_PROFILES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    setPayroll(INITIAL_PAYROLL);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
    showToast({
      title: 'Demo State Reset',
      message: 'Restored initial seed data.',
      type: 'info'
    });
  }, [showToast]);

  return (
    <HRMSContext.Provider
      value={{
        users,
        profiles,
        attendance,
        leaves,
        payroll,
        notifications,
        companyHolidays: COMPANY_HOLIDAYS,
        simulateLatency,
        setSimulateLatency,
        isProcessing,
        getTodayAttendance,
        clockIn,
        clockOut,
        applyLeave,
        approveLeave,
        rejectLeave,
        updateProfile,
        uploadDocument,
        updateSalaryStructure,
        triggerMonthlyPayrollRun,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        resetDemoData
      }}
    >
      {children}
    </HRMSContext.Provider>
  );
};

export const useHRMS = () => {
  const context = useContext(HRMSContext);
  if (!context) {
    throw new Error('useHRMS must be used within an HRMSProvider');
  }
  return context;
};
