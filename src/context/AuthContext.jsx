import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_USERS } from '../data/mockData';
import { authApi } from '../services/authApi';
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

  // Sign-In via standard authApi service
  const signIn = useCallback(async ({ email, password }) => {
    try {
      const response = await authApi.login({ email, password });
      const user = response.user;
      setCurrentUser(user);
      setImpersonatedUser(null);
      showToast({
        title: 'Authentication Verified',
        message: `Signed in as ${user.name} (${user.role.toUpperCase()})`,
        type: 'success'
      });
      return user;
    } catch (err) {
      throw err;
    }
  }, [showToast]);

  // Sign-Up via standard authApi service
  const signUp = useCallback(async (userData) => {
    try {
      const response = await authApi.signup(userData);
      setPendingVerification({
        user: response.user,
        code: response.verificationCode || '849201',
        tempToken: response.tempToken,
        expiresIn: 300
      });

      showSNSToast({
        title: 'Verification Code Dispatched',
        message: `Verification code ${response.verificationCode || '849201'} sent to ${userData.email}`,
        source: 'Odoo Auth Gateway'
      });

      return response;
    } catch (err) {
      throw err;
    }
  }, [showSNSToast]);

  // Verify OTP Step via standard authApi service
  const verifySignUp = useCallback(async (code) => {
    try {
      const response = await authApi.verifyOtp({
        code,
        tempToken: pendingVerification?.tempToken,
        email: pendingVerification?.user?.email
      });
      const verifiedUser = response.user;
      setCurrentUser(verifiedUser);
      setPendingVerification(null);

      showToast({
        title: 'Account Provisioned & Confirmed',
        message: `Welcome to Odoo, ${verifiedUser.name}!`,
        type: 'success'
      });

      return verifiedUser;
    } catch (err) {
      throw err;
    }
  }, [pendingVerification, showToast]);

  // Direct Sign-Up (Immediate provision without OTP wait)
  const directSignUp = useCallback(async (userData) => {
    try {
      const signupRes = await authApi.signup(userData);
      const verifyRes = await authApi.verifyOtp({
        code: signupRes.verificationCode || '849201',
        tempToken: signupRes.tempToken,
        email: userData.email
      });
      const verifiedUser = verifyRes.user;
      setCurrentUser(verifiedUser);
      setPendingVerification(null);

      showToast({
        title: 'Account Created',
        message: `Welcome aboard, ${verifiedUser.name}!`,
        type: 'success'
      });

      return verifiedUser;
    } catch (err) {
      throw err;
    }
  }, [showToast]);

  // Password Reset Flow Mock
  const requestPasswordReset = useCallback(async (email) => {
    try {
      const response = await authApi.forgotPassword({ email });
      showSNSToast({
        title: 'Password Reset Code Sent',
        message: `Reset token ${response.resetToken || '932140'} dispatched to ${email}`,
        source: 'Odoo Auth Gateway'
      });
      return response;
    } catch (err) {
      throw err;
    }
  }, [showSNSToast]);

  const confirmPasswordReset = useCallback(async ({ email, code, newPassword }) => {
    try {
      await authApi.resetPassword({ email, code, newPassword });
      showToast({
        title: 'Password Updated',
        message: 'Your password has been securely reset. Please sign in.',
        type: 'success'
      });
      return true;
    } catch (err) {
      throw err;
    }
  }, [showToast]);

  // Sign Out
  const signOut = useCallback(async () => {
    await authApi.logout();
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
    let allUsers = INITIAL_USERS;
    try {
      const saved = localStorage.getItem('df_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) allUsers = parsed;
      }
    } catch (e) { /* ignore */ }

    let target = null;
    if (['employee', 'hr'].includes(roleOrUserId)) {
      target = allUsers.find((u) => u.role === roleOrUserId);
    } else {
      target = allUsers.find((u) => u.id === roleOrUserId || u.employeeId === roleOrUserId);
    }

    if (target) {
      setCurrentUser(target);
      setImpersonatedUser(null);
      localStorage.setItem('odoo_auth_user', JSON.stringify(target));
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
        directSignUp,
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

