import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export function useIsPro() {
  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me().catch(() => null),
    retry: false,
    staleTime: 60000,
  });
  return (
    user?.role === 'admin' ||
    user?.plan === 'pro' ||
    user?.plan === 'enterprise' ||
    user?.beta_access === true
  );
}

/**
 * Obalí obsah paywallom — ak user nie je Pro, zobrazí blur + lock overlay.
 */
export default function Paywall({ children, feature = 'Táto funkcia vyžaduje Pro plán', minHeight = 180 }) {
  const isPro = useIsPro();
  if (isPro) return <>{children}</>;

  return (
    <div className="relative rounded-xl overflow-hidden" style={{ minHeight }}>
      <div className="blur-sm pointer-events-none select-none opacity-30">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-white/75">
        <div className="text-center px-6 py-8 max-w-xs">
          <div className="w-12 h-12 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm mb-2">{feature}</h3>
          <p className="text-xs text-gray-500 leading-relaxed mb-4">
            Odomknite pokročilé analytické funkcie s Pro plánom.
          </p>
          <Button asChild size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs">
            <Link to={createPageUrl('Pricing')}>Zobraziť plány →</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}