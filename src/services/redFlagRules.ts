import { RedFlagTrigger } from '../types/index.ts';

export const RED_FLAG_ENGINE_VERSION = 'v1.2.0-deterministic';

interface RedFlagRuleDefinition {
  code: string;
  category: string;
  name: string;
  clinicalRationale: string;
  immediateInstruction: string;
  triggerRegexes: RegExp[];
  negationRegexes: RegExp[];
}

// Negation patterns for English, Hindi, Hinglish, Bengali, Marathi, and Tamil
const COMMON_NEGATION_PREFIXES = [
  'no', 'not', 'denies', 'denied', 'without', 'free of', 'never had', 'rule out',
  'nahi', 'nahin', 'nhi', 'koi nahi', 'bina', 'kisi dard ke bina',
  // Bengali
  'কোনো', 'নেই', 'নয়', 'ছাড়া', 'না',
  // Marathi
  'नाही', 'नाहीत', 'नसलेले', 'विना', 'काही नाही',
  // Tamil
  'இல்லை', 'இல்லாமல்', 'அற்ற', 'எதுவும் இல்லை'
];

/**
 * Check whether a specific matched term is negated within a clause or sentence.
 */
export function isPhraseNegated(text: string, matchIndex: number, matchLength: number): boolean {
  // Look back up to 45 characters before the match for negation cues
  const startWindow = Math.max(0, matchIndex - 45);
  const precedingText = text.substring(startWindow, matchIndex).toLowerCase();

  // If there's a sentence-ending punctuation right before, only look within the current clause
  const clauses = precedingText.split(/[.,;!?|।]/);
  const currentClause = clauses[clauses.length - 1];

  for (const neg of COMMON_NEGATION_PREFIXES) {
    const negRegex = new RegExp(`(^|\\s)${neg}($|\\s)`, 'i');
    if (negRegex.test(currentClause)) {
      return true;
    }
  }

  // Look forward up to 25 characters for postfix negation (e.g. "chest pain is absent", "dard nahi hai")
  const endWindow = Math.min(text.length, matchIndex + matchLength + 30);
  const followingText = text.substring(matchIndex + matchLength, endWindow).toLowerCase();
  const followingClauses = followingText.split(/[.,;!?|।]/);
  const immediateFollowing = followingClauses[0];

  const postfixNegations = [
    'nahi hai', 'nahi', 'nahin', 'nhi', 'is absent', 'not present', 'none',
    'koi nahi hai', 'ke bina',
    // Bengali postfix
    'নেই', 'নয়', 'হচ্ছে না',
    // Marathi postfix
    'नाही', 'झालेले नाही', 'नाहीत',
    // Tamil postfix
    'இல்லை', 'இல்லை என்று'
  ];

  for (const postNeg of postfixNegations) {
    if (immediateFollowing.includes(postNeg)) {
      return true;
    }
  }

  return false;
}

