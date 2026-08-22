import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Save, ArrowLeft, ShieldAlert, Sparkles, UploadCloud, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Button, Card, Badge } from '../../components/common/CommonUI';
import { FileUpload } from '../../components/common/FileUpload';

export const ProfileEditView = ({ onNavigate }) => {
  const { activeUser, role, isHRorAdmin } = useAuth();
  const { profiles, updateProfile, uploadDocument } = useHRMS();

  const currentProf = profiles[activeUser.id] || {};

  // Form local state
  const [formData, setFormData] = useState({
    name: currentProf.personalDetails?.fullName || activeUser.name,
    phone: currentProf.phone || activeUser.phone,
    avatar: currentProf.avatar || activeUser.avatar,
    street: currentProf.address?.street || '74 Outer Ring Road, Bellandur',
    city: currentProf.address?.city || 'Bangalore',
    state: currentProf.address?.state || 'Karnataka',
    postalCode: currentProf.address?.postalCode || '560103',
    emergencyName: currentProf.personalDetails?.emergencyContactName || 'David Vance',
    emergencyRelation: currentProf.personalDetails?.emergencyContactRelation || 'Father',
    emergencyPhone: currentProf.personalDetails?.emergencyContactPhone || '+91 98451 91233',
    // Admin only fields
    department: currentProf.jobDetails?.department || activeUser.department,
    designation: currentProf.jobDetails?.designation || activeUser.designation,
    manager: currentProf.jobDetails?.manager || 'Elena Rostova',
    baseSalary: currentProf.salaryStructure?.baseSalary || 1800000,
    hra: currentProf.salaryStructure?.hra || 720000,
    specialAllowance: currentProf.salaryStructure?.specialAllowance || 330000
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    const updatePayload = {
      phone: formData.phone,
      avatar: formData.avatar,
      personalDetails: {
        fullName: formData.name,
        emergencyContactName: formData.emergencyName,
        emergencyContactRelation: formData.emergencyRelation,
        emergencyContactPhone: formData.emergencyPhone
      },
      address: {
        street: formData.street,
        city: formData.city,
        state: formData.state,
        postalCode: formData.postalCode,
        country: 'India'
      }
    };

    if (isHRorAdmin) {
      updatePayload.jobDetails = {
        department: formData.department,
        designation: formData.designation,
        manager: formData.manager
      };
      updatePayload.salaryStructure = {
        baseSalary: Number(formData.baseSalary),
        hra: Number(formData.hra),
        specialAllowance: Number(formData.specialAllowance),
        netAnnualSalary: Number(formData.baseSalary) + Number(formData.hra) + Number(formData.specialAllowance) - 204000
      };
    }

    await updateProfile(activeUser.id, updatePayload);
    setSaving(false);
    onNavigate('profile');
  };

  const handleDocumentUpload = async (file) => {
    await uploadDocument(activeUser.id, file);
  };

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header">
        <div>
          <button
            onClick={() => onNavigate('profile')}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8125rem', marginBottom: '0.5rem', padding: 0 }}
          >
            <ArrowLeft size={16} /> Back to Dossier View
          </button>
          <h1 className="page-title">
            {isHRorAdmin ? `Administrative Profile Management (${activeUser.name})` : 'Update Contact & Personal Info'}
          </h1>
          <p className="page-subtitle">
            {isHRorAdmin
              ? 'Admin access: full authority to modify salary structures, job designations, and organization reporting lines.'
              : 'Employee self-service: update your residential address, emergency contact, and profile avatar.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button variant="ghost" onClick={() => onNavigate('profile')}>
            Cancel
          </Button>
          <Button variant="primary" icon={Save} loading={saving} onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>

      {/* RBAC Notice Banner */}
      {!isHRorAdmin && (
        <div
          style={{
            padding: '1rem 1.25rem',
            borderRadius: '6px',
            backgroundColor: 'var(--primary-50)',
            border: '1px solid var(--primary-100)',
            color: 'var(--color-primary)',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem'
          }}
        >
          <Lock size={18} color="var(--primary-600)" />
          <div>
            <strong>Employee Self-Service Security Policy:</strong> Job designation, department, and salary compensation are locked and governed by HR administration. To request modifications to job parameters, please reach out to your HR Partner.
          </div>
        </div>
      )}

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem' }}>
          {/* Left Column: Personal & Contact Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card>
              <div className="card-header">
                <div className="card-title">Personal & Contact Details</div>
                <Badge variant="active">Editable</Badge>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Full Legal Name</label>
                  <input
                    type="text"
                    disabled={!isHRorAdmin}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                  />
                  {!isHRorAdmin && <span className="form-hint">Name changes require HR verification</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Mobile Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input
                  type="text"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
              </div>
            </Card>

            <Card>
              <div className="card-header">
                <div className="card-title">Emergency Contact Person</div>
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Contact Name</label>
                  <input
                    type="text"
                    value={formData.emergencyName}
                    onChange={(e) => setFormData({ ...formData, emergencyName: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Relationship</label>
                  <input
                    type="text"
                    value={formData.emergencyRelation}
                    onChange={(e) => setFormData({ ...formData, emergencyRelation: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Emergency Phone</label>
                  <input
                    type="text"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
              </div>
            </Card>

            {/* Admin-only Job Details & Compensation fields */}
            <Card>
              <div className="card-header">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {!isHRorAdmin && <Lock size={16} color="var(--text-tertiary)" />}
                  Job & Compensation Structure
                </div>
                <Badge variant={isHRorAdmin ? 'role-admin' : 'info'}>
                  {isHRorAdmin ? 'Admin Unlocked' : 'Read Only'}
                </Badge>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Department</label>
                  <input
                    type="text"
                    disabled={!isHRorAdmin}
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Designation Title</label>
                  <input
                    type="text"
                    disabled={!isHRorAdmin}
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label">Annual Base (₹)</label>
                  <input
                    type="number"
                    disabled={!isHRorAdmin}
                    value={formData.baseSalary}
                    onChange={(e) => setFormData({ ...formData, baseSalary: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">HRA Allowance (₹)</label>
                  <input
                    type="number"
                    disabled={!isHRorAdmin}
                    value={formData.hra}
                    onChange={(e) => setFormData({ ...formData, hra: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Special Allowance (₹)</label>
                  <input
                    type="number"
                    disabled={!isHRorAdmin}
                    value={formData.specialAllowance}
                    onChange={(e) => setFormData({ ...formData, specialAllowance: e.target.value })}
                    className="form-input font-mono"
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column: Profile Picture & S3 Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card>
              <div className="card-header">
                <div className="card-title">Avatar Image</div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.25rem' }}>
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  style={{ width: '72px', height: '72px', borderRadius: '16px', objectFit: 'cover', border: '2px solid var(--border-subtle)' }}
                />
                <div style={{ flex: 1 }}>
                  <label className="form-label">Avatar Image URL</label>
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="form-input"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </Card>

            <Card>
              <div className="card-header">
                <div className="card-title">Upload S3 Encrypted Document</div>
              </div>
              <FileUpload onUpload={handleDocumentUpload} />
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};
