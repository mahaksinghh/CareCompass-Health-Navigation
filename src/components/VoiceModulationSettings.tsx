import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Gauge,
  Sliders,
  Sparkles,
  Play,
  Square,
  HelpCircle
} from 'lucide-react';
import {
  SupportedLanguage,
  VoiceModulationConfig,
  VoicePersona
} from '../types/index.ts';
import { speechService } from '../services/speechSynthesis.ts';
import { translations } from '../i18n/translations.ts';

interface VoiceModulationSettingsProps {
  language: SupportedLanguage;
  config: VoiceModulationConfig;
  onChangeConfig: (newConfig: VoiceModulationConfig) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_PHRASES: Record<SupportedLanguage, string> = {
  en: 'Hello. I am CareCompass. I can guide you through your health concern calmly and safely.',
  hi: 'नमस्ते। मैं केयरकम्पास हूँ। मैं आपकी समस्या को समझकर सुरक्षित कदम सुझाने में मदद करूँगा।',
  hinglish: 'Hello ji. CareCompass me aapka welcome hai. Aapki problem ko step-by-step calmly evaluate karenge.',
  bn: 'নমস্কার। আমি কেয়ারকম্পাস। আপনার স্বাস্থ্য বিষয়ক যেকোনো প্রয়োজনে নিরাপদ পথপ্রদর্শন করব।',
  mr: 'नमस्कार. मी केअरकंपास आहे. तुमच्या आरोग्याची समस्या समजून मी योग्य मार्गदर्शन करेन.',
  ta: 'வணக்கம். நான் கேர்காம்பஸ். உங்கள் உடல்நலக் கவலையை அமைதியாகவும் பாதுகாப்பாகவும் வழிநடத்துகிறேன்.'
};

export const VoiceModulationSettings: React.FC<VoiceModulationSettingsProps> = ({
  language,
  config,
  onChangeConfig,
  isOpen,
  onClose
}) => {
  const t = translations[language];
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsubscribe = speechService.subscribeStatus(setIsSpeaking);
    return () => unsubscribe();
  }, []);

  if (!isOpen) return null;

  const handlePersonaChange = (persona: VoicePersona) => {
    const presets = speechService.getPersonaPresets();
    const preset = presets[persona];
    onChangeConfig({
      ...config,
      persona,
      pitch: preset.pitch,
      rate: preset.rate
    });
  };

  const handleTestVoice = () => {
    const sample = SAMPLE_PHRASES[language] || SAMPLE_PHRASES.en;
    speechService.speak(sample, language, config);
  };

  const handleStopVoice = () => {
    speechService.stop();
  };

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                {t.voiceModulationLabel}
              </h3>
              <span className="text-[11px] text-stone-500">
                Pacing, pitch, and timbre across all 6 languages
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg text-lg leading-none"
            aria-label="Close voice settings"
          >
            ✕
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs text-stone-800">
          {/* Active Audio Waveform State */}
          <div className="p-3.5 rounded-xl bg-teal-50/70 border border-teal-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`w-3 h-3 rounded-full ${
                  isSpeaking ? 'bg-emerald-500 animate-ping' : 'bg-stone-300'
                }`}
              />
              <span className="font-semibold text-teal-950">
                {isSpeaking ? 'Audio Playing with Modulated Tone' : 'Voice Modulation Ready'}
              </span>
            </div>

            {isSpeaking ? (
              <button
                onClick={handleStopVoice}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition-colors shadow-xs"
              >
                <Square className="w-3 h-3 fill-white" />
                <span>Stop</span>
              </button>
            ) : (
              <button
                onClick={handleTestVoice}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 text-white font-semibold text-xs hover:bg-teal-800 transition-colors shadow-xs"
              >
                <Play className="w-3 h-3 fill-white" />
                <span>Test Voice ({language.toUpperCase()})</span>
              </button>
            )}
          </div>

          {/* Persona Selection */}
          <div className="space-y-2">
            <label className="font-bold text-stone-900 block">
              1. Voice Tone Persona:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'calm_navigator', title: 'Calm Navigator', desc: 'Warm, reassuring medical guide' },
                { id: 'clear_deliberate', title: 'Clear & Deliberate', desc: 'Crisp enunciation for clarity' },
                { id: 'warm_companion', title: 'Warm Companion', desc: 'Friendly home care pacing' },
                { id: 'gentle_senior', title: 'Gentle Senior', desc: 'Relaxed, slower tempo for elders' }
              ].map(p => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePersonaChange(p.id as VoicePersona)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    config.persona === p.id
                      ? 'border-teal-700 bg-teal-50/60 ring-1 ring-teal-700 text-teal-950 font-semibold'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <div className="text-xs font-bold mb-0.5">{p.title}</div>
                  <div className="text-[10px] text-stone-500 font-normal leading-tight">
                    {p.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders: Rate & Pitch */}
          <div className="space-y-4 pt-2 border-t border-stone-100">
            {/* Speed / Rate */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <Gauge className="w-3.5 h-3.5 text-teal-700" />
                  <span>Speech Speed (Pacing): {config.rate}x</span>
                </span>
                <span className="text-[10px] text-stone-500">
                  {config.rate < 0.85 ? 'Deliberate / Senior' : config.rate > 1.15 ? 'Brisk' : 'Standard Calm'}
                </span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.4"
                step="0.05"
                value={config.rate}
                onChange={e =>
                  onChangeConfig({ ...config, rate: parseFloat(e.target.value) })
                }
                className="w-full accent-teal-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>0.6x Slow</span>
                <span>1.0x Normal</span>
                <span>1.4x Fast</span>
              </div>
            </div>

            {/* Pitch / Tone */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                  <span>Pitch (Acoustic Tone): {config.pitch}x</span>
                </span>
                <span className="text-[10px] text-stone-500">
                  {config.pitch < 0.9 ? 'Deep / Warm' : config.pitch > 1.1 ? 'Higher / Crisp' : 'Natural'}
                </span>
              </div>
              <input
                type="range"
                min="0.7"
                max="1.3"
                step="0.05"
                value={config.pitch}
                onChange={e =>
                  onChangeConfig({ ...config, pitch: parseFloat(e.target.value) })
                }
                className="w-full accent-teal-700 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400">
                <span>0.7x Deep</span>
                <span>1.0x Balanced</span>
                <span>1.3x Bright</span>
              </div>
            </div>

            {/* Volume */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between font-semibold text-stone-700">
                <span className="flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5 text-teal-700" />
                  <span>Audio Volume: {Math.round(config.volume * 100)}%</span>
                </span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.1"
                value={config.volume}
                onChange={e =>
                  onChangeConfig({ ...config, volume: parseFloat(e.target.value) })
                }
                className="w-full accent-teal-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Hinglish Acoustic Cadence Optimization */}
          <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                <span>Hinglish Code-Switch Cadence</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold">
                Mixed Hindi-English
              </span>
            </div>
            <p className="text-[11px] text-stone-600 leading-normal">
              Specialized prosody engine inserts natural micro-pauses at language transition boundaries so code-switched phrases remain crisp and expressive.
            </p>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              {[
                { id: 'balanced', label: 'Balanced' },
                { id: 'clear_pace', label: 'Clear Paced' },
                { id: 'conversational', label: 'Colloquial' }
              ].map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    onChangeConfig({
                      ...config,
                      hinglishCadence: c.id as VoiceModulationConfig['hinglishCadence']
                    })
                  }
                  className={`py-1.5 px-2 rounded-lg text-center font-medium transition-all ${
                    config.hinglishCadence === c.id
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'bg-white border border-amber-200 text-amber-900 hover:bg-amber-100/50'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 flex items-center justify-between bg-stone-50 rounded-b-2xl">
          <button
            onClick={() => {
              onChangeConfig({
                pitch: 1.0,
                rate: 0.92,
                volume: 1.0,
                persona: 'calm_navigator',
                autoSpeakPrompts: false,
                hinglishCadence: 'balanced'
              });
            }}
            className="text-stone-500 hover:text-stone-800 text-xs font-semibold"
          >
            Reset Defaults
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-teal-700 text-white font-semibold text-xs hover:bg-teal-800 transition-colors shadow-xs"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
