const axios = require('axios');
const fs = require('fs');
const path = require('path');
const config = require('../config');

/**
 * Run validation for every JSON payload in the data directories.
 * Calls the validation API for each payload.
 *
 * @param {string} token - Bearer token for auth
 * @returns {Array} Array of validation results
 */
async function validateAllPayloads(token) {
  if (!config.validation.apiUrl) {
    console.warn('[Validator] No VALIDATION_API_URL configured — skipping validation.');
    console.warn('[Validator] Set VALIDATION_API_URL in .env when the endpoint is available.');
    return [];
  }

  const results = [];

  // Collect all JSON files from both data directories
  const jsonFiles = [];

  // byDeployment JSONs
  if (fs.existsSync(config.paths.byDeployment)) {
    const files = fs.readdirSync(config.paths.byDeployment).filter(f => f.endsWith('.json'));
    files.forEach(f => jsonFiles.push(path.join(config.paths.byDeployment, f)));
  }

  // product-hierarchy JSONs
  if (fs.existsSync(config.paths.productHierarchy)) {
    const files = fs.readdirSync(config.paths.productHierarchy).filter(f => f.endsWith('.json'));
    files.forEach(f => jsonFiles.push(path.join(config.paths.productHierarchy, f)));
  }

  if (jsonFiles.length === 0) {
    console.warn('[Validator] No JSON files found to validate.');
    return [];
  }

  console.log(`[Validator] Validating ${jsonFiles.length} JSON payload(s)...`);

  for (const filePath of jsonFiles) {
    const fileName = path.basename(filePath);
    console.log(`[Validator] Validating: ${fileName}`);

    try {
      const payload = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

      const response = await axios.post(config.validation.apiUrl, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log(`[Validator] ${fileName} — Status: ${response.status}`);
      results.push({
        file: fileName,
        status: 'success',
        httpStatus: response.status,
        data: response.data,
      });
    } catch (err) {
      const status = err.response?.status || 'N/A';
      const message = err.response?.data || err.message;
      console.error(`[Validator] ${fileName} — FAILED (${status}):`, message);
      results.push({
        file: fileName,
        status: 'failed',
        httpStatus: status,
        error: message,
      });
    }
  }

  return results;
}

module.exports = { validateAllPayloads };
