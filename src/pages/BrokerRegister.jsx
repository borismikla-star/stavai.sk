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
import { Textarea } from '@/components/ui/textarea';

export default function BrokerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    company: '',
    country: '',
    phone: '',
    role: 'broker',
    company_description: ''
  });

  const registerMutation = useMutation({
    mutationFn: async (data) => {
      await base44.users.inviteUser(data.email, data.role);
      
      await base44.auth.updateMe({
        company: data.company,
        country: data.country,
        phone: data.phone,
        verification_status: 'pending',
        admin_notes: data.company_description
      });

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

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <Building2 className="w-12 h-12 mx-auto mb-4 text-[#C6A756]" />
          <h1 className="text-3xl font-bold text-[#111827] mb-2">
            Submit a Deal
          </h1>
          <p className="text-slate-600">
            Register as a broker/developer to list your off-market opportunities
          </p>
        </div>

        <Card className="bg-white border-slate-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-[#111827]">Broker/Developer Application</CardTitle>
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
                  <Label htmlFor="company">Company *</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange('company', e.target.value)}
                    required
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
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="company_description">Company Description</Label>
                <Textarea
                  id="company_description"
                  value={formData.company_description}
                  onChange={(e) => handleInputChange('company_description', e.target.value)}
                  placeholder="Brief description of your company and track record"
                  rows={4}
                />
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