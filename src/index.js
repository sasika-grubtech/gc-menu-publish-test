const fs = require('fs');
const path = require('path');
const { startMockServer, setActiveScenario } = require('./mock-server/server');
const { getToken, getAccessToken } = require('./services/auth');
const { triggerTransform } = require('./services/transform');
const { pollForCompletion } = require('./services/poller');
const { validateAllPayloads } = require('./services/validator');
const { TestReporter } = require('./reporter');
const config = require('./config');

/**
 * Discover all scenario folders under data/byDeployment/.
 * Each subfolder name (e.g. s1, s2) is a scenario.
 */
function discoverScenarios() {
  const baseDir = config.paths.byDeployment;
  if (!fs.existsSync(baseDir)) return [];
  return fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
}

/**
 * Run a single scenario through the full transform + validation pipeline.
 */
async function runScenario(scenario, reporter, tokens) {
  reporter.startSuite(`Scenario: ${scenario}`);

  // Switch mock server to this scenario
  setActiveScenario(scenario);

  // ── Assert: data files exist ──
  let t0 = Date.now();
  const deployDir = path.join(config.paths.byDeployment, scenario);
  const hierDir = path.join(config.paths.productHierarchy, scenario);
  const hasDeployFiles = fs.existsSync(deployDir) &&
    fs.readdirSync(deployDir).some(f => f.endsWith('.json'));
  const hasHierFiles = fs.existsSync(hierDir) &&
    fs.readdirSync(hierDir).some(f => f.endsWith('.json'));

  if (!hasDeployFiles) {
    reporter.fail('Data files exist', `No JSON files in ${deployDir}`, Date.now() - t0);
    reporter.endSuite();
    return;
  }
  reporter.pass('byDeployment data files exist', Date.now() - t0);

  if (!hasHierFiles) {
    reporter.skip('product-hierarchy data files exist', 'directory empty or missing');
  } else {
    reporter.pass('product-hierarchy data files exist', Date.now() - t0);
  }

  // ── Assert: trigger transform ──
  let jobId;
  t0 = Date.now();
  try {
    jobId = await triggerTransform(tokens.accessToken);
    if (!jobId) throw new Error('No job ID returned');
    reporter.pass(`Transform triggered (jobId: ${jobId})`, Date.now() - t0);
  } catch (err) {
    const msg = err.response
      ? `HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`
      : err.message;
    reporter.fail('Transform triggered', msg, Date.now() - t0);
    reporter.endSuite();
    return;
  }

  // ── Assert: job completes ──
  t0 = Date.now();
  try {
    const result = await pollForCompletion(jobId, tokens.accessToken);
    const status = result.status || result.state || result.jobStatus || 'COMPLETED';
    reporter.pass(`Job completed (status: ${status})`, Date.now() - t0);
  } catch (err) {
    reporter.fail('Job completed', err.message, Date.now() - t0);
    reporter.endSuite();
    return;
  }

  // ── Assert: validation ──
  t0 = Date.now();
  if (!config.validation.apiUrl) {
    reporter.skip('Validation', 'VALIDATION_API_URL not configured');
  } else {
    try {
      const results = await validateAllPayloads(tokens.idToken);
      const failed = results.filter(r => r.status === 'failed');
      if (failed.length > 0) {
        const details = failed.map(f => `${f.file}: ${f.error}`).join('; ');
        reporter.fail(`Validation (${failed.length}/${results.length} failed)`, details, Date.now() - t0);
      } else {
        reporter.pass(`Validation (${results.length} payloads)`, Date.now() - t0);
      }
    } catch (err) {
      reporter.fail('Validation', err.message, Date.now() - t0);
    }
  }

  reporter.endSuite();
}

async function main() {
  let mockServer = null;
  const reporter = new TestReporter();

  try {
    // ── Discover scenarios ──
    const scenarios = config.scenario
      ? [config.scenario]                 // Single scenario from SCENARIO env var
      : discoverScenarios();              // All scenario folders

    if (scenarios.length === 0) {
      console.error('No scenarios found in data/byDeployment/. Add scenario folders (e.g. s1/, s2/).');
      process.exitCode = 1;
      return;
    }

    console.log('');
    console.log('  GC3 Backward-Comp Transform Test');
    console.log(`  ${scenarios.length} scenario(s): ${scenarios.join(', ')}`);

    // ── Start mock server ──
    mockServer = await startMockServer();

    // ── Obtain tokens (once for all scenarios) ──
    console.log('');
    console.log('  Authenticating...');
    const idToken = await getToken();
    const accessToken = await getAccessToken();
    const tokens = { idToken, accessToken };
    console.log('  Tokens obtained.');

    // ── Run each scenario ──
    reporter.startRun();

    for (const scenario of scenarios) {
      await runScenario(scenario, reporter, tokens);
    }

    // ── Print summary ──
    const allPassed = reporter.printSummary();
    if (!allPassed) process.exitCode = 1;

  } catch (err) {
    console.error(`\n  Fatal: ${err.message}`);
    if (err.response) {
      console.error(`  Response: ${err.response.status} ${JSON.stringify(err.response.data)}`);
    }
    process.exitCode = 1;
  } finally {
    if (mockServer) {
      mockServer.close();
    }
  }
}

main();