const RED_FLAG_RULES: RedFlagRuleDefinition[] = [
  // 1. STROKE / FAST
  {
    code: 'RF-STROKE-01',
    category: 'STROKE_SIGNS',
    name: 'Acute Neurological Deficit / Possible Stroke (FAST)',
    clinicalRationale: 'Sudden onset facial asymmetry, unilateral limb weakness, or acute speech impediment requires immediate acute stroke evaluation within the thrombolytic/endovascular window.',
    immediateInstruction: 'Immediate emergency medical assessment required. Do not drive yourself. If you are in India, call 112 immediately. If in another country, call your local emergency service (e.g. 911 in US/Canada, 999 in UK). Note the exact time symptoms started.',
    triggerRegexes: [
      /\b(face\s*droop|facial\s*droop|smiling\s*uneven|slurred\s*speech|speech\s*became\s*slurred|cannot\s*speak\s*words|unable\s*to\s*speak|arm\s*weakness|one\s*side\s*weak|face\s*numb|stroke)\b/i,
      /\b(face\s*droop\s*ho\s*gaya|boli\s*ladkhada|ek\s*side\s*kamzori|lakwa|falij)\b/i,
      /(चेहरा\s*टेढ़ा|बोलने\s*में\s*लड़खड़ाहट|लकवा|एक\s*तरफ\s*कमजोरी)/i
    ],
    negationRegexes: [
      /\b(no\s+facial\s+droop|no\s+slurred\s+speech|denies\s+stroke|no\s+weakness)\b/i
    ]
  },

  // 2. SEVERE CHEST PAIN / CARDIAC
  {
    code: 'RF-CARDIAC-02',
    category: 'SEVERE_CHEST_PAIN',
    name: 'Acute Severe Chest Pressure / Possible Myocardial Infarction',
    clinicalRationale: 'Severe substernal crushing pain or tightness radiating to the arm, shoulder, or jaw, especially with sweating or dyspnea, suggests potential acute coronary syndrome.',
    immediateInstruction: 'Call emergency medical services immediately (112 in India, 911 in US/Canada, 999 in UK). Rest quietly in a comfortable seated position. Do not exert yourself or drive.',
    triggerRegexes: [
      /\b(crushing\s*(chest|pressure)|heavy\s*pressure\s*(in|on)\s*chest|chest\s*pain\s*radiat|radiating\s*to\s*(left\s*)?arm|chest\s*pain.*cold\s*sweat|severe\s*chest\s*pain|heart\s*attack)\b/i,
      /\b(chhati\s*me\s*tez\s*dard|chest\s*me\s*heavy\s*pressure|chhati\s*me\s*dard.*paseena|seene\s*me\s*tez\s*dard)\b/i,
      /(छाती\s*में\s*(बहुत\s*तेज\s*)?दर्द|सीने\s*में\s*(भारीपन|जकड़न|दबाव)|सीने\s*में\s*दर्द.*पसीना)/i
    ],
    negationRegexes: [
      /\b(no\s+chest\s+pain|denies\s+chest\s+pain|without\s+chest\s+pain|no\s+pressure\s+in\s+chest|free\s+of\s+chest\s+pain)\b/i,
      /\b(seene\s+me\s+koi\s+dard\s+nahi|chhati\s+me\s+dard\s+nahi)\b/i,
      /(सीने\s*में\s*(कोई\s*)?दर्द\s*नहीं|छाती\s*में\s*दर्द\s*नहीं)/i
    ]
  },

  // 3. SEVERE RESPIRATORY DISTRESS
  {
    code: 'RF-RESP-03',
    category: 'SEVERE_RESPIRATORY_DISTRESS',
    name: 'Severe Breathing Compromise / Hypoxia Signs',
    clinicalRationale: 'Gasping for air, cyanosis (blue lips/face), or inability to speak in sentences indicates acute ventilatory failure or critical upper airway obstruction.',
    immediateInstruction: 'Immediate emergency intervention required. Keep the person sitting upright. Dial 112 (India) or your local emergency number. If prescribed rescue inhaler is available and authorized, administer as instructed.',
    triggerRegexes: [
      /\b(struggling\s*to\s*breathe|gasping\s*for\s*air|blue\s*lips|lips\s*turning\s*blu|cannot\s*speak\s*full\s*sentences|only\s*speak\s*one\s*word|severe\s*shortness\s*of\s*breath|stridor|suffocating)\b/i,
      /\b(saans\s*lene\s*me\s*bohot\s*takleef|saans\s*phool\s*rahi\s*hai|dam\s*ghut\s*raha|lips\s*neele)\b/i,
      /(सांस\s*लेने\s*में\s*बहुत\s*(ज्यादा\s*)?तकलीफ|दम\s*घुट\s*रहा|होंठ\s*नीले|सांस\s*फूल\s*रही)/i
    ],
    negationRegexes: [
      /\b(no\s+breathing\s+trouble|no\s+shortness\s+of\s+breath|denies\s+dyspnea|breathing\s+comfortably|breathing\s+normally)\b/i,
      /\b(saans\s+lene\s+me\s+koi\s+dikkat\s+nahi|saans\s+normal)\b/i,
      /(सांस\s*की\s*कोई\s*तकलीफ\s*नहीं|सांस\s*सामान्य)/i
    ]
  },

  // 4. UNRESPONSIVENESS / ALTERED MENTAL STATUS
  {
    code: 'RF-NEURO-04',
    category: 'UNRESPONSIVENESS',
    name: 'Unresponsiveness / Loss of Consciousness',
    clinicalRationale: 'Inability to wake or maintain consciousness threatens airway patency and points to potential severe brain injury, metabolic collapse, or shock.',
    immediateInstruction: 'Check breathing immediately. Place in recovery position on their side if breathing and no spinal trauma is suspected. Call 112 (India) or local emergency services immediately.',
    triggerRegexes: [
      /\b(unconscious|found\s*unconscious|not\s*waking\s*up|unresponsive|cannot\s*wake\s*up|comatose|passed\s*out\s*cold|blacked\s*out\s*completely)\b/i,
      /\b(behosh|hosh\s*me\s*nahi|uth\s*nahi\s*raha|awaaz\s*nahi\s*de\s*raha)\b/i,
      /(बेहोश|होश\s*में\s*नहीं|उठ\s*नहीं\s*रहा)/i
    ],
    negationRegexes: [
      /\b(fully\s+conscious|awake\s+and\s+alert|not\s+unconscious|denies\s+blackout)\b/i
    ]
  },

  // 5. PROLONGED SEIZURE
  {
    code: 'RF-SEIZURE-05',
    category: 'PROLONGED_SEIZURE',
    name: 'Prolonged or Clustered Convulsive Seizure (>5 min)',
    clinicalRationale: 'Seizure activity lasting over 5 minutes or repeated seizures without returning to baseline indicates status epilepticus with risk of cerebral hypoxia.',
    immediateInstruction: 'Clear the area of dangerous objects. Do not place anything in the mouth. Cushion the head and turn onto side once convulsions pause. Call 112 immediately.',
    triggerRegexes: [
      /\b(seizure\s*for\s*(more\s*than|>|over)\s*5\s*min|continuous\s*convuls|repeated\s*seizures|seizure\s*without\s*stopping|actively\s*convulsing)\b/i,
      /\b(daura\s*5\s*minute|continuous\s*fit|daure\s*pad\s*rahe)\b/i,
      /(दौरा\s*५\s*मिनट|लगातार\s*दौरे|फिट\s*आना)/i
    ],
    negationRegexes: [
      /\b(no\s+seizure|denies\s+seizure|prior\s+seizure\s+stopped)\b/i
    ]
  },

  // 6. SEVERE BLEEDING / EXSANGUINATION
  {
    code: 'RF-BLEED-06',
    category: 'SEVERE_BLEEDING',
    name: 'Uncontrolled Severe or Arterial Hemorrhage',
    clinicalRationale: 'Pulsatile spurting blood or rapid blood loss refractory to pressure carries immediate risk of hypovolemic shock.',
    immediateInstruction: 'Apply firm, continuous direct pressure with a clean cloth. If bleeding is on a limb and spurting, apply a tourniquet above the wound if trained. Call 112.',
    triggerRegexes: [
      /\b(spurting\s*bright\s*red\s*blood|spurting\s*blood|blood\s*soaking\s*through|bleeding\s*profusely|uncontrolled\s*bleeding|cannot\s*stop\s*bleeding)\b/i,
      /\b(bohot\s*tez\s*khoon|khoon\s*ruk\s*nahi\s*raha|fauware\s*ki\s*tarah\s*khoon)\b/i,
      /(बहुत\s*तेज\s*खून|खून\s*रुक\s*नहीं\s*रहा|खून\s*का\s*फव्वारा)/i
    ],
    negationRegexes: [
      /\b(bleeding\s+has\s+stopped|no\s+active\s+bleeding|minimal\s+bleeding|no\s+bleeding)\b/i,
      /\b(khoon\s+ruk\s+gaya|koi\s+khoon\s+nahi)\b/i
    ]
  },

  // 7. SEVERE ANAPHYLAXIS
  {
    code: 'RF-ALLERGY-07',
    category: 'SEVERE_ANAPHYLAXIS',
    name: 'Acute Severe Anaphylaxis / Airway Compromise',
    clinicalRationale: 'Rapidly progressive angioedema of the tongue/pharynx with dyspnea or hypotension following an allergen exposure.',
    immediateInstruction: 'If an epinephrine auto-injector is available, use it immediately in outer mid-thigh. Call 112. Have the person lie flat with legs elevated unless breathing is easier seated.',
    triggerRegexes: [
      /\b((tongue|throat)\s*(is\s*)?swelling|swollen\s*throat|swollen\s*tongue|anaphylax|peanut.*swelling|throat\s*closing\s*up)\b/i,
      /\b(gala\s*band\s*ho\s*raha|jeebh\s*soojh\s*gayi|allergy.*saans)\b/i,
      /(जीभ\s*सूज\s*गई|गला\s*सूज\s*रहा|सांस\s*की\s*एलर्जी)/i
    ],
    negationRegexes: [
      /\b(no\s+swelling\s+of\s+throat|no\s+allergy|no\s+anaphylaxis)\b/i
    ]
  },

  // 8. SUSPECTED POISONING / OVERDOSE
  {
    code: 'RF-TOX-08',
    category: 'SUSPECTED_POISONING',
    name: 'Suspected Caustic Ingestion, Poisoning, or Acute Overdose',
    clinicalRationale: 'Ingestion of corrosive household chemicals, toxic botanicals, or medication overdoses causes rapid tissue necrosis or systemic organ failure.',
    immediateInstruction: 'Do NOT induce vomiting unless specifically instructed by a poison control clinician. Retain the chemical container or medication pack. Call 112 immediately.',
    triggerRegexes: [
      /\b(swallowed.*chemical|swallowed.*drain\s*cleaner|swallowed.*acid|ingested.*poison|overdose.*pills|took\s*bottle\s*of\s*pills)\b/i,
      /\b(zehar\s*kha\s*liya|acid\s*pee\s*liya|chemical\s*nigal\s*liya|overdose)\b/i,
      /(जहर\s*खा\s*लिया|एसिड\s*पी\s*लिया|दवाइयों\s*का\s*ओवरडोज)/i
    ],
    negationRegexes: [
      /\b(no\s+poisoning|not\s+an\s+overdose)\b/i
    ]
  },

  // 9. MAJOR TRAUMA / FRACTURE / HEAD INJURY
  {
    code: 'RF-TRAUMA-09',
    category: 'MAJOR_TRAUMA',
    name: 'Major High-Energy Trauma / Compound Fracture / Traumatic Brain Injury',
    clinicalRationale: 'High falls, vehicle crashes with open fractures or loss of consciousness present high morbidity from internal hemorrhage and neurological damage.',
    immediateInstruction: 'Do not move the person unless in imminent danger (fire/traffic) to protect the cervical spine. Call 112.',
    triggerRegexes: [
      /\b(bone\s*visibly\s*protrud|open\s*fracture|fell.*feet.*blackout|high\s*speed\s*crash|hit\s*head.*blackout|major\s*accident)\b/i,
      /\b(haddi\s*bahar\s*nikal\s*aayi|haddi\s*toot\s*kar\s*bahar|chhat\s*se\s*gira.*behosh)\b/i,
      /(हड्डी\s*बाहर\s*निकल\s*आई|खुला\s*फ्रैक्चर|छत\s*से\s*गिरे.*बेहोश)/i
    ],
    negationRegexes: [
      /\b(no\s+fracture|no\s+fall|minor\s+scratch\s+only)\b/i
    ]
  },

  // 10. PREGNANCY EMERGENCY
  {
    code: 'RF-PREG-10',
    category: 'PREGNANCY_EMERGENCY',
    name: 'Third-Trimester Obstetric Emergency',
    clinicalRationale: 'Acute continuous abdominal agony with significant bright red vaginal hemorrhage in late pregnancy can herald placental abruption or uterine rupture.',
    immediateInstruction: 'Go directly to the nearest maternity emergency hospital or call 112. Lie on the left side to optimize placental perfusion.',
    triggerRegexes: [
      /\b(pregnant.*heavy\s*bleeding|pregnant.*bright\s*red\s*bleeding|pregnant.*excruciating.*belly\s*pain|weeks\s*pregnant.*bleeding|pregnancy\s*emergency)\b/i,
      /\b(pregnant.*khoon\s*aa\s*raha|garbhwati.*tez\s*pet\s*dard)\b/i,
      /(गर्भवती.*खून\s*बह\s*रहा|गर्भावस्था.*अत्यधिक\s*दर्द)/i
    ],
    negationRegexes: [
      /\b(not\s+pregnant|no\s+bleeding\s+in\s+pregnancy)\b/i
    ]
  },

  // 11. SEVERE EXTENSIVE BURNS
  {
    code: 'RF-BURNS-11',
    category: 'SEVERE_BURNS',
    name: 'Extensive or Inhalation Thermal/Chemical Burn',
    clinicalRationale: 'Full-thickness burns or burns involving the face, airway, or significant surface area risk shock, airway closure, and severe sepsis.',
    immediateInstruction: 'Cool with gentle clean running tap water (not ice) for 10-20 minutes. Do not burst blisters. Cover loosely with clean non-adherent dressing. Call 112.',
    triggerRegexes: [
      /\b(boiling\s*oil.*explosion|skin\s*peeling.*burn|severe\s*white\s*patches.*burn|burn.*face.*neck|third\s*degree\s*burn)\b/i,
      /\b(buri\s*tarah\s*jal\s*gaya|tel\s*se\s*jalna|skin\s*chhil\s*gayi.*aag)\b/i,
      /(बुरी\s*तरह\s*जल\s*गया|चेहरे\s*पर\s*गंभीर\s*जलन)/i
    ],
    negationRegexes: [
      /\b(minor\s+burn\s+only|no\s+severe\s+burns|superficial\s+burn)\b/i
    ]
  },

  // 12. IMMEDIATE SELF-HARM / CRISIS
  {
    code: 'RF-PSYCH-12',
    category: 'IMMEDIATE_SELF_HARM',
    name: 'Acute Psychiatric Crisis / Imminent Self-Harm Danger',
    clinicalRationale: 'Immediate danger to self requires prompt crisis de-escalation, human connection, and psychiatric emergency support.',
    immediateInstruction: 'You are not alone. Please reach out immediately for confidential, free help right now. Call Tele-MANAS (India) at 14416 or 1800 891 4416, or emergency 112. In the US, dial 988. In the UK, call 111. Please stay with someone you trust.',
    triggerRegexes: [
      /\b(end\s*my\s*life|commit\s*suicide|kill\s*myself|want\s*to\s*die\s*right\s*now|have\s*pills\s*in\s*my\s*hand.*end|suicidal)\b/i,
      /\b(jaan\s*dena\s*chahta|khudkushi|suicide\s*karna\s*hai|marna\s*chahta\s*hoon)\b/i,
      /(जान\s*देना\s*चाहता|आत्महत्या|खुदकुशी)/i
    ],
    negationRegexes: [
      /\b(no\s+suicidal\s+thoughts|denies\s+self\s+harm|not\s+suicidal)\b/i
    ]
  }
];

