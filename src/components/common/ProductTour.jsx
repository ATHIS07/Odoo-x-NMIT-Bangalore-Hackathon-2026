import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  LayoutDashboard,
  Clock,
  CalendarCheck,
  CreditCard,
  User,
  Bell,
  Search,
  Zap,
  CheckCircle2,
  HelpCircle,
  Layers,
  ArrowRight,
  Sliders,
  FileText,
  Building2,
  ShieldCheck,
  ExternalLink,
  Users,
  Briefcase,
  PieChart
} from 'lucide-react';

// ==========================================
// 1. EMPLOYEE SELF-SERVICE TOUR WORKFLOWS
// ==========================================
export const EMPLOYEE_TOURS = {
  'employee-dashboard': [
    {
      id: 'emp-sidebar',
      target: '[data-tour="sidebar-nav"]',
      title: 'Main Navigation Menu',
      badge: 'Step 1 of 6',
      icon: LayoutDashboard,
      description:
        'This is your main sidebar menu. You can easily switch between your daily attendance, leave applications, monthly payslips, and personal dossier from here.',
      tip: 'Click any item on the left to open that tool, or use the bottom role switcher to test HR & Admin views.'
    },
    {
      id: 'emp-search',
      target: '[data-tour="top-search"]',
      title: 'Quick Search & Command Bar',
      badge: 'Step 2 of 6',
      icon: Search,
      description:
        'A fast search bar to jump anywhere instantly. You can search for colleagues, switch screens, or perform rapid actions without clicking through menus.',
      tip: 'Press Ctrl + K on your keyboard from any page to open the command bar.'
    },
    {
      id: 'emp-quick-actions',
      target: '[data-tour="quick-actions"]',
      title: 'Quick Action Shortcuts',
      badge: 'Step 3 of 6',
      icon: Zap,
      description:
        'Four one-click shortcut cards for your most common daily tasks — checking your profile details, inspecting attendance, and applying for time-off.',
      tip: 'Click any card for instant access without navigating menus.'
    },
    {
      id: 'emp-punch-console',
      target: '[data-tour="punch-console"]',
      title: 'Daily Shift & Live Punch Clock',
      badge: 'Step 4 of 6',
      icon: Clock,
      description:
        'Start your workday with a single click. The live timer counts your active working hours in real-time and automatically flags overtime whenever you work extra.',
      tip: 'Click "Clock In" when your shift begins, and click "Take Coffee Break" whenever you step away.'
    },
    {
      id: 'emp-leave-quota',
      target: '[data-tour="leave-quota"]',
      title: 'Leave Balance & Fast Booking',
      badge: 'Step 5 of 6',
      icon: CalendarCheck,
      description:
        'Shows your remaining Paid, Sick, and Compensatory leave balances in a clear visual chart. It automatically excludes weekends so you only spend actual working days.',
      tip: 'Click "⚡ Apply Tomorrow" to instantly book tomorrow off in one click.'
    },
    {
      id: 'emp-demo-toolbar',
      target: '[data-tour="demo-toolbar"]',
      title: 'Judge Role Switcher & Toolbar',
      badge: 'Step 6 of 6',
      icon: Sparkles,
      description:
        'A testing toolbar built especially for evaluators. Switch between Sophia (Employee), Marcus (HR Lead), and Elena (VP Admin) with one click to test role permissions.',
      tip: 'Click any persona pill to instantly test how Dayflow adapts for different roles.'
    }
  ],

  'attendance': [
    {
      id: 'emp-att-nav',
      target: '[data-tour="sidebar-tab-attendance"]',
      title: 'How to Find: Attendance on Sidebar',
      badge: 'Step 1 of 4',
      icon: LayoutDashboard,
      description:
        'You can access your time logs anytime by clicking "My Attendance" on the left sidebar menu.',
      tip: 'Click this tab to inspect your daily shift hours, monthly calendar, and geolocation logs.'
    },
    {
      id: 'emp-att-metrics',
      target: '[data-tour="attendance-metrics"]',
      title: 'Monthly Shift & Punch Metrics',
      badge: 'Step 2 of 4',
      icon: Clock,
      description:
        'Shows your real-time attendance percentage for the month (96.2%), average daily shift duration (8h 42m), and standard Bangalore shift hours (09:30 AM - 06:00 PM IST).',
      tip: 'Helps you verify that your hours meet monthly company targets.'
    },
    {
      id: 'emp-att-controls',
      target: '[data-tour="attendance-controls"]',
      title: 'Daily Timeline ⇄ Monthly Calendar',
      badge: 'Step 3 of 4',
      icon: CalendarCheck,
      description:
        'Switch between a chronological shift list and a full 31-day calendar. In the calendar view, click on any day to inspect check-in and check-out records.',
      tip: 'Click "Monthly Calendar" to see visual day-by-day attendance badges.'
    },
    {
      id: 'emp-att-roster',
      target: '[data-tour="attendance-roster"]',
      title: 'Detailed Shift Logs & CSV Export',
      badge: 'Step 4 of 4',
      icon: Sparkles,
      description:
        'Lists every punch event with duration and terminal location. You can click "Export CSV" anytime to download an official spreadsheet.',
      tip: 'Forgot to clock in? Click "Request Regularization" in the top bar to submit missed hours for HR review.'
    }
  ],

  'leave-apply': [
    {
      id: 'emp-leave-nav',
      target: '[data-tour="sidebar-tab-leave-apply"]',
      title: 'How to Find: Leave Section on Sidebar',
      badge: 'Step 1 of 4',
      icon: LayoutDashboard,
      description:
        'Click "Apply for Leave" on the left sidebar menu to access your leave balances and submit new time-off requests.',
      tip: 'You can also book tomorrow off in 1 click from your workspace.'
    },
    {
      id: 'emp-leave-quota',
      target: '[data-tour="leave-apply-quota"]',
      title: 'Live Quota Balances & Overdraft Guard',
      badge: 'Step 2 of 4',
      icon: ShieldCheck,
      description:
        'Displays your remaining Paid, Sick, and Compensatory quotas. Dayflow automatically prevents you from applying for more days than you have left.',
      tip: 'Weekends are automatically excluded so your days are calculated accurately.'
    },
    {
      id: 'emp-leave-form',
      target: '[data-tour="leave-apply-form"]',
      title: 'Fast Leave Application Form',
      badge: 'Step 3 of 4',
      icon: CalendarCheck,
      description:
        'Pick your category, choose dates, and click any of the quick-fill reason pills below the form to fill out your request in seconds.',
      tip: 'Attach doctor prescriptions directly if taking extended sick leave.'
    },
    {
      id: 'emp-leave-preview',
      target: '[data-tour="leave-apply-preview"]',
      title: 'Instant Quota Preview',
      badge: 'Step 4 of 4',
      icon: Clock,
      description:
        'The preview card automatically recalculates your remaining balance in real time before you submit.',
      tip: 'Click "Submit Application" when ready to notify your manager.'
    }
  ],

  'payroll': [
    {
      id: 'emp-pay-nav',
      target: '[data-tour="sidebar-tab-payroll"]',
      title: 'How to Find: Payslips on Sidebar',
      badge: 'Step 1 of 4',
      icon: LayoutDashboard,
      description:
        'Click "My Payslips" on the left sidebar menu to view your monthly compensation, tax slips, and EPFO records.',
      tip: 'All compensation values are formatted in Indian Rupees (₹).'
    },
    {
      id: 'emp-pay-ytd',
      target: '[data-tour="payroll-ytd"]',
      title: 'Year-To-Date (YTD) Cumulative Summary',
      badge: 'Step 2 of 4',
      icon: Sparkles,
      description:
        'Displays your fiscal year cumulative totals: Gross Earnings, Net Take-Home received, TDS Income Tax withheld, and accumulated EPFO Provident Fund balance.',
      tip: 'Gives you an instant financial summary without doing manual math.'
    },
    {
      id: 'emp-pay-breakdown',
      target: '[data-tour="payroll-breakdown"]',
      title: 'Monthly Earnings & Deductions Breakdown',
      badge: 'Step 3 of 4',
      icon: ShieldCheck,
      description:
        'Detailed breakdown of Basic Salary, HRA, and Special Allowance along with tax withholdings. Click the eye icon to reveal the masked bank account number or copy it.',
      tip: 'Shows the HDFC Bank account linked for monthly NEFT deposit.'
    },
    {
      id: 'emp-pay-slips',
      target: '[data-tour="payroll-slips"]',
      title: 'Historical Payslip Archive & PDF Download',
      badge: 'Step 4 of 4',
      icon: FileText,
      description:
        'Click "View Slip" on any month to inspect your official company payslip. You can click "Print / Download PDF" to get a clean corporate PDF without browser clutter.',
      tip: 'Dedicated print styles remove all app sidebars and headers automatically.'
    }
  ],

  'profile': [
    {
      id: 'emp-prof-nav',
      target: '[data-tour="sidebar-tab-profile"]',
      title: 'How to Find: Dossier on Sidebar',
      badge: 'Step 1 of 3',
      icon: LayoutDashboard,
      description:
        'Click "My Dossier / Profile" on the left sidebar menu to view your personal identity, contact details, organizational role, and bank records.',
      tip: 'Switch between Personal, Job, Bank, and Document tabs at the top.'
    },
    {
      id: 'emp-prof-identity',
      target: '[data-tour="profile-identity"]',
      title: 'Employee Identity & Address Details',
      badge: 'Step 2 of 3',
      icon: User,
      description:
        'Your verified employee record covering full legal name, date of birth, Bangalore/Mumbai address, blood group, and marital status.',
      tip: 'Click "Edit Dossier" in the top right to update your contact details.'
    },
    {
      id: 'emp-prof-emergency',
      target: '[data-tour="profile-emergency"]',
      title: '1-Click Emergency Contact Dialing',
      badge: 'Step 3 of 3',
      icon: Sparkles,
      description:
        'In urgent situations, managers or colleagues can click the "📞 Call Now" button inside the card to dial the registered emergency number immediately.',
      tip: 'Direct phone dialing link saves critical time during emergencies.'
    }
  ]
};

