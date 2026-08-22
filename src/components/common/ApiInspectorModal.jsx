import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code, Copy, Check, Terminal, ExternalLink, ShieldCheck } from 'lucide-react';
import { authApi } from '../../services/authApi';

export const ApiInspectorModal = ({ isOpen, onClose, defaultEndpoint = 'login' }) => {
  const spec = authApi.getApiSpec();
  const [selectedId, setSelectedId] = useState(defaultEndpoint);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentEndpoint = spec.endpoints.find((e) => e.id === selectedId) || spec.endpoints[0];

  const handleCopyCurl = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="auth-modal-backdrop" onClick={onClose} style={{ zIndex: 9999 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          onClick={(e) => e.stopPropagation()}
          className="auth-modal-content"
          style={{
            maxWidth: '680px',
            width: '94%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '1.75rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)'
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', borderBottom: '1px solid #EAEAEA', paddingBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  backgroundColor: '#F5EFF3',
                  color: '#714B67',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Code size={18} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#1A1A1A', margin: 0 }}>
                  REST API Specification
                </h3>
                <span style={{ fontSize: '0.75rem', color: '#8A8A8A' }}>
                  {spec.authType} • v{spec.version}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ background: 'none', border: 'none', color: '#8A8A8A', cursor: 'pointer', padding: '4px' }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Endpoint Selector Tabs */}
          <div
            style={{
              display: 'flex',
              gap: '0.4rem',
              overflowX: 'auto',
              paddingBottom: '0.5rem',
              marginBottom: '1.25rem',
              borderBottom: '1px solid #F0F0F0'
            }}
          >
            {spec.endpoints.map((ep) => {
              const isSelected = ep.id === currentEndpoint.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => setSelectedId(ep.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: `1px solid ${isSelected ? '#714B67' : '#E5E5E5'}`,
                    backgroundColor: isSelected ? '#F5EFF3' : '#FFFFFF',
                    color: isSelected ? '#714B67' : '#4C4C4C',
                    fontSize: '0.8125rem',
                    fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.6875rem',
                      fontWeight: 700,
                      padding: '2px 5px',
                      borderRadius: '4px',
                      backgroundColor: ep.method === 'POST' ? '#714B67' : '#28A745',
                      color: '#FFFFFF'
                    }}
                  >
                    {ep.method}
                  </span>
                  <span>{ep.path.replace('/api/v1/auth', '')}</span>
                </button>
              );
            })}
          </div>

          {/* Endpoint Detail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Summary Banner */}
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#F9F9F9',
                border: '1px solid #EAEAEA'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#714B67',
                    color: '#FFFFFF'
                  }}
                >
                  {currentEndpoint.method}
                </span>
                <code style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A1A' }}>
                  {currentEndpoint.path}
                </code>
              </div>
              <p style={{ fontSize: '0.8125rem', color: '#666666', margin: 0 }}>
                {currentEndpoint.description}
              </p>
            </div>

            {/* Request Headers */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                Headers
              </label>
              <div
                style={{
                  backgroundColor: '#1E1E1E',
                  color: '#D4D4D4',
                  borderRadius: '6px',
                  padding: '0.625rem 0.875rem',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto'
                }}
              >
                {Object.entries(currentEndpoint.requestHeaders).map(([key, val]) => (
                  <div key={key}>
                    <span style={{ color: '#9CDCFE' }}>{key}</span>: <span style={{ color: '#CE9178' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Request Body */}
            {currentEndpoint.requestBody && (
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                  JSON Request Payload
                </label>
                <div
                  style={{
                    backgroundColor: '#1E1E1E',
                    color: '#D4D4D4',
                    borderRadius: '6px',
                    padding: '0.75rem 0.875rem',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    overflowX: 'auto'
                  }}
                >
                  <pre style={{ margin: 0 }}>{JSON.stringify(currentEndpoint.requestBody, null, 2)}</pre>
                </div>
              </div>
            )}

            {/* Response Body */}
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase', display: 'block', marginBottom: '0.35rem' }}>
                JSON Response (HTTP 200 OK)
              </label>
              <div
                style={{
                  backgroundColor: '#1E1E1E',
                  color: '#4EC9B0',
                  borderRadius: '6px',
                  padding: '0.75rem 0.875rem',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto'
                }}
              >
                <pre style={{ margin: 0, color: '#D4D4D4' }}>{JSON.stringify(currentEndpoint.responseBody, null, 2)}</pre>
              </div>
            </div>

            {/* cURL Command */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#8A8A8A', textTransform: 'uppercase' }}>
                  cURL Command
                </label>
                <button
                  type="button"
                  onClick={() => handleCopyCurl(currentEndpoint.curl)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: 'none',
                    border: 'none',
                    color: '#714B67',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  {copied ? <Check size={12} color="#28A745" /> : <Copy size={12} />}
                  <span>{copied ? 'Copied!' : 'Copy cURL'}</span>
                </button>
              </div>
              <div
                style={{
                  backgroundColor: '#111827',
                  color: '#E5E7EB',
                  borderRadius: '6px',
                  padding: '0.75rem 0.875rem',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  overflowX: 'auto'
                }}
              >
                <pre style={{ margin: 0 }}>{currentEndpoint.curl}</pre>
              </div>
            </div>
          </div>

          {/* Footer note */}
          <div
            style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid #EAEAEA',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: '#8A8A8A'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShieldCheck size={14} color="#28A745" />
              <span>Full REST API ready • Supports Bearer Token Authentication</span>
            </div>
            <button
              onClick={onClose}
              className="auth-odoo-btn"
              style={{ width: 'auto', padding: '6px 16px', fontSize: '0.8125rem' }}
            >
              Done
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
