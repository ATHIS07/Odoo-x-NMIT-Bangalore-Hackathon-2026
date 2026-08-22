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
import { Button, Card, Badge, MetricCard } from '../../components/common/CommonUI';
import { AttendanceTrendChart, PayrollExpenseChart } from '../../components/charts/Charts';

export const AnalyticsView = () => {
  const { activeUser, isHRorAdmin } = useAuth();
  const { users, attendance, leaves, payroll } = useHRMS();

  const [reportDateRange, setReportDateRange] = useState('2026-Q3');
  const [reportDepartment, setReportDepartment] = useState('All');
  const [reportFormat, setReportFormat] = useState('CSV');
  const [isExporting, setIsExporting] = useState(false);

  const handleExportReport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const filename = `Dayflow_Executive_Report_${reportDateRange}_${reportDepartment}.${reportFormat.toLowerCase()}`;
      alert(`Report generated: ${filename} (Prepared via AWS Lambda Data Pipeline)`);
    }, 600);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#BE185D', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Executive Intelligence & Audit Reports
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Workforce Data Insights
            </span>
          </div>
          <h1 className="page-title">Workforce Analytics & Executive Reports</h1>
          <p className="page-subtitle">
            Enterprise intelligence across attendance rates, salary slip allocations, and leave utilization patterns.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="primary" icon={Download} loading={isExporting} onClick={handleExportReport}>
            Generate Executive Dossier
          </Button>
        </div>
      </div>

      {/* KPI Overview Tiles */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard
          label="Average Punctuality"
          value="96.8%"
          subtitle="+1.4% vs last month"
          icon={Clock}
          iconColor="var(--emerald-600)"
          iconBg="var(--emerald-50)"
          trend={{ value: '+1.4%', isPositive: true, text: 'vs Q2' }}
        />

        <MetricCard
          label="Leave Quota Utilization"
          value="34.2%"
          subtitle="Healthy distribution across Q3"
          icon={TrendingUp}
          iconColor="var(--primary-600)"
          iconBg="var(--primary-50)"
        />

        <MetricCard
          label="Monthly Payroll Burn"
          value="₹82,50,000"
          subtitle="Reconciled & balanced"
          icon={CreditCard}
          iconColor="#8B5CF6"
          iconBg="#F5F3FF"
        />

        <MetricCard
          label="Employee Retention"
          value="99.1%"
          subtitle="0 voluntary exits in 2026"
          icon={Users}
          iconColor="var(--emerald-600)"
          iconBg="var(--emerald-50)"
        />
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.2fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
        {/* Attendance Trend Line / Bar */}
        <Card elevated>
          <div className="card-header">
            <div>
              <div className="card-title">
                <Clock size={18} color="var(--primary-600)" />
                Weekly Attendance & Presence Rates
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                Real-time punch metrics across all organizational tiers.
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
                Department Payroll Allocation
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
      <Card elevated>
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
              <option value="2026-YTD">2026 Year-to-Date</option>
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
              <option value="CSV">Comma Separated (.CSV)</option>
              <option value="PDF">Audit Executive PDF (.PDF)</option>
              <option value="JSON">Structured API Dump (.JSON)</option>
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
              Export Report
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
