import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { SupportedLanguage } from '../types/index.ts';
import { translations } from '../i18n/translations.ts';

interface DisclaimerBannerProps {
  language: SupportedLanguage;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ language }) => {
  const t = translations[language];

  return (
    <aside aria-label="Clinical disclaimer" className="bg-amber-50/90 border-b border-amber-200/80 text-amber-950 text-xs py-2 px-4 transition-colors">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" aria-hidden="true" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-amber-900">Prototype Notice:</strong>{' '}
            {t.disclaimerBanner}
          </p>
        </div>
        <div className="hidden lg:flex items-center gap-2 text-stone-600 shrink-0 text-[11px]">
          <span>India: <strong>112</strong></span>
          <span aria-hidden="true">·</span>
          <span>US/CA: <strong>911</strong></span>
          <span aria-hidden="true">·</span>
          <span>UK: <strong>999</strong></span>
        </div>
      </div>
    </aside>
  );
};
