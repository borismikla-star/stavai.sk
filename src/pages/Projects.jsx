import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { 
  Plus, Building2, Search, Filter, MoreVertical, 
  Trash2, Edit, TrendingUp, ArrowRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => base44.entities.Project.list('-created_date', 100)
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Project.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    }
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.location?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || project.type === filterType;
    return matchesSearch && matchesType;
  });

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

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12"
        >
          <div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Projekty</h1>
            <p className="text-lg text-slate-600">Spravuj svoje stavebné projekty</p>
          </div>
          <Link to={createPageUrl('ProjectCreate')}>
            <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:shadow-lg hover:shadow-cyan-500/50">
              <Plus className="w-5 h-5 mr-2" />
              Nový projekt
            </Button>
          </Link>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-effect border-slate-800 rounded-xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hľadať projekty..."
                className="pl-10 bg-white border-slate-300"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'residential', 'commercial', 'industrial'].map((type) => (
                <Button
                  key={type}
                  variant={filterType === type ? 'default' : 'outline'}
                  onClick={() => setFilterType(type)}
                  className={filterType === type ? 'bg-cyan-600 text-white' : 'border-slate-300 text-slate-700'}
                >
                  {type === 'all' ? 'Všetky' : typeLabels[type]}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="text-center py-20 text-slate-600">Načítavam projekty...</div>
        ) : filteredProjects.length === 0 ? (
          <Card className="bg-white border-slate-200 shadow-md">
            <CardContent className="p-20 text-center">
              <Building2 className="w-20 h-20 mx-auto mb-6 text-slate-300" />
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                {searchQuery || filterType !== 'all' ? 'Žiadne projekty' : 'Zatiaľ žiadne projekty'}
              </h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                {searchQuery || filterType !== 'all' 
                  ? 'Skús upraviť filter alebo vyhľadávanie'
                  : 'Vytvor svoj prvý projekt a začni používať AI nástroje pre analýzu a plánovanie'}
              </p>
              <Link to={createPageUrl('ProjectCreate')}>
                <Button className="bg-gradient-to-r from-cyan-600 to-blue-600">
                  <Plus className="w-5 h-5 mr-2" />
                  Vytvoriť prvý projekt
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={createPageUrl(`ProjectDetail?id=${project.id}`)}>
                  <Card className="bg-white border-slate-200 hover:border-cyan-500 transition-all group cursor-pointer h-full shadow-md">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${typeColors[project.type]} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Building2 className="w-6 h-6 text-white" />
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white">
                              <MoreVertical className="w-5 h-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white border-slate-200">
                            <DropdownMenuItem className="text-slate-700 hover:text-slate-900">
                              <Edit className="w-4 h-4 mr-2" />
                              Upraviť
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={(e) => {
                                e.preventDefault();
                                if (confirm('Naozaj chceš vymazať tento projekt?')) {
                                  deleteMutation.mutate(project.id);
                                }
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Vymazať
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:gradient-text transition-all">
                        {project.name}
                      </h3>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-slate-500">Typ</span>
                          <span className="text-slate-700">{typeLabels[project.type]}</span>
                        </div>
                        {project.location && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Lokalita</span>
                            <span className="text-slate-700">{project.location}</span>
                          </div>
                        )}
                        {project.area && (
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Rozloha</span>
                            <span className="text-slate-700">{project.area} m²</span>
                          </div>
                        )}
                      </div>

                      {project.estimated_cost && (
                        <div className="bg-slate-50 rounded-lg p-3 mb-4 border border-slate-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-slate-600 text-sm">
                              <TrendingUp className="w-4 h-4" />
                              Odhadované náklady
                            </div>
                            <div className="text-lg font-bold text-slate-900">
                              €{(project.estimated_cost / 1000).toFixed(0)}k
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          project.status === 'completed' ? 'bg-green-500/20 text-green-600' :
                          project.status === 'in_progress' ? 'bg-blue-500/20 text-blue-600' :
                          project.status === 'analysis' ? 'bg-yellow-500/20 text-yellow-600' :
                          'bg-slate-500/20 text-slate-600'
                        }`}>
                          {statusLabels[project.status]}
                        </div>
                        <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-all" />
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
  );
}