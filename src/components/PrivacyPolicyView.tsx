import React from 'react';
import { ShieldCheck, Lock, Trash2, AlertTriangle, FileCode, CheckCircle2 } from 'lucide-react';
import { SupportedLanguage } from '../types/index.ts';

interface PrivacyPolicyViewProps {
  language: SupportedLanguage;
  onResetSession: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({
  onResetSession
}) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Privacy by Design & Clinical Safety Boundaries</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
          Privacy Policy, Clinical Boundaries & Technical Architecture
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
          CareCompass is built with strict privacy minimization, deterministic safety rules, and transparent algorithmic boundaries.
        </p>
      </div>

      {/* 1. Data Minimization & Privacy Guarantees */}
      <section className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
          <Lock className="w-5 h-5 text-teal-700" />
          <h2>1. Data Minimization & Zero Permanent Health Storage</h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            CareCompass adheres to strict data minimization principles modeled on healthcare data protection standards (including India's Digital Personal Data Protection Act 2023, HIPAA Security Rule, and GDPR Article 9):
          </p>
          <ul className="space-y-2 pl-4 list-disc text-stone-600">
            <li>
              <strong>Active Session Only:</strong> Any free-text health complaints you type or speak are held strictly in temporary session memory and are never saved to a persistent database.
            </li>
            <li>
              <strong>Local Voice Processing:</strong> When using the optional microphone input, speech-to-text recognition executes via the browser's native Web Speech API. Audio is never recorded, uploaded, or stored on our servers.
            </li>
            <li>
              <strong>Anonymized Safety Audits:</strong> Safety logs used for clinical regression testing record only rule IDs, timestamps, and pseudonymized session hashes. No raw user text or names are stored in audit logs.
            </li>
            <li>
              <strong>Instant Reset:</strong> You can purge all active session data at any moment using the "Clear Session" control.
            </li>
          </ul>

          <div className="pt-2">
            <button
              onClick={onResetSession}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-stone-600" />
              <span>Purge Active Session Data Now</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Non-Negotiable Clinical Boundaries */}
      <section className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 text-rose-900 font-bold text-base">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          <h2>2. Non-Negotiable Clinical & Legal Boundaries</h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            CareCompass is a software demonstration prototype for educational and hackathon evaluation. It operates under strict constraints:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
              <strong className="text-rose-900 font-semibold block text-xs">
                No Medical Diagnoses
              </strong>
              <p className="text-[11px] text-stone-700">
                The software does not predict or establish disease diagnoses. Symptom tags reflect reported mentions only.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
              <strong className="text-rose-900 font-semibold block text-xs">
                No Prescribing or Medication Advice
              </strong>
              <p className="text-[11px] text-stone-700">
                CareCompass will never recommend drug dosages, prescribe medication, or instruct patients to cease prescribed medicines.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
              <strong className="text-rose-900 font-semibold block text-xs">
                No Automatic Dispatch
              </strong>
              <p className="text-[11px] text-stone-700">
                Calling 112 or local emergency services remains the direct responsibility of the user. CareCompass cannot summon first responders.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 space-y-1">
              <strong className="text-rose-900 font-semibold block text-xs">
                Non-Clinical Caregiver Scope
              </strong>
              <p className="text-[11px] text-stone-700">
                Caregiver profiles represent non-clinical home aides and companions (e.g. mobility, meals, companionship). They are not clinicians.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Transparent Algorithmic Rules & Weights */}
      <section className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
          <FileCode className="w-5 h-5 text-teal-700" />
          <h2>3. Transparent Algorithmic Logic & Scoring Weights</h2>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
          <p>
            To prevent biased "black box" decisions, CareCompass relies on deterministic, auditable rules:
          </p>
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 font-mono text-xs space-y-2">
            <div className="font-bold text-stone-900">
              Caregiver Match Score Formula (Max 100):
            </div>
            <div className="pl-3 space-y-1 text-stone-700 text-[11px]">
              <div>• Skill Fit (40%): Overlap between reported non-clinical needs and vetted caregiver competencies.</div>
              <div>• Schedule Availability (25%): Immediate on-call vs. weekdays vs. weekends alignment.</div>
              <div>• Service Area / Locality (20%): Proximity to recipient district / sector.</div>
              <div>• Language Fluency (15%): Direct spoken language compatibility.</div>
            </div>
            <div className="pt-2 text-[10px] text-stone-500 border-t border-stone-200">
              *Hard Gate: If emergency red flags are detected, the caregiver matching engine is immediately suppressed and returns 0 matches.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
