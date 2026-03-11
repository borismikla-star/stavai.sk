import React from 'react';
import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useIsPro } from './Paywall';

/**
 * Malý inline banner na upgrade — skryje sa automaticky pre Pro userov.
 */
export default function UpgradePrompt({ text = 'Odomknite Pro funkcie — AI, PDF export, Monte Carlo a viac' }) {
  const isPro = useIsPro();
  if (isPro) return null;

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap className="w-3.5 h-3.5 text-blue-600" />
        </div>
        <span className="text-xs font-medium text-blue-800 leading-snug">{text}</span>
      </div>
      <Link
        to={createPageUrl('Pricing')}
        className="text-xs font-semibold text-blue-600 hover:text-blue-800 whitespace-nowrap transition-colors"
      >
        Upgrade →
      </Link>
    </div>
  );
}