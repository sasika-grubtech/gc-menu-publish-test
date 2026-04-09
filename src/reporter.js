const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

const SYMBOLS = {
  pass: process.platform === 'win32' ? '√' : '✓',
  fail: process.platform === 'win32' ? '×' : '✗',
  pending: process.platform === 'win32' ? '-' : '○',
};

class TestReporter {
  constructor() {
    this.suites = [];
    this.currentSuite = null;
    this.startTime = null;
  }

  startRun() {
    this.startTime = Date.now();
    console.log('');
  }

  startSuite(name) {
    this.currentSuite = {
      name,
      tests: [],
      startTime: Date.now(),
    };
    console.log(`\n  ${COLORS.bold}${name}${COLORS.reset}`);
  }

  pass(testName, durationMs) {
    const test = { name: testName, status: 'passed', duration: durationMs };
    this.currentSuite.tests.push(test);
    const dur = durationMs > 1000
      ? `${COLORS.red}(${Math.round(durationMs / 1000)}s)${COLORS.reset}`
      : durationMs > 200
        ? `${COLORS.yellow}(${durationMs}ms)${COLORS.reset}`
        : `${COLORS.dim}(${durationMs}ms)${COLORS.reset}`;
    console.log(`    ${COLORS.green}${SYMBOLS.pass}${COLORS.reset} ${testName} ${dur}`);
  }

  fail(testName, error, durationMs) {
    const test = { name: testName, status: 'failed', duration: durationMs, error };
    this.currentSuite.tests.push(test);
    console.log(`    ${COLORS.red}${SYMBOLS.fail} ${testName}${COLORS.reset}`);
  }

  skip(testName, reason) {
    const test = { name: testName, status: 'skipped', reason };
    this.currentSuite.tests.push(test);
    console.log(`    ${COLORS.cyan}${SYMBOLS.pending} ${testName}${COLORS.reset}${reason ? ` (${reason})` : ''}`);
  }

  endSuite() {
    this.currentSuite.duration = Date.now() - this.currentSuite.startTime;
    this.suites.push(this.currentSuite);
    this.currentSuite = null;
  }

  printSummary() {
    const totalDuration = Date.now() - this.startTime;
    const allTests = this.suites.flatMap(s => s.tests);
    const passed = allTests.filter(t => t.status === 'passed');
    const failed = allTests.filter(t => t.status === 'failed');
    const skipped = allTests.filter(t => t.status === 'skipped');

    console.log('\n');
    console.log(`  ${COLORS.green}${passed.length} passing${COLORS.reset} ${COLORS.dim}(${formatDuration(totalDuration)})${COLORS.reset}`);
    if (failed.length > 0) {
      console.log(`  ${COLORS.red}${failed.length} failing${COLORS.reset}`);
    }
    if (skipped.length > 0) {
      console.log(`  ${COLORS.cyan}${skipped.length} pending${COLORS.reset}`);
    }

    // Print failure details
    if (failed.length > 0) {
      console.log('');
      failed.forEach((t, i) => {
        const suite = this.suites.find(s => s.tests.includes(t));
        console.log(`  ${i + 1}) ${suite.name}`);
        console.log(`       ${t.name}:`);
        console.log(`     ${COLORS.red}${t.error}${COLORS.reset}`);
        console.log('');
      });
    }

    // Suite summary
    console.log(`\n  ${COLORS.bold}Suite Results:${COLORS.reset}`);
    for (const suite of this.suites) {
      const sp = suite.tests.filter(t => t.status === 'passed').length;
      const sf = suite.tests.filter(t => t.status === 'failed').length;
      const icon = sf > 0 ? `${COLORS.red}${SYMBOLS.fail}` : `${COLORS.green}${SYMBOLS.pass}`;
      const status = sf > 0 ? 'FAIL' : 'PASS';
      const color = sf > 0 ? COLORS.red : COLORS.green;
      console.log(`    ${icon} ${color}${status}${COLORS.reset} ${suite.name} ${COLORS.dim}(${sp}/${suite.tests.length} passed, ${formatDuration(suite.duration)})${COLORS.reset}`);
    }

    const overallPass = failed.length === 0;
    console.log('');
    console.log(`  ${COLORS.bold}Overall: ${overallPass ? `${COLORS.green}PASS` : `${COLORS.red}FAIL`}${COLORS.reset} ${COLORS.dim}(${this.suites.length} scenarios, ${allTests.length} tests)${COLORS.reset}`);
    console.log('');

    return overallPass;
  }
}

function formatDuration(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const min = Math.floor(ms / 60000);
  const sec = Math.round((ms % 60000) / 1000);
  return `${min}m ${sec}s`;
}

module.exports = { TestReporter, COLORS, SYMBOLS };
