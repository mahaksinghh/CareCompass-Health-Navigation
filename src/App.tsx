/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { DisclaimerBanner } from './components/DisclaimerBanner.tsx';
import { LandingView } from './components/LandingView.tsx';
import { IntakeStep } from './components/IntakeStep.tsx';
import { FollowUpStep } from './components/FollowUpStep.tsx';
import { EmergencyAlert } from './components/EmergencyAlert.tsx';
import { TriageResultStep } from './components/TriageResultStep.tsx';
import { CaregiverMatchStep } from './components/CaregiverMatchStep.tsx';
import { FindCaregiversView } from './components/FindCaregiversView.tsx';
import { SafetySuiteView } from './components/SafetySuiteView.tsx';
import { PrivacyPolicyView } from './components/PrivacyPolicyView.tsx';
import { CareSummaryModal } from './components/CareSummaryModal.tsx';
import { DemoControlsModal } from './components/DemoControlsModal.tsx';
import { VoiceModulationSettings } from './components/VoiceModulationSettings.tsx';
import { VoiceSaathiModal } from './components/VoiceSaathiModal.tsx';
import { TinyFishRegistryModal } from './components/TinyFishRegistryModal.tsx';
import {
  CaregiverMatchResult,
  DemoScenario,
  FollowUpAnswer,
  FollowUpQuestion,
  SupportedLanguage,
  SymptomMention,
  TriageEvaluationResponse,
  VoiceModulationConfig
} from './types/index.ts';
import { api } from './services/apiClient.ts';
import { DEFAULT_VOICE_CONFIG, speechService } from './services/speechSynthesis.ts';

type GuidanceSubStep =
  | 'landing'
  | 'intake'
  | 'follow_up'
  | 'emergency'
  | 'triage_result'
  | 'caregivers_match';

