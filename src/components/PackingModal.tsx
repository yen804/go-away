import React, { useState, useEffect } from 'react';
import { X, Plus, Check, Trash2 } from 'lucide-react';

interface PackingModalProps {
  currentTrip: string;
  onClose: () => void;
}

export default function PackingModal({ currentTrip, onClose }: PackingModalProps) {
  const [items, setItems] = useState<{id: string, text: string, packed: boolean}[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(`packing_${currentTrip}`);
    if (saved) setItems(JSON.parse(saved));
  }, [currentTrip]);

  useEffect(() => {
    localStorage.setItem(`packing_${currentTrip}`, JSON.stringify(items));
  }, [items, currentTrip]);

  const addItem = () => {
    if (!input) return;
    setItems([...items, { id: Date.now().toString(), text: input, packed: false }]);
    setInput('');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white border-4 border-black p-6 w-full max-w-sm" style={{ boxShadow: '8px 8px 0px black' }}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-black">行李檢查</h2>
          <button onClick={onClose}><X size={28} /></button>
        </div>
        <div className="flex gap-2 mb-4">
          <input value={input} onChange={e => setInput(e.target.value)} className="flex-1 border-2 border-black p-2" placeholder="要帶什麼？" />
          <button onClick={addItem} className="bg-black text-white p-2"><Plus /></button>
        </div>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-2 p-2 border-2 border-black">
              <button onClick={() => setItems(items.map(i => i.id === item.id ? {...i, packed: !i.packed} : i))}>
                {item.packed ? <Check className="text-green-600" /> : <div className="w-6 h-6 border-2 border-black" />}
              </button>
              <span className={`flex-1 font-bold ${item.packed ? 'line-through opacity-50' : ''}`}>{item.text}</span>
              <button onClick={() => setItems(items.filter(i => i.id !== item.id))}><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}