// ==========================================
// 2. HR OPERATIONS & GOVERNANCE TOUR (MARCUS)
// ==========================================
export const HR_TOURS = {
  'admin-dashboard': [
    {
      id: 'hr-sidebar',
      target: '[data-tour="sidebar-nav"]',
      title: 'How to Find: HR Operations Sidebar',
      badge: 'Step 1 of 4',
      icon: LayoutDashboard,
      description:
        'As HR Lead, your left menu unlocks workforce management tools including Leave Approvals, Company Attendance, Analytics, and Organization Payroll.',
      tip: 'Click any link on the left to navigate your operations console.'
    },
    {
      id: 'hr-headquarters',
      target: '.page-header',
      title: 'HR Operations Headquarters',
      badge: 'Step 2 of 4',
      icon: Building2,
      description:
        'Central command center monitoring real-time workforce presence, pending time-off requests requiring decisions, and monthly payroll burn in Indian Rupees (₹).',
      tip: 'Monitors staff across Bangalore and Mumbai hubs simultaneously.'
    },
    {
      id: 'hr-metrics',
      target: '.grid-4',
      title: 'Company-Wide Health KPIs',
      badge: 'Step 3 of 4',
      icon: Sliders,
      description:
        'Real-time count of active on-shift staff (22 Active), pending approvals (4 Requests), and organizational payroll expenses.',
      tip: 'Metrics update automatically as employees clock in and submit leaves.'
    },
    {
      id: 'hr-actions',
      target: '.card-header',
      title: 'HR Quick Triage Actions',
      badge: 'Step 4 of 4',
      icon: ShieldCheck,
      description:
        'Directly jump into pending leave approvals, trigger monthly salary disbursement batches, or export workforce attendance audit spreadsheets.',
      tip: 'Click "Triage Leave Queue" to immediately review team requests.'
    }
  ],

  'leave-approvals': [
    {
      id: 'hr-appr-nav',
      target: '[data-tour="sidebar-tab-leave-approvals"]',
      title: 'How to Find: Leave Approvals on Sidebar',
      badge: 'Step 1 of 4',
      icon: LayoutDashboard,
      description:
        'Click "Leave Approvals" on the left sidebar to access incoming employee requests with real-time pending notification badges.',
      tip: 'The badge counts all requests requiring your review.'
    },
    {
      id: 'hr-appr-tabs',
      target: '.card:first-child',
      title: 'Status Filtering & Department Triage',
      badge: 'Step 2 of 4',
      icon: Sliders,
      description:
        'Filter requests by status (Action Required, Approved, Declined) or filter by department (Engineering, Product, Talent Ops) to triage requests quickly.',
      tip: 'Switch tabs to inspect historical decisions and reviewer notes.'
    },
    {
      id: 'hr-appr-decision',
      target: '.page-wrapper',
      title: '1-Click Decision & Bulk Multi-Select',
      badge: 'Step 3 of 4',
      icon: CheckCircle2,
      description:
        'Approve or decline individual requests with 1-click, or select multiple checkboxes to approve all pending leaves in bulk with the floating action bar.',
      tip: 'You can add customized approval or rejection remarks for the employee.'
    },
    {
      id: 'hr-appr-conflict',
      target: '.page-wrapper',
      title: 'Department Overlap & Concurrency Guard',
      badge: 'Step 4 of 4',
      icon: Users,
      description:
        'Dayflow automatically detects if multiple team members from the same department are on leave during the same dates, preventing project delivery bottlenecks.',
      tip: 'Look for the yellow concurrency warning tag on leave cards.'
    }
  ],

  'attendance': [
    {
      id: 'hr-att-nav',
      target: '[data-tour="sidebar-tab-attendance"]',
      title: 'How to Find: Workforce Attendance',
      badge: 'Step 1 of 4',
      icon: LayoutDashboard,
      description:
        'Click "Attendance & Shifts" on the left sidebar to inspect organization-wide clock-in logs and shift compliance.',
      tip: 'HR and Managers see all staff records across all departments.'
    },
    {
      id: 'hr-att-metrics',
      target: '[data-tour="attendance-metrics"]',
      title: 'Organization Presence & Shift Compliance',
      badge: 'Step 2 of 4',
      icon: Clock,
      description:
        'Calculates company-wide August attendance rate (96.2%), average working hours, and Bangalore HQ shift schedules (09:30 AM - 06:00 PM IST).',
      tip: 'Shows shift punctuality across Engineering, Product, and HR teams.'
    },
    {
      id: 'hr-att-controls',
      target: '[data-tour="attendance-controls"]',
      title: 'Company Timeline & Calendar Switcher',
      badge: 'Step 3 of 4',
      icon: LayoutDashboard,
      description:
        'Toggle between a daily timeline roster and a company calendar grid with status filters (Present, Half-Day, Leave, Absent).',
      tip: 'Search by employee name or date to pinpoint specific logs.'
    },
    {
      id: 'hr-att-roster',
      target: '[data-tour="attendance-roster"]',
      title: 'Employee Punch Audit Logs & CSV Export',
      badge: 'Step 4 of 4',
      icon: FileText,
      description:
        'Full audit trail of employee timestamps, terminal geolocation (Bangalore HQ / Mumbai), and total hours. Click "Export CSV" anytime for compliance records.',
      tip: 'Use the export button to download formatted attendance spreadsheets.'
    }
  ],

  'analytics': [
    {
      id: 'hr-ana-nav',
      target: '[data-tour="sidebar-tab-analytics"]',
      title: 'How to Find: Workforce Analytics',
      badge: 'Step 1 of 4',
      icon: LayoutDashboard,
      description:
        'Click "Workforce Analytics" on the left sidebar to access high-level organization trends, punctuality rates, and department budgets.',
      tip: 'Exclusive to HR Managers and Administrators.'
    },
    {
      id: 'hr-ana-metrics',
      target: '[data-tour="analytics-metrics"]',
      title: 'Executive Presence & Retention KPIs',
      badge: 'Step 2 of 4',
      icon: Sliders,
      description:
        'Monitors workforce punctuality rates, leave quota utilization %, monthly payroll burn in Indian Rupees (₹), and annual employee retention %.',
      tip: 'Switch time periods (Current Month, Q2, or FY YTD) to recalculate metrics.'
    },
    {
      id: 'hr-ana-charts',
      target: '[data-tour="analytics-charts"]',
      title: 'Interactive Attendance & Payroll Charts',
      badge: 'Step 3 of 4',
      icon: PieChart,
      description:
        'Real-time weekly presence rate charts and department payroll allocation graphs across Engineering, Product, HR, and Finance divisions.',
      tip: 'Hover over bars and charts to see detailed headcount and breakdown.'
    },
    {
      id: 'hr-ana-export',
      target: '[data-tour="analytics-export"]',
      title: 'Custom CSV & JSON Report Exporter',
      badge: 'Step 4 of 4',
      icon: FileText,
      description:
        'Generate and download actual formatted CSV or JSON audit reports with a single click. The file downloads directly to your computer.',
      tip: 'Select your fiscal period and click "Generate & Download Report".'
    }
  ],

  'payroll': [
    {
      id: 'hr-pay-nav',
      target: '[data-tour="sidebar-tab-payroll"]',
      title: 'How to Find: Org Payroll on Sidebar',
      badge: 'Step 1 of 4',
      icon: LayoutDashboard,
      description:
        'Click "Payroll & CTC" on the left sidebar to manage company compensation structures, department expenses, and monthly disbursements.',
      tip: 'All salary totals are formatted in Indian Rupees (₹).'
    },
    {
      id: 'hr-pay-metrics',
      target: '.grid-4',
      title: 'Monthly Org Payroll & CTC Overview',
      badge: 'Step 2 of 4',
      icon: CreditCard,
      description:
        'Tracks monthly organizational payroll (₹82,50,000) and annual CTC compensation expense across all 7 active company accounts.',
      tip: 'Displays next disbursement schedule (August 31, 2026).'
    },
    {
      id: 'hr-pay-chart',
      target: '.card:first-child',
      title: 'Division Payroll Allocation Breakdown',
      badge: 'Step 3 of 4',
      icon: PieChart,
      description:
        'Visual distribution of compensation expenditures across Engineering, Product Management, Design, and Talent Operations divisions.',
      tip: 'Hover over chart segments to inspect division totals.'
    },
    {
      id: 'hr-pay-editor',
      target: '.data-table',
      title: 'Employee Salary Structure Editor',
      badge: 'Step 4 of 4',
      icon: Sliders,
      description:
        'Click "Edit Structure" on any employee row to adjust Basic Salary, HRA, and Special Allowances with automatic statutory recalculation.',
      tip: 'Changes update monthly take-home and tax withholdings automatically.'
    }
  ]
};

