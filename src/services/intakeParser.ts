import { IntakeParseResponse, SupportedLanguage, SymptomMention } from '../types/index.ts';
import { isPhraseNegated } from './redFlagRules.ts';

interface SymptomDictionaryItem {
  concept: string;
  displayName: string;
  patterns: RegExp[];
}

const SYMPTOM_DICTIONARY: SymptomDictionaryItem[] = [
  {
    concept: 'chest_pain',
    displayName: 'Chest pain or pressure',
    patterns: [
      /\b(chest\s*pain|chest\s*tightness|chest\s*pressure|heavy\s*chest)\b/i,
      /\b(chhati\s*me\s*dard|seene\s*me\s*dard|chhati\s*me\s*jalan)\b/i,
      /(छाती\s*में\s*दर्द|सीने\s*में\s*दर्द|सीने\s*में\s*भारीपन)/i,
      /(বুকে\s*ব্যথা|বুকের\s*চাপ|छातीत\s*दुखणे|मார்பு\s*வலி)/i
    ]
  },
  {
    concept: 'shortness_of_breath',
    displayName: 'Difficulty breathing / Dyspnea',
    patterns: [
      /\b(shortness\s*of\s*breath|difficulty\s*breathing|trouble\s*breathing|breathless|gasping)\b/i,
      /\b(saans\s*lene\s*me\s*takleef|saans\s*phoolna|dam\s*ghutna)\b/i,
      /(सांस\s*फूलना|सांस\s*लेने\s*में\s*तकलीफ)/i,
      /(শ্বাসকষ্ট|দম\s*বন্ধ|दम\s*लागणे|மூச்சுத்திணறல்|மூச்சு\s*வாங்க)/i
    ]
  },
  {
    concept: 'stroke_symptoms',
    displayName: 'Facial asymmetry or slurred speech',
    patterns: [
      /\b(facial\s*droop|slurred\s*speech|face\s*drooping|speech\s*slurred)\b/i,
      /\b(face\s*tedha|boli\s*ladkhadana)\b/i,
      /(चेहरा\s*टेढ़ा|बोलने\s*में\s*लड़खड़ाहट)/i,
      /(মুখ\s*বেঁকে|জিহ্বা\s*জড়িয়ে|तोंड\s*वाकडे|முகம்\s*கோணல்|பேச்சு\s*குளறுதல்)/i
    ]
  },
  {
    concept: 'headache',
    displayName: 'Headache',
    patterns: [
      /\b(headache|head\s*pain|migraine|throbbing\s*head)\b/i,
      /\b(sar\s*dard|sir\s*dard|sar\s*me\s*dard)\b/i,
      /(सिरदर्द|सिर\s*में\s*दर्द)/i,
      /(মাথাব্যথা|डोकेदुखी|தலைவலி)/i
    ]
  },
  {
    concept: 'fever',
    displayName: 'Fever or chills',
    patterns: [
      /\b(fever|high\s*temp|temperature|chills|shivering)\b/i,
      /\b(bukhar|tez\s*bukhar|thand\s*lagna)\b/i,
      /(बुखार|तेज\s*तापमान|ठंड\s*लगना)/i,
      /(জ্বর|ताप|காய்ச்சல்)/i
    ]
  },
  {
    concept: 'cough_cold',
    displayName: 'Cough, runny nose, or cold',
    patterns: [
      /\b(cough|runny\s*nose|cold|sneezing|congestion|sore\s*throat)\b/i,
      /\b(khansi|sardi|jukham|gale\s*me\s*kharash)\b/i,
      /(खांसी|सर्दी|जुकाम|गले\s*में\s*खराश|छींक)/i,
      /(সর্দি|কাশি|खोकला|सर्दी|இருமல்|சளி)/i
    ]
  },
  {
    concept: 'elderly_mobility',
    displayName: 'Mobility difficulty / Elder assistance needed',
    patterns: [
      /\b(mobility\s*assistance|help\s*walking|fall\s*risk|elder\s*care|wheelchair\s*help|daily\s*chores)\b/i,
      /\b(chalne\s*me\s*(madad|support|help)|chalne\s*firne|dadaji\s*ko|caregiver\s*chahiye|bujurg|bistar\s*se\s*uthne)\b/i,
      /(चलने\s*में\s*मदद|बुजुर्गों\s*की\s*देखभाल|दैनिक\s*काम)/i,
      /(হাঁটাহাঁটি|চলাফেরায়\s*সাহায্য|দিদিমা|चालण्यास\s*मदत|घरात\s*मदत|आजी|நடக்க\s*உதவி|முதியோர்|பாட்டி)/i
    ]
  },
  {
    concept: 'wound_cut',
    displayName: 'Cut, laceration, or wound',
    patterns: [
      /\b(cut|laceration|bleeding\s*cut|sliced\s*(finger|thumb|hand)|gaping\s*wound)\b/i,
      /\b(chot|cut\s*lag\s*gaya|haath\s*kat\s*gaya)\b/i,
      /(कट\s*गया|घाव|चोट)/i
    ]
  },
  {
    concept: 'muscle_joint_pain',
    displayName: 'Musculoskeletal pain or soreness',
    patterns: [
      /\b(back\s*ache|back\s*pain|joint\s*pain|knee\s*pain|muscle\s*soreness)\b/i,
      /\b(kamar\s*dard|peeth\s*dard|ghutno\s*me\s*dard|muscle\s*pain)\b/i,
      /(कमर\s*दर्द|पीठ\s*दर्द|घुटनों\s*में\s*दर्द)/i
    ]
  },
  {
    concept: 'rash',
    displayName: 'Skin rash or itching',
    patterns: [
      /\b(rash|itchy\s*patch|skin\s*redness|hives)\b/i,
      /\b(khujli|daane|skin\s*rash)\b/i,
      /(खुजली|त्वचा\s*पर\s*दाने|चकत्ते)/i
    ]
  }
];

