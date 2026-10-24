# CareCompass Clinical Safety & Ethics Charter

## 1. Clinical Disclaimer
CareCompass is an applied AI and rule-based engineering prototype designed exclusively for care navigation and non-clinical caregiver matching. It does **NOT** provide a clinical diagnosis, predict disease etiology, recommend medication dosages, or replace consultation with a qualified doctor.

## 2. Hard Invariants & Non-Negotiable Boundaries

1. **Deterministic Red-Flag Priority**: Deterministic clinical rules execute prior to any machine learning or large language model. GenAI cannot modify, override, or downgrade urgency.
2. **Zero Caregiver Matches for Emergencies**: In suspected emergencies, all non-clinical caregiver matching is suppressed. Patients are directed exclusively to emergency medical services (112 in India, 911 in North America, 999 in UK).
3. **Transparent Non-Diagnostic Explanations**: The system communicates in plain, jargon-free language explaining why an urgency level was suggested based on entered facts.
4. **Honest Uncertainty & Cautious Escalation**: When input text is ambiguous, contradictory, or low confidence, CareCompass escalates to in-person medical evaluation rather than guessing.
5. **No Medical Jargon or Deceptive Clinical Claims**: The application does not claim hospital accreditation, clinician endorsement, or diagnostic accuracy.
6. **Data Minimization & Privacy Protection**: No identifiable health text or audio recordings are retained. Audit logs record only pseudonymized hashes and rule IDs.

## 3. Emergency Test Categories Covered

| Category ID | Emergency Category | Primary Clinical Indicators | Emergency Number |
| :--- | :--- | :--- | :--- |
| `RF-STROKE-01` | Acute Stroke (FAST) | Sudden facial drop, unilateral arm weakness, slurred speech | 112 (India) / 911 |
| `RF-CARDIAC-02` | Acute Coronary Syndrome | Severe crushing chest pressure radiating to arm/jaw, diaphoresis | 112 (India) / 911 |
| `RF-RESP-03` | Acute Ventilatory Failure | Gasping for air, cyanosis, unable to speak full sentences | 112 (India) / 911 |
| `RF-NEURO-04` | Unresponsiveness / Coma | Found unresponsive, barely breathing, inability to wake | 112 (India) / 911 |
| `RF-SEIZURE-05` | Status Epilepticus | Seizure lasting > 5 minutes, repeated convulsions | 112 (India) / 911 |
| `RF-BLEED-06` | Severe Arterial Hemorrhage | Pulsatile arterial spurting, uncontrolled bleeding | 112 (India) / 911 |
| `RF-ALLERGY-07` | Acute Severe Anaphylaxis | Rapidly swelling tongue/throat, stridor, hypotension | 112 (India) / 911 |
| `RF-TOX-08` | Poisoning / Caustic Ingestion | Swallowed industrial drain cleaner, overdose | 112 (India) / 911 |
| `RF-TRAUMA-09` | Major Trauma / Open Fracture | Fall from height with blackout, open compound fracture | 112 (India) / 911 |
| `RF-PREG-10` | Obstetric Emergency | 3rd-trimester severe continuous belly agony, heavy bleeding | 112 (India) / 911 |
| `RF-BURNS-11` | Severe / Inhalation Burns | Pressure cooker / boiling oil burns to face and airway | 112 (India) / 911 |
| `RF-PSYCH-12` | Immediate Self-Harm Crisis | Imminent suicidal plan with means | 14416 (Tele-MANAS) / 112 |

## 4. Negation Handling Verification
To prevent false-positive emergency alerts, CareCompass utilizes bidirectional clause-level parsing. Inputs such as `"I have had a mild headache for 2 days. I have NO chest pain, NO breathing trouble"` are parsed with negated symptom states (`isNegated: true`) and successfully routed to routine outpatient care without triggering cardiac alarms.
