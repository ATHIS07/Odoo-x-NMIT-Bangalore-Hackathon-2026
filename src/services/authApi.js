// ============================================================================
// DAYFLOW HRMS - COGNITO & API GATEWAY AUTH SPECIFICATION
// Standard authentication definitions and API contract documentation
// ============================================================================

import { cognitoService } from './cognitoService';

class AuthApiService {
  constructor() {
    this.region = import.meta.env.VITE_AWS_REGION || 'ap-south-1';
    this.userPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID || 'ap-south-1_VvvVWHBEp';
    this.clientId = import.meta.env.VITE_COGNITO_CLIENT_ID || '29265f122gq1c6stkrvjfc6drp';
    this.apiGatewayUrl = import.meta.env.VITE_API_URL || 'https://ogkd345hpi.execute-api.ap-south-1.amazonaws.com';
  }

  async login({ email, password }) {
    return cognitoService.signIn({ email, password });
  }

  async signup({ employeeId, email, password }) {
    return cognitoService.signUp({ employeeId, email, password });
  }

  async verifyOtp({ email, code }) {
    return cognitoService.confirmSignUp({ email, code });
  }

  async resendOtp({ email }) {
    return cognitoService.resendConfirmationCode({ email });
  }

  async forgotPassword({ email }) {
    return cognitoService.forgotPassword({ email });
  }

  async resetPassword({ email, code, newPassword }) {
    return cognitoService.confirmForgotPassword({ email, code, newPassword });
  }

  async getMe() {
    const user = cognitoService.getCurrentUser();
    if (!user) throw new Error('Unauthenticated');
    return { success: true, user };
  }

  async logout() {
    return cognitoService.signOut();
  }

  /**
   * Get API Specifications for developers and judges
   */
  getApiSpec() {
    return {
      name: 'Dayflow HRMS Amazon Cognito & API Gateway Architecture',
      version: '1.0.0',
      region: this.region,
      userPoolId: this.userPoolId,
      clientId: this.clientId,
      apiGatewayUrl: this.apiGatewayUrl,
      authType: 'Amazon Cognito User Pool JWT (RFC 7519 / RFC 6750)',
      endpoints: [
        {
          id: 'signup',
          title: '1. Cognito SignUp (Pre Sign-up Trigger)',
          method: 'POST',
          path: 'https://cognito-idp.ap-south-1.amazonaws.com/',
          description: 'Registers identity and triggers Pre Sign-up Lambda validation of custom:employee_id against RDS',
          requestHeaders: {
            'Content-Type': 'application/x-amz-json-1.1',
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.SignUp'
          },
          requestBody: {
            ClientId: this.clientId,
            Username: 'athishm.cs24@bitsathy.ac.in',
            Password: '••••••••••••',
            UserAttributes: [
              { Name: 'email', Value: 'athishm.cs24@bitsathy.ac.in' },
              { Name: 'custom:employee_id', Value: 'ADMIN001' }
            ]
          },
          responseBody: {
            UserConfirmed: false,
            UserSub: 'c5f94218-4e89-7023-b6dc-39048a129031',
            CodeDeliveryDetails: {
              Destination: 'a***@b***.ac.in',
              DeliveryMedium: 'EMAIL',
              AttributeName: 'email'
            }
          },
          curl: `curl -X POST "https://cognito-idp.ap-south-1.amazonaws.com/" \\\n  -H "Content-Type: application/x-amz-json-1.1" \\\n  -H "X-Amz-Target: AWSCognitoIdentityProviderService.SignUp" \\\n  -d '{\n    "ClientId": "${this.clientId}",\n    "Username": "athishm.cs24@bitsathy.ac.in",\n    "Password": "Password@2026!",\n    "UserAttributes": [\n      {"Name":"email","Value":"athishm.cs24@bitsathy.ac.in"},\n      {"Name":"custom:employee_id","Value":"ADMIN001"}\n    ]\n  }'`
        },
        {
          id: 'verify-otp',
          title: '2. Cognito ConfirmSignUp',
          method: 'POST',
          path: 'https://cognito-idp.ap-south-1.amazonaws.com/',
          description: 'Validates 6-digit email confirmation code and marks user CONFIRMED',
          requestHeaders: {
            'Content-Type': 'application/x-amz-json-1.1',
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.ConfirmSignUp'
          },
          requestBody: {
            ClientId: this.clientId,
            Username: 'athishm.cs24@bitsathy.ac.in',
            ConfirmationCode: '123456'
          },
          responseBody: {},
          curl: `curl -X POST "https://cognito-idp.ap-south-1.amazonaws.com/" \\\n  -H "Content-Type: application/x-amz-json-1.1" \\\n  -H "X-Amz-Target: AWSCognitoIdentityProviderService.ConfirmSignUp" \\\n  -d '{"ClientId":"${this.clientId}","Username":"athishm.cs24@bitsathy.ac.in","ConfirmationCode":"123456"}'`
        },
        {
          id: 'login',
          title: '3. Cognito InitiateAuth (Sign In)',
          method: 'POST',
          path: 'https://cognito-idp.ap-south-1.amazonaws.com/',
          description: 'Authenticates credentials using USER_PASSWORD_AUTH and issues ID Token & Access Token',
          requestHeaders: {
            'Content-Type': 'application/x-amz-json-1.1',
            'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth'
          },
          requestBody: {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: this.clientId,
            AuthParameters: {
              USERNAME: 'athishm.cs24@bitsathy.ac.in',
              PASSWORD: '••••••••••••'
            }
          },
          responseBody: {
            AuthenticationResult: {
              AccessToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
              ExpiresIn: 3600,
              IdToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
              RefreshToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
              TokenType: 'Bearer'
            }
          },
          curl: `curl -X POST "https://cognito-idp.ap-south-1.amazonaws.com/" \\\n  -H "Content-Type: application/x-amz-json-1.1" \\\n  -H "X-Amz-Target: AWSCognitoIdentityProviderService.InitiateAuth" \\\n  -d '{"AuthFlow":"USER_PASSWORD_AUTH","ClientId":"${this.clientId}","AuthParameters":{"USERNAME":"athishm.cs24@bitsathy.ac.in","PASSWORD":"Password@2026!"}}'`
        },
        {
          id: 'api-protected',
          title: '4. Protected API Gateway Endpoints',
          method: 'GET',
          path: `${this.apiGatewayUrl}/employees`,
          description: 'Protected endpoints (/employees, /attendance, /leave, /documents, /notifications) authorized via Bearer JWT',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer <Cognito_IdToken>'
          },
          responseBody: {
            employees: [
              {
                id: 'ADMIN001',
                name: 'Athish M',
                email: 'athishm.cs24@bitsathy.ac.in',
                role: 'Admin_HR'
              }
            ]
          },
          curl: `curl -X GET "${this.apiGatewayUrl}/employees" \\\n  -H "Authorization: Bearer <Cognito_IdToken>"`
        }
      ]
    };
  }
}

export const authApi = new AuthApiService();
