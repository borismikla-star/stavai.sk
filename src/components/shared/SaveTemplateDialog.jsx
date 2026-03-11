import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, Check } from 'lucide-react';

/**
 * Dialóg na uloženie aktuálnych vstupov ako znovupoužiteľný template.
 * Props: open, onClose, onSave(name), defaultName
 */
export default function SaveTemplateDialog({ open, onClose, onSave, defaultName = '' }) {
  const [name, setName] = useState(defaultName || 'Môj template');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim());
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1400);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-sm font-semibold">Uložiť ako template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div>
            <Label className="text-xs text-gray-600 mb-1.5 block">Názov templatu</Label>
            <Input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="napr. Rezidenčný projekt BA — štandard"
              className="text-sm"
              onKeyDown={e => e.key === 'Enter' && handleSave()}
            />
          </div>
          <p className="text-xs text-gray-500 leading-relaxed bg-gray-50 rounded-xl p-3">
            Uloží všetky aktuálne vstupné hodnoty (plochy, ceny, financovanie) ako template použiteľný pre nové projekty.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={onClose}>Zrušiť</Button>
          <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white">
            {saved
              ? <><Check className="w-3.5 h-3.5 mr-1.5" />Uložené!</>
              : <><Save className="w-3.5 h-3.5 mr-1.5" />Uložiť template</>
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}