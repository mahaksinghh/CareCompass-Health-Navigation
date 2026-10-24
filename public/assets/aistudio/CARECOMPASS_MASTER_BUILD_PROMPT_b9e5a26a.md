# CARECOMPASS — MASTER BUILD PROMPT
You are a senior full-stack engineer, applied AI engineer, product designer, accessibility specialist, and safety-conscious healthcare product architect. Build a polished, usable, responsive hackathon prototype named **CareCompass**.

## 1. Product goal
CareCompass helps people describe a health concern in plain language, understand an appropriate next step, and find suitable care/support options. It is a **care-navigation and caregiver-matching prototype**, not a diagnosis, treatment, or prescribing system. It must never claim to replace a clinician.

Build a real, runnable application—not only mockups. Connect the UI to a working backend and provide setup instructions, sample data, tests, and a demo mode.

## 2. Core user journey
1. Landing page explains the service in simple language and offers “Get guidance” and “Find care/support”.
2. User chooses language: English, Hindi, or Hinglish for the prototype. Make the interface architecture ready for additional languages.
3. User enters the main concern using text. Voice input is optional and must have a text alternative. Never make voice mandatory.
4. Ask only the minimum relevant follow-up questions. Use a short, step-by-step conversational flow with a progress indicator, back/edit controls, and “I’m not sure” / “Prefer not to say” where appropriate.
5. Run explicit, conservative red-flag checks before ordinary routing. If an emergency red flag is reported or cannot safely be ruled out, stop ordinary matching and display a clear emergency instruction. In India, show 112 as the general emergency number only with a clear note to use the local emergency number if elsewhere; do not promise dispatch or emergency response from the app. Do not delay emergency guidance to ask more questions.
6. If no emergency trigger is identified, provide a cautious care-navigation suggestion (e.g. emergency care now, urgent in-person medical assessment, routine clinician appointment, non-clinical support) based on transparent rules and available information. State uncertainty and encourage professional assessment.
7. Offer eligible caregiver/support matches only when appropriate. Explain each match using relevant, non-sensitive criteria: service skills, availability, approximate service area, language, and eligibility. Never imply a caregiver is a clinician unless verified in the sample record.
8. Present a concise summary the user can review, edit, copy, or download. Provide clear next steps and a way to start over/delete the current session.
9. Include an optional demo mode with clearly labelled fictional data.

## 3. Safety requirements (non-negotiable)
- Do not diagnose disease, prescribe medicines, recommend medication doses, or tell users to stop prescribed treatment.
- Do not use a disease-prediction model as an emergency triage model.
- Do not use symptom-severity weights from public datasets as clinical thresholds.
- Do not invent clinical rules. Implement only clearly labelled prototype rules and document that they require review by qualified clinicians before real-world use.
- Use deterministic red-flag rules as a safety layer before any generative AI or ranking logic. AI must never override an emergency rule or downgrade urgency.
- Example red-flag test categories include possible stroke symptoms, severe chest pain/possible heart attack, severe breathing difficulty, unresponsiveness, prolonged/repeated seizure, severe bleeding, severe allergic reaction, suspected poisoning/overdose, major trauma, pregnancy emergency symptoms, severe burns, and immediate self-harm danger. These are test categories, not a complete clinical protocol. Use cautious wording and direct to local emergency services.
- When information is missing, contradictory, low confidence, or out of scope, say so and route to professional help rather than guessing.
- Do not expose chain-of-thought. Give short, user-facing reasons based on entered facts and explicit rules.
- Never present generated text as medical authority. Avoid false precision and claims of clinical accuracy.
- Use a visible disclaimer: “CareCompass is a prototype for care navigation, not a medical diagnosis. If you may be experiencing an emergency, contact local emergency services immediately.”
- Add a safety event log for tests, without storing identifiable health details by default.

## 4. Recommended technical stack
Use:
- Frontend: React + TypeScript + Vite + Tailwind CSS.
- UI: accessible component patterns, Lucide icons, clean design tokens, responsive layout.
- Backend: Python + FastAPI + Pydantic.
- Data for prototype: CSV/JSON; SQLite only if persistent demo data is needed.
- Testing: pytest for backend; frontend component or end-to-end tests where practical.
- API documentation: FastAPI OpenAPI docs.
- Configuration: `.env.example`; never commit secrets.
- Deployment: document one simple frontend and backend deployment path; do not claim deployment is live until verified.
Keep the project simple enough for a student team to understand and demo.

