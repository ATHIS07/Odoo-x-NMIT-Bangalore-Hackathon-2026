import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_USERS } from '../data/mockData';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { showToast, showSNSToast } = useToast();
  
  // Stored active user or default Sophia (Employee)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('dayflow_auth_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS[0]; // Default Sophia Vance (Employee)
  });

  const [pendingVerification, setPendingVerification] = useState(null);
  const [impersonatedUser, setImpersonatedUser] = useState(null);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('dayflow_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('dayflow_auth_user');
    }
  }, [currentUser]);

  // Cognito Sign-In Mock
  const signIn = useCallback(async ({ email, password }) => {
    // Check credentials against mock users
    const matched = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matched) {
      throw new Error('Invalid Cognito credentials: User does not exist in pool');
    }

    if (password.length < 6) {
      throw new Error('Password must satisfy AWS Cognito security criteria');
    }

    setCurrentUser(matched);
    setImpersonatedUser(null);
    showToast({
      title: 'Cognito Auth Verified',
      message: `Signed in as ${matched.name} (${matched.role.toUpperCase()})`,
      type: 'success'
    });
    return matched;
  }, [showToast]);

  // Cognito Sign-Up Mock
  const signUp = useCallback(async ({ employeeId, email, password, role, name }) => {
    // Generate temporary verification state
    const newUser = {
      id: `usr_${Date.now()}`,
      employeeId: employeeId.toUpperCase(),
      name: name || email.split('@')[0],
      email: email.trim().toLowerCase(),
      role: role || 'employee',
      department: 'Engineering',
      designation: 'Associate Specialist',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=240&auto=format&fit=crop&q=80',
      phone: '+1 (555) 000-1122',
      location: 'San Francisco HQ',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setPendingVerification({
      user: newUser,
      code: '849201', // Standard demo verification code
      expiresIn: 300 // 5 minutes
    });

    showSNSToast({
      title: 'Cognito OTP Dispatched',
      message: `Verification code 849201 sent to ${email}`,
      source: 'AWS Cognito SNS'
    });

    return newUser;
  }, [showSNSToast]);

  // Cognito Verify OTP Step
  const verifySignUp = useCallback(async (code) => {
    if (!pendingVerification) {
      throw new Error('No pending signup session found');
    }

    if (code !== '849201' && code !== '123456') {
      throw new Error('Invalid Cognito confirmation code. (Hint: Try 849201)');
    }

    const verifiedUser = pendingVerification.user;
    setCurrentUser(verifiedUser);
    setPendingVerification(null);

    showToast({
      title: 'Cognito Account Confirmed',
      message: `Welcome to Dayflow, ${verifiedUser.name}!`,
      type: 'success'
    });

    return verifiedUser;
  }, [pendingVerification, showToast]);

  // Password Reset Flow Mock
  const requestPasswordReset = useCallback(async (email) => {
    const matched = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (!matched) {
      throw new Error('Email not found in enterprise identity directory');
    }
    showSNSToast({
      title: 'Cognito Reset OTP Dispatched',
      message: `Password reset token 932140 dispatched to ${email}`,
      source: 'AWS Cognito SNS'
    });
    return { email, code: '932140' };
  }, [showSNSToast]);

  const confirmPasswordReset = useCallback(async ({ email, code, newPassword }) => {
    if (code !== '932140' && code !== '123456') {
      throw new Error('Invalid or expired reset code. (Demo code: 932140)');
    }
    if (newPassword.length < 8) {
      throw new Error('New password must meet Cognito enterprise criteria (min 8 chars)');
    }
    showToast({
      title: 'Password Updated',
      message: 'Your Cognito password has been securely reset. Please sign in.',
      type: 'success'
    });
    return true;
  }, [showToast]);

  // Sign Out
  const signOut = useCallback(() => {
    setCurrentUser(null);
    setImpersonatedUser(null);
    showToast({
      title: 'Signed Out',
      message: 'Cognito session tokens revoked safely.',
      type: 'info'
    });
  }, [showToast]);

  // Quick Persona Switcher for Hackathon Demo
  const switchPersona = useCallback((roleOrUserId) => {
    let target = null;
    if (['employee', 'hr', 'admin'].includes(roleOrUserId)) {
      target = INITIAL_USERS.find((u) => u.role === roleOrUserId);
    } else {
      target = INITIAL_USERS.find((u) => u.id === roleOrUserId || u.employeeId === roleOrUserId);
    }

    if (target) {
      setCurrentUser(target);
      setImpersonatedUser(null);
      showToast({
        title: 'Role Switched',
        message: `Switched identity to ${target.name} (${target.role.toUpperCase()})`,
        type: 'info'
      });
    }
  }, [showToast]);

  // Admin Impersonation of another employee
  const startImpersonation = useCallback((user) => {
    setImpersonatedUser(user);
    showToast({
      title: 'Viewing as Employee',
      message: `Admin previewing view for ${user.name}`,
      type: 'info'
    });
  }, [showToast]);

  const stopImpersonation = useCallback(() => {
    setImpersonatedUser(null);
    showToast({
      title: 'Impersonation Ended',
      message: 'Returned to Administrative console',
      type: 'info'
    });
  }, [showToast]);

  // Active Effective User
  const activeUser = impersonatedUser || currentUser;

  // RBAC Helper flags
  const role = currentUser?.role || 'employee';
  const isEmployee = role === 'employee';
  const isHR = role === 'hr';
  const isAdmin = role === 'admin';
  const isHRorAdmin = isHR || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeUser,
        role,
        isEmployee,
        isHR,
        isAdmin,
        isHRorAdmin,
        impersonatedUser,
        pendingVerification,
        signIn,
        signUp,
        verifySignUp,
        requestPasswordReset,
        confirmPasswordReset,
        signOut,
        switchPersona,
        startImpersonation,
        stopImpersonation
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
