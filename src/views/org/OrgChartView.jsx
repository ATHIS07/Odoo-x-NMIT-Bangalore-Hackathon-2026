import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  RotateCcw,
  Sparkles,
  ChevronDown,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  ExternalLink,
  Shield,
  Clock,
  CalendarCheck,
  Building2,
  Compass,
  ArrowRight,
  Filter,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Button, Card, Badge, Modal } from '../../components/common/CommonUI';
import { audioManager } from '../../utils/audioFeedback';

// ============================================================================
// HIERARCHICAL WORKFORCE DATA TREE (Odoo Enterprise Org Structure)
// ============================================================================
const ORG_TREE_DATA = {
  id: 'usr_003',
  employeeId: 'DF-0001',
  name: 'Elena Rostova',
  title: 'VP, HR & Global Operations',
  department: 'Executive Leadership',
  divisionKey: 'executive',
  email: 'elena.rostova@odoo-enterprise.internal',
  phone: '+91 98450 00100',
  location: 'Bangalore HQ (Executive Wing)',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
  directReportsCount: 3,
  reports: [
    {
      id: 'usr_002',
      employeeId: 'DF-9011',
      name: 'Marcus Chen',
      title: 'Lead HR Business Partner',
      department: 'People & Talent Ops',
      divisionKey: 'people',
      email: 'marcus.chen@odoo-enterprise.internal',
      phone: '+91 98450 00115',
      location: 'Bangalore HQ (Floor 3)',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
      directReportsCount: 2,
      reports: [
        {
          id: 'usr_008',
          employeeId: 'DF-7102',
          name: 'Pooja Hegde',
          title: 'Senior Talent Acquisition Partner',
          department: 'People & Talent Ops',
          divisionKey: 'people',
          email: 'pooja.hegde@odoo-enterprise.internal',
          phone: '+91 98450 00188',
          location: 'Bangalore HQ (Floor 3)',
          avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80',
          directReportsCount: 0,
          reports: []
        },
        {
          id: 'usr_011',
          employeeId: 'DF-7105',
          name: 'Rahul Sen',
          title: 'People Operations Specialist',
          department: 'People & Talent Ops',
          divisionKey: 'people',
          email: 'rahul.sen@odoo-enterprise.internal',
          phone: '+91 98450 00192',
          location: 'Mumbai Hub',
          avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
          directReportsCount: 0,
          reports: []
        }
      ]
    },
    {
      id: 'usr_004',
      employeeId: 'DF-8002',
      name: 'Vikramaditya Rao',
      title: 'VP & Head of Engineering',
      department: 'Engineering & Technology',
      divisionKey: 'engineering',
      email: 'vikram.rao@odoo-enterprise.internal',
      phone: '+91 98450 00122',
      location: 'Bangalore HQ (Floor 4)',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80',
      directReportsCount: 2,
      reports: [
        {
          id: 'usr_001',
          employeeId: 'DF-8824',
          name: 'Sophia Vance',
          title: 'Senior Staff Frontend Architect',
          department: 'Engineering & Technology',
          divisionKey: 'engineering',
          email: 'sophia.vance@odoo-enterprise.internal',
          phone: '+91 98450 00112',
          location: 'Bangalore HQ (Floor 4)',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
          directReportsCount: 2,
          reports: [
            {
              id: 'usr_009',
              employeeId: 'DF-8830',
              name: 'Karthik Sundaram',
              title: 'Full Stack Engineer L2',
              department: 'Engineering & Technology',
              divisionKey: 'engineering',
              email: 'karthik.sundaram@odoo-enterprise.internal',
              phone: '+91 98450 00145',
              location: 'Bangalore HQ (Floor 4)',
              avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
              directReportsCount: 0,
              reports: []
            },
            {
              id: 'usr_010',
              employeeId: 'DF-8835',
              name: 'Rohan Verma',
              title: 'QA Automation & Release Engineer',
              department: 'Engineering & Technology',
              divisionKey: 'engineering',
              email: 'rohan.verma@odoo-enterprise.internal',
              phone: '+91 98450 00155',
              location: 'Bangalore HQ (Floor 4)',
              avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop&q=80',
              directReportsCount: 0,
              reports: []
            }
          ]
        },
        {
          id: 'usr_006',
          employeeId: 'DF-8828',
          name: 'Aarav Patel',
          title: 'Principal Backend Systems Lead',
          department: 'Engineering & Technology',
          divisionKey: 'engineering',
          email: 'aarav.patel@odoo-enterprise.internal',
          phone: '+91 98450 00133',
          location: 'Bangalore HQ (Floor 4)',
          avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&auto=format&fit=crop&q=80',
          directReportsCount: 0,
          reports: []
        }
      ]
    },
    {
      id: 'usr_005',
      employeeId: 'DF-8201',
      name: 'Ananya Deshmukh',
      title: 'Director of Product & UX Design',
      department: 'Product & UX Design',
      divisionKey: 'product',
      email: 'ananya.deshmukh@odoo-enterprise.internal',
      phone: '+91 98450 00160',
      location: 'Bangalore HQ (Floor 5)',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
      directReportsCount: 2,
      reports: [
        {
          id: 'usr_007',
          employeeId: 'DF-8205',
          name: 'Meera Nair',
          title: 'Lead Product Designer (Design Systems)',
          department: 'Product & UX Design',
          divisionKey: 'product',
          email: 'meera.nair@odoo-enterprise.internal',
          phone: '+91 98450 00172',
          location: 'Bangalore HQ (Floor 5)',
          avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
          directReportsCount: 0,
          reports: []
        },
        {
          id: 'usr_012',
          employeeId: 'DF-8210',
          name: 'Kavya Iyer',
          title: 'Senior Product Manager (HRMS)',
          department: 'Product & UX Design',
          divisionKey: 'product',
          email: 'kavya.iyer@odoo-enterprise.internal',
          phone: '+91 98450 00180',
          location: 'Bangalore HQ (Floor 5)',
          avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=240&auto=format&fit=crop&q=80',
          directReportsCount: 0,
          reports: []
        }
      ]
    }
  ]
};

