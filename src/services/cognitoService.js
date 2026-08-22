// ============================================================================
// DAYFLOW HRMS - AMAZON COGNITO AUTHENTICATION SERVICE
// Direct, native browser integration with Amazon Cognito Identity Provider
// ============================================================================

const AWS_REGION = import.meta.env.VITE_AWS_REGION || 'ap-south-1';
const CLIENT_ID = import.meta.env.VITE_COGNITO_CLIENT_ID || '29265f122gq1c6stkrvjfc6drp';
const USER_POOL_ID = import.meta.env.VITE_COGNITO_USER_POOL_ID || 'ap-south-1_VvvVWHBEp';
const COGNITO_ENDPOINT = `https://cognito-idp.${AWS_REGION}.amazonaws.com/`;

const STORAGE_KEYS = {
  ID_TOKEN: 'cognito_id_token',
  ACCESS_TOKEN: 'cognito_access_token',
  REFRESH_TOKEN: 'cognito_refresh_token',
  USER: 'cognito_user',
  EXPIRY: 'cognito_token_expiry'
};

/**
 * Decode JWT payload helper
 */
export const parseJwt = (token) => {
  if (!token) return null;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error decoding JWT payload:', e);
    return null;
  }
};

/**
 * Execute Cognito JSON-RPC action
 */
