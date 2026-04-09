const axios = require('axios');
const config = require('../config');

/**
 * Poll the transform status endpoint until the job completes or times out.
 * @param {string} jobId - The transform job ID
 * @param {string} token - Bearer token for auth
 * @returns {object} Final status response data
 */
async function pollForCompletion(jobId, token) {
  const url = `${config.transformApi.baseUrl}/api/v1/backward-comp/transform/status/${jobId}`;
  const interval = config.polling.intervalMs;
  const timeout = config.polling.timeoutMs;

  console.log(`[Poller] Polling ${url}`);
  console.log(`[Poller] Interval: ${interval / 1000}s, Timeout: ${timeout / 1000}s`);

  const startTime = Date.now();
  let attempt = 0;

  while (true) {
    attempt++;
    const elapsed = Date.now() - startTime;

    if (elapsed >= timeout) {
      throw new Error(`[Poller] Timed out after ${timeout / 1000}s (${attempt} attempts)`);
    }

    try {
      console.log(`[Poller] Attempt #${attempt} (${Math.round(elapsed / 1000)}s elapsed)...`);

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = response.data;
      const status = data.status || data.state || data.jobStatus;

      console.log(`[Poller] Status: ${status}`);

      // Check for completion states
      if (status === 'COMPLETED' || status === 'completed' || status === 'SUCCESS' || status === 'success') {
        console.log('[Poller] Job completed successfully!');
        return data;
      }

      if (status === 'FAILED' || status === 'failed' || status === 'ERROR' || status === 'error') {
        console.error('[Poller] Job failed:', JSON.stringify(data, null, 2));
        throw new Error(`[Poller] Job failed with status: ${status}`);
      }

      // Still in progress — wait and retry
      console.log(`[Poller] Job still in progress. Waiting ${interval / 1000}s...`);
    } catch (err) {
      if (err.message.startsWith('[Poller]')) throw err;
      console.error(`[Poller] Request error on attempt #${attempt}:`, err.message);
    }

    await sleep(interval);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { pollForCompletion };