## 5. AI modules and boundaries
Build modular interfaces so models can be replaced without rewriting the app:
A. **Language normalization / symptom extraction**: convert free-text complaint into structured symptom mentions, onset/duration, severity as reported, negation, and uncertainty. Support English/Hindi/Hinglish examples. Return extracted fields with confidence and preserve the original user text only in the active session. If uncertain, ask the user to confirm.
B. **Follow-up question selector**: select a small number of relevant questions from a reviewed question bank; do not ask unnecessary questions and never delay emergency guidance.
C. **Red-flag rules engine**: deterministic, versioned, tested, independent of the LLM. The LLM cannot modify its output.
D. **Care-routing rules engine**: produce a provisional next-step category, reason codes, and uncertainty state. Require clinician review before real-world use.
E. **Caregiver ranking**: deterministic ranking of eligible fictional caregiver records based on required skills, service area/distance, availability, language, and role eligibility. Do not use symptom text to infer protected characteristics. Emergency cases bypass this module.
F. **Plain-language explanation**: convert already-determined rule outputs into short, empathetic, non-diagnostic explanations. It may explain but must not change triage/routing.
G. **Optional speech-to-text**: browser speech API or a pluggable service, only with consent and a visible manual text fallback. Do not save audio by default.
H. **Evaluation and monitoring**: metrics for red-flag sensitivity on synthetic tests, under-triage count, question completion, extraction confidence, match eligibility, latency, and failures. Report results honestly; do not claim clinical validation.

Use an LLM only for extraction, clarification, translation, and explanation. Do not ask it to independently diagnose or decide emergency level. For the first working version, a rule-based extraction fallback is acceptable; the app must still run if an AI API key is absent. Make the AI provider configurable and use mock mode for demos.

## 6. Data strategy
Create separate, clearly named data sources:
- `synthetic_triage_tests.csv/json`: synthetic safety regression cases only; not clinical ground truth.
- `caregiver_profiles_synthetic.csv`: fictional profiles for matching; no real personal information.
- `language_examples_synthetic.csv`: short fictional English/Hindi/Hinglish utterances mapped to symptom concepts; manually review translations.
- `dataset_manifest.md`: source, URL, license/terms, intended use, known limitations, version/date checked.
Do not bundle copyrighted or restricted third-party datasets into the repository unless their terms explicitly allow redistribution. Tell the developer to download gated or restricted datasets directly from the official source. Keep raw dataset files out of Git if terms prohibit redistribution.
Potential research datasets:
1. Kaggle Disease Symptom Prediction / Disease Symptom Description: https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset — useful for structured symptom vocabulary experiments, not validated triage or diagnosis.
2. Kaggle Triagegeist: https://www.kaggle.com/competitions/triagegeist/data — synthetic ED triage records with acuity labels and complaint narratives. Read competition rules; non-commercial research/education only and redistribution restrictions apply.
3. Mendeley scenario dataset: https://data.mendeley.com/datasets/dd359z6trk/2 — triage scenarios comparing expert and AI labels; listed as CC BY 4.0 on the source page. Inspect the files and documentation before use.
4. Hospital Triage and Patient History Data: https://www.kaggle.com/code/maalona/hospital-triage-and-history-data — large and more complex; confirm source data access terms, privacy obligations, schema, and suitability before use.
Cite datasets in the README and in any report. Do not claim that any dataset is clinically validated unless the source explicitly establishes that.

## 7. Caregiver matching model
Create fictional profiles with:
- `caregiver_id`, `display_name` (fictional), `role`, `skills`, `languages`, `service_area`, `availability`, `verified_status`, `eligibility_notes`, `demo_only`.
- Use a simple, explainable score, for example: skill fit 40%, availability 25%, service area 20%, language 15%. Make weights configurable and document them as demo choices, not scientifically validated weights.
- Filter eligibility first; ranking comes second.
- Show only the information needed to make a choice. Never display private phone numbers or precise home addresses in the demo.
- If no eligible matches exist, say so and provide a safer next step. Do not fabricate available people.
- Do not offer a caregiver match for a potential emergency.

