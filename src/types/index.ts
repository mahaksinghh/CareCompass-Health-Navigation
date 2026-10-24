export type SupportedLanguage = 'en' | 'hi' | 'hinglish' | 'bn' | 'mr' | 'ta';

export type VoicePersona = 'calm_navigator' | 'clear_deliberate' | 'warm_companion' | 'gentle_senior';

export interface VoiceModulationConfig {
  pitch: number; // 0.6 - 1.4
  rate: number; // 0.6 - 1.4
  volume: number; // 0.1 - 1.0
  persona: VoicePersona;
  autoSpeakPrompts: boolean;
  hinglishCadence: 'balanced' | 'clear_pace' | 'conversational';
}

export interface VoiceSaathiMessage {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
  timestamp: string;
  spokenAudioAvailable?: boolean;
  isEmergency?: boolean;
  urgencyLevel?: UrgencyLevel;
  suggestedAction?: 'emergency_112' | 'triage_result' | 'match_caregivers' | 'ask_clarification';
}

export interface VoiceSaathiResponse {
  spokenText: string;
  displayText: string;
  language: SupportedLanguage;
  isEmergency: boolean;
  urgencyLevel: UrgencyLevel;
  redFlagsFired: string[];
  careType: CareType;
  suggestedCareSetting: string;
  timeframe: string;
}

export type UrgencyLevel =
  | 'EMERGENCY'
  | 'URGENT'
  | 'ROUTINE'
  | 'NON_CLINICAL_SUPPORT'
  | 'SELF_MONITOR';

export type CareType =
  | 'EMERGENCY_SERVICES'
  | 'URGENT_IN_PERSON_CARE'
  | 'ROUTINE_CLINICIAN_APPOINTMENT'
  | 'NON_CLINICAL_CAREGIVER_SUPPORT'
  | 'SELF_CARE_MONITORING';

export interface TinyFishVerificationRecord {
  caregiverId: string;
  providerName: string;
  isVerified: boolean;
  registryCouncil: string;
  licenseNumber: string;
  verificationHash: string;
  policeClearanceStatus: string;
  verifiedAt: string;
  tinyFishAuditId: string;
  liveStatus: 'Active' | 'Under Audit' | 'Verified';
  agencyAffiliation?: string;
  backgroundCheckDate: string;
}

export interface TinyFishLiveFacility {
  id: string;
  name: string;
  type: '24x7_trauma' | 'nabh_hospital' | 'verified_home_care' | 'ambulance_service' | 'urgent_clinic';
  address: string;
  city: string;
  distanceKm: string;
  emergencyPhone: string;
  verifiedBedsTrauma: boolean;
  openStatus: string;
  tinyFishVerified: boolean;
  sourceUrl?: string;
  notes?: string;
}

export interface AudioTranscriptionResponse {
  transcript: string;
  detectedLanguage?: SupportedLanguage;
  confidence?: number;
  engineUsed: 'gemini-3.8-flash' | 'web-speech' | 'fallback';
}

export interface SymptomMention {
  id: string;
  concept: string; // e.g. "chest_pain", "shortness_of_breath", "mobility_impairment"
  displayName: string;
  isNegated: boolean; // e.g. "no chest pain" => true
  severityReported?: 'mild' | 'moderate' | 'severe' | 'unbearable';
  durationReported?: string;
  confidence: number; // 0.0 - 1.0
  rawSpan?: string;
}

export interface IntakeParseRequest {
  rawText: string;
  language: SupportedLanguage;
  speechInputUsed?: boolean;
}

export interface IntakeParseResponse {
  extractedSymptoms: SymptomMention[];
  originalTextPreservedInSession: string;
  languageDetected: SupportedLanguage;
  confidenceOverall: number;
  ambiguitiesIdentified: string[];
  suggestedClarifications: string[];
}

export interface FollowUpQuestion {
  id: string;
  questionText: string;
  questionTextHi?: string;
  questionTextHinglish?: string;
  questionTextBn?: string;
  questionTextMr?: string;
  questionTextTa?: string;
  symptomConceptTarget: string;
  purposeReason: string;
  options: {
    value: string;
    label: string;
    labelHi?: string;
    labelHinglish?: string;
    labelBn?: string;
    labelMr?: string;
    labelTa?: string;
    isRedFlagTrigger?: boolean;
    urgencyWeight?: number;
  }[];
  allowsNotSure: boolean;
}

export interface FollowUpAnswer {
  questionId: string;
  selectedOptionValue: string;
  isNotSure?: boolean;
}

