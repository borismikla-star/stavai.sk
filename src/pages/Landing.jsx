import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { Building2, Shield, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-[#111827] text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <img 
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6920d2b958e59092776f7607/016f05dc7_IMG_1285.png" 
              alt="Brickbridge" 
              className="h-32 mx-auto mb-8"
            />
            <p className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed">
              Exclusive marketplace for verified investors to access off-market real estate opportunities in CEE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl('Register')}>
                <Button className="bg-[#C6A756] text-[#111827] hover:bg-[#B8994D] px-8 py-6 text-lg font-semibold">
                  Apply as Investor
                </Button>
              </Link>
              <Link to={createPageUrl('BrokerRegister')}>
                <Button variant="outline" className="border-[#C6A756] text-[#C6A756] hover:bg-[#C6A756] hover:text-[#111827] px-8 py-6 text-lg font-semibold">
                  Submit a Deal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111827] mb-4">
              Institutional-Grade Platform
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Secure, verified, and compliant marketplace for serious investors
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: Shield,
                title: 'Verified Access',
                description: 'NDA-protected deal rooms with multi-level verification'
              },
              {
                icon: Users,
                title: 'Curated Network',
                description: 'Manually vetted investors and developers only'
              },
              {
                icon: Building2,
                title: 'Off-Market Deals',
                description: 'Exclusive opportunities not available publicly'
              },
              {
                icon: TrendingUp,
                title: 'CEE Focus',
                description: 'Specialized in Central & Eastern European markets'
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-white border-slate-200 shadow-sm hover:shadow-md transition">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 bg-[#111827] rounded-lg flex items-center justify-center">
                    <feature.icon className="w-7 h-7 text-[#C6A756]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] mb-2">{feature.title}</h3>
                  <p className="text-slate-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111827] text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Access Private Deals?
          </h2>
          <p className="text-xl text-slate-300 mb-8">
            Join verified investors and developers on Brickbridge
          </p>
          <Link to={createPageUrl('Register')}>
            <Button className="bg-[#C6A756] text-[#111827] hover:bg-[#B8994D] px-8 py-6 text-lg font-semibold">
              Get Started
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}