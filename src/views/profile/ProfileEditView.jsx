import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Lock,
  Save,
  ArrowLeft,
  ShieldAlert,
  Sparkles,
  UploadCloud,
  CheckCircle,
  Camera,
  Image as ImageIcon,
  Link as LinkIcon,
  Trash2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useHRMS } from '../../context/HRMSContext';
import { Button, Card, Badge } from '../../components/common/CommonUI';
import { FileUpload } from '../../components/common/FileUpload';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=240&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=240&auto=format&fit=crop&q=80'
];

export const ProfileEditView = ({ onNavigate }) => {
  const { activeUser, role, isHRorAdmin, updateCurrentUser } = useAuth();
  const { profiles, updateProfile, uploadDocument } = useHRMS();

  const fileInputRef = useRef(null);
  const [avatarUploadMode, setAvatarUploadMode] = useState('upload'); // 'upload' | 'url'
  const [isDragging, setIsDragging] = useState(false);
  const [avatarFileMeta, setAvatarFileMeta] = useState(null);
  const [avatarError, setAvatarError] = useState('');

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

  // Handle local image file upload & conversion to base64
  const processImageFile = (file) => {
    setAvatarError('');
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setAvatarError('Please select a valid image file (PNG, JPG, JPEG, WebP, GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Image size exceeds 5 MB. Please select a smaller photo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      setFormData((prev) => ({ ...prev, avatar: base64Data }));
      setAvatarFileMeta({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + ' KB',
        type: file.type.split('/')[1]?.toUpperCase() || 'IMG'
      });
    };
    reader.onerror = () => {
      setAvatarError('Failed to read image from local disk.');
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleResetAvatar = () => {
    setFormData((prev) => ({
      ...prev,
      avatar: activeUser.avatar || PRESET_AVATARS[0]
    }));
    setAvatarFileMeta(null);
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
          <Lock size={18} color="var(--color-primary)" />
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
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="form-input"
                    placeholder="Enter your full legal name"
                  />
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

          {/* Right Column: Profile Picture (Local Computer Upload + URL) & S3 Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Card>
              <div className="card-header">
                <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Camera size={18} color="var(--color-primary)" />
                  Profile Photo & Avatar
                </div>
                {avatarFileMeta && (
                  <Badge variant="present">Local File Loaded</Badge>
                )}
              </div>

              {/* Avatar Live Preview Card */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', padding: '1rem', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '8px', border: '1px solid var(--color-border)', marginBottom: '1.25rem' }}>
                <div style={{ position: 'relative' }}>
                  <img
                    src={formData.avatar}
                    alt={formData.name}
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '12px',
                      objectFit: 'cover',
                      border: '2px solid var(--color-primary)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      position: 'absolute',
                      bottom: '-6px',
                      right: '-6px',
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-primary)',
                      color: '#FFFFFF',
                      border: '2px solid #FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                    }}
                    title="Upload new image from your computer"
                  >
                    <Camera size={14} />
                  </button>
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--color-text-heading)' }}>
                    {formData.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {avatarFileMeta ? `${avatarFileMeta.name} (${avatarFileMeta.size})` : 'Active Employee Photo'}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'var(--primary-50)',
                        border: '1px solid var(--primary-200)',
                        color: 'var(--color-primary)',
                        fontSize: '0.6875rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      Change Photo
                    </button>
                    <button
                      type="button"
                      onClick={handleResetAvatar}
                      style={{
                        padding: '3px 8px',
                        borderRadius: '4px',
                        backgroundColor: 'transparent',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-body)',
                        fontSize: '0.6875rem',
                        cursor: 'pointer'
                      }}
                    >
                      Reset Default
                    </button>
                  </div>
                </div>
              </div>

              {/* Mode Selector Tabs: Upload from Computer vs Image URL */}
              <div style={{ display: 'flex', gap: '4px', padding: '3px', backgroundColor: 'var(--color-bg-secondary)', borderRadius: '6px', border: '1px solid var(--color-border)', marginBottom: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setAvatarUploadMode('upload')}
                  style={{
                    flex: 1,
                    padding: '0.375rem 0.5rem',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: avatarUploadMode === 'upload' ? '#FFFFFF' : 'transparent',
                    color: avatarUploadMode === 'upload' ? 'var(--color-primary)' : 'var(--color-text-body)',
                    fontWeight: avatarUploadMode === 'upload' ? 600 : 400,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxShadow: avatarUploadMode === 'upload' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  <UploadCloud size={13} />
                  Upload from Computer
                </button>
                <button
                  type="button"
                  onClick={() => setAvatarUploadMode('url')}
                  style={{
                    flex: 1,
                    padding: '0.375rem 0.5rem',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: avatarUploadMode === 'url' ? '#FFFFFF' : 'transparent',
                    color: avatarUploadMode === 'url' ? 'var(--color-primary)' : 'var(--color-text-body)',
                    fontWeight: avatarUploadMode === 'url' ? 600 : 400,
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    boxShadow: avatarUploadMode === 'url' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none'
                  }}
                >
                  <LinkIcon size={13} />
                  Web Image URL
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {avatarUploadMode === 'upload' ? (
                /* Drag & Drop Local File Dropzone */
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    padding: '1.5rem 1rem',
                    borderRadius: '8px',
                    border: isDragging ? '2px dashed var(--color-primary)' : '2px dashed var(--color-border)',
                    backgroundColor: isDragging ? 'var(--primary-50)' : 'var(--color-bg-secondary)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    marginBottom: '1rem'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-50)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
                    <UploadCloud size={20} />
                  </div>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-text-heading)', marginBottom: '0.25rem' }}>
                    Choose a photo or drag & drop here
                  </div>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)' }}>
                    PNG, JPG, JPEG, WEBP, or GIF (max 5 MB)
                  </div>
                </div>
              ) : (
                /* Web Image URL Input */
                <div className="form-group" style={{ marginBottom: '1rem' }}>
                  <label className="form-label">Image Web URL</label>
                  <input
                    type="text"
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="form-input"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              )}

              {avatarError && (
                <div style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <AlertCircle size={14} /> {avatarError}
                </div>
              )}

              {/* Preset Quick Avatars */}
              <div>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Or Choose from Enterprise Presets:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {PRESET_AVATARS.map((url, i) => (
                    <img
                      key={i}
                      src={url}
                      alt={`Preset ${i + 1}`}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, avatar: url }));
                        setAvatarFileMeta(null);
                        setAvatarError('');
                      }}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        objectFit: 'cover',
                        cursor: 'pointer',
                        border: formData.avatar === url ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                        opacity: formData.avatar === url ? 1 : 0.75,
                        transition: 'all 0.15s ease'
                      }}
                      title={`Select Avatar ${i + 1}`}
                    />
                  ))}
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
