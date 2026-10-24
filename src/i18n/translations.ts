import { SupportedLanguage } from '../types/index.ts';

export interface TranslationDictionary {
  appName: string;
  tagline: string;
  disclaimerBanner: string;
  navGuidance: string;
  navCaregivers: string;
  navSafety: string;
  navPrivacy: string;
  navDemo: string;
  btnStartGuidance: string;
  btnExploreCaregivers: string;
  heroHeadline: string;
  heroSubheadline: string;
  trustWhatIs: string;
  trustWhatIsNot: string;
  intakeTitle: string;
  intakeSubtitle: string;
  intakePlaceholder: string;
  intakeMicBtn: string;
  intakeMicListening: string;
  intakeVoiceConsent: string;
  intakeSubmitBtn: string;
  intakeClearBtn: string;
  privacyBadge: string;
  followUpTitle: string;
  followUpSubtitle: string;
  followUpProgress: string;
  btnBack: string;
  btnNext: string;
  btnNotSure: string;
  emergencyTitle: string;
  emergencySubtitle: string;
  emergencyDialIndia: string;
  emergencyIntlNote: string;
  emergencyActionHeader: string;
  emergencyCaregiverNotice: string;
  triageResultTitle: string;
  urgencyLabel: string;
  careTypeLabel: string;
  timeframeLabel: string;
  reasonsLabel: string;
  uncertaintyLabel: string;
  nextStepsLabel: string;
  btnViewCaregivers: string;
  btnReviewSummary: string;
  btnStartOver: string;
  matchTitle: string;
  matchSubtitle: string;
  matchScoreLabel: string;
  matchSkillsLabel: string;
  matchAreaLabel: string;
  matchAvailabilityLabel: string;
  matchLanguageLabel: string;
  btnRequestCaregiver: string;
  summaryTitle: string;
  summaryTimestamp: string;
  summaryCopyBtn: string;
  summaryPrintBtn: string;
  // Voice modulation controls
  voiceModulationLabel: string;
  voiceSpeed: string;
  voicePitch: string;
  voicePersona: string;
  btnListenAloud: string;
  btnStopAudio: string;
}