export default function App() {
  // Navigation & Preferences
  const [currentTab, setCurrentTab] = useState<'guidance' | 'caregivers' | 'safety' | 'privacy'>('guidance');
  const [guidanceStep, setGuidanceStep] = useState<GuidanceSubStep>('landing');
  const [language, setLanguage] = useState<SupportedLanguage>('en');
  const [highContrast, setHighContrast] = useState(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xl'>('normal');

  // Voice Modulation & Voice Saathi State
  const [voiceConfig, setVoiceConfig] = useState<VoiceModulationConfig>(DEFAULT_VOICE_CONFIG);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showVoiceSaathiModal, setShowVoiceSaathiModal] = useState(false);

  // Intake & Evaluation State
  const [intakeText, setIntakeText] = useState('');
  const [extractedSymptoms, setExtractedSymptoms] = useState<SymptomMention[]>([]);
  const [followUpQuestions, setFollowUpQuestions] = useState<FollowUpQuestion[]>([]);
  const [followUpAnswers, setFollowUpAnswers] = useState<FollowUpAnswer[]>([]);
  const [triageResult, setTriageResult] = useState<TriageEvaluationResponse | null>(null);
  const [caregiverMatches, setCaregiverMatches] = useState<CaregiverMatchResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Modals
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [showTinyFishModal, setShowTinyFishModal] = useState(false);
  const [tinyFishCaregiverId, setTinyFishCaregiverId] = useState<string | undefined>(undefined);
  const [tinyFishCaregiverName, setTinyFishCaregiverName] = useState<string | undefined>(undefined);

  const handleOpenTinyFish = (id?: string, name?: string) => {
    setTinyFishCaregiverId(id);
    setTinyFishCaregiverName(name);
    setShowTinyFishModal(true);
  };

  // ----------------------------------------------------------------------
  // ACTION HANDLERS
  // ----------------------------------------------------------------------

  // 1. Submit Intake Text
  const handleIntakeSubmit = async () => {
    if (!intakeText.trim()) return;
    setIsProcessing(true);

    try {
      // Step A: Parse Symptoms & Negation
      const parseResult = await api.parseFreeText(intakeText, language);
      setExtractedSymptoms(parseResult.extractedSymptoms);

      // Step B: Check Triage with baseline data
      const evalResult = await api.evaluateTriage({
        language,
        intakeText,
        extractedSymptoms: parseResult.extractedSymptoms,
        followUpAnswers: []
      });

      // Step C: If emergency red-flag triggered, immediately show emergency screen
      if (evalResult.isEmergency) {
        setTriageResult(evalResult);
        setGuidanceStep('emergency');
        setIsProcessing(false);
        return;
      }

      // Step D: Otherwise check for relevant follow-up questions
      const questions = await api.getFollowUpQuestions(parseResult.extractedSymptoms, false);

      if (questions.length > 0) {
        setFollowUpQuestions(questions);
        setGuidanceStep('follow_up');
      } else {
        // No follow-ups needed -> go straight to triage result
        setTriageResult(evalResult);
        setGuidanceStep('triage_result');
      }
    } catch (err) {
      console.error('Error during intake processing:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Complete Follow-up Questions
  const handleFollowUpComplete = async (answers: FollowUpAnswer[]) => {
    setFollowUpAnswers(answers);
    setIsProcessing(true);

    try {
      const evalResult = await api.evaluateTriage({
        language,
        intakeText,
        extractedSymptoms,
        followUpAnswers: answers
      });

      setTriageResult(evalResult);

      if (evalResult.isEmergency) {
        setGuidanceStep('emergency');
      } else {
        setGuidanceStep('triage_result');
      }
    } catch (err) {
      console.error('Error evaluating follow-up answers:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Explore Caregivers
  const handleExploreCaregivers = async () => {
    if (!triageResult) return;
    setIsProcessing(true);

    try {
      const matchResult = await api.matchCaregivers({
        urgencyLevel: triageResult.urgencyLevel,
        requiredSkills: extractedSymptoms.map(s => s.concept)
      });

      setCaregiverMatches(matchResult.matches);
      setGuidanceStep('caregivers_match');
    } catch (err) {
      console.error('Error matching caregivers:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Reset Session
  const handleResetSession = async () => {
    await api.resetSession();
    setIntakeText('');
    setExtractedSymptoms([]);
    setFollowUpQuestions([]);
    setFollowUpAnswers([]);
    setTriageResult(null);
    setCaregiverMatches([]);
    setGuidanceStep('landing');
    setShowSummaryModal(false);
  };

  // 5. Select a Pre-configured Demo Scenario
  const handleSelectScenario = async (sc: DemoScenario) => {
    setIntakeText(sc.sampleInput);
    setLanguage(sc.language);
    setCurrentTab('guidance');
    setIsProcessing(true);

    try {
      const parseResult = await api.parseFreeText(sc.sampleInput, sc.language);
      setExtractedSymptoms(parseResult.extractedSymptoms);

      const evalResult = await api.evaluateTriage({
        language: sc.language,
        intakeText: sc.sampleInput,
        extractedSymptoms: parseResult.extractedSymptoms,
        followUpAnswers: []
      });

      setTriageResult(evalResult);

      if (evalResult.isEmergency) {
        setGuidanceStep('emergency');
      } else {
        const questions = await api.getFollowUpQuestions(parseResult.extractedSymptoms, false);
        if (questions.length > 0) {
          setFollowUpQuestions(questions);
          setGuidanceStep('follow_up');
        } else {
          setGuidanceStep('triage_result');
        }
      }
    } finally {
      setIsProcessing(false);
    }
  };

  // Accessibility font classes
  const fontClass =
    textSize === 'xl' ? 'text-lg' : textSize === 'large' ? 'text-base' : 'text-sm';
  const contrastClass = highContrast ? 'contrast-125' : '';

  return (
    <div className={`min-h-screen bg-stone-50 flex flex-col ${fontClass} ${contrastClass}`}>
      {/* Disclaimer Banner */}
      <DisclaimerBanner language={language} />

      {/* Main Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={tab => {
          setCurrentTab(tab);
          if (tab === 'guidance' && guidanceStep === 'landing') {
            // keep
          }
        }}
        language={language}
        setLanguage={lang => {
          speechService.stop();
          setLanguage(lang);
        }}
        onOpenDemo={() => setShowDemoModal(true)}
        onOpenVoiceSaathi={() => setShowVoiceSaathiModal(true)}
        onOpenVoiceSettings={() => setShowVoiceModal(true)}
        onOpenTinyFish={() => handleOpenTinyFish()}
        onResetSession={handleResetSession}
        highContrast={highContrast}
        setHighContrast={setHighContrast}
        textSize={textSize}
        setTextSize={setTextSize}
      />

      {/* Page Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* TAB 1: GUIDANCE */}
        {currentTab === 'guidance' && (
          <div>
            {guidanceStep === 'landing' && (
              <LandingView
                language={language}
                onStartGuidance={() => setGuidanceStep('intake')}
                onFindCaregivers={() => setCurrentTab('caregivers')}
                onOpenVoiceSaathi={() => setShowVoiceSaathiModal(true)}
                onSelectScenario={id => {
                  const demoMap: Record<string, DemoScenario> = {
                    'SAFE-02': {
                      id: 'SAFE-02',
                      title: 'Chest Pain Emergency',
                      badge: 'Emergency',
                      category: 'emergency',
                      description: 'Crushing chest pain radiating to left arm',
                      sampleInput: 'Crushing heavy pressure in center of chest for past 20 minutes radiating to left arm and jaw, broke into cold sweat.',
                      language: 'en',
                      expectedAcuity: 'EMERGENCY'
                    },
                    'SAFE-14': {
                      id: 'SAFE-14',
                      title: 'Elder Mobility Support',
                      badge: 'Caregiver Support',
                      category: 'support',
                      description: 'Grandmother mobility help without acute illness',
                      sampleInput: 'My 76-year-old grandmother is feeling worn out and needs help walking to bathroom. Denies chest pain, denies trouble breathing.',
                      language: 'en',
                      expectedAcuity: 'NON_CLINICAL_SUPPORT'
                    },
                    'SAFE-13': {
                      id: 'SAFE-13',
                      title: 'Negation Handling',
                      badge: 'Negation Safety',
                      category: 'negation',
                      description: 'Mild headache with explicit denial of chest pain',
                      sampleInput: 'I have had a mild dull headache behind my eyes for 2 days. I have NO chest pain, NO shortness of breath, and no numbness.',
                      language: 'en',
                      expectedAcuity: 'ROUTINE'
                    },
                    'SAFE-15': {
                      id: 'SAFE-15',
                      title: 'Hindi Acute Emergency',
                      badge: 'Hindi Multilingual',
                      category: 'multilingual',
                      description: 'Acute severe chest pain in Hindi',
                      sampleInput: 'छाती में बहुत तेज दर्द हो रहा है, सांस लेने में तकलीफ है और बहुत ज्यादा पसीना आ रहा है।',
                      language: 'hi',
                      expectedAcuity: 'EMERGENCY'
                    }
                  };
                  if (demoMap[id]) handleSelectScenario(demoMap[id]);
                }}
              />
            )}

            {guidanceStep === 'intake' && (
              <IntakeStep
                language={language}
                intakeText={intakeText}
                setIntakeText={setIntakeText}
                onSubmit={handleIntakeSubmit}
                isLoading={isProcessing}
                onClear={() => setIntakeText('')}
                voiceConfig={voiceConfig}
                onOpenVoiceSaathi={() => setShowVoiceSaathiModal(true)}
              />
            )}

            {guidanceStep === 'follow_up' && (
              <FollowUpStep
                language={language}
                questions={followUpQuestions}
                onComplete={handleFollowUpComplete}
                onBackToIntake={() => setGuidanceStep('intake')}
                isEvaluating={isProcessing}
                voiceConfig={voiceConfig}
              />
            )}

            {guidanceStep === 'emergency' && triageResult && (
              <EmergencyAlert
                language={language}
                redFlags={triageResult.redFlagsTriggered}
                onStartOver={handleResetSession}
                onViewSummary={() => setShowSummaryModal(true)}
                voiceConfig={voiceConfig}
                onOpenTinyFish={() => handleOpenTinyFish()}
              />
            )}

            {guidanceStep === 'triage_result' && triageResult && (
              <TriageResultStep
                language={language}
                result={triageResult}
                onExploreCaregivers={handleExploreCaregivers}
                onViewSummary={() => setShowSummaryModal(true)}
                onStartOver={handleResetSession}
                voiceConfig={voiceConfig}
              />
            )}

            {guidanceStep === 'caregivers_match' && (
              <CaregiverMatchStep
                language={language}
                matches={caregiverMatches}
                onBackToResult={() => setGuidanceStep('triage_result')}
                onViewSummary={() => setShowSummaryModal(true)}
                onOpenTinyFish={handleOpenTinyFish}
              />
            )}
          </div>
        )}

        {/* TAB 2: FIND CAREGIVERS DIRECTORY */}
        {currentTab === 'caregivers' && (
          <FindCaregiversView
            language={language}
            onStartGuidance={() => {
              setCurrentTab('guidance');
              setGuidanceStep('intake');
            }}
            onOpenTinyFish={handleOpenTinyFish}
          />
        )}

        {/* TAB 3: SAFETY & EVALUATION CONSOLE */}
        {currentTab === 'safety' && <SafetySuiteView />}

        {/* TAB 4: PRIVACY & LIMITS */}
        {currentTab === 'privacy' && (
          <PrivacyPolicyView
            language={language}
            onResetSession={handleResetSession}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-12 text-xs text-stone-500">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-0.5 text-center sm:text-left">
            <span className="font-semibold text-stone-700">
              CareCompass Healthcare Navigation & Caregiver Matching Prototype
            </span>
            <p className="text-[11px] text-stone-500">
              Engineered with deterministic red-flag gating, explainable 4-factor ranking, voice modulation, and zero health data persistence.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-600">
            <button
              onClick={() => setCurrentTab('privacy')}
              className="hover:underline"
            >
              Privacy & Scope
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => setCurrentTab('safety')}
              className="hover:underline"
            >
              Safety Console
            </button>
            <span aria-hidden="true">·</span>
            <span>Emergency in India: <strong>112</strong></span>
          </div>
        </div>
      </footer>

      {/* Summary Review Modal */}
      {showSummaryModal && (
        <CareSummaryModal
          language={language}
          intakeText={intakeText}
          extractedSymptoms={extractedSymptoms}
          result={triageResult}
          onClose={() => setShowSummaryModal(false)}
          onStartOver={handleResetSession}
          voiceConfig={voiceConfig}
        />
      )}

      {/* Demo Controls Modal */}
      <DemoControlsModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectScenario={handleSelectScenario}
      />

      {/* Voice Modulation Settings Modal */}
      <VoiceModulationSettings
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        config={voiceConfig}
        onChangeConfig={setVoiceConfig}
        language={language}
      />

      {/* Voice Saathi Interactive Companion Modal (Speaks & Writes in Sync) */}
      <VoiceSaathiModal
        isOpen={showVoiceSaathiModal}
        onClose={() => setShowVoiceSaathiModal(false)}
        appLanguage={language}
        voiceConfig={voiceConfig}
        onUpdateVoiceConfig={setVoiceConfig}
        onOpenTinyFish={() => handleOpenTinyFish()}
        onNavigateToCaregivers={() => {
          setCurrentTab('caregivers');
          speechService.stop();
        }}
        onTransferToIntake={(text) => {
          setIntakeText(text);
          setCurrentTab('guidance');
          setGuidanceStep('intake');
          speechService.stop();
        }}
      />

      {/* TinyFish Web Agent & Health Registry Verification Modal */}
      <TinyFishRegistryModal
        isOpen={showTinyFishModal}
        onClose={() => setShowTinyFishModal(false)}
        initialCaregiverId={tinyFishCaregiverId}
        initialCaregiverName={tinyFishCaregiverName}
      />
    </div>
  );
}
