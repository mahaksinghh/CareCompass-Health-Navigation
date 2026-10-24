# CareCompass REST API Documentation

Base URL: `http://localhost:3000`

All endpoints return JSON responses. Standard HTTP status codes are employed.

---

## 1. System Health & Metadata

### `GET /health`
Returns runtime status and AI model readiness.
```json
{
  "status": "healthy",
  "service": "CareCompass Navigation API",
  "version": "1.2.0",
  "geminiAvailable": true,
  "timestamp": "2026-10-24T01:30:00.000Z"
}
```

### `GET /api/v1/languages`
Returns supported natural languages and dictionary examples.
```json
{
  "supported": [
    { "code": "en", "name": "English", "nativeName": "English", "status": "full" },
    { "code": "hi", "name": "Hindi", "nativeName": "हिन्दी", "status": "full" },
    { "code": "hinglish", "name": "Hinglish", "nativeName": "Hinglish (Colloquial)", "status": "full" }
  ]
}
```

---

## 2. Intake & Symptom Parsing

### `POST /api/v1/intake/parse`
Normalizes free-text health concerns into structured mentions with negation detection.

**Request Body:**
```json
{
  "rawText": "I have had a mild headache for 2 days. I have NO chest pain and NO breathing trouble.",
  "language": "en"
}
```

**Response Body:**
```json
{
  "extractedSymptoms": [
    {
      "id": "sym-headache-1",
      "concept": "headache",
      "displayName": "Headache",
      "isNegated": false,
      "severityReported": "mild",
      "durationReported": "2 days",
      "confidence": 0.92
    },
    {
      "id": "sym-chest_pain-2",
      "concept": "chest_pain",
      "displayName": "Chest pain or pressure",
      "isNegated": true,
      "confidence": 0.92
    }
  ],
  "confidenceOverall": 0.88,
  "ambiguitiesIdentified": [],
  "suggestedClarifications": []
}
```

---

## 3. Targeted Follow-Up Questions

### `POST /api/v1/intake/follow-up`
Returns at most 1–2 safety questions targeted to reported symptoms.

**Request Body:**
```json
{
  "extractedSymptoms": [ ... ],
  "alreadyTriggeredEmergency": false
}
```

**Response Body:**
```json
{
  "total": 1,
  "questions": [
    {
      "id": "q-headache-neuro",
      "symptomConceptTarget": "headache",
      "questionText": "Did this headache begin suddenly like a thunderclap, or is it accompanied by a stiff neck, high fever, or vision loss?",
      "purposeReason": "Screens for intracranial hemorrhage or meningitis red flags.",
      "allowsNotSure": true,
      "options": [ ... ]
    }
  ]
}
```

---

## 4. Care-Routing Triage Engine

### `POST /api/v1/triage/evaluate`
Executes pre-AI deterministic red-flag safety rules first, then computes provisional care routing.

**Request Body:**
```json
{
  "language": "en",
  "intakeText": "Grandmother needs support walking and cooking meals at home.",
  "extractedSymptoms": [ ... ],
  "followUpAnswers": [ ... ]
}
```

**Response Body:**
```json
{
  "status": "SUCCESS",
  "urgencyLevel": "NON_CLINICAL_SUPPORT",
  "careType": "NON_CLINICAL_CAREGIVER_SUPPORT",
  "isEmergency": false,
  "redFlagsTriggered": [],
  "reasonCodes": ["RC-NON-CLINICAL-SUPPORT-IDENTIFIED"],
  "userFacingExplanation": "Your request focuses on daily living assistance, mobility support, and companionship...",
  "uncertaintyMessage": "Caregiver matches are based on reported non-medical needs...",
  "uncertaintyLevel": "LOW",
  "timeframeRecommendation": "Coordinate as convenient (Next 1–3 days)",
  "nextSteps": [ ... ],
  "engineVersion": "v1.2.0-deterministic",
  "disclaimer": "CareCompass is a care-navigation prototype...",
  "canOfferCaregivers": true
}
```

---

## 5. Caregiver Matching Engine

### `POST /api/v1/caregivers/match`
Ranks eligible fictional caregiver profiles using 4-factor explainable scoring. Strictly blocks matching for emergencies.

**Request Body:**
```json
{
  "urgencyLevel": "NON_CLINICAL_SUPPORT",
  "requiredSkills": ["elder_care", "mobility_assistance"],
  "preferredArea": "Delhi"
}
```

**Response Body:**
```json
{
  "allowedToMatch": true,
  "totalEligible": 4,
  "matches": [
    {
      "caregiver": {
        "caregiver_id": "CG-DEL-01",
        "display_name": "Sunita Sharma",
        "role": "Certified Senior Care Aide",
        "service_area": "South Delhi / NCR",
        "hourly_rate_est": "₹320 - ₹400 / hr"
      },
      "scoreBreakdown": {
        "skillFit": 40,
        "availabilityFit": 25,
        "areaFit": 20,
        "languageFit": 15,
        "totalScore": 100
      },
      "matchReasons": ["Matches 2 requested core skill(s)", "Servicing your target locality"]
    }
  ]
}
```

---

## 6. Safety Regression & Test Suite

### `POST /api/v1/safety/run-suite`
Executes all 20 synthetic safety regression test cases and outputs metrics.

```json
{
  "totalTests": 20,
  "passed": 20,
  "failed": 0,
  "emergencySensitivityPct": 100,
  "underTriageCount": 0,
  "avgLatencyMs": 1.2
}
```

### `GET /api/v1/safety/logs`
Returns the in-memory anonymized safety event audit log (contains zero patient health text or PII).
