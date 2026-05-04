import { useState } from 'react';
import { X, CheckCircle2, Trash2, Package } from 'lucide-react';

interface PackingItem { id: string; name: string; category: string; checked: boolean; }

const PackingModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<PackingItem[]>(() => {
    const saved = localStorage.getItem('travel_packing');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: '護照', category: '必備證件', checked: false },
      { id: '2', name: '日幣現金', category: '必備證件', checked: false }
    ];
  });
  const [newItemName, setNewItemName] = useState('');
  const [selectedCat, setSelectedCat] = useState('其他');
  const categories = ['必備證件', '衣物用品', '電子產品', '藥妝衛生', '其他'];

  const toggleItem = (id: string) => {
    const updated = items.map(item => item.id === id ? { ...item, checked: !item.checked } : item);
    setItems(updated);
    localStorage.setItem('travel_packing', JSON.stringify(updated));
  };

  const addItem = () => {
    if (!newItemName) return;
    const newItem = { id: Date.now().toString(), name: newItemName, category: selectedCat, checked: false };
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem('travel_packing', JSON.stringify(updated));
    setNewItemName('');
  };

  const deleteItem = (id: string) => {
    const updated = items.filter(item => item.id !== id);
    setItems(updated);
    localStorage.setItem('travel_packing', JSON.stringify(updated));
  };

  if (!isOpen) return (
    <button onClick={() => setIsOpen(true)} className="w-full bg-[#A8E6CF] border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between font-black text-xl hover:translate-x-1 hover:translate-y-1 transition-all">
      <span>行李檢查清單</span> <Package size={24} />
    </button>
  );

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black w-full max-w-md max-h-[80vh] overflow-y-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-6 border-b-4 border-black sticky top-0 bg-white flex justify-between items-center">
          <h2 className="text-2xl font-black italic">PACKING_LIST</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 border-2 border-black"><X size={24} /></button>
        </div>
        <div className="p-6 space-y-6">
          <div className="bg-[#F7F7F7] border-4 border-black p-4 space-y-3">
            <input placeholder="新增行李物品..." value={newItemName} onChange={(e) => setNewItemName(e.target.value)} className="w-full border-4 border-black p-2 font-bold outline-none" />
            <div className="flex gap-2">
              <select value={selectedCat} onChange={(e) => setSelectedCat(e.target.value)} className="flex-1 border-4 border-black p-2 font-bold outline-none bg-white">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
              <button onClick={addItem} className="bg-black text-white px-4 py-2 font-black">ADD</button>
            </div>
          </div>
          {categories.map(cat => {
            const catItems = items.filter(i => i.category === cat);
            if (catItems.length === 0) return null;
            return (
              <div key={cat} className="space-y-2">
                <h3 className="font-black text-sm bg-[#FFD93D] inline-block px-2 py-1 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{cat}</h3>
                <div className="space-y-1">
                  {catItems.map(item => (
                    <div key={item.id} className={`flex items-center justify-between p-3 border-2 border-black ${item.checked ? 'bg-gray-100 opacity-50' : 'bg-white'}`}>
                      <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleItem(item.id)}>
                        {item.checked ? <CheckCircle2 size={20} className="text-green-500" /> : <div className="w-5 h-5 border-2 border-black rounded-full" />}
                        <span className={`font-bold ${item.checked ? 'line-through' : ''}`}>{item.name}</span>
                      </div>
                      <button onClick={() => deleteItem(item.id)} className="text-gray-300 hover:text-red-500"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PackingModal;