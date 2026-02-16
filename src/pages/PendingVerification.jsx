import React from 'react';
import { Clock, Mail, CheckCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function PendingVerification() {
  const handleLogout = async () => {
    await base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-2xl w-full">
        <Card className="bg-white border-slate-200 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-[#111827] mb-4">
              Application Pending
            </h1>
            
            <p className="text-lg text-slate-600 mb-8">
              Your application is currently under review by our team.
            </p>

            <div className="bg-slate-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="font-semibold text-[#111827] mb-4">What happens next?</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#C6A756] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-[#111827]">Manual Verification</div>
                    <div className="text-sm text-slate-600">Our team reviews your application and credentials</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#C6A756] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-[#111827]">Email Notification</div>
                    <div className="text-sm text-slate-600">You'll receive an email once your account is approved</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#C6A756] mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-[#111827]">Full Access</div>
                    <div className="text-sm text-slate-600">Access all features and exclusive deal flow</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-slate-500 mb-6">
              Verification typically takes 1-2 business days
            </div>

            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-300 text-slate-600"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}