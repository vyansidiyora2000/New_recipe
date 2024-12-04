import { CognitoUserPool, CognitoUser, AuthenticationDetails } from 'amazon-cognito-identity-js';


const poolData = {
  UserPoolId: import.meta.env.VITE_USER_POOL_ID || '',
  ClientId: import.meta.env.VITE_USER_POOL_WEB_CLIENT_ID || '',
};

const userPool = new CognitoUserPool(poolData);

const AUTH_API_URL = import.meta.env.VITE_AUTH_API_URL;  // For Cognito/user operations

export const signUp = async (email: string, password: string): Promise<string> => {
  // Validate password requirements
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  
  // Check for uppercase, lowercase, number and special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character');
  }

  console.log('Starting sign up process for:', email); 
  return new Promise((resolve, reject) => {
    userPool.signUp(
      email,
      password,
      [], // attribute list
      [], // validation data - keep as empty array
      async (err, result) => {
        if (err) {
          console.error('Error signing up:', err); 
          reject(err);
          return;
        }
        console.log('Cognito user created successfully:', result?.user.getUsername());
        try {
          console.log('Storing user in DynamoDB...');
          const response = await fetch(`${AUTH_API_URL}/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          resolve(result?.user.getUsername() || '');
        } catch (error) {
          console.error('Failed to store user:', error);
          resolve(result?.user.getUsername() || '');
        }
      }
    );
  });
};

export const verifyEmail = (email: string, code: string): Promise<boolean> => {
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool
  });

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(true);
    });
  });
};

export const resendVerificationCode = (email: string): Promise<void> => {
  const cognitoUser = new CognitoUser({
    Username: email,
    Pool: userPool
  });

  return new Promise((resolve, reject) => {
    cognitoUser.resendConfirmationCode((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
};

export const signIn = async (email: string, password: string): Promise<string> => {
  const user = new CognitoUser({ Username: email, Pool: userPool });
  const authDetails = new AuthenticationDetails({ Username: email, Password: password });

  return new Promise((resolve, reject) => {
    user.authenticateUser(authDetails, {
      onSuccess: async (session) => {
        try {
          // Record login in DynamoDB
          await fetch(`${AUTH_API_URL}/update-login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
          });
          
          resolve(session.getIdToken().getJwtToken());
        } catch (error) {
          console.error('Failed to record login:', error);
          // Still resolve with token even if DB update fails
          resolve(session.getIdToken().getJwtToken());
        }
      },
      onFailure: (err) => {
        reject(err);
      },
    });
  });
};
