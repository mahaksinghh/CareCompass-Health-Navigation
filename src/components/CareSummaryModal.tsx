import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Printer,
  Check,
  RotateCcw,
  ShieldCheck,
  Clock,
  AlertTriangle,
  Volume2,
  Square
} from 'lucide-react';
import {
  SupportedLanguage,
  SymptomMention,
  TriageEvaluationResponse,
  VoiceModulationConfig
} from '../types/index.ts';
import { translations } from '../i18n/translations.ts';
import { speechService } from '../services/speechSynthesis.ts';

interface CareSummaryModalProps {
  language: SupportedLanguage;
  intakeText: string;
  extractedSymptoms: SymptomMention[];
  result: TriageEvaluationResponse | null;
  onClose: () => void;
  onStartOver: () => void;
  voiceConfig?: VoiceModulationConfig;
}

export const CareSummaryModal: React.FC<CareSummaryModalProps> = ({
  language,
  intakeText,
  extractedSymptoms,
  result,
  onClose,
  onStartOver,
  voiceConfig
}) => {
  const t = translations[language];
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = speechService.subscribeStatus(setIsSpeaking);
    return () => {
      unsubscribe();
      speechService.stop();
    };
  }, []);

  const handleReadAloud = () => {
    if (isSpeaking) {
      speechService.stop();
      return;
    }
    const cleanSpokenSummary = `${t.summaryTitle}. ${result?.isEmergency ? 'Emergency Alert: Call 112 immediately.' : 'Care Recommendation: ' + (result?.urgencyLevel || '')}. ${result?.userFacingExplanation || ''}. Next Steps: ${(result?.nextSteps || []).join('. ')}`;
    speechService.speak(cleanSpokenSummary, language, voiceConfig);
  };

  const formattedText = `================================================
CARECOMPASS — CARE NAVIGATION SUMMARY
Date: ${new Date().toLocaleString()}
Prototype Version: ${result?.engineVersion || 'v1.2.0-deterministic'}
Session Type: Non-Diagnostic Navigation & Triage Gate
================================================

1. ENTERED CONCERN:
"${intakeText || 'None recorded'}"

2. IDENTIFIED SYMPTOMS & STATUS:
${
  extractedSymptoms.length > 0
    ? extractedSymptoms
        .map(
          s =>
            `- ${s.displayName}: ${s.isNegated ? 'EXPLICITLY ABSENT/NEGATED' : 'Reported present'}`
        )
        .join('\n')
    : '- No specific dictionary symptoms isolated'
}

3. CARE NAVIGATION EVALUATION:
- Urgency Level: ${result?.urgencyLevel || 'PENDING EVALUATION'}
- Care Setting: ${result?.careType || 'N/A'}
- Recommended Timeframe: ${result?.timeframeRecommendation || 'Immediate'}
- Applied Rule Codes: ${result?.reasonCodes?.join(', ') || 'None'}

4. EXPLANATION:
${result?.userFacingExplanation || 'No evaluation completed.'}

5. NEXT STEPS:
${result?.nextSteps?.map((step, i) => `${i + 1}. ${step}`).join('\n') || 'None'}

================================================
CLINICAL DISCLAIMER:
CareCompass is an applied AI and rules-based care navigation prototype. It does NOT establish a clinical medical diagnosis, prescribe drugs, or replace an examination by a registered physician. In case of an emergency in India, dial 112 immediately.
================================================`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Copy failed', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {t.summaryTitle}
              </h3>
              <span className="text-[11px] text-stone-500">
                {t.summaryTimestamp} {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg text-lg leading-none"
            aria-label="Close summary modal"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-stone-800">
          {/* Status highlight */}
          {result?.isEmergency ? (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">Emergency Gate Active: Call 112</strong>
                <span className="text-xs text-rose-800">
                  Critical symptoms identified. Direct in-person emergency dispatch required.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-semibold">
                  Suggested Level: {result?.urgencyLevel || 'Routine Care'}
                </strong>
                <span className="text-xs text-teal-800 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timeframe: {result?.timeframeRecommendation}</span>
                </span>
              </div>
            </div>
          )}

          {/* Formatted Text Box */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5">
              Formatted Clinical Brief:
            </label>
            <pre className="p-4 rounded-xl bg-stone-50 border border-stone-200 font-mono text-[11px] text-stone-700 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto select-all">
              {formattedText}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 shrink-0 bg-stone-50/50 rounded-b-2xl">
          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.btnStartOver}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReadAloud}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                isSpeaking
                  ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                  : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
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

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{t.summaryPrintBtn}</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : t.summaryCopyBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