export interface RedFlagTrigger {
  code: string;
  category: string;
  name: string;
  triggerPhraseOrConcept: string;
  clinicalRationale: string; // e.g., "Potential acute coronary syndrome"
  immediateInstruction: string;
  disclaimer: string;
}

export interface TriageEvaluationRequest {
  sessionId?: string;
  language: SupportedLanguage;
  intakeText: string;
  extractedSymptoms: SymptomMention[];
  followUpAnswers: FollowUpAnswer[];
  demographics?: {
    ageRange?: string; // e.g. "elderly_65+", "adult", "child", "infant"
    isPregnant?: boolean;
  };
  preferredArea?: string;
}

export interface TriageEvaluationResponse {
  status: 'SUCCESS' | 'EMERGENCY_TRIGGERED' | 'CLARIFICATION_REQUIRED';
  urgencyLevel: UrgencyLevel;
  careType: CareType;
  isEmergency: boolean;
  redFlagsTriggered: RedFlagTrigger[];
  reasonCodes: string[];
  userFacingExplanation: string;
  uncertaintyMessage: string;
  uncertaintyLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  timeframeRecommendation: string;
  nextSteps: string[];
  engineVersion: string;
  disclaimer: string;
  canOfferCaregivers: boolean;
  timestamp: string;
}

export type CaregiverAvailability = 'immediate' | 'weekdays' | 'weekends' | 'full_time' | 'flexible';

export interface CaregiverProfile {
  caregiver_id: string;
  display_name: string;
  role: string;
  skills: string[];
  languages: string[];
  service_area: string;
  availability: CaregiverAvailability;
  verified_status: 'verified_background_check' | 'id_verified';
  hourly_rate_est: string;
  experience_years: number;
  eligibility_notes: string;
  bio: string;
  demo_only: true;
}

export interface CaregiverMatchScoreBreakdown {
  skillFit: number; // 0 - 40
  availabilityFit: number; // 0 - 25
  areaFit: number; // 0 - 20
  languageFit: number; // 0 - 15
  totalScore: number; // 0 - 100
}

export interface CaregiverMatchResult {
  caregiver: CaregiverProfile;
  scoreBreakdown: CaregiverMatchScoreBreakdown;
  matchReasons: string[];
  eligibilityPassed: boolean;
  ineligibilityReason?: string;
}

export interface CaregiverMatchRequest {
  urgencyLevel: UrgencyLevel;
  requiredSkills: string[];
  preferredArea?: string;
  preferredLanguage?: string;
  preferredAvailability?: CaregiverAvailability;
  maxDistanceKm?: number;
}

export interface CaregiverMatchResponse {
  allowedToMatch: boolean;
  blockReason?: string;
  totalEligible: number;
  matches: CaregiverMatchResult[];
  explanationNotes: string;
  disclaimer: string;
}

export interface SafetyTestCase {
  id: string;
  name: string;
  category: string;
  description: string;
  inputText: string;
  inputLanguage: SupportedLanguage;
  expectedEmergency: boolean;
  expectedUrgency: UrgencyLevel;
  expectedRedFlagCategory?: string;
  notes: string;
}

export interface SafetyTestRunResult {
  testId: string;
  name: string;
  category: string;
  passed: boolean;
  expectedEmergency: boolean;
  actualEmergency: boolean;
  expectedUrgency: UrgencyLevel;
  actualUrgency: UrgencyLevel;
  redFlagsTriggered: string[];
  latencyMs: number;
  error?: string;
}

export interface SafetySuiteSummary {
  totalTests: number;
  passed: number;
  failed: number;
  emergencySensitivityPct: number; // Target 100%
  underTriageCount: number; // Target 0
  avgLatencyMs: number;
  timestamp: string;
  results: SafetyTestRunResult[];
}

export interface SafetyEventLogEntry {
  id: string;
  timestamp: string;
  eventType: 'RED_FLAG_TRIPPED' | 'ROUTING_COMPLETED' | 'CAREGIVER_BLOCKED_FOR_EMERGENCY' | 'LOW_CONFIDENCE_ESCALATION';
  urgency: UrgencyLevel;
  redFlagCodes: string[];
  language: SupportedLanguage;
  anonymizedSessionHash: string;
  symptomCount: number;
  uncertainty: string;
  // Note: NO PII or raw free-text stored in logs by default to respect HIPAA/GDPR/DPDP principles
}

export interface DemoScenario {
  id: string;
  title: string;
  badge: string;
  description: string;
  sampleInput: string;
  language: SupportedLanguage;
  expectedAcuity: UrgencyLevel;
  category: 'emergency' | 'routine' | 'support' | 'negation' | 'multilingual';
}
