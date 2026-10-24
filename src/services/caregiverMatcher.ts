import {
  CaregiverMatchRequest,
  CaregiverMatchResponse,
  CaregiverMatchResult,
  CaregiverProfile
} from '../types/index.ts';
import defaultCaregivers from '../data/caregivers.json' with { type: 'json' };

export const SCORING_WEIGHTS = {
  skillFitMax: 40,
  availabilityFitMax: 25,
  areaFitMax: 20,
  languageFitMax: 15
};

export function matchCaregivers(
  request: CaregiverMatchRequest,
  profiles: CaregiverProfile[] = defaultCaregivers as CaregiverProfile[]
): CaregiverMatchResponse {
  const disclaimer =
    'Caregiver profiles shown are fictional prototype examples. All listed providers are non-clinical support aides, companions, and home assistants—not doctors or registered nurses. Never rely on non-clinical caregivers for emergency medical management.';

  // SAFETY HARD GATE: Emergency cases bypass this module completely!
  if (request.urgencyLevel === 'EMERGENCY') {
    return {
      allowedToMatch: false,
      blockReason:
        'Caregiver matching is strictly disabled for emergency conditions. Active emergencies require emergency medical responders (112 / ambulance), not non-clinical caregivers.',
      totalEligible: 0,
      matches: [],
      explanationNotes: 'Emergency protocol active. Directing all resources to immediate emergency response.',
      disclaimer
    };
  }

  const results: CaregiverMatchResult[] = [];

  for (const caregiver of profiles) {
    const matchReasons: string[] = [];

    // Step 1: Eligibility check (Filter eligibility first)
    // Non-clinical scope check
    if (!caregiver.verified_status) {
      results.push({
        caregiver,
        scoreBreakdown: { skillFit: 0, availabilityFit: 0, areaFit: 0, languageFit: 0, totalScore: 0 },
        matchReasons: [],
        eligibilityPassed: false,
        ineligibilityReason: 'Caregiver credential verification is incomplete.'
      });
      continue;
    }

    // Step 2: Calculate Explainable Score
    // A. Skill Fit (Max 40 points)
    let skillFit = 0;
    if (request.requiredSkills && request.requiredSkills.length > 0) {
      const matchedSkills = caregiver.skills.filter(s =>
        request.requiredSkills.includes(s)
      );
      const ratio = matchedSkills.length / request.requiredSkills.length;
      skillFit = Math.round(ratio * SCORING_WEIGHTS.skillFitMax);
      if (matchedSkills.length > 0) {
        matchReasons.push(`Matches ${matchedSkills.length} requested core skill(s)`);
      }
    } else {
      // General match
      skillFit = 30;
      matchReasons.push('General home support and assistance capability');
    }

    // B. Availability Fit (Max 25 points)
    let availabilityFit = 0;
    if (request.preferredAvailability) {
      if (caregiver.availability === request.preferredAvailability || caregiver.availability === 'flexible') {
        availabilityFit = SCORING_WEIGHTS.availabilityFitMax;
        matchReasons.push(`Matches requested schedule: ${caregiver.availability}`);
      } else if (caregiver.availability === 'immediate') {
        availabilityFit = 20;
        matchReasons.push('Offers immediate on-call availability');
      } else {
        availabilityFit = 10;
      }
    } else {
      availabilityFit = 20;
    }

    // C. Area Fit (Max 20 points)
    let areaFit = 0;
    if (request.preferredArea) {
      const reqAreaNorm = request.preferredArea.toLowerCase();
      const cgAreaNorm = caregiver.service_area.toLowerCase();
      if (cgAreaNorm.includes(reqAreaNorm) || reqAreaNorm.includes(cgAreaNorm.split('/')[0].trim().toLowerCase())) {
        areaFit = SCORING_WEIGHTS.areaFitMax;
        matchReasons.push(`Servicing your target locality (${caregiver.service_area})`);
      } else {
        areaFit = 8;
      }
    } else {
      areaFit = 15;
    }

    // D. Language Fit (Max 15 points)
    let languageFit = 0;
    if (request.preferredLanguage) {
      const hasLang = caregiver.languages.some(
        l => l.toLowerCase() === request.preferredLanguage?.toLowerCase()
      );
      if (hasLang) {
        languageFit = SCORING_WEIGHTS.languageFitMax;
        matchReasons.push(`Fluent in ${request.preferredLanguage}`);
      } else {
        languageFit = 5;
      }
    } else {
      languageFit = 12;
    }

    const totalScore = Math.min(100, skillFit + availabilityFit + areaFit + languageFit);

    results.push({
      caregiver,
      scoreBreakdown: {
        skillFit,
        availabilityFit,
        areaFit,
        languageFit,
        totalScore
      },
      matchReasons,
      eligibilityPassed: true
    });
  }

  // Filter only eligible, then rank by totalScore descending
  const eligibleMatches = results
    .filter(r => r.eligibilityPassed)
    .sort((a, b) => b.scoreBreakdown.totalScore - a.scoreBreakdown.totalScore);

  return {
    allowedToMatch: true,
    totalEligible: eligibleMatches.length,
    matches: eligibleMatches,
    explanationNotes:
      'Matches ranked using a transparent, explainable formula: Skill fit (40%), Availability (25%), Service area (20%), and Language compatibility (15%).',
    disclaimer
  };
}
