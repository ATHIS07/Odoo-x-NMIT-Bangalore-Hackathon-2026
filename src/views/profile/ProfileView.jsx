import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building2,
  CreditCard,
  FileText,
  Edit3,
  Phone,
  Mail,
  MapPin,
  Calendar,
  ShieldCheck,
  Download,
  ExternalLink,
  Lock,
  Camera,
  UploadCloud
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { useToast } from '../../context/ToastContext';
import { Button, Card, Badge } from '../../components/common/CommonUI';

export const ProfileView = ({ onNavigate }) => {
  const { activeUser, role, isHRorAdmin, updateCurrentUser } = useAuth();
  const { profiles, updateProfile } = useHRMS();
  const { showToast } = useToast();

  const avatarInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('personal');

  const profile = profiles[activeUser.id] || {
    userId: activeUser.id,
    personalDetails: {
      fullName: activeUser.name,
      dateOfBirth: '1994-06-22',
      gender: 'Female',
      bloodGroup: 'O+',
      maritalStatus: 'Single',
      emergencyContactName: 'David Vance',
      emergencyContactRelation: 'Father',
      emergencyContactPhone: '+91 98451 91233'
    },
    jobDetails: {
      employeeId: activeUser.employeeId,
      department: activeUser.department,
      designation: activeUser.designation,
      manager: 'Elena Rostova (VP Ops)',
      workEmail: activeUser.email,
      employmentType: 'Full-Time Permanent',
      joiningDate: '2022-03-15',
      shift: 'General Core Shift (09:30 AM - 06:00 PM IST)',
      workLocation: activeUser.location,
      costCenter: 'CC-ENG-402'
    },
    salaryStructure: {
      baseSalary: 1800000,
      hra: 720000,
      specialAllowance: 330000,
      performanceBonus: 250000,
      providentFundDeduction: 21600,
      professionalTax: 2400,
      taxDeductionAtSource: 180000,
      netAnnualSalary: 2646000,
      currency: 'INR',
      currencySymbol: '₹',
      bankName: 'HDFC Bank Ltd. (Commercial Branch)',
      accountNumber: '•••• •••• 6829',
      routingNumber: 'HDFC0001234'
    },
    address: {
      street: '74 Outer Ring Road, Bellandur',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560103',
      country: 'India'
    },
    phone: activeUser.phone,
    documents: [
      { id: 'doc_01', name: 'Employment_Agreement_Odoo_Signed.pdf', type: 'PDF', size: '2.4 MB', uploadDate: '2022-03-15', s3Key: `s3://odoo-hr-vault/${activeUser.id}/contracts/emp_agreement.pdf` },
      { id: 'doc_02', name: 'Form16_Tax_Declaration_2025_26.pdf', type: 'PDF', size: '1.1 MB', uploadDate: '2026-01-10', s3Key: `s3://dayflow-hr-vault/${activeUser.id}/tax/form16_2026.pdf` },
      { id: 'doc_03', name: 'Passport_Aadhaar_Identification_Certified.pdf', type: 'PDF', size: '3.8 MB', uploadDate: '2022-03-14', s3Key: `s3://dayflow-hr-vault/${activeUser.id}/id/passport.pdf` }
    ]
  };

  const tabs = [
    { id: 'personal', label: 'Personal & Contact', icon: User },
    { id: 'job', label: 'Job & Hierarchy', icon: Building2 },
    { id: 'compensation', label: 'Compensation & Bank', icon: CreditCard },
    { id: 'documents', label: 'S3 Document Vault', icon: FileText }
  ];

  const handleAvatarFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast({
        title: 'Invalid File',
        message: 'Please select a valid image file (PNG, JPG, WebP)',
        type: 'error'
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast({
        title: 'File Too Large',
        message: 'Image size should be under 5 MB',
        type: 'error'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target.result;
      await updateProfile(activeUser.id, { avatar: base64Data });
      if (updateCurrentUser) {
        updateCurrentUser({ avatar: base64Data });
      }
      showToast({
        title: 'Profile Photo Updated',
        message: 'New photo successfully uploaded from your local computer',
        type: 'success'
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="page-wrapper">
      {/* Hidden File Input for Instant Avatar Upload */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        onChange={handleAvatarFileChange}
        style={{ display: 'none' }}
      />

      {/* Profile Header Dossier Card */}
      <Card elevated style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }} className="avatar-upload-container">
              <img
                src={activeUser.avatar}
                alt={activeUser.name}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '3px solid var(--color-primary)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                style={{
                  position: 'absolute',
                  bottom: '-4px',
                  right: '-4px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  border: '2px solid #FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  transition: 'all 0.15s ease'
                }}
                title="Upload profile photo from computer"
              >
                <Camera size={16} />
              </button>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--color-text-heading)' }}>
                  {profile.personalDetails?.fullName || activeUser.name}
                </h1>
                <Badge variant={role === 'hr' ? 'role-hr' : 'role-employee'}>
                  {role === 'hr' ? 'HR LEAD' : 'EMPLOYEE'}
                </Badge>
              </div>

              <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-body)', fontWeight: 500 }}>
                {profile.jobDetails?.designation || activeUser.designation} • {profile.jobDetails?.department || activeUser.department}
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={14} color="var(--color-primary)" /> {activeUser.email}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} /> {profile.phone || activeUser.phone}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {profile.address?.city || activeUser.location}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  ID: {activeUser.employeeId}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="primary"
            icon={Edit3}
            onClick={() => onNavigate('profile-edit')}
          >
            {isHRorAdmin ? 'Edit Full Dossier' : 'Edit Contact Info'}
          </Button>
        </div>
      </Card>

      {/* Tabs Selector */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '1.5rem' }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;

          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.25rem',
                border: 'none',
                borderBottom: `3px solid ${isActive ? 'var(--primary-600)' : 'transparent'}`,
                backgroundColor: 'transparent',
                color: isActive ? 'var(--primary-600)' : 'var(--text-secondary)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      {activeTab === 'personal' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid-2">
            <Card>
              <div className="card-header">
                <div className="card-title">Identity & Bio</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Full Legal Name</span>
                  <span style={{ fontWeight: 600 }}>{profile.personalDetails?.fullName || activeUser.name}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Date of Birth</span>
                  <span style={{ fontWeight: 600 }}>{profile.personalDetails?.dateOfBirth}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Gender</span>
                  <span style={{ fontWeight: 600 }}>{profile.personalDetails?.gender || 'Not specified'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Blood Group</span>
                  <span style={{ fontWeight: 600 }}>{profile.personalDetails?.bloodGroup}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Marital Status</span>
                  <span style={{ fontWeight: 600 }}>{profile.personalDetails?.maritalStatus}</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="card-header">
                <div className="card-title">Residential & Emergency Contact</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '2px' }}>Residential Address</div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                    {profile.address?.street}, {profile.address?.city}, {profile.address?.state} {profile.address?.postalCode}, {profile.address?.country}
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', marginBottom: '2px' }}>Emergency Contact</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>
                        {profile.personalDetails?.emergencyContactName} ({profile.personalDetails?.emergencyContactRelation})
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '2px', fontFamily: 'var(--font-mono)' }}>
                        {profile.personalDetails?.emergencyContactPhone}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a
                        href={`tel:${profile.personalDetails?.emergencyContactPhone}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--color-primary-light)',
                          color: 'var(--color-primary)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textDecoration: 'none',
                          border: '1px solid rgba(113, 75, 103, 0.2)'
                        }}
                      >
                        <Phone size={13} /> Call Now
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {activeTab === 'job' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid-2">
            <Card>
              <div className="card-header">
                <div className="card-title">Organizational Placement</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Department</span>
                  <span style={{ fontWeight: 700 }}>{profile.jobDetails?.department}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Designation Title</span>
                  <span style={{ fontWeight: 600 }}>{profile.jobDetails?.designation}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Reporting Manager</span>
                  <span style={{ fontWeight: 600, color: 'var(--primary-600)' }}>{profile.jobDetails?.manager}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Cost Center Code</span>
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{profile.jobDetails?.costCenter}</span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="card-header">
                <div className="card-title">Terms & Shift Agreement</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Employment Type</span>
                  <span style={{ fontWeight: 600 }}>{profile.jobDetails?.employmentType}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Joining Date</span>
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{profile.jobDetails?.joiningDate}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Assigned Shift</span>
                  <span style={{ fontWeight: 600 }}>{profile.jobDetails?.shift}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Work Location Hub</span>
                  <span style={{ fontWeight: 600 }}>{profile.jobDetails?.workLocation}</span>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {activeTab === 'compensation' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="grid-2">
            <Card>
              <div className="card-header">
                <div className="card-title">Annual Salary Breakdown</div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--emerald-600)', fontWeight: 700 }}>
                  Active Structure
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Base Salary</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>₹{profile.salaryStructure?.baseSalary?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>House Rent Allowance (HRA)</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>₹{profile.salaryStructure?.hra?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Special Allowance</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>₹{profile.salaryStructure?.specialAllowance?.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Target Performance Bonus</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>₹{profile.salaryStructure?.performanceBonus?.toLocaleString()}</span>
                </div>
                <div style={{ borderTop: '2px dashed var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', fontSize: '1rem' }}>
                  <span style={{ fontWeight: 700 }}>Total Net Annual Take-Home</span>
                  <span style={{ fontWeight: 800, color: 'var(--emerald-600)', fontFamily: 'var(--font-mono)' }}>
                    ₹{profile.salaryStructure?.netAnnualSalary?.toLocaleString()} / yr
                  </span>
                </div>
              </div>
            </Card>

            <Card>
              <div className="card-header">
                <div className="card-title">Disbursement Bank & Statutory</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Primary Bank</span>
                  <span style={{ fontWeight: 600 }}>{profile.salaryStructure?.bankName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Account Number</span>
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{profile.salaryStructure?.accountNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>IFSC Code</span>
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{profile.salaryStructure?.routingNumber}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Provident Fund (EPFO) Deduction</span>
                  <span style={{ fontWeight: 600, fontFamily: 'var(--font-mono)', color: 'var(--rose-600)' }}>
                    -₹{profile.salaryStructure?.providentFundDeduction?.toLocaleString()} / yr
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      )}

      {activeTab === 'documents' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <div className="card-header">
              <div>
                <div className="card-title">Employee Documents Vault</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  All contracts, tax declarations, and government IDs stored with server-side encryption.
                </div>
              </div>
              <Button size="sm" variant="secondary" onClick={() => onNavigate('profile-edit')}>
                Upload New Document
              </Button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(profile.documents || []).map((doc) => (
                <div
                  key={doc.id}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
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
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        backgroundColor: 'var(--primary-50)',
                        color: 'var(--primary-600)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <FileText size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                        {doc.size} • Uploaded {doc.uploadDate} • {doc.s3Key}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Download}
                    onClick={() => alert(`Downloading verified document from S3 Vault: ${doc.name}`)}
                  >
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};
