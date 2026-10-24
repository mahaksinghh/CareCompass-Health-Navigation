import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Send, ShieldAlert, Sparkles, RefreshCw, Volume2, Square, Activity, ExternalLink } from 'lucide-react';
import { SupportedLanguage, VoiceModulationConfig } from '../types/index.ts';
import { translations } from '../i18n/translations.ts';
import { speechService } from '../services/speechSynthesis.ts';
import { audioCaptureService } from '../services/audioCapture.ts';
import { api } from '../services/apiClient.ts';

interface IntakeStepProps {
  language: SupportedLanguage;
  intakeText: string;
  setIntakeText: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  isLoading: boolean;
  onClear: () => void;
  voiceConfig?: VoiceModulationConfig;
  onOpenVoiceSaathi?: () => void;
}

export const IntakeStep: React.FC<IntakeStepProps> = ({
  language,
  intakeText,
  setIntakeText,
  onSubmit,
  isLoading,
  onClear,
  voiceConfig,
  onOpenVoiceSaathi
}) => {
  const t = translations[language];
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = speechService.subscribeStatus(setIsSpeaking);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    return () => {
      audioCaptureService.stop();
      setIsListening(false);
    };
  }, []);

  const toggleListening = async () => {
    setSpeechError(null);

    if (isListening) {
      setIsListening(false);
      setAudioLevel(0);
      const { audioBlob, transcript } = await audioCaptureService.stop();

      if (transcript) {
        setIntakeText(prev => (prev ? `${prev} ${transcript}` : transcript));
      } else if (audioBlob && audioBlob.size > 1000) {
        // Fallback to Gemini 3.8 Flash transcription
        setIsTranscribingAudio(true);
        try {
          const res = await api.transcribeAudio(audioBlob, language);
          if (res.transcript) {
            setIntakeText(prev => (prev ? `${prev} ${res.transcript}` : res.transcript));
          } else {
            setSpeechError('No speech detected. Please speak clearly or type below.');
          }
        } catch {
          setSpeechError('Could not transcribe audio. You can type directly below.');
        } finally {
          setIsTranscribingAudio(false);
        }
      }
    } else {
      const started = await audioCaptureService.start(language, {
        onTranscriptUpdate: (spokenText) => {
          setIntakeText(spokenText);
        },
        onAudioLevel: (level) => {
          setAudioLevel(level);
        },
        onError: (errMsg) => {
          setSpeechError(errMsg);
          setIsListening(false);
          setAudioLevel(0);
        },
        onAutoSilenceDetected: () => {
          toggleListening();
        }
      });

      if (started) {
        setIsListening(true);
      }
    }
  };

  const sampleSuggestions = [
    {
      label: 'Grandmother Mobility & Chores',
      text: 'My 78-year-old grandmother needs daily support with walking, bathing, and preparing meals. She does not have any chest pain or breathing issues.'
    },
    {
      label: 'Mild Cold & Sore Throat',
      text: 'I have had a mild runny nose and scratchy sore throat for 2 days. No breathing trouble, no high fever, and no chest pain.'
    },
    {
      label: 'Post-Surgery Companion',
      text: 'Recovering at home from elective knee replacement surgery 1 week ago. Need a patient non-clinical companion for mobility exercises and medication reminders.'
    },
    {
      label: 'Hindi Elder Care',
      text: 'दादाजी को चलने-फिरने में सहायता चाहिए और दैनिक दिनचर्या में सहारा चाहिए, कोई आपातकालीन बीमारी नहीं है।'
    },
    {
      label: 'Bengali Elder Support',
      text: 'আমার দিদিমা গত ২ দিন ধরে দুর্বল বোধ করছেন এবং বাড়িতে চলাফেরায় সাহায্য প্রয়োজন, কোনো জরুরি অবস্থা নেই।'
    },
    {
      label: 'Marathi Elder Care',
      text: 'माझ्या आजीला घरात चालण्यासाठी आधाराची गरज आहे आणि दैनंदिन कामात मदत हवी आहे.'
    },
    {
      label: 'Tamil Elder Support',
      text: 'என் பாட்டிக்கு வீட்டில் நடக்க உதவி தேவைப்படுகிறது, எந்த அவசர மருத்துவ நிலையும் இல்லை.'
    }
  ];

  const handleSpeakInstructions = () => {
    if (isSpeaking) {
      speechService.stop();
      return;
    }
    const textToSpeak = `${t.intakeTitle}. ${t.intakeSubtitle}`;
    speechService.speak(textToSpeak, language, voiceConfig);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      if (intakeText.trim().length >= 5 && !isLoading) {
        onSubmit();
      }
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-2xl font-bold text-stone-900 tracking-tight">
            {t.intakeTitle}
          </h2>
          <button
            type="button"
            onClick={handleSpeakInstructions}
            className={`p-1.5 rounded-lg border text-xs transition-all ${
              isSpeaking
                ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse'
                : 'bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-600'
            }`}
            title="Listen to Instructions (Voice Modulated)"
            aria-label="Listen to Instructions"
          >
            {isSpeaking ? (
              <Square className="w-4 h-4 fill-current" />
            ) : (
              <Volume2 className="w-4 h-4 text-teal-700" />
            )}
          </button>
        </div>
        <p className="text-sm text-stone-600 max-w-xl mx-auto">
          {t.intakeSubtitle}
        </p>
      </div>

      {/* Main Intake Box */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-sm p-4 sm:p-6 space-y-4">
        {/* Text Area */}
        <div className="relative">
          <label htmlFor="intake-textarea" className="sr-only">
            Describe your health concern or care requirement
          </label>
          <textarea
            id="intake-textarea"
            rows={5}
            value={intakeText}
            onChange={e => setIntakeText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t.intakePlaceholder}
            className="w-full text-base sm:text-sm p-3.5 rounded-xl border border-stone-200 focus:border-teal-600 focus:ring-1 focus:ring-teal-600 outline-hidden transition-all text-stone-800 placeholder:text-stone-400 resize-y min-h-[130px]"
          />

          <div className="flex items-center justify-between text-xs text-stone-600 pt-2 px-1">
            <span>
              {intakeText.length} characters
              {intakeText.length > 0 && intakeText.length < 15 && (
                <span className="text-amber-800 font-medium ml-2">
                  (Please provide a bit more context for accurate navigation)
                </span>
              )}
            </span>
            <span className="text-[11px] text-stone-600 hidden sm:inline">
              Press Ctrl+Enter to submit
            </span>
          </div>
        </div>

        {/* Live Audio Visualizer when mic is active */}
        {isListening && (
          <div className="p-3 bg-teal-900 text-white rounded-xl shadow-xs flex items-center justify-between gap-3 animate-pulse">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
              <span className="text-xs font-bold text-teal-200">Listening to your voice... Speak now</span>
            </div>

            {/* Equalizer Wave Bars */}
            <div className="flex items-center gap-1 h-5">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div
                  key={i}
                  style={{ height: `${Math.min(20, Math.max(4, (audioLevel / 100) * 20))}px` }}
                  className="w-1 bg-emerald-400 rounded-full transition-all"
                />
              ))}
            </div>

            <button
              type="button"
              onClick={toggleListening}
              className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold rounded-lg text-xs"
            >
              Done
            </button>
          </div>
        )}

        {/* Audio Transcribing Spinner */}
        {isTranscribingAudio && (
          <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center gap-2 animate-pulse">
            <Activity className="w-4 h-4 animate-spin text-teal-700" />
            <span>Transcribing your speech with multimodal AI...</span>
          </div>
        )}

        {/* Speech Error Banner if any */}
        {speechError && (
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 text-xs text-amber-950 space-y-1.5 animate-in fade-in">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
                <span className="font-semibold">{speechError}</span>
              </div>
              <button
                type="button"
                onClick={() => setSpeechError(null)}
                className="text-amber-800 hover:text-amber-950 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-3 pt-1 border-t border-amber-200/60 text-[11px]">
              <a
                href={typeof window !== 'undefined' ? window.location.href : '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-amber-900 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Open in Full Tab for direct mic prompt</span>
              </a>
              <span>· You can also type directly in the box above</span>
            </div>
          </div>
        )}

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${
                isListening
                  ? 'bg-rose-50 text-rose-800 border-rose-300 animate-pulse'
                  : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
              }`}
              title="Browser voice input (Processed locally + AI transcription backup)"
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5 text-rose-700" />
                  <span>{t.intakeMicListening}</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5 text-teal-700" />
                  <span>{t.intakeMicBtn}</span>
                </>
              )}
            </button>

            {onOpenVoiceSaathi && (
              <button
                type="button"
                onClick={onOpenVoiceSaathi}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-teal-700 to-emerald-700 text-white hover:from-teal-800 hover:to-emerald-800 shadow-xs transition-all"
                title="Open Two-Way Voice Saathi Modal"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Voice Saathi 🎙️ (Two-Way Speaking & Writing)</span>
              </button>
            )}

            {intakeText && (
              <button
                type="button"
                onClick={onClear}
                className="px-3 py-2 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              >
                {t.intakeClearBtn}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={intakeText.trim().length < 5 || isLoading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-700 text-white font-semibold text-xs sm:text-sm hover:bg-teal-800 disabled:opacity-50 disabled:cursor-not-allowed shadow-xs transition-all focus-visible:outline-2 focus-visible:outline-teal-600"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking Safety & Urgency...</span>
              </>
            ) : (
              <>
                <span>{t.intakeSubmitBtn}</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Voice and Privacy Notice */}
        <div className="pt-2 text-[11px] text-stone-600 border-t border-dashed border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <span>{t.intakeVoiceConsent}</span>
          <span className="text-teal-700 font-medium">{t.privacyBadge}</span>
        </div>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-700">
          <Sparkles className="w-3.5 h-3.5 text-teal-700" />
          <span>Or click an example scenario:</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sampleSuggestions.map((sugg, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIntakeText(sugg.text)}
              className="text-left p-3 rounded-xl bg-white border border-stone-200 hover:border-teal-600 hover:bg-teal-50/40 text-stone-700 transition-all text-xs group"
            >
              <div className="font-semibold text-stone-900 group-hover:text-teal-900 mb-0.5">
                {sugg.label}
              </div>
              <p className="text-[11px] text-stone-600 line-clamp-1">
                {sugg.text}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
