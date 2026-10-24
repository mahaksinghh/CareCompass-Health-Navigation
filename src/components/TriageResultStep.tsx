import React, { useState, useEffect } from 'react';
import {
  Clock,
  Info,
  CheckCircle2,
  HeartHandshake,
  FileText,
  RotateCcw,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Volume2,
  Square
} from 'lucide-react';
import { SupportedLanguage, TriageEvaluationResponse, VoiceModulationConfig } from '../types/index.ts';
import { translations } from '../i18n/translations.ts';
import { speechService } from '../services/speechSynthesis.ts';

interface TriageResultStepProps {
  language: SupportedLanguage;
  result: TriageEvaluationResponse;
  onExploreCaregivers: () => void;
  onViewSummary: () => void;
  onStartOver: () => void;
  voiceConfig?: VoiceModulationConfig;
}

export const TriageResultStep: React.FC<TriageResultStepProps> = ({
  language,
  result,
  onExploreCaregivers,
  onViewSummary,
  onStartOver,
  voiceConfig
}) => {
  const t = translations[language];
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = speechService.subscribeStatus(setIsSpeaking);
    return () => unsubscribe();
  }, []);

  const handleReadAloud = () => {
    if (isSpeaking) {
      speechService.stop();
      return;
    }

    const nextStepsText = result.nextSteps.join('. ');
    const textToSpeak = `${t.triageResultTitle}: ${result.urgencyLevel}. ${result.userFacingExplanation}. Timeframe: ${result.timeframeRecommendation}. ${t.nextStepsLabel}: ${nextStepsText}`;
    speechService.speak(textToSpeak, language, voiceConfig);
  };

  // Map urgency styling
  const getUrgencyConfig = (urgency: string) => {
    switch (urgency) {
      case 'URGENT':
        return {
          label: 'Urgent Assessment Needed',
          sub: 'In-person clinic visit within hours recommended',
          borderColor: 'border-amber-300',
          bgColor: 'bg-amber-50/70',
          textColor: 'text-amber-950',
          badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
          icon: Clock
        };
      case 'NON_CLINICAL_SUPPORT':
        return {
          label: 'Non-Clinical Support & Caregiver Match',
          sub: 'Appropriate for home assistance, elder companionship, and daily routines',
          borderColor: 'border-teal-300',
          bgColor: 'bg-teal-50/70',
          textColor: 'text-teal-950',
          badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
          icon: HeartHandshake
        };
      case 'ROUTINE':
        return {
          label: 'Routine Primary Care Appointment',
          sub: 'Scheduled visit with a family physician or clinic',
          borderColor: 'border-blue-200',
          bgColor: 'bg-blue-50/60',
          textColor: 'text-blue-950',
          badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
          icon: CheckCircle2
        };
      case 'SELF_MONITOR':
      default:
        return {
          label: 'Self-Monitoring & Rest',
          sub: 'Minor, self-limiting discomfort with safe monitoring advice',
          borderColor: 'border-emerald-200',
          bgColor: 'bg-emerald-50/60',
          textColor: 'text-emerald-950',
          badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
          icon: CheckCircle2
        };
    }
  };

  const config = getUrgencyConfig(result.urgencyLevel);
  const IconComponent = config.icon;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Primary Urgency Card */}
      <div className={`rounded-2xl border ${config.borderColor} ${config.bgColor} p-6 sm:p-7 shadow-xs`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-stone-200/80 flex items-center justify-center shrink-0">
              <IconComponent className="w-6 h-6 text-teal-700" />
            </div>
            <div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border mb-1 ${config.badgeColor}`}>
                {config.label}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
                {t.triageResultTitle}
              </h1>
              <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
                {config.sub}
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-white/90 border border-stone-200/90 text-right shrink-0">
            <span className="text-[11px] font-semibold text-stone-500 uppercase block">
              Timeframe
            </span>
            <span className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-1 justify-end">
              <Clock className="w-3.5 h-3.5 text-teal-700" />
              <span>{result.timeframeRecommendation}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Explanation & Reason Codes */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-4">
        <div>
          <div className="flex items-center justify-between gap-3 mb-2">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4 text-teal-700" />
              <span>{t.reasonsLabel}</span>
            </h2>

            <button
              type="button"
              onClick={handleReadAloud}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
                isSpeaking
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Square className="w-3.5 h-3.5 fill-current" />
                  <span>{t.btnStopAudio}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                  <span>{t.btnListenAloud}</span>
                </>
              )}
            </button>
          </div>

          <p className="text-sm text-stone-700 leading-relaxed">
            {result.userFacingExplanation}
          </p>
        </div>

        {/* Reason Codes & Transparent Rules */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span className="font-semibold text-stone-700">Applied Rule Codes:</span>
          {result.reasonCodes.map(rc => (
            <span
              key={rc}
              className="font-mono text-[11px] px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 border border-stone-200"
            >
              {rc}
            </span>
          ))}
          <span className="text-[11px] text-stone-400">· Engine {result.engineVersion}</span>
        </div>
      </div>

      {/* Action Checklist */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-3">
        <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-1 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-700" />
          <span>{t.nextStepsLabel}</span>
        </h2>
        <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700">
          {result.nextSteps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              <span className="w-5 h-5 rounded-full bg-teal-50 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Uncertainty & Safety Boundary */}
      <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 space-y-1">
        <div className="flex items-center gap-1.5 font-semibold text-stone-800">
          <HelpCircle className="w-3.5 h-3.5 text-stone-500" />
          <span>
            {t.uncertaintyLabel}: Uncertainty is rated {result.uncertaintyLevel}
          </span>
        </div>
        <p className="leading-relaxed">{result.uncertaintyMessage}</p>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.btnStartOver}</span>
          </button>

          <button
            type="button"
            onClick={onViewSummary}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-stone-500" />
            <span>{t.btnReviewSummary}</span>
          </button>
        </div>

        {result.canOfferCaregivers && (
          <button
            type="button"
            onClick={onExploreCaregivers}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-700 text-white font-semibold text-xs sm:text-sm hover:bg-teal-800 shadow-sm transition-all focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            <HeartHandshake className="w-4 h-4" />
            <span>{t.btnViewCaregivers}</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1" />
          </button>
        )}
      </div>
    </div>
  );
};
