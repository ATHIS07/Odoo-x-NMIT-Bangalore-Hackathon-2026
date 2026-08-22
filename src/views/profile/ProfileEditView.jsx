import React, { useState, useRef } from 'react';
import {
  Lock,
  Save,
  ArrowLeft,
  Camera,
  UploadCloud,
  RotateCcw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Button, Card, Badge } from '../../components/common/CommonUI';

export const ProfileEditView = ({ onNavigate }) => {
  const { activeUser, role, isHRorAdmin, updateCurrentUser } = useAuth();
  const { profiles, updateProfile } = useHRMS();

  const fileInputRef = useRef(null);
  const [avatarError, setAvatarError] = useState('');
  const [saving, setSaving] = useState(false);

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

  // Handle local computer image upload
  const handleFileChange = (e) => {
    setAvatarError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file (PNG, JPG, WebP)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Image size should be under 5 MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData((prev) => ({ ...prev, avatar: event.target.result }));
    };
    reader.onerror = () => {
      setAvatarError('Failed to read image from computer');
    };
    reader.readAsDataURL(file);
  };

  const handleResetAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: activeUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80'
    }));
    setAvatarError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

    // Sync AuthContext activeUser state immediately
    if (updateCurrentUser) {
      updateCurrentUser({
        name: formData.name,
        avatar: formData.avatar,
        phone: formData.phone,
        ...(isHRorAdmin ? { department: formData.department, designation: formData.designation } : {})
      });
    }

    setSaving(false);
    onNavigate('profile');
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
              : 'Employee self-service: update your legal name, residential address, emergency contact, and profile photo.'}
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

      {/* RBAC Notice Banner for regular employees */}
      {!isHRorAdmin && (
        <div
          style={{
            padding: '0.875rem 1.25rem',
            borderRadius: '6px',
            backgroundColor: 'var(--primary-50)',
            border: '1px solid var(--primary-100)',
            color: 'var(--color-primary)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.8125rem'
          }}
        >
          <Lock size={16} color="var(--color-primary)" />
          <div>
            <strong>Self-Service Scope:</strong> You can edit your name, phone number, address, emergency contact, and photo. Department, designation, and salary are managed by HR.
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <form onSubmit={handleSave}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', alignItems: 'start' }}>
          
          {/* Left Column: Personal, Address & Emergency Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Card 1: Personal & Contact */}
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Enter full legal name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Primary Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="form-input font-mono"
                    placeholder="+91 98450 12345"
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
                  placeholder="Street address"
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

            {/* Card 2: Emergency Contact */}
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

            {/* Card 3: Job & Compensation (Admin managed) */}
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

          {/* Right Column: Clean & Aligned Profile Photo Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card>
              <div className="card-header">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Camera size={18} color="var(--color-primary)" />
                  Profile Photo
                </div>
              </div>

              {/* Photo Preview & Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '1.25rem' }}>
                <img
                  src={formData.avatar}
                  alt={formData.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    border: '2px solid var(--color-primary)',
                    flexShrink: 0
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
                    {formData.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginBottom: '0.625rem' }}>
                    JPG, PNG, WebP or GIF (max 5MB)
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      icon={UploadCloud}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload from Computer
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      icon={RotateCcw}
                      onClick={handleResetAvatar}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>

              {avatarError && (
                <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={14} /> {avatarError}
                </div>
              )}

              {/* Alternative Image URL Input */}
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Image Web URL (Optional)</label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="form-input"
                  placeholder="https://images.unsplash.com/..."
                />
              </div>
            </Card>
          </div>

        </div>
      </form>
    </div>
  );
};
