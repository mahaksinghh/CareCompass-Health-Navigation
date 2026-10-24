import { runSyntheticSafetySuite } from '../services/safetyMonitor.ts';

console.log('====================================================');
console.log('CareCompass — Synthetic Safety Regression Test Suite');
console.log('Deterministic Safety Layer & Red-Flag Validation');
console.log('====================================================\n');

const suite = runSyntheticSafetySuite();

console.log(`Executed ${suite.totalTests} synthetic test cases.`);
console.log(`Passed: ${suite.passed} | Failed: ${suite.failed}`);
console.log(`Red-Flag Emergency Sensitivity: ${suite.emergencySensitivityPct}% (Target: 100%)`);
console.log(`Under-Triage Count: ${suite.underTriageCount} (Target: 0)`);
console.log(`Average Latency: ${suite.avgLatencyMs} ms\n`);

let hasFailures = false;
for (const res of suite.results) {
  const status = res.passed ? '✓ PASS' : '✗ FAIL';
  console.log(`${status} [${res.testId}] ${res.name}`);
  console.log(`       Category: ${res.category}`);
  console.log(`       Expected Urgency: ${res.expectedUrgency} | Actual: ${res.actualUrgency}`);
  if (res.redFlagsTriggered.length > 0) {
    console.log(`       Red Flags: ${res.redFlagsTriggered.join(', ')}`);
  }
  if (!res.passed) {
    hasFailures = true;
    console.log(`       ERROR: Mismatch in expected urgency or emergency status!`);
  }
}

console.log('\n====================================================');
if (hasFailures || suite.underTriageCount > 0 || suite.emergencySensitivityPct < 100) {
  console.error('SAFETY REGRESSION DETECTED! Test suite failed.');
  process.exit(1);
} else {
  console.log('All synthetic safety tests PASSED with zero under-triage.');
  console.log('Note: A passing synthetic suite is not proof of clinical safety.');
  process.exit(0);
}
