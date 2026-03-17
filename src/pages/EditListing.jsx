import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, Save, Plus, X, MapPin, Loader2 } from 'lucide-react';
import PortalNav from '@/components/portal/PortalNav';

const REGIONS = [
  { value: 'BA', label: 'Bratislavský' }, { value: 'TT', label: 'Trnavský' },
  { value: 'TN', label: 'Trenčínsky' }, { value: 'NR', label: 'Nitriansky' },
  { value: 'ZA', label: 'Žilinský' }, { value: 'BB', label: 'Banskobystrický' },
  { value: 'PO', label: 'Prešovský' }, { value: 'KE', label: 'Košický' }
];

export default function EditListing() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get('id');

  const [form, setForm] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [errors, setErrors] = useState({});
  const [geocoding, setGeocoding] = useState(false);

  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing-edit', listingId],
    queryFn: () => base44.entities.Listing.get(listingId),
    enabled: !!listingId
  });

  useEffect(() => {
    if (listing) {
      setForm({
        title: listing.title || '',
        property_type: listing.property_type || '',
        listing_type: listing.listing_type || '',
        visibility: listing.visibility || 'public',
        status: listing.status || 'active',
        price: listing.price?.toString() || '',
        area_total: listing.area_total?.toString() || '',
        location_region: listing.location_region || '',
        location_city: listing.location_city || '',
        location_address: listing.location_address || '',
        location_lat: listing.location_lat || null,
        location_lng: listing.location_lng || null,
        description: listing.description || '',
        contact_type: listing.contact_type || 'owner',
        images: listing.images || [],
      });
    }
  }, [listing]);

  const updateMutation = useMutation({
    mutationFn: () => base44.entities.Listing.update(listingId, {
      ...form,
      price: parseFloat(form.price) || 0,
      area_total: parseFloat(form.area_total) || 0,
      location_lat: form.location_lat || null,
      location_lng: form.location_lng || null,
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
    if (validate()) updateMutation.mutate();
  };

  const geocodeAddress = async () => {
    if (!form.location_address && !form.location_city) return;
    setGeocoding(true);
    const query = `${form.location_address ? form.location_address + ', ' : ''}${form.location_city}, Slovakia`;
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
    const data = await res.json();
    if (data?.[0]) {
      setForm(p => ({ ...p, location_lat: parseFloat(data[0].lat), location_lng: parseFloat(data[0].lon) }));
    }
    setGeocoding(false);
  };

  const addImage = () => {
    if (imageUrl.trim()) {
      set('images', [...form.images, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  if (isLoading || !form) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <PortalNav />
        <div className="space-y-3 mt-6">{[...Array(4)].map((_, i) => <div key={i} className="bg-slate-100 rounded-2xl h-24 animate-pulse" />)}</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <PortalNav />

      <div className="flex items-center gap-3 mb-6">
        <Link to="/MyListings" className="text-slate-400 hover:text-slate-600"><ChevronLeft className="w-5 h-5" /></Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">Upraviť inzerát</h1>
          <p className="text-slate-500 text-sm line-clamp-1">{listing?.title}</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Basic */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-500">Základné informácie</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Názov inzerátu *</Label>
              <Input value={form.title} onChange={e => set('title', e.target.value)} className="mt-1" />
              {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Typ nehnuteľnosti *</Label>
                <Select value={form.property_type} onValueChange={v => set('property_type', v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
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
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
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
                <Label className="text-sm font-medium">Status</Label>
                <Select value={form.status} onValueChange={v => set('status', v)}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Koncept</SelectItem>
                    <SelectItem value="active">Aktívny</SelectItem>
                    <SelectItem value="under_offer">V rokovaní</SelectItem>
                    <SelectItem value="sold">Predaný</SelectItem>
                    <SelectItem value="expired">Expirovaný</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
          </CardContent>
        </Card>

        {/* Price + Area */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-500">Cena a plocha</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium">Cena (€)</Label>
                <Input type="number" value={form.price} onChange={e => set('price', e.target.value)} placeholder="0 = Na dopyt" className="mt-1" />
              </div>
              <div>
                <Label className="text-sm font-medium">Celková plocha (m²) *</Label>
                <Input type="number" value={form.area_total} onChange={e => set('area_total', e.target.value)} className="mt-1" />
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
                <Input value={form.location_city} onChange={e => set('location_city', e.target.value)} onBlur={geocodeAddress} className="mt-1" />
                {errors.location_city && <p className="text-xs text-red-500 mt-1">{errors.location_city}</p>}
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Presná adresa</Label>
              <div className="relative mt-1">
                <Input
                  value={form.location_address}
                  onChange={e => set('location_address', e.target.value)}
                  onBlur={geocodeAddress}
                  placeholder="napr. Hlavná 1"
                />
                {geocoding && <Loader2 className="absolute right-3 top-2.5 w-4 h-4 text-slate-400 animate-spin" />}
              </div>
              {form.location_lat && form.location_lng && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> GPS: {form.location_lat.toFixed(4)}, {form.location_lng.toFixed(4)}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-bold uppercase tracking-wide text-slate-500">Popis</CardTitle></CardHeader>
          <CardContent>
            <Textarea value={form.description} onChange={e => set('description', e.target.value)} rows={6} />
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
          <Link to="/MyListings"><Button variant="outline">Zrušiť</Button></Link>
          <Button onClick={handleSubmit} disabled={updateMutation.isPending} className="bg-indigo-600 hover:bg-indigo-700 gap-2">
            <Save className="w-4 h-4" />
            {updateMutation.isPending ? 'Ukladám...' : 'Uložiť zmeny'}
          </Button>
        </div>
      </div>
    </div>
  );
}