export interface RedFlagCheckResult {
  hasEmergencyRedFlag: boolean;
  triggers: RedFlagTrigger[];
  engineVersion: string;
  disclaimer: string;
}

/**
 * Deterministic evaluation of text against life-threatening red-flag rules.
 * This runs BEFORE any generative AI, routing engine, or caregiver matching.
 */
export function evaluateRedFlags(inputText: string): RedFlagCheckResult {
  const triggered: RedFlagTrigger[] = [];
  const normalizedText = inputText.trim();

  for (const rule of RED_FLAG_RULES) {
    let matched = false;
    let matchedPhrase = '';

    for (const trigRegex of rule.triggerRegexes) {
      const match = trigRegex.exec(normalizedText);
      if (match) {
        const matchIndex = match.index;
        const matchLength = match[0].length;

        // Check if negated
        const negated = isPhraseNegated(normalizedText, matchIndex, matchLength);
        if (!negated) {
          // Check explicit negation regexes
          let explicitlyNegated = false;
          for (const negReg of rule.negationRegexes) {
            if (negReg.test(normalizedText)) {
              explicitlyNegated = true;
              break;
            }
          }

          if (!explicitlyNegated) {
            matched = true;
            matchedPhrase = match[0];
            break;
          }
        }
      }
    }

    if (matched) {
      triggered.push({
        code: rule.code,
        category: rule.category,
        name: rule.name,
        triggerPhraseOrConcept: matchedPhrase,
        clinicalRationale: rule.clinicalRationale,
        immediateInstruction: rule.immediateInstruction,
        disclaimer: 'CareCompass is a navigation prototype and does NOT automatically dispatch emergency services or replace certified medical personnel.'
      });
    }
  }

  return {
    hasEmergencyRedFlag: triggered.length > 0,
    triggers: triggered,
    engineVersion: RED_FLAG_ENGINE_VERSION,
    disclaimer: 'Deterministic Red-Flag Safety Layer (Pre-AI Clinical Gate)'
  };
}
