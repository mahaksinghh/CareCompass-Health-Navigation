import React, { useState, useEffect } from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  MapPin,
  Clock,
  Languages,
  Search,
  Filter,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';
import { CaregiverProfile, SupportedLanguage } from '../types/index.ts';
import { api } from '../services/apiClient.ts';
import { translations } from '../i18n/translations.ts';

interface FindCaregiversViewProps {
  language: SupportedLanguage;
  onStartGuidance: () => void;
  onOpenTinyFish?: (caregiverId?: string, caregiverName?: string) => void;
}

export const FindCaregiversView: React.FC<FindCaregiversViewProps> = ({
  language,
  onStartGuidance,
  onOpenTinyFish
}) => {
  const t = translations[language];
  const [caregivers, setCaregivers] = useState<CaregiverProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const list = await api.getAllCaregivers();
      setCaregivers(list);
      setIsLoading(false);
    }
    load();
  }, []);

  const filtered = caregivers.filter(cg => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      cg.display_name.toLowerCase().includes(q) ||
      cg.role.toLowerCase().includes(q) ||
      cg.skills.some(s => s.toLowerCase().includes(q)) ||
      cg.service_area.toLowerCase().includes(q);

    const matchesArea =
      selectedArea === 'all' ||
      cg.service_area.toLowerCase().includes(selectedArea.toLowerCase());

    const matchesAvail =
      selectedAvailability === 'all' ||
      cg.availability === selectedAvailability ||
      cg.availability === 'flexible';

    return matchesSearch && matchesArea && matchesAvail;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold mb-2">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Community Caregiver Directory</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Vetted Non-Clinical Caregivers & Companions
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Browse verified home helpers, memory companions, and post-op support aides. All listed caregivers provide non-clinical personal support.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {onOpenTinyFish && (
            <button
              onClick={() => onOpenTinyFish()}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 font-semibold text-xs sm:text-sm hover:bg-indigo-100 shadow-xs transition-colors shrink-0"
              title="Search live 24/7 facilities and trauma centers with TinyFish"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-700" />
              <span>TinyFish Live Facilities &amp; Audit</span>
            </button>
          )}

          <button
            onClick={onStartGuidance}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-700 text-white font-semibold text-xs sm:text-sm hover:bg-teal-800 shadow-xs transition-colors shrink-0"
          >
            <span>Need Urgency Guidance First?</span>
          </button>
        </div>
      </div>

      {/* Safety Scope Callout */}
      <div className="p-4 rounded-xl bg-stone-100 border border-stone-200 text-xs text-stone-700 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Non-Clinical Scope Guarantee:</strong> None of these caregivers are listed as doctors or clinical triage authorities. They support daily living activities (bathing, mobility, meal prep, companion walks, and appointment escorting).
        </p>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, role, skill (e.g. mobility, meal prep)..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-200 focus:border-teal-600 outline-hidden text-stone-800 placeholder:text-stone-400 text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">Area:</span>
            <select
              value={selectedArea}
              onChange={e => setSelectedArea(e.target.value)}
              className="py-1.5 px-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 font-medium text-xs cursor-pointer"
            >
              <option value="all">All Localities</option>
              <option value="Delhi">Delhi / NCR</option>
              <option value="Bengaluru">Bengaluru</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Kolkata">Kolkata</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-stone-500 font-medium">Schedule:</span>
            <select
              value={selectedAvailability}
              onChange={e => setSelectedAvailability(e.target.value)}
              className="py-1.5 px-2 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 font-medium text-xs cursor-pointer"
            >
              <option value="all">Any Availability</option>
              <option value="immediate">Immediate</option>
              <option value="weekdays">Weekdays</option>
              <option value="weekends">Weekends</option>
              <option value="full_time">Full-time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {isLoading ? (
        <div className="py-12 text-center text-xs text-stone-500">
          Loading caregiver records...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 text-xs text-stone-600">
          No caregivers match your current search query.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(cg => (
            <div
              key={cg.caregiver_id}
              className="bg-white rounded-2xl border border-stone-200/90 hover:border-teal-400 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold text-xs flex items-center justify-center border border-teal-200 shrink-0">
                      {cg.display_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="font-bold text-stone-900 text-xs sm:text-sm">
                          {cg.display_name}
                        </h2>
                        <span title="Background verified">
                          <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 block leading-tight">
                        {cg.role}
                      </span>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200 shrink-0">
                    {cg.experience_years}y exp
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
                  {cg.bio}
                </p>

                {/* Details */}
                <div className="space-y-1.5 text-xs text-stone-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{cg.service_area}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="capitalize">{cg.availability}</span>
                    <span className="text-stone-300">·</span>
                    <span>{cg.hourly_rate_est}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span>{cg.languages.join(', ')}</span>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {cg.skills.slice(0, 3).map((sk, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-stone-50 text-stone-600 border border-stone-200"
                    >
                      {sk.replace(/_/g, ' ')}
                    </span>
                  ))}
                  {cg.skills.length > 3 && (
                    <span className="text-[10px] text-stone-400 self-center">
                      +{cg.skills.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                {onOpenTinyFish ? (
                  <button
                    onClick={() => onOpenTinyFish(cg.caregiver_id, cg.display_name)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200 transition-colors"
                  >
                    <ShieldCheck className="w-3 h-3 text-indigo-600" />
                    <span>TinyFish Audit</span>
                  </button>
                ) : (
                  <span className="text-[11px] text-stone-500">
                    {cg.verified_status === 'verified_background_check' ? '✓ Background Checked' : '✓ ID Verified'}
                  </span>
                )}
                <span className="text-xs font-semibold text-teal-800 hover:text-teal-900 cursor-pointer">
                  Inquire Profile →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
