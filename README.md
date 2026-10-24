# CareCompass — Healthcare Navigation & Non-Clinical Caregiver Matching

CareCompass is a safety-first care-navigation and non-clinical caregiver matching prototype. It helps individuals and families describe health concerns in plain language (English, Hindi, or Hinglish), checks deterministic life-threatening red flags before any routing, recommends an appropriate care setting, and matches eligible non-clinical home caregivers when safe.

> **Clinical Disclaimer:** CareCompass is an engineering prototype for care navigation, not a medical diagnosis, triage authority, or prescription tool. In India, call **112** immediately for emergencies. If elsewhere, dial your local emergency service (e.g., 911 in North America, 999 in the UK).

---

## Key Features

1. **Deterministic Red-Flag Safety Gate (`v1.2.0-deterministic`)**:
   - Executes before any generative AI, ranking, or ordinary routing.
   - Covers 12 clinical emergency categories (stroke, acute coronary syndrome, severe respiratory failure, unresponsiveness, prolonged seizures, arterial bleeding, anaphylaxis, poisonings, major trauma, obstetric emergencies, severe burns, immediate self-harm).
   - Bidirectional negation handling ensures inputs like *"Mild headache, NO chest pain"* never cause false cardiac emergency alarms.

2. **Emergency Caregiver Suppression**:
   - If an emergency trigger is detected, non-clinical caregiver matching is **strictly disabled** with a transparent user explanation.

3. **Explainable 4-Factor Caregiver Scoring**:
   - Non-clinical caregiver ranking based on:
     - **Skill Fit (40%)**
     - **Schedule Availability (25%)**
     - **Service Locality (20%)**
     - **Language Fluency (15%)**
   - Vetted background verification badges and strict non-clinical boundaries.

4. **Trilingual Support & Voice Input**:
   - English, Hindi (हिन्दी), and colloquial Hinglish.
   - Optional local speech-to-text with clear user consent and zero server audio retention.

5. **Automated Safety Regression Suite**:
   - Built-in test runner with 20 synthetic safety test cases.
   - Live metrics: 100% Emergency Sensitivity, 0 Under-Triage, and pseudonymized audit logging without patient health PII.

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS, Lucide Icons, Motion.
- **Backend**: Express 4, TypeScript (via `tsx`), Google GenAI SDK (`@google/genai`).
- **Data**: Synthetic JSON & CSV datasets (`synthetic_triage_tests`, `caregiver_profiles_synthetic`, `language_examples_synthetic`).
- **Safety**: Fully deterministic pre-AI rules engine and negation parser.

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
```bash
# Clone the repository and install dependencies
npm install
```

### Running the Full-Stack Application
```bash
# Starts Express backend and Vite middleware on port 3000
npm run dev
```
Open your browser at `http://localhost:3000`.

### Running Automated Safety Tests
```bash
# Executes all 20 synthetic safety test cases via CLI
npm run test:safety
```

### Building for Production
```bash
npm run build
npm start
```

---

## API Endpoints

- `GET /health`: Health status and Gemini client availability.
- `GET /api/v1/languages`: Supported languages and phrase examples.
- `POST /api/v1/intake/parse`: Extracts symptoms, duration, severity, and negations.
- `POST /api/v1/intake/follow-up`: Selects minimal follow-up safety questions.
- `POST /api/v1/triage/evaluate`: Evaluates red flags and calculates safe care acuity.
- `POST /api/v1/caregivers/match`: Ranks eligible caregivers (blocked for emergencies).
- `GET /api/v1/caregivers`: Complete list of fictional vetted caregiver profiles.
- `POST /api/v1/session/reset`: Purges active session memory.
- `POST /api/v1/safety/run-suite`: Executes synthetic regression test suite.
- `GET /api/v1/safety/logs`: Retrieves anonymized audit logs (no PII).

---

## Documentation Index

- [docs/architecture.md](docs/architecture.md): High-level architecture, module breakdown, and Mermaid flowchart.
- [docs/safety.md](docs/safety.md): Clinical safety charter, red-flag categories, and negation rules.
- [docs/dataset_manifest.md](docs/dataset_manifest.md): Synthetic data documentation and cited research references.
- [docs/api.md](docs/api.md): REST API specification and payload examples.
- [docs/demo_script.md](docs/demo_script.md): 2–3 minute hackathon presentation script with sample scenarios.

---

## Limitations & Known Gaps

1. **Prototype Nature**: CareCompass is engineered as a design and software prototype. It has not undergone formal clinical trial validation and must not be used as clinical ground truth.
2. **Deterministic Question Bank**: Follow-up questions are currently selected from a curated rule bank; dynamic multi-turn dialogue should be supervised by licensed clinicians.
3. **Emergency Numbers**: Defaults to 112 for India with international notices. Real-world deployment requires geolocation-based emergency mapping.
