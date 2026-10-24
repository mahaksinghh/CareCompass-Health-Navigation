import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Activity,
  ListFilter,
  Lock,
  ChevronDown,
  ChevronUp,
  FileCode
} from 'lucide-react';
import {
  SafetyEventLogEntry,
  SafetySuiteSummary,
  SafetyTestCase
} from '../types/index.ts';
import { api } from '../services/apiClient.ts';

export const SafetySuiteView: React.FC = () => {
  const [summary, setSummary] = useState<SafetySuiteSummary | null>(null);
  const [logs, setLogs] = useState<SafetyEventLogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [expandedTestId, setExpandedTestId] = useState<string | null>(null);
  const [tests, setTests] = useState<SafetyTestCase[]>([]);

  useEffect(() => {
    // Initial fetch of tests and logs
    async function loadData() {
      const [testList, logList] = await Promise.all([
        api.getSafetyTests(),
        api.getSafetyLogs()
      ]);
      setTests(testList);
      setLogs(logList);
    }
    loadData();
  }, []);

  const handleRunSuite = async () => {
    setIsRunning(true);
    try {
      const result = await api.runSafetySuite();
      setSummary(result);
      const updatedLogs = await api.getSafetyLogs();
      setLogs(updatedLogs);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClearLogs = async () => {
    await api.clearSafetyLogs();
    setLogs([]);
  };

  const filteredResults = summary?.results.filter(r => {
    if (filterCategory === 'all') return true;
    if (filterCategory === 'emergency') return r.expectedEmergency;
    if (filterCategory === 'non-emergency') return !r.expectedEmergency;
    if (filterCategory === 'failed') return !r.passed;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Deterministic Clinical Safety Layer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Safety Regression & Red-Flag Audit Console
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl">
            Automated synthetic safety test runner validating deterministic red-flag sensitivity, negation handling, zero under-triage, and emergency caregiver matching suppression.
          </p>
        </div>

        <button
          onClick={handleRunSuite}
          disabled={isRunning}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-teal-700 text-white font-semibold text-xs sm:text-sm hover:bg-teal-800 disabled:opacity-50 shadow-xs transition-all shrink-0 focus-visible:outline-2 focus-visible:outline-teal-600"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{isRunning ? 'Running 20 Test Cases...' : 'Run Safety Regression Suite'}</span>
        </button>
      </div>

      {/* Safety Manifesto / Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <strong className="font-semibold block text-amber-900">
            Important Clinical Evaluation Notice:
          </strong>
          <p className="leading-relaxed">
            A 100% pass rate on synthetic regression cases proves the software enforces its engineered deterministic safety gates as designed. It is <strong>NOT</strong> clinical ground truth or clinical trial validation. Real-world deployment requires qualified clinical protocol governance.
          </p>
        </div>
      </div>

      {/* Metric Cards */}
      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Emergency Sensitivity
            </span>
            <div className="text-2xl font-extrabold text-emerald-700 mt-1">
              {summary.emergencySensitivityPct}%
            </div>
            <span className="text-[10px] text-stone-500 block mt-0.5">
              Target: 100% (No missed red flags)
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Under-Triage Count
            </span>
            <div className={`text-2xl font-extrabold mt-1 ${summary.underTriageCount === 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
              {summary.underTriageCount}
            </div>
            <span className="text-[10px] text-stone-500 block mt-0.5">
              Target: 0 critical misclassifications
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Tests Passed
            </span>
            <div className="text-2xl font-extrabold text-stone-900 mt-1">
              {summary.passed} <span className="text-sm font-normal text-stone-500">/ {summary.totalTests}</span>
            </div>
            <span className="text-[10px] text-stone-500 block mt-0.5">
              Failures: {summary.failed}
            </span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-xs">
            <span className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider block">
              Average Latency
            </span>
            <div className="text-2xl font-extrabold text-teal-700 mt-1">
              {summary.avgLatencyMs} <span className="text-sm font-normal text-stone-500">ms</span>
            </div>
            <span className="text-[10px] text-stone-500 block mt-0.5">
              Deterministic rule execution
            </span>
          </div>
        </div>
      )}

      {/* Test Cases Table Section */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-teal-700" />
            <h2 className="font-bold text-stone-900 text-sm">
              Synthetic Test Cases ({summary ? summary.results.length : tests.length})
            </h2>
          </div>

          {summary && (
            <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg text-xs">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterCategory === 'all' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600'
                }`}
              >
                All ({summary.results.length})
              </button>
              <button
                onClick={() => setFilterCategory('emergency')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterCategory === 'emergency' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600'
                }`}
              >
                Emergencies (13)
              </button>
              <button
                onClick={() => setFilterCategory('non-emergency')}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filterCategory === 'non-emergency' ? 'bg-white shadow-xs text-stone-900' : 'text-stone-600'
                }`}
              >
                Non-Emergency (7)
              </button>
            </div>
          )}
        </div>

        {summary ? (
          <div className="divide-y divide-stone-100 text-xs">
            {filteredResults?.map(res => {
              const matchingTest = tests.find(t => t.id === res.testId);
              const isExpanded = expandedTestId === res.testId;

              return (
                <div key={res.testId} className="p-3.5 hover:bg-stone-50 transition-colors">
                  <div
                    onClick={() => setExpandedTestId(isExpanded ? null : res.testId)}
                    className="flex items-center justify-between gap-3 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-2.5">
                      {res.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[11px] font-bold text-stone-600">
                            [{res.testId}]
                          </span>
                          <span className="font-semibold text-stone-900">
                            {res.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-stone-500 block">
                          Category: {res.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right hidden sm:block">
                        <span className="text-[11px] font-mono text-stone-600 block">
                          Urgency: <strong className={res.actualEmergency ? 'text-rose-700' : 'text-teal-700'}>{res.actualUrgency}</strong>
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {res.latencyMs}ms
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-stone-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-stone-400" />
                      )}
                    </div>
                  </div>

                  {isExpanded && matchingTest && (
                    <div className="mt-3 pt-3 border-t border-stone-100 text-[11px] space-y-2 bg-stone-50/70 p-3 rounded-xl">
                      <div>
                        <strong className="text-stone-700 block">Input Test Utterance:</strong>
                        <p className="font-mono bg-white p-2 rounded-lg border border-stone-200 text-stone-800 mt-1">
                          "{matchingTest.inputText}"
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-stone-600">
                        <div>
                          <strong>Expected Emergency:</strong> {matchingTest.expectedEmergency ? 'YES (High Acuity)' : 'NO'}
                        </div>
                        <div>
                          <strong>Actual Emergency:</strong> {res.actualEmergency ? 'YES' : 'NO'}
                        </div>
                        <div>
                          <strong>Red-Flags Fired:</strong>{' '}
                          {res.redFlagsTriggered.length > 0 ? res.redFlagsTriggered.join(', ') : 'None (Safe)'}
                        </div>
                        <div>
                          <strong>Clinical / Safety Notes:</strong> {matchingTest.notes}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-stone-500 space-y-3">
            <Activity className="w-8 h-8 text-stone-400 mx-auto" />
            <p>Click "Run Safety Regression Suite" above to verify all 20 test cases live.</p>
          </div>
        )}
      </div>

      {/* Safety Audit Event Logs (No PII) */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-xs p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-700" />
            <div>
              <h2 className="font-bold text-stone-900 text-sm">
                Real-Time Anonymized Safety Event Log
              </h2>
              <span className="text-[11px] text-stone-500">
                Audits red-flag trips and emergency suppressions without recording free-text patient health information.
              </span>
            </div>
          </div>

          {logs.length > 0 && (
            <button
              onClick={handleClearLogs}
              className="text-stone-500 hover:text-stone-800 text-xs flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear Log</span>
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <div className="p-4 rounded-xl bg-stone-50 text-center text-xs text-stone-500">
            No safety events logged in this session yet. Events are logged when triage runs or red flags trip.
          </div>
        ) : (
          <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto text-xs font-mono">
            {logs.map(log => (
              <div key={log.id} className="py-2 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      log.eventType === 'RED_FLAG_TRIPPED' || log.eventType === 'CAREGIVER_BLOCKED_FOR_EMERGENCY'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {log.eventType}
                  </span>
                  <span className="text-stone-700">{log.anonymizedSessionHash}</span>
                  <span className="text-stone-400 text-[10px] hidden sm:inline">
                    · {log.language} · Urgency: {log.urgency}
                  </span>
                </div>
                <div className="text-stone-400 text-[10px]">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
