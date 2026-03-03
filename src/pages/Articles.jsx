import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Clock, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const categoryLabels = {
  ai: 'AI & Technológie',
  construction: 'Stavebníctvo',
  real_estate: 'Reality',
  investment: 'Investície',
  trends: 'Trendy',
  tutorial: 'Návody',
};

const categoryColors = {
  ai: 'bg-purple-100 text-purple-700',
  construction: 'bg-orange-100 text-orange-700',
  real_estate: 'bg-blue-100 text-blue-700',
  investment: 'bg-green-100 text-green-700',
  trends: 'bg-rose-100 text-rose-700',
  tutorial: 'bg-sky-100 text-sky-700',
};

export default function Articles() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: () => base44.entities.Article.filter({ published: true }, '-created_date', 50)
  });

  const filtered = articles.filter(a => {
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || (a.excerpt || '').toLowerCase().includes(search.toLowerCase());
    const matchCategory = !category || a.category === category;
    return matchSearch && matchCategory;
  });

  const featured = filtered.filter(a => a.featured);
  const regular = filtered.filter(a => !a.featured);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="text-xs text-blue-600 uppercase tracking-widest font-semibold mb-1">Knowledge base</div>
        <h1 className="text-3xl font-black text-[#0F172A]">Odborné Články</h1>
        <p className="text-slate-500 text-sm mt-1">Analýzy, trendy a návody pre development a stavebníctvo</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Input
          placeholder="Hľadať..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-white border-slate-200 w-64"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-48 bg-white"><SelectValue placeholder="Všetky kategórie" /></SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Všetky kategórie</SelectItem>
            {Object.entries(categoryLabels).map(([k, v]) => (
              <SelectItem key={k} value={k}>{v}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading && <div className="text-center py-12 text-slate-500">Načítava sa...</div>}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-600 mb-2">Žiadne články</h3>
          <p className="text-slate-400">Žiadne články zodpovedajú vašim kritériám</p>
        </div>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <div className="mb-10">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Odporúčané</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {featured.slice(0, 2).map((article) => (
              <Card key={article.id} className="bg-white border-slate-200 hover:shadow-md transition group cursor-pointer overflow-hidden">
                {article.image_url && (
                  <div className="h-48 overflow-hidden">
                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge className={`text-xs ${categoryColors[article.category] || 'bg-slate-100 text-slate-600'}`}>
                      {categoryLabels[article.category] || article.category}
                    </Badge>
                    {article.featured && <Badge className="bg-amber-100 text-amber-700 text-xs">Featured</Badge>}
                  </div>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2 group-hover:text-blue-600 transition leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-4">{article.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {article.read_time} min čítania
                    </div>
                    {article.tags?.slice(0, 2).map(tag => (
                      <div key={tag} className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        {tag}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Regular Articles */}
      {regular.length > 0 && (
        <div>
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Všetky články</h2>
          <div className="grid md:grid-cols-3 gap-5">
            {regular.map((article) => (
              <Card key={article.id} className="bg-white border-slate-200 hover:shadow-md transition group cursor-pointer">
                {article.image_url && (
                  <div className="h-36 overflow-hidden rounded-t-lg">
                    <img src={article.image_url} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                )}
                <CardContent className="p-5">
                  <Badge className={`text-xs mb-3 ${categoryColors[article.category] || 'bg-slate-100 text-slate-600'}`}>
                    {categoryLabels[article.category] || article.category}
                  </Badge>
                  <h3 className="font-bold text-[#0F172A] text-sm mb-2 group-hover:text-blue-600 transition leading-snug line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-3">{article.excerpt}</p>
                  <div className="flex items-center gap-1 text-xs text-slate-400">
                    <Clock className="w-3 h-3" />
                    {article.read_time} min
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}