import { FollowUpQuestion, SymptomMention } from '../types/index.ts';

const QUESTION_BANK: FollowUpQuestion[] = [
  {
    id: 'q-chest-cardiac',
    symptomConceptTarget: 'chest_pain',
    questionText: 'Does the chest discomfort spread anywhere, or is it accompanied by sweating, nausea, or shortness of breath?',
    questionTextHi: 'क्या सीने का दर्द कंधे या बांह तक फैल रहा है, या साथ में पसीना और सांस फूल रही है?',
    questionTextHinglish: 'Kya chest pain baanh tak fail raha hai, ya cold sweat aur breathlessness ho rahi hai?',
    questionTextBn: 'বুকের অস্বস্তি কি বাহু বা চোয়ালে ছড়িয়ে পড়ছে, অথবা সঙ্গে ঘাম ও শ্বাসকষ্ট হচ্ছে?',
    questionTextMr: 'छातीतील दुखणे खांद्याकडे किंवा हाताकडे पसरत आहे का, किंवा सोबत घाम व श्वास लागणे आहे का?',
    questionTextTa: 'மார்பு வலி தோள் அல்லது கைக்கு பரவுகிறதா, அல்லது கூடவே வியர்வை மற்றும் மூச்சுத்திணறல் உள்ளதா?',
    purposeReason: 'Helps identify urgent cardiac indicators requiring immediate emergency intervention.',
    allowsNotSure: true,
    options: [
      {
        value: 'radiating_sweating',
        label: 'Yes, spreads to arm/jaw or accompanied by cold sweat',
        labelHi: 'हाँ, बांह/जबड़े तक फैल रहा है या पसीना आ रहा है',
        labelHinglish: 'Haan, arm/jaw tak ja raha hai ya cold sweat hai',
        labelBn: 'হ্যাঁ, বাহু বা চোয়ালে ছড়িয়ে পড়ছে এবং ঠান্ডা ঘাম হচ্ছে',
        labelMr: 'होय, हाताकडे/हनुवटीकडे पसरत आहे आणि घाम येत आहे',
        labelTa: 'ஆம், கை/தாடைக்கு பரவுகிறது மற்றும் குளிர்ந்த வியர்வை உள்ளது',
        isRedFlagTrigger: true,
        urgencyWeight: 10
      },
      {
        value: 'sharp_with_movement',
        label: 'No, it feels like muscle soreness when moving or pressing',
        labelHi: 'नहीं, केवल छूने या मुड़ने पर मांसपेशियों में दर्द है',
        labelHinglish: 'Nahi, sirf move karne par muscle soreness jaisa hai',
        labelBn: 'না, কেবল নড়াচড়া বা চাপ দিলে মাংসপেশির ব্যথা মনে হয়',
        labelMr: 'नाही, केवळ हालचाल करताना किंवा दाबल्यावर स्नायूंचे दुखणे वाटते',
        labelTa: 'இல்லை, அசையும்போது அல்லது அழுத்தும்போது தசை வலி போல் உள்ளது',
        isRedFlagTrigger: false,
        urgencyWeight: 2
      },
      {
        value: 'not_sure',
        label: 'Not sure / Prefer not to say',
        labelHi: 'निश्चित नहीं / नहीं बताना चाहते',
        labelHinglish: 'Not sure / Confirm nahi bol sakte',
        labelBn: 'নিশ্চিত নই / বলতে চাই না',
        labelMr: 'नक्की माहिती नाही / सांगू इच्छित नाही',
        labelTa: 'உறுதியாக தெரியவில்லை / தவிர்க்கவும்',
        isRedFlagTrigger: false,
        urgencyWeight: 3
      }
    ]
  },
  {
    id: 'q-breath-onset',
    symptomConceptTarget: 'shortness_of_breath',
    questionText: 'How quickly did the breathing trouble start, and can you speak in normal full sentences?',
    questionTextHi: 'सांस की तकलीफ कितनी तेजी से शुरू हुई, और क्या आप पूरे वाक्य बोल पा रहे हैं?',
    questionTextHinglish: 'Breathing problem kitni fast shuru hui, aur kya normal sentences bol pa rahe hain?',
    questionTextBn: 'শ্বাসকষ্ট কতটা দ্রুত শুরু হয়েছে, এবং আপনি কি স্বাভাবিকভাবে পুরো বাক্য বলতে পারছেন?',
    questionTextMr: 'श्वास घेण्यास त्रास किती वेगाने सुरू झाला, आणि तुम्ही पूर्ण वाक्य बोलू शकता का?',
    questionTextTa: 'மூச்சுத்திணறல் எவ்வளவு விரைவாகத் தொடங்கியது, சாதாரண முழு வாக்கியங்களைப் பேச முடிகிறதா?',
    purposeReason: 'Distinguishes between critical acute respiratory compromise and manageable symptoms.',
    allowsNotSure: true,
    options: [
      {
        value: 'acute_cannot_speak',
        label: 'Came on very suddenly, gasping, cannot speak full sentences',
        labelHi: 'बहुत अचानक शुरू हुआ, हांफ रहे हैं, पूरे वाक्य नहीं बोल पा रहे',
        labelHinglish: 'Bohot suddenly hua, gasping, full sentence nahi bol pa rahe',
        labelBn: 'হঠাৎ শুরু হয়েছে, হাঁপাচ্ছেন, পুরো বাক্য বলতে পারছেন না',
        labelMr: 'अचानक सुरू झाले, धाप लागली आहे, पूर्ण वाक्य बोलता येत नाही',
        labelTa: 'திடீரெனத் தொடங்கியது, மூச்சுத்திணறல், முழு வாக்கியங்களைப் பேச முடியவில்லை',
        isRedFlagTrigger: true,
        urgencyWeight: 10
      },
      {
        value: 'gradual_can_speak',
        label: 'Gradual over several days with mild cold, can speak normally',
        labelHi: 'कई दिनों में धीरे-धीरे शुरू हुआ, सामान्य रूप से बोल पा रहे हैं',
        labelHinglish: 'Dheere dheere hua cold ke sath, normal bol pa rahe hain',
        labelBn: 'কয়েক দিন ধরে সর্দির সাথে ধীরে ধীরে শুরু হয়েছে, স্বাভাবিক কথা বলতে পারছি',
        labelMr: 'थोड्या सर्दीसोबत हळूहळू सुरू झाले, व्यवस्थित बोलता येत आहे',
        labelTa: 'லேசான சளியுடன் மெதுவாகத் தொடங்கியது, சாதாரணமாகப் பேச முடிகிறது',
        isRedFlagTrigger: false,
        urgencyWeight: 2
      },
      {
        value: 'not_sure',
        label: 'Not sure',
        labelHi: 'निश्चित नहीं',
        labelHinglish: 'Not sure',
        labelBn: 'নিশ্চিত নই',
        labelMr: 'नक्की माहिती नाही',
        labelTa: 'உறுதியாக தெரியவில்லை',
        isRedFlagTrigger: false,
        urgencyWeight: 3
      }
    ]
  },
  {
    id: 'q-headache-neuro',
    symptomConceptTarget: 'headache',
    questionText: 'Did this headache begin suddenly like a "thunderclap", or is it accompanied by a stiff neck, high fever, or vision loss?',
    questionTextHi: 'क्या यह सिरदर्द बिजली के झटके की तरह अचानक हुआ, या गर्दन में अकड़न या धुंधला दिख रहा है?',
    questionTextHinglish: 'Kya ye headache sudden thunderclap jaisa shuru hua, ya neck stiffness aur vision problem hai?',
    questionTextBn: 'এই মাথাব্যথা কি হঠাৎ তীব্রভাবে শুরু হয়েছে, অথবা ঘাড় শক্ত বা দৃষ্টিহীনতা আছে?',
    questionTextMr: 'डोकेदुखी अचानक विजेसारखी तीव्र सुरू झाली का, किंवा मान कडक झाली आहे का?',
    questionTextTa: 'தலைவலி திடீரென இடி போல் தோன்றியதா, அல்லது கழுத்து விரைப்பு மற்றும் பார்வை மங்கலாக உள்ளதா?',
    purposeReason: 'Screens for intracranial hemorrhage or meningitis red flags.',
    allowsNotSure: true,
    options: [
      {
        value: 'thunderclap_or_neuro',
        label: 'Yes, sudden unbearable peak within seconds, or stiff neck with fever',
        labelHi: 'हाँ, कुछ ही सेकंड में असहनीय दर्द, या गर्दन में अकड़न के साथ बुखार',
        labelHinglish: 'Haan, sudden unbearable pain seconds me, ya stiff neck aur fever',
        labelBn: 'হ্যাঁ, কয়েক সেকেন্ডের মধ্যে অসহ্য তীব্র ব্যথা, বা জ্বরের সাথে ঘাড় শক্ত',
        labelMr: 'होय, काही सेकंदात असह्य डोकेदुखी किंवा मानेच्या कडकपणासह ताप',
        labelTa: 'ஆம், நொடிகளில் தாங்க முடியாத உச்ச வலி அல்லது காய்ச்சலுடன் கழுத்து விரைப்பு',
        isRedFlagTrigger: true,
        urgencyWeight: 10
      },
      {
        value: 'steady_dull',
        label: 'No, mild to moderate steady tension or sinus pressure',
        labelHi: 'नहीं, हल्का या मध्यम तनाव/साइनस का दबाव',
        labelHinglish: 'Nahi, mild to moderate routine tension headache',
        labelBn: 'না, হালকা বা মাঝারি নিয়মিত টান বা সাইনাসের চাপ',
        labelMr: 'नाही, सौम्य किंवा मध्यम नेहमीचा ताण किंवा सायनसचा दाब',
        labelTa: 'இல்லை, லேசான அல்லது மிதமான தசை இறுக்கம்/சைனஸ் அழுத்தம்',
        isRedFlagTrigger: false,
        urgencyWeight: 1
      },
      {
        value: 'not_sure',
        label: 'Not sure',
        labelHi: 'निश्चित नहीं',
        labelHinglish: 'Not sure',
        labelBn: 'নিশ্চিত নই',
        labelMr: 'नक्की माहिती नाही',
        labelTa: 'உறுதியாக தெரியவில்லை',
        isRedFlagTrigger: false,
        urgencyWeight: 2
      }
    ]
  },
  {
    id: 'q-wound-bleed',
    symptomConceptTarget: 'wound_cut',
    questionText: 'Is the cut still bleeding actively, or has direct pressure stopped the bleeding?',
    questionTextHi: 'क्या घाव से अभी भी खून बह रहा है, या पट्टी/दबाव से रुक गया है?',
    questionTextHinglish: 'Kya wound se abhi bhi bleeding ho rahi hai, ya pressure se ruk gayi hai?',
    questionTextBn: 'ক্ষতস্থান থেকে কি এখনো রক্ত ঝরছে, নাকি চাপে রক্ত বন্ধ হয়েছে?',
    questionTextMr: 'जखमेतून अजूनही रक्त वाहत आहे का, की दाब दिल्यावर थांबले आहे?',
    questionTextTa: 'வெட்டுக்காயத்தில் இன்னும் தீவிர இரத்தப்போக்கு உள்ளதா, அல்லது அழுத்தத்தால் நின்றதா?',
    purposeReason: 'Differentiates between arterial hemorrhage and stable lacerations needing stitches.',
    allowsNotSure: true,
    options: [
      {
        value: 'arterial_unstopped',
        label: 'Still spurting or bleeding through bandages despite pressure',
        labelHi: 'लगातार बह रहा है और पट्टी से खून बाहर आ रहा है',
        labelHinglish: 'Abhi bhi blood ruk nahi raha heavy pressure ke baad bhi',
        labelBn: 'এখনো ফোয়ারার মতো রক্ত বের হচ্ছে বা ব্যান্ডেজ ভিজে যাচ্ছে',
        labelMr: 'अजूनही रक्त थांबत नाहीये आणि पट्टी भिजून वाहत आहे',
        labelTa: 'அழுத்தியும் கட்டு வழியாக இரத்தம் தொடர்ந்து பீறிட்டு வழிகிறது',
        isRedFlagTrigger: true,
        urgencyWeight: 10
      },
      {
        value: 'bleeding_stopped_gaping',
        label: 'Bleeding has stopped, but the edges are separated / gaping',
        labelHi: 'खून रुक गया है, लेकिन घाव खुला हुआ है (टांकों की जरूरत हो सकती है)',
        labelHinglish: 'Bleeding ruk gayi hai, but cut gaping hai stitches lag sakte hain',
        labelBn: 'রক্ত বন্ধ হয়েছে, কিন্তু ক্ষতের মুখ খোলা (সেলাই লাগতে পারে)',
        labelMr: 'रक्त थांबले आहे, पण जखम उघडी पडली आहे (टाके लागू शकतात)',
        labelTa: 'இரத்தப்போக்கு நின்றுவிட்டது, ஆனால் காயம் பிளந்து காணப்படுகிறது (தையல் தேவைப்படலாம்)',
        isRedFlagTrigger: false,
        urgencyWeight: 5
      },
      {
        value: 'minor_scratch',
        label: 'Minor superficial scrape, bleeding completely stopped',
        labelHi: 'हल्की खरोंच, खून पूरी तरह रुक चुका है',
        labelHinglish: 'Minor superficial cut, bleeding totally stopped',
        labelBn: 'সামান্য আঁচড়, রক্ত সম্পূর্ণ বন্ধ হয়েছে',
        labelMr: 'किरकोळ खरचटणे, रक्त पूर्णपणे थांबले आहे',
        labelTa: 'லேசான சிராய்ப்பு, இரத்தம் முற்றிலும் நின்றுவிட்டது',
        isRedFlagTrigger: false,
        urgencyWeight: 1
      }
    ]
  },
  {
    id: 'q-elderly-support-need',
    symptomConceptTarget: 'elderly_mobility',
    questionText: 'What kind of day-to-day assistance is primarily needed for the person?',
    questionTextHi: 'व्यक्ति को मुख्य रूप से किस प्रकार की दैनिक सहायता की आवश्यकता है?',
    questionTextHinglish: 'Person ko mainly kis tarah ki daily support ki zaroorat hai?',
    questionTextBn: 'ব্যক্তির প্রধানত কোন ধরনের দৈনন্দিন সহায়তার প্রয়োজন?',
    questionTextMr: 'व्यक्तीला प्रामुख्याने कोणत्या प्रकारच्या दैनंदिन मदतीची गरज आहे?',
    questionTextTa: 'அந்த நபருக்கு முக்கியமாக என்ன வகையான அன்றாட உதவி தேவைப்படுகிறது?',
    purposeReason: 'Aligns the request with non-clinical caregiver skill profiles.',
    allowsNotSure: true,
    options: [
      {
        value: 'mobility_and_chores',
        label: 'Walking assistance, wheelchair transfers, meals, and gentle companionship',
        labelHi: 'चलने-फिरने में मदद, भोजन, और देखभाल',
        labelHinglish: 'Walking support, meals, bathroom assistance, aur companionship',
        labelBn: 'হাঁটাহাঁটিতে সাহায্য, খাবার তৈরি এবং সঙ্গদান',
        labelMr: 'चालण्यास मदत, जेवण बनवणे आणि आदरपूर्वक सोबत',
        labelTa: 'நடக்க உதவி, சக்கர நாற்காலி மாற்றம், உணவு மற்றும் துணை',
        isRedFlagTrigger: false,
        urgencyWeight: 1
      },
      {
        value: 'memory_dementia',
        label: 'Memory support, gentle routine reminders, and wandering prevention',
        labelHi: 'याददाश्त में मदद, दैनिक दिनचर्या और सुरक्षा',
        labelHinglish: 'Memory care, routine reminders, aur safe supervision',
        labelBn: 'স্মৃতিশক্তি দুর্বলতায় সাহায্য, ওষুধ ও রুটিন স্মরণ করিয়ে দেওয়া',
        labelMr: 'स्मरणशक्ती मदत, दैनंदिन स्मरणपत्रे आणि सुरक्षित देखरेख',
        labelTa: 'நினைவாற்றல் ஆதரவு, அன்றாட நினைவூட்டல் மற்றும் பாதுகாப்பு',
        isRedFlagTrigger: false,
        urgencyWeight: 2
      },
      {
        value: 'sudden_paralysis',
        label: 'Sudden loss of movement today with confusion (recent acute change)',
        labelHi: 'आज अचानक चलने में असमर्थता और भ्रम की स्थिति',
        labelHinglish: 'Aaj sudden movement ruk gayi aur confusion ho gaya',
        labelBn: 'আজ হঠাৎ নড়াচড়ার ক্ষমতা হারানো এবং বিভ্রান্তি',
        labelMr: 'आज अचानक हालचाल बंद होणे आणि गोंधळलेली स्थिती',
        labelTa: 'இன்று திடீரென அசைவு இழப்பு மற்றும் குழப்பம்',
        isRedFlagTrigger: true,
        urgencyWeight: 10
      }
    ]
  }
];

