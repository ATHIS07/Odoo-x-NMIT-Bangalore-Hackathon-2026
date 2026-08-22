import React, { useState } from 'react';
import { motion } from 'framer-motion';

export const AttendanceTrendChart = () => {
  const [activeDay, setActiveDay] = useState(null);

  const days = [
    { label: 'Mon 08/17', present: 96, late: 4, absent: 0 },
    { label: 'Tue 08/18', present: 98, late: 2, absent: 0 },
    { label: 'Wed 08/19', present: 92, late: 5, absent: 3 },
    { label: 'Thu 08/20', present: 100, late: 0, absent: 0 },
    { label: 'Fri 08/21', present: 95, late: 3, absent: 2 },
    { label: 'Sat 08/22', present: 97, late: 3, absent: 0 }
  ];

  const maxVal = 100;
  const chartHeight = 160;

  return (
    <div style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Weekly Organization Punctuality & Presence</div>
        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--emerald-500)' }} />
            Present ({days[days.length - 1].present}%)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--amber-500)' }} />
            Late Punch
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--rose-500)' }} />
            Absent
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: `${chartHeight}px`, gap: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
        {days.map((d, idx) => {
          const barHeight = (d.present / maxVal) * (chartHeight - 30);
          const isHovered = activeDay === idx;

          return (
            <div
              key={idx}
              onMouseEnter={() => setActiveDay(idx)}
              onMouseLeave={() => setActiveDay(null)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer', position: 'relative' }}
            >
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: -8 }}
                  style={{
                    position: 'absolute',
                    top: '-32px',
                    backgroundColor: 'var(--bg-sidebar)',
                    color: '#FFFFFF',
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontFamily: 'var(--font-mono)',
                    whiteSpace: 'nowrap',
                    zIndex: 10,
                    boxShadow: 'var(--shadow-md)'
                  }}
                >
                  {d.present}% Present ({d.late}% Late)
                </motion.div>
              )}

              <div
                style={{
                  width: '100%',
                  maxWidth: '36px',
                  height: `${chartHeight - 30}px`,
                  backgroundColor: 'var(--bg-surface-subtle)',
                  borderRadius: '6px 6px 0 0',
                  display: 'flex',
                  alignItems: 'flex-end',
                  overflow: 'hidden'
                }}
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeight}px` }}
                  transition={{ duration: 0.6, delay: idx * 0.08 }}
                  style={{
                    width: '100%',
                    backgroundColor: isHovered ? 'var(--emerald-600)' : 'var(--emerald-500)',
                    transition: 'background-color 0.2s ease'
                  }}
                />
              </div>

              <span style={{ fontSize: '0.75rem', color: isHovered ? 'var(--text-primary)' : 'var(--text-tertiary)', marginTop: '0.5rem', fontWeight: isHovered ? 700 : 500 }}>
                {d.label.split(' ')[0]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const PayrollExpenseChart = () => {
  const departments = [
    { name: 'Engineering', amount: 3950000, color: 'var(--primary-600)', pct: 48 },
    { name: 'Product & UX', amount: 1850000, color: '#6366F1', pct: 22 },
    { name: 'Executive & Ops', amount: 1400000, color: '#EC4899', pct: 17 },
    { name: 'Talent & HR', amount: 720000, color: '#10B981', pct: 9 },
    { name: 'Finance & Legal', amount: 330000, color: '#F59E0B', pct: 4 }
  ];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>Departmental Monthly Payroll Allocation</span>
        <span style={{ fontSize: '0.875rem', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>₹82,50,000 Total / Month</span>
      </div>

      {/* Stacked Progress Bar */}
      <div style={{ height: '14px', width: '100%', display: 'flex', borderRadius: '9999px', overflow: 'hidden', marginBottom: '1.25rem', backgroundColor: 'var(--bg-surface-subtle)' }}>
        {departments.map((dept, i) => (
          <div
            key={i}
            title={`${dept.name}: ₹${(dept.amount / 100000).toFixed(1)}L (${dept.pct}%)`}
            style={{ width: `${dept.pct}%`, backgroundColor: dept.color, height: '100%' }}
          />
        ))}
      </div>

      {/* Legend & Details */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.875rem' }}>
        {departments.map((dept, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: dept.color, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>{dept.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                ₹{(dept.amount / 100000).toFixed(1)} Lakhs • {dept.pct}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const LeaveQuotaDonut = ({ balance }) => {
  const paid = balance?.paid || { total: 20, used: 6, remaining: 14 };
  const sick = balance?.sick || { total: 12, used: 2, remaining: 10 };
  const comp = balance?.compensatory || { total: 5, used: 1, remaining: 4 };

  const totalAll = paid.total + sick.total + comp.total;
  const remainingAll = paid.remaining + sick.remaining + comp.remaining;
  const percentage = Math.round((remainingAll / totalAll) * 100);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
      {/* SVG Circular Donut Meter */}
      <div style={{ position: 'relative', width: '110px', height: '110px', flexShrink: 0 }}>
        <svg width="110" height="110" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--bg-surface-subtle)" strokeWidth="10" />
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            stroke="var(--primary-600)"
            strokeWidth="10"
            strokeDasharray="251.2"
            initial={{ strokeDashoffset: 251.2 }}
            animate={{ strokeDashoffset: 251.2 - (251.2 * percentage) / 100 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            strokeLinecap="round"
          />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{remainingAll}</span>
          <span style={{ fontSize: '0.625rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Days Left</span>
        </div>
      </div>

      {/* Breakdown categories */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', flex: 1, minWidth: '160px' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: 600 }}>Paid / Casual</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{paid.remaining} / {paid.total}</span>
          </div>
          <div style={{ height: '5px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${(paid.remaining / paid.total) * 100}%`, height: '100%', backgroundColor: 'var(--primary-600)' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: 600 }}>Medical / Sick</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{sick.remaining} / {sick.total}</span>
          </div>
          <div style={{ height: '5px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${(sick.remaining / sick.total) * 100}%`, height: '100%', backgroundColor: 'var(--emerald-500)' }} />
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: 600 }}>Compensatory</span>
            <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{comp.remaining} / {comp.total}</span>
          </div>
          <div style={{ height: '5px', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div style={{ width: `${(comp.remaining / comp.total) * 100}%`, height: '100%', backgroundColor: 'var(--purple-500)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
