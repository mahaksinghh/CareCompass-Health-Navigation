# Dataset Manifest & Provenance

This document details all data sources, synthetic test corpuses, and research references utilized in the CareCompass prototype, including licensing terms, intended use, and clinical limitations.

---

## 1. Internal Synthetic Datasets (Bundled in Prototype)

### A. `synthetic_triage_tests.json` / `synthetic_triage_tests.csv`
- **Source**: Authored synthetically by the CareCompass safety engineering team.
- **Intended Use**: Automated regression testing of deterministic red-flag rules, negation parser verification, and latency measurement.
- **Scope**: 20 comprehensive test cases covering 12 emergency clinical categories, 2 negation stress tests, 3 multilingual cases (Hindi/Hinglish), and non-emergency outpatient/caregiver scenarios.
- **License / Terms**: MIT Open Source License (Synthetic data; contains zero real Protected Health Information [PHI]).
- **Known Limitations**: Synthetic cases do not capture the chaotic, ambiguous nature of actual emergency department triage encounters. A 100% test pass rate proves software fidelity to engineered specifications, not clinical safety ground truth.

### B. `caregiver_profiles_synthetic.json` / `caregiver_profiles_synthetic.csv`
- **Source**: Synthetically generated fictional dataset.
- **Intended Use**: Demonstration of explainable 4-factor caregiver ranking (skills 40%, availability 25%, area 20%, language 15%) and non-clinical scope enforcement.
- **License / Terms**: MIT Open Source License.
- **Privacy & Safety Constraints**: All names, telephone handles, and localities are entirely fictional (`demo_only: true`). Profiles explicitly exclude clinical permissions (IV administration, prescribing, wound debridement).

### C. `language_examples_synthetic.json` / `language_examples_synthetic.csv`
- **Source**: Curated synthetic medical phrase mappings.
- **Intended Use**: Multilingual symptom phrase matching across English, Hindi (Devanagari script), and colloquial Hinglish.
- **License / Terms**: MIT Open Source License.

---

## 2. Research Datasets Evaluated & Cited

In accordance with Section 6 of the CareCompass Master Specification, the following external datasets were analyzed during the research phase. Raw third-party data files are intentionally **NOT** bundled into the git repository to respect redistribution restrictions:

### 1. Kaggle Disease Symptom Description & Prediction
- **Source / URL**: [Kaggle Dataset](https://www.kaggle.com/datasets/itachi9604/disease-symptom-description-dataset)
- **License / Terms**: Open Database License (ODbL).
- **Intended Use**: Structured vocabulary reference for mapping colloquial phrases to formal symptom tags.
- **Known Limitations**: Not clinically validated for diagnostic triage. CareCompass does **NOT** use this dataset to predict disease or determine emergency level.

### 2. Kaggle Triagegeist (ED Triage Acuity Records)
- **Source / URL**: [Kaggle Competition Data](https://www.kaggle.com/competitions/triagegeist/data)
- **License / Terms**: Non-commercial research and educational use only; redistribution restrictions apply.
- **Intended Use**: Analysis of nurse triage narrative structures and acuity label distributions.
- **Known Limitations**: Synthetic emergency department records. Must not be used for direct automated triage without institutional clinical review.

### 3. Mendeley Scenario Dataset (Expert vs. AI Triage)
- **Source / URL**: [Mendeley Data Repository (Dataset 2)](https://data.mendeley.com/datasets/dd359z6trk/2)
- **License / Terms**: Creative Commons Attribution 4.0 International (CC BY 4.0).
- **Intended Use**: Benchmarking triage consensus scenarios between clinical experts and algorithmic models.
- **Known Limitations**: Scenario simulations that may not reflect low-resource rural healthcare settings.

### 4. Hospital Triage and Patient History Data
- **Source / URL**: [Kaggle Code & Notebook](https://www.kaggle.com/code/maalona/hospital-triage-and-history-data)
- **License / Terms**: Subject to host platform terms and patient privacy covenants.
- **Intended Use**: Exploration of patient history schemas and admission factors.
- **Known Limitations**: Complex schema with hospital-specific coding variations. Not deployed in real-time execution.
