// ============================================================================
// DAYFLOW HRMS - BACKEND API GATEWAY CLIENT
// Standardized client with Cognito JWT Bearer token integration & error handling
// ============================================================================

import { cognitoService } from './cognitoService';

const API_BASE_URL = (import.meta.env.VITE_API_URL || 'https://ogkd345hpi.execute-api.ap-south-1.amazonaws.com').replace(/\/+$/, '');

class ApiClient {
  constructor(baseUrl = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Helper to perform authenticated HTTP requests
   */
  async request(endpoint, options = {}) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    const url = `${this.baseUrl}${cleanEndpoint}`;

    // Retrieve active Cognito JWT Token (ID Token is standard for API Gateway Cognito Authorizers)
    const token = cognitoService.getIdToken() || cognitoService.getAccessToken();

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {})
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);

      // Handle 401 Unauthorized cleanly
      if (response.status === 401) {
        console.warn(`[API] 401 Unauthorized for ${cleanEndpoint}. Session may have expired.`);
        // If unauthenticated or token expired, trigger session clear
        if (token) {
          cognitoService.clearSession();
          window.dispatchEvent(new CustomEvent('auth:unauthorized', { detail: { endpoint: cleanEndpoint } }));
        }
        const errorData = await response.json().catch(() => ({}));
        const err = new Error(errorData.message || 'Session expired or unauthorized. Please sign in again.');
        err.status = 401;
        throw err;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const err = new Error(errorData.message || `Request failed with status ${response.status}`);
        err.status = response.status;
        err.data = errorData;
        throw err;
      }

      // Handle empty response or json
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        return await response.json();
      }
      return await response.text();
    } catch (error) {
      // Re-throw formatted error
      throw error;
    }
  }

  // ==========================================
  // PROTECTED RESOURCE ENDPOINTS
  // ==========================================

  /**
   * GET /employees
   * Fetch employee directory
   */
  async getEmployees() {
    if (!cognitoService.getIdToken()) return null;
    return this.request('/employees', { method: 'GET' });
  }

  /**
   * GET /attendance
   * Fetch workforce attendance records
   */
  async getAttendance(params = {}) {
    if (!cognitoService.getIdToken()) return null;
    const query = new URLSearchParams(params).toString();
    return this.request(`/attendance${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  /**
   * POST /attendance
   * Record punch / shift clock-in or clock-out
   */
  async recordAttendance(punchData) {
    return this.request('/attendance', {
      method: 'POST',
      body: JSON.stringify(punchData)
    });
  }

  /**
   * GET /leave
   * Fetch leave requests and balances
   */
  async getLeaves(params = {}) {
    if (!cognitoService.getIdToken()) return null;
    const query = new URLSearchParams(params).toString();
    return this.request(`/leave${query ? `?${query}` : ''}`, { method: 'GET' });
  }

  /**
   * POST /leave
   * Submit a new leave application
   */
  async applyLeave(leaveData) {
    return this.request('/leave', {
      method: 'POST',
      body: JSON.stringify(leaveData)
    });
  }

  /**
   * PUT /leave
   * Update leave request status (Approve / Reject)
   */
  async updateLeaveStatus(leaveId, status, remarks = '') {
    return this.request('/leave', {
      method: 'PUT',
      body: JSON.stringify({ leaveId, status, remarks })
    });
  }

  /**
   * GET /documents
   * Fetch encrypted document records
   */
  async getDocuments() {
    if (!cognitoService.getIdToken()) return null;
    return this.request('/documents', { method: 'GET' });
  }

  /**
   * GET /notifications
   * Fetch user notifications
   */
  async getNotifications() {
    if (!cognitoService.getIdToken()) return null;
    return this.request('/notifications', { method: 'GET' });
  }
}

export const api = new ApiClient();
