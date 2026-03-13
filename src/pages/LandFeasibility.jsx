import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, ArrowLeft, List, Layers, Loader2 } from 'lucide-react';
import Paywall from '../components/shared/Paywall';
import ExportPDFButton from '../components/developerCalc/ExportPDF';
import FeasibilityInputs from '../components/landFeasibility/FeasibilityInputs';
import FeasibilityResults from '../components/landFeasibility/FeasibilityResults';
import ConceptList from '../components/landFeasibility/ConceptList';
import { calculateFeasibility } from '../components/landFeasibility/feasibilityCalculation';

const DEFAULT_INPUTS = {
  land_area: 2000,
  iz: 0.40,
  kpp: null,
  floors: 5,
  project_type: 'building',
  non_residential_pct: 0,
  min_green_pct: 0.20,
  avg_apartment_size: 60,
  mode: 'realistic',
  green_on_structure: false,
  parking_ratio: 1.2,
  outdoor_ratio: 0.1,
  paved_pct: 0.15,
  urban_risk_buffer: 0.10,
  // Subdivision defaults
  public_roads_pct: 0.20,
  green_pct: 0.40,
  paved_pct_house: 0.10,
  min_parcel_size: 600,
  max_plot_coverage: 0.30,
  floors_per_house: 2,
  kpp_house: null,
  typology: 'detached',
  risk_buffer_pct: 0.15,
  parking_per_house: 2,
};

export default function LandFeasibility() {
  const queryClient = useQueryClient();

  const [view, setView] = useState('list');
  const [inputs, setInputs] = useState(DEFAULT_INPUTS);
  const [conceptName, setConceptName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isDirty, setIsDirty] = useState(false);

  const results = useMemo(() => calculateFeasibility(inputs), [inputs]);

  const handleInputsChange = (newInputs) => {
    setInputs(newInputs);
    setIsDirty(true);
  };

  const { data: concepts = [], isLoading } = useQuery({
    queryKey: ['landConcepts'],
    queryFn: () => base44.entities.LandConcept.list('-created_date'),
  });

  const saveMutation = useMutation({
    mutationFn: (data) => editingId
      ? base44.entities.LandConcept.update(editingId, data)
      : base44.entities.LandConcept.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['landConcepts'] });
      setIsDirty(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.LandConcept.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['landConcepts'] }),
  });

  const handleSave = () => {
    saveMutation.mutate({
      name: conceptName || `Koncept ${new Date().toLocaleDateString('sk-SK')}`,
      status: 'completed',
      data_confidence: results.mode === 'subdivision' ? 'concept_subdivision' : 'concept',
      inputs,
      results,
    });
  };

  const handleOpen = (concept) => {
    setEditingId(concept.id);
    setConceptName(concept.name);
    setInputs({ ...DEFAULT_INPUTS, ...(concept.inputs || {}) });
    setIsDirty(false);
    setView('editor');
  };

  const handleNew = () => {
    setEditingId(null);
    setConceptName('');
    setInputs(DEFAULT_INPUTS);
    setIsDirty(false);
    setView('editor');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest mb-1">Nástroj</p>
          <h1 className="text-2xl font-bold text-gray-900">Land Feasibility</h1>
          <p className="text-sm text-gray-500 mt-0.5">Concept Generator — predkúpová analýza potenciálu pozemku</p>
        </div>
        <div className="flex items-center gap-2">
          {view === 'list' ? (
            <Button onClick={handleNew} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" /> Nový koncept
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setView('list')}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Moje koncepty
            </Button>
          )}
        </div>
      </div>

      {/* View: List */}
      {view === 'list' && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <List className="w-4 h-4 text-blue-600" />
            <h2 className="text-base font-semibold text-gray-900">Moje koncepty</h2>
            <Badge variant="outline" className="text-xs">{concepts.length}</Badge>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : (
            <ConceptList
              concepts={concepts}
              onOpen={handleOpen}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          )}
          {!isLoading && concepts.length === 0 && (
            <div className="text-center py-16">
              <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Layers className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-gray-500 text-sm font-medium mb-2">Zatiaľ žiadne koncepty</p>
              <p className="text-gray-400 text-xs mb-4">Vytvorte prvý koncept pre analýzu pozemku</p>
              <Button onClick={handleNew} size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Nový koncept
              </Button>
            </div>
          )}
        </div>
      )}

      {/* View: Editor */}
      {view === 'editor' && (
        <Paywall feature="Land Feasibility je Pro nástroj" minHeight={400}>
        <div>
          {/* Save bar */}
          <div className="flex items-center gap-3 mb-6 bg-white border border-gray-200 rounded-xl px-4 py-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <Label className="text-xs font-medium text-gray-600 block mb-1">Názov konceptu</Label>
              <Input
                value={conceptName}
                onChange={e => { setConceptName(e.target.value); setIsDirty(true); }}
                placeholder="napr. Pozemok Bratislava – Ružinov"
                className="h-8 text-sm"
              />
            </div>
            {isDirty && <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">Neuložené</Badge>}
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
            >
              {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1.5" /> : <Save className="w-4 h-4 mr-1.5" />}
              {saveMutation.isPending ? 'Ukladám…' : 'Uložiť'}
            </Button>
          </div>

          {/* Two-column layout */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <FeasibilityInputs inputs={inputs} onChange={handleInputsChange} />
            </div>
            <div>
              <FeasibilityResults results={results} />
              <div className="mt-4">
                <ExportPDF results={results} projectName={conceptName || 'Land Feasibility'} baseData={inputs} />
              </div>
            </div>
          </div>
        </div>
        </Paywall>
      )}
    </div>
  );
}