export const translations: Record<SupportedLanguage, TranslationDictionary> = {
  en: {
    appName: 'CareCompass',
    tagline: 'Healthcare Navigation & Non-Clinical Caregiver Matching',
    disclaimerBanner:
      'CareCompass is a navigation prototype, not a medical diagnosis or emergency service. If experiencing a life-threatening emergency, call 112 (India) or your local emergency number immediately.',
    navGuidance: 'Get Guidance',
    navCaregivers: 'Find Caregivers',
    navSafety: 'Safety & Evaluation',
    navPrivacy: 'Privacy & Limits',
    navDemo: 'Demo Presets',
    btnStartGuidance: 'Get Care Guidance',
    btnExploreCaregivers: 'Find Support & Caregivers',
    heroHeadline: 'Plain-language health navigation you can trust.',
    heroSubheadline:
      'Describe what you or a family member are experiencing. We check immediate safety first, guide you to the appropriate care level, and match you with vetted non-clinical caregivers when suitable.',
    trustWhatIs: '✓ Conservative red-flag check before any routing\n✓ Plain language explanations\n✓ Vetted non-clinical home companions',
    trustWhatIsNot: '✗ Does not provide medical diagnoses\n✗ Does not prescribe or alter medications\n✗ Does not replace doctor evaluation',
    intakeTitle: 'Describe what is happening',
    intakeSubtitle: 'Write naturally in English, Hindi, Hinglish, Bengali, Marathi, or Tamil. Mention what feels wrong, when it started, and how severe it feels.',
    intakePlaceholder: 'e.g., "My mother has been feeling weak and needs help walking around the house for the past 2 days..."',
    intakeMicBtn: 'Voice Input (Optional)',
    intakeMicListening: 'Listening... (Speak your concern)',
    intakeVoiceConsent: 'Voice input is processed in your local browser and not saved.',
    intakeSubmitBtn: 'Evaluate Safe Next Steps',
    intakeClearBtn: 'Clear',
    privacyBadge: 'No identifiable health text stored permanently. Reset anytime.',
    followUpTitle: 'A few quick safety clarifications',
    followUpSubtitle: 'Please answer these targeted questions to help us confirm the safest recommendation.',
    followUpProgress: 'Step {current} of {total}',
    btnBack: 'Back',
    btnNext: 'Continue',
    btnNotSure: 'I’m not sure / Prefer not to say',
    emergencyTitle: 'Potential Emergency Detected',
    emergencySubtitle: 'Your description contains signs that require urgent, in-person emergency medical assessment without delay.',
    emergencyDialIndia: 'Call 112 (Emergency Services)',
    emergencyIntlNote: 'If outside India, please dial your local emergency services (e.g. 911 in the US/Canada, 999/111 in the UK, 000 in Australia).',
    emergencyActionHeader: 'Immediate Safety Instructions',
    emergencyCaregiverNotice: 'Caregiver matching is disabled during emergency triage. Please focus entirely on emergency medical responders.',
    triageResultTitle: 'Care Navigation Recommendation',
    urgencyLabel: 'Care Urgency',
    careTypeLabel: 'Suggested Care Level',
    timeframeLabel: 'Recommended Timeframe',
    reasonsLabel: 'Why this was recommended',
    uncertaintyLabel: 'Uncertainty & Clinical Scope',
    nextStepsLabel: 'Recommended Action Checklist',
    btnViewCaregivers: 'Explore Eligible Caregiver Matches',
    btnReviewSummary: 'Review & Download Summary',
    btnStartOver: 'Start New Session',
    matchTitle: 'Matched Non-Clinical Caregivers',
    matchSubtitle: 'Caregivers ranked using an explainable formula: Skill fit (40%), Availability (25%), Service area (20%), and Language (15%).',
    matchScoreLabel: 'Match Score',
    matchSkillsLabel: 'Skills & Capabilities',
    matchAreaLabel: 'Service Area',
    matchAvailabilityLabel: 'Availability',
    matchLanguageLabel: 'Languages',
    btnRequestCaregiver: 'Inquire Availability',
    summaryTitle: 'Care Navigation Summary',
    summaryTimestamp: 'Generated on',
    summaryCopyBtn: 'Copy Care Brief',
    summaryPrintBtn: 'Print / Save PDF',
    voiceModulationLabel: 'Voice Modulation',
    voiceSpeed: 'Pacing / Speed',
    voicePitch: 'Pitch / Frequency',
    voicePersona: 'Voice Tone',
    btnListenAloud: 'Read Aloud (Voice Modulation)',
    btnStopAudio: 'Stop Speaking'
  },
  hi: {
    appName: 'केयरकम्पास (CareCompass)',
    tagline: 'स्वास्थ्य मार्गदर्शन एवं गैर-चिकित्सकीय देखभाल सहायक',
    disclaimerBanner:
      'केयरकम्पास केवल देखभाल मार्गदर्शन के लिए एक प्रोटोटाइप है, कोई मेडिकल निदान या आपातकालीन सेवा नहीं। यदि आपात स्थिति है, तो तुरंत 112 या स्थानीय आपातकालीन नंबर पर कॉल करें।',
    navGuidance: 'मार्गदर्शन प्राप्त करें',
    navCaregivers: 'देखभाल सहायक खोजें',
    navSafety: 'सुरक्षा एवं परीक्षण',
    navPrivacy: 'गोपनीयता व सीमाएं',
    navDemo: 'डेमो परिदृश्य',
    btnStartGuidance: 'देखभाल मार्गदर्शन शुरू करें',
    btnExploreCaregivers: 'देखभाल सहायक खोजें',
    heroHeadline: 'सरल भाषा में भरोसेमंद स्वास्थ्य मार्गदर्शन।',
    heroSubheadline:
      'बताएं कि आप या आपके परिजन क्या महसूस कर रहे हैं। हम पहले आपातकालीन संकेतों की जांच करते हैं, फिर सही देखभाल का स्तर सुझाते हैं।',
    trustWhatIs: '✓ किसी भी सुझाव से पहले आपातकालीन सुरक्षा जांच\n✓ सरल, स्पष्ट एवं पारदर्शी भाषा\n✓ गैर-चिकित्सकीय प्रमाणित घरेलू सहायक',
    trustWhatIsNot: '✗ कोई मेडिकल बीमारी का निदान नहीं करता\n✗ दवाइयां नहीं लिखता या बदलता\n✗ डॉक्टर की जांच का विकल्प नहीं है',
    intakeTitle: 'अपनी समस्या या आवश्यकता बताएं',
    intakeSubtitle: 'अपनी भाषा में खुलकर लिखें—कब शुरू हुआ, कैसा महसूस हो रहा है और क्या सहायता चाहिए।',
    intakePlaceholder: 'जैसे: "मेरी माताजी को 2 दिनों से कमजोरी लग रही है और घर में चलने-फिरने में सहायता चाहिए..."',
    intakeMicBtn: 'बोलकर बताएं (वैकल्पिक)',
    intakeMicListening: 'सुन रहे हैं... (अपनी बात कहें)',
    intakeVoiceConsent: 'आवाज केवल आपके ब्राउज़र में समझी जाती है, कहीं रिकॉर्ड नहीं होती।',
    intakeSubmitBtn: 'सुरक्षित अगला कदम जानें',
    intakeClearBtn: 'साफ़ करें',
    privacyBadge: 'कोई व्यक्तिगत स्वास्थ्य डेटा स्थायी रूप से नहीं रखा जाता।',
    followUpTitle: 'सुरक्षा के लिए कुछ जरूरी प्रश्न',
    followUpSubtitle: 'सुरक्षित और सटीक सुझाव के लिए कृपया इन संक्षिप्त प्रश्नों के उत्तर दें।',
    followUpProgress: 'चरण {current} / {total}',
    btnBack: 'पीछे',
    btnNext: 'आगे बढ़ें',
    btnNotSure: 'निश्चित नहीं / छोड़ें',
    emergencyTitle: 'आपातकालीन संकेत मिले हैं',
    emergencySubtitle: 'आपके विवरण में ऐसे संकेत मिले हैं जिनके लिए बिना किसी देरी के तुरंत आपातकालीन चिकित्सा सहायता आवश्यक है।',
    emergencyDialIndia: 'तुरंत 112 पर कॉल करें',
    emergencyIntlNote: 'यदि आप भारत से बाहर हैं, तो अपने देश का आपातकालीन नंबर डायल करें (जैसे अमेरिका में 911, यूके में 999)।',
    emergencyActionHeader: 'तत्काल सुरक्षा निर्देश',
    emergencyCaregiverNotice: 'आपातकालीन स्थिति में केयरगिवर खोजना बंद कर दिया गया है। कृपया केवल आपातकालीन डॉक्टरों पर ध्यान दें।',
    triageResultTitle: 'देखभाल नेविगेशन सुझाव',
    urgencyLabel: 'आवश्यकता का स्तर',
    careTypeLabel: 'देखभाल का प्रकार',
    timeframeLabel: 'सुझाया गया समय',
    reasonsLabel: 'यह सुझाव क्यों दिया गया',
    uncertaintyLabel: 'अनिश्चितता एवं सीमाएं',
    nextStepsLabel: 'अगले जरूरी कदम',
    btnViewCaregivers: 'योग्य सहायक प्रोफाइल देखें',
    btnReviewSummary: 'विवरण देखें और सहेजें',
    btnStartOver: 'नया सत्र शुरू करें',
    matchTitle: 'उपयुक्त देखभाल सहायक',
    matchSubtitle: 'पारदर्शी गणना: कौशल (40%), उपलब्धता (25%), क्षेत्र (20%), और भाषा (15%)।',
    matchScoreLabel: 'मैच स्कोर',
    matchSkillsLabel: 'कौशल एवं सेवाएं',
    matchAreaLabel: 'सेवा क्षेत्र',
    matchAvailabilityLabel: 'उपलब्धता',
    matchLanguageLabel: 'भाषाएं',
    btnRequestCaregiver: 'उपलब्धता पूछें',
    summaryTitle: 'केयर नेविगेशन सारांश',
    summaryTimestamp: 'दिनांक एवं समय',
    summaryCopyBtn: 'सारांश कॉपी करें',
    summaryPrintBtn: 'प्रिंट / पीडीएफ सहेजें',
    voiceModulationLabel: 'वॉइस मॉड्यूलेशन (आवाज नियंत्रण)',
    voiceSpeed: 'बोलने की गति',
    voicePitch: 'आवाज का सुर (पिच)',
    voicePersona: 'आवाज का लहजा',
    btnListenAloud: 'आवाज में सुनें',
    btnStopAudio: 'रोकें'
  },
  hinglish: {
    appName: 'CareCompass',
    tagline: 'Health Navigation & Non-Clinical Caregiver Matching',
    disclaimerBanner:
      'CareCompass care navigation prototype hai, medical diagnosis ya emergency service nahi. Emergency hone par turant 112 ya local emergency number par call karein.',
    navGuidance: 'Get Guidance',
    navCaregivers: 'Find Caregivers',
    navSafety: 'Safety & Evaluation',
    navPrivacy: 'Privacy & Limits',
    navDemo: 'Demo Presets',
    btnStartGuidance: 'Start Care Guidance',
    btnExploreCaregivers: 'Find Caregivers',
    heroHeadline: 'Simple bhasha me safe healthcare guidance.',
    heroSubheadline:
      'Batayein aap ya family member kya feel kar rahe hain. Hum sabse pehle emergency red-flags check karte hain aur safe next step batate hain.',
    trustWhatIs: '✓ Pehle strict emergency safety check\n✓ Simple, clear explanation\n✓ Non-clinical verified home companions',
    trustWhatIsNot: '✗ Bimari diagnose nahi karta\n✗ Dawai prescribe ya change nahi karta\n✗ Doctor ki jagah nahi leta',
    intakeTitle: 'Apni situation explain karein',
    intakeSubtitle: 'English, Hindi ya Hinglish me naturally likhein. Problem kab shuru hui aur kitni intense hai.',
    intakePlaceholder: 'e.g., "Dadaji ko 2 din se walking me support chahiye aur daily routine me help chahiye..."',
    intakeMicBtn: 'Voice Input (Optional)',
    intakeMicListening: 'Listening... (Boliye)',
    intakeVoiceConsent: 'Voice browser me process hoti hai, koi audio save nahi hota.',
    intakeSubmitBtn: 'Check Safe Next Steps',
    intakeClearBtn: 'Clear',
    privacyBadge: 'Session data temporary rehta hai. Kabhi bhi reset kar sakte hain.',
    followUpTitle: 'Safety confirmation ke liye 1-2 questions',
    followUpSubtitle: 'Safe recommendation ke liye in sawalon ka jawab dein.',
    followUpProgress: 'Step {current} of {total}',
    btnBack: 'Peeche',
    btnNext: 'Next',
    btnNotSure: 'Not sure / Prefer not to say',
    emergencyTitle: 'Emergency Sign Alert',
    emergencySubtitle: 'Aapke entered details me critical symptoms mile hain jiske liye turant emergency hospital jana zaroori hai.',
    emergencyDialIndia: 'Call 112 (Emergency Services)',
    emergencyIntlNote: 'Agar aap India ke bahar hain, toh local emergency number (US 911, UK 999) par call karein.',
    emergencyActionHeader: 'Immediate Safety Steps',
    emergencyCaregiverNotice: 'Emergency triage ke waqt caregiver matching block kar di gayi hai. Ambulance aur doctor par focus karein.',
    triageResultTitle: 'Care Navigation Recommendation',
    urgencyLabel: 'Urgency Level',
    careTypeLabel: 'Care Type',
    timeframeLabel: 'Timeframe',
    reasonsLabel: 'Reason for suggestion',
    uncertaintyLabel: 'Uncertainty level',
    nextStepsLabel: 'Next Steps Checklist',
    btnViewCaregivers: 'See Matched Caregivers',
    btnReviewSummary: 'View & Download Summary',
    btnStartOver: 'Start New Session',
    matchTitle: 'Matched Non-Clinical Caregivers',
    matchSubtitle: 'Explainable score breakdown: Skills (40%), Availability (25%), Area (20%), Language (15%).',
    matchScoreLabel: 'Match Score',
    matchSkillsLabel: 'Skills',
    matchAreaLabel: 'Service Area',
    matchAvailabilityLabel: 'Availability',
    matchLanguageLabel: 'Languages',
    btnRequestCaregiver: 'Inquire Availability',
    summaryTitle: 'Care Navigation Summary',
    summaryTimestamp: 'Generated at',
    summaryCopyBtn: 'Copy Care Brief',
    summaryPrintBtn: 'Print / Save PDF',
    voiceModulationLabel: 'Voice Modulation (Hinglish Tuned)',
    voiceSpeed: 'Speech Speed',
    voicePitch: 'Voice Pitch',
    voicePersona: 'Tone & Style',
    btnListenAloud: 'Voice me sunein (Modulated)',
    btnStopAudio: 'Stop Speaking'
  },
  bn: {
    appName: 'কেয়ারকম্পাস (CareCompass)',
    tagline: 'স্বাস্থ্য পথপ্রদর্শন এবং নন-ক্লিনিকাল কেয়ারগিভার সংযোগ',
    disclaimerBanner:
      'কেয়ারকম্পাস কেবল স্বাস্থ্য নির্দেশিকার জন্য একটি প্রোটোটাইপ, কোনো রোগ নির্ণয় বা জরুরি সেবা নয়। জরুরি প্রয়োজনে অবিলম্বে ১১২ বা স্থানীয় জরুরি নম্বরে কল করুন।',
    navGuidance: 'নির্দেশনা পান',
    navCaregivers: 'কেয়ারগিভার খুঁজুন',
    navSafety: 'নিরাপত্তা ও নিরীক্ষা',
    navPrivacy: 'গোপনীয়তা ও পরিধি',
    navDemo: 'ডেমো পরিস্থিতি',
    btnStartGuidance: 'যত্ন নির্দেশিকা শুরু করুন',
    btnExploreCaregivers: 'সহকারী সন্ধান করুন',
    heroHeadline: 'সহজ ভাষায় বিশ্বস্ত স্বাস্থ্য পথপ্রদর্শন।',
    heroSubheadline:
      'আপনার বা পরিবারের শারীরিক অনুভূতি বর্ণনা করুন। আমরা প্রথমে জরুরি লক্ষণগুলি যাচাই করি এবং সঠিক যত্নের পরামর্শ দিই।',
    trustWhatIs: '✓ জরুরি বিপদের লক্ষণ যাচাই\n✓ সহজ ও স্বচ্ছ ব্যাখ্যা\n✓ যাচাইকৃত গৃহ সহায়ক',
    trustWhatIsNot: '✗ রোগ নির্ণয় করে না\n✗ ওষুধ প্রেসক্রাইব করে না\n✗ ডাক্তারের বিকল্প নয়',
    intakeTitle: 'আপনার শারীরিক সমস্যা বা প্রয়োজন জানান',
    intakeSubtitle: 'বাংলায় পরিষ্কার করে লিখুন—কখন শুরু হয়েছে, কতটা তীব্র এবং কী ধরনের সাহায্য প্রয়োজন।',
    intakePlaceholder: 'যেমন: "আমার দিদিমা গত ২ দিন ধরে দুর্বল বোধ করছেন এবং চলাফেরায় সাহায্য প্রয়োজন..."',
    intakeMicBtn: 'ভয়েস ইনপুট (ঐচ্ছিক)',
    intakeMicListening: 'শুনছি... (বলুন)',
    intakeVoiceConsent: 'ভয়েস স্থানীয় ব্রাউজারে প্রক্রিয়া হয়, কোনো অডিও সংরক্ষণ করা হয় না।',
    intakeSubmitBtn: 'পরবর্তী নিরাপদ পদক্ষেপ দেখুন',
    intakeClearBtn: 'মুছে ফেলুন',
    privacyBadge: 'কোনো ব্যক্তিগত স্বাস্থ্য তথ্য স্থায়ীভাবে সংরক্ষণ করা হয় না।',
    followUpTitle: 'নিরাপত্তার জন্য কিছু সংক্ষিপ্ত প্রশ্ন',
    followUpSubtitle: 'সঠিক নির্দেশনার জন্য এই কয়েকটি সহজ প্রশ্নের উত্তর দিন।',
    followUpProgress: 'ধাপ {current} / {total}',
    btnBack: 'পেছনে',
    btnNext: 'পরবর্তী',
    btnNotSure: 'নিশ্চিত নই / বলতে চাই না',
    emergencyTitle: 'জরুরি বিপদ সংকেত শনাক্ত হয়েছে',
    emergencySubtitle: 'আপনার বর্ণনায় গুরুতর লক্ষণ রয়েছে যার জন্য অবিলম্বে জরুরি চিকিৎসা মূল্যায়ন প্রয়োজন।',
    emergencyDialIndia: '১১২ ডায়াল করুন (জরুরি সেবা)',
    emergencyIntlNote: 'ভারতের বাইরে থাকলে আপনার স্থানীয় জরুরি নম্বরে (যেমন যুক্তরাষ্ট্রে ৯১১, যুক্তরাজ্যে ৯৯৯) যোগাযোগ করুন।',
    emergencyActionHeader: 'জরুরি নিরাপত্তা নির্দেশাবলী',
    emergencyCaregiverNotice: 'জরুরি অবস্থায় কেয়ারগিভার অনুসন্ধান বন্ধ রাখা হয়েছে। অবিলম্বে জরুরি হাসপাতালে যোগাযোগ করুন।',
    triageResultTitle: 'যত্ন পথপ্রদর্শন সুপারিশ',
    urgencyLabel: 'জরুরিতা স্তর',
    careTypeLabel: 'যত্নের ধরন',
    timeframeLabel: 'সুপারিশকৃত সময়সীমা',
    reasonsLabel: 'কেন এই সুপারিশ করা হলো',
    uncertaintyLabel: 'অনিশ্চয়তা ও পরিধি',
    nextStepsLabel: 'পরবর্তী প্রয়োজনীয় পদক্ষেপ',
    btnViewCaregivers: 'যোগ্য সহায়ক তালিকা দেখুন',
    btnReviewSummary: 'সারাংশ দেখুন ও সংরক্ষণ করুন',
    btnStartOver: 'নতুন সেশন শুরু করুন',
    matchTitle: 'উপযুক্ত নন-ক্লিনিকাল কেয়ারগিভার',
    matchSubtitle: 'স্বচ্ছ মূল্যায়ন: দক্ষতা (৪০%), প্রাপ্যতা (২৫%), এলাকা (২০%), এবং ভাষা (১৫%)।',
    matchScoreLabel: 'ম্যাচ স্কোর',
    matchSkillsLabel: 'দক্ষতা ও সেবা',
    matchAreaLabel: 'সেবা এলাকা',
    matchAvailabilityLabel: 'উপলব্ধতা',
    matchLanguageLabel: 'ভাষাসমূহ',
    btnRequestCaregiver: 'প্রাপ্যতা জানতে চান',
    summaryTitle: 'কেয়ার নেভিগেশন সারাংশ',
    summaryTimestamp: 'তৈরির সময়',
    summaryCopyBtn: 'সারাংশ কপি করুন',
    summaryPrintBtn: 'প্রিন্ট / পিডিএফ সংরক্ষণ',
    voiceModulationLabel: 'ভয়েস মড্যুলেশন (কণ্ঠস্বর নিয়ন্ত্রণ)',
    voiceSpeed: 'কথা বলার গতি',
    voicePitch: 'কণ্ঠের সুর (পিচ)',
    voicePersona: 'কণ্ঠস্বর ধরণ',
    btnListenAloud: 'কণ্ঠে শুনুন',
    btnStopAudio: 'থামান'
  },
  mr: {
    appName: 'केअरकंपास (CareCompass)',
    tagline: 'आरोग्य मार्गदर्शन आणि गैर-वैद्यकीय काळजीवाहक शोध',
    disclaimerBanner:
      'केअरकंपास हा केवळ मार्गदर्शनासाठीचा एक प्रोटोटाइप आहे, वैद्यकीय निदान किंवा आपत्कालीन सेवा नाही. आणीबाणीच्या परिस्थितीत त्वरित ११२ किंवा स्थानिक आपत्कालीन क्रमांकावर संपर्क साधा.',
    navGuidance: 'मार्गदर्शन मिळवा',
    navCaregivers: 'केअरगिव्हर शोधा',
    navSafety: 'सुरक्षा आणि चाचणी',
    navPrivacy: 'गोपनीयता आणि मर्यादा',
    navDemo: 'डेमो परिस्थिती',
    btnStartGuidance: 'काळजी मार्गदर्शन सुरू करा',
    btnExploreCaregivers: 'काळजीवाहक शोधा',
    heroHeadline: 'सोप्या भाषेत विश्वासार्ह आरोग्य मार्गदर्शन.',
    heroSubheadline:
      'तुम्ही किंवा कुटुंबातील व्यक्ती काय अनुभवत आहात ते सांगा. आम्ही आधी आणीबाणीच्या लक्षणांची तपासणी करतो आणि नंतर योग्य काळजी सुचवतो.',
    trustWhatIs: '✓ कोणत्याही सल्ल्यापूर्वी आणीबाणीची तपासणी\n✓ सोपी आणि पारदर्शक भाषा\n✓ पडताळणी केलेले घरगुती काळजीवाहक',
    trustWhatIsNot: '✗ आजाराचे निदान करत नाही\n✗ औषधे सुचवत नाही\n✗ डॉक्टरांच्या तपासणीचा पर्याय नाही',
    intakeTitle: 'तुमची समस्या किंवा गरज सांगा',
    intakeSubtitle: 'मराठीत मोकळेपणाने लिहा—कधी सुरू झाले, किती तीव्र आहे आणि कशा प्रकारची मदत हवी आहे.',
    intakePlaceholder: 'उदा: "माझ्या आजीला २ दिवसांपासून अशक्तपणा जाणवत आहे आणि घरात चालण्यासाठी आधाराची गरज आहे..."',
    intakeMicBtn: 'व्हॉइस इनपुट (पर्यायी)',
    intakeMicListening: 'ऐकत आहे... (बोला)',
    intakeVoiceConsent: 'आवाज केवळ तुमच्या ब्राउझरमध्ये प्रक्रिया केला जातो, कुठेही सेव्ह केला जात नाही.',
    intakeSubmitBtn: 'सुरक्षित पुढचे पाऊल तपासा',
    intakeClearBtn: 'साफ करा',
    privacyBadge: 'कोणतीही वैयक्तिक आरोग्य माहिती कायमस्वरूपी साठवली जात नाही.',
    followUpTitle: 'सुरक्षेसाठी काही छोटे प्रश्न',
    followUpSubtitle: 'योग्य आणि सुरक्षित मार्गदर्शनासाठी या प्रश्नांची उत्तरे द्या.',
    followUpProgress: 'टप्पा {current} / {total}',
    btnBack: 'मागे',
    btnNext: 'पुढे चला',
    btnNotSure: 'नक्की माहिती नाही / सांगू इच्छित नाही',
    emergencyTitle: 'आणीबाणीचे धोक्याचे संकेत',
    emergencySubtitle: 'तुमच्या माहितीत गंभीर लक्षणे आढळली आहेत, ज्यासाठी विलंब न करता तात्काळ वैद्यकीय मदतीची गरज आहे.',
    emergencyDialIndia: '११२ वर कॉल करा (आपत्कालीन सेवा)',
    emergencyIntlNote: 'भारताबाहेर असल्यास स्थानिक आपत्कालीन क्रमांकावर संपर्क साधा (उदा. अमेरिकेत ९११, ब्रिटनमध्ये ९९९).',
    emergencyActionHeader: 'तात्काळ सुरक्षा सूचना',
    emergencyCaregiverNotice: 'आणीबाणीच्या स्थितीत काळजीवाहक शोधणे थांबवले आहे. तात्काळ रुग्णवाहिका आणि डॉक्टरांकडे लक्ष द्या.',
    triageResultTitle: 'आरोग्य मार्गदर्शन शिफारस',
    urgencyLabel: 'निकडीची पातळी',
    careTypeLabel: 'काळजीचा प्रकार',
    timeframeLabel: 'सुचवलेली वेळ',
    reasonsLabel: 'ही शिफारस का करण्यात आली',
    uncertaintyLabel: 'अनिश्चितता आणि व्याप्ती',
    nextStepsLabel: 'पुढील आवश्यक कृती',
    btnViewCaregivers: 'पात्र काळजीवाहक प्रोफाइल पहा',
    btnReviewSummary: 'तपशील पहा आणि सेव्ह करा',
    btnStartOver: 'नवीन सत्र सुरू करा',
    matchTitle: 'योग्य गैर-वैद्यकीय काळजीवाहक',
    matchSubtitle: 'पारदर्शक गुण: कौशल्ये (४०%), उपलब्धता (२५%), परिसर (२०%), आणि भाषा (१५%).',
    matchScoreLabel: 'मॅच स्कोअर',
    matchSkillsLabel: 'कौशल्ये आणि सेवा',
    matchAreaLabel: 'सेवा परिसर',
    matchAvailabilityLabel: 'उपलब्धता',
    matchLanguageLabel: 'भाषा',
    btnRequestCaregiver: 'उपलब्धता विचारा',
    summaryTitle: 'केअर नेव्हिगेशन सारांश',
    summaryTimestamp: 'वेळ आणि दिनांक',
    summaryCopyBtn: 'सारांश कॉपी करा',
    summaryPrintBtn: 'प्रिंट / पीडीएफ सेव्ह करा',
    voiceModulationLabel: 'व्हॉइस मॉड्युलेशन (आवाज नियंत्रण)',
    voiceSpeed: 'बोलण्याचा वेग',
    voicePitch: 'आवाजाची पट्टी (पिच)',
    voicePersona: 'आवाजाचा बाज',
    btnListenAloud: 'आवाजात ऐका',
    btnStopAudio: 'थांबवा'
  },
  ta: {
    appName: 'கேர்காம்பஸ் (CareCompass)',
    tagline: 'சுகாதார வழிகாட்டுதல் மற்றும் மருத்துவமற்ற பராமரிப்பாளர் இணைப்பு',
    disclaimerBanner:
      'கேர்காம்பஸ் என்பது பராமரிப்பு வழிகாட்டுதலுக்கான ஒரு முன்மாதிரி மட்டுமே, மருத்துவ நோயறிதல் அல்லது அவசர சேவை அல்ல. அவசரநிலைக்கு உடனே 112 அல்லது உள்ளூர் அவசர எண்ணை அழைக்கவும்.',
    navGuidance: 'வழிகாட்டுதல் பெறுங்கள்',
    navCaregivers: 'பராமரிப்பாளர் தேடுங்கள்',
    navSafety: 'பாதுகாப்பு & சோதனை',
    navPrivacy: 'தனியுரிமை & எல்லைகள்',
    navDemo: 'டெமோ காட்சிகள்',
    btnStartGuidance: 'பராமரிப்பு வழிகாட்டலைத் தொடங்கவும்',
    btnExploreCaregivers: 'பராமரிப்பாளர்களைக் கண்டறியவும்',
    heroHeadline: 'எளிய மொழியில் நம்பகமான சுகாதார வழிகாட்டுதல்.',
    heroSubheadline:
      'நீங்கள் அல்லது உங்கள் குடும்பத்தினர் என்ன உணர்கிறீர்கள் என்பதை விவரிக்கவும். முதலில் அவசர அறிகுறிகளைச் சரிபார்த்து, சரியான அடுத்த படியை பரிந்துரைக்கிறோம்.',
    trustWhatIs: '✓ அவசர அறிகுறிகளை முன்கூட்டியே சரிபார்த்தல்\n✓ எளிய மற்றும் வெளிப்படையான விளக்கம்\n✓ சரிபார்க்கப்பட்ட வீட்டுப் பராமரிப்பாளர்கள்',
    trustWhatIsNot: '✗ மருத்துவ நோயறிதலை வழங்காது\n✗ மருந்துகளை பரிந்துரைக்காது\n✗ மருத்துவரின் ஆய்வுக்கு மாற்றாகாது',
    intakeTitle: 'உங்கள் பிரச்சனை அல்லது தேவையை விவரிக்கவும்',
    intakeSubtitle: 'தமிழில் தெளிவாக எழுதுங்கள்—எப்போது தொடங்கியது, எவ்வளவு தீவிரமாக உள்ளது மற்றும் என்ன உதவி தேவை.',
    intakePlaceholder: 'எ.கா: "என் பாட்டிக்கு கடந்த 2 நாட்களாக பலவீனம் உள்ளது, வீட்டில் நடக்க உதவி தேவைப்படுகிறது..."',
    intakeMicBtn: 'குரல் உள்ளீடு (விருப்பமானது)',
    intakeMicListening: 'கேட்கிறது... (பேசவும்)',
    intakeVoiceConsent: 'குரல் உங்கள் உலாவியில் மட்டுமே செயலாக்கப்படுகிறது, ஆடியோ சேமிக்கப்படுவதில்லை.',
    intakeSubmitBtn: 'பாதுகாப்பான அடுத்த படியை சரிபார்க்கவும்',
    intakeClearBtn: 'அழிக்கவும்',
    privacyBadge: 'எந்தவொரு தனிப்பட்ட சுகாதார தகவலும் நிரந்தரமாக சேமிக்கப்படுவதில்லை.',
    followUpTitle: 'பாதுகாப்பிற்கான சில சுருக்கமான கேள்விகள்',
    followUpSubtitle: 'பாதுகாப்பான பரிந்துரையை உறுதிப்படுத்த இந்தக் கேள்விகளுக்கு பதிலளிக்கவும்.',
    followUpProgress: 'படி {current} / {total}',
    btnBack: 'பின்செல்',
    btnNext: 'அடுத்து',
    btnNotSure: 'உறுதியாக தெரியவில்லை / தவிர்க்கவும்',
    emergencyTitle: 'அவசர ஆபத்து அடையாளம் காணப்பட்டது',
    emergencySubtitle: 'உங்கள் விளக்கத்தில் உடனடி அவசர மருத்துவ சிகிச்சை தேவைப்படும் அறிகுறிகள் உள்ளன.',
    emergencyDialIndia: '112-ஐ அழைக்கவும் (அவசர உதவி)',
    emergencyIntlNote: 'இந்தியாவிற்கு வெளியே இருந்தால் உங்கள் உள்ளூர் அவசர எண்ணை (அமெரிக்காவில் 911, இங்கிலாந்தில் 999) அழைக்கவும்.',
    emergencyActionHeader: 'உடனடி பாதுகாப்பு வழிமுறைகள்',
    emergencyCaregiverNotice: 'அவசரநிலையின் போது பராமரிப்பாளர் தேடல் முடக்கப்பட்டுள்ளது. உடனடியாக அவசர மருத்துவ சேவையை நாடவும்.',
    triageResultTitle: 'பராமரிப்பு வழிகாட்டுதல் பரிந்துரை',
    urgencyLabel: 'அவசர நிலை',
    careTypeLabel: 'பராமரிப்பு வகை',
    timeframeLabel: 'பரிந்துரைக்கப்பட்ட கால அளவு',
    reasonsLabel: 'இது ஏன் பரிந்துரைக்கப்பட்டது',
    uncertaintyLabel: 'நிச்சயமற்ற தன்மை & எல்லைகள்',
    nextStepsLabel: 'அடுத்த கட்ட நடவடிக்கைகள்',
    btnViewCaregivers: 'தகுதியான பராமரிப்பாளர்களைப் பார்க்கவும்',
    btnReviewSummary: 'சுருக்கத்தைப் பார்த்து சேமிக்கவும்',
    btnStartOver: 'புதிய அமர்வைத் தொடங்கவும்',
    matchTitle: 'பொருத்தமான மருத்துவமற்ற பராமரிப்பாளர்கள்',
    matchSubtitle: 'வெளிப்படையான மதிப்பீடு: திறன் (40%), கிடைக்கும் நேரம் (25%), பகுதி (20%), மற்றும் மொழி (15%).',
    matchScoreLabel: 'பொருத்த மதிப்பெண்',
    matchSkillsLabel: 'திறன்கள் மற்றும் சேவைகள்',
    matchAreaLabel: 'சேவை பகுதி',
    matchAvailabilityLabel: 'கிடைக்கும் தன்மை',
    matchLanguageLabel: 'மொழிகள்',
    btnRequestCaregiver: 'கிடைக்கும் தன்மையை விசாரிக்கவும்',
    summaryTitle: 'பராமரிப்பு வழிகாட்டல் சுருக்கம்',
    summaryTimestamp: 'உருவாக்கப்பட்ட நேரம்',
    summaryCopyBtn: 'சுருக்கத்தை நகலெடுக்கவும்',
    summaryPrintBtn: 'அச்சிடவும் / PDF சேமிக்கவும்',
    voiceModulationLabel: 'குரல் பண்பேற்றம் (Voice Modulation)',
    voiceSpeed: 'பேசும் வேகம்',
    voicePitch: 'குரல் சுருதி (Pitch)',
    voicePersona: 'குரல் பாணி',
    btnListenAloud: 'குரலில் கேட்கவும்',
    btnStopAudio: 'நிறுத்தவும்'
  }
};
