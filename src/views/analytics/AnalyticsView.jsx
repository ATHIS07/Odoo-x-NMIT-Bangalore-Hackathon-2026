import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  Users,
  Clock,
  CreditCard,
  Building2,
  FileSpreadsheet,
  PieChart,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { useToast } from '../../context/ToastContext';
import { Button, Card, Badge, MetricCard } from '../../components/common/CommonUI';
import { AttendanceTrendChart, PayrollExpenseChart } from '../../components/charts/Charts';

export const AnalyticsView = () => {
  const { activeUser } = useAuth();
  const { users, attendance, leaves, payroll, profiles } = useHRMS();
  const { showToast } = useToast();

  const [activePeriod, setActivePeriod] = useState('month'); // 'month' | 'q2' | 'ytd'
  const [reportDateRange, setReportDateRange] = useState('2026-Q3');
  const [reportDepartment, setReportDepartment] = useState('All');
  const [reportFormat, setReportFormat] = useState('CSV');
  const [isExporting, setIsExporting] = useState(false);

  // Dynamic period metrics
  const periodData = {
    month: {
      punctuality: '96.8%',
      punctualityTrend: '+1.4% vs July',
      leaveUtilization: '34.2%',
      leaveSubtitle: 'Healthy distribution in Aug',
      payrollBurn: '₹82,50,000',
      payrollSubtitle: 'Reconciled for 7 accounts',
      retention: '99.1%',
      retentionSubtitle: '0 voluntary exits in Aug'
    },
    q2: {
      punctuality: '95.4%',
      punctualityTrend: '+0.8% vs Q1',
      leaveUtilization: '42.1%',
      leaveSubtitle: 'Summer leave peak reconciled',
      payrollBurn: '₹79,20,000 / mo',
      payrollSubtitle: 'Q2 average monthly run',
      retention: '98.8%',
      retentionSubtitle: '1 internal departmental transfer'
    },
    ytd: {
      punctuality: '96.1%',
      punctualityTrend: '+2.3% YoY',
      leaveUtilization: '38.6%',
      leaveSubtitle: 'Cumulative FY26-27 balance',
      payrollBurn: '₹4.12 Cr Total',
      payrollSubtitle: '5 months disbursed YTD',
      retention: '99.4%',
      retentionSubtitle: 'Enterprise retention benchmark'
    }
  };

  const currentMetrics = periodData[activePeriod];

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);

      const exportRows = users.map((u) => {
        const prof = profiles[u.id] || {};
        const sal = prof.salaryStructure || { baseSalary: 1800000, netAnnualSalary: 2646000 };
        const userLeaves = leaves.filter((l) => l.userId === u.id);
        const approvedCount = userLeaves.filter((l) => l.status === 'approved').reduce((acc, l) => acc + l.daysCount, 0);

        return {
          employeeId: u.employeeId,
          name: u.name,
          department: u.department,
          designation: u.designation,
          location: u.location,
          baseSalary: `₹${sal.baseSalary?.toLocaleString()}`,
          netTakeHomeAnnual: `₹${sal.netAnnualSalary?.toLocaleString()}`,
          totalApprovedLeaveDays: approvedCount
        };
      });

      if (reportFormat === 'JSON') {
        const jsonContent = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportRows, null, 2));
        const link = document.createElement('a');
        link.setAttribute('href', jsonContent);
        link.setAttribute('download', `Odoo_Executive_Report_${reportDateRange}_${reportDepartment}.json`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        // CSV export
        const headers = ['Employee ID,Name,Department,Designation,Location,Base Salary,Annual Take Home,Approved Leaves'];
        const csvRows = exportRows.map((r) =>
          `"${r.employeeId}","${r.name}","${r.department}","${r.designation}","${r.location}","${r.baseSalary}","${r.netTakeHomeAnnual}",${r.totalApprovedLeaveDays}`
        );
        const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([headers, ...csvRows].join('\n'));
        const link = document.createElement('a');
        link.setAttribute('href', csvContent);
        link.setAttribute('download', `Odoo_Executive_Report_${reportDateRange}_${reportDepartment}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      showToast({
        title: 'Executive Report Downloaded',
        message: `Generated and saved Odoo_Executive_Report_${reportDateRange}.${reportFormat.toLowerCase()}`,
        type: 'success'
      });
    }, 500);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Executive Intelligence & Audit Reports
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Workforce Data Insights (India)
            </span>
          </div>
          <h1 className="page-title">Workforce Analytics & Executive Reports</h1>
          <p className="page-subtitle">
            Enterprise intelligence across attendance rates, salary slip allocations, and leave utilization patterns.
          </p>
        </div>

        {/* Time Period Selector Tabs */}
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px', padding: '3px' }}>
          {[
            { id: 'month', label: 'August 2026' },
            { id: 'q2', label: 'Q2 (Apr-Jun)' },
            { id: 'ytd', label: 'FY26-27 YTD' }
          ].map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePeriod(p.id)}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '0.8125rem',
                fontWeight: 600,
                cursor: 'pointer',
                backgroundColor: activePeriod === p.id ? 'var(--bg-surface)' : 'transparent',
                color: activePeriod === p.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                boxShadow: activePeriod === p.id ? 'var(--shadow-sm)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Overview Tiles */}
      <div className="grid-4" data-tour="analytics-metrics" style={{ marginBottom: '1.5rem' }}>
        <MetricCard
          label="Average Punctuality"
          value={currentMetrics.punctuality}
          subtitle={currentMetrics.punctualityTrend}
          icon={Clock}
          iconColor="var(--emerald-600)"
          iconBg="var(--emerald-50)"
          trend={{ value: currentMetrics.punctualityTrend, isPositive: true, text: '' }}
        />

        <MetricCard
          label="Leave Quota Utilization"
          value={currentMetrics.leaveUtilization}
          subtitle={currentMetrics.leaveSubtitle}
          icon={TrendingUp}
          iconColor="var(--primary-600)"
          iconBg="var(--primary-50)"
        />

        <MetricCard
          label={activePeriod === 'ytd' ? 'Cumulative YTD Payroll' : 'Monthly Payroll Burn'}
          value={currentMetrics.payrollBurn}
          subtitle={currentMetrics.payrollSubtitle}
          icon={CreditCard}
          iconColor="#8B5CF6"
          iconBg="#F5F3FF"
        />

        <MetricCard
          label="Employee Retention"
          value={currentMetrics.retention}
          subtitle={currentMetrics.retentionSubtitle}
          icon={Users}
          iconColor="var(--emerald-600)"
          iconBg="var(--emerald-50)"
        />
      </div>

      {/* Charts Grid */}
      <div data-tour="analytics-charts" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Attendance Trend Line / Bar */}
        <Card elevated>
          <div className="card-header">
            <div>
              <div className="card-title">
                <Clock size={18} color="var(--primary-600)" />
                Weekly Attendance & Presence Rates
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Real-time punch metrics across Bangalore, Mumbai, Pune, and Hyderabad hubs.
              </div>
            </div>
            <Badge variant="active">Realtime</Badge>
          </div>

          <AttendanceTrendChart />
        </Card>

        {/* Department Payroll Breakdown */}
        <Card elevated>
          <div className="card-header">
            <div>
              <div className="card-title">
                <CreditCard size={18} color="var(--primary-600)" />
                Department Payroll Allocation (INR)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Monthly gross compensation expenditure by division.
              </div>
            </div>
          </div>

          <PayrollExpenseChart />
        </Card>
      </div>

      {/* Custom Report Generator Card */}
      <Card elevated data-tour="analytics-export">
        <div className="card-header">
          <div>
            <div className="card-title">
              <FileSpreadsheet size={18} color="var(--primary-600)" />
              Custom Workforce Report Builder
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Export customized audit-ready reports for compensation slips, leave utilization, and shift logs.
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Fiscal Period Range</label>
            <select
              value={reportDateRange}
              onChange={(e) => setReportDateRange(e.target.value)}
              className="form-select"
            >
              <option value="2026-Q3">Current Quarter (Q3 2026)</option>
              <option value="2026-Q2">Q2 2026 (Apr - Jun)</option>
              <option value="2026-Q1">Q1 2026 (Jan - Mar)</option>
              <option value="2026-YTD">FY 2026-27 Year-to-Date</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Department Scope</label>
            <select
              value={reportDepartment}
              onChange={(e) => setReportDepartment(e.target.value)}
              className="form-select"
            >
              <option value="All">All Organization (7 Employees)</option>
              <option value="Engineering">Engineering Division</option>
              <option value="People & Talent Operations">People & Talent Operations</option>
              <option value="Product Design">Product Design</option>
              <option value="Finance & Strategy">Finance & Strategy</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Output Format</label>
            <select
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
              className="form-select font-mono"
            >
              <option value="CSV">Comma Separated File (.CSV)</option>
              <option value="JSON">Structured JSON Dataset (.JSON)</option>
            </select>
          </div>

          <div>
            <Button
              variant="primary"
              size="md"
              icon={Download}
              loading={isExporting}
              onClick={handleExportReport}
              style={{ width: '100%' }}
            >
              Generate & Download Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
