# GC3 Backward-Comp Transform Test Tool

A Node.js CLI tool that automates end-to-end testing of the GC3 backward-compatibility menu transform pipeline.

## What It Does

```
┌──────────────────────┐     ┌───────────────────────────────┐
│  Local Mock Server   │◄────│  Transform API calls back to  │
│  (Express, port 3000)│     │  fetch menu data from mock    │
│                      │     └───────────────────────────────┘
│  • byDeploymentCombo │              ▲
│  • product-hierarchy │              │
└──────────────────────┘              │
                                      │
┌──────────────────────┐     ┌────────┴──────────────────────┐
│  1. Get Cognito Token│────►│  2. POST /backward-comp/      │
│     (IdToken +       │     │     transform                 │
│      AccessToken)    │     │     → returns jobId           │
└──────────────────────┘     └────────┬──────────────────────┘
                                      │
                              ┌───────▼──────────────────────┐
                              │  3. Poll /transform/status/  │
                              │     {jobId} every 10s        │
                              │     (timeout: 10 min)        │
                              └───────┬──────────────────────┘
                                      │
                              ┌───────▼──────────────────────┐
                              │  4. Validate each JSON       │
                              │     payload via Validation   │
                              │     API                      │
                              └──────────────────────────────┘
```

**Flow:**
1. Starts an Express mock server that serves your JSON fixture files
2. Authenticates with AWS Cognito (`USER_PASSWORD_AUTH`)
3. Triggers the backward-comp transform API
4. Polls for job completion (every 10s, up to 10 minutes)
5. Runs validation on each JSON payload (when configured)
6. Prints a pass/fail summary

---

## Project Structure

```
├── .env                              # Credentials & config (not committed)
├── .github/
│   ├── agents/
│   │   └── gc3-transform.agent.md    # Copilot custom agent
│   └── workflows/
│       └── transform-test.yml        # GitHub Actions CI workflow
├── data/
│   ├── byDeployment/                 # Deployment combo JSONs
│   │   ├── s1/s1.json                #   Scenario 1
│   │   └── s2/s2.json                #   Scenario 2
│   └── product-hierarchy/            # Product hierarchy JSONs
│       ├── s1/s1.json                #   Scenario 1 (1+ files per category)
│       └── s2/s2.json                #   Scenario 2
├── src/
│   ├── index.js                      # Main orchestrator + scenario runner
│   ├── reporter.js                   # Mocha-style test reporter (pass/fail)
│   ├── config/
│   │   └── index.js                  # Config loader (.env → object)
│   ├── mock-server/
│   │   └── server.js                 # Express mock (2 endpoints, scenario-aware)
│   └── services/
│       ├── auth.js                   # Cognito token service
│       ├── transform.js              # Transform API client
│       ├── poller.js                 # Job status poller
│       └── validator.js              # Validation API client
├── package.json
└── package-lock.json
```

---

## Prerequisites

- **Node.js** 18 or later
- **npm** (comes with Node.js)
- AWS Cognito credentials (username, password, client ID, user pool ID)
- Network access to the Transform API (`api-gc3-backward-comp.staging.grubtech.io`)

---

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd publish
npm install
```

### 2. Configure Environment

Copy the example below into a `.env` file at the project root:

```env
# ── Cognito Authentication ──
COGNITO_REGION=eu-west-2
COGNITO_CLIENT_ID=2f71mdgg2d72e9g9tb6uu1j32b
COGNITO_USER_POOL_ID=eu-west-2_kd9oYEIWi
COGNITO_USERNAME=<your-email>
COGNITO_PASSWORD=<your-password>

# ── Mock Server ──
MOCK_SERVER_PORT=3000

# ── Transform API ──
TRANSFORM_API_BASE=https://api-gc3-backward-comp.staging.grubtech.io

# ── GC3 Menu Mat Reader (real API base) ──
MENU_MAT_API_BASE=https://internal-api.staging.grubtech.io

# ── Deployment Context ──
PARTNER_ID=6985648e83ce95679d1a6f9c
BRAND_ID=69859d5b83ce95679d1a6fbd
LOCATION_ID=69859f0bf252ce33bbbbd13f
AGGREGATOR_ID=glovo-food-aggregator
SERVICE_MODE=ALL
TARGET_BRAND_ID=699812c65a7aa36a3c1b7661

# ── Polling ──
POLL_INTERVAL_MS=10000
POLL_TIMEOUT_MS=600000

# ── Validation API (fill in when available) ──
VALIDATION_API_URL=
```

> **Note:** `.env` is in `.gitignore` — credentials are never committed.

### 3. Add JSON Data Files (Scenarios)

Data is organized into **scenario folders**. Each scenario has a matching folder under both `byDeployment/` and `product-hierarchy/`:

```
data/
  byDeployment/
    s1/                 ← Scenario 1
      s1.json           ← 1 deployment combo JSON
    s2/                 ← Scenario 2
      s2.json
  product-hierarchy/
    s1/                 ← Scenario 1 (paired with byDeployment/s1)
      s1.json           ← 1 or more product hierarchy JSONs per category
    s2/                 ← Scenario 2 (paired with byDeployment/s2)
      s2.json
