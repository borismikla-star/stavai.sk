import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Save, Plus, X, MapPin, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import PortalNav from '@/components/portal/PortalNav';

const REGIONS = [
  { value: 'BA', label: 'Bratislavský' }, { value: 'TT', label: 'Trnavský' },
  { value: 'TN', label: 'Trenčínsky' }, { value: 'NR', label: 'Nitriansky' },
  { value: 'ZA', label: 'Žilinský' }, { value: 'BB', label: 'Banskobystrický' },
  { value: 'PO', label: 'Prešovský' }, { value: 'KE', label: 'Košický' }
];

const defaultForm = {
  title: '', property_type: '', listing_type: '', visibility: 'public',
  price: '', area_total: '', location_region: '', location_city: '',
  location_address: '', description: '', contact_type: 'owner',
  images: [], status: 'active'
};

export default function NewListing() {
  const navigate = useNavigate();
  const [form, setForm] = useState(defaultForm);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({});

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me(),
    retry: false
  });

  const createMutation = useMutation({
    mutationFn: () => base44.entities.Listing.create({
      ...form,
      price: parseFloat(form.price) || 0,
      area_total: parseFloat(form.area_total) || 0,
    }),
    onSuccess: () => navigate('/MyListings')
  });

  const set = (field, value) => {
    setForm(p => ({ ...p, [field]: value }));
    if (errors[field]) setErrors(p => ({ ...p, [field]: null }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Povinné';
    if (!form.property_type) e.property_type = 'Povinné';
    if (!form.listing_type) e.listing_type = 'Povinné';
    if (!form.location_region) e.location_region = 'Povinné';
    if (!form.location_city.trim()) e.location_city = 'Povinné';
    if (!form.description.trim()) e.description = 'Povinné';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) createMutation.mutate();
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      set('images', [...form.images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PortalNav />

      <div className="flex items-center gap-3 mb-6">
        <Link to="/PortalHome" className="text-slate-400 hover:text-slate-600"><ChevronLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Nový inzerát</h1>
          <p className="text-slate-500 text-sm">Vyplňte informácie o nehnuteľnosti</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-500">Základné informácie</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Názov inzerátu *</Label>
              <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="napr. 3-izbový byt v centre BA" className="mt-1" />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Typ nehnuteľnosti *</Label>
                <Select value={form.property_type} onValueChange={v => set('property_type', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Vyberte..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="residential">Rezidenčné</SelectItem>
                    <SelectItem value="commercial">Komerčné</SelectItem>
                    <SelectItem value="land">Pozemok</SelectItem>
                    <SelectItem value="development">Development</SelectItem>
                  </SelectContent>
                </Select>
                {errors.property_type && <p className="text-xs text-red-500 mt-1">{errors.property_type}</p>}
              </div>
              <div>
                <Label className="text-sm font-medium">Typ inzerátu *</Label>
                <Select value={form.listing_type} onValueChange={v => set('listing_type', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Vyberte..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Predaj</SelectItem>
                    <SelectItem value="lease">Nájom</SelectItem>
                    <SelectItem value="investment">Investícia</SelectItem>
                  </SelectContent>
                </Select>
                {errors.listing_type && <p className="text-xs text-red-500 mt-1">{errors.listing_type}</p>}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Viditeľnosť</Label>
                <Select value={form.visibility} onValueChange={v => set('visibility', v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Verejný</SelectItem>
                    <SelectItem value="off_market">Off-Market (Pro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Kontakt</Label>
                <Select value={form.contact_type} onValueChange={v => set('contact_type', v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="owner">Vlastník</SelectItem>
                    <SelectItem value="agent">Realitný agent</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Price + Area */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-500">Cena a plocha</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Cena (€)</Label>
                <Input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0 = Na dopyt" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-medium">Celková plocha (m²) *</Label>
                <Input type="number" value={form.area_total} onChange={e => set('area_total', e.target.value)} placeholder="napr. 85" className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-500">Lokalita</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Kraj *</Label>
                <Select value={form.location_region} onValueChange={v => set('location_region', v)}>
                  <SelectTrigger className="mt-1"><SelectValue placeholder="Vyberte kraj..." /></SelectTrigger>
                  <SelectContent>
                    {REGIONS.map(r => <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.location_region && <p className="text-xs text-red-500 mt-1">{errors.location_region}</p>}
              </div>
              <div>
                <Label className="text-sm font-medium">Mesto *</Label>
                <Input value={form.location_city} onChange={e => set('location_city', e.target.value)} placeholder="napr. Bratislava" className="mt-1" />
                {errors.location_city && <p className="text-xs text-red-500 mt-1">{errors.location_city}</p>}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Presná adresa</Label>
              <Input value={form.location_address} onChange={e => set('location_address', e.target.value)} placeholder="napr. Hlavná 1 (skrytá pre off-market)" className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-500">Popis</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Podrobný popis nehnuteľnosti (min. 50 znakov)..." rows={6} />
            <div className="text-xs text-slate-400 mt-1 text-right">{form.description.length} znakov</div>
            {errors.description && <p className="text-xs text-red-500 mt-1">{errors.description}</p>}
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-500">Fotografie (URL)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://... URL fotografie" className="flex-1" />
              <Button type="button" onClick={addImage} variant="outline" size="sm" className="gap-1.5"><Plus className="w-3.5 h-3.5" />Pridať</Button>
            </div>
            {form.images.length > 0 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {form.images.map((url, i) => (
                  <div key={i} className="relative w-20 h-16 rounded-lg overflow-hidden border border-slate-200">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => set('images', form.images.filter((_, j) => j !== i))}
                      className="absolute top-0.5 right-0.5 w-4 h-4 bg-black/60 rounded-full flex items-center justify-center">
                      <X className="w-2.5 h-2.5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-3 pb-8">
          <Link to="/PortalHome"><Button variant="outline">Zrušiť</Button></Link>
          <Button onClick={handleSubmit} disabled={createMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <Save className="w-4 h-4" />
            {createMutation.isPending ? 'Ukladám...' : 'Zverejniť inzerát'}
          </Button>
        </div>
      </div>
    </div>
  );
}