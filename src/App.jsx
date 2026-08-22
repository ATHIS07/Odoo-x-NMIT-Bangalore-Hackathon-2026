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
import { ProductTour, TourLauncherButton } from './components/common/ProductTour';

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
import { NotificationsView } from './views/notifications/NotificationsView';
import { AnalyticsView } from './views/analytics/AnalyticsView';

const MainAppContent = () => {
  const { currentUser, role, isHR } = useAuth();
  const { showToast } = useToast();

  // Active Screen Route
  const [currentRoute, setCurrentRoute] = useState(() => {
    return isHR ? 'admin-dashboard' : 'employee-dashboard';
  });

  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Auto-start guided product tour for evaluator on first load
  const [isTourOpen, setIsTourOpen] = useState(() => {
    const isDismissed = sessionStorage.getItem('dayflow_tour_session_dismissed');
    return !isDismissed;
  });

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
    if (!isHR && ['admin-dashboard', 'leave-approvals', 'analytics'].includes(currentRoute)) {
      setCurrentRoute('employee-dashboard');
      showToast({
        title: 'Access Restricted',
        message: 'View is reserved for HR personnel',
        type: 'warning'
      });
    }
  }, [currentUser, role, isHR, currentRoute, showToast]);

  const handleNavigate = (route) => {
    // Role guard check
    if (!isHR && ['admin-dashboard', 'leave-approvals', 'analytics'].includes(route)) {
      showToast({
        title: 'Access Restricted',
        message: 'This view requires HR role permissions',
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
      case 'profile':
        return <ProfileView onNavigate={handleNavigate} />;
      case 'profile-edit':
        return <ProfileEditView onNavigate={handleNavigate} />;
      case 'notifications':
        return <NotificationsView onNavigate={handleNavigate} />;
      case 'analytics':
        return <AnalyticsView onNavigate={handleNavigate} />;
      default:
        return isHR ? (
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
        onStartTour={() => setIsTourOpen(true)}
        onNavigate={(routePath) => {
          // Convert route path to internal key
          const cleanRoute = routePath.replace(/^\//, '').replace('/', '-');
          handleNavigate(cleanRoute === 'dashboard' ? 'employee-dashboard' : cleanRoute);
        }}
      />

      {/* Auto-starting Interactive Guided Product Tour */}
      <ProductTour
        isOpen={isTourOpen}
        currentRoute={currentRoute}
        activeUser={currentUser}
        onNavigate={handleNavigate}
        onClose={() => {
          setIsTourOpen(false);
          sessionStorage.setItem('dayflow_tour_session_dismissed', 'true');
        }}
        onFinish={() => {
          setIsTourOpen(false);
          sessionStorage.setItem('dayflow_tour_session_dismissed', 'true');
          showToast({
            title: 'Tour Completed',
            message: 'You can relaunch the tour anytime from the bottom right button or Ctrl+K.',
            type: 'success'
          });
        }}
      />

      {/* Persistent Floating Product Tour Launcher */}
      {!isTourOpen && (
        <TourLauncherButton
          onClick={() => setIsTourOpen(true)}
          activeUser={currentUser}
          currentSectionName={
            currentRoute === 'employee-dashboard' ? 'Workspace' :
            currentRoute === 'attendance' ? (currentUser?.role === 'employee' ? 'Attendance' : 'Workforce Roster') :
            currentRoute === 'leave-apply' ? 'Leave Apply' :
            currentRoute === 'leave-approvals' ? 'Leave Approvals' :
            currentRoute === 'payroll' ? (currentUser?.role === 'employee' ? 'Payslips' : 'Org Payroll') :
            currentRoute === 'profile' ? 'Profile' :
            currentRoute === 'analytics' ? 'Analytics' :
            currentRoute === 'admin-dashboard' ? 'Executive HQ' : 'Module'
          }
        />
      )}

      {/* Hackathon Judge Toolbar */}
      <DemoToolbar currentRoute={currentRoute} onRouteChange={handleNavigate} />
    </div>
  );
};

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled React Error:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', width: '100%', backgroundColor: '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem', fontFamily: 'sans-serif' }}>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', borderRadius: '12px', padding: '2.5rem', maxWidth: '440px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '10px', backgroundColor: '#FBEAEA', color: '#DC3545', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', margin: '0 auto 1rem' }}>
              !
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A1A1A', marginBottom: '0.5rem' }}>Workspace Reset Required</h2>
            <p style={{ fontSize: '0.875rem', color: '#666666', marginBottom: '1rem', lineHeight: 1.5 }}>
              A rendering exception occurred:
            </p>
            <div style={{ backgroundColor: '#FBEAEA', color: '#DC3545', padding: '0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontFamily: 'monospace', textAlign: 'left', marginBottom: '1.5rem', wordBreak: 'break-all', maxHeight: '120px', overflowY: 'auto' }}>
              {this.state.error?.toString() || 'Unknown rendering error'}
            </div>
            <button
              onClick={this.handleReset}
              style={{ width: '100%', backgroundColor: '#714B67', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '0.75rem 1rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Reset Cache & Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <HRMSProvider>
            <MainAppContent />
          </HRMSProvider>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}
