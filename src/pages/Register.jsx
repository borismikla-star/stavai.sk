import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company: '',
    country: '',
    phone: '',
    role: 'investor',
    investment_range_min: '',
    investment_range_max: '',
    preferred_countries: [],
    asset_classes: []
  });

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      // In real app, this would be proper registration with auth
      // For MVP, we'll simulate by creating user via invite
      await base44.users.inviteUser(data.email, data.role);
      
      // Update user data
      await base44.auth.updateMe({
        company: data.company,
        country: data.country,
        phone: data.phone,
        verification_status: 'pending'
      });

      // Create investor profile if investor
      if (data.role === 'investor') {
        await base44.entities.InvestorProfile.create({
          user_id: data.email, // Will be replaced with actual user ID
          investment_range_min: parseFloat(data.investment_range_min) || 0,
          investment_range_max: parseFloat(data.investment_range_max) || 0,
          preferred_countries: data.preferred_countries,
          asset_classes: data.asset_classes
        });
      }

      return data;
    },
    onSuccess: () => {
      navigate(createPageUrl('PendingVerification'));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(v => v !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-[#C6A756]" />
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Apply as Investor
          </h1>
          <p className="text-slate-600">
            Complete your profile to access exclusive off-market deals
          </p>
        </div>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#111827]">Investor Application</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-[#111827] mb-4">Investment Preferences</h3>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label htmlFor="investment_range_min">Min Ticket Size (EUR)</Label>
                    <Input
                      id="investment_range_min"
                      type="number"
                      value={formData.investment_range_min}
                      onChange={(e) => handleInputChange('investment_range_min', e.target.value)}
                      placeholder="100000"
                    />
                  </div>
                  <div>
                    <Label htmlFor="investment_range_max">Max Ticket Size (EUR)</Label>
                    <Input
                      id="investment_range_max"
                      type="number"
                      value={formData.investment_range_max}
                      onChange={(e) => handleInputChange('investment_range_max', e.target.value)}
                      placeholder="5000000"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="mb-3 block">Asset Classes of Interest</Label>
                  <div className="flex flex-wrap gap-3">
                    {['residential', 'development_land', 'commercial'].map(asset => (
                      <label key={asset} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.asset_classes.includes(asset)}
                          onChange={() => toggleArrayField('asset_classes', asset)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm capitalize">{asset.replace('_', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-[#C6A756] text-[#111827] hover:bg-[#B8994D] py-6 text-lg font-semibold"
              >
                {registerMutation.isPending ? 'Submitting...' : 'Submit Application'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}