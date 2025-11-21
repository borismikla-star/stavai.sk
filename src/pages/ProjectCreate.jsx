import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Building2, Save, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProjectCreate() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    type: 'residential',
    location: '',
    area: '',
    floors: '',
    status: 'planning',
    description: ''
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Project.create(data),
    onSuccess: (project) => {
      navigate(createPageUrl(`ProjectDetail?id=${project.id}`));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate({
      ...formData,
      area: formData.area ? parseFloat(formData.area) : undefined,
      floors: formData.floors ? parseInt(formData.floors) : undefined
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl('Projects'))}
            className="mb-6 text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Späť na projekty
          </Button>

          <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white">Nový projekt</h1>
              <p className="text-slate-400">Vytvor nový stavebný projekt</p>
            </div>
          </div>

          <Card className="glass-effect border-slate-800">
            <CardHeader>
              <CardTitle className="text-white">Základné informácie</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="text-slate-300">Názov projektu *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="napr. Rezidenčný komplex Panorama"
                    className="bg-slate-900 border-slate-700 text-white"
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="type" className="text-slate-300">Typ projektu *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange('type', value)}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residential">Rezidenčná</SelectItem>
                        <SelectItem value="commercial">Komerčná</SelectItem>
                        <SelectItem value="industrial">Priemyselná</SelectItem>
                        <SelectItem value="infrastructure">Infraštruktúra</SelectItem>
                        <SelectItem value="renovation">Rekonštrukcia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="status" className="text-slate-300">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                      <SelectTrigger className="bg-slate-900 border-slate-700 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Plánovanie</SelectItem>
                        <SelectItem value="analysis">Analýza</SelectItem>
                        <SelectItem value="in_progress">Prebieha</SelectItem>
                        <SelectItem value="completed">Dokončený</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-slate-300">Lokalita</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="napr. Bratislava, Slovensko"
                    className="bg-slate-900 border-slate-700 text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="area" className="text-slate-300">Rozloha (m²)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      placeholder="1200"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>

                  <div>
                    <Label htmlFor="floors" className="text-slate-300">Počet podlaží</Label>
                    <Input
                      id="floors"
                      type="number"
                      value={formData.floors}
                      onChange={(e) => handleInputChange('floors', e.target.value)}
                      placeholder="5"
                      className="bg-slate-900 border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-slate-300">Popis projektu</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Stručný popis projektu, ciele, špecifiká..."
                    className="bg-slate-900 border-slate-700 text-white h-32"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(createPageUrl('Projects'))}
                    className="flex-1 border-slate-700 text-slate-300"
                  >
                    Zrušiť
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    {createMutation.isPending ? 'Vytvára sa...' : 'Vytvoriť projekt'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}