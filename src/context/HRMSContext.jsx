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

  // Load from LocalStorage or seed fallback
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('df_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [profiles, setProfiles] = useState(() => {
    const saved = localStorage.getItem('df_profiles');
    return saved ? JSON.parse(saved) : INITIAL_PROFILES;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('df_attendance');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState(() => {
    const saved = localStorage.getItem('df_leaves');
    return saved ? JSON.parse(saved) : INITIAL_LEAVES;
  });

  const [payroll, setPayroll] = useState(() => {
    const saved = localStorage.getItem('df_payroll');
    return saved ? JSON.parse(saved) : INITIAL_PAYROLL;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('df_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
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
          location: 'Bangalore HQ (Outer Ring Road / NMIT)',
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

      setAttendance((prev) =>
        prev.map((rec) => {
          if (rec.userId === userId && rec.date === todayStr) {
            return {
              ...rec,
              checkOut: nowTimeStr,
              duration: formattedDuration || '8h 02m (Completed)',
              notes: 'Shift completed normally via Employee Portal'
            };
          }
          return rec;
        })
      );

      showToast({
        title: 'Shift Clocked Out',
        message: `Check-out punch recorded at ${nowTimeStr} IST. Total shift logged: ${formattedDuration || '8h 02m'}.`,
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

      // Dispatch SNS alert
      showSNSToast({
        title: 'DynamoDB Stream: New Leave Application',
        message: `${currentUser.name} applied for ${leaveData.daysCount} days (${leaveData.leaveType.toUpperCase()})`,
        source: 'AWS SNS Push'
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
          title: 'DynamoDB Stream: Leave APPROVED',
          message: `Leave ${leaveId} for ${targetLeave.employeeName} changed to APPROVED`,
          source: 'DynamoDB Stream Event'
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
          title: 'DynamoDB Stream: Leave REJECTED',
          message: `Leave ${leaveId} for ${targetLeave.employeeName} declined`,
          source: 'DynamoDB Stream Event'
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
        message: 'Changes saved and synced across DynamoDB records',
        type: 'success'
      });
    });
  }, [runWithLatency, showToast]);

  // S3 Document Upload Simulation
  const uploadDocument = useCallback(async (userId, fileData) => {
    return runWithLatency(() => {
      const newDoc = {
        id: `doc_${Date.now()}`,
        name: fileData.name,
        type: fileData.type || 'PDF',
        size: fileData.size || '1.8 MB',
        uploadDate: new Date().toISOString().split('T')[0],
        s3Key: `s3://dayflow-hr-vault/${userId}/documents/${fileData.name}`
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
        title: 'S3 Object Uploaded',
        message: `Persisted to ${newDoc.s3Key}`,
        source: 'AWS S3 Storage'
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
            salaryStructure: { ...userProf.salaryStructure, ...newSalaryStructure }
          }
        };
      });

      showToast({
        title: 'Salary Structure Updated',
        message: `Admin modified CTC compensation tier for user ${userId}`,
        type: 'success'
      });
    });
  }, [runWithLatency, showToast]);

  const triggerMonthlyPayrollRun = useCallback(async () => {
    return runWithLatency(() => {
      const augustRun = {
        id: `pay_2026_08`,
        userId: 'usr_001',
        month: 'August 2026',
        payDate: '2026-08-31',
        grossPay: 237500,
        basic: 150000,
        hra: 60000,
        specialAllowance: 27500,
        bonus: 0,
        deductions: {
          providentFund: 1800,
          taxDeduction: 15000,
          professionalTax: 200,
          healthInsurance: 1500
        },
        totalDeductions: 18500,
        netPay: 219000,
        status: 'paid',
        transactionId: `TXN-DF-AUG26-IN-${Math.floor(100000 + Math.random() * 900000)}`,
        currency: '₹'
      };

      setPayroll((prev) => [augustRun, ...prev]);

      showSNSToast({
        title: 'Lambda Batch Job: August Payroll Completed',
        message: 'Disbursed ₹82,50,000 across 7 active employee accounts in India hubs.',
        source: 'AWS Lambda & SNS'
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
      message: 'Restored initial seed data across all DynamoDB models.',
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
