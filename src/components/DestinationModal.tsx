import React from 'react';
import { X, Plus, MapPin, Trash2 } from 'lucide-react';

// 定義門口規格，讓 App.tsx 可以把資料傳進來
interface DestinationModalProps {
  trips: string[];
  currentTrip: string;
  onSelect: (dest: string) => void;
  onAdd: (newDest: string) => void;
  onDelete: (dest: string) => void;
  onClose: () => void;
}

export default function DestinationModal({ trips, currentTrip, onSelect, onAdd, onDelete, onClose }: DestinationModalProps) {
  const [newDest, setNewDest] = React.useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-black p-6 w-full max-auto" style={{ boxShadow: '8px 8px 0px black', maxWidth: '380px' }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black">要去哪裡？</h2>
          <button onClick={onClose}><X size={28} /></button>
        </div>
        
        <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
          {trips.map(t => (
            <div key={t} className={`flex items-center justify-between p-3 border-2 border-black ${t === currentTrip ? 'bg-yellow-300' : 'bg-white'}`}>
              <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => onSelect(t)}>
                <MapPin size={18} />
                <span className="font-bold">{t}</span>
              </div>
              {trips.length > 1 && (
                <button onClick={() => onDelete(t)} className="p-1 hover:text-red-500"><Trash2 size={18} /></button>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input 
            value={newDest} 
            onChange={(e) => setNewDest(e.target.value)}
            placeholder="新增目的地..."
            className="flex-1 border-2 border-black p-2 font-bold"
          />
          <button 
            onClick={() => { if(newDest) { onAdd(newDest); setNewDest(''); } }}
            className="bg-black text-white p-2"
          ><Plus /></button>
        </div>
      </div>
    </div>
  );
}