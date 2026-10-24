import { SupportedLanguage } from '../types/index.ts';

export interface AudioCaptureCallbacks {
  onTranscriptUpdate?: (transcript: string, isFinal: boolean) => void;
  onAudioLevel?: (level: number) => void; // 0 to 100
  onError?: (errorMessage: string) => void;
  onAutoSilenceDetected?: () => void;
}

export class AudioCaptureEngine {
  private mediaStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animFrameId: number | null = null;
  private recognition: any = null;
  private isListening: boolean = false;
  private silenceTimer: any = null;
  private accumulatedFinalTranscript: string = '';
  private currentInterimTranscript: string = '';

  public get listening(): boolean {
    return this.isListening;
  }

  /**
   * Starts dual-mode capture:
   * 1. MediaStream + AnalyserNode for live visual waveform meter
   * 2. MediaRecorder for audio blob creation (for Gemini 3.8 Flash transcription)
   * 3. Web Speech Recognition for instant zero-latency live preview (if supported)
   */
  public async start(
    language: SupportedLanguage,
    callbacks: AudioCaptureCallbacks
  ): Promise<boolean> {
    this.stop();
    this.audioChunks = [];
    this.accumulatedFinalTranscript = '';
    this.currentInterimTranscript = '';

    let mediaStreamStarted = false;
    let speechRecogStarted = false;

    // Step 1: Request microphone permission & start audio meter + recorder
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true
          }
        });
        mediaStreamStarted = true;

        // Setup Web Audio Analyser for live visualizer
        try {
          const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
          if (AudioContextClass) {
            this.audioContext = new AudioContextClass();
            if (this.audioContext.state === 'suspended') {
              await this.audioContext.resume();
            }
            const source = this.audioContext.createMediaStreamSource(this.mediaStream);
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 64;
            source.connect(this.analyser);

            const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
            const checkVolume = () => {
              if (!this.analyser || !this.isListening) return;
              this.analyser.getByteFrequencyData(dataArray);
              let sum = 0;
              for (let i = 0; i < dataArray.length; i++) {
                sum += dataArray[i];
              }
              const average = sum / dataArray.length;
              const normalized = Math.min(100, Math.round((average / 128) * 100));
              if (callbacks.onAudioLevel) {
                callbacks.onAudioLevel(normalized);
              }
              this.animFrameId = requestAnimationFrame(checkVolume);
            };
            this.animFrameId = requestAnimationFrame(checkVolume);
          }
        } catch (meterErr) {
          console.warn('Audio meter setup warning:', meterErr);
        }

        // Setup MediaRecorder
        try {
          let mimeType = 'audio/webm';
          if (typeof MediaRecorder !== 'undefined') {
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
              mimeType = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
              mimeType = 'audio/mp4';
            } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
              mimeType = 'audio/ogg';
            }

            this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType });
            this.mediaRecorder.ondataavailable = (e) => {
              if (e.data && e.data.size > 0) {
                this.audioChunks.push(e.data);
              }
            };
            this.mediaRecorder.start(250);
          }
        } catch (recErr) {
          console.warn('MediaRecorder warning:', recErr);
        }
      }
    } catch (micErr: any) {
      console.warn('Microphone getUserMedia warning:', micErr);
      const isIframe = typeof window !== 'undefined' && window.self !== window.top;
      const msg = micErr.name === 'NotAllowedError'
        ? (isIframe
            ? 'Microphone was restricted by the embedded preview frame. You can type below or click "Open in New Tab".'
            : 'Microphone permission was denied. Please allow microphone in your browser settings.')
        : 'Microphone is currently unavailable. You can type your question in the text box.';
      if (callbacks.onError) callbacks.onError(msg);
    }

    // Step 2: Setup Web Speech API for immediate live transcription
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      try {
        const recog = new SpeechRec();
        this.recognition = recog;
        recog.continuous = true;
        recog.interimResults = true;

        const langMap: Record<SupportedLanguage, string> = {
          en: 'en-IN',
          hi: 'hi-IN',
          hinglish: 'hi-IN',
          bn: 'bn-IN',
          mr: 'mr-IN',
          ta: 'ta-IN'
        };
        recog.lang = langMap[language] || 'en-IN';

        recog.onresult = (event: any) => {
          let interim = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            const item = event.results[i];
            const text = item[0]?.transcript || '';
            if (item.isFinal) {
              this.accumulatedFinalTranscript += (this.accumulatedFinalTranscript ? ' ' : '') + text.trim();
            } else {
              interim += text;
            }
          }
          this.currentInterimTranscript = interim;

          const combined = (this.accumulatedFinalTranscript + (interim ? ' ' + interim : '')).trim();
          if (callbacks.onTranscriptUpdate && combined) {
            callbacks.onTranscriptUpdate(combined, false);
          }

          // Reset silence timer on every spoken word
          if (this.silenceTimer) clearTimeout(this.silenceTimer);
          if (combined.length > 5) {
            this.silenceTimer = setTimeout(() => {
              if (this.isListening && callbacks.onAutoSilenceDetected) {
                callbacks.onAutoSilenceDetected();
              }
            }, 3000);
          }
        };

        recog.onerror = (event: any) => {
          console.warn('SpeechRecognition warning:', event.error);
          if (event.error === 'not-allowed') {
            const isIframe = typeof window !== 'undefined' && window.self !== window.top;
            if (callbacks.onError) {
              callbacks.onError(
                isIframe
                  ? 'Microphone is blocked in this preview iframe. You can type or use the speech simulator below.'
                  : 'Microphone permission blocked. Please allow mic access in your browser.'
              );
            }
          }
        };

        recog.onend = () => {
          if (this.isListening && this.recognition) {
            try {
              this.recognition.start();
            } catch {
              // ignore
            }
          }
        };

        recog.start();
        speechRecogStarted = true;
      } catch (recogErr) {
        console.warn('Web Speech API start error:', recogErr);
      }
    }

    if (mediaStreamStarted || speechRecogStarted) {
      this.isListening = true;
      return true;
    }

    return false;
  }

  /**
   * Stops listening and returns the recorded audio Blob (if captured)
   * plus the final recognized transcript.
   */
  public async stop(): Promise<{ audioBlob: Blob | null; transcript: string }> {
    this.isListening = false;

    if (this.silenceTimer) {
      clearTimeout(this.silenceTimer);
      this.silenceTimer = null;
    }

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.recognition) {
      try {
        this.recognition.onend = null;
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }

    // Stop MediaRecorder and produce Blob
    let audioBlob: Blob | null = null;
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try {
        const stopPromise = new Promise<void>((resolve) => {
          if (this.mediaRecorder) {
            this.mediaRecorder.onstop = () => resolve();
            this.mediaRecorder.stop();
          } else {
            resolve();
          }
        });
        await stopPromise;
      } catch (e) {
        console.warn('MediaRecorder stop error:', e);
      }
    }

    if (this.audioChunks.length > 0) {
      const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
      audioBlob = new Blob(this.audioChunks, { type: mimeType });
    }

    // Stop tracks
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(t => t.stop());
      this.mediaStream = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      try {
        await this.audioContext.close();
      } catch {
        // ignore
      }
      this.audioContext = null;
    }
    this.analyser = null;

    const finalTranscript = (this.accumulatedFinalTranscript + (this.currentInterimTranscript ? ' ' + this.currentInterimTranscript : '')).trim();
    return { audioBlob, transcript: finalTranscript };
  }
}

export const audioCaptureService = new AudioCaptureEngine();
