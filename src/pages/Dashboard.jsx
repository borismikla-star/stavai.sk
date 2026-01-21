import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Plus, FolderOpen, TrendingUp, Clock, DollarSign, 
  BarChart3, Calendar, Building2, ArrowRight, Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date', 100)
  });

  const { data: estimates = [] } = useQuery({
    queryKey: ['estimates'],
    queryFn: () => base44.entities.CostEstimate.list('-created_date', 10)
  });

  const { data: timelines = [] } = useQuery({
    queryKey: ['timelines'],
    queryFn: () => base44.entities.Timeline.list('-created_date', 10)
  });

  const stats = [
    {
      label: 'Projekty',
      value: projects.length,
      icon: FolderOpen,
      color: 'from-cyan-500 to-blue-500',
      change: '+2 tento mesiac'
    },
    {
      label: 'Odhady nákladov',
      value: estimates.length,
      icon: DollarSign,
      color: 'from-blue-500 to-violet-500',
      change: 'Posledný dnes'
    },
    {
      label: 'Harmonogramy',
      value: timelines.length,
      icon: Calendar,
      color: 'from-violet-500 to-purple-500',
      change: `${timelines.length} vygenerovaných`
    },
    {
      label: 'Celková hodnota',
      value: `€${(projects.reduce((sum, p) => sum + (p.estimated_cost || 0), 0) / 1000000).toFixed(1)}M`,
      icon: TrendingUp,
      color: 'from-purple-500 to-pink-500',
      change: 'Odhadovaná hodnota'
    }
  ];

  const quickActions = [
    {
      title: 'Nový projekt',
      description: 'Vytvor nový stavebný projekt',
      icon: Building2,
      path: 'ProjectCreate',
      color: 'from-cyan-500 to-blue-500'
    },
    {
      title: 'Cost Estimator',
      description: 'AI odhad nákladov',
      icon: DollarSign,
      path: 'CostEstimator',
      color: 'from-blue-500 to-violet-500'
    },
    {
      title: 'Timeline Generator',
      description: 'Harmonogram projektu',
      icon: Clock,
      path: 'TimelineGenerator',
      color: 'from-violet-500 to-purple-500'
    },
    {
      title: 'Feasibility Analyzer',
      description: 'Investment analýza',
      icon: BarChart3,
      path: 'FeasibilityAnalyzer',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const recentProjects = projects.slice(0, 5);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Vitaj späť, {user?.full_name?.split(' ')[0] || 'User'}! 👋
          </h1>
          <p className="text-lg text-slate-600">
            Tu je prehľad tvojich projektov a AI analýz
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-slate-200 hover:border-cyan-500 transition-all shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600 mb-2">{stat.label}</div>
                  <div className="text-xs text-slate-500">{stat.change}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-cyan-600" />
            Rýchle akcie
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={createPageUrl(action.path)}>
                  <Card className="bg-white border-slate-200 hover:border-cyan-500 transition-all group cursor-pointer h-full shadow-md">
                    <CardContent className="p-6">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <action.icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">{action.title}</h3>
                      <p className="text-sm text-slate-600">{action.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FolderOpen className="w-6 h-6 text-cyan-600" />
              Nedávne projekty
            </h2>
            <Link to={createPageUrl('Projects')}>
              <Button variant="outline" className="border-slate-300 text-slate-700 hover:border-cyan-500 hover:text-cyan-600">
                Zobraziť všetky
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {projectsLoading ? (
            <div className="text-center py-12 text-slate-600">Načítavam projekty...</div>
          ) : recentProjects.length === 0 ? (
            <Card className="bg-white border-slate-200 shadow-md">
              <CardContent className="p-12 text-center">
                <Building2 className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                <h3 className="text-xl font-bold text-slate-900 mb-2">Žiadne projekty</h3>
                <p className="text-slate-600 mb-6">Vytvor svoj prvý projekt a začni používať AI nástroje</p>
                <Link to={createPageUrl('ProjectCreate')}>
                  <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
                    <Plus className="w-5 h-5 mr-2" />
                    Vytvoriť projekt
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={createPageUrl(`ProjectDetail?id=${project.id}`)}>
                    <Card className="bg-white border-slate-200 hover:border-cyan-500 transition-all group cursor-pointer shadow-md">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-slate-900 mb-1 group-hover:gradient-text transition-all">
                                {project.name}
                              </h3>
                              <div className="flex items-center gap-3 text-sm text-slate-600">
                                <span>{project.location || 'Bez lokality'}</span>
                                <span>•</span>
                                <span>{project.area ? `${project.area} m²` : 'Bez rozlohy'}</span>
                                <span>•</span>
                                <span className="capitalize">{project.type?.replace('_', ' ')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            {project.estimated_cost && (
                              <div className="text-right">
                                <div className="text-sm text-slate-500">Odhad nákladov</div>
                                <div className="text-lg font-bold text-slate-900">
                                  €{(project.estimated_cost / 1000).toFixed(0)}k
                                </div>
                              </div>
                            )}
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              project.status === 'completed' ? 'bg-green-500/20 text-green-600' :
                              project.status === 'in_progress' ? 'bg-blue-500/20 text-blue-600' :
                              project.status === 'analysis' ? 'bg-yellow-500/20 text-yellow-600' :
                              'bg-slate-500/20 text-slate-600'
                            }`}>
                              {project.status === 'planning' ? 'Plánovanie' :
                               project.status === 'analysis' ? 'Analýza' :
                               project.status === 'in_progress' ? 'Prebieha' :
                               'Dokončený'}
                            </div>
                            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}