export function parseFreeTextIntake(
  text: string,
  preferredLanguage: SupportedLanguage = 'en'
): IntakeParseResponse {
  const extractedSymptoms: SymptomMention[] = [];
  const ambiguitiesIdentified: string[] = [];
  const suggestedClarifications: string[] = [];

  const normalized = text.trim();

  // Extract reported duration
  let detectedDuration = '';
  const durationMatch = normalized.match(
    /\b(\d+|two|three|four|five|several)\s*(hours?|days?|weeks?|months?|minutes?|din|ghante)\b/i
  );
  if (durationMatch) {
    detectedDuration = durationMatch[0];
  }

  // Extract reported severity
  let reportedSeverity: 'mild' | 'moderate' | 'severe' | 'unbearable' | undefined;
  if (/\b(mild|slight|minor|halka|halki)\b/i.test(normalized)) {
    reportedSeverity = 'mild';
  } else if (/\b(moderate|noticeable|medium)\b/i.test(normalized)) {
    reportedSeverity = 'moderate';
  } else if (/\b(severe|intense|bohot\s*tez|bahut\s*jyada|extreme)\b/i.test(normalized)) {
    reportedSeverity = 'severe';
  } else if (/\b(unbearable|excruciating|worst\s*ever)\b/i.test(normalized)) {
    reportedSeverity = 'unbearable';
  }

  // Scan dictionary
  for (const item of SYMPTOM_DICTIONARY) {
    for (const pattern of item.patterns) {
      const match = pattern.exec(normalized);
      if (match) {
        const negated = isPhraseNegated(normalized, match.index, match[0].length);

        extractedSymptoms.push({
          id: `sym-${item.concept}-${extractedSymptoms.length + 1}`,
          concept: item.concept,
          displayName: item.displayName,
          isNegated: negated,
          severityReported: reportedSeverity,
          durationReported: detectedDuration,
          confidence: 0.92,
          rawSpan: match[0]
        });
        break; // Match once per concept
      }
    }
  }

  // Check for ambiguous or empty input
  if (normalized.length < 15 && extractedSymptoms.length === 0) {
    ambiguitiesIdentified.push('Input is very brief. More details will help determine the safest next step.');
    suggestedClarifications.push('When did this start, and how intense does it feel right now?');
  }

  if (extractedSymptoms.length === 0 && normalized.length >= 15) {
    ambiguitiesIdentified.push('No standard symptom pattern automatically identified from our dictionary.');
    suggestedClarifications.push('Could you specify which part of the body is affected?');
  }

  const confidenceOverall = extractedSymptoms.length > 0 ? 0.88 : 0.45;

  return {
    extractedSymptoms,
    originalTextPreservedInSession: normalized,
    languageDetected: preferredLanguage,
    confidenceOverall,
    ambiguitiesIdentified,
    suggestedClarifications
  };
}
