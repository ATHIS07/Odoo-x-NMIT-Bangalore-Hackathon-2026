import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ToastProvider, useToast } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HRMSProvider, useHRMS } from './context/HRMSContext';

// Layout Components
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { DemoToolbar } from './components/layout/DemoToolbar';
import { NotificationDrawer } from './components/layout/NotificationDrawer';
import { CommandPalette } from './components/common/CommandPalette';

// 12 Required Views
import { SignInView } from './views/auth/SignInView';
import { SignUpView } from './views/auth/SignUpView';
import { EmployeeDashboardView } from './views/dashboard/EmployeeDashboardView';
import { AdminDashboardView } from './views/dashboard/AdminDashboardView';
import { ProfileView } from './views/profile/ProfileView';
import { ProfileEditView } from './views/profile/ProfileEditView';
import { AttendanceView } from './views/attendance/AttendanceView';
import { LeaveApplyView } from './views/leave/LeaveApplyView';
import { LeaveApprovalView } from './views/leave/LeaveApprovalView';
import { PayrollView } from './views/payroll/PayrollView';
import { NotificationsView } from './views/notifications/NotificationsView';
import { AnalyticsView } from './views/analytics/AnalyticsView';

const MainAppContent = () => {
  const { currentUser, role, isHRorAdmin } = useAuth();
  const { showToast } = useToast();

  // Active Screen Route
  const [currentRoute, setCurrentRoute] = useState(() => {
    return isHRorAdmin ? 'admin-dashboard' : 'employee-dashboard';
  });

  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Sync route on role switch
  useEffect(() => {
    if (!currentUser) {
      setCurrentRoute('signin');
      return;
    }

    // Role safety guard
    if (!isHRorAdmin && ['admin-dashboard', 'leave-approvals', 'analytics'].includes(currentRoute)) {
      setCurrentRoute('employee-dashboard');
      showToast({
        title: 'Access Restricted',
        message: 'View is reserved for Executive HR & Admin personnel',
        type: 'warning'
      });
    }
  }, [currentUser, role, isHRorAdmin, currentRoute, showToast]);

  const handleNavigate = (route) => {
    // Role guard check
    if (!isHRorAdmin && ['admin-dashboard', 'leave-approvals', 'analytics'].includes(route)) {
      showToast({
        title: 'Access Restricted',
        message: 'This view requires HR or Administrator role permissions',
        type: 'warning'
      });
      return;
    }
    setCurrentRoute(route);
  };

  // Standalone Auth Screens
  if (!currentUser || currentRoute === 'signin') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="signin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SignInView onNavigate={handleNavigate} />
        </motion.div>
      </AnimatePresence>
    );
  }

  if (currentRoute === 'signup') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="signup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <SignUpView onNavigate={handleNavigate} />
        </motion.div>
      </AnimatePresence>
    );
  }

  // Render view based on route
  const renderScreen = () => {
    switch (currentRoute) {
      case 'employee-dashboard':
        return <EmployeeDashboardView onNavigate={handleNavigate} />;
      case 'admin-dashboard':
        return <AdminDashboardView onNavigate={handleNavigate} />;
      case 'attendance':
        return <AttendanceView onNavigate={handleNavigate} />;
      case 'leave-apply':
        return <LeaveApplyView onNavigate={handleNavigate} />;
      case 'leave-approvals':
        return <LeaveApprovalView onNavigate={handleNavigate} />;
      case 'payroll':
        return <PayrollView onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfileView onNavigate={handleNavigate} />;
      case 'profile-edit':
        return <ProfileEditView onNavigate={handleNavigate} />;
      case 'notifications':
        return <NotificationsView onNavigate={handleNavigate} />;
      case 'analytics':
        return <AnalyticsView onNavigate={handleNavigate} />;
      default:
        return isHRorAdmin ? (
          <AdminDashboardView onNavigate={handleNavigate} />
        ) : (
          <EmployeeDashboardView onNavigate={handleNavigate} />
        );
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentRoute={currentRoute}
        onRouteChange={handleNavigate}
        onOpenNotifications={() => setIsNotifDrawerOpen(true)}
      />

      {/* Main App Workspace */}
      <div className="main-content">
        <TopHeader
          onOpenNotifications={() => setIsNotifDrawerOpen(true)}
          onRouteChange={handleNavigate}
          onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        />

        <main style={{ flex: 1, paddingBottom: '5rem' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRoute}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Slide-out SNS Notification Center */}
      <NotificationDrawer
        isOpen={isNotifDrawerOpen}
        onClose={() => setIsNotifDrawerOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Global Command Palette (Ctrl + K) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(routePath) => {
          // Convert route path to internal key
          const cleanRoute = routePath.replace(/^\//, '').replace('/', '-');
          handleNavigate(cleanRoute === 'dashboard' ? 'employee-dashboard' : cleanRoute);
        }}
      />

      {/* Hackathon Judge Toolbar */}
      <DemoToolbar currentRoute={currentRoute} onRouteChange={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <HRMSProvider>
          <MainAppContent />
        </HRMSProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
