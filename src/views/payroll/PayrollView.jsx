import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Download,
  FileText,
  DollarSign,
  TrendingUp,
  Building2,
  CheckCircle,
  Eye,
  Edit3,
  Calendar,
  Lock,
  Sparkles,
  Zap,
  Printer
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Button, Card, Badge, MetricCard, Modal } from '../../components/common/CommonUI';
import { PayrollExpenseChart } from '../../components/charts/Charts';

export const PayrollView = () => {
  const { activeUser, isHRorAdmin } = useAuth();
  const { payroll, profiles, users, triggerMonthlyPayrollRun, updateSalaryStructure } = useHRMS();

  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [editingSalaryUser, setEditingSalaryUser] = useState(null);
  const [salaryForm, setSalaryForm] = useState({ base: 165000, hra: 35000, allowance: 25000 });
  const [isProcessingRun, setIsProcessingRun] = useState(false);

  const userProfile = profiles[activeUser.id] || {};
  const currentSalary = userProfile.salaryStructure || {
    baseSalary: 165000,
    hra: 35000,
    specialAllowance: 25000,
    performanceBonus: 20000,
    providentFundDeduction: 12000,
    professionalTax: 2400,
    taxDeductionAtSource: 32000,
    netAnnualSalary: 198600,
    bankName: 'Chase Commercial',
    accountNumber: '•••• •••• 6829'
  };

  const userPayslips = payroll.filter((p) => p.userId === activeUser.id);

  const handleBatchRun = async () => {
    setIsProcessingRun(true);
    await triggerMonthlyPayrollRun();
    setIsProcessingRun(false);
  };

  const handleSaveSalaryStructure = async () => {
    if (!editingSalaryUser) return;
    await updateSalaryStructure(editingSalaryUser.id, {
      baseSalary: Number(salaryForm.base),
      hra: Number(salaryForm.hra),
      specialAllowance: Number(salaryForm.allowance),
      netAnnualSalary: Number(salaryForm.base) + Number(salaryForm.hra) + Number(salaryForm.allowance) - 14400
    });
    setEditingSalaryUser(null);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Compensation & Payroll OS
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              {isHRorAdmin ? 'Executive Payroll Management' : 'My Compensation & Slips'}
            </span>
          </div>
          <h1 className="page-title">{isHRorAdmin ? 'Organization Payroll Administration' : 'My Payslips & Compensation'}</h1>
          <p className="page-subtitle">
            Automated statutory deductions, tax withholding, and direct ACH deposit reconciliation.
          </p>
        </div>

        {isHRorAdmin && (
          <Button
            variant="primary"
            icon={Zap}
            loading={isProcessingRun}
            onClick={handleBatchRun}
          >
            Execute August Payroll Batch
          </Button>
        )}
      </div>

      {/* KPI Metrics */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <MetricCard
          label={isHRorAdmin ? 'Monthly Org Payroll' : 'My Net Take-Home (Monthly)'}
          value={isHRorAdmin ? '$118,450' : `$${(currentSalary.netAnnualSalary / 12).toFixed(0).toLocaleString()}`}
          subtitle={isHRorAdmin ? '7 Active accounts reconciled' : 'Direct ACH deposit to bank'}
          icon={DollarSign}
          iconColor="var(--emerald-600)"
          iconBg="var(--emerald-50)"
        />

        <MetricCard
          label={isHRorAdmin ? 'Annual CTC Expense' : 'Annual CTC Compensation'}
          value={isHRorAdmin ? '$1.42M' : `$${(currentSalary.baseSalary + currentSalary.hra + currentSalary.specialAllowance).toLocaleString()}`}
          subtitle="Fixed base + HRA + Allowances"
          icon={TrendingUp}
          iconColor="var(--primary-600)"
          iconBg="var(--primary-50)"
        />

        <MetricCard
          label="Next Disbursement Date"
          value="August 31, 2026"
          subtitle="Processing in 9 days"
          icon={Calendar}
          iconColor="var(--primary-600)"
          iconBg="var(--primary-50)"
        />

        <MetricCard
          label="Tax Regime / W4"
          value="Standard Tier"
          subtitle="TDS Withheld at Source"
          icon={CreditCard}
          iconColor="#8B5CF6"
          iconBg="#F5F3FF"
        />
      </div>

      {/* Admin View: Department Breakdown & Employee Salary Editor */}
      {isHRorAdmin ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Department Chart Card */}
          <Card elevated>
            <div className="card-header">
              <div className="card-title">
                <Building2 size={18} color="var(--primary-600)" />
                Workforce Payroll Distribution
              </div>
              <Badge variant="active">Reconciled</Badge>
            </div>

            <PayrollExpenseChart />
          </Card>

          {/* Employee Salary Structure Editor Table */}
          <Card elevated>
            <div className="card-header">
              <div>
                <div className="card-title">Employee CTC Structure & Compensation Tiers</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Admin privileges: modify base salary, HRA, and special allowances for any team member.
                </div>
              </div>
            </div>

            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Employee & ID</th>
                    <th>Department</th>
                    <th>Annual Base ($)</th>
                    <th>HRA Allowance ($)</th>
                    <th>Special Allowance ($)</th>
                    <th>Net Annual CTC</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const prof = profiles[u.id] || {};
                    const sal = prof.salaryStructure || { baseSalary: 140000, hra: 30000, specialAllowance: 18000, netAnnualSalary: 173600 };

                    return (
                      <tr key={u.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <img
                              src={u.avatar}
                              alt={u.name}
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div>
                              <div style={{ fontWeight: 700 }}>{u.name}</div>
                              <div style={{ fontSize: '0.6875rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                                {u.employeeId}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>{u.department}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${sal.baseSalary?.toLocaleString()}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>${sal.hra?.toLocaleString()}</td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>${sal.specialAllowance?.toLocaleString()}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--emerald-600)' }}>
                          ${sal.netAnnualSalary?.toLocaleString()}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <Button
                            size="sm"
                            variant="secondary"
                            icon={Edit3}
                            onClick={() => {
                              setEditingSalaryUser(u);
                              setSalaryForm({
                                base: sal.baseSalary,
                                hra: sal.hra,
                                allowance: sal.specialAllowance
                              });
                            }}
                          >
                            Edit Structure
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        /* Employee View: Current Month Breakdown & Historical Slips */
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr', gap: '1.5rem' }}>
          {/* Current Month Breakdown Card */}
          <Card elevated>
            <div className="card-header">
              <div className="card-title">
                <CreditCard size={18} color="var(--primary-600)" />
                Monthly Compensation Breakdown
              </div>
              <Badge variant="paid">Disbursed</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Gross Monthly Earnings
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>Basic Salary</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${(currentSalary.baseSalary / 12).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>House Rent Allowance (HRA)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${(currentSalary.hra / 12).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                <span>Special Executive Allowance</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>${(currentSalary.specialAllowance / 12).toFixed(2)}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase' }}>
                Statutory Monthly Deductions
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--rose-600)' }}>
                <span>Provident Fund (401k / PF)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>-${(currentSalary.providentFundDeduction / 12).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--rose-600)' }}>
                <span>Income Tax Withholding (TDS)</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>-${(currentSalary.taxDeductionAtSource / 12).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: 'var(--rose-600)' }}>
                <span>Professional State Tax</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>-${(currentSalary.professionalTax / 12).toFixed(2)}</span>
              </div>

              <div
                style={{
                  borderTop: '2px dashed var(--border-subtle)',
                  paddingTop: '0.875rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '1rem' }}>Net Take-Home Pay</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>Deposited to {currentSalary.accountNumber}</div>
                </div>
                <div style={{ fontSize: '1.375rem', fontWeight: 800, color: 'var(--emerald-600)', fontFamily: 'var(--font-mono)' }}>
                  ${(currentSalary.netAnnualSalary / 12).toFixed(2)}
                </div>
              </div>
            </div>
          </Card>

          {/* Payslip History List */}
          <Card elevated>
            <div className="card-header">
              <div className="card-title">Historical Payslip Archive</div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>2026 Fiscal Year</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              {userPayslips.map((p) => (
                <div
                  key={p.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                    <div
                      style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--primary-50)',
                        color: 'var(--primary-600)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FileText size={20} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {p.month} Payslip
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                        Disbursed on {p.payDate} • {p.transactionId}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.9375rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
                        ${p.netPay.toLocaleString()}
                      </div>
                      <Badge variant="paid">Paid</Badge>
                    </div>

                    <Button
                      size="sm"
                      variant="secondary"
                      icon={Eye}
                      onClick={() => setSelectedPayslip(p)}
                    >
                      View Slip
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Interactive PDF Payslip Modal */}
      <Modal
        isOpen={!!selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
        title="Official Compensation Payslip"
        maxWidth="680px"
      >
        {selectedPayslip && (
          <div style={{ padding: '0.5rem' }}>
            {/* Corporate Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid var(--border-default)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.03em', fontFamily: 'var(--font-display)', color: 'var(--primary-600)' }}>
                  Dayflow Technologies Inc.
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  500 Howard Street, Suite 400 • San Francisco, CA 94105
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  EIN: 84-2910482 • Corporate Payroll Division
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <Badge variant="paid">DISBURSED & VERIFIED</Badge>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, marginTop: '4px' }}>{selectedPayslip.month}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  {selectedPayslip.transactionId}
                </div>
              </div>
            </div>

            {/* Employee Dossier Block */}
            <div style={{ backgroundColor: 'var(--bg-surface-subtle)', padding: '0.875rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.75rem' }}>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Employee Name:</span>
                <div style={{ fontWeight: 700, fontSize: '0.8125rem' }}>{activeUser.name}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Employee ID:</span>
                <div style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{activeUser.employeeId}</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>Department:</span>
                <div style={{ fontWeight: 700 }}>{activeUser.department}</div>
              </div>
            </div>

            {/* Earnings & Deductions Table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              {/* Earnings */}
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                  Earnings
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                  <span>Basic Salary</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>${selectedPayslip.basic.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                  <span>HRA Allowance</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>${selectedPayslip.hra.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                  <span>Special Allowance</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>${selectedPayslip.specialAllowance.toLocaleString()}</span>
                </div>
                {selectedPayslip.bonus > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', color: 'var(--emerald-600)' }}>
                    <span>Performance Bonus</span>
                    <span style={{ fontFamily: 'var(--font-mono)' }}>+${selectedPayslip.bonus.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.875rem' }}>
                  <span>Gross Pay</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>${selectedPayslip.grossPay.toLocaleString()}</span>
                </div>
              </div>

              {/* Deductions */}
              <div style={{ border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: '0.5rem' }}>
                  Deductions
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                  <span>Provident Fund (PF)</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>${selectedPayslip.deductions.providentFund.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                  <span>Tax Withholding (TDS)</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>${selectedPayslip.deductions.taxDeduction.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                  <span>Professional Tax</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>${selectedPayslip.deductions.professionalTax.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                  <span>Medical Premium</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>${selectedPayslip.deductions.healthInsurance.toLocaleString()}</span>
                </div>
                <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.5rem', paddingTop: '0.5rem', display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '0.875rem' }}>
                  <span>Total Deductions</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--rose-600)' }}>-${selectedPayslip.totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Net Amount Banner */}
            <div style={{ backgroundColor: 'var(--primary-50)', border: '1px solid var(--primary-200)', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary-900)' }}>Net Disbursed Take-Home</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary-700)' }}>Paid to Chase Commercial •••• 6829</div>
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-700)', fontFamily: 'var(--font-mono)' }}>
                ${selectedPayslip.netPay.toLocaleString()}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
              <Button variant="ghost" onClick={() => setSelectedPayslip(null)}>
                Close Preview
              </Button>
              <Button
                variant="primary"
                icon={Printer}
                onClick={() => alert('PDF Payslip generated & downloaded from S3 Vault.')}
              >
                Print / Download PDF
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Admin Salary Structure Edit Modal */}
      <Modal
        isOpen={!!editingSalaryUser}
        onClose={() => setEditingSalaryUser(null)}
        title={`Adjust CTC Tier: ${editingSalaryUser?.name}`}
      >
        {editingSalaryUser && (
          <div>
            <div style={{ marginBottom: '1.25rem', padding: '0.875rem', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '8px' }}>
              <div style={{ fontWeight: 700 }}>{editingSalaryUser.name} ({editingSalaryUser.employeeId})</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{editingSalaryUser.department} • {editingSalaryUser.designation}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Annual Base Salary ($)</label>
              <input
                type="number"
                value={salaryForm.base}
                onChange={(e) => setSalaryForm({ ...salaryForm, base: e.target.value })}
                className="form-input font-mono"
              />
            </div>

            <div className="form-group">
              <label className="form-label">House Rent Allowance (HRA) ($)</label>
              <input
                type="number"
                value={salaryForm.hra}
                onChange={(e) => setSalaryForm({ ...salaryForm, hra: e.target.value })}
                className="form-input font-mono"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Special Executive Allowance ($)</label>
              <input
                type="number"
                value={salaryForm.allowance}
                onChange={(e) => setSalaryForm({ ...salaryForm, allowance: e.target.value })}
                className="form-input font-mono"
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
              <Button variant="ghost" onClick={() => setEditingSalaryUser(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveSalaryStructure}>
                Save Salary Structure
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