export const OrgChartView = ({ onNavigate }) => {
  const { activeUser, role, isHR, switchPersona } = useAuth();
  const { getTodayAttendance, leaves } = useHRMS();

  // Controls State
  const [searchQuery, setSearchQuery] = useState('');
  const [divisionFilter, setDivisionFilter] = useState('all');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const [selectedColleague, setSelectedColleague] = useState(null);

  // Toggle Collapse / Expand
  const toggleCollapse = (nodeId, e) => {
    e.stopPropagation();
    audioManager.playTap();
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Helper to determine live presence
  const getNodeStatus = (node) => {
    const todayAtt = getTodayAttendance(node.id);
    if (todayAtt && todayAtt.checkIn && !todayAtt.checkOut) {
      return { label: 'On Shift', variant: 'present', dotColor: 'var(--emerald-500)' };
    }
    if (todayAtt && todayAtt.checkOut) {
      return { label: 'Shift Done', variant: 'present', dotColor: 'var(--color-primary)' };
    }
    const onLeave = leaves.some(
      (l) => l.userId === node.id && l.status === 'approved' && l.startDate <= '2026-08-22' && l.endDate >= '2026-08-22'
    );
    if (onLeave) {
      return { label: 'On Leave', variant: 'leave', dotColor: 'var(--amber-500)' };
    }
    return { label: 'Offline', variant: 'info', dotColor: 'var(--text-tertiary)' };
  };

  // Check if node matches search
  const isMatch = (node) => {
    if (!searchQuery.trim()) return false;
    const q = searchQuery.toLowerCase();
    return (
      node.name.toLowerCase().includes(q) ||
      node.title.toLowerCase().includes(q) ||
      node.department.toLowerCase().includes(q) ||
      node.employeeId.toLowerCase().includes(q)
    );
  };

  // Department Styling
  const getDepartmentColor = (divisionKey) => {
    switch (divisionKey) {
      case 'executive':
        return { border: '#714B67', badgeBg: '#F5EFF3', badgeText: '#714B67' };
      case 'engineering':
        return { border: '#2563EB', badgeBg: '#EFF6FF', badgeText: '#1D4ED8' };
      case 'product':
        return { border: '#10B981', badgeBg: '#ECFDF5', badgeText: '#047857' };
      case 'people':
        return { border: '#F59E0B', badgeBg: '#FEF3C7', badgeText: '#B45309' };
      default:
        return { border: 'var(--color-border)', badgeBg: 'var(--bg-surface-subtle)', badgeText: 'var(--text-primary)' };
    }
  };

  // Recursive Node Renderer
  const renderTreeNode = (node, depth = 0) => {
    const isCollapsed = collapsedNodes.has(node.id);
    const hasReports = node.reports && node.reports.length > 0;
    const isActiveUser = activeUser?.id === node.id;
    const matched = isMatch(node);
    const status = getNodeStatus(node);
    const deptStyle = getDepartmentColor(node.divisionKey);

    // Division Filter Check (if filtered, dim or hide non-matching trees unless parent/child)
    const isDivisionMatch = divisionFilter === 'all' || node.divisionKey === divisionFilter;

    return (
      <div
        key={node.id}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          opacity: isDivisionMatch || divisionFilter === 'all' ? 1 : 0.45,
          transition: 'all 0.3s ease'
        }}
      >
        {/* Node Card */}
        <motion.div
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          onClick={() => setSelectedColleague(node)}
          style={{
            width: '260px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            border: isActiveUser
              ? '2px solid #714B67'
              : matched
              ? '2px solid #F59E0B'
              : `1px solid ${deptStyle.border}`,
            boxShadow: isActiveUser
              ? '0 0 0 4px rgba(113, 75, 103, 0.18), 0 8px 16px -2px rgba(0, 0, 0, 0.08)'
              : matched
              ? '0 0 0 4px rgba(245, 158, 11, 0.25), 0 8px 16px -2px rgba(0, 0, 0, 0.08)'
              : '0 2px 4px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
            padding: '1rem',
            cursor: 'pointer',
            position: 'relative',
            zIndex: 2,
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          {/* Active User Indicator Tag */}
          {isActiveUser && (
            <div
              style={{
                position: 'absolute',
                top: '-10px',
                right: '12px',
                backgroundColor: '#714B67',
                color: '#FFFFFF',
                fontSize: '0.625rem',
                fontWeight: 800,
                padding: '2px 8px',
                borderRadius: '999px',
                letterSpacing: '0.05em',
                boxShadow: '0 2px 4px rgba(113, 75, 103, 0.3)'
              }}
            >
              YOU ARE HERE
            </div>
          )}

          {/* Card Body */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.625rem' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={node.avatar}
                alt={node.name}
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `2px solid ${deptStyle.border}`
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '0',
                  right: '0',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: status.dotColor,
                  border: '2px solid #FFFFFF'
                }}
                title={status.label}
              />
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 700,
                  color: 'var(--color-text-heading)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {node.name}
              </div>
              <div
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '2px'
                }}
              >
                {node.employeeId}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: 'var(--color-text-body)',
              lineHeight: 1.3,
              marginBottom: '0.5rem',
              minHeight: '2rem'
            }}
          >
            {node.title}
          </div>

          {/* Department Pill & Status Tag */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.5rem' }}>
            <span
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                backgroundColor: deptStyle.badgeBg,
                color: deptStyle.badgeText,
                padding: '2px 6px',
                borderRadius: '4px'
              }}
            >
              {node.divisionKey.toUpperCase()}
            </span>

            <span style={{ fontSize: '0.6875rem', color: status.dotColor, fontWeight: 600 }}>
              ● {status.label}
            </span>
          </div>

          {/* Expand / Collapse Sub-Tree Pill */}
          {hasReports && (
            <button
              onClick={(e) => toggleCollapse(node.id, e)}
              style={{
                position: 'absolute',
                bottom: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: isCollapsed ? '#714B67' : '#FFFFFF',
                color: isCollapsed ? '#FFFFFF' : '#714B67',
                border: '1px solid #714B67',
                borderRadius: '12px',
                padding: '2px 8px',
                fontSize: '0.625rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                zIndex: 4
              }}
            >
              {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              <span>{node.reports.length} Reports</span>
            </button>
          )}
        </motion.div>

        {/* Child Sub-Branches */}
        {hasReports && !isCollapsed && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              marginTop: '1.75rem',
              position: 'relative'
            }}
          >
            {/* Vertical connector from parent to horizontal bridge */}
            <div
              style={{
                width: '2px',
                height: '24px',
                backgroundColor: 'var(--color-border)',
                position: 'absolute',
                top: '-24px'
              }}
            />

            {/* Horizontal Branch Bridge */}
            {node.reports.length > 1 && (
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  height: '2px',
                  backgroundColor: 'var(--color-border)',
                  width: `${((node.reports.length - 1) / node.reports.length) * 100}%`
                }}
              />
            )}

            {/* Children Grid */}
            <div
              style={{
                display: 'flex',
                gap: '2rem',
                justifyContent: 'center',
                alignItems: 'flex-start',
                paddingTop: '16px'
              }}
            >
              {node.reports.map((child) => (
                <div key={child.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
                  {/* Vertical line from horizontal bridge to child */}
                  <div
                    style={{
                      width: '2px',
                      height: '16px',
                      backgroundColor: 'var(--color-border)',
                      position: 'absolute',
                      top: '-16px'
                    }}
                  />
                  {renderTreeNode(child, depth + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-600)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Workforce Intelligence & Hierarchy
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Odoo Enterprise India
            </span>
          </div>
          <h1 className="page-title">Organizational Hierarchy Tree</h1>
          <p className="page-subtitle">
            Interactive reporting structure, team span of control, and real-time on-shift status.
          </p>
        </div>

        {/* Right Controls: Center on Me & Expand All */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            icon={Compass}
            onClick={() => {
              setCollapsedNodes(new Set());
              setZoomLevel(1);
              audioManager.playTap();
            }}
          >
            Expand All Branches
          </Button>
          <Button
            variant="primary"
            icon={Sparkles}
            onClick={() => {
              setCollapsedNodes(new Set());
              setSearchQuery(activeUser.name);
              audioManager.playSuccessChime();
            }}
          >
            Locate Me ({activeUser.name.split(' ')[0]})
          </Button>
        </div>
      </div>

      {/* Control Bar: Filters, Search, Zoom */}
      <Card style={{ padding: '0.875rem 1.25rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search colleague, role, or ID..."
              style={{
                width: '100%',
                padding: '0.5rem 0.75rem 0.5rem 2rem',
                fontSize: '0.8125rem',
                backgroundColor: 'var(--bg-surface-subtle)',
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '8px',
                  background: 'none',
                  border: 'none',
                  fontSize: '0.75rem',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer'
                }}
              >
                ✕
              </button>
            )}
          </div>

          {/* Department Filter Pills */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Divisions' },
              { id: 'engineering', label: 'Engineering' },
              { id: 'product', label: 'Product & UX' },
              { id: 'people', label: 'People & Talent' },
              { id: 'executive', label: 'Executive' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setDivisionFilter(tab.id);
                  audioManager.playTap();
                }}
                style={{
                  padding: '0.375rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: divisionFilter === tab.id ? 'var(--color-primary)' : 'var(--color-border)',
                  backgroundColor: divisionFilter === tab.id ? 'var(--primary-50)' : '#FFFFFF',
                  color: divisionFilter === tab.id ? 'var(--color-primary)' : 'var(--color-text-body)',
                  fontSize: '0.75rem',
                  fontWeight: divisionFilter === tab.id ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Zoom Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
              title="Zoom Out"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ZoomOut size={16} />
            </button>
            <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', minWidth: '42px', textAlign: 'center' }}>
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
              title="Zoom In"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              title="Reset Zoom"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                border: '1px solid var(--color-border)',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <RotateCcw size={14} />
            </button>
          </div>
        </div>
      </Card>

      {/* Main Interactive Tree Canvas */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '3rem 2rem',
          minHeight: '600px',
          overflowX: 'auto',
          overflowY: 'auto',
          display: 'flex',
          justifyContent: 'center',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)'
        }}
      >
        <div
          style={{
            transform: `scale(${zoomLevel})`,
            transformOrigin: 'top center',
            transition: 'transform 0.2s ease',
            paddingBottom: '2rem'
          }}
        >
          {renderTreeNode(ORG_TREE_DATA)}
        </div>
      </div>

      {/* Colleague Quick-Peek Dossier Modal */}
      <Modal
        isOpen={!!selectedColleague}
        onClose={() => setSelectedColleague(null)}
        title="Colleague Dossier Preview"
        maxWidth="500px"
      >
        {selectedColleague && (
          <div>
            {/* Header Identity Block */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <img
                src={selectedColleague.avatar}
                alt={selectedColleague.name}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid var(--primary-50)'
                }}
              />
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700, margin: 0, color: 'var(--color-text-heading)' }}>
                  {selectedColleague.name}
                </h3>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 600 }}>
                  {selectedColleague.title}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {selectedColleague.employeeId} • {selectedColleague.department}
                </div>
              </div>
            </div>

            {/* Quick Contact & Details Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--color-border)' }}>
                <Mail size={16} color="var(--color-primary)" />
                <div style={{ fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.6875rem' }}>Direct Email</span>
                  <a href={`mailto:${selectedColleague.email}`} style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                    {selectedColleague.email}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--color-border)' }}>
                <Phone size={16} color="var(--color-success)" />
                <div style={{ fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.6875rem' }}>Work Phone</span>
                  <a href={`tel:${selectedColleague.phone}`} style={{ color: 'var(--color-text-heading)', fontWeight: 600 }}>
                    {selectedColleague.phone}
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem', borderRadius: '8px', backgroundColor: 'var(--bg-surface-subtle)', border: '1px solid var(--color-border)' }}>
                <MapPin size={16} color="var(--color-warning)" />
                <div style={{ fontSize: '0.8125rem' }}>
                  <span style={{ color: 'var(--color-text-muted)', display: 'block', fontSize: '0.6875rem' }}>Office Location</span>
                  <span style={{ fontWeight: 600, color: 'var(--color-text-heading)' }}>
                    {selectedColleague.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="ghost" onClick={() => setSelectedColleague(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={ExternalLink}
                onClick={() => {
                  const targetId = selectedColleague.id;
                  setSelectedColleague(null);
                  onNavigate('profile', { userId: targetId });
                }}
              >
                View Full Dossier
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