```

**Key rule:** Scenarios are paired by folder name — `s1` in `byDeployment/` maps to `s1` in `product-hierarchy/`, `s2` maps to `s2`, and so on.

| Scenario | byDeployment source | product-hierarchy source |
|----------|--------------------|--------------------------|
| `s1` | `data/byDeployment/s1/*.json` | `data/product-hierarchy/s1/*.json` |
| `s2` | `data/byDeployment/s2/*.json` | `data/product-hierarchy/s2/*.json` |
| `sN` | `data/byDeployment/sN/*.json` | `data/product-hierarchy/sN/*.json` |

To add a new scenario, create matching folders in both directories and drop the JSON files in.

The mock server serves these files when the transform API calls back.

---

## Running

### Run All Scenarios

```bash
npm test
```

Auto-discovers all scenario folders (s1, s2, ...) and runs each one sequentially. Each scenario goes through: mock setup → transform → poll → validate. Results are reported in **Mocha-style** output with pass (√), fail (×), and pending (-) for each step.

### Run a Single Scenario

```bash
npm run test:s1     # Run only scenario s1
npm run test:s2     # Run only scenario s2
```

Or set `SCENARIO=s1` in `.env` and run `npm start`.

### Test Output (Mocha-style)

Each scenario runs as a test suite with assertions per step:

```
  GC3 Backward-Comp Transform Test
  2 scenario(s): s1, s2

  Authenticating...
  Tokens obtained.

  Scenario: s1
    √ byDeployment data files exist (2ms)
    √ product-hierarchy data files exist (1ms)
    √ Transform triggered (jobId: d5769359-1331-471a-a34d-71c7cd9eb594) (3s)
    √ Job completed (status: COMPLETED) (45s)
    - Validation (VALIDATION_API_URL not configured)

  Scenario: s2
    √ byDeployment data files exist (1ms)
    √ product-hierarchy data files exist (1ms)
    √ Transform triggered (jobId: a1b2c3d4-...) (2s)
    × Job completed


  7 passing (50.2s)
  1 failing
  1 pending

  1) Scenario: s2
       Job completed:
     [Poller] Timed out after 600s (60 attempts)


  Suite Results:
    √ PASS Scenario: s1 (4/5 passed, 48.0s)
    × FAIL Scenario: s2 (3/4 passed, 2.2s)

  Overall: FAIL (2 scenarios, 9 tests)
```

**Per-scenario assertions:**

| Step | Assertion | Passes when |
|------|-----------|-------------|
| 1 | `byDeployment data files exist` | `.json` files found in `data/byDeployment/<scenario>/` |
| 2 | `product-hierarchy data files exist` | `.json` files found (skipped if empty) |
| 3 | `Transform triggered` | POST returns a job ID |
| 4 | `Job completed` | Polling returns `COMPLETED` or `SUCCESS` |
| 5 | `Validation` | All payloads pass validation (skipped if URL not set) |

If a step fails, the remaining steps for that scenario are skipped and the runner moves to the next scenario.

**Exit code:** `0` if all scenarios pass, `1` if any fail — CI will catch failures.

### Mock Server Only

```bash
npm run mock
```

Starts the Express mock server on `localhost:3000` serving the active scenario's JSON files. Set `SCENARIO=s1` in `.env` to choose which scenario's data to serve. Useful for manual testing.

You can also browse JSON files directly in the browser:
- `http://localhost:3000/data/byDeployment/s1/s1.json`
- `http://localhost:3000/data/product-hierarchy/s1/s1.json`

### Test Cognito Auth Only

```bash
npm run auth
```

Fetches a Cognito token and prints the first 50 characters. Use to verify your credentials work.

---

## Mock Server Endpoints

The mock server exposes two endpoints that the transform API calls back into:

### 1. ByDeploymentCombinationId

```
POST /gc3-menu-mat-reader/menu/byPartner/:partnerId/byDeploymentCombinationId
Authorization: Bearer <token>
Content-Type: application/json

{
  "deploymentCombination": {
    "applicationId": "glovo-food-aggregator",
    "brandId": "69859d5b83ce95679d1a6fbd",
    "locationId": "69859f0bf252ce33bbbbd13f",
    "servingMode": "ALL"
  },
  "gc3MenuId": ""
}
```

**Response:** Serves the first `.json` file from `data/byDeployment/<active-scenario>/`.

### 2. Product Hierarchy

```
POST /gc3-menu-mat-reader/menu/byPartner/:partnerId/product-hierarchy
Authorization: Bearer <token>
Content-Type: application/json

{
  "menuId": { ... },
  "productIds": [ ... ]
}
```

**Response:** Serves all `.json` files from `data/product-hierarchy/<active-scenario>/` (merged into array if multiple files).

---

## API Reference

### Transform API

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/v1/backward-comp/transform` | AccessToken | Trigger GC2 menu generation |
| GET | `/api/v1/backward-comp/transform/status/{jobId}` | AccessToken | Check job completion |

**Transform Request Body:**
```json
{
  "deploymentContext": {
    "partnerId": "6985648e83ce95679d1a6f9c",
    "brandId": "69859d5b83ce95679d1a6fbd",
    "locationId": "69859f0bf252ce33bbbbd13f",
    "aggregatorId": "glovo-food-aggregator",
    "serviceMode": "ALL"
  },
  "targetBrandId": "699812c65a7aa36a3c1b7661",
  "cleanUpAfterTransform": "true"
}
```

### Cognito Auth

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `https://cognito-idp.eu-west-2.amazonaws.com/` | `InitiateAuth` (USER_PASSWORD_AUTH) |

Returns `IdToken` (for menu mat reader APIs) and `AccessToken` (for transform API).

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `COGNITO_REGION` | Yes | — | AWS region for Cognito (`eu-west-2`) |
| `COGNITO_CLIENT_ID` | Yes | — | Cognito app client ID |
| `COGNITO_USER_POOL_ID` | Yes | — | Cognito user pool ID |
| `COGNITO_USERNAME` | Yes | — | Cognito username (email) |
| `COGNITO_PASSWORD` | Yes | — | Cognito password |
| `MOCK_SERVER_PORT` | No | `3000` | Port for the local mock server |
| `TRANSFORM_API_BASE` | Yes | — | Base URL for transform API |
| `MENU_MAT_API_BASE` | Yes | — | Base URL for GC3 menu mat reader |
| `PARTNER_ID` | Yes | — | Partner ID for deployment context |
| `BRAND_ID` | Yes | — | Brand ID for deployment context |
| `LOCATION_ID` | Yes | — | Location ID for deployment context |
| `AGGREGATOR_ID` | Yes | — | Aggregator ID (e.g., `glovo-food-aggregator`) |
| `SERVICE_MODE` | No | `ALL` | Service mode |
| `TARGET_BRAND_ID` | Yes | — | Target brand ID for transform |
| `POLL_INTERVAL_MS` | No | `10000` | Poll interval in ms (10s) |
| `POLL_TIMEOUT_MS` | No | `600000` | Poll timeout in ms (10min) |
| `SCENARIO` | No | *(all)* | Run a specific scenario (e.g., `s1`). If empty, runs all. |
| `VALIDATION_API_URL` | No | — | Validation endpoint (skip if empty) |

---

## Running in GitHub Actions

The workflow runs manually via **workflow_dispatch**.

### Setup GitHub Secrets

Go to **Settings → Secrets and variables → Actions → New repository secret** and add:

| Secret | Value |
|--------|-------|
| `COGNITO_REGION` | `eu-west-2` |
| `COGNITO_CLIENT_ID` | Your client ID |
| `COGNITO_USER_POOL_ID` | Your user pool ID |
| `COGNITO_USERNAME` | Cognito email |
| `COGNITO_PASSWORD` | Cognito password |
| `TRANSFORM_API_BASE` | `https://api-gc3-backward-comp.staging.grubtech.io` |
| `MENU_MAT_API_BASE` | `https://internal-api.staging.grubtech.io` |
| `PARTNER_ID` | Partner ID |
| `BRAND_ID` | Brand ID |
| `LOCATION_ID` | Location ID |
| `AGGREGATOR_ID` | `glovo-food-aggregator` |
| `TARGET_BRAND_ID` | Target brand ID |
| `VALIDATION_API_URL` | *(leave empty if not available yet)* |

### Trigger the Workflow

1. Go to **Actions** tab in GitHub
2. Select **GC3 Backward-Comp Transform Test**
3. Click **Run workflow**
4. Choose environment (`staging` or `production`)
5. Click **Run workflow**

### What Happens in CI

1. Checks out the repo (including `data/` JSON fixtures)
2. Sets up Node.js 18, runs `npm ci`
3. Creates `.env` from GitHub Secrets
4. Verifies data files exist
5. Runs `npm start` (full flow)
6. Uploads logs as artifacts (retained 30 days)

**Timeout:** 20 minutes per run.

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| `Missing Bearer token` (401) | Check `COGNITO_USERNAME`/`COGNITO_PASSWORD` in `.env` |
| `No byDeployment JSON files found` | Add at least one `.json` to `data/byDeployment/` |
| `Timed out after 600s` | Increase `POLL_TIMEOUT_MS` or check transform API health |
| `No IdToken in Cognito response` | Verify `COGNITO_CLIENT_ID` and `COGNITO_USER_POOL_ID` |
| `EADDRINUSE port 3000` | Another process is using port 3000 — change `MOCK_SERVER_PORT` |
| Validation skipped | Set `VALIDATION_API_URL` in `.env` when the endpoint is ready |
| CI secrets not working | Ensure all secrets are added without extra spaces or newlines |
| JSON parse error at start of file | Remove hidden BOM/zero-width characters: open in hex editor, first byte should be `{` or `[` |
| `Password contains #` | Wrap the value in double quotes in `.env`: `COGNITO_PASSWORD="Test123#"` |
