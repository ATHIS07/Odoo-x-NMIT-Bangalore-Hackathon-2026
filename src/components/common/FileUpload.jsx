import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './CommonUI';

export const FileUpload = ({ onUpload, acceptedFormats = '.pdf,.doc,.docx,.png,.jpg', maxSizeBytes = 10485760 }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file) => {
    setErrorMessage('');
    setUploadSuccess(false);

    if (file.size > maxSizeBytes) {
      setErrorMessage(`File exceeds the 10 MB upload limit (${(file.size / (1024 * 1024)).toFixed(1)} MB)`);
      return;
    }

    setSelectedFile({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.type || 'Document/PDF',
      raw: file
    });
  };

  const startFileUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(15);

    // Simulate S3 Multi-part Upload chunks
    const timer1 = setTimeout(() => setUploadProgress(45), 250);
    const timer2 = setTimeout(() => setUploadProgress(85), 500);
    const timer3 = setTimeout(() => {
      setUploadProgress(100);
      setIsUploading(false);
      setUploadSuccess(true);
      if (onUpload) {
        onUpload({
          name: selectedFile.name,
          size: selectedFile.size,
          type: selectedFile.name.endsWith('.pdf') ? 'PDF' : 'DOC'
        });
      }
    }, 850);
  };

  const resetUploader = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    setIsUploading(false);
    setUploadSuccess(false);
    setErrorMessage('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div style={{ width: '100%' }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept={acceptedFormats}
        style={{ display: 'none' }}
      />

      {!selectedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: `2px dashed ${isDragging ? 'var(--primary-600)' : 'var(--border-default)'}`,
            backgroundColor: isDragging ? 'var(--primary-50)' : 'var(--bg-surface-subtle)',
            borderRadius: '12px',
            padding: '2rem 1.5rem',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              color: 'var(--primary-600)'
            }}
          >
            <UploadCloud size={24} />
          </div>
          <div style={{ fontWeight: 600, fontSize: '0.9375rem', color: 'var(--text-primary)' }}>
            Drag and drop your file here, or <span style={{ color: 'var(--primary-600)', textDecoration: 'underline' }}>browse</span>
          </div>
          <div style={{ fontSize: '0.8125rem', color: 'var(--text-tertiary)', marginTop: '0.35rem' }}>
            Secure Cloud Storage • Max size 10MB (PDF, DOCX, PNG)
          </div>
        </div>
      ) : (
        <div
          style={{
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1.25rem',
            backgroundColor: 'var(--bg-surface)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
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
                <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                  {selectedFile.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>
                  {selectedFile.size} • Ready for Document Vault
                </div>
              </div>
            </div>

            {!isUploading && !uploadSuccess && (
              <button
                onClick={resetUploader}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                <span>Uploading Document...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div style={{ height: '6px', width: '100%', backgroundColor: 'var(--bg-surface-subtle)', borderRadius: '9999px', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  style={{ height: '100%', backgroundColor: 'var(--primary-600)' }}
                />
              </div>
            </div>
          )}

          {uploadSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: 'var(--emerald-50)',
                color: 'var(--emerald-700)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.8125rem',
                fontWeight: 600
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={16} />
                <span>Uploaded and stored in Document Vault</span>
              </div>
              <Button size="sm" variant="ghost" onClick={resetUploader}>
                Upload Another
              </Button>
            </motion.div>
          )}

          {!isUploading && !uploadSuccess && (
            <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <Button size="sm" variant="ghost" onClick={resetUploader}>
                Cancel
              </Button>
              <Button size="sm" variant="primary" icon={ArrowUpRight} onClick={startFileUpload}>
                Confirm Upload
              </Button>
            </div>
          )}
        </div>
      )}

      {errorMessage && (
        <div style={{ marginTop: '0.5rem', color: 'var(--rose-600)', fontSize: '0.8125rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <AlertCircle size={14} />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
