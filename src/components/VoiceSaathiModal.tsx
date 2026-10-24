import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  X,
  Activity,
  UserCheck,
  Flame,
  Radio,
  Repeat,
  ShieldCheck,
  Send,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import {
  SupportedLanguage,
  VoiceModulationConfig
} from '../types/index.ts';
import { speechService } from '../services/speechSynthesis.ts';
import { api } from '../services/apiClient.ts';
import { audioCaptureService } from '../services/audioCapture.ts';

interface VoiceSaathiModalProps {
  isOpen: boolean;
  onClose: () => void;
  appLanguage: SupportedLanguage;
  voiceConfig: VoiceModulationConfig;
  onUpdateVoiceConfig: (config: VoiceModulationConfig) => void;
  onNavigateToCaregivers?: () => void;
  onTransferToIntake?: (text: string) => void;
  onOpenTinyFish?: () => void;
}

interface ConversationTurn {
  id: string;
  sender: 'user' | 'saathi';
  text: string;
  timestamp: string;
  isEmergency?: boolean;
  urgencyLevel?: string;
  careType?: string;
  inputMode?: 'voice' | 'typed';
}

export const VoiceSaathiModal: React.FC<VoiceSaathiModalProps> = ({
  isOpen,
  onClose,
  appLanguage,
  voiceConfig,
  onUpdateVoiceConfig,
  onNavigateToCaregivers,
  onTransferToIntake,
  onOpenTinyFish
}) => {
  // Languages
  const [inputLang, setInputLang] = useState<SupportedLanguage>(appLanguage);
  const [responseLang, setResponseLang] = useState<SupportedLanguage>(appLanguage);

  // Interaction mode & speech state
  const [isListening, setIsListening] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0); // 0-100 from mic analyser
  const [userTranscript, setUserTranscript] = useState('');
  const [typedInput, setTypedInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeakingAudio, setIsSpeakingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Two-Way Continuous Conversation Loop Toggle
  const [continuousDialogueMode, setContinuousDialogueMode] = useState(false);

  // Synchronized writing state (Real-time typewriter streaming while voice speaks)
  const [streamedText, setStreamedText] = useState('');
  const [activeWord, setActiveWord] = useState('');
  const [streamingFinished, setStreamingFinished] = useState(true);

  // Dialogue History & Latest Response
  const [history, setHistory] = useState<ConversationTurn[]>([]);
  const [latestResponse, setLatestResponse] = useState<{
    spokenText: string;
    displayText: string;
    isEmergency: boolean;
    urgencyLevel: string;
    careType: string;
    suggestedCareSetting: string;
    timeframe: string;
  } | null>(null);

  const turnsEndRef = useRef<HTMLDivElement | null>(null);
  const textInputRef = useRef<HTMLInputElement | null>(null);

  // Quick preset chips across languages
  const samplePrompts: Record<SupportedLanguage, { label: string; text: string }[]> = {
    hinglish: [
      { label: 'Elderly walking help', text: 'Mummy ko 3 din se chalne me problem ho rahi hai, ek home companion chahiye.' },
      { label: 'Emergency chest pain test', text: 'Bohot severe chest pain ho raha hai aur left arm me dard ja raha hai.' },
      { label: 'TinyFish Verified Centers', text: 'Mujhe verified nearby trauma hospital aur caregiver agency dekhni hai.' },
      { label: 'Mild fever & fatigue', text: 'Thoda sa mild fever hai kal raat se, doctor kab consult karein?' }
    ],
    hi: [
      { label: 'बुजुर्ग सहायता', text: 'पिताजी को घर पर चलने फिरने और दवा याद दिलाने के लिए सहायक चाहिए।' },
      { label: 'आपातकालीन सीने का दर्द', text: 'सीने में भारी दबाव और सांस लेने में बहुत कठिनाई हो रही है।' },
      { label: 'वेरिफाइड अस्पताल', text: 'कृपया पास के वेरिफाइड 24/7 आपातकालीन अस्पताल बताएं।' },
      { label: 'हल्का सिरदर्द', text: 'मुझे पिछले दो दिनों से हल्का सिरदर्द है, क्या करना चाहिए?' }
    ],
    en: [
      { label: 'Elderly Home Care', text: 'My father needs assistance with walking and daily routine tasks at home.' },
      { label: 'Acute Emergency', text: 'Severe crushing chest pain spreading to neck and difficulty breathing.' },
      { label: 'TinyFish Facility Check', text: 'Find verified 24/7 trauma centers and accredited caregivers in Delhi.' },
      { label: 'Mild knee discomfort', text: 'Mild knee stiffness for past week, looking for non-urgent guidance.' }
    ],
    bn: [
      { label: 'গৃহ সাহায্য', text: 'আমার ঠাকুমা একা হাঁটতে পারছেন না, ঘরে একজন সাহায্যকারী দরকার।' },
      { label: 'জরুরি বুকে ব্যথা', text: 'বুকে তীব্র যন্ত্রণা ও শ্বাসকষ্ট হচ্ছে, খুবই অস্বস্তি লাগছে।' }
    ],
    mr: [
      { label: 'घरातील मदत', text: 'माझ्या आईला आंघोळ आणि चालण्यासाठी एका सहाय्यकाची गरज आहे.' },
      { label: 'आणीबाणी लक्षणे', text: 'छातीत प्रचंड दुखत आहे आणि श्वास घ्यायला त्रास होत आहे.' }
    ],
    ta: [
      { label: 'வீட்டுப் பராமரிப்பு', text: 'என் தாத்தாவிற்கு வீட்டில் நடக்க உதவி செய்ய ஒரு பராமரிப்பாளர் வேண்டும்.' },
      { label: 'அவசர சிகிச்சை', text: 'நெஞ்சில் கடுமையான வலி மற்றும் மூச்சுத் திணறல் உள்ளது.' }
    ]
  };

  // Sync with app language on open
  useEffect(() => {
    if (isOpen) {
      setInputLang(appLanguage);
      setResponseLang(appLanguage);
    }
  }, [isOpen, appLanguage]);

  // Subscribe to speech synthesis status
  useEffect(() => {
    const unsub = speechService.subscribeStatus(speaking => {
      setIsSpeakingAudio(speaking);
    });
    return () => unsub();
  }, []);

  // Auto scroll dialogue
  useEffect(() => {
    turnsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history, streamedText]);

  // Cleanup on modal close or unmount
  useEffect(() => {
    if (!isOpen) {
      speechService.stop();
      audioCaptureService.stop();
      setIsListening(false);
      setIsSpeakingAudio(false);
      setAudioLevel(0);
    }
  }, [isOpen]);

  // ----------------------------------------------------
  // DUAL-ENGINE AUDIO LISTENING
  // ----------------------------------------------------
  const startListening = async () => {
    speechService.stop();
    setAudioError(null);
    setUserTranscript('');

    const started = await audioCaptureService.start(inputLang, {
      onTranscriptUpdate: (text, _isFinal) => {
        setUserTranscript(text);
      },
      onAudioLevel: (level) => {
        setAudioLevel(level);
      },
      onError: (errMsg) => {
        setAudioError(errMsg);
        setIsListening(false);
      },
      onAutoSilenceDetected: () => {
        // Automatically stop and submit after user pauses speaking
        stopListeningAndSend();
      }
    });

    if (started) {
      setIsListening(true);
    }
  };

  const stopListeningAndSend = async () => {
    setIsListening(false);
    setAudioLevel(0);

    const { audioBlob, transcript } = await audioCaptureService.stop();
    let textToSend = (transcript || userTranscript).trim();

    // If Web Speech API did not capture text (e.g. browser restriction or network issue),
    // send audio blob to Gemini 3.8 Flash transcription endpoint
    if (!textToSend && audioBlob && audioBlob.size > 1000) {
      setIsProcessing(true);
      try {
        const transResult = await api.transcribeAudio(audioBlob, inputLang);
        if (transResult.transcript) {
          textToSend = transResult.transcript.trim();
          setUserTranscript(textToSend);
        }
      } catch (err) {
        console.warn('Backend audio transcription error:', err);
      } finally {
        setIsProcessing(false);
      }
    }

    if (textToSend) {
      handleSendPrompt(textToSend, 'voice');
    } else {
      setAudioError('No speech detected. Please speak clearly into your mic or type below.');
    }
  };

  // ----------------------------------------------------
  // SEND PROMPT & RECEIVE MULTIMODAL SAATHI ANSWER
  // ----------------------------------------------------
  const handleSendPrompt = async (textToSend: string, mode: 'voice' | 'typed' = 'typed') => {
    if (!textToSend.trim()) return;
    speechService.stop();
    setIsProcessing(true);
    setStreamedText('');
    setActiveWord('');
    setStreamingFinished(false);
    setAudioError(null);

    // Add user turn
    const userTurn: ConversationTurn = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      inputMode: mode
    };
    setHistory(prev => [...prev, userTurn]);
    setUserTranscript('');
    setTypedInput('');

    try {
      const response = await api.askVoiceSaathi(textToSend, inputLang, responseLang);
      setLatestResponse(response);

      // Add Saathi turn
      const saathiTurn: ConversationTurn = {
        id: `s-${Date.now()}`,
        sender: 'saathi',
        text: response.displayText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isEmergency: response.isEmergency,
        urgencyLevel: response.urgencyLevel,
        careType: response.careType
      };
      setHistory(prev => [...prev, saathiTurn]);

      // EXECUTE SYNCHRONIZED TWO-WAY SPEECH & REAL-TIME KARAOKE WRITING
      speechService.speakWithStreamingText(
        response.spokenText,
        responseLang,
        voiceConfig,
        (displayedWords, currentWord, isFinished) => {
          setStreamedText(displayedWords);
          setActiveWord(currentWord);
          setStreamingFinished(isFinished);

          // If continuous two-way conversation mode is enabled,
          // automatically start listening when Saathi finishes speaking!
          if (isFinished && continuousDialogueMode && !response.isEmergency) {
            setTimeout(() => {
              if (isOpen && !isProcessing) {
                startListening();
              }
            }, 800);
          }
        }
      );
    } catch (err) {
      console.error('Voice Saathi error:', err);
      const errorMsg = 'Could not process audio query. Please verify connection and try again.';
      setStreamedText(errorMsg);
      setStreamingFinished(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStopSpeaking = () => {
    speechService.stop();
    setIsSpeakingAudio(false);
    if (latestResponse) {
      setStreamedText(latestResponse.spokenText);
      setStreamingFinished(true);
      setActiveWord('');
    }
  };

  const handleReplaySpoken = () => {
    if (!latestResponse) return;
    setStreamedText('');
    setActiveWord('');
    setStreamingFinished(false);

    speechService.speakWithStreamingText(
      latestResponse.spokenText,
      responseLang,
      voiceConfig,
      (displayedWords, currentWord, isFinished) => {
        setStreamedText(displayedWords);
        setActiveWord(currentWord);
        setStreamingFinished(isFinished);
      }
    );
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="voice-saathi-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-stone-100 bg-gradient-to-r from-teal-800 via-teal-700 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="voice-saathi-title" className="text-base sm:text-lg font-bold tracking-tight">
                  Voice Saathi (वॉयस साथी)
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-teal-900/60 border border-teal-400/30 text-teal-100">
                  Two-Way Voice &amp; Writing
                </span>
              </div>
              <p className="text-xs text-teal-100/80">
                Speaks aloud &amp; writes live with real-time teleprompter
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={typeof window !== 'undefined' ? window.location.href : '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs text-white border border-white/20 transition-colors"
              title="Open full page in dedicated tab for unrestricted microphone access"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
              <span>Full Tab</span>
            </a>

            {onOpenTinyFish && (
              <button
                onClick={onOpenTinyFish}
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs text-white border border-white/20 transition-colors"
                title="View TinyFish verified registries & emergency facilities"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-teal-300" />
                <span>TinyFish Verified</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close Voice Saathi"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controls Bar: Languages & Continuous Dialogue Switch */}
        <div className="px-5 py-2.5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Input Language */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500 font-medium">You Speak:</span>
              <select
                value={inputLang}
                onChange={e => setInputLang(e.target.value as SupportedLanguage)}
                className="px-2 py-1 bg-white border border-stone-200 rounded-md font-semibold text-stone-800 hover:border-stone-300 focus:outline-teal-600 cursor-pointer"
              >
                <option value="hinglish">Hinglish</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="en">English</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>

            {/* Response Language */}
            <div className="flex items-center gap-1.5">
              <span className="text-stone-500 font-medium">Saathi Answers in:</span>
              <select
                value={responseLang}
                onChange={e => setResponseLang(e.target.value as SupportedLanguage)}
                className="px-2 py-1 bg-teal-50 border border-teal-300 rounded-md font-semibold text-teal-900 hover:border-teal-400 focus:outline-teal-600 cursor-pointer"
              >
                <option value="hinglish">Hinglish</option>
                <option value="hi">हिन्दी (Hindi)</option>
                <option value="en">English</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
              </select>
            </div>
          </div>

          {/* Continuous Dialogue Loop Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setContinuousDialogueMode(!continuousDialogueMode)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${
                continuousDialogueMode
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-200'
                  : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
              }`}
              title="When enabled, Saathi automatically listens for your reply after speaking"
            >
              <Repeat className={`w-3 h-3 ${continuousDialogueMode ? 'text-emerald-700 animate-spin' : ''}`} />
              <span>{continuousDialogueMode ? 'Continuous Dialogue: ON' : 'Continuous Dialogue: OFF'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body / Dialogue Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* Active Voice Output Box (The Typewriter / Synchronized Reader) */}
          {latestResponse && (
            <div
              className={`rounded-xl p-4 border transition-all ${
                latestResponse.isEmergency
                  ? 'bg-rose-50 border-rose-300'
                  : 'bg-emerald-50/70 border-emerald-200 shadow-xs'
              }`}
            >
              {/* Header with audio state */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isSpeakingAudio
                        ? 'bg-emerald-500 animate-ping'
                        : latestResponse.isEmergency
                        ? 'bg-rose-600'
                        : 'bg-emerald-600'
                    }`}
                  />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Voice Saathi {isSpeakingAudio ? 'Speaking & Writing...' : 'Spoken Guidance'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {isSpeakingAudio ? (
                    <button
                      onClick={handleStopSpeaking}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-rose-100 text-rose-800 hover:bg-rose-200 transition-colors"
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Pause Speech</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleReplaySpoken}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-teal-100 text-teal-800 hover:bg-teal-200 transition-colors"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen Again</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Synchronized Live Teleprompter (Writes while speaking!) */}
              <div
                className="bg-white rounded-lg p-3.5 border border-stone-200 min-h-[85px] text-stone-900 text-sm sm:text-base leading-relaxed font-sans shadow-2xs relative"
                aria-live="polite"
              >
                <div className="inline">
                  {streamedText ? (
                    <span>
                      {streamedText}{' '}
                      {!streamingFinished && (
                        <span className="inline-block w-2 h-4 bg-teal-600 animate-pulse ml-0.5 align-middle" />
                      )}
                    </span>
                  ) : isProcessing ? (
                    <span className="text-stone-400 italic flex items-center gap-2">
                      <Activity className="w-4 h-4 animate-spin text-teal-600" />
                      Voice Saathi is preparing your modulated spoken answer...
                    </span>
                  ) : (
                    <span className="text-stone-400 italic">Tap the microphone to speak your question...</span>
                  )}
                </div>

                {/* Live soundwave animation while speaking */}
                {isSpeakingAudio && (
                  <div className="mt-3 flex items-center gap-1 text-teal-600">
                    <span className="text-xs font-semibold text-teal-700 mr-2">Speaking aloud:</span>
                    <span className="inline-block w-1 h-3 bg-teal-600 animate-bounce rounded-full" />
                    <span className="inline-block w-1 h-5 bg-teal-600 animate-bounce rounded-full [animation-delay:0.1s]" />
                    <span className="inline-block w-1 h-2 bg-teal-600 animate-bounce rounded-full [animation-delay:0.2s]" />
                    <span className="inline-block w-1 h-6 bg-teal-600 animate-bounce rounded-full [animation-delay:0.15s]" />
                    <span className="inline-block w-1 h-3 bg-teal-600 animate-bounce rounded-full [animation-delay:0.25s]" />
                  </div>
                )}
              </div>

              {/* Emergency Banner or Safe Action Button */}
              {latestResponse.isEmergency ? (
                <div className="mt-3 p-3.5 bg-rose-600 text-white rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-sm flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-300" />
                      <span>CRITICAL EMERGENCY RED-FLAG IDENTIFIED</span>
                    </div>
                    <p className="text-xs text-rose-100">
                      Do not wait for caregiver assistance. Contact emergency response immediately.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href="tel:112"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-white text-rose-700 font-bold text-sm rounded-lg hover:bg-rose-50 shadow-md transition-colors whitespace-nowrap"
                    >
                      <PhoneCall className="w-4 h-4" />
                      <span>Call 112 Now</span>
                    </a>
                    {onOpenTinyFish && (
                      <button
                        onClick={onOpenTinyFish}
                        className="px-3 py-2 bg-rose-800 text-white text-xs font-bold rounded-lg hover:bg-rose-900 transition-colors"
                      >
                        Nearby Trauma Centers
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-emerald-100 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                      {latestResponse.urgencyLevel}
                    </span>
                    <span className="text-stone-600">{latestResponse.timeframe}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onNavigateToCaregivers && (
                      <button
                        onClick={() => {
                          onClose();
                          onNavigateToCaregivers();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-700 text-white font-semibold hover:bg-teal-800 transition-colors shadow-2xs"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Find Matching Caregivers</span>
                      </button>
                    )}
                    {onTransferToIntake && (
                      <button
                        onClick={() => {
                          if (history.length > 0) {
                            const lastUser = [...history].reverse().find(h => h.sender === 'user');
                            if (lastUser) {
                              onTransferToIntake(lastUser.text);
                            }
                          }
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-700 hover:bg-stone-50 font-medium"
                      >
                        <span>Full Triage</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick preset suggestions */}
          <div className="space-y-2">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
              Try asking Voice Saathi:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {(samplePrompts[inputLang] || samplePrompts.hinglish).map((pr, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(pr.text, 'typed')}
                  disabled={isProcessing || isSpeakingAudio}
                  className="px-2.5 py-1 text-xs rounded-lg border border-stone-200 bg-stone-50 text-stone-700 hover:bg-teal-50 hover:text-teal-900 hover:border-teal-300 transition-colors text-left"
                >
                  <span className="font-semibold text-teal-800 mr-1.5">{pr.label}:</span>
                  <span className="text-stone-600 line-clamp-1">"{pr.text}"</span>
                </button>
              ))}
            </div>
          </div>

          {/* Conversation history */}
          {history.length > 0 && (
            <div className="space-y-2.5 pt-3 border-t border-stone-100">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                Session Dialogue
              </span>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {history.map(item => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-lg text-xs ${
                      item.sender === 'user'
                        ? 'bg-stone-100 text-stone-900 ml-6 border border-stone-200'
                        : item.isEmergency
                        ? 'bg-rose-50 text-rose-900 mr-6 border border-rose-200'
                        : 'bg-teal-50 text-teal-900 mr-6 border border-teal-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1 font-semibold text-[11px] opacity-75">
                      <span>{item.sender === 'user' ? (item.inputMode === 'voice' ? 'You (Spoken 🎙️)' : 'You (Typed ✍️)') : 'Voice Saathi'}</span>
                      <span>{item.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{item.text}</p>
                  </div>
                ))}
                <div ref={turnsEndRef} />
              </div>
            </div>
          )}
        </div>

        {/* Footer: Live Voice Input with Dynamic Waveform Meter & Manual Keyboard Fallback */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3">
          {/* Live Mic Listening Card with Dynamic Waveform Visualizer */}
          {isListening && (
            <div className="p-3 bg-gradient-to-r from-teal-900 to-emerald-950 text-white rounded-xl shadow-md border border-teal-700/50 space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                  </span>
                  <span className="font-bold text-xs uppercase tracking-wider text-teal-200">
                    Listening in {inputLang}...
                  </span>
                </div>

                <button
                  onClick={stopListeningAndSend}
                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-stone-950 font-bold rounded-lg text-xs shadow-xs transition-colors"
                >
                  Done Speaking
                </button>
              </div>

              {/* Dynamic Equalizer Bar reacting to Audio Level */}
              <div className="flex items-center gap-1.5 h-6 px-1">
                <span className="text-[10px] text-teal-300 font-mono mr-1">Mic:</span>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((barIdx) => {
                  const threshold = barIdx * 6;
                  const isActive = audioLevel >= threshold;
                  const barHeight = isActive ? Math.min(24, Math.max(6, (audioLevel / 100) * 24)) : 4;
                  return (
                    <div
                      key={barIdx}
                      style={{ height: `${barHeight}px` }}
                      className={`flex-1 rounded-full transition-all duration-75 ${
                        isActive ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-teal-900/60'
                      }`}
                    />
                  );
                })}
              </div>

              {/* Interim Transcript Live Display */}
              <div className="text-xs text-teal-100/90 font-mono italic bg-black/30 px-2.5 py-1.5 rounded-lg border border-teal-800/40">
                "{userTranscript || 'Hearing voice... speak your health question'}"
              </div>
            </div>
          )}

          {/* Audio Error Alert if mic blocked with instant 1-click solutions */}
          {audioError && (
            <div className="p-3 bg-amber-50/90 border border-amber-300 rounded-xl text-amber-950 text-xs space-y-2 animate-in fade-in">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-amber-900">
                      Microphone Permission Notice
                    </span>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      {audioError} (Browsers automatically block microphone prompts inside embedded preview iframes).
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAudioError(null)}
                  className="text-stone-400 hover:text-stone-700 font-bold text-xs p-1"
                  aria-label="Dismiss error notice"
                >
                  ✕
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-amber-200/70">
                <a
                  href={typeof window !== 'undefined' ? window.location.href : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs shadow-2xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Dedicated Tab ↗ (Direct Mic Prompt)</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setAudioError(null);
                    textInputRef.current?.focus();
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-stone-50 border border-amber-300 text-amber-900 font-semibold rounded-lg text-xs transition-colors"
                >
                  Type Question Below ✍️
                </button>
              </div>
            </div>
          )}

          {/* Main Controls: Mic Button & Text Box for Two-Way Writing and Saying */}
          <div className="flex items-center gap-2">
            {/* Big Mic Button */}
            <button
              onClick={isListening ? stopListeningAndSend : startListening}
              disabled={isProcessing}
              className={`relative p-3.5 rounded-2xl flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-rose-600 text-white shadow-lg ring-4 ring-rose-200 scale-105'
                  : 'bg-teal-700 text-white hover:bg-teal-800 shadow-md hover:scale-102 active:scale-98'
              }`}
              title={isListening ? 'Click to finish speaking' : 'Click to speak to Voice Saathi'}
              aria-label={isListening ? 'Stop listening' : 'Start voice input'}
            >
              {isListening ? (
                <>
                  <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                  </span>
                  <MicOff className="w-6 h-6 animate-pulse" />
                </>
              ) : (
                <Mic className="w-6 h-6" />
              )}
            </button>

            {/* Typed fallback input */}
            <div className="flex-1 relative">
              <input
                ref={textInputRef}
                type="text"
                value={typedInput}
                onChange={e => setTypedInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && typedInput.trim()) {
                    handleSendPrompt(typedInput.trim(), 'typed');
                  }
                }}
                placeholder={
                  inputLang === 'hi'
                    ? 'अपनी समस्या बोलें या यहाँ लिखें...'
                    : inputLang === 'hinglish'
                    ? 'Apni concern bolein ya yahan type karein...'
                    : inputLang === 'bn'
                    ? 'আপনার সমস্যা বলুন বা এখানে লিখুন...'
                    : inputLang === 'mr'
                    ? 'तुमची समस्या बोला किंवा टाईप करा...'
                    : inputLang === 'ta'
                    ? 'உங்கள் பிரச்சனையை பேசவும் அல்லது தட்டச்சு செய்யவும்...'
                    : 'Speak or type health question in any language...'
                }
                className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-stone-200 bg-white text-stone-900 placeholder-stone-400 focus:outline-teal-600 pr-10 shadow-2xs"
              />
              {typedInput.trim() && (
                <button
                  onClick={() => handleSendPrompt(typedInput.trim(), 'typed')}
                  disabled={isProcessing}
                  className="absolute right-1.5 top-1.5 px-3 py-1 bg-teal-700 text-white text-xs font-semibold rounded-lg hover:bg-teal-800 transition-colors flex items-center gap-1"
                >
                  <Send className="w-3 h-3" />
                  <span>Ask</span>
                </button>
              )}
            </div>
          </div>

          {/* Voice Modulation Quick Settings Row */}
          <div className="flex items-center justify-between text-[11px] text-stone-500 px-1 flex-wrap gap-2">
            <span>
              💡 <em>Voice Saathi reads aloud with real-time word teleprompter.</em>
            </span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1 cursor-pointer">
                <span>Speed:</span>
                <select
                  value={voiceConfig.rate}
                  onChange={e => {
                    const newRate = parseFloat(e.target.value);
                    onUpdateVoiceConfig({ ...voiceConfig, rate: newRate });
                  }}
                  className="bg-stone-100 rounded px-1.5 py-0.5 border border-stone-200 text-stone-800 text-[11px]"
                >
                  <option value="0.75">0.75x (Gentle)</option>
                  <option value="0.85">0.85x (Deliberate)</option>
                  <option value="0.92">0.92x (Calm)</option>
                  <option value="1.0">1.0x (Normal)</option>
                  <option value="1.15">1.15x (Brisk)</option>
                </select>
              </label>

              <label className="flex items-center gap-1 cursor-pointer">
                <span>Hinglish Tone:</span>
                <select
                  value={voiceConfig.hinglishCadence}
                  onChange={e => {
                    onUpdateVoiceConfig({
                      ...voiceConfig,
                      hinglishCadence: e.target.value as any
                    });
                  }}
                  className="bg-stone-100 rounded px-1.5 py-0.5 border border-stone-200 text-stone-800 text-[11px]"
                >
                  <option value="balanced">Balanced</option>
                  <option value="clear_pace">Clear Pacing</option>
                  <option value="conversational">Conversational</option>
                </select>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
