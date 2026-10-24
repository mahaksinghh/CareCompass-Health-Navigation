import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, HelpCircle, CheckCircle, Volume2, Square } from 'lucide-react';
import { FollowUpAnswer, FollowUpQuestion, SupportedLanguage, VoiceModulationConfig } from '../types/index.ts';
import { translations } from '../i18n/translations.ts';
import { speechService } from '../services/speechSynthesis.ts';

interface FollowUpStepProps {
  language: SupportedLanguage;
  questions: FollowUpQuestion[];
  onComplete: (answers: FollowUpAnswer[]) => void;
  onBackToIntake: () => void;
  isEvaluating: boolean;
  voiceConfig?: VoiceModulationConfig;
}

export const FollowUpStep: React.FC<FollowUpStepProps> = ({
  language,
  questions,
  onComplete,
  onBackToIntake,
  isEvaluating,
  voiceConfig
}) => {
  const t = translations[language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = speechService.subscribeStatus(setIsSpeaking);
    return () => unsubscribe();
  }, []);

  if (!questions || questions.length === 0) {
    return null;
  }

  const currentQ = questions[currentIndex];
  const total = questions.length;
  const currentAnswer = answers[currentQ.id];

  // Pick question text by language
  const questionText =
    language === 'hi' && currentQ.questionTextHi
      ? currentQ.questionTextHi
      : language === 'hinglish' && currentQ.questionTextHinglish
      ? currentQ.questionTextHinglish
      : language === 'bn' && currentQ.questionTextBn
      ? currentQ.questionTextBn
      : language === 'mr' && currentQ.questionTextMr
      ? currentQ.questionTextMr
      : language === 'ta' && currentQ.questionTextTa
      ? currentQ.questionTextTa
      : currentQ.questionText;

  const handleSelectOption = (val: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: val
    }));
  };

  const handleSpeakQuestion = () => {
    if (isSpeaking) {
      speechService.stop();
    } else {
      speechService.speak(questionText, language, voiceConfig);
    }
  };

  const handleNext = () => {
    speechService.stop();
    if (currentIndex < total - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const formattedAnswers: FollowUpAnswer[] = Object.entries(answers).map(
        ([questionId, selectedOptionValue]) => ({
          questionId,
          selectedOptionValue,
          isNotSure: selectedOptionValue === 'not_sure'
        })
      );
      onComplete(formattedAnswers);
    }
  };

  const handleBack = () => {
    speechService.stop();
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      onBackToIntake();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress & Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-stone-600">
          <span className="text-teal-700">Safety Clarification</span>
          <span>
            Question {currentIndex + 1} of {total}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-700 transition-all duration-300 rounded-full"
            style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-6 space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <h2 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
              {questionText}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <HelpCircle className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Why we ask: {currentQ.purposeReason}</span>
            </div>
          </div>

          {/* Voice Modulation Readout Button */}
          <button
            type="button"
            onClick={handleSpeakQuestion}
            className={`p-2.5 rounded-xl border transition-all shrink-0 ${
              isSpeaking
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-700'
            }`}
            title="Read Question Aloud (Voice Modulated)"
            aria-label="Read Question Aloud"
          >
            {isSpeaking ? (
              <Square className="w-4 h-4 fill-current" />
            ) : (
              <Volume2 className="w-4 h-4 text-teal-700" />
            )}
          </button>
        </div>

        {/* Options */}
        <div className="space-y-2.5">
          {currentQ.options.map(option => {
            const isSelected = currentAnswer === option.value;
            const optionLabel =
              language === 'hi' && option.labelHi
                ? option.labelHi
                : language === 'hinglish' && option.labelHinglish
                ? option.labelHinglish
                : language === 'bn' && option.labelBn
                ? option.labelBn
                : language === 'mr' && option.labelMr
                ? option.labelMr
                : language === 'ta' && option.labelTa
                ? option.labelTa
                : option.label;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelectOption(option.value)}
                className={`w-full text-left p-4 rounded-xl border text-sm font-medium transition-all flex items-start justify-between gap-3 ${
                  isSelected
                    ? 'border-teal-700 bg-teal-50/60 text-teal-950 shadow-xs ring-1 ring-teal-700'
                    : 'border-stone-200 hover:border-stone-300 hover:bg-stone-50 text-stone-800'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="text-sm">{optionLabel}</div>
                  {option.isRedFlagTrigger && (
                    <div className="text-[11px] text-rose-700 font-semibold">
                      Alerts emergency safety protocols if present
                    </div>
                  )}
                </div>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                    isSelected
                      ? 'border-teal-700 bg-teal-700 text-white'
                      : 'border-stone-300 bg-white'
                  }`}
                >
                  {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.btnBack}</span>
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!currentAnswer || isEvaluating}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-700 text-white text-xs sm:text-sm font-semibold hover:bg-teal-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs transition-all focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            <span>
              {currentIndex === total - 1 ? 'Evaluate Care Route' : t.btnNext}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