// ==========================================
// 3. VP ADMIN & COMPLIANCE TOUR (ELENA)
// ==========================================
export const ADMIN_TOURS = {
  'admin-dashboard': [
    {
      id: 'adm-sidebar',
      target: '[data-tour="sidebar-nav"]',
      title: 'Executive Admin Navigation',
      badge: 'Step 1 of 4',
      icon: LayoutDashboard,
      description:
        'As VP Administrator, you have full organizational control over workforce scale, executive analytics, policy approvals, and company compensation budgets.',
      tip: 'Use the left menu to navigate across company divisions.'
    },
    {
      id: 'adm-hq',
      target: '.page-header',
      title: 'Executive Headquarters Command',
      badge: 'Step 2 of 4',
      icon: Building2,
      description:
        'High-level enterprise summary tracking workforce deployment, monthly payroll budget, and open approvals across Bangalore and Mumbai hubs.',
      tip: 'Gives executive leadership an immediate pulse on organization scale.'
    },
    {
      id: 'adm-metrics',
      target: '.grid-4',
      title: 'Enterprise Operational Scale',
      badge: 'Step 3 of 4',
      icon: Sliders,
      description:
        'Monitors active staff on shift today, pending team requests, and monthly payroll budget totals in Indian Rupees (₹).',
      tip: 'Real-time telemetry updated continuously.'
    },
    {
      id: 'adm-ops',
      target: '.card-header',
      title: 'Batch Operations & Governance',
      badge: 'Step 4 of 4',
      icon: ShieldCheck,
      description:
        'Directly execute monthly payroll batches, triage leave queues, or export organization audit logs with a single click.',
      tip: 'Click "Execute Payroll Batch" to disburse reconciled salaries.'
    }
  ],

  'analytics': [
    {
      id: 'adm-ana-nav',
      target: '[data-tour="sidebar-tab-analytics"]',
      title: 'How to Find: Executive Analytics',
      badge: 'Step 1 of 3',
      icon: LayoutDashboard,
      description:
        'Click "Workforce Analytics" on the left sidebar to inspect organization-wide attendance trends, payroll burn, and compliance.',
      tip: 'Review retention metrics and division compensation expenditures.'
    },
    {
      id: 'adm-ana-charts',
      target: '[data-tour="analytics-charts"]',
      title: 'Interactive Workforce Intelligence',
      badge: 'Step 2 of 3',
      icon: PieChart,
      description:
        'Real-time weekly presence rate charts and department payroll allocation graphs across Engineering, Product, HR, and Finance divisions.',
      tip: 'Switch time periods (Current Month, Q2, or FY YTD) to recalculate metrics.'
    },
    {
      id: 'adm-ana-export',
      target: '[data-tour="analytics-export"]',
      title: 'Download Custom CSV & JSON Audit Reports',
      badge: 'Step 3 of 3',
      icon: FileText,
      description:
        'Generate and download actual formatted CSV or JSON audit reports with a single click. The file downloads directly to your computer.',
      tip: 'Select your fiscal period and click "Generate & Download Report".'
    }
  ],

  'leave-approvals': [
    {
      id: 'adm-appr-nav',
      target: '[data-tour="sidebar-tab-leave-approvals"]',
      title: 'How to Find: Leave Approvals Queue',
      badge: 'Step 1 of 2',
      icon: LayoutDashboard,
      description:
        'Click "Leave Approvals" on the left sidebar to review and decide on team leave applications.',
      tip: 'Displays real-time pending notification badges whenever new requests arrive.'
    },
    {
      id: 'adm-appr-bulk',
      target: '.card-header',
      title: 'Executive Approvals & Bulk Decisions',
      badge: 'Step 2 of 2',
      icon: CheckCircle2,
      description:
        'Approve requests individually or select multiple checkboxes to approve all pending leaves in bulk with the floating action bar.',
      tip: 'Dayflow alerts you if multiple team members from the same department request overlapping dates.'
    }
  ],

  'payroll': [
    {
      id: 'adm-pay-nav',
      target: '[data-tour="sidebar-tab-payroll"]',
      title: 'How to Find: Compensation & CTC on Sidebar',
      badge: 'Step 1 of 2',
      icon: LayoutDashboard,
      description:
        'Click "Payroll & CTC" on the left sidebar to manage company compensation structures, department expenses, and monthly disbursements.',
      tip: 'All salary totals are formatted in Indian Rupees (₹).'
    },
    {
      id: 'adm-pay-breakdown',
      target: '.grid-4',
      title: 'Enterprise Payroll Expense & Salary Structures',
      badge: 'Step 2 of 2',
      icon: CreditCard,
      description:
        'Review total annual CTC compensation expense (₹2.85 Cr) and edit base salary, HRA, and allowances for any workforce member.',
      tip: 'Reconciled for Indian statutory compliance (EPFO, PT, TDS).'
    }
  ]
};

