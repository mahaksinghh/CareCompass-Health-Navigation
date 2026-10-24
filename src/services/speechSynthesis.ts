import { SupportedLanguage, VoiceModulationConfig, VoicePersona } from '../types/index.ts';

export const DEFAULT_VOICE_CONFIG: VoiceModulationConfig = {
  pitch: 1.0,
  rate: 0.92, // Calm healthcare pacing
  volume: 1.0,
  persona: 'calm_navigator',
  autoSpeakPrompts: false,
  hinglishCadence: 'balanced'
};

const PERSONA_PRESETS: Record<VoicePersona, { pitch: number; rate: number }> = {
  calm_navigator: { pitch: 1.0, rate: 0.92 },
  clear_deliberate: { pitch: 1.15, rate: 0.82 },
  warm_companion: { pitch: 1.05, rate: 0.98 },
  gentle_senior: { pitch: 0.92, rate: 0.78 }
};

// Language to BCP 47 locale codes
const LOCALE_MAP: Record<SupportedLanguage, string[]> = {
  en: ['en-IN', 'en-GB', 'en-US', 'en'],
  hi: ['hi-IN', 'hi'],
  hinglish: ['en-IN', 'hi-IN', 'en-GB', 'en'],
  bn: ['bn-IN', 'bn-BD', 'bn'],
  mr: ['mr-IN', 'mr', 'hi-IN'], // Marathi, fallback to Indian Devanagari voice
  ta: ['ta-IN', 'ta-LK', 'ta']
};

class SpeechService {
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private isSupported: boolean = typeof window !== 'undefined' && 'speechSynthesis' in window;
  private voices: SpeechSynthesisVoice[] = [];
  private onStatusChangeListeners: Set<(isSpeaking: boolean) => void> = new Set();
  private isCurrentlySpeaking: boolean = false;