export function selectFollowUpQuestions(
  extractedSymptoms: SymptomMention[],
  alreadyTriggeredEmergency: boolean
): FollowUpQuestion[] {
  // RULE: NEVER DELAY EMERGENCY GUIDANCE
  if (alreadyTriggeredEmergency) {
    return [];
  }

  // Filter positive (non-negated) symptoms
  const positiveSymptoms = extractedSymptoms.filter(s => !s.isNegated);

  if (positiveSymptoms.length === 0) {
    // If no specific symptom was detected, return a general baseline clarifying question
    return [
      {
        id: 'q-general-acuity',
        symptomConceptTarget: 'general',
        questionText: 'Are you experiencing any sudden severe pain, weakness, difficulty breathing, or bleeding right now?',
        questionTextHi: 'क्या आप इस समय किसी अचानक तेज दर्द, कमजोरी, सांस लेने में परेशानी या खून बहने का अनुभव कर रहे हैं?',
        questionTextHinglish: 'Kya is waqt koi sudden severe pain, weakness, saans ki takleef ya bleeding ho rahi hai?',
        questionTextBn: 'আপনি কি এই মুহূর্তে কোনো হঠাৎ তীব্র ব্যথা, দুর্বলতা, শ্বাসকষ্ট বা রক্তপাত অনুভব করছেন?',
        questionTextMr: 'तुम्हाला सध्या कोणतीही अचानक तीव्र वेदना, अशक्तपणा, श्वास घेण्यास त्रास किंवा रक्तस्त्राव होत आहे का?',
        questionTextTa: 'நீங்கள் தற்போது திடீர் கடுமையான வலி, பலவீனம், மூச்சுத்திணறல் அல்லது இரத்தப்போக்கை உணர்கிறீர்களா?',
        purposeReason: 'Ensures immediate safety before exploring routine options.',
        allowsNotSure: true,
        options: [
          {
            value: 'severe_acute',
            label: 'Yes, symptoms feel sudden and severe',
            labelHi: 'हाँ, लक्षण अचानक और गंभीर लग रहे हैं',
            labelHinglish: 'Haan, symptoms sudden aur severe lag rahe hain',
            labelBn: 'হ্যাঁ, লক্ষণগুলো হঠাৎ এবং তীব্র',
            labelMr: 'होय, लक्षणे अचानक आणि तीव्र वाटत आहेत',
            labelTa: 'ஆம், அறிகுறிகள் திடீரென மற்றும் தீவிரமாக உள்ளன',
            isRedFlagTrigger: true,
            urgencyWeight: 8
          },
          {
            value: 'mild_gradual',
            label: 'No, symptoms are mild or ongoing for several days/weeks',
            labelHi: 'नहीं, लक्षण हल्के हैं या कई दिनों/सप्ताहों से चल रहे हैं',
            labelHinglish: 'Nahi, symptoms mild hain ya kuch dino se chal rahe hain',
            labelBn: 'না, লক্ষণগুলো মৃদু বা কয়েক দিন/সপ্তাহ ধরে চলছে',
            labelMr: 'नाही, लक्षणे सौम्य आहेत किंवा काही दिवसांपासून सुरू आहेत',
            labelTa: 'இல்லை, அறிகுறிகள் லேசானவை அல்லது சில நாட்களாக உள்ளன',
            isRedFlagTrigger: false,
            urgencyWeight: 1
          },
          {
            value: 'not_sure',
            label: 'Not sure',
            labelHi: 'निश्चित नहीं',
            labelHinglish: 'Not sure',
            labelBn: 'নিশ্চিত নই',
            labelMr: 'नक्की माहिती नाही',
            labelTa: 'உறுதியாக தெரியவில்லை',
            isRedFlagTrigger: false,
            urgencyWeight: 3
          }
        ]
      }
    ];
  }

  const selectedQuestions: FollowUpQuestion[] = [];

  for (const sym of positiveSymptoms) {
    const matchingQ = QUESTION_BANK.find(q => q.symptomConceptTarget === sym.concept);
    if (matchingQ && !selectedQuestions.some(sq => sq.id === matchingQ.id)) {
      selectedQuestions.push(matchingQ);
    }
  }

  // Limit to at most 2 targeted questions to avoid cognitive burden
  return selectedQuestions.slice(0, 2);
}
