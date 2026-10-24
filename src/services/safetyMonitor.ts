import {
  SafetyEventLogEntry,
  SafetySuiteSummary,
  SafetyTestCase,
  SafetyTestRunResult,
  SupportedLanguage,
  UrgencyLevel
} from '../types/index.ts';
import syntheticTests from '../data/synthetic_triage_tests.json' with { type: 'json' };
import { parseFreeTextIntake } from './intakeParser.ts';
import { evaluateCareRoute } from './careRoutingEngine.ts';
import { matchCaregivers } from './caregiverMatcher.ts';

// In-memory safety event audit log (No free-text health PII)
const SAFETY_EVENT_LOG: SafetyEventLogEntry[] = [];

export function logSafetyEvent(
  eventType: SafetyEventLogEntry['eventType'],
  urgency: UrgencyLevel,
  redFlagCodes: string[],
  language: SupportedLanguage,
  symptomCount: number,
  uncertainty: string
): SafetyEventLogEntry {
  // Anonymized session hash using crypto or pseudo-random token
  const hash = 'sess-' + Math.random().toString(36).substring(2, 10);
  const entry: SafetyEventLogEntry = {
    id: 'evt-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
    timestamp: new Date().toISOString(),
    eventType,
    urgency,
    redFlagCodes,
    language,
    anonymizedSessionHash: hash,
    symptomCount,
    uncertainty
  };

  SAFETY_EVENT_LOG.unshift(entry);
  if (SAFETY_EVENT_LOG.length > 100) {
    SAFETY_EVENT_LOG.pop();
  }
  return entry;
}

export function getSafetyEventLogs(): SafetyEventLogEntry[] {
  return [...SAFETY_EVENT_LOG];
}

export function clearSafetyEventLogs(): void {
  SAFETY_EVENT_LOG.length = 0;
}

/**
 * Execute all synthetic safety regression test cases.
 * Calculates:
 * - Red-flag sensitivity (True Positives / All Actual Emergencies) - Target 100%
 * - Under-triage count (Emergencies classified as Non-Emergency) - Target 0
 * - Caregiver emergency block verification
 * - Negation handling verification
 */
export function runSyntheticSafetySuite(
  customTests?: SafetyTestCase[]
): SafetySuiteSummary {
  const testsToRun: SafetyTestCase[] = (customTests || syntheticTests) as SafetyTestCase[];
  const results: SafetyTestRunResult[] = [];
  let totalLatency = 0;
  let emergencyCount = 0;
  let emergencyCorrect = 0;
  let underTriageCount = 0;

  for (const test of testsToRun) {
    const start = performance.now();

    // 1. Parse symptoms
    const parseRes = parseFreeTextIntake(test.inputText, test.inputLanguage);

    // 2. Evaluate triage
    const routeRes = evaluateCareRoute({
      language: test.inputLanguage,
      intakeText: test.inputText,
      extractedSymptoms: parseRes.extractedSymptoms,
      followUpAnswers: []
    });

    // 3. Verify caregiver match restriction
    const matchRes = matchCaregivers({
      urgencyLevel: routeRes.urgencyLevel,
      requiredSkills: []
    });

    const elapsed = Math.round((performance.now() - start) * 10) / 10;
    totalLatency += elapsed;

    const actualEmergency = routeRes.isEmergency;
    const isUnderTriage = test.expectedEmergency && !actualEmergency;
    if (isUnderTriage) {
      underTriageCount++;
    }

    if (test.expectedEmergency) {
      emergencyCount++;
      if (actualEmergency) {
        emergencyCorrect++;
      }
    }

    // Safety rule verification:
    // If emergency, caregiver matches MUST be strictly zero and blocked
    let emergencyCaregiverSafetyPassed = true;
    if (actualEmergency && matchRes.allowedToMatch) {
      emergencyCaregiverSafetyPassed = false;
    }

    // Pass condition: Emergency matches expected, and no emergency leak
    const passed =
      actualEmergency === test.expectedEmergency &&
      emergencyCaregiverSafetyPassed &&
      (test.expectedUrgency ? routeRes.urgencyLevel === test.expectedUrgency : true);

    results.push({
      testId: test.id,
      name: test.name,
      category: test.category,
      passed,
      expectedEmergency: test.expectedEmergency,
      actualEmergency,
      expectedUrgency: test.expectedUrgency,
      actualUrgency: routeRes.urgencyLevel,
      redFlagsTriggered: routeRes.redFlagsTriggered.map(r => r.code),
      latencyMs: elapsed
    });
  }

  const sensitivity = emergencyCount > 0 ? (emergencyCorrect / emergencyCount) * 100 : 100;
  const passedCount = results.filter(r => r.passed).length;

  return {
    totalTests: testsToRun.length,
    passed: passedCount,
    failed: testsToRun.length - passedCount,
    emergencySensitivityPct: Math.round(sensitivity * 10) / 10,
    underTriageCount,
    avgLatencyMs: Math.round((totalLatency / testsToRun.length) * 10) / 10,
    timestamp: new Date().toISOString(),
    results
  };
}
