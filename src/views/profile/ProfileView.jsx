import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Users,
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

// Extended directory map for any colleague in the company
const EXTENDED_COLLEAGUES = {
  usr_001: {
    id: 'usr_001',
    name: 'Sophia Vance',
    employeeId: 'DF-8824',
    email: 'sophia.vance@odoo.com',
    department: 'Engineering',
    designation: 'Senior Staff Frontend Architect',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
    phone: '+91 98450 23891',
    location: 'Bangalore HQ (Outer Ring Road Tech Center)',
    manager: 'Vikramaditya Rao (VP Eng)',
    joiningDate: '2022-03-15',
    dob: '1994-06-22',
    gender: 'Female',
    bloodGroup: 'O+',
    maritalStatus: 'Single',
    emergencyName: 'David Vance',
    emergencyRelation: 'Father',
    emergencyPhone: '+91 98451 91233',
    street: '74 Outer Ring Road, Bellandur',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560103',
    bankName: 'HDFC Bank Ltd. (Commercial Branch)',
    accountNumber: '•••• •••• 6829',
    baseSalary: 1800000,
    hra: 720000,
    specialAllowance: 330000,
    bonus: 250000
  },
  usr_002: {
    id: 'usr_002',
    name: 'Marcus Chen',
    employeeId: 'DF-1092',
    email: 'marcus.chen@odoo.com',
    department: 'People & Talent Operations',
    designation: 'Lead HR Business Partner',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
    phone: '+91 98201 45611',
    location: 'Mumbai Hub (Bandra Kurla Complex / BKC)',
    manager: 'Elena Rostova (VP Operations)',
    joiningDate: '2021-08-01',
    dob: '1988-11-14',
    gender: 'Male',
    bloodGroup: 'A+',
    maritalStatus: 'Married',
    emergencyName: 'Linda Chen',
    emergencyRelation: 'Spouse',
    emergencyPhone: '+91 98209 77788',
    street: 'Tower 2, Bandra Kurla Complex (BKC)',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400051',
    bankName: 'ICICI Bank (BKC Towers)',
    accountNumber: '•••• •••• 9104',
    baseSalary: 1400000,
    hra: 560000,
    specialAllowance: 240000,
    bonus: 180000
  },
  usr_003: {
    id: 'usr_003',
    name: 'Elena Rostova',
    employeeId: 'DF-0010',
    email: 'elena.rostova@odoo.com',
    department: 'Executive Operations',
    designation: 'VP of People & Operations',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
    phone: '+91 98800 89033',
    location: 'Bangalore HQ (Executive Wing)',
    manager: 'Fabien Pinckaers (CEO)',
    joiningDate: '2020-01-10',
    dob: '1983-04-05',
    gender: 'Female',
    bloodGroup: 'AB+',
    maritalStatus: 'Married',
    emergencyName: 'Sergei Rostova',
    emergencyRelation: 'Spouse',
    emergencyPhone: '+91 98801 90122',
    street: '12 Embassy Golf Links, Domlur',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560071',
    bankName: 'Standard Chartered Bank',
    accountNumber: '•••• •••• 1002',
    baseSalary: 2800000,
    hra: 1120000,
    specialAllowance: 650000,
    bonus: 500000
  },
  usr_004: {
    id: 'usr_004',
    name: 'Vikramaditya Rao',
    employeeId: 'DF-8002',
    email: 'vikram.rao@odoo.com',
    department: 'Engineering',
    designation: 'VP & Head of Engineering',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80',
    phone: '+91 98450 00122',
    location: 'Bangalore HQ (Floor 4)',
    manager: 'Elena Rostova (VP Operations)',
    joiningDate: '2020-05-18',
    dob: '1985-08-19',
    gender: 'Male',
    bloodGroup: 'B+',
    maritalStatus: 'Married',
    emergencyName: 'Anjali Rao',
    emergencyRelation: 'Spouse',
    emergencyPhone: '+91 98450 99881',
    street: '45 Indiranagar 100ft Road',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560038',
    bankName: 'Axis Bank Ltd.',
    accountNumber: '•••• •••• 4421',
    baseSalary: 2600000,
    hra: 1040000,
    specialAllowance: 580000,
    bonus: 450000
  },
  usr_005: {
    id: 'usr_005',
    name: 'Ananya Deshmukh',
    employeeId: 'DF-8201',
    email: 'ananya.deshmukh@odoo.com',
    department: 'Product & UX Design',
    designation: 'Director of Product & UX Design',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=240&auto=format&fit=crop&q=80',
    phone: '+91 98450 00160',
    location: 'Bangalore HQ (Floor 5)',
    manager: 'Elena Rostova (VP Operations)',
    joiningDate: '2021-03-01',
    dob: '1989-12-04',
    gender: 'Female',
    bloodGroup: 'O+',
    maritalStatus: 'Married',
    emergencyName: 'Sameer Deshmukh',
    emergencyRelation: 'Spouse',
    emergencyPhone: '+91 98450 66772',
    street: '22 Koramangala 4th Block',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560034',
    bankName: 'HDFC Bank Ltd.',
    accountNumber: '•••• •••• 8831',
    baseSalary: 2100000,
    hra: 840000,
    specialAllowance: 420000,
    bonus: 300000
  },
  usr_006: {
    id: 'usr_006',
    name: 'Aarav Patel',
    employeeId: 'DF-8828',
    email: 'aarav.patel@odoo.com',
    department: 'Engineering',
    designation: 'Principal Backend Systems Lead',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=240&auto=format&fit=crop&q=80',
    phone: '+91 98450 00133',
    location: 'Bangalore HQ (Floor 4)',
    manager: 'Vikramaditya Rao (VP Eng)',
    joiningDate: '2021-07-15',
    dob: '1991-03-28',
    gender: 'Male',
    bloodGroup: 'A+',
    maritalStatus: 'Single',
    emergencyName: 'Rajesh Patel',
    emergencyRelation: 'Father',
    emergencyPhone: '+91 98450 33441',
    street: '88 HSR Layout Sector 1',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560102',
    bankName: 'State Bank of India',
    accountNumber: '•••• •••• 5519',
    baseSalary: 1750000,
    hra: 700000,
    specialAllowance: 320000,
    bonus: 220000
  },
  usr_007: {
    id: 'usr_007',
    name: 'Meera Nair',
    employeeId: 'DF-8205',
    email: 'meera.nair@odoo.com',
    department: 'Product & UX Design',
    designation: 'Lead Product Designer (Design Systems)',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=240&auto=format&fit=crop&q=80',
    phone: '+91 98450 00172',
    location: 'Bangalore HQ (Floor 5)',
    manager: 'Ananya Deshmukh (Director UX)',
    joiningDate: '2022-01-10',
    dob: '1993-09-15',
    gender: 'Female',
    bloodGroup: 'B+',
    maritalStatus: 'Single',
    emergencyName: 'Lakshmi Nair',
    emergencyRelation: 'Mother',
    emergencyPhone: '+91 98450 11223',
    street: '15 Whitefield Main Road',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560066',
    bankName: 'Kotak Mahindra Bank',
    accountNumber: '•••• •••• 7712',
    baseSalary: 1550000,
    hra: 620000,
    specialAllowance: 280000,
    bonus: 190000
  },
  usr_008: {
    id: 'usr_008',
    name: 'Pooja Hegde',
    employeeId: 'DF-7102',
    email: 'pooja.hegde@odoo.com',
    department: 'People & Talent Operations',
    designation: 'Senior Talent Acquisition Partner',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80',
    phone: '+91 98450 00188',
    location: 'Bangalore HQ (Floor 3)',
    manager: 'Marcus Chen (Lead HR)',
    joiningDate: '2022-08-01',
    dob: '1995-02-11',
    gender: 'Female',
    bloodGroup: 'O+',
    maritalStatus: 'Single',
    emergencyName: 'Shankar Hegde',
    emergencyRelation: 'Father',
    emergencyPhone: '+91 98450 44556',
    street: '33 Malleshwaram 8th Cross',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560003',
    bankName: 'ICICI Bank Ltd.',
    accountNumber: '•••• •••• 3348',
    baseSalary: 1200000,
    hra: 480000,
    specialAllowance: 220000,
    bonus: 150000
  },
  usr_009: {
    id: 'usr_009',
    name: 'Karthik Sundaram',
    employeeId: 'DF-8830',
    email: 'karthik.sundaram@odoo.com',
    department: 'Engineering',
    designation: 'Full Stack Engineer L2',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=240&auto=format&fit=crop&q=80',
    phone: '+91 98450 00145',
    location: 'Bangalore HQ (Floor 4)',
    manager: 'Sophia Vance (Staff Architect)',
    joiningDate: '2023-06-12',
    dob: '1997-07-25',
    gender: 'Male',
    bloodGroup: 'AB+',
    maritalStatus: 'Single',
    emergencyName: 'Sundaram Natarajan',
    emergencyRelation: 'Father',
    emergencyPhone: '+91 98450 77889',
    street: '19 BTM Layout 2nd Stage',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560076',
    bankName: 'HDFC Bank Ltd.',
    accountNumber: '•••• •••• 9924',
    baseSalary: 1100000,
    hra: 440000,
    specialAllowance: 200000,
    bonus: 120000
  },
  usr_010: {
    id: 'usr_010',
    name: 'Rohan Verma',
    employeeId: 'DF-8835',
    email: 'rohan.verma@odoo.com',
    department: 'Engineering',
    designation: 'QA Automation & Release Engineer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=240&auto=format&fit=crop&q=80',
    phone: '+91 98450 00155',
    location: 'Bangalore HQ (Floor 4)',
    manager: 'Sophia Vance (Staff Architect)',
    joiningDate: '2023-08-01',
    dob: '1998-05-14',
    gender: 'Male',
    bloodGroup: 'A+',
    maritalStatus: 'Single',
    emergencyName: 'Sunil Verma',
    emergencyRelation: 'Father',
    emergencyPhone: '+91 98450 88990',
    street: '56 Marathahalli Bridge Colony',
    city: 'Bangalore',
    state: 'Karnataka',
    postalCode: '560037',
    bankName: 'Axis Bank Ltd.',
    accountNumber: '•••• •••• 4410',
    baseSalary: 950000,
    hra: 380000,
    specialAllowance: 180000,
    bonus: 100000
  }
};

