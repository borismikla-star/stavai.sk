import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, ArrowRight, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const statusColor = {
  draft: "bg-amber-100 text-amber-800",
  completed: "bg-blue-100 text-blue-800",
  transferred: "bg-green-100 text-green-800",
};

const statusLabel = {
  draft: "Rozpracované",
  completed: "Dokončené",
  transferred: "Prenesené",
};

export default function ConceptList({ concepts, onOpen, onDelete }) {
  if (!concepts || concepts.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">Zatiaľ žiadne uložené koncepty.</p>;
  }

  return (
    <div className="space-y-3">
      {concepts.map(c => {
        const r = c.results || {};
        return (
          <Card key={c.id} className="hover:shadow-md transition-shadow">
            <CardContent className="flex items-center justify-between gap-4 py-4 flex-wrap">
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="h-5 w-5 text-blue-600 shrink-0" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate flex items-center gap-2">
                    {c.name}
                    {r.mode === 'subdivision' && (
                      <span className="text-xs font-normal px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">Parcelácia</span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {c.created_date ? format(new Date(c.created_date), 'dd.MM.yyyy') : '—'}
                    {r.mode === 'subdivision'
                      ? (r.number_of_parcels ? ` · ${r.number_of_parcels} parciel` : '')
                      : (r.apartment_count ? ` · ${r.apartment_count} bytov` : '')}
                    {r.mode !== 'subdivision' && r.npp_above ? ` · ${Math.round(r.npp_above).toLocaleString('sk-SK')} m² ČPP` : ''}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className={`text-xs ${statusColor[c.status] || statusColor.draft}`}>
                  {statusLabel[c.status] || c.status}
                </Badge>
                <Button variant="outline" size="sm" onClick={() => onOpen(c)}>
                  Otvoriť <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => onDelete(c.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}