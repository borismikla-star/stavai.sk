import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FileText, Loader, Download, CheckCircle, FileCheck, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function DocumentGenerator() {
  const [formData, setFormData] = useState({
    document_type: 'investment_memo',
    project_name: '',
    project_description: '',
    key_data: '',
    target_audience: 'investors',
    branding: ''
  });

  const [result, setResult] = useState(null);

  const generateMutation = useMutation({
    mutationFn: async (data) => {
      let prompt = '';
      
      if (data.document_type === 'investment_memo') {
        prompt = `Vytvor profesionálny Investment Memo pre projekt:

Názov projektu: ${data.project_name}
Popis: ${data.project_description}
Kľúčové dáta: ${data.key_data}
Target audience: ${data.target_audience}

INVESTMENT MEMO ŠTRUKTÚRA:

1. EXECUTIVE SUMMARY (1 strana)
- Elevator pitch projektu
- Investment thesis
- Key highlights

2. PROJECT OVERVIEW
- Detailný popis projektu
- Location & market positioning
- Unique value proposition

3. MARKET ANALYSIS
- Target market size
- Competitive landscape
- Market trends & opportunities

4. FINANCIAL PROJECTIONS
- Revenue model
- Cost structure
- ROI expectations
- Timeline to profitability

5. RISK ASSESSMENT
- Key risks
- Mitigation strategies
- Exit scenarios

6. TEAM & EXECUTION
- Key team members
- Track record
- Execution roadmap

7. INVESTMENT ASK
- Capital needed
- Use of funds
- Deal terms

Použij profesionálny business jazyk, buď konkrétny a data-driven.`;
      } else if (data.document_type === 'business_plan') {
        prompt = `Vytvor kompletný Business Plan pre projekt:

Názov projektu: ${data.project_name}
Popis: ${data.project_description}
Kľúčové dáta: ${data.key_data}

BUSINESS PLAN ŠTRUKTÚRA (15-20 strán):

1. EXECUTIVE SUMMARY
2. COMPANY DESCRIPTION
3. MARKET ANALYSIS
4. ORGANIZATION & MANAGEMENT
5. SERVICE/PRODUCT LINE
6. MARKETING & SALES STRATEGY
7. FUNDING REQUEST
8. FINANCIAL PROJECTIONS (3-5 years)
9. APPENDIX

Vytvor detailný, actionable business plan suitable for banks a serious investors.`;
      } else if (data.document_type === 'pitch_deck') {
        prompt = `Vytvor obsah pre Pitch Deck (10-12 slides):

Projekt: ${data.project_name}
Popis: ${data.project_description}
Data: ${data.key_data}

PITCH DECK SLIDES:

1. COVER SLIDE - ${data.project_name}
2. PROBLEM - What problem are we solving?
3. SOLUTION - Our approach
4. MARKET OPPORTUNITY - TAM, SAM, SOM
5. PRODUCT - What we're building
6. TRACTION - Achievements to date
7. BUSINESS MODEL - How we make money
8. COMPETITION - Competitive advantage
9. TEAM - Who's building this
10. FINANCIALS - Key projections
11. THE ASK - Investment details
12. CLOSING - Contact & next steps

Pre každý slide zadaj konkrétny obsah, key points, suggested visuals.`;
      } else if (data.document_type === 'due_diligence') {
        prompt = `Vytvor Due Diligence Report pre projekt:

Projekt: ${data.project_name}
Info: ${data.project_description}
Data: ${data.key_data}

DUE DILIGENCE REPORT ŠTRUKTÚRA:

1. EXECUTIVE SUMMARY
2. LEGAL DUE DILIGENCE
   - Corporate structure
   - Ownership
   - Permits & licenses
   - Contracts review
3. FINANCIAL DUE DILIGENCE
   - Historical financials
   - Projections analysis
   - Valuation
4. OPERATIONAL DUE DILIGENCE
   - Business model validation
   - Operations review
   - Technology assessment
5. MARKET DUE DILIGENCE
   - Market validation
   - Competitive positioning
   - Growth potential
6. RISK ASSESSMENT
7. RECOMMENDATIONS
8. RED FLAGS & CONCERNS

Profesionálny, comprehensive report.`;
      }

      const response = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        response_json_schema: {
          type: "object",
          properties: {
            document_title: { type: "string" },
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  section_title: { type: "string" },
                  content: { type: "string" },
                  key_points: { type: "array", items: { type: "string" } }
                }
              }
            },
            executive_summary: { type: "string" },
            total_pages: { type: "number" },
            formatting_notes: { type: "string" }
          }
        }
      });

      return { ...response, document_type: data.document_type };
    },
    onSuccess: (data) => {
      setResult(data);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    generateMutation.mutate(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const documentTypes = {
    investment_memo: { name: 'Investment Memo', icon: FileText, pages: '5-7' },
    business_plan: { name: 'Business Plan', icon: FileCheck, pages: '15-20' },
    pitch_deck: { name: 'Pitch Deck', icon: Sparkles, pages: '10-12' },
    due_diligence: { name: 'Due Diligence Report', icon: CheckCircle, pages: '20-30' }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-600 to-rose-600 flex items-center justify-center">
              <FileText className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">Document Generator</h1>
              <p className="text-slate-600">AI generovanie profesionálnych reportov, business plánov a presentations</p>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20">
            <span className="text-sm text-violet-600 font-medium">⭐ PRO TOOL - Stavai.sk</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white border-slate-200 shadow-lg sticky top-24">
              <CardHeader>
                <CardTitle className="text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-pink-600" />
                  Document Parameters
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="document_type" className="text-slate-700">Typ dokumentu</Label>
                    <Select value={formData.document_type} onValueChange={(value) => handleInputChange('document_type', value)}>
                      <SelectTrigger className="bg-white border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(documentTypes).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.name} ({value.pages} strán)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="project_name" className="text-slate-700">Názov projektu</Label>
                    <Input
                      id="project_name"
                      value={formData.project_name}
                      onChange={(e) => handleInputChange('project_name', e.target.value)}
                      placeholder="napr. Green Office Complex"
                      className="bg-white border-slate-300"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="project_description" className="text-slate-700">Popis projektu</Label>
                    <Textarea
                      id="project_description"
                      value={formData.project_description}
                      onChange={(e) => handleInputChange('project_description', e.target.value)}
                      placeholder="Stručný popis projektu, ciele, unique value proposition..."
                      className="bg-white border-slate-300 h-32"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="key_data" className="text-slate-700">Kľúčové dáta & metriky</Label>
                    <Textarea
                      id="key_data"
                      value={formData.key_data}
                      onChange={(e) => handleInputChange('key_data', e.target.value)}
                      placeholder="Finančné dáta, metriky, míľniky, tím info, atď..."
                      className="bg-white border-slate-300 h-32"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="target_audience" className="text-slate-700">Target Audience</Label>
                    <Select value={formData.target_audience} onValueChange={(value) => handleInputChange('target_audience', value)}>
                      <SelectTrigger className="bg-white border-slate-300">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="investors">Investors / VCs</SelectItem>
                        <SelectItem value="banks">Banks / Financial Institutions</SelectItem>
                        <SelectItem value="partners">Business Partners</SelectItem>
                        <SelectItem value="board">Board / Executives</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="branding" className="text-slate-700">Branding (voliteľné)</Label>
                    <Input
                      id="branding"
                      value={formData.branding}
                      onChange={(e) => handleInputChange('branding', e.target.value)}
                      placeholder="Company name, colors, logo URL..."
                      className="bg-white border-slate-300"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={generateMutation.isPending}
                    className="w-full bg-gradient-to-r from-pink-600 to-rose-600 hover:shadow-lg hover:shadow-pink-500/50 text-lg py-6"
                  >
                    {generateMutation.isPending ? (
                      <>
                        <Loader className="w-5 h-5 mr-2 animate-spin" />
                        AI generuje dokument...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Generovať dokument
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {result ? (
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200 border-2 shadow-xl">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="text-sm text-pink-600 font-semibold mb-2">GENERATED DOCUMENT</div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-2">{result.document_title}</h2>
                        <p className="text-slate-600">{documentTypes[result.document_type]?.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-pink-600">{result.total_pages}</div>
                        <div className="text-sm text-slate-600">strán</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white border-slate-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-slate-900">Executive Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line">{result.executive_summary}</p>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  {result.sections?.map((section, index) => (
                    <Card key={index} className="bg-white border-slate-200 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-slate-900 flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-sm font-bold">
                            {index + 1}
                          </span>
                          {section.section_title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-slate-700 leading-relaxed mb-4 whitespace-pre-line">
                          {section.content}
                        </div>
                        {section.key_points && section.key_points.length > 0 && (
                          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                            <h4 className="font-semibold text-slate-900 mb-2">Key Points:</h4>
                            <ul className="space-y-1">
                              {section.key_points.map((point, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                  <CheckCircle className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {result.formatting_notes && (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-md">
                    <CardHeader>
                      <CardTitle className="text-slate-900 text-lg">Formatting Notes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700 text-sm">{result.formatting_notes}</p>
                    </CardContent>
                  </Card>
                )}

                <div className="flex gap-4">
                  <Button className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 text-white text-lg py-6">
                    <Download className="w-5 h-5 mr-2" />
                    Export as PDF
                  </Button>
                  <Button variant="outline" className="flex-1 border-slate-300 text-slate-700 hover:bg-slate-50 text-lg py-6">
                    <FileText className="w-5 h-5 mr-2" />
                    Export as DOCX
                  </Button>
                </div>
              </div>
            ) : (
              <Card className="bg-white border-slate-200 h-full flex items-center justify-center shadow-lg">
                <CardContent className="text-center p-12">
                  <FileText className="w-20 h-20 mx-auto mb-6 text-slate-300" />
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">Pripravený generovať</h3>
                  <p className="text-slate-600 max-w-md mb-6">
                    Vyber typ dokumentu, zadaj project info a AI vytvorí profesionálny 
                    white-label dokument ready for presentation
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm text-slate-600">
                    {Object.entries(documentTypes).map(([key, value]) => (
                      <div key={key} className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                        <div className="font-semibold text-slate-900 mb-1">{value.name}</div>
                        <div>{value.pages} strán</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}