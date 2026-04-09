const express = require('express');
const fs = require('fs');
const path = require('path');
const config = require('../config');

/**
 * Find all .json files recursively in a directory.
 */
function findJsonFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findJsonFiles(fullPath));
    } else if (entry.name.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Get the scenario directory for a given base path.
 * Structure: data/<type>/<scenario>/*.json
 * Uses activeScenario (mutable) so runner can switch scenarios at runtime.
 */
let activeScenario = config.scenario || '';

function setActiveScenario(scenario) {
  activeScenario = scenario;
  console.log(`[Mock] Active scenario set to: "${scenario}"`);
}

function getScenarioDir(baseDir) {
  if (activeScenario) {
    return path.join(baseDir, activeScenario);
  }
  // No scenario set — find the first scenario subfolder
  if (!fs.existsSync(baseDir)) return baseDir;
  const dirs = fs.readdirSync(baseDir, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
  if (dirs.length > 0) {
    console.log(`[Mock] No SCENARIO set, using first: "${dirs[0]}"`);
    return path.join(baseDir, dirs[0]);
  }
  return baseDir;
}

function createMockServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));

  // ── Request logger ──
  app.use((req, res, next) => {
    console.log(`[Mock] ${req.method} ${req.url}`);
    next();
  });

  // ── Serve data files directly via GET (for browser testing) ──
  app.use('/data', express.static(config.paths.dataDir));

  // ─────────────────────────────────────────────────────────
  // 1. ByDeploymentCombinationId endpoint
  //    POST /gc3-menu-mat-reader/menu/byPartner/:partnerId/byDeploymentCombinationId
  // ─────────────────────────────────────────────────────────
  app.post(
    '/gc3-menu-mat-reader/menu/byPartner/:partnerId/byDeploymentCombinationId',
    (req, res) => {
      const { partnerId } = req.params;
      console.log(`[Mock] byDeploymentCombinationId — partnerId=${partnerId}`);
      console.log('[Mock] Request body:', JSON.stringify(req.body, null, 2));

      const dir = getScenarioDir(config.paths.byDeployment);
      console.log(`[Mock] Looking in: ${dir}`);

      const files = findJsonFiles(dir);
      if (files.length === 0) {
        console.error(`[Mock] No JSON files found in ${dir}`);
        return res.status(404).json({ error: 'No byDeployment JSON files found' });
      }

      const filePath = files[0];
      console.log(`[Mock] Serving: ${filePath}`);
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      return res.json(data);
    }
  );

  // ─────────────────────────────────────────────────────────
  // 2. Product Hierarchy endpoint
  //    POST /gc3-menu-mat-reader/menu/byPartner/:partnerId/product-hierarchy
  //    Returns JSON based on category — serves multiple JSONs
  // ─────────────────────────────────────────────────────────
  app.post(
    '/gc3-menu-mat-reader/menu/byPartner/:partnerId/product-hierarchy',
    (req, res) => {
      const { partnerId } = req.params;
      console.log(`[Mock] product-hierarchy — partnerId=${partnerId}`);
      console.log('[Mock] Request body:', JSON.stringify(req.body, null, 2));

      const dir = getScenarioDir(config.paths.productHierarchy);
      console.log(`[Mock] Looking in: ${dir}`);

      const files = findJsonFiles(dir);
      if (files.length === 0) {
        console.error(`[Mock] No JSON files found in ${dir}`);
        return res.status(404).json({ error: 'No product-hierarchy JSON files found' });
      }

      if (files.length === 1) {
        console.log(`[Mock] Serving single file: ${files[0]}`);
        const data = JSON.parse(fs.readFileSync(files[0], 'utf-8'));
        return res.json(data);
      }

      // Multiple files — combine all into one response
      console.log(`[Mock] Found ${files.length} product-hierarchy files, combining...`);
      const combined = files.map(f => {
        console.log(`[Mock]   - ${path.basename(f)}`);
        return JSON.parse(fs.readFileSync(f, 'utf-8'));
      });

      const isArray = Array.isArray(combined[0]);
      const result = isArray ? combined.flat() : combined;
      return res.json(result);
    }
  );

  // ── Catch-all ──
  app.use((req, res) => {
    console.log(`[Mock] 404 — No handler for ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Not found' });
  });

  return app;
}

function startMockServer() {
  return new Promise((resolve) => {
    const app = createMockServer();
    const port = config.mockServer.port;
    const server = app.listen(port, () => {
      console.log(`[Mock] Server started on http://localhost:${port}`);
      resolve(server);
    });
  });
}

module.exports = { createMockServer, startMockServer, setActiveScenario };
