import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cognitoService } from '../services/cognitoService';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const { showToast, showSNSToast } = useToast();
  
  // Single source of truth: Cognito authenticated session
  const [currentUser, setCurrentUser] = useState(() => {
    return cognitoService.getCurrentUser();
  });

  const [pendingVerification, setPendingVerification] = useState(null);
  const [impersonatedUser, setImpersonatedUser] = useState(null);

  // Listen for unauthorized events to automatically reset invalid sessions
  useEffect(() => {
    const handleUnauthorized = (e) => {
      console.warn('Handling 401 Unauthorized event from API:', e.detail);
      setCurrentUser(null);
      setImpersonatedUser(null);
      showToast({
        title: 'Session Expired',
        message: 'Your authenticated session has expired. Please sign in again.',
        type: 'warning'
      });
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [showToast]);

  // Sign-In via direct Amazon Cognito USER_PASSWORD_AUTH
  const signIn = useCallback(async ({ email, password }) => {
    try {
      const response = await cognitoService.signIn({ email, password });
      
      // Handle potential Cognito challenges
      if (response.challengeName) {
        return response;
      }

      const user = response.user;
      setCurrentUser(user);
      setImpersonatedUser(null);
      setPendingVerification(null);

      showToast({
        title: 'Authentication Verified',
        message: `Welcome back, ${user.name} (${user.role.toUpperCase()})`,
        type: 'success'
      });

      return user;
    } catch (err) {
      // Re-throw real Cognito error to be displayed by SignIn view
      throw err;
    }
  }, [showToast]);

  // Sign-Up via direct Amazon Cognito Identity Provider SignUp
  const signUp = useCallback(async ({ employeeId, email, password }) => {
    try {
      const response = await cognitoService.signUp({ employeeId, email, password });
      
      setPendingVerification({
        email: response.email,
        employeeId: response.employeeId,
        userSub: response.userSub
      });

      showSNSToast({
        title: 'Verification Code Dispatched',
        message: `Cognito verification code sent to ${email}`,
        source: 'AWS Cognito Auth'
      });

      return response;
    } catch (err) {
      throw err;
    }
  }, [showSNSToast]);

  // Confirm Sign-Up with OTP verification code via Cognito ConfirmSignUp
  const confirmSignUp = useCallback(async ({ email, code }) => {
    try {
      const response = await cognitoService.confirmSignUp({ email, code });
      setPendingVerification(null);

      showToast({
        title: 'Account Confirmed',
        message: 'Email verification confirmed with Cognito. You can now log in.',
        type: 'success'
      });

      return response;
    } catch (err) {
      throw err;
    }
  }, [showToast]);

  // Resend confirmation code
  const resendConfirmationCode = useCallback(async (email) => {
    try {
      const response = await cognitoService.resendConfirmationCode({ email });
      showSNSToast({
        title: 'Code Resent',
        message: `A new verification code was sent to ${email}`,
        source: 'AWS Cognito Auth'
      });
      return response;
    } catch (err) {
      throw err;
    }
  }, [showSNSToast]);

  // Password Reset Flow via Cognito
  const requestPasswordReset = useCallback(async (email) => {
    try {
      const response = await cognitoService.forgotPassword({ email });
      showSNSToast({
        title: 'Password Reset Code Sent',
        message: `Reset code dispatched to ${email}`,
        source: 'AWS Cognito Auth'
      });
      return response;
    } catch (err) {
      throw err;
    }
  }, [showSNSToast]);

  const confirmPasswordReset = useCallback(async ({ email, code, newPassword }) => {
    try {
      await cognitoService.confirmForgotPassword({ email, code, newPassword });
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
    await cognitoService.signOut();
    setCurrentUser(null);
    setImpersonatedUser(null);
    setPendingVerification(null);
    showToast({
      title: 'Signed Out',
      message: 'Cognito session ended successfully.',
      type: 'info'
    });
  }, [showToast]);

  // Persona Switcher for Quick Demo testing
  const switchPersona = useCallback((roleOrUserId) => {
    // If in demo mode, update role
    if (currentUser) {
      const updated = {
        ...currentUser,
        role: roleOrUserId === 'hr' ? 'hr' : 'employee'
      };
      setCurrentUser(updated);
      showToast({
        title: 'Role Switched',
        message: `Switched view mode to ${updated.role.toUpperCase()}`,
        type: 'info'
      });
    }
  }, [currentUser, showToast]);

  // HR Impersonation of another employee
  const startImpersonation = useCallback((user) => {
    setImpersonatedUser(user);
    showToast({
      title: 'Viewing as Employee',
      message: `HR Lead previewing view for ${user.name || user.email}`,
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
      localStorage.setItem('cognito_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Active Effective User
  const activeUser = impersonatedUser || currentUser;

  // RBAC Helper flags (2 Roles: Employee & HR)
  const rawRole = activeUser?.role || currentUser?.role || 'employee';
  const role = rawRole === 'hr' || rawRole === 'admin' || rawRole === 'Admin_HR' ? 'hr' : 'employee';
  const isEmployee = role === 'employee';
  const isHR = role === 'hr';
  const isAdmin = isHR;
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
        setPendingVerification,
        signIn,
        signUp,
        confirmSignUp,
        resendConfirmationCode,
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