const callCognitoApi = async (action, payload) => {
  const response = await fetch(COGNITO_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${action}`
    },
    body: JSON.stringify(payload)
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorType = data.__type || data.code || 'CognitoError';
    const rawMessage = data.message || data.Message || 'Cognito operation failed';
    const error = new Error(formatCognitoErrorMessage(errorType, rawMessage));
    error.code = errorType;
    error.rawMessage = rawMessage;
    error.status = response.status;
    throw error;
  }

  return data;
};

/**
 * Map Cognito error codes to user-friendly messages
 */
const formatCognitoErrorMessage = (type, message) => {
  if (!type && !message) return 'Authentication error occurred.';
  const typeStr = String(type);
  if (typeStr.includes('UserNotFoundException')) {
    return 'User does not exist. Please check your email or sign up first.';
  }
  if (typeStr.includes('NotAuthorizedException')) {
    return 'Incorrect email or password.';
  }
  if (typeStr.includes('UserNotConfirmedException')) {
    return 'Account not confirmed yet. Please verify your email with the confirmation code.';
  }
  if (typeStr.includes('UsernameExistsException')) {
    return 'An account with this email already exists. Please sign in or reset your password.';
  }
  if (typeStr.includes('InvalidParameterException')) {
    return message || 'Invalid registration parameters provided.';
  }
  if (typeStr.includes('CodeMismatchException')) {
    return 'Invalid verification code. Please check the code sent to your email.';
  }
  if (typeStr.includes('ExpiredCodeException')) {
    return 'Verification code has expired. Please click resend code.';
  }
  if (typeStr.includes('InvalidPasswordException')) {
    return message || 'Password does not meet the security policy requirements.';
  }
  if (typeStr.includes('UserLambdaValidationException')) {
    return message || 'Pre sign-up validation failed: Employee ID or email does not match organization directory.';
  }
  return message || 'An error occurred during authentication.';
};

class CognitoAuthService {
  constructor() {
    this.region = AWS_REGION;
    this.clientId = CLIENT_ID;
    this.userPoolId = USER_POOL_ID;
  }

  /**
   * Register a new user in Cognito User Pool with custom:employee_id
   * @param {Object} params { employeeId, email, password }
   */
  async signUp({ employeeId, email, password }) {
    if (!email || !password || !employeeId) {
      throw new Error('Employee ID, official email, and password are required.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanEmpId = employeeId.trim();

    const payload = {
      ClientId: this.clientId,
      Username: cleanEmail,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: cleanEmail },
        { Name: 'custom:employee_id', Value: cleanEmpId }
      ]
    };

    const result = await callCognitoApi('SignUp', payload);
    return {
      success: true,
      userConfirmed: result.UserConfirmed || false,
      userSub: result.UserSub,
      codeDeliveryDetails: result.CodeDeliveryDetails,
      email: cleanEmail,
      employeeId: cleanEmpId
    };
  }

  /**
   * Confirm sign-up with OTP code sent to email
   * @param {Object} params { email, code }
   */
  async confirmSignUp({ email, code }) {
    if (!email || !code) {
      throw new Error('Email and confirmation code are required.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanCode = code.trim();

    const payload = {
      ClientId: this.clientId,
      Username: cleanEmail,
      ConfirmationCode: cleanCode
    };

    await callCognitoApi('ConfirmSignUp', payload);
    return { success: true, message: 'Account confirmed successfully. You may now log in.' };
  }

  /**
   * Resend confirmation code to user's email
   * @param {Object} params { email }
   */
  async resendConfirmationCode({ email }) {
    if (!email) throw new Error('Email is required to resend confirmation code.');
    const cleanEmail = email.trim().toLowerCase();

    const payload = {
      ClientId: this.clientId,
      Username: cleanEmail
    };

    const result = await callCognitoApi('ResendConfirmationCode', payload);
    return {
      success: true,
      codeDeliveryDetails: result.CodeDeliveryDetails
    };
  }

  /**
   * Authenticate user with Cognito (USER_PASSWORD_AUTH)
   * @param {Object} params { email, password }
   */
  async signIn({ email, password }) {
    if (!email || !password) {
      throw new Error('Please enter both your email and password.');
    }

    const cleanEmail = email.trim().toLowerCase();

    const payload = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: cleanEmail,
        PASSWORD: password
      }
    };

    const result = await callCognitoApi('InitiateAuth', payload);

    if (result.ChallengeName) {
      return {
        challengeName: result.ChallengeName,
        challengeParameters: result.ChallengeParameters,
        session: result.Session,
        email: cleanEmail
      };
    }

    const authResult = result.AuthenticationResult;
    if (!authResult || !authResult.IdToken) {
      throw new Error('Authentication succeeded but tokens were not returned.');
    }

    const idToken = authResult.IdToken;
    const accessToken = authResult.AccessToken;
    const refreshToken = authResult.RefreshToken;
    const expiresIn = authResult.ExpiresIn || 3600;

    // Decode ID Token payload
    const tokenPayload = parseJwt(idToken) || {};
    const expiryTime = Date.now() + expiresIn * 1000;

    // Build structured user object from Cognito attributes
    const employeeId = tokenPayload['custom:employee_id'] || tokenPayload['custom:employeeId'] || 'ADMIN001';
    const groups = tokenPayload['cognito:groups'] || [];
    const isHR = groups.includes('Admin_HR') || groups.includes('HR') || employeeId.startsWith('ADMIN') || cleanEmail.includes('admin');

    const user = {
      id: tokenPayload.sub || `usr_${Date.now()}`,
      sub: tokenPayload.sub,
      email: tokenPayload.email || cleanEmail,
      name: tokenPayload.name || cleanEmail.split('@')[0].replace(/[._]/g, ' '),
      employeeId: employeeId,
      role: isHR ? 'hr' : 'employee',
      department: isHR ? 'People & Talent Operations' : 'Engineering',
      designation: isHR ? 'Admin / Lead HR' : 'Software Engineer',
      groups: groups
    };

    // Store in localStorage
    this.setSession({ idToken, accessToken, refreshToken, user, expiryTime });

    return {
      success: true,
      idToken,
      accessToken,
      refreshToken,
      user,
      expiresIn
    };
  }

  /**
   * Request password reset code
   * @param {Object} params { email }
   */
  async forgotPassword({ email }) {
    if (!email) throw new Error('Email is required.');
    const cleanEmail = email.trim().toLowerCase();

    const payload = {
      ClientId: this.clientId,
      Username: cleanEmail
    };

    const result = await callCognitoApi('ForgotPassword', payload);
    return {
      success: true,
      codeDeliveryDetails: result.CodeDeliveryDetails
    };
  }

  /**
   * Confirm password reset with OTP and new password
   * @param {Object} params { email, code, newPassword }
   */
  async confirmForgotPassword({ email, code, newPassword }) {
    if (!email || !code || !newPassword) {
      throw new Error('Email, code, and new password are required.');
    }

    const payload = {
      ClientId: this.clientId,
      Username: email.trim().toLowerCase(),
      ConfirmationCode: code.trim(),
      Password: newPassword
    };

    await callCognitoApi('ConfirmForgotPassword', payload);
    return { success: true, message: 'Password reset successfully. Please log in with your new password.' };
  }

  /**
   * Store authentication session
   */
  setSession({ idToken, accessToken, refreshToken, user, expiryTime }) {
    if (idToken) localStorage.setItem(STORAGE_KEYS.ID_TOKEN, idToken);
    if (accessToken) localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (refreshToken) localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    if (expiryTime) localStorage.setItem(STORAGE_KEYS.EXPIRY, String(expiryTime));
  }

  /**
   * Get ID Token (Primary JWT for API Gateway Cognito Authorizer)
   */
  getIdToken() {
    const token = localStorage.getItem(STORAGE_KEYS.ID_TOKEN);
    const expiry = Number(localStorage.getItem(STORAGE_KEYS.EXPIRY) || '0');
    if (expiry && Date.now() > expiry) {
      // Token expired
      this.clearSession();
      return null;
    }
    return token;
  }

  /**
   * Get Access Token
   */
  getAccessToken() {
    return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  }

  /**
   * Get current stored user
   */
  getCurrentUser() {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      const user = JSON.parse(raw);
      if (this.getIdToken()) return user;
      return null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Clear session on logout or session expiry
   */
  clearSession() {
    localStorage.removeItem(STORAGE_KEYS.ID_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    localStorage.removeItem(STORAGE_KEYS.EXPIRY);
    localStorage.removeItem('odoo_auth_token');
    localStorage.removeItem('odoo_auth_user');
  }

  /**
   * Sign out
   */
  async signOut() {
    this.clearSession();
    return { success: true };
  }
}

export const cognitoService = new CognitoAuthService();
