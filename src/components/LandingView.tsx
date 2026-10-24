import React from 'react';
import { ArrowRight, ShieldCheck, HeartHandshake, Stethoscope, AlertOctagon, CheckCircle2, XCircle } from 'lucide-react';
import { SupportedLanguage } from '../types/index.ts';
import { translations } from '../i18n/translations.ts';

interface LandingViewProps {
  language: SupportedLanguage;
  onStartGuidance: () => void;
  onFindCaregivers: () => void;
  onSelectScenario: (scenarioId: string) => void;
  onOpenVoiceSaathi?: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  language,
  onStartGuidance,
  onFindCaregivers,
  onSelectScenario,
  onOpenVoiceSaathi
}) => {
  const t = translations[language];

  return (
    <div className="space-y-12 py-6">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto space-y-5 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-medium rounded-full bg-teal-50 text-teal-800 border border-teal-200">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
          <span>Care-Navigation & Support Prototype · Not a Diagnostic Tool</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-tight">
          {t.heroHeadline}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-2xl mx-auto">
          {t.heroSubheadline}
        </p>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartGuidance}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-teal-700 text-white font-semibold text-sm hover:bg-teal-800 shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-teal-600 focus-visible:outline-offset-2"
          >
            <span>{t.btnStartGuidance}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onOpenVoiceSaathi && (
            <button
              onClick={onOpenVoiceSaathi}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-gradient-to-r from-teal-800 to-emerald-800 text-white font-semibold text-sm hover:from-teal-900 hover:to-emerald-900 shadow-sm transition-all border border-teal-600/40"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
              </span>
              <span>Talk to Voice Saathi 🎙️</span>
            </button>
          )}

          <button
            onClick={onFindCaregivers}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-stone-800 font-semibold text-sm border border-stone-300 hover:bg-stone-50 transition-colors focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            <HeartHandshake className="w-4 h-4 text-teal-700" />
            <span>{t.btnExploreCaregivers}</span>
          </button>
        </div>
      </section>

      {/* Trust & Ethical Boundaries: What CareCompass Is vs Is Not */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* What CareCompass Is */}
          <div className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm mb-3">
              <CheckCircle2 className="w-4 h-4" />
              <span>What CareCompass Is Designed To Do</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-600">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Runs conservative, deterministic red-flag safety checks before any ordinary routing.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Explains why an urgency level was suggested using transparent rules and plain language.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Matches you with verified non-clinical home aides and elder-care companions when safe.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">•</span>
                <span>Supports English, Hindi, and Hinglish with zero permanent health data retention.</span>
              </li>
            </ul>
          </div>

          {/* What CareCompass Is NOT */}
          <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-xs">
            <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm mb-3">
              <XCircle className="w-4 h-4" />
              <span>What CareCompass Must Never Do</span>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm text-stone-600">
              <li className="flex items-start gap-2">
                <span className="text-rose-700 font-bold">•</span>
                <span>Does NOT diagnose medical conditions or predict illnesses from public datasets.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-700 font-bold">•</span>
                <span>Does NOT prescribe medications, adjust doses, or advise stopping treatments.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-700 font-bold">•</span>
                <span>Does NOT automatically dispatch ambulances (call 112 directly for emergencies).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-700 font-bold">•</span>
                <span>Never offers caregiver matches during an emergency; life safety comes first.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Step-by-Step User Journey */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-lg font-semibold text-stone-900 text-center mb-6">
          How Care Navigation Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
              1
            </div>
            <h3 className="text-xs font-semibold text-stone-900 mb-1">Enter Concern</h3>
            <p className="text-[11px] text-stone-600 leading-normal">
              Type or speak what is happening in English, Hindi, or Hinglish.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
              2
            </div>
            <h3 className="text-xs font-semibold text-stone-900 mb-1">Red-Flag Check</h3>
            <p className="text-[11px] text-stone-600 leading-normal">
              Pre-AI clinical rules screen for 12 life-threatening emergencies.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
              3
            </div>
            <h3 className="text-xs font-semibold text-stone-900 mb-1">Targeted Questions</h3>
            <p className="text-[11px] text-stone-600 leading-normal">
              Only 1-2 minimal follow-ups to clarify urgency and care setting.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 font-bold flex items-center justify-center mx-auto mb-2 text-xs">
              4
            </div>
            <h3 className="text-xs font-semibold text-stone-900 mb-1">Care & Support</h3>
            <p className="text-[11px] text-stone-600 leading-normal">
              Clear timeframe, physician next steps, and verified caregiver matches.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Test Scenarios for Judges & Testers */}
      <section className="max-w-4xl mx-auto px-4 pt-2">
        <div className="rounded-2xl bg-teal-900 text-white p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
            <div>
              <span className="text-teal-300 font-semibold text-xs tracking-wider uppercase">
                Judge & Hackathon Testing
              </span>
              <h2 className="text-xl font-bold text-white mt-1">
                Try Pre-Configured Test Scenarios
              </h2>
            </div>
            <span className="text-xs text-teal-200 bg-teal-800/80 px-3 py-1 rounded-full">
              Click any scenario to test triage & safety rules
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <button
              onClick={() => onSelectScenario('SAFE-02')}
              className="text-left p-3.5 rounded-xl bg-teal-800/80 hover:bg-teal-700/80 border border-teal-700 transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              <div className="flex items-center gap-1.5 text-rose-300 text-xs font-semibold mb-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Emergency: Chest Pain</span>
              </div>
              <p className="text-[11px] text-teal-100 line-clamp-2">
                "Crushing heavy pressure in chest radiating to left arm..."
              </p>
            </button>

            <button
              onClick={() => onSelectScenario('SAFE-14')}
              className="text-left p-3.5 rounded-xl bg-teal-800/80 hover:bg-teal-700/80 border border-teal-700 transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              <div className="flex items-center gap-1.5 text-emerald-300 text-xs font-semibold mb-1">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Caregiver: Elder Mobility</span>
              </div>
              <p className="text-[11px] text-teal-100 line-clamp-2">
                "76-year-old grandmother needs help walking, denies chest pain..."
              </p>
            </button>

            <button
              onClick={() => onSelectScenario('SAFE-13')}
              className="text-left p-3.5 rounded-xl bg-teal-800/80 hover:bg-teal-700/80 border border-teal-700 transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              <div className="flex items-center gap-1.5 text-amber-300 text-xs font-semibold mb-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Safety: Negation Test</span>
              </div>
              <p className="text-[11px] text-teal-100 line-clamp-2">
                "Mild headache for 2 days. NO chest pain, NO breathing trouble..."
              </p>
            </button>

            <button
              onClick={() => onSelectScenario('SAFE-15')}
              className="text-left p-3.5 rounded-xl bg-teal-800/80 hover:bg-teal-700/80 border border-teal-700 transition-colors focus-visible:outline-2 focus-visible:outline-white"
            >
              <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-semibold mb-1">
                <Stethoscope className="w-3.5 h-3.5" />
                <span>Hindi Acute Case</span>
              </div>
              <p className="text-[11px] text-teal-100 line-clamp-2">
                "छाती में बहुत तेज दर्द हो रहा है, सांस लेने में तकलीफ..."
              </p>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
