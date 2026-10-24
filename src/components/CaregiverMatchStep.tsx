import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  MapPin,
  Clock,
  Languages,
  ArrowLeft,
  FileText,
  UserCheck,
  Filter,
  Info,
  CalendarCheck
} from 'lucide-react';
import {
  CaregiverMatchResult,
  CaregiverProfile,
  SupportedLanguage
} from '../types/index.ts';
import { translations } from '../i18n/translations.ts';

interface CaregiverMatchStepProps {
  language: SupportedLanguage;
  matches: CaregiverMatchResult[];
  onBackToResult: () => void;
  onViewSummary: () => void;
  onOpenTinyFish?: (caregiverId?: string, caregiverName?: string) => void;
}

export const CaregiverMatchStep: React.FC<CaregiverMatchStepProps> = ({
  language,
  matches,
  onBackToResult,
  onViewSummary,
  onOpenTinyFish
}) => {
  const t = translations[language];
  const [selectedCaregiver, setSelectedCaregiver] = useState<CaregiverProfile | null>(null);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryNotes, setInquiryNotes] = useState('');
  const [areaFilter, setAreaFilter] = useState<string>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  // Filter matches if filters applied
  const filteredMatches = matches.filter(m => {
    if (areaFilter !== 'all' && !m.caregiver.service_area.toLowerCase().includes(areaFilter.toLowerCase())) {
      return false;
    }
    if (languageFilter !== 'all' && !m.caregiver.languages.some(l => l.toLowerCase() === languageFilter.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleOpenInquiry = (cg: CaregiverProfile) => {
    setSelectedCaregiver(cg);
    setInquirySent(false);
    setInquiryNotes('');
  };

  const handleSendInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-1.5 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <UserCheck className="w-3.5 h-3.5" />
          <span>Non-Clinical Support Only · Vetted Background Verification</span>
        </div>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          {t.matchTitle}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 max-w-2xl">
          {t.matchSubtitle}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-xl border border-stone-200/90 p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-stone-700 font-medium">
          <Filter className="w-3.5 h-3.5 text-teal-700" />
          <span>Filter Matches:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500">Region:</span>
            <select
              value={areaFilter}
              onChange={e => setAreaFilter(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 text-xs font-medium cursor-pointer"
            >
              <option value="all">All Regions</option>
              <option value="Delhi">Delhi / NCR</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-stone-500">Language:</span>
            <select
              value={languageFilter}
              onChange={e => setLanguageFilter(e.target.value)}
              className="py-1 px-2.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 text-xs font-medium cursor-pointer"
            >
              <option value="all">All Languages</option>
              <option value="Hindi">Hindi</option>
              <option value="English">English</option>
              <option value="Punjabi">Punjabi</option>
              <option value="Marathi">Marathi</option>
              <option value="Kannada">Kannada</option>
              <option value="Telugu">Telugu</option>
            </select>
          </div>
        </div>
      </div>

      {/* Matches List or Empty State */}
      {filteredMatches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center mx-auto">
            <Info className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-stone-900">
            No Caregivers Matched With Current Filters
          </h2>
          <p className="text-xs text-stone-600 max-w-md mx-auto">
            Try resetting your region or language filters above, or contact a certified community elder-care service.
          </p>
          <button
            type="button"
            onClick={() => {
              setAreaFilter('all');
              setLanguageFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMatches.map(match => {
            const cg = match.caregiver;
            const bd = match.scoreBreakdown;

            return (
              <div
                key={cg.caregiver_id}
                className="bg-white rounded-2xl border border-stone-200 hover:border-teal-500 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
              >
                {/* Top: Avatar, Name, Role, Score */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-teal-100 text-teal-800 font-bold text-sm flex items-center justify-center shrink-0 border border-teal-200">
                        {cg.display_name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h2 className="font-bold text-stone-900 text-sm">
                            {cg.display_name}
                          </h2>
                          <span title="Verified background check">
                            <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
                          </span>
                        </div>
                        <span className="text-xs text-stone-500 block">
                          {cg.role} · {cg.experience_years} yrs exp
                        </span>
                      </div>
                    </div>

                    {/* Total Match Score Badge */}
                    <div className="text-right">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-teal-900 font-bold text-xs border border-teal-200">
                        <span>{bd.totalScore}</span>
                        <span className="text-[10px] text-teal-600 font-normal">/ 100</span>
                      </div>
                      <span className="text-[10px] text-stone-600 block mt-0.5">
                        Match Score
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {cg.bio}
                  </p>

                  {/* Explainable Score Breakdown */}
                  <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 text-[11px] space-y-1">
                    <span className="font-semibold text-stone-700 block">
                      Score Breakdown:
                    </span>
                    <div className="grid grid-cols-4 gap-1 text-center font-mono">
                      <div className="bg-white p-1 rounded border border-stone-200">
                        <div className="font-bold text-stone-800">{bd.skillFit}/40</div>
                        <div className="text-[9px] text-stone-600">Skills</div>
                      </div>
                      <div className="bg-white p-1 rounded border border-stone-200">
                        <div className="font-bold text-stone-800">{bd.availabilityFit}/25</div>
                        <div className="text-[9px] text-stone-600">Schedule</div>
                      </div>
                      <div className="bg-white p-1 rounded border border-stone-200">
                        <div className="font-bold text-stone-800">{bd.areaFit}/20</div>
                        <div className="text-[9px] text-stone-600">Area</div>
                      </div>
                      <div className="bg-white p-1 rounded border border-stone-200">
                        <div className="font-bold text-stone-800">{bd.languageFit}/15</div>
                        <div className="text-[9px] text-stone-600">Language</div>
                      </div>
                    </div>
                  </div>

                  {/* Attributes */}
                  <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{cg.service_area}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>Availability: <strong className="capitalize">{cg.availability}</strong></span>
                      <span className="text-stone-300">|</span>
                      <span>Rate: {cg.hourly_rate_est}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Languages className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{cg.languages.join(', ')}</span>
                    </div>
                  </div>

                  {/* Match reasons */}
                  <div className="space-y-1 pt-1">
                    {match.matchReasons.map((r, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] text-teal-800 font-medium">
                        <CheckCircle className="w-3 h-3 text-teal-600 shrink-0" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>

                  {/* Scope note */}
                  <div className="text-[10px] text-stone-600 pt-1 border-t border-stone-100">
                    <strong className="text-stone-600">Scope:</strong> {cg.eligibility_notes}
                  </div>
                </div>

                {/* Bottom CTA Buttons */}
                <div className="flex items-center gap-2 pt-1">
                  {onOpenTinyFish && (
                    <button
                      type="button"
                      onClick={() => onOpenTinyFish(cg.caregiver_id, cg.display_name)}
                      className="py-2.5 px-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold text-xs hover:bg-indigo-100 transition-colors flex items-center justify-center gap-1"
                      title="Audit credentials via TinyFish Web Agent"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
                      <span>TinyFish Audit</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenInquiry(cg)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-teal-700 text-white font-semibold text-xs hover:bg-teal-800 transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-2 focus-visible:outline-teal-600"
                  >
                    <CalendarCheck className="w-3.5 h-3.5" />
                    <span>{t.btnRequestCaregiver}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Inquiry Dialog Modal */}
      {selectedCaregiver && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-stone-900 text-lg">
                  Inquire Availability: {selectedCaregiver.display_name}
                </h3>
                <span className="text-xs text-stone-500">
                  {selectedCaregiver.role} · {selectedCaregiver.service_area}
                </span>
              </div>
              <button
                onClick={() => setSelectedCaregiver(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-lg"
                aria-label="Close dialog"
              >
                ✕
              </button>
            </div>

            {inquirySent ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm">
                  Inquiry Dispatched (Prototype Demonstration)
                </h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto">
                  In a production system, this sends an SMS/WhatsApp availability notification to the vetted caregiver network without sharing private phone numbers until mutually confirmed.
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => setSelectedCaregiver(null)}
                    className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendInquiry} className="space-y-4">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <strong>Important Notice:</strong> Caregivers provide non-clinical personal care, mobility, and companionship. They are NOT doctors, registered nurses, or emergency dispatchers.
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Specific Support Needed (e.g. daily walking, meal prep, bathing)
                  </label>
                  <textarea
                    rows={3}
                    value={inquiryNotes}
                    onChange={e => setInquiryNotes(e.target.value)}
                    required
                    placeholder="Describe daily assistance hours needed, mobility status, or preferred timing..."
                    className="w-full text-xs p-3 rounded-xl border border-stone-200 focus:border-teal-600 outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setSelectedCaregiver(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800"
                  >
                    Send Availability Request
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Bottom Nav Bar */}
      <div className="flex items-center justify-between pt-4 border-t border-stone-200">
        <button
          type="button"
          onClick={onBackToResult}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Recommendation</span>
        </button>

        <button
          type="button"
          onClick={onViewSummary}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal-700 text-white text-xs font-semibold hover:bg-teal-800 transition-colors shadow-xs"
        >
          <FileText className="w-4 h-4" />
          <span>{t.btnReviewSummary}</span>
        </button>
      </div>
    </div>
  );
};
