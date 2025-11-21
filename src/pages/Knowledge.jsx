import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '../utils';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BookOpen, Search, Clock, ArrowRight, Sparkles, TrendingUp, Building2, Brain } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function Knowledge() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ published: true }, '-created_date', 100)
  });

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || article.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(a => a.featured).slice(0, 3);

  const categories = [
    { id: 'all', label: 'Všetky', icon: BookOpen },
    { id: 'ai', label: 'AI', icon: Brain },
    { id: 'construction', label: 'Stavebníctvo', icon: Building2 },
    { id: 'real_estate', label: 'Real Estate', icon: TrendingUp },
    { id: 'investment', label: 'Investície', icon: Sparkles },
  ];

  const categoryColors = {
    ai: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    construction: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    real_estate: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    investment: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    trends: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
    tutorial: 'bg-green-500/10 text-green-400 border-green-500/20'
  };

  const categoryLabels = {
    ai: 'AI',
    construction: 'Stavebníctvo',
    real_estate: 'Real Estate',
    investment: 'Investície',
    trends: 'Trendy',
    tutorial: 'Tutorial'
  };

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-violet-500/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <BookOpen className="w-16 h-16 mx-auto mb-6 text-cyan-400" />
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Knowledge Hub
            </h1>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Vzdelávanie o AI v stavebníctve, real estate insights a best practices
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="glass-effect border-slate-800 rounded-xl p-6">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Hľadať články..."
                className="pl-12 bg-slate-900 border-slate-700 text-white h-12"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={filterCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => setFilterCategory(cat.id)}
                  className={filterCategory === cat.id ? 'bg-cyan-600' : 'border-slate-700 text-slate-300'}
                >
                  <cat.icon className="w-4 h-4 mr-2" />
                  {cat.label}
                </Button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Featured Articles */}
        {featuredArticles.length > 0 && filterCategory === 'all' && !searchQuery && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-cyan-400" />
              Odporúčané články
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {featuredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-effect border-slate-800 hover:border-cyan-500/50 transition-all group h-full">
                    {article.image_url && (
                      <div className="h-48 overflow-hidden rounded-t-xl">
                        <img 
                          src={article.image_url} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[article.category]}`}>
                          {categoryLabels[article.category]}
                        </span>
                        {article.read_time && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {article.read_time} min
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:gradient-text transition-all">
                        {article.title}
                      </h3>
                      <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                        Čítať článok
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* All Articles */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-6">
            {searchQuery || filterCategory !== 'all' ? 'Výsledky' : 'Všetky články'}
          </h2>

          {isLoading ? (
            <div className="text-center py-20 text-slate-400">Načítavam články...</div>
          ) : filteredArticles.length === 0 ? (
            <Card className="glass-effect border-slate-800">
              <CardContent className="p-20 text-center">
                <BookOpen className="w-20 h-20 mx-auto mb-6 text-slate-600" />
                <h3 className="text-2xl font-bold text-white mb-3">Žiadne články</h3>
                <p className="text-slate-400">
                  {searchQuery || filterCategory !== 'all'
                    ? 'Skús upraviť filter alebo vyhľadávanie'
                    : 'Zatiaľ tu nie sú žiadne publikované články'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="glass-effect border-slate-800 hover:border-cyan-500/50 transition-all group h-full cursor-pointer">
                    {article.image_url && (
                      <div className="h-48 overflow-hidden rounded-t-xl">
                        <img 
                          src={article.image_url} 
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${categoryColors[article.category]}`}>
                          {categoryLabels[article.category]}
                        </span>
                        {article.read_time && (
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Clock className="w-3 h-3" />
                            {article.read_time} min
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:gradient-text transition-all">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                          {article.excerpt}
                        </p>
                      )}
                      {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {article.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-xs text-slate-500">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                        Čítať viac
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}