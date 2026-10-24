import {
  CareType,
  FollowUpAnswer,
  SymptomMention,
  TriageEvaluationRequest,
  TriageEvaluationResponse,
  UrgencyLevel
} from '../types/index.ts';
import { evaluateRedFlags, RED_FLAG_ENGINE_VERSION } from './redFlagRules.ts';

export const CARE_ROUTING_ENGINE_VERSION = 'v1.2.0-deterministic';

export function evaluateCareRoute(request: TriageEvaluationRequest): TriageEvaluationResponse {
  const timestamp = new Date().toISOString();
  const baseDisclaimer =
    'CareCompass is a care-navigation prototype, not a medical diagnosis, treatment plan, or triage authority. If you suspect an emergency, immediately call local emergency services.';

  // 1. EVALUATE DETERMINISTIC RED-FLAG SAFETY LAYER FIRST
  const redFlagCheck = evaluateRedFlags(request.intakeText);

  // Also check if any follow-up question answer selected a red-flag option
  const followUpRedFlagAnswer = request.followUpAnswers?.find(
    ans => ans.selectedOptionValue === 'radiating_sweating' ||
           ans.selectedOptionValue === 'acute_cannot_speak' ||
           ans.selectedOptionValue === 'thunderclap_or_neuro' ||
           ans.selectedOptionValue === 'arterial_unstopped' ||
           ans.selectedOptionValue === 'sudden_paralysis'
  );

  if (redFlagCheck.hasEmergencyRedFlag || followUpRedFlagAnswer) {
    const combinedTriggers = [...redFlagCheck.triggers];
    if (followUpRedFlagAnswer && !redFlagCheck.hasEmergencyRedFlag) {
      combinedTriggers.push({
        code: 'RF-FOLLOWUP-ACUTE',
        category: 'ACUTE_FOLLOWUP_RED_FLAG',
        name: 'Critical Answer in Follow-Up Assessment',
        triggerPhraseOrConcept: followUpRedFlagAnswer.selectedOptionValue,
        clinicalRationale: 'User reported high-risk acute symptoms during targeted safety screening.',
        immediateInstruction: 'Immediate emergency medical assessment required. In India, call 112 immediately. If elsewhere, call your local emergency service.',
        disclaimer: baseDisclaimer
      });
    }

    return {
      status: 'EMERGENCY_TRIGGERED',
      urgencyLevel: 'EMERGENCY',
      careType: 'EMERGENCY_SERVICES',
      isEmergency: true,
      redFlagsTriggered: combinedTriggers,
      reasonCodes: combinedTriggers.map(t => t.code),
      userFacingExplanation:
        'Based on the details provided, your description contains critical red-flag signs that require immediate emergency medical attention. Caregiver matching has been paused because non-clinical support is not appropriate for active emergencies.',
      uncertaintyMessage:
        'Emergency protocol triggered conservatively. When potential life-threatening symptoms cannot be safely ruled out, immediate professional medical dispatch is the safest course of action.',
      uncertaintyLevel: 'LOW',
      timeframeRecommendation: 'Immediate (Within minutes — do not delay)',
      nextSteps: [
        'Call 112 (India) or your local emergency number immediately.',
        'Sit or lie down in a safe, comfortable position while awaiting responders.',
        'Do NOT drive yourself to the hospital.',
        'Unlock the front door so responders can enter easily.',
        'If a trained family member or neighbor is nearby, alert them right now.'
      ],
      engineVersion: `${CARE_ROUTING_ENGINE_VERSION}+${RED_FLAG_ENGINE_VERSION}`,
      disclaimer: baseDisclaimer,
      canOfferCaregivers: false,
      timestamp
    };
  }

  // 2. CHECK NON-EMERGENCY ROUTING
  const positiveSymptoms = (request.extractedSymptoms || []).filter(s => !s.isNegated);
  const reasonCodes: string[] = [];

  // Check for urgent in-person needs (e.g. gaping cuts needing stitches within hours)
  const hasWoundNeedingClosure =
    request.followUpAnswers?.some(a => a.selectedOptionValue === 'bleeding_stopped_gaping') ||
    positiveSymptoms.some(s => s.concept === 'wound_cut');

  if (hasWoundNeedingClosure) {
    reasonCodes.push('RC-URGENT-WOUND-EVALUATION');
    return {
      status: 'SUCCESS',
      urgencyLevel: 'URGENT',
      careType: 'URGENT_IN_PERSON_CARE',
      isEmergency: false,
      redFlagsTriggered: [],
      reasonCodes,
      userFacingExplanation:
        'The wound has stopped active bleeding, but open or gaping skin lacerations typically require in-person clinician examination for proper cleansing, potential sutures (stitches), and tetanus prophylaxis.',
      uncertaintyMessage:
        'Evaluation based on reported cut characteristics. A clinician should inspect the depth and edges in person.',
      uncertaintyLevel: 'LOW',
      timeframeRecommendation: 'Within 2 to 6 hours',
      nextSteps: [
        'Keep the area clean, dry, and protected with a sterile dressing or clean cloth.',
        'Visit a local urgent care clinic or outpatient hospital dressing room.',
        'Check when you last received a tetanus booster vaccine.'
      ],
      engineVersion: CARE_ROUTING_ENGINE_VERSION,
      disclaimer: baseDisclaimer,
      canOfferCaregivers: false, // Medical wound closure comes first
      timestamp
    };
  }

  // Check for non-clinical caregiver support requests
  const isElderlySupportNeed =
    positiveSymptoms.some(s => s.concept === 'elderly_mobility') ||
    request.followUpAnswers?.some(a => a.selectedOptionValue === 'mobility_and_chores' || a.selectedOptionValue === 'memory_dementia');

  if (isElderlySupportNeed) {
    reasonCodes.push('RC-NON-CLINICAL-SUPPORT-IDENTIFIED');
    return {
      status: 'SUCCESS',
      urgencyLevel: 'NON_CLINICAL_SUPPORT',
      careType: 'NON_CLINICAL_CAREGIVER_SUPPORT',
      isEmergency: false,
      redFlagsTriggered: [],
      reasonCodes,
      userFacingExplanation:
        'Your request focuses on daily living assistance, mobility support, and companionship for routine activities. Non-clinical caregiver assistance is suitable for this situation.',
      uncertaintyMessage:
        'Caregiver matches are based on reported non-medical needs. Any new acute physical weakness, disorientation, or pain should be promptly reviewed by a qualified doctor.',
      uncertaintyLevel: 'LOW',
      timeframeRecommendation: 'Coordinate as convenient (Next 1–3 days)',
      nextSteps: [
        'Review the verified non-clinical caregiver profiles below.',
        'Verify required schedule, mobility aids, and language preferences.',
        'Schedule an introductory orientation phone call or meet-and-greet.',
        'Keep primary physician emergency contacts easily accessible at home.'
      ],
      engineVersion: CARE_ROUTING_ENGINE_VERSION,
      disclaimer: baseDisclaimer,
      canOfferCaregivers: true,
      timestamp
    };
  }

  // Check for routine clinical needs (mild persistent symptoms, rashes, mild earaches, ongoing headaches)
  const isRoutineClinical =
    positiveSymptoms.some(s => ['headache', 'fever', 'cough_cold', 'rash'].includes(s.concept));

  if (isRoutineClinical) {
    reasonCodes.push('RC-ROUTINE-OUTPATIENT-ASSESSMENT');
    return {
      status: 'SUCCESS',
      urgencyLevel: 'ROUTINE',
      careType: 'ROUTINE_CLINICIAN_APPOINTMENT',
      isEmergency: false,
      redFlagsTriggered: [],
      reasonCodes,
      userFacingExplanation:
        'Your reported symptoms appear mild and non-critical, with no emergency red flags detected. A routine appointment with a family physician or outpatient clinic is recommended to identify the cause and advise on comfort measures.',
      uncertaintyMessage:
        'Prototype routing based on reported text. Clinical symptoms can evolve; if new red flags arise, seek urgent medical help immediately.',
      uncertaintyLevel: 'MEDIUM',
      timeframeRecommendation: 'Within 24 to 72 hours',
      nextSteps: [
        'Book an appointment with your general practitioner or primary care clinic.',
        'Rest, stay hydrated, and note down when symptoms began.',
        'If you experience shortness of breath, sudden severe pain, or high fever, seek urgent care immediately.'
      ],
      engineVersion: CARE_ROUTING_ENGINE_VERSION,
      disclaimer: baseDisclaimer,
      canOfferCaregivers: true, // Can offer home assistance/errand support alongside doctor visit
      timestamp
    };
  }

  // Check for minor muscle soreness / gym stiffness / self-monitoring
  const isMusculoskeletalMild =
    positiveSymptoms.some(s => s.concept === 'muscle_joint_pain') &&
    request.intakeText.toLowerCase().includes('mild');

  if (isMusculoskeletalMild) {
    reasonCodes.push('RC-SELF-MONITORING-SAFE');
    return {
      status: 'SUCCESS',
      urgencyLevel: 'SELF_MONITOR',
      careType: 'SELF_CARE_MONITORING',
      isEmergency: false,
      redFlagsTriggered: [],
      reasonCodes,
      userFacingExplanation:
        'The reported muscle or joint discomfort appears to be mild and typical of recent physical exertion. Gentle rest and watchful self-monitoring are appropriate next steps.',
      uncertaintyMessage:
        'Self-monitoring advice applies only if pain remains mild and does not radiate or cause weakness.',
      uncertaintyLevel: 'LOW',
      timeframeRecommendation: 'Monitor over the next 48 to 72 hours',
      nextSteps: [
        'Allow the affected muscles to rest with gentle stretching.',
        'Apply a warm or cool compress for comfort as appropriate.',
        'Consult a physiotherapist or doctor if soreness worsens or does not subside within several days.'
      ],
      engineVersion: CARE_ROUTING_ENGINE_VERSION,
      disclaimer: baseDisclaimer,
      canOfferCaregivers: true,
      timestamp
    };
  }

  // Default cautious routing for ambiguous or unclassified non-emergency concerns
  reasonCodes.push('RC-UNCERTAIN-CAUTIOUS-ROUTINE');
  return {
    status: 'SUCCESS',
    urgencyLevel: 'ROUTINE',
    careType: 'ROUTINE_CLINICIAN_APPOINTMENT',
    isEmergency: false,
    redFlagsTriggered: [],
    reasonCodes,
    userFacingExplanation:
      'We did not detect immediate life-threatening emergency triggers, but your description requires a thorough in-person professional medical assessment to understand what is happening.',
    uncertaintyMessage:
      'High uncertainty: The entered details are limited. We prioritize safety by guiding you toward professional evaluation rather than making assumptions.',
    uncertaintyLevel: 'HIGH',
    timeframeRecommendation: 'Within 24 to 48 hours',
    nextSteps: [
      'Schedule a consultation with a registered healthcare professional.',
      'Prepare a timeline of symptoms to share with your clinician.',
      'If you develop sudden weakness, severe pain, or difficulty breathing, call 112 immediately.'
    ],
    engineVersion: CARE_ROUTING_ENGINE_VERSION,
    disclaimer: baseDisclaimer,
    canOfferCaregivers: true,
    timestamp
  };
}
