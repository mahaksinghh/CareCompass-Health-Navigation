import React, { useState, useEffect } from 'react';
import { PhoneCall, AlertTriangle, ShieldX, RotateCcw, FileText, CheckCircle2, Volume2, Square } from 'lucide-react';
import { RedFlagTrigger, SupportedLanguage, VoiceModulationConfig } from '../types/index.ts';
import { translations } from '../i18n/translations.ts';
import { speechService } from '../services/speechSynthesis.ts';

interface EmergencyAlertProps {
  language: SupportedLanguage;
  redFlags: RedFlagTrigger[];
  onStartOver: () => void;
  onViewSummary: () => void;
  voiceConfig?: VoiceModulationConfig;
  onOpenTinyFish?: () => void;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = ({
  language,
  redFlags,
  onStartOver,
  onViewSummary,
  voiceConfig,
  onOpenTinyFish
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

    const triggersText = redFlags.map(rf => `${rf.name}. ${rf.immediateInstruction}`).join('. ');
    const textToSpeak = `${t.emergencyTitle}. ${t.emergencySubtitle}. ${t.emergencyActionHeader}: Do not drive yourself. Sit or lie down quietly. Unlock the front door. Alert someone nearby. ${triggersText}`;
    speechService.speak(textToSpeak, language, voiceConfig);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* High-Acuity Emergency Banner */}
      <div className="rounded-2xl bg-rose-600 text-white p-6 sm:p-8 shadow-lg border-2 border-rose-700">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-white text-rose-700 flex items-center justify-center shrink-0 shadow-md">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-rose-700/80 text-rose-100 text-xs font-bold uppercase tracking-wider">
              High Acuity Safety Alert
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {t.emergencyTitle}
            </h1>
            <p className="text-rose-100 text-sm sm:text-base leading-relaxed">
              {t.emergencySubtitle}
            </p>
          </div>
        </div>

        {/* Primary Call 112 Button & Voice Instructions */}
        <div className="mt-6 pt-6 border-t border-rose-500/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <a
              href="tel:112"
              className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white text-rose-700 font-extrabold text-base sm:text-lg hover:bg-rose-50 shadow-md transition-all focus-visible:outline-4 focus-visible:outline-white"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>{t.emergencyDialIndia}</span>
            </a>

            <button
              type="button"
              onClick={handleReadAloud}
              className={`inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-rose-300 font-semibold text-xs transition-colors shadow-xs ${
                isSpeaking
                  ? 'bg-rose-800 text-white animate-pulse'
                  : 'bg-rose-700/80 hover:bg-rose-700 text-white'
              }`}
            >
              {isSpeaking ? (
                <>
                  <Square className="w-4 h-4 fill-white" />
                  <span>{t.btnStopAudio}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>{t.btnListenAloud}</span>
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-rose-100 leading-normal sm:max-w-xs">
            <p className="font-semibold text-white">Emergency Services Notice:</p>
            <p>{t.emergencyIntlNote}</p>
          </div>
        </div>
      </div>

      {/* Triggered Red Flags Details */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-3">
        <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider text-rose-900 flex items-center gap-2">
          <ShieldX className="w-4 h-4 text-rose-600" />
          <span>Identified Emergency Triggers</span>
        </h2>

        <div className="space-y-3">
          {redFlags.map(rf => (
            <div
              key={rf.code}
              className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200 text-xs text-stone-800 space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-900">{rf.name}</span>
                <span className="font-mono text-[10px] text-stone-500">{rf.code}</span>
              </div>
              <p className="text-stone-700 leading-relaxed">{rf.clinicalRationale}</p>
              <p className="font-semibold text-rose-800 pt-0.5">
                Instruction: {rf.immediateInstruction}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Immediate Life Safety Checklist */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 space-y-4">
        <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          {t.emergencyActionHeader}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-stone-700">
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block mb-0.5">Do NOT Drive Yourself</strong>
              <span>Have an ambulance or family member transport you. Driving with severe symptoms is dangerous.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block mb-0.5">Sit or Lie Down Quietly</strong>
              <span>Rest in a comfortable position (upright if breathing is difficult, left side if pregnant).</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block mb-0.5">Unlock the Front Door</strong>
              <span>Ensure paramedics or family can enter immediately without forcing entry.</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200">
            <CheckCircle2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 block mb-0.5">Alert Someone Nearby</strong>
              <span>Call out to a neighbor or household member so you are not alone while help arrives.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explicit Statement on Caregiver Suppression */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
        <ShieldX className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-semibold block text-amber-950">Caregiver Matching Strictly Withheld</strong>
          <p className="leading-relaxed">
            {t.emergencyCaregiverNotice} Non-clinical caregivers are not trained, certified, or equipped for active emergency life support.
          </p>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onStartOver}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.btnStartOver}</span>
          </button>

          {onOpenTinyFish && (
            <button
              type="button"
              onClick={onOpenTinyFish}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-300 text-indigo-900 text-xs font-bold hover:bg-indigo-100 transition-colors shadow-2xs"
            >
              <span>Verified 24/7 Trauma Centers (TinyFish)</span>
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={onViewSummary}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors"
        >
          <FileText className="w-3.5 h-3.5 text-stone-500" />
          <span>{t.btnReviewSummary}</span>
        </button>
      </div>
    </div>
  );
};
