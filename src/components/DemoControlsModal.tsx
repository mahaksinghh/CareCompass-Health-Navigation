import React from 'react';
import {
  Sparkles,
  AlertOctagon,
  HeartHandshake,
  ShieldCheck,
  CheckCircle2,
  Stethoscope,
  Info
} from 'lucide-react';
import { DemoScenario, SupportedLanguage } from '../types/index.ts';

interface DemoControlsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectScenario: (scenario: DemoScenario) => void;
}

const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'DEMO-01',
    title: 'Acute Emergency: Severe Chest Pain & Sweating',
    badge: 'Emergency Gate',
    category: 'emergency',
    description: 'Demonstrates deterministic red-flag trigger RF-CARDIAC-02. Caregiver matching is immediately disabled and 112 emergency directions are displayed.',
    sampleInput: 'Crushing heavy pressure in center of chest for past 20 minutes radiating to left arm and jaw, broke into cold sweat.',
    language: 'en',
    expectedAcuity: 'EMERGENCY'
  },
  {
    id: 'DEMO-02',
    title: 'Elder Support: Grandmother Mobility Assistance',
    badge: 'Non-Clinical Caregiver Match',
    category: 'support',
    description: 'Elderly assistance request. Evaluates safe non-clinical status and matches top vetted caregivers with 4-factor scoring breakdown.',
    sampleInput: 'My 78-year-old grandmother is having trouble walking to the bathroom and needs daily meal prep and gentle mobility support. Denies chest pain or shortness of breath.',
    language: 'en',
    expectedAcuity: 'NON_CLINICAL_SUPPORT'
  },
  {
    id: 'DEMO-03',
    title: 'Safety Test: Negation Handling (No Chest Pain)',
    badge: 'Safety Negation Rule',
    category: 'negation',
    description: 'CRITICAL SAFETY TEST: User says "NO chest pain". Verifies that the parser does NOT misinterpret negation as a cardiac emergency.',
    sampleInput: 'I have had a mild dull headache behind my eyes for 2 days. I have NO chest pain, NO shortness of breath, and no numbness.',
    language: 'en',
    expectedAcuity: 'ROUTINE'
  },
  {
    id: 'DEMO-04',
    title: 'Hindi Language: Acute Stroke / Neurological Distress',
    badge: 'Hindi Multilingual',
    category: 'multilingual',
    description: 'Demonstrates Hindi Devanagari red-flag extraction for acute facial drop and slurred speech, triggering instant 112 guidance.',
    sampleInput: 'मेरी माताजी का चेहरा अचानक एक तरफ झुक गया है और बोलने में बहुत लड़खड़ाहट हो रही है।',
    language: 'hi',
    expectedAcuity: 'EMERGENCY'
  },
  {
    id: 'DEMO-05',
    title: 'Hinglish Colloquial: Senior Citizen Care',
    badge: 'Hinglish Support',
    category: 'multilingual',
    description: 'Demonstrates colloquial Hinglish intake for elderly mobility assistance and home daily chores.',
    sampleInput: 'Dadaji ko chalne firne me support chahiye aur daily routine help chahiye, koi medical emergency nahi hai.',
    language: 'hinglish',
    expectedAcuity: 'NON_CLINICAL_SUPPORT'
  },
  {
    id: 'DEMO-06',
    title: 'Urgent Clinic Care: Laceration Needing Stitches',
    badge: 'Urgent Care (4-6h)',
    category: 'routine',
    description: 'Non-emergency laceration with stopped bleeding that requires in-person wound closure within 4-6 hours.',
    sampleInput: 'Kitchen knife sliced my thumb 1 hour ago. Bleeding has stopped with pressure, but the cut is gaping open about 2cm.',
    language: 'en',
    expectedAcuity: 'URGENT'
  },
  {
    id: 'DEMO-07',
    title: 'Bengali (বাংলা): Elder Mobility & Daily Chores',
    badge: 'Bengali Multilingual',
    category: 'multilingual',
    description: 'Demonstrates Bengali language parsing for senior citizen walking support and home care.',
    sampleInput: 'আমার দিদিমা গত ২ দিন ধরে দুর্বল বোধ করছেন এবং বাড়িতে চলাফেরায় সাহায্য প্রয়োজন, কোনো জরুরি অবস্থা নেই।',
    language: 'bn',
    expectedAcuity: 'NON_CLINICAL_SUPPORT'
  },
  {
    id: 'DEMO-08',
    title: 'Marathi (मराठी): Home Helper Support',
    badge: 'Marathi Multilingual',
    category: 'multilingual',
    description: 'Demonstrates Marathi language parsing for senior citizen daily companion support.',
    sampleInput: 'माझ्या आजीला घरात चालण्यासाठी आधाराची गरज आहे आणि दैनंदिन कामात मदत हवी आहे, कोणतीही आणीबाणी नाही.',
    language: 'mr',
    expectedAcuity: 'NON_CLINICAL_SUPPORT'
  },
  {
    id: 'DEMO-09',
    title: 'Tamil (தமிழ்): Elder Care Companion',
    badge: 'Tamil Multilingual',
    category: 'multilingual',
    description: 'Demonstrates Tamil language parsing for elder walking assistance and medication reminders.',
    sampleInput: 'என் பாட்டிக்கு வீட்டில் நடக்க உதவி தேவைப்படுகிறது, எந்த அவசர மருத்துவ நிலையும் இல்லை.',
    language: 'ta',
    expectedAcuity: 'NON_CLINICAL_SUPPORT'
  }
];

export const DemoControlsModal: React.FC<DemoControlsModalProps> = ({
  isOpen,
  onClose,
  onSelectScenario
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-stone-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-100 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-stone-900 text-base">
                Judge & Hackathon Demo Presets
              </h3>
              <span className="text-[11px] text-stone-500">
                Load verifiable scenarios with one click
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 p-1 rounded-lg text-lg leading-none"
            aria-label="Close demo modal"
          >
            ✕
          </button>
        </div>

        {/* Scenarios List */}
        <div className="p-5 overflow-y-auto space-y-3">
          <div className="p-3 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900 flex items-start gap-2">
            <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <span>
              Each preset populates realistic test inputs and automatically executes the safety and triage pipeline for rapid evaluation.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DEMO_SCENARIOS.map(sc => (
              <button
                key={sc.id}
                onClick={() => {
                  onSelectScenario(sc);
                  onClose();
                }}
                className="text-left p-3.5 rounded-xl border border-stone-200 hover:border-teal-500 hover:bg-teal-50/30 transition-all flex flex-col justify-between space-y-2 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                      {sc.badge}
                    </span>
                    <span className="font-mono text-[10px] text-stone-400">
                      {sc.language.toUpperCase()}
                    </span>
                  </div>
                  <h4 className="font-bold text-stone-900 text-xs group-hover:text-teal-900">
                    {sc.title}
                  </h4>
                  <p className="text-[11px] text-stone-600 line-clamp-2 mt-1">
                    {sc.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[10px] text-stone-500">
                  <span>Target: <strong className="text-stone-700">{sc.expectedAcuity}</strong></span>
                  <span className="font-semibold text-teal-700 group-hover:translate-x-0.5 transition-transform">
                    Load Scenario →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-100 flex justify-end bg-stone-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
