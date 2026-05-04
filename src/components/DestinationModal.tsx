import { useState } from 'react';
import { X, Plus, MapPin, ExternalLink, Trash2 } from 'lucide-react';

interface Destination { id: string; name: string; note: string; link: string; }

const DestinationModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const saved = localStorage.getItem('travel_destinations');
    return saved ? JSON.parse(saved) : [];
  });
  const [newName, setNewName] = useState('');
  const [newNote, setNewNote] = useState('');
  const [newLink, setNewLink] = useState('');

  const handleAdd = () => {
    if (!newName) return;
    const newItem = { id: Date.now().toString(), name: newName, note: newNote, link: newLink };
    const updated = [...destinations, newItem];
    setDestinations(updated);
    localStorage.setItem('travel_destinations', JSON.stringify(updated));
    setNewName(''); setNewNote(''); setNewLink('');
  };

  const handleDelete = (id: string) => {
    const updated = destinations.filter(d => d.id !== id);
    setDestinations(updated);
    localStorage.setItem('travel_destinations', JSON.stringify(updated));
  };

  if (!isOpen) return (
    <button onClick={() => setIsOpen(true)} className="w-full bg-[#4ECDC4] border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between font-black text-xl hover:translate-x-1 hover:translate-y-1 transition-all">
      <span>目的地願望清單</span> <Plus size={24} />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black w-full max-w-md max-h-[80vh] overflow-y-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-6 border-b-4 border-black sticky top-0 bg-white flex justify-between items-center">
          <h2 className="text-2xl font-black italic">WISH_LIST</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 border-2 border-black"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <input placeholder="想去的地點名稱" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full border-4 border-black p-3 font-bold outline-none" />
            <button onClick={handleAdd} className="w-full bg-black text-white p-3 font-black text-lg">新增至願望清單</button>
          </div>
          <div className="space-y-4 pt-4 border-t-4 border-black border-dashed">
            {destinations.map(dest => (
              <div key={dest.id} className="border-4 border-black p-4 bg-[#F7F7F7] flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <MapPin className="text-[#FF6B6B]" size={20} />
                  <h3 className="font-black text-lg">{dest.name}</h3>
                </div>
                <button onClick={() => handleDelete(dest.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DestinationModal;