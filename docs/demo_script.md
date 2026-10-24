# CareCompass: 2–3 Minute Presentation & Demo Script

Target Audience: Hackathon Judges, Clinical Evaluators, Product Reviewers  
Estimated Duration: 2 minutes 30 seconds

---

## 0:00 – 0:30 | Hook & Problem Definition
**Presenter**:  
"Good day. When people or their elderly parents face health concerns, search engines often terrify them with worst-case cancer diagnoses, while chatbot LLMs risk hallucinating dangerous medical advice.

Meet **CareCompass**—a safety-first care-navigation and caregiver-matching prototype designed for everyday families. It does *not* diagnose disease or prescribe drugs. Instead, it guides users to the appropriate care level and connects them with vetted non-clinical caregivers—with a strict deterministic safety gate that ensures artificial intelligence never compromises emergency triage."

---

## 0:30 – 1:00 | Journey 1: The Cardiac Emergency Gate
**Action**: Click **Demo Presets** in the top navigation and select **Chest Pain Emergency** (or type: *"Crushing heavy pressure in center of chest for past 20 minutes radiating to left arm and jaw, broke into cold sweat"*).

**Presenter**:  
"Watch what happens when an acute emergency symptom is entered.  
Immediately—in 1.2 milliseconds—the pre-AI deterministic red-flag rules engine intercepts the request.  
Notice:
1. No follow-up questions were asked—we never delay emergency life guidance.
2. The UI switches to an unmistakable emergency screen with immediate instructions to dial 112 in India (or 911/999 abroad).
3. Crucially, caregiver matching is **strictly suppressed**. A non-clinical caregiver must never be sent to a heart attack."

---

## 1:00 – 1:40 | Journey 2: Non-Clinical Elder Care & 4-Factor Matching
**Action**: Click **Start New Session**, then select **Elder Mobility Support** (or type: *"My 78-year-old grandmother is having trouble walking to the bathroom and needs daily meal prep and gentle mobility support. Denies chest pain or shortness of breath"*).

**Presenter**:  
"Now let's examine an elderly support scenario.
1. The engine screens for acute red flags and confirms this is safe for non-clinical home assistance.
2. A single targeted question clarifies specific daily needs (e.g., walking support, meals, or memory care).
3. The result recommends **Non-Clinical Caregiver Support** and offers eligible caregiver matches.
4. Each match displays an **explainable score breakdown**: Skill Fit (40%), Schedule Availability (25%), Service Area (20%), and Language Compatibility (15%).
5. Every profile clearly states its non-clinical scope—certified home companions who assist with daily living, not clinical procedures."

---

## 1:40 – 2:10 | Journey 3: Safety Rigor & Negation Handling
**Action**: Click on the **Safety & Evaluation** tab in the navigation bar. Click **Run Safety Regression Suite**.

**Presenter**:  
"Unlike black-box AI prototypes, CareCompass comes with a built-in automated clinical regression suite.  
With one click, 20 synthetic test cases are evaluated against our deterministic engine:
- **Red-Flag Sensitivity**: 100% across stroke, seizures, bleeding, anaphylaxis, and poisoning.
- **Under-Triage Count**: Exactly 0.
- **Negation Handling**: When a user says 'Mild headache, NO chest pain', the parser detects negation and avoids false cardiac alarms.
- **Real-Time Safety Audit Log**: Pseudonymized event hashing with zero retention of patient health text."

---

## 2:10 – 2:30 | Multilingual Support & Closing
**Action**: Switch the Language dropdown in the header to **हिन्दी (Hindi)** or **Hinglish**.

**Presenter**:  
"CareCompass supports English, Hindi, and Hinglish natively, with accessible type sizes and high-contrast modes.

In summary: CareCompass pairs deterministic healthcare safety rules with compassionate care navigation and transparent caregiver matching. Thank you!"