  constructor() {
    if (this.isSupported) {
      this.loadVoices();
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices() {
    if (!this.isSupported) return;
    this.voices = window.speechSynthesis.getVoices();
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.voices.length === 0 && this.isSupported) {
      this.loadVoices();
    }
    return this.voices;
  }

  public subscribeStatus(listener: (isSpeaking: boolean) => void): () => void {
    this.onStatusChangeListeners.add(listener);
    listener(this.isCurrentlySpeaking);
    return () => this.onStatusChangeListeners.delete(listener);
  }

  private notifyStatus(isSpeaking: boolean) {
    this.isCurrentlySpeaking = isSpeaking;
    this.onStatusChangeListeners.forEach(listener => listener(isSpeaking));
  }

  /**
   * Selects the most appropriate available voice for the target language.
   */
  public findBestVoice(language: SupportedLanguage): SpeechSynthesisVoice | null {
    if (!this.isSupported) return null;
    if (this.voices.length === 0) this.loadVoices();

    const preferredLocales = LOCALE_MAP[language] || ['en-US'];

    for (const locale of preferredLocales) {
      const match = this.voices.find(v => v.lang.toLowerCase() === locale.toLowerCase() || v.lang.toLowerCase().startsWith(locale.toLowerCase()));
      if (match) return match;
    }

    // Secondary search: check voice name for language keywords
    const langKeywords: Record<SupportedLanguage, string[]> = {
      en: ['india', 'indian', 'english'],
      hi: ['hindi', 'india'],
      hinglish: ['india', 'indian', 'hindi', 'english'],
      bn: ['bengali', 'bangla', 'india'],
      mr: ['marathi', 'india', 'hindi'],
      ta: ['tamil', 'india']
    };

    const keywords = langKeywords[language] || [];
    for (const kw of keywords) {
      const match = this.voices.find(v => v.name.toLowerCase().includes(kw));
      if (match) return match;
    }

    return this.voices[0] || null;
  }

  /**
   * Prepares Hinglish text with optimized cadence so mixed Hindi-English words
   * are read with natural pauses and clear acoustic spacing.
   */
  private prepareHinglishText(text: string, cadence: VoiceModulationConfig['hinglishCadence']): string {
    let prepared = text;

    if (cadence === 'clear_pace') {
      // Add micro pauses around common Hinglish transitional particles
      prepared = prepared
        .replace(/\b(ko|me|hai|nahi|chahiye|aur|ke|se|par|kya)\b/gi, '$1,')
        .replace(/,\s*,/g, ',');
    } else if (cadence === 'conversational') {
      // Smooth out contractions
      prepared = prepared.replace(/\bdoc\b/gi, 'doctor').replace(/\bmeds\b/gi, 'medicines');
    }

    return prepared;
  }

  /**
   * Modulate and speak text in any supported language.
   */
  public speak(
    text: string,
    language: SupportedLanguage,
    config: VoiceModulationConfig = DEFAULT_VOICE_CONFIG,
    onEndCallback?: () => void
  ): boolean {
    if (!this.isSupported) return false;

    this.stop();

    // Clean markdown and formatting symbols for natural vocalization
    let cleanText = text
      .replace(/[*#_`~>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return false;

    // Apply language-specific preparation
    if (language === 'hinglish') {
      cleanText = this.prepareHinglishText(cleanText, config.hinglishCadence);
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);

    // Apply voice
    const bestVoice = this.findBestVoice(language);
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = LOCALE_MAP[language][0] || 'en-IN';
    }

    // Apply Voice Modulation: Pitch, Rate, Volume
    // Calculate final pitch & rate from persona + custom sliders
    const personaAdjustment = PERSONA_PRESETS[config.persona] || PERSONA_PRESETS.calm_navigator;

    // Hinglish gets a deliberate 0.90x pacing factor for mixed phrase comprehension
    const languageFactor = language === 'hinglish' ? 0.90 : 1.0;

    const finalRate = Math.min(1.5, Math.max(0.5, config.rate * (personaAdjustment.rate / 0.92) * languageFactor));
    const finalPitch = Math.min(1.5, Math.max(0.5, config.pitch * (personaAdjustment.pitch / 1.0)));

    utterance.rate = finalRate;
    utterance.pitch = finalPitch;
    utterance.volume = Math.min(1.0, Math.max(0.1, config.volume));

    utterance.onstart = () => {
      this.notifyStatus(true);
    };

    utterance.onend = () => {
      this.notifyStatus(false);
      this.currentUtterance = null;
      if (onEndCallback) onEndCallback();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      this.notifyStatus(false);
      this.currentUtterance = null;
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  private streamIntervalId: any = null;

  public speakWithStreamingText(
    text: string,
    language: SupportedLanguage,
    config: VoiceModulationConfig = DEFAULT_VOICE_CONFIG,
    onProgress: (displayedText: string, currentWord: string, isFinished: boolean) => void
  ): boolean {
    this.stop();

    let cleanText = text
      .replace(/[*#_`~>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return false;

    if (language === 'hinglish') {
      cleanText = this.prepareHinglishText(cleanText, config.hinglishCadence);
    }

    const personaAdjustment = PERSONA_PRESETS[config.persona] || PERSONA_PRESETS.calm_navigator;
    const languageFactor = language === 'hinglish' ? 0.90 : 1.0;
    const finalRate = Math.min(1.5, Math.max(0.5, config.rate * (personaAdjustment.rate / 0.92) * languageFactor));
    const finalPitch = Math.min(1.5, Math.max(0.5, config.pitch * (personaAdjustment.pitch / 1.0)));

    const words = cleanText.split(' ');
    let currentWordIndex = 0;

    // Start text streaming timer IMMEDIATELY so teleprompter never freezes even if speech audio is delayed or blocked
    const baseWordMs = Math.max(120, Math.round(360 / finalRate));
    onProgress(words[0] || '', words[0] || '', false);
    currentWordIndex = 1;

    this.streamIntervalId = setInterval(() => {
      if (currentWordIndex < words.length) {
        currentWordIndex++;
        const shown = words.slice(0, currentWordIndex).join(' ');
        const currWord = words[currentWordIndex - 1] || '';
        onProgress(shown, currWord, currentWordIndex >= words.length);
      } else {
        if (this.streamIntervalId) {
          clearInterval(this.streamIntervalId);
          this.streamIntervalId = null;
        }
        if (!this.isCurrentlySpeaking) {
          onProgress(cleanText, '', true);
        }
      }
    }, baseWordMs);

    if (!this.isSupported) {
      return false;
    }

    try {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }
    } catch {
      // ignore
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const bestVoice = this.findBestVoice(language);
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang;
    } else {
      utterance.lang = LOCALE_MAP[language][0] || 'en-IN';
    }

    utterance.rate = finalRate;
    utterance.pitch = finalPitch;
    utterance.volume = Math.min(1.0, Math.max(0.1, config.volume));

    utterance.onstart = () => {
      this.notifyStatus(true);
    };

    utterance.onboundary = (e) => {
      if (e.name === 'word') {
        const charIndex = e.charIndex;
        const textUpToChar = cleanText.substring(0, charIndex + (e.charLength || 3));
        const wordsUpToChar = textUpToChar.trim().split(' ');
        if (wordsUpToChar.length > currentWordIndex && wordsUpToChar.length <= words.length) {
          currentWordIndex = wordsUpToChar.length;
          const shown = words.slice(0, currentWordIndex).join(' ');
          const currWord = words[currentWordIndex - 1] || '';
          onProgress(shown, currWord, false);
        }
      }
    };

    utterance.onend = () => {
      if (this.streamIntervalId) {
        clearInterval(this.streamIntervalId);
        this.streamIntervalId = null;
      }
      this.notifyStatus(false);
      this.currentUtterance = null;
      onProgress(cleanText, '', true);
    };

    utterance.onerror = (err) => {
      console.warn('SpeechSynthesis utterance warning:', err);
      if (this.streamIntervalId) {
        clearInterval(this.streamIntervalId);
        this.streamIntervalId = null;
      }
      this.notifyStatus(false);
      this.currentUtterance = null;
      onProgress(cleanText, '', true);
    };

    this.currentUtterance = utterance;
    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('speechSynthesis.speak call error:', e);
    }
    return true;
  }

  public stop(): void {
    if (this.streamIntervalId) {
      clearInterval(this.streamIntervalId);
      this.streamIntervalId = null;
    }
    if (!this.isSupported) return;
    try {
      window.speechSynthesis.cancel();
    } catch (err) {
      console.warn('Stop speech error:', err);
    }
    this.notifyStatus(false);
    this.currentUtterance = null;
  }

  public isSpeaking(): boolean {
    return this.isCurrentlySpeaking;
  }

  public getPersonaPresets() {
    return PERSONA_PRESETS;
  }
}

export const speechService = new SpeechService();
