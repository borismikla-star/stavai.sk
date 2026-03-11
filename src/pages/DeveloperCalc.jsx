import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Loader2, List, Plus, ArrowLeft, Calculator } from 'lucide-react';
import ProjectInfoSection from '../components/developerCalc/ProjectInfoSection';
import CostSection from '../components/developerCalc/CostSection';
import RevenueSection from '../components/developerCalc/RevenueSection';
import FinancingSection from '../components/developerCalc/FinancingSection';
import DevCalcResults from '../components/developerCalc/DevCalcResults';
import { calculateDevelopment } from '../components/developerCalc/devCalcEngine';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, ArrowRight, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

// ─── Default project data ───────────────────────────────────────────
const DEFAULTS = {
  // Project info / areas
  gfa_above: 5400,
  gfa_below: 1200,
  nfa_above: 4050,
  nfa_below: 900,
  sales_area_apartments: 3500,
  sales_area_non_residential: 200,
  sales_area_balconies: 350,
  sales_area_gardens: 0,
  basement_area: 120,
  paved_areas: 600,
  green_areas_terrain: 400,
  green_areas_structure: 0,
  parking_indoor_count: 70,
  parking_outdoor_count: 10,
  project_duration_months: 36,
  sales_start_month: 9,
  // Costs
  land_and_project: 2000000,
  above_ground_unit_price: 1450,
  below_ground_unit_price: 900,
  outdoor_areas_unit_price: 120,
  greenery_terrain_unit_price: 80,
  greenery_structure_unit_price: 0,
  development_fee_per_m2: 50,
  // Revenue
  apartments_unit_price: 3800,
  non_residential_unit_price: 3200,
  parking_indoor_unit_price: 25000,
  parking_outdoor_unit_price: 10000,
  balconies_unit_price: 800,
  gardens_unit_price: 600,
  basements_unit_price: 500,
  other_revenue: 0,
  // Financing
  own_resources_percent: 30,
  bank_interest_percent: 6,
};

// ─── Project list item ──────────────────────────────────────────────
function ProjectListItem({ project, onOpen, onDelete }) {
  const r = project.results || {};
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="flex items-center justify-between gap-4 py-4 flex-wrap">
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="h-5 w-5 text-emerald-600 shrink-0" />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{project.name}</p>
            <p className="text-xs text-gray-400">
              {project.created_date ? format(new Date(project.created_date), 'dd.MM.yyyy') : '—'}
              {r.totalGrossRevenue ? ` · Tržby: € ${Math.round(r.totalGrossRevenue).toLocaleString('sk-SK')}` : ''}
              {r.profitMargin != null ? ` · Marža: ${r.profitMargin.toFixed(1)}%` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onOpen(project)}>
            Otvoriť <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => onDelete(project.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Main page ──────────────────────────────────────────────────────
export default function DeveloperCalc() {
  const queryClient = useQueryClient();
  const [view, setView] = useState('list'); // 'list' | 'editor'
  const [projectName, setProjectName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [data, setData] = useState(DEFAULTS);

  const results = useMemo(() => calculateDevelopment(data), [data]);

  const handleChange = (updates) => {
    setData(prev => ({ ...prev, ...updates }));
    setIsDirty(true);
  };

  // Projects list
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['devProjects'],
    queryFn: () => base44.entities.Project.list('-created_date'),
  });

  const saveMutation = useMutation({
    mutationFn: (payload) => editingId
      ? base44.entities.Project.update(editingId, payload)
      : base44.entities.Project.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devProjects'] });
      queryClient.invalidateQueries({ queryKey: ['recentProjects'] });
      setIsDirty(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Project.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['devProjects'] }),
  });

  const handleSave = () => {
    saveMutation.mutate({
      name: projectName || `Developer Projekt ${new Date().toLocaleDateString('sk-SK')}`,
      type: 'residential',
      area: data.gfa_above,
      status: 'analysis',
      estimated_cost: results.totalProjectCosts,
      estimated_duration: data.project_duration_months,
      description: JSON.stringify({ inputs: data, results }),
    });
  };

  const handleOpen = (project) => {
    setEditingId(project.id);
    setProjectName(project.name);
    try {
      const saved = JSON.parse(project.description || '{}');
      if (saved.inputs) setData({ ...DEFAULTS, ...saved.inputs });
    } catch {
      setData(DEFAULTS);
    }
    setIsDirty(false);
    setView('editor');
  };

  const handleNew = () => {
    setEditingId(null);
    setProjectName('');
    setData(DEFAULTS);
    setIsDirty(false);
    setView('editor');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-widest mb-1">Nástroj</p>
          <h1 className="text-2xl font-bold text-gray-900">Developer Kalkulačka</h1>
          <p className="text-sm text-gray-500 mt-0.5">Kompletný finančný model — náklady, tržby, IRR, marža, cashflow</p>
        </div>
        <div className="flex items-center gap-2">
          {view === 'list' ? (
            <Button onClick={handleNew} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Nový projekt
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setView('list')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Moje projekty
            </Button>
          )}
        </div>
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <List className="w-4 h-4 text-emerald-600" />
            <h2 className="text-base font-semibold text-gray-900">Moje projekty</h2>
            <Badge variant="outline" className="text-xs">{projects.length}</Badge>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Calculator className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-2">Zatiaľ žiadne projekty</p>
              <Button onClick={handleNew} size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white mt-2">
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Nový projekt
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map(p => (
                <ProjectListItem key={p.id} project={p} onOpen={handleOpen} onDelete={id => deleteMutation.mutate(id)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDITOR VIEW */}
      {view === 'editor' && (
        <div>
          {/* Save bar */}
          <div className="flex items-center gap-3 mb-6 bg-white border border-gray-200 rounded-xl px-4 py-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <Label className="text-xs font-medium text-gray-600 block mb-1">Názov projektu</Label>
              <Input
                value={projectName}
                onChange={e => { setProjectName(e.target.value); setIsDirty(true); }}
                placeholder="napr. Rezidencia Bratislava – Ružinov"
                className="h-8 text-sm"
              />
            </div>
            {isDirty && <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">Neuložené</Badge>}
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
              size="sm"
            >
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
              {saveMutation.isPending ? 'Ukladám…' : 'Uložiť'}
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left — Inputs */}
            <div>
              <Tabs defaultValue="info">
                <TabsList className="grid grid-cols-4 w-full mb-4">
                  <TabsTrigger value="info" className="text-xs">Projekt</TabsTrigger>
                  <TabsTrigger value="costs" className="text-xs">Náklady</TabsTrigger>
                  <TabsTrigger value="revenue" className="text-xs">Tržby</TabsTrigger>
                  <TabsTrigger value="financing" className="text-xs">Financovanie</TabsTrigger>
                </TabsList>
                <TabsContent value="info">
                  <ProjectInfoSection data={data} onChange={handleChange} />
                </TabsContent>
                <TabsContent value="costs">
                  <CostSection data={data} projectData={data} results={results} onChange={handleChange} />
                </TabsContent>
                <TabsContent value="revenue">
                  <RevenueSection data={data} projectData={data} results={results} onChange={handleChange} />
                </TabsContent>
                <TabsContent value="financing">
                  <FinancingSection data={data} results={results} onChange={handleChange} />
                </TabsContent>
              </Tabs>
            </div>

            {/* Right — Results */}
            <div>
              <DevCalcResults results={results} baseData={data} projectName={projectName} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}