## 8. UI/UX requirements — designed for everyone
Visual direction: calm, trustworthy, modern healthcare navigation. Use warm off-white backgrounds, deep navy/teal text, restrained green/blue accents, generous whitespace, rounded cards, subtle borders, clear typography, and consistent icons. Avoid a cluttered “AI dashboard” look.
- Mobile-first responsive design, working on small phones, tablets, laptops, and desktop.
- WCAG-minded accessibility: semantic headings, keyboard navigation, visible focus, labels for all fields, sufficient contrast, screen-reader announcements for results/errors, reduced-motion support, large touch targets, no color-only status cues.
- Plain language, short sentences, no unexplained medical jargon.
- Language selector easy to find; translate navigation, questions, errors, disclaimers, and result states—not just headings.
- Use readable type (roughly 16px base), line spacing, high contrast, and generous spacing.
- Do not rely on color alone: pair labels/icons with status text.
- Include loading, empty, error, low-confidence, offline/API-unavailable, and no-match states.
- Provide a visible “Back”, “Edit answers”, “Start over”, and “Privacy” path.
- Avoid forcing account creation for the demo.
- Respect privacy: collect minimum data, no default analytics that record health text, no persistent storage unless explicitly disclosed and necessary, clear delete/reset action.
- Add trust cues: what the app can/cannot do, why a question is asked, why a route is suggested, and what data is stored.
- Do not use fake testimonials, fake clinician endorsements, fake accuracy percentages, or invented partner logos.

## 9. Required pages/components
1. Landing / welcome.
2. Language and accessibility preferences.
3. Guided concern intake/chat.
4. Follow-up question cards.
5. Emergency state (clear and immediate; no caregiver suggestions).
6. Care-navigation result with urgency wording, explanation, uncertainty, and next steps.
7. Caregiver/support match list with reasons and eligibility information.
8. Summary/review page.
9. Privacy and limitations page.
10. Demo data/settings panel for judges, clearly separated from patient view.
11. Helpful error/empty/loading states.
12. Responsive navigation and footer with disclaimer.

## 10. Backend API suggestions
Implement and document:
- `GET /health`
- `GET /api/v1/languages`
- `POST /api/v1/intake/parse`
- `POST /api/v1/intake/follow-up`
- `POST /api/v1/triage/evaluate`
- `POST /api/v1/caregivers/match`
- `POST /api/v1/session/reset`
Use Pydantic schemas, input validation, safe error messages, rate limiting if feasible, and CORS configured only for intended origins. Never put API secrets in frontend code.
The triage endpoint must call deterministic red-flag rules first. The caregiver endpoint must reject or return no matches for emergency cases. Return structured fields such as:
`status`, `urgency_label`, `care_type`, `red_flags_triggered`, `reason_codes`, `follow_up_questions`, `uncertainty_message`, `next_steps`, `matches`, `model_version`, `disclaimer`.
Avoid returning an unsupported disease prediction.

## 11. Testing checklist
- Every synthetic emergency case triggers the intended emergency-safe state.
- Emergency state does not show caregiver matches.
- Missing or ambiguous answers do not cause a confident low-urgency result.
- LLM/API failure falls back safely and the UI remains usable.
- Negation handling is tested (e.g. “no chest pain” must not be extracted as positive chest pain).
- Contradictory input asks for clarification or routes cautiously.
- Hindi/Hinglish phrases are tested; unclear translation prompts confirmation.
- Caregiver matching excludes unavailable, ineligible, and role-mismatched profiles.
- No-match state works.
- Keyboard-only navigation and mobile layouts are checked.
- Sensitive text is not written to logs by default.
- Add regression tests and record failures. A passing synthetic test suite is not proof of clinical safety.

## 12. Deliverables
Create:
- Complete source code with clear folders.
- `README.md` with prerequisites, setup, run, test, architecture, limitations, data sources, and demo steps.
- `.env.example`.
- `docs/architecture.md`, `docs/safety.md`, `docs/dataset_manifest.md`, `docs/api.md`.
- Synthetic CSV/JSON datasets and a demo caregiver CSV.
- Backend tests and a one-command local development workflow if practical.
- A 2–3 minute demo script and sample scenarios.
- A simple architecture diagram (Mermaid source is fine).
- No fake production claims. List known gaps and next steps.

## 13. Build process
Work in small, verifiable stages:
1. Inspect the existing repository before changing anything. If empty, scaffold it. Preserve useful existing code.
2. Print a proposed file tree and implementation plan.
3. Implement the backend schemas, red-flag rules interface, safe triage output, and tests first.
4. Run tests and fix failures.
5. Implement caregiver matching and tests.
6. Implement responsive frontend and connect it to the API.
7. Add accessible error/loading/empty states and privacy controls.
8. Add demo mode, docs, and setup instructions.
9. Run all available tests, lint/build checks, and report exact commands/results. Never claim a command passed unless it was run.
10. Finish with: what works, how to run, tests actually run, environment variables, limitations, and next steps.

Do not stop after generating a plan or a static frontend. Build a functioning end-to-end MVP. If a detail is missing, choose a sensible, low-risk default and document it instead of blocking on minor questions. If you cannot run a command, say so explicitly.
