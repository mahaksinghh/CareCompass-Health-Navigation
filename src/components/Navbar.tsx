import React, { useState } from 'react';
import { Compass, Globe, Sparkles, Shield, RotateCcw, Eye, Type } from 'lucide-react';
import { SupportedLanguage } from '../types/index.ts';
import { translations } from '../i18n/translations.ts';

interface NavbarProps {
  currentTab: 'guidance' | 'caregivers' | 'safety' | 'privacy';
  setCurrentTab: (tab: 'guidance' | 'caregivers' | 'safety' | 'privacy') => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  onOpenDemo: () => void;
  onOpenVoiceSaathi: () => void;
  onOpenVoiceSettings: () => void;
  onOpenTinyFish?: () => void;
  onResetSession: () => void;
  highContrast: boolean;
  setHighContrast: (val: boolean) => void;
  textSize: 'normal' | 'large' | 'xl';
  setTextSize: (val: 'normal' | 'large' | 'xl') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  language,
  setLanguage,
  onOpenDemo,
  onOpenVoiceSaathi,
  onOpenVoiceSettings,
  onOpenTinyFish,
  onResetSession,
  highContrast,
  setHighContrast,
  textSize,
  setTextSize
}) => {
  const t = translations[language];
  const [showAccessMenu, setShowAccessMenu] = useState(false);

  return (
    <header className="border-b border-stone-200 bg-white/95 backdrop-blur-sm sticky top-0 z-40 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <button
            onClick={() => setCurrentTab('guidance')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-2 focus-visible:outline-teal-600 rounded-lg p-1 group"
            aria-label="CareCompass Home"
          >
            <div className="w-9 h-9 rounded-xl bg-teal-700 text-white flex items-center justify-center shadow-xs group-hover:bg-teal-800 transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="font-semibold text-stone-900 text-lg tracking-tight block leading-tight">
                CareCompass
              </span>
              <span className="text-xs text-stone-700 block">
                Care Navigation & Support
              </span>
            </div>
          </button>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main Navigation">
            <button
              onClick={() => setCurrentTab('guidance')}
              className={`text-sm font-medium transition-colors hover:text-stone-900 pb-1 border-b-2 ${
                currentTab === 'guidance'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-stone-600'
              }`}
            >
              {t.navGuidance}
            </button>
            <button
              onClick={() => setCurrentTab('caregivers')}
              className={`text-sm font-medium transition-colors hover:text-stone-900 pb-1 border-b-2 ${
                currentTab === 'caregivers'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-stone-600'
              }`}
            >
              {t.navCaregivers}
            </button>
            <button
              onClick={() => setCurrentTab('safety')}
              className={`text-sm font-medium transition-colors hover:text-stone-900 pb-1 border-b-2 flex items-center gap-1.5 ${
                currentTab === 'safety'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-stone-600'
              }`}
            >
              <Shield className="w-4 h-4 text-emerald-700" />
              {t.navSafety}
            </button>
            <button
              onClick={() => setCurrentTab('privacy')}
              className={`text-sm font-medium transition-colors hover:text-stone-900 pb-1 border-b-2 ${
                currentTab === 'privacy'
                  ? 'border-teal-700 text-teal-800'
                  : 'border-transparent text-stone-600'
              }`}
            >
              {t.navPrivacy}
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Dedicated Voice Saathi Companion Button */}
            <button
              onClick={onOpenVoiceSaathi}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-teal-700 to-emerald-700 text-white hover:from-teal-800 hover:to-emerald-800 shadow-sm transition-all transform hover:scale-102 focus-visible:outline-2 focus-visible:outline-teal-600"
              title="Open Voice Saathi - Multilingual Speech Companion"
              aria-label="Open Voice Saathi"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
              </span>
              <span>Voice Saathi</span>
              <span className="text-[10px] bg-white/20 px-1 py-0.2 rounded font-normal">🎙️ AI</span>
            </button>

            {/* TinyFish Registry Button */}
            {onOpenTinyFish && (
              <button
                onClick={onOpenTinyFish}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-900 border border-indigo-200 hover:bg-indigo-100 transition-colors focus-visible:outline-2 focus-visible:outline-teal-600 shadow-2xs"
                title="TinyFish Web Agent & Live Health Facility Finder"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-700" />
                <span>TinyFish Verified</span>
              </button>
            )}

            {/* Demo Scenarios Button */}
            <button
              onClick={onOpenDemo}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors focus-visible:outline-2 focus-visible:outline-teal-600"
              title="Open judges demo scenarios"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-700" />
              <span>Demo Presets</span>
            </button>

            {/* Voice Modulation Control Button */}
            <button
              onClick={onOpenVoiceSettings}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors focus-visible:outline-2 focus-visible:outline-teal-600 shadow-2xs"
              title="Open Voice Modulation Controls (Speed, Pitch, Hinglish Tone)"
              aria-label="Voice Modulation Controls"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-600"></span>
              </span>
              <span className="hidden sm:inline">Modulation</span>
              <span className="sm:hidden">Tuning</span>
            </button>

            {/* Language Selector with 6 Languages */}
            <div className="relative inline-flex items-center">
              <label htmlFor="language-select" className="sr-only">Select language</label>
              <Globe className="w-4 h-4 text-stone-500 absolute left-2 pointer-events-none" />
              <select
                id="language-select"
                value={language}
                onChange={e => setLanguage(e.target.value as SupportedLanguage)}
                className="pl-7 pr-3 py-1.5 text-xs font-medium rounded-lg border border-stone-200 bg-stone-50 text-stone-800 hover:border-stone-300 focus-visible:outline-2 focus-visible:outline-teal-600 cursor-pointer"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="hinglish">Hinglish (Colloquial)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Accessibility Dropdown Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowAccessMenu(!showAccessMenu)}
                className="p-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-teal-600"
                aria-label="Accessibility options"
                title="Accessibility options"
              >
                <Eye className="w-4 h-4" />
              </button>

              {showAccessMenu && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-stone-200 shadow-lg p-3 z-50 text-xs">
                  <div className="font-semibold text-stone-800 mb-2 flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5" />
                    <span>Accessibility Preferences</span>
                  </div>
                  
                  <div className="mb-3">
                    <span className="text-stone-700 block mb-1">Text Size:</span>
                    <div className="grid grid-cols-3 gap-1">
                      {(['normal', 'large', 'xl'] as const).map(s => (
                        <button
                          key={s}
                          onClick={() => setTextSize(s)}
                          className={`py-1 rounded text-center border font-medium ${
                            textSize === s
                              ? 'bg-teal-700 text-white border-teal-700'
                              : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                          }`}
                        >
                          {s === 'normal' ? '100%' : s === 'large' ? '125%' : '150%'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-stone-700">High Contrast:</span>
                    <button
                      onClick={() => setHighContrast(!highContrast)}
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        highContrast
                          ? 'bg-stone-900 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {highContrast ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reset Session Button */}
            <button
              onClick={onResetSession}
              className="p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-teal-600"
              title="Clear active session data"
              aria-label="Reset session"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="flex md:hidden border-t border-stone-100 bg-stone-50/90 px-4 py-2 gap-2 text-xs font-medium justify-around items-center">
        <button
          onClick={() => setCurrentTab('guidance')}
          className={`${currentTab === 'guidance' ? 'text-teal-700 font-semibold' : 'text-stone-600'}`}
        >
          {t.navGuidance}
        </button>
        <button
          onClick={() => setCurrentTab('caregivers')}
          className={`${currentTab === 'caregivers' ? 'text-teal-700 font-semibold' : 'text-stone-600'}`}
        >
          {t.navCaregivers}
        </button>
        <button
          onClick={onOpenVoiceSaathi}
          className="px-2.5 py-1 rounded-full bg-teal-700 text-white font-bold flex items-center gap-1 shadow-2xs"
          title="Open Voice Saathi"
        >
          <span>🎙️ Saathi</span>
        </button>
        <button
          onClick={() => setCurrentTab('safety')}
          className={`${currentTab === 'safety' ? 'text-teal-700 font-semibold' : 'text-stone-600'}`}
        >
          {t.navSafety}
        </button>
        <button
          onClick={() => setCurrentTab('privacy')}
          className={`${currentTab === 'privacy' ? 'text-teal-700 font-semibold' : 'text-stone-600'}`}
        >
          {t.navPrivacy}
        </button>
      </div>
    </header>
  );
};