export const SECTION_TOURS = EMPLOYEE_TOURS;

// Main ProductTour Component (100% Rules-of-Hooks Compliant)
export const ProductTour = ({ isOpen, onClose, onFinish, currentRoute = 'employee-dashboard', onNavigate, activeUser }) => {
  const role = activeUser?.role || 'employee';

  // 1. ALL HOOKS DECLARED AT THE VERY TOP (Zero early returns before all hooks!)
  const tourDatabase = useMemo(() => {
    if (role === 'admin') return ADMIN_TOURS;
    if (role === 'hr') return HR_TOURS;
    return EMPLOYEE_TOURS;
  }, [role]);

  const activeSteps = useMemo(() => {
    return tourDatabase[currentRoute] || tourDatabase['employee-dashboard'] || tourDatabase['admin-dashboard'] || EMPLOYEE_TOURS['employee-dashboard'];
  }, [tourDatabase, currentRoute]);

  const roleSections = useMemo(() => {
    if (role === 'admin') {
      return [
        { id: 'admin-dashboard', label: 'Executive HQ' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'leave-approvals', label: 'Approvals' },
        { id: 'payroll', label: 'Compensation' }
      ];
    }
    if (role === 'hr') {
      return [
        { id: 'admin-dashboard', label: 'Admin HQ' },
        { id: 'leave-approvals', label: 'Approvals' },
        { id: 'attendance', label: 'Roster' },
        { id: 'analytics', label: 'Analytics' },
        { id: 'payroll', label: 'Org Payroll' }
      ];
    }
    return [
      { id: 'employee-dashboard', label: 'Workspace' },
      { id: 'attendance', label: 'Attendance' },
      { id: 'leave-apply', label: 'Leaves' },
      { id: 'payroll', label: 'Payroll' },
      { id: 'profile', label: 'Profile' }
    ];
  }, [role]);

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState(null);

  // Reset to step 0 when route or role changes
  useEffect(() => {
    setCurrentStepIndex(0);
  }, [currentRoute, role]);

  const step = activeSteps[currentStepIndex] || activeSteps[0] || null;

  // Measure target element position and scroll into view with fluid spring easing
  const updateTargetPosition = useCallback(() => {
    if (!step) return;
    const element = document.querySelector(step.target);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });

      setTimeout(() => {
        const rect = element.getBoundingClientRect();
        setTargetRect({
          top: Math.max(8, rect.top),
          left: Math.max(8, rect.left),
          width: Math.min(window.innerWidth - 16, rect.width),
          height: Math.min(window.innerHeight - 30, rect.height),
          bottom: rect.bottom,
          right: rect.right
        });
      }, 140);
    } else {
      // Fallback
      const fallbackEl = document.querySelector('.page-wrapper') || document.querySelector('.main-content');
      if (fallbackEl) {
        const rect = fallbackEl.getBoundingClientRect();
        setTargetRect({
          top: Math.max(60, rect.top),
          left: Math.max(280, rect.left),
          width: Math.min(window.innerWidth - 300, rect.width),
          height: Math.min(380, rect.height),
          bottom: rect.bottom,
          right: rect.right
        });
      }
    }
  }, [step]);

  useEffect(() => {
    if (isOpen) {
      updateTargetPosition();
      const timer = setTimeout(updateTargetPosition, 220);
      const handleResize = () => updateTargetPosition();
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize, true);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize, true);
      };
    }
  }, [isOpen, currentStepIndex, currentRoute, role, updateTargetPosition]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentStepIndex, activeSteps.length]);

  const handleNext = () => {
    if (currentStepIndex < activeSteps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('dayflow_tour_completed', 'true');
    onFinish?.();
    onClose?.();
  };

  const handleClose = () => {
    localStorage.setItem('dayflow_tour_completed', 'true');
    onClose?.();
  };

  const handleSwitchSection = (sectionId) => {
    onNavigate?.(sectionId);
    setCurrentStepIndex(0);
  };

  // 2. SAFE RENDERING GUARD: AFTER ALL HOOKS HAVE EXECUTED
  if (!isOpen || !step) return null;

  const Icon = step.icon || Compass;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === activeSteps.length - 1;

  const winW = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const winH = typeof window !== 'undefined' ? window.innerHeight : 900;

  // 100% COLLISION-FREE & VIEWPORT-CONSTRAINED POPOVER POSITIONING
  const getTooltipPosition = () => {
    if (!targetRect) {
      return {
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '410px'
      };
    }

    const cardWidth = Math.min(410, winW - 32);
    const cardHeight = 290;
    const gap = 16;
    const bottomSafetyBuffer = 95;

    let top = 0;
    let left = 0;

    // CASE 1: Target is on the Left Sidebar (targetRect.left < 50px or target is a sidebar tab)
    if (targetRect.left < 50 || targetRect.right < 340) {
      left = targetRect.right + gap;
      top = Math.max(16, Math.min(targetRect.top + 20, winH - cardHeight - bottomSafetyBuffer));
    }
    // CASE 2: Target is the Bottom Toolbar (top > winH - 140px)
    else if (targetRect.top > winH - 140) {
      top = Math.max(16, targetRect.top - cardHeight - gap);
      left = Math.max(16, (winW - cardWidth) / 2);
    }
    // CASE 3: Target is tall (height > 320px) on the left half
    else if (targetRect.height > 320 && winW - targetRect.right >= cardWidth + gap) {
      left = targetRect.right + gap;
      top = Math.max(16, Math.min(targetRect.top, winH - cardHeight - bottomSafetyBuffer));
    }
    // CASE 4: Normal elements - Check space below vs space above
    else {
      const spaceBelow = winH - targetRect.bottom - bottomSafetyBuffer;
      const spaceAbove = targetRect.top;

      if (spaceBelow >= cardHeight + gap) {
        top = targetRect.bottom + gap;
        left = Math.max(16, Math.min(targetRect.left, winW - cardWidth - 16));
      } else if (spaceAbove >= cardHeight + gap) {
        top = targetRect.top - cardHeight - gap;
        left = Math.max(16, Math.min(targetRect.left, winW - cardWidth - 16));
      } else {
        if (winW - targetRect.right >= cardWidth + gap) {
          left = targetRect.right + gap;
          top = Math.max(16, Math.min(targetRect.top, winH - cardHeight - bottomSafetyBuffer));
        } else {
          top = Math.max(16, winH - cardHeight - bottomSafetyBuffer);
          left = Math.max(16, winW - cardWidth - 20);
        }
      }
    }

    // STRICT HARD SAFETY CLAMP
    const maxSafeTop = Math.max(16, winH - cardHeight - bottomSafetyBuffer);
    top = Math.max(16, Math.min(top, maxSafeTop));
    left = Math.max(16, Math.min(left, winW - cardWidth - 16));

    return {
      top: `${top}px`,
      left: `${left}px`,
      width: `${cardWidth}px`
    };
  };

  const pad = 6;
  const cutX = targetRect ? Math.max(0, targetRect.left - pad) : 0;
  const cutY = targetRect ? Math.max(0, targetRect.top - pad) : 0;
  const cutW = targetRect ? targetRect.width + pad * 2 : 0;
  const cutH = targetRect ? targetRect.height + pad * 2 : 0;

  const springPhysics = {
    type: 'spring',
    stiffness: 340,
    damping: 30,
    mass: 0.8
  };

  const roleTitle = role === 'admin' ? 'VP Admin Tour • Elena' : role === 'hr' ? 'HR Lead Tour • Marcus' : 'Employee Tour • Sophia';
  const roleColor = role === 'admin' ? '#D97706' : role === 'hr' ? '#059669' : 'var(--color-primary)';

  return (
    <AnimatePresence>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10000,
          pointerEvents: 'none',
          overflow: 'hidden'
        }}
      >
        {/* SVG Cutout Definition Layer */}
        <svg
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            pointerEvents: 'none',
            zIndex: 10000
          }}
        >
          <defs>
            <filter id="tour-film-grain" x="0%" y="0%" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
              <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.14 0" />
            </filter>

            {/* True Mask: White = blurred dimmed backdrop; Black = 100% transparent crystal-clear cutout */}
            <mask id="tour-spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {targetRect && (
                <rect
                  x={cutX}
                  y={cutY}
                  width={cutW}
                  height={cutH}
                  rx="14"
                  fill="black"
                />
              )}
            </mask>
          </defs>
        </svg>

        {/* 1. VIVID AMBIENT RADIAL LIGHTING: GLIDES BEHIND ACTIVE SPOTLIGHT */}
        {targetRect && (
          <motion.div
            initial={false}
            animate={{
              top: cutY - 60,
              left: cutX - 60,
              width: cutW + 120,
              height: cutH + 120,
              opacity: 0.85
            }}
            transition={springPhysics}
            style={{
              position: 'fixed',
              background: 'radial-gradient(ellipse at center, rgba(168, 85, 247, 0.28) 0%, rgba(113, 75, 103, 0.14) 45%, transparent 75%)',
              pointerEvents: 'none',
              zIndex: 9999,
              filter: 'blur(16px)'
            }}
          />
        )}

        {/* 2. DIMMED BLURRED FROSTED BACKDROP WITH THE TRUE MASK HOLE APPLIED */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 12, 24, 0.72)',
            backdropFilter: 'blur(9px)',
            WebkitBackdropFilter: 'blur(9px)',
            mask: 'url(#tour-spotlight-mask)',
            WebkitMask: 'url(#tour-spotlight-mask)',
            zIndex: 10000,
            pointerEvents: 'auto'
          }}
          onClick={handleClose}
        >
          {/* Film Grain Texture Layer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              filter: 'url(#tour-film-grain)',
              opacity: 0.75,
              pointerEvents: 'none'
            }}
          />
        </motion.div>

        {/* 3. FLUID NEON PURPLE GLOWING BORDER AROUND THE 100% SHARP TARGET */}
        {targetRect && (
          <motion.div
            layoutId="spotlight-active-border"
            initial={false}
            animate={{
              top: cutY,
              left: cutX,
              width: cutW,
              height: cutH,
              opacity: 1
            }}
            transition={springPhysics}
            style={{
              position: 'fixed',
              borderRadius: '14px',
              border: '2.5px solid #A855F7',
              boxShadow: '0 0 30px rgba(168, 85, 247, 0.75), inset 0 0 16px rgba(168, 85, 247, 0.30)',
              pointerEvents: 'none',
              zIndex: 10001
            }}
          >
            {/* Glowing Corner Ripple Beacon */}
            <span
              style={{
                position: 'absolute',
                top: '-7px',
                right: '-7px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#C084FC',
                boxShadow: '0 0 14px #C084FC, 0 0 28px #A855F7',
                animation: 'pulse 1.5s infinite ease-in-out'
              }}
            />
          </motion.div>
        )}

        {/* 4. LUXURY GLASSMORPHISM GUIDE CARD (FLUID SPRING MOTION & VIVID POLISH) */}
        <motion.div
          key={`${role}-${currentRoute}-${step.id}`}
          initial={{ opacity: 0, y: 14, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.97 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'fixed',
            zIndex: 10002,
            background: 'linear-gradient(145deg, rgba(255, 255, 255, 0.98) 0%, rgba(253, 250, 253, 0.96) 100%)',
            backdropFilter: 'blur(24px) saturate(190%)',
            WebkitBackdropFilter: 'blur(24px) saturate(190%)',
            borderRadius: '14px',
            border: '1.5px solid rgba(168, 85, 247, 0.35)',
            boxShadow: '0 20px 40px -10px rgba(113, 75, 103, 0.30), 0 0 20px rgba(168, 85, 247, 0.16)',
            padding: '1rem 1.2rem',
            color: '#1E293B',
            pointerEvents: 'auto',
            overflow: 'hidden',
            maxHeight: 'calc(100vh - 120px)',
            display: 'flex',
            flexDirection: 'column',
            ...getTooltipPosition()
          }}
        >
          {/* Top Vivid Progress Glow Line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, #A855F7, #EC4899, #714B67)',
              opacity: 0.85
            }}
          />

          {/* Card Header & Role Badge & Step Counter */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  backgroundColor: 'rgba(113, 75, 103, 0.12)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid rgba(113, 75, 103, 0.22)'
                }}
              >
                <Icon size={14} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 750,
                      color: roleColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em'
                    }}
                  >
                    {roleTitle}
                  </span>
                  <span style={{ fontSize: '0.625rem', color: '#94A3B8' }}>•</span>
                  <span
                    style={{
                      fontSize: '0.625rem',
                      fontWeight: 600,
                      color: 'var(--color-primary)'
                    }}
                  >
                    {step.badge}
                  </span>
                </div>
                <div style={{ fontSize: '0.90625rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                  {step.title}
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.12, backgroundColor: 'rgba(0, 0, 0, 0.07)' }}
              whileTap={{ scale: 0.92 }}
              onClick={handleClose}
              style={{
                background: 'rgba(0, 0, 0, 0.04)',
                border: 'none',
                color: '#64748B',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '5px',
                transition: 'background 0.15s ease'
              }}
              title="Close Guide (ESC)"
            >
              <X size={14} />
            </motion.button>
          </div>

          {/* Simple, Non-Technical, Human Description */}
          <p
            style={{
              fontSize: '0.8125rem',
              color: '#334155',
              lineHeight: 1.45,
              margin: '0 0 0.6rem 0',
              fontWeight: 450
            }}
          >
            {step.description}
          </p>

          {/* Action Tip Pill with Subtle Neon Sheen */}
          <div
            style={{
              padding: '0.45rem 0.7rem',
              borderRadius: '6px',
              backgroundColor: 'rgba(247, 241, 245, 0.92)',
              border: '1px solid rgba(113, 75, 103, 0.18)',
              fontSize: '0.71875rem',
              color: '#475569',
              lineHeight: 1.35,
              marginBottom: '0.65rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '6px'
            }}
          >
            <Sparkles size={13} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>
              <strong style={{ color: 'var(--color-primary)' }}>Quick Tip:</strong> {step.tip}
            </span>
          </div>

          {/* Section Navigation Quick Switcher Pills (Role-Aware) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', marginBottom: '0.65rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.625rem', color: '#64748B', fontWeight: 600 }}>Tour Section:</span>
            {roleSections.map((s) => (
              <motion.button
                key={s.id}
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleSwitchSection(s.id)}
                style={{
                  padding: '2px 7px',
                  borderRadius: '4px',
                  border: '1px solid',
                  borderColor: currentRoute === s.id ? 'var(--color-primary)' : 'rgba(0,0,0,0.12)',
                  backgroundColor: currentRoute === s.id ? 'rgba(113, 75, 103, 0.12)' : '#FFFFFF',
                  color: currentRoute === s.id ? 'var(--color-primary)' : '#475569',
                  fontSize: '0.6875rem',
                  fontWeight: currentRoute === s.id ? 750 : 500,
                  cursor: 'pointer',
                  boxShadow: currentRoute === s.id ? '0 2px 4px rgba(113, 75, 103, 0.15)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                {s.label}
              </motion.button>
            ))}
          </div>

          {/* Footer: Progress Indicator & Navigation Controls (ALWAYS PINNED AND VISIBLE) */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.5rem',
              borderTop: '1px solid rgba(0, 0, 0, 0.08)',
              marginTop: 'auto'
            }}
          >
            {/* Step indicator dots with smooth spring width morphing */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {activeSteps.map((_, i) => (
                <motion.span
                  key={i}
                  layout
                  transition={springPhysics}
                  style={{
                    width: i === currentStepIndex ? '20px' : '5px',
                    height: '5px',
                    borderRadius: '3px',
                    backgroundColor: i === currentStepIndex ? 'var(--color-primary)' : 'rgba(0,0,0,0.18)',
                    boxShadow: i === currentStepIndex ? '0 0 6px rgba(113, 75, 103, 0.4)' : 'none'
                  }}
                />
              ))}
            </div>

            {/* Next / Back Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <motion.button
                type="button"
                whileHover={{ opacity: 1, scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '0.765625rem',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '4px 7px',
                  fontWeight: 500
                }}
              >
                Skip
              </motion.button>

              {!isFirst && (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handlePrev}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    padding: '5px 10px',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 0, 0, 0.12)',
                    backgroundColor: '#FFFFFF',
                    color: '#334155',
                    fontSize: '0.765625rem',
                    fontWeight: 650,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                  }}
                >
                  <ChevronLeft size={13} /> Back
                </motion.button>
              )}

              <motion.button
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '5px 13px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.765625rem',
                  fontWeight: 750,
                  cursor: 'pointer',
                  boxShadow: '0 3px 8px rgba(113, 75, 103, 0.35), 0 0 12px rgba(168, 85, 247, 0.20)'
                }}
              >
                {isLast ? (
                  <>
                    <CheckCircle2 size={14} /> Finish Tour
                  </>
                ) : (
                  <>
                    Next ({currentStepIndex + 1}/{activeSteps.length}) <ChevronRight size={14} />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Persistent floating launcher button with glowing aura and active role badge
export const TourLauncherButton = ({ onClick, currentSectionName = 'Workspace', activeUser }) => {
  const role = activeUser?.role || 'employee';
  const roleLabel = role === 'admin' ? 'Admin Guide' : role === 'hr' ? 'HR Guide' : `${currentSectionName} Guide`;

  return (
    <motion.button
      whileHover={{ scale: 1.08, y: -3, boxShadow: '0 12px 25px rgba(113, 75, 103, 0.30), 0 0 20px rgba(168, 85, 247, 0.35)' }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: '80px',
        right: '24px',
        zIndex: 899,
        display: 'flex',
        alignItems: 'center',
        gap: '7px',
        padding: '9px 17px',
        borderRadius: '9999px',
        backgroundColor: '#FFFFFF',
        color: 'var(--color-primary)',
        border: '1.5px solid rgba(168, 85, 247, 0.40)',
        boxShadow: '0 8px 20px rgba(113, 75, 103, 0.20), 0 0 16px rgba(168, 85, 247, 0.25)',
        fontSize: '0.8125rem',
        fontWeight: 750,
        fontFamily: 'inherit',
        cursor: 'pointer',
        backdropFilter: 'blur(12px)'
      }}
      title={`Start ${roleLabel}`}
    >
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: role === 'admin' ? '#D97706' : role === 'hr' ? '#059669' : '#A855F7',
          boxShadow: '0 0 10px #A855F7, 0 0 20px #C084FC',
          animation: 'pulse 1.4s infinite ease-in-out'
        }}
      />
      <Compass size={16} color="var(--color-primary)" />
      <span>{roleLabel}</span>
    </motion.button>
  );
};
