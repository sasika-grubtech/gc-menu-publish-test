const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  cognito: {
    region: process.env.COGNITO_REGION,
    clientId: process.env.COGNITO_CLIENT_ID,
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    username: process.env.COGNITO_USERNAME,
    password: process.env.COGNITO_PASSWORD,
  },
  mockServer: {
    port: parseInt(process.env.MOCK_SERVER_PORT, 10) || 3000,
  },
  scenario: process.env.SCENARIO || '',
  transformApi: {
    baseUrl: process.env.TRANSFORM_API_BASE,
  },
  menuMatApi: {
    baseUrl: process.env.MENU_MAT_API_BASE,
  },
  deployment: {
    partnerId: process.env.PARTNER_ID,
    brandId: process.env.BRAND_ID,
    locationId: process.env.LOCATION_ID,
    aggregatorId: process.env.AGGREGATOR_ID,
    serviceMode: process.env.SERVICE_MODE || 'ALL',
    targetBrandId: process.env.TARGET_BRAND_ID,
  },
  polling: {
    intervalMs: parseInt(process.env.POLL_INTERVAL_MS, 10) || 10000,
    timeoutMs: parseInt(process.env.POLL_TIMEOUT_MS, 10) || 600000,
  },
  validation: {
    apiUrl: process.env.VALIDATION_API_URL,
  },
  paths: {
    dataDir: path.resolve(__dirname, '../../data'),
    byDeployment: path.resolve(__dirname, '../../data/byDeployment'),
    productHierarchy: path.resolve(__dirname, '../../data/product-hierarchy'),
  },
};

module.exports = config;
