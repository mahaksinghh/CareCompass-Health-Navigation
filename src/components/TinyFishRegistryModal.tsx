import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Building2,
  PhoneCall,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck2,
  Sparkles,
  MapPin,
  Clock,
  Shield,
  Activity,
  Ambulance,
  RefreshCw
} from 'lucide-react';
import { api } from '../services/apiClient.ts';
import { TinyFishLiveFacility, TinyFishVerificationRecord } from '../types/index.ts';

interface TinyFishRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCaregiverId?: string;
  initialCaregiverName?: string;
}

export const TinyFishRegistryModal: React.FC<TinyFishRegistryModalProps> = ({
  isOpen,
  onClose,
  initialCaregiverId,
  initialCaregiverName
}) => {
  const [activeTab, setActiveTab] = useState<'caregiver_audit' | 'facility_search'>('caregiver_audit');

  // Caregiver Verification State
  const [selectedCaregiverId, setSelectedCaregiverId] = useState(initialCaregiverId || 'CG-DEL-01');
  const [verificationRecord, setVerificationRecord] = useState<TinyFishVerificationRecord | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Facility Search State
  const [city, setCity] = useState('Delhi NCR');
  const [searchQuery, setSearchQuery] = useState('');
  const [emergencyOnly, setEmergencyOnly] = useState(false);
  const [facilities, setFacilities] = useState<TinyFishLiveFacility[]>([]);
  const [isSearchingFacilities, setIsSearchingFacilities] = useState(false);
  const [agentStatus, setAgentStatus] = useState<any>(null);

  // Sync initial caregiver if changed
  useEffect(() => {
    if (initialCaregiverId) {
      setSelectedCaregiverId(initialCaregiverId);
      loadCaregiverVerification(initialCaregiverId, initialCaregiverName);
    } else {
      loadCaregiverVerification('CG-DEL-01', 'Sunita Sharma');
    }
  }, [initialCaregiverId, initialCaregiverName]);

  useEffect(() => {
    if (isOpen) {
      loadFacilities(city, searchQuery, emergencyOnly);
      loadAgentStatus();
    }
  }, [isOpen, city, emergencyOnly]);

  const loadAgentStatus = async () => {
    try {
      const status = await api.getTinyFishStatus();
      setAgentStatus(status);
    } catch {
      // ignore
    }
  };

  const loadCaregiverVerification = async (id: string, name?: string) => {
    setIsVerifying(true);
    try {
      const record = await api.verifyCaregiverWithTinyFish(id, { caregiverName: name });
      setVerificationRecord(record);
    } catch (err) {
      console.warn('Failed to verify caregiver:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  const loadFacilities = async (targetCity: string, query: string, emerg: boolean) => {
    setIsSearchingFacilities(true);
    try {
      const res = await api.getNearbyFacilitiesWithTinyFish(targetCity, query, emerg);
      setFacilities(res.facilities || []);
    } catch (err) {
      console.warn('Facility search error:', err);
    } finally {
      setIsSearchingFacilities(false);
    }
  };

  const handleFacilitySearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadFacilities(city, searchQuery, emergencyOnly);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tinyfish-modal-title"
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-stone-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-teal-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-5 h-5 text-teal-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="tinyfish-modal-title" className="text-base sm:text-lg font-bold tracking-tight">
                  TinyFish Web Agent &amp; Healthcare Registry
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold rounded-full bg-teal-500/20 border border-teal-300/30 text-teal-200">
                  Live Verification
                </span>
              </div>
              <p className="text-xs text-blue-100/80">
                Audits caregiver credentials, national healthcare registers &amp; 24/7 emergency facilities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close TinyFish Registry Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('caregiver_audit')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'caregiver_audit'
                ? 'border-teal-700 text-teal-900 bg-white font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileCheck2 className="w-4 h-4 text-teal-700" />
            <span>Caregiver Credential Audit</span>
          </button>

          <button
            onClick={() => setActiveTab('facility_search')}
            className={`py-3 px-4 border-b-2 flex items-center gap-2 transition-colors ${
              activeTab === 'facility_search'
                ? 'border-teal-700 text-teal-900 bg-white font-bold'
                : 'border-transparent text-stone-600 hover:text-stone-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-teal-700" />
            <span>Live 24/7 Facility &amp; Trauma Finder</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {activeTab === 'caregiver_audit' ? (
            <div className="space-y-4">
              {/* Caregiver Selection Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <div>
                  <label htmlFor="caregiver-select" className="text-xs font-bold text-stone-700 uppercase tracking-wider block mb-1">
                    Select Caregiver to Verify:
                  </label>
                  <select
                    id="caregiver-select"
                    value={selectedCaregiverId}
                    onChange={(e) => {
                      setSelectedCaregiverId(e.target.value);
                      loadCaregiverVerification(e.target.value);
                    }}
                    className="px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-sm font-semibold text-stone-800 shadow-2xs focus:outline-teal-600"
                  >
                    <option value="CG-DEL-01">Sunita Sharma (Senior Care Aide - Delhi)</option>
                    <option value="CG-DEL-02">Rajesh Kumar Verma (Post-Op Companion - NCR)</option>
                    <option value="CG-BLR-03">Priya Nair (Dementia Companion - Bengaluru)</option>
                    <option value="CG-MUM-04">Anita Deshmukh (Maternal Doula - Mumbai)</option>
                  </select>
                </div>

                <button
                  onClick={() => loadCaregiverVerification(selectedCaregiverId)}
                  disabled={isVerifying}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-700 text-white rounded-lg text-xs font-semibold hover:bg-teal-800 transition-colors shadow-2xs self-start sm:self-center"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
                  <span>Re-audit via TinyFish</span>
                </button>
              </div>

              {/* Verification Certificate Card */}
              {isVerifying ? (
                <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 flex flex-col items-center justify-center gap-3">
                  <Activity className="w-6 h-6 animate-spin text-teal-700" />
                  <p className="text-sm font-semibold text-stone-700">
                    Querying Healthcare Sector Skill Council &amp; State Registry via TinyFish Agent...
                  </p>
                </div>
              ) : verificationRecord ? (
                <div className="bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/40 rounded-2xl border-2 border-emerald-300 p-5 shadow-sm space-y-4">
                  {/* Status Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-emerald-200">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 border border-emerald-300">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-stone-900 text-base">
                            {verificationRecord.providerName}
                          </span>
                          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-600 text-white uppercase tracking-wider">
                            {verificationRecord.liveStatus}
                          </span>
                        </div>
                        <span className="text-xs text-stone-500 font-mono">
                          ID: {verificationRecord.caregiverId}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] text-stone-500 block">Audit Hash</span>
                      <span className="text-xs font-mono font-bold text-teal-900 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {verificationRecord.verificationHash}
                      </span>
                    </div>
                  </div>

                  {/* Verification Attributes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                      <span className="text-stone-500 font-medium block">Credentialing Council</span>
                      <div className="font-semibold text-stone-900 flex items-center gap-1.5">
                        <Shield className="w-3.5 h-3.5 text-teal-700" />
                        <span>{verificationRecord.registryCouncil}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                      <span className="text-stone-500 font-medium block">License / Registration Number</span>
                      <div className="font-mono font-bold text-teal-800">
                        {verificationRecord.licenseNumber}
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                      <span className="text-stone-500 font-medium block">Police Verification Seal</span>
                      <div className="font-semibold text-emerald-800 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{verificationRecord.policeClearanceStatus}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
                      <span className="text-stone-500 font-medium block">Last TinyFish Audit</span>
                      <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-stone-500" />
                        <span>Audit ID: {verificationRecord.tinyFishAuditId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Scope Boundary Notice */}
                  <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <AlertCircle className="w-4 h-4 text-amber-700" />
                      <span>Non-Clinical Scope Verified</span>
                    </div>
                    <p className="leading-relaxed text-amber-800">
                      TinyFish verification confirms identity, criminal background clearance, and certified training in non-clinical daily living assistance (mobility, elder bathing, meals). This provider is <strong>not</strong> a licensed physician and must not perform invasive clinical triage or alter medical prescriptions.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search & Filter Bar */}
              <form onSubmit={handleFacilitySearchSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search facility name, trauma unit, ICU, ambulance..."
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-teal-600 shadow-2xs"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="px-3 py-2 text-xs rounded-xl border border-stone-300 bg-white font-semibold text-stone-800 focus:outline-teal-600 shadow-2xs cursor-pointer"
                    >
                      <option value="Delhi NCR">Delhi NCR</option>
                      <option value="Bengaluru">Bengaluru</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="all">All Cities</option>
                    </select>

                    <button
                      type="submit"
                      disabled={isSearchingFacilities}
                      className="px-4 py-2 bg-teal-700 text-white text-xs font-bold rounded-xl hover:bg-teal-800 transition-colors shadow-2xs shrink-0"
                    >
                      {isSearchingFacilities ? 'Searching...' : 'Search Facilities'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-stone-600 px-1">
                  <label className="flex items-center gap-2 cursor-pointer font-medium">
                    <input
                      type="checkbox"
                      checked={emergencyOnly}
                      onChange={(e) => setEmergencyOnly(e.target.checked)}
                      className="rounded text-teal-600 focus:ring-teal-500"
                    />
                    <span>Show 24x7 Emergency &amp; Trauma Resuscitation Only</span>
                  </label>

                  <span className="text-[11px] text-stone-500">
                    {facilities.length} verified facilities
                  </span>
                </div>
              </form>

              {/* Facility Cards List */}
              <div className="space-y-3">
                {facilities.map((fac) => (
                  <div
                    key={fac.id}
                    className={`p-4 rounded-xl border transition-all ${
                      fac.verifiedBedsTrauma
                        ? 'bg-rose-50/40 border-rose-200 hover:border-rose-300'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-stone-900">{fac.name}</h4>
                          {fac.verifiedBedsTrauma && (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-rose-600 text-white uppercase">
                              24/7 Trauma Code
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-stone-500 mt-0.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            {fac.address} ({fac.city})
                          </span>
                          <span className="font-semibold text-stone-700">• {fac.distanceKm}</span>
                        </div>
                      </div>

                      <a
                        href={`tel:${fac.emergencyPhone.split('/')[0].trim()}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-700 text-white font-bold text-xs hover:bg-rose-800 transition-colors shadow-2xs self-start sm:self-center whitespace-nowrap"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call {fac.emergencyPhone}</span>
                      </a>
                    </div>

                    {fac.notes && (
                      <p className="text-xs text-stone-600 leading-relaxed mb-2">
                        {fac.notes}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 text-[11px]">
                      <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {fac.openStatus}
                      </span>

                      <div className="flex items-center gap-2 text-stone-500">
                        <span className="bg-teal-50 text-teal-800 px-2 py-0.5 rounded font-medium border border-teal-200">
                          TinyFish Verified Facility
                        </span>
                        {fac.sourceUrl && (
                          <a
                            href={fac.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-0.5 text-teal-700 hover:underline"
                          >
                            <span>Official Portal</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium">
              TinyFish Web Agent Engine: {agentStatus?.hasKey ? 'Live Web API' : 'Verified Sandbox Registry'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-200 text-stone-800 font-semibold rounded-lg hover:bg-stone-300 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
