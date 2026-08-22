import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_USERS } from '../data/mockData';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { showToast, showSNSToast } = useToast();
  
  // User authentication state (Defaults to Sophia Vance for instant demo evaluation)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('odoo_auth_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.id) return parsed;
      } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS[0];
  });

  const [pendingVerification, setPendingVerification] = useState(null);
  const [impersonatedUser, setImpersonatedUser] = useState(null);

  // Sync to local storage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('odoo_auth_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('odoo_auth_user');
    }
  }, [currentUser]);

  // Cognito Sign-In Mock
  const signIn = useCallback(async ({ email, password }) => {
    // Check credentials against mock users
    const matched = INITIAL_USERS.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!matched) {
      throw new Error('Invalid credentials: User does not exist in directory');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    setCurrentUser(matched);
    setImpersonatedUser(null);
    showToast({
      title: 'Authentication Verified',
      message: `Signed in as ${matched.name} (${matched.role.toUpperCase()})`,
      type: 'success'
    });
    return matched;
  }, [showToast]);

  // Sign-Up Mock
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
      phone: '+91 98450 00112',
      location: 'Bangalore HQ (Outer Ring Road Tech Center)',
      joiningDate: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setPendingVerification({
      user: newUser,
      code: '849201', // Standard demo verification code
      expiresIn: 300 // 5 minutes
    });

    showSNSToast({
      title: 'Verification Code Sent',
      message: `Verification code 849201 sent to ${email}`,
      source: 'Odoo Auth'
    });

    return newUser;
  }, [showSNSToast]);

  // Verify OTP Step
  const verifySignUp = useCallback(async (code) => {
    if (!pendingVerification) {
      throw new Error('No pending signup session found');
    }

    if (code !== '849201' && code !== '123456') {
      throw new Error('Invalid confirmation code. (Hint: Try 849201)');
    }

    const verifiedUser = pendingVerification.user;
    setCurrentUser(verifiedUser);
    setPendingVerification(null);

    showToast({
      title: 'Account Confirmed',
      message: `Welcome to Odoo, ${verifiedUser.name}!`,
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
      title: 'Password Reset Code Sent',
      message: `Password reset token 932140 dispatched to ${email}`,
      source: 'Odoo Auth'
    });
    return { email, code: '932140' };
  }, [showSNSToast]);

  const confirmPasswordReset = useCallback(async ({ email, code, newPassword }) => {
    if (code !== '932140' && code !== '123456') {
      throw new Error('Invalid or expired reset code. (Demo code: 932140)');
    }
    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters');
    }
    showToast({
      title: 'Password Updated',
      message: 'Your password has been securely reset. Please sign in.',
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
      message: 'Session signed out successfully.',
      type: 'info'
    });
  }, [showToast]);

  // Quick Persona Switcher
  const switchPersona = useCallback((roleOrUserId) => {
    let target = null;
    if (['employee', 'hr'].includes(roleOrUserId)) {
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

  // HR Impersonation of another employee
  const startImpersonation = useCallback((user) => {
    setImpersonatedUser(user);
    showToast({
      title: 'Viewing as Employee',
      message: `HR Lead previewing view for ${user.name}`,
      type: 'info'
    });
  }, [showToast]);

  const stopImpersonation = useCallback(() => {
    setImpersonatedUser(null);
    showToast({
      title: 'Impersonation Ended',
      message: 'Returned to HR Management portal',
      type: 'info'
    });
  }, [showToast]);

  // User Profile Update
  const updateCurrentUser = useCallback((updatedFields) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      localStorage.setItem('odoo_auth_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Active Effective User
  const activeUser = impersonatedUser || currentUser || INITIAL_USERS[0];

  // RBAC Helper flags (2 Roles Only: Employee & HR)
  const rawRole = currentUser?.role || 'employee';
  const role = rawRole === 'hr' || rawRole === 'admin' ? 'hr' : 'employee';
  const isEmployee = role === 'employee';
  const isHR = role === 'hr';
  const isAdmin = false;
  const isHRorAdmin = isHR;

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
        updateCurrentUser,
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
