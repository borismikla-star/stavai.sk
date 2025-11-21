import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Building2, ArrowLeft, Edit, Trash2, DollarSign, Clock, 
  BarChart3, MapPin, Layers, TrendingUp, Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProjectDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const projectId = urlParams.get('id');
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: async () => {
      const projects = await base44.entities.Project.list();
      return projects.find(p => p.id === projectId);
    },
    enabled: !!projectId
  });

  const { data: estimates = [] } = useQuery({
    queryKey: ['estimates', projectId],
    queryFn: () => base44.entities.CostEstimate.filter({ project_id: projectId }),
    enabled: !!projectId
  });

  const { data: timelines = [] } = useQuery({
    queryKey: ['timelines', projectId],
    queryFn: () => base44.entities.Timeline.filter({ project_id: projectId }),
    enabled: !!projectId
  });

  const { data: analyses = [] } = useQuery({
    queryKey: ['analyses', projectId],
    queryFn: () => base44.entities.FeasibilityAnalysis.filter({ project_id: projectId }),
    enabled: !!projectId
  });

  const deleteMutation = useMutation({
    mutationFn: () => base44.entities.Project.delete(projectId),
    onSuccess: () => {
      navigate(createPageUrl('Projects'));
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400">Načítavam projekt...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Projekt nenájdený</h2>
          <Link to={createPageUrl('Projects')}>
            <Button variant="outline" className="border-slate-700 text-slate-300">
              Späť na projekty
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const typeColors = {
    residential: 'from-cyan-500 to-blue-500',
    commercial: 'from-blue-500 to-violet-500',
    industrial: 'from-violet-500 to-purple-500',
    infrastructure: 'from-purple-500 to-pink-500',
    renovation: 'from-pink-500 to-rose-500'
  };

  const typeLabels = {
    residential: 'Rezidenčná',
    commercial: 'Komerčná',
    industrial: 'Priemyselná',
    infrastructure: 'Infraštruktúra',
    renovation: 'Rekonštrukcia'
  };

  const statusLabels = {
    planning: 'Plánovanie',
    analysis: 'Analýza',
    in_progress: 'Prebieha',
    completed: 'Dokončený'
  };

  const quickActions = [
    {
      title: 'Cost Estimate',
      description: 'Odhad nákladov',
      icon: DollarSign,
      path: 'CostEstimator',
      color: 'from-cyan-500 to-blue-500',
      count: estimates.length
    },
    {
      title: 'Timeline',
      description: 'Harmonogram',
      icon: Clock,
      path: 'TimelineGenerator',
      color: 'from-blue-500 to-violet-500',
      count: timelines.length
    },
    {
      title: 'Feasibility',
      description: 'Investment analýza',
      icon: BarChart3,
      path: 'FeasibilityAnalyzer',
      color: 'from-violet-500 to-purple-500',
      count: analyses.length
    }
  ];

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
            <div className="flex items-start gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${typeColors[project.type]} flex items-center justify-center`}>
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">{project.name}</h1>
                <div className="flex flex-wrap items-center gap-3 text-slate-400">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                    project.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                    project.status === 'analysis' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {statusLabels[project.status]}
                  </span>
                  <span>•</span>
                  <span>{typeLabels[project.type]}</span>
                  {project.location && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="border-slate-700 text-slate-300">
                <Edit className="w-4 h-4 mr-2" />
                Upraviť
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Naozaj chceš vymazať tento projekt?')) {
                    deleteMutation.mutate();
                  }
                }}
                className="border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Vymazať
              </Button>
            </div>
          </div>

          {/* Project Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {project.area && (
              <Card className="glass-effect border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Layers className="w-5 h-5 text-cyan-400" />
                    <span className="text-sm text-slate-400">Rozloha</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{project.area} m²</div>
                </CardContent>
              </Card>
            )}
            {project.floors && (
              <Card className="glass-effect border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Building2 className="w-5 h-5 text-blue-400" />
                    <span className="text-sm text-slate-400">Počet podlaží</span>
                  </div>
                  <div className="text-2xl font-bold text-white">{project.floors}</div>
                </CardContent>
              </Card>
            )}
            {project.estimated_cost && (
              <Card className="glass-effect border-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <TrendingUp className="w-5 h-5 text-violet-400" />
                    <span className="text-sm text-slate-400">Odhadované náklady</span>
                  </div>
                  <div className="text-2xl font-bold text-white">€{(project.estimated_cost / 1000).toFixed(0)}k</div>
                </CardContent>
              </Card>
            )}
          </div>

          {project.description && (
            <Card className="glass-effect border-slate-800 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Popis projektu</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-300">{project.description}</p>
              </CardContent>
            </Card>
          )}

          {/* AI Tools */}
          <Card className="glass-effect border-slate-800 mb-8">
            <CardHeader>
              <CardTitle className="text-white">AI Analýzy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Link key={index} to={createPageUrl(action.path)}>
                    <div className="glass-effect border-slate-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all group cursor-pointer">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <action.icon className="w-6 h-6 text-white" />
                        </div>
                        {action.count > 0 && (
                          <span className="px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-bold">
                            {action.count}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-white mb-1">{action.title}</h3>
                      <p className="text-sm text-slate-400">{action.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Estimates */}
          {estimates.length > 0 && (
            <Card className="glass-effect border-slate-800 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Odhady nákladov</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {estimates.slice(0, 3).map((estimate) => (
                    <div key={estimate.id} className="border border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">{estimate.project_name}</div>
                          <div className="text-sm text-slate-400">
                            {estimate.area} m² • {estimate.quality}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">€{estimate.total_cost?.toLocaleString()}</div>
                          <div className="text-sm text-slate-400">€{estimate.cost_per_sqm}/m²</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Timelines */}
          {timelines.length > 0 && (
            <Card className="glass-effect border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Harmonogramy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timelines.slice(0, 3).map((timeline) => (
                    <div key={timeline.id} className="border border-slate-700 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-white">{timeline.project_name}</div>
                          <div className="text-sm text-slate-400">
                            {timeline.phases?.length || 0} fáz • {timeline.milestones?.length || 0} míľnikov
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-white">{timeline.total_duration} mes.</div>
                          <div className="text-sm text-slate-400">
                            <Calendar className="w-4 h-4 inline mr-1" />
                            Celkové trvanie
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
}