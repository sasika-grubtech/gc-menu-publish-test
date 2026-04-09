const axios = require('axios');
const config = require('../config');

/**
 * Trigger the backward-comp transform API.
 * Returns the job/transform ID from the response.
 */
async function triggerTransform(token) {
  const url = `${config.transformApi.baseUrl}/api/v1/backward-comp/transform`;

  console.log('[Transform] Triggering transform...');
  console.log('[Transform] URL:', url);

  const body = {
    deploymentContext: {
      partnerId: config.deployment.partnerId,
      brandId: config.deployment.brandId,
      locationId: config.deployment.locationId,
      aggregatorId: config.deployment.aggregatorId,
      serviceMode: config.deployment.serviceMode,
    },
    targetBrandId: config.deployment.targetBrandId,
    cleanUpAfterTransform: 'true',
  };

  console.log('[Transform] Payload:', JSON.stringify(body, null, 2));

  const response = await axios.post(url, body, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  console.log('[Transform] Response status:', response.status);
  console.log('[Transform] Response data:', JSON.stringify(response.data, null, 2));

  // Extract job ID from response — adapt to actual response shape
  const jobId = response.data.id || response.data.jobId || response.data.transformId;
  if (!jobId) {
    console.warn('[Transform] Could not extract job ID from response. Full response:', response.data);
    return response.data;
  }

  console.log('[Transform] Job ID:', jobId);
  return jobId;
}

module.exports = { triggerTransform };