export const ProfileView = ({ onNavigate, viewedUserId, onResetViewedUser }) => {
  const { activeUser, role, isHRorAdmin, updateCurrentUser } = useAuth();
  const { profiles, users, updateProfile } = useHRMS();
  const { showToast } = useToast();

  const avatarInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState('personal');

  const targetId = viewedUserId || activeUser.id;
  const isViewingColleague = Boolean(viewedUserId && viewedUserId !== activeUser.id);
  const fallback = EXTENDED_COLLEAGUES[targetId] || EXTENDED_COLLEAGUES['usr_001'];
  const userRecord = (users && users.find((u) => u.id === targetId || u.employeeId === targetId)) || fallback;
  const rawProfile = (profiles && profiles[targetId]) || {};

  const profile = {
    userId: targetId,
    personalDetails: {
      fullName: rawProfile.personalDetails?.fullName || userRecord.name || fallback.name,
      dateOfBirth: rawProfile.personalDetails?.dateOfBirth || fallback.dob || '1994-06-22',
      gender: rawProfile.personalDetails?.gender || fallback.gender || 'Female',
      bloodGroup: rawProfile.personalDetails?.bloodGroup || fallback.bloodGroup || 'O+',
      maritalStatus: rawProfile.personalDetails?.maritalStatus || fallback.maritalStatus || 'Single',
      emergencyContactName: rawProfile.personalDetails?.emergencyContactName || fallback.emergencyName || 'David Vance',
      emergencyContactRelation: rawProfile.personalDetails?.emergencyContactRelation || fallback.emergencyRelation || 'Father',
      emergencyContactPhone: rawProfile.personalDetails?.emergencyContactPhone || fallback.emergencyPhone || '+91 98451 91233'
    },
    jobDetails: {
      employeeId: rawProfile.jobDetails?.employeeId || userRecord.employeeId || fallback.employeeId,
      department: rawProfile.jobDetails?.department || userRecord.department || fallback.department,
      designation: rawProfile.jobDetails?.designation || userRecord.designation || fallback.designation,
      manager: rawProfile.jobDetails?.manager || fallback.manager || 'Elena Rostova (VP Ops)',
      workEmail: rawProfile.jobDetails?.workEmail || userRecord.email || fallback.email,
      employmentType: rawProfile.jobDetails?.employmentType || 'Full-Time Permanent',
      joiningDate: rawProfile.jobDetails?.joiningDate || fallback.joiningDate || '2022-03-15',
      shift: rawProfile.jobDetails?.shift || 'General Core Shift (09:30 AM - 06:00 PM IST)',
      workLocation: rawProfile.jobDetails?.workLocation || userRecord.location || fallback.location,
      costCenter: rawProfile.jobDetails?.costCenter || `CC-${(fallback.department || 'ENG').substring(0, 3).toUpperCase()}-101`
    },
    salaryStructure: {
      baseSalary: rawProfile.salaryStructure?.baseSalary || fallback.baseSalary || 1800000,
      hra: rawProfile.salaryStructure?.hra || fallback.hra || 720000,
      specialAllowance: rawProfile.salaryStructure?.specialAllowance || fallback.specialAllowance || 330000,
      performanceBonus: rawProfile.salaryStructure?.performanceBonus || fallback.bonus || 250000,
      providentFundDeduction: 21600,
      professionalTax: 2400,
      taxDeductionAtSource: Math.round((fallback.baseSalary || 1800000) * 0.1),
      netAnnualSalary: (fallback.baseSalary || 1800000) + (fallback.hra || 720000) + (fallback.specialAllowance || 330000) - 204000,
      currency: 'INR',
      currencySymbol: '₹',
      bankName: rawProfile.salaryStructure?.bankName || fallback.bankName || 'HDFC Bank Ltd. (Commercial Branch)',
      accountNumber: rawProfile.salaryStructure?.accountNumber || fallback.accountNumber || '•••• •••• 6829',
      routingNumber: 'HDFC0001234'
    },
    address: {
      street: rawProfile.address?.street || fallback.street || '74 Outer Ring Road, Bellandur',
      city: rawProfile.address?.city || fallback.city || 'Bangalore',
      state: rawProfile.address?.state || fallback.state || 'Karnataka',
      postalCode: rawProfile.address?.postalCode || fallback.postalCode || '560103',
      country: 'India'
    },
    phone: rawProfile.phone || userRecord.phone || fallback.phone,
    documents: rawProfile.documents || [
      { id: 'doc_01', name: `${userRecord.name.replace(/\s+/g, '_')}_Employment_Agreement.pdf`, type: 'PDF', size: '2.4 MB', uploadDate: fallback.joiningDate || '2022-03-15', s3Key: `vault/${targetId}/contracts/agreement.pdf` },
      { id: 'doc_02', name: 'Form16_Tax_Declaration_2025_26.pdf', type: 'PDF', size: '1.1 MB', uploadDate: '2026-01-10', s3Key: `vault/${targetId}/tax/form16.pdf` },
      { id: 'doc_03', name: 'Passport_Aadhaar_Identification_Certified.pdf', type: 'PDF', size: '3.8 MB', uploadDate: '2022-03-14', s3Key: `vault/${targetId}/id/passport.pdf` }
    ]
  };

  const tabs = [
    { id: 'personal', label: 'Personal & Contact', icon: User },
    { id: 'job', label: 'Job & Hierarchy', icon: Building2 },
    { id: 'compensation', label: 'Compensation & Bank', icon: CreditCard },
    { id: 'documents', label: 'Document Vault', icon: FileText }
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

      {/* Colleague Dossier Context Banner */}
      {isViewingColleague && (
        <div
          style={{
            backgroundColor: '#F5EFF3',
            border: '1px solid #714B67',
            borderRadius: '10px',
            padding: '0.875rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            boxShadow: '0 2px 6px rgba(113, 75, 103, 0.08)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <User size={20} color="#714B67" />
            <div>
              <div style={{ fontWeight: 700, color: '#714B67', fontSize: '0.9375rem' }}>
                Viewing Colleague Dossier: {profile.personalDetails.fullName} ({profile.jobDetails.employeeId})
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-body)' }}>
                {profile.jobDetails.designation} • {profile.jobDetails.department} • Reports to {profile.jobDetails.manager}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Button size="sm" variant="secondary" onClick={() => onNavigate('org-chart')}>
              Back to Org Tree
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                onResetViewedUser?.();
              }}
            >
              Back to My Profile ({activeUser.name.split(' ')[0]})
            </Button>
          </div>
        </div>
      )}

      {/* Profile Header Dossier Card */}
      <Card elevated style={{ marginBottom: '2rem', padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative' }} className="avatar-upload-container">
              <img
                src={userRecord.avatar || fallback.avatar || activeUser.avatar}
                alt={profile.personalDetails.fullName}
                style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '3px solid var(--color-primary)',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              />
              {!isViewingColleague && (
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
              )}
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700, margin: 0, color: 'var(--color-text-heading)' }}>
                  {profile.personalDetails.fullName}
                </h1>
                <Badge variant={userRecord.role === 'hr' || fallback.role === 'hr' ? 'role-hr' : 'role-employee'}>
                  {userRecord.role === 'hr' || fallback.role === 'hr' ? 'HR LEAD' : 'EMPLOYEE'}
                </Badge>
              </div>

              <div style={{ fontSize: '0.9375rem', color: 'var(--color-text-body)', fontWeight: 500 }}>
                {profile.jobDetails.designation} • {profile.jobDetails.department}
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', marginTop: '0.75rem', fontSize: '0.8125rem', color: 'var(--color-text-muted)', flexWrap: 'wrap' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Mail size={14} color="var(--color-primary)" /> {profile.jobDetails.workEmail}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Phone size={14} /> {profile.phone}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={14} /> {profile.jobDetails.workLocation}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--font-mono)' }}>
                  ID: {profile.jobDetails.employeeId}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            {isViewingColleague ? (
              <a
                href={`mailto:${profile.jobDetails.workEmail}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  backgroundColor: 'var(--color-primary)',
                  color: '#FFFFFF',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  textDecoration: 'none'
                }}
              >
                <Mail size={16} />
                Send Email
              </a>
            ) : (
              <Button
                variant="primary"
                icon={Edit3}
                onClick={() => onNavigate('profile-edit')}
              >
                {isHRorAdmin ? 'Edit Full Dossier' : 'Edit Contact Info'}
              </Button>
            )}
          </div>
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
            <Card data-tour="profile-identity">
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

            <Card data-tour="profile-emergency">
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
                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                  <Button
                    size="sm"
                    variant="secondary"
                    icon={Users}
                    onClick={() => onNavigate('org-chart')}
                    style={{ width: '100%' }}
                  >
                    View in Org Hierarchy Tree ➔
                  </Button>
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
                        {doc.size} • Uploaded {doc.uploadDate}
                      </div>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    icon={Download}
                    onClick={() => alert(`Downloading verified document: ${doc.name}`)}
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
