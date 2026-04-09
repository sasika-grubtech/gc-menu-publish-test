const axios = require('axios');
const config = require('../config');

let cachedToken = null;
let tokenExpiresAt = 0;

/**
 * Authenticate with AWS Cognito using USER_PASSWORD_AUTH flow.
 * Returns the IdToken for use as Bearer token in API calls.
 */
async function getToken() {
  // Return cached token if still valid (with 60s buffer)
  if (cachedToken && Date.now() < tokenExpiresAt - 60000) {
    console.log('[Auth] Using cached token');
    return cachedToken;
  }

  console.log('[Auth] Requesting new Cognito token...');

  const url = `https://cognito-idp.${config.cognito.region}.amazonaws.com/`;

  const response = await axios.post(url, {
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: config.cognito.username,
      PASSWORD: config.cognito.password,
    },
    ClientId: config.cognito.clientId,
    UserPoolId: config.cognito.userPoolId,
  }, {
    headers: {
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      'Content-Type': 'application/x-amz-json-1.1',
    },
  });

  const result = response.data.AuthenticationResult;
  if (!result || !result.IdToken) {
    throw new Error('[Auth] No IdToken in Cognito response');
  }

  cachedToken = result.IdToken;
  // ExpiresIn is in seconds
  tokenExpiresAt = Date.now() + (result.ExpiresIn || 3600) * 1000;

  console.log('[Auth] Token obtained successfully (expires in %ds)', result.ExpiresIn || 3600);
  return cachedToken;
}

/**
 * Get the AccessToken (used by some APIs like the transform endpoint).
 */
async function getAccessToken() {
  console.log('[Auth] Requesting Cognito AccessToken...');

  const url = `https://cognito-idp.${config.cognito.region}.amazonaws.com/`;

  const response = await axios.post(url, {
    AuthFlow: 'USER_PASSWORD_AUTH',
    AuthParameters: {
      USERNAME: config.cognito.username,
      PASSWORD: config.cognito.password,
    },
    ClientId: config.cognito.clientId,
    UserPoolId: config.cognito.userPoolId,
  }, {
    headers: {
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      'Content-Type': 'application/x-amz-json-1.1',
    },
  });

  const result = response.data.AuthenticationResult;
  if (!result || !result.AccessToken) {
    throw new Error('[Auth] No AccessToken in Cognito response');
  }

  console.log('[Auth] AccessToken obtained successfully');
  return result.AccessToken;
}

function clearCache() {
  cachedToken = null;
  tokenExpiresAt = 0;
}

module.exports = { getToken, getAccessToken, clearCache };
