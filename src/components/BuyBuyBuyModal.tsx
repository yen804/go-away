import { useState } from 'react';
import { X, ShoppingBag, Plus, Trash2 } from 'lucide-react';

interface ShoppingItem {
  id: string;
  name: string;
  price: string;
  checked: boolean;
}

const BuyBuyBuyModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState<ShoppingItem[]>(() => {
    const saved = localStorage.getItem('travel_shopping');
    return saved ? JSON.parse(saved) : [];
  });
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState('');

  const handleAdd = () => {
    if (!newName) return;
    const newItem: ShoppingItem = {
      id: Date.now().toString(),
      name: newName,
      price: newPrice,
      checked: false
    };
    const updated = [...items, newItem];
    setItems(updated);
    localStorage.setItem('travel_shopping', JSON.stringify(updated));
    setNewName('');
    setNewPrice('');
  };

  const toggleItem = (id: string) => {
    const updated = items.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(updated);
    localStorage.setItem('travel_shopping', JSON.stringify(updated));
  };

  const handleDelete = (id: string) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    localStorage.setItem('travel_shopping', JSON.stringify(updated));
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full bg-[#FFD93D] border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between font-black text-xl hover:translate-x-1 hover:translate-y-1 transition-all"
      >
        <span>必買購物清單</span>
        <ShoppingBag size={24} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white border-4 border-black w-full max-w-md max-h-[80vh] overflow-y-auto shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <div className="p-6 border-b-4 border-black sticky top-0 bg-white flex justify-between items-center">
          <h2 className="text-2xl font-black italic">SHOPPING_LIST</h2>
          <button onClick={() => setIsOpen(false)} className="p-1 border-2 border-black">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-3">
            <input 
              placeholder="想買的東西 (例如：合利他命)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full border-4 border-black p-3 font-bold outline-none"
            />
            <input 
              placeholder="預估價格 (日幣)"
              value={newPrice}
              onChange={(e) => setNewPrice(e.target.value)}
              className="w-full border-4 border-black p-3 font-bold outline-none"
            />
            <button 
              onClick={handleAdd}
              className="w-full bg-black text-white p-3 font-black text-lg"
            >
              新增至購物車
            </button>
          </div>

          <div className="space-y-3">
            {items.map(item => (
              <div key={item.id} className={`flex items-center justify-between p-4 border-4 border-black ${item.checked ? 'bg-gray-100 opacity-50' : 'bg-[#FFF9E5]'}`}>
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => toggleItem(item.id)}>
                  <div className={`w-6 h-6 border-4 border-black flex items-center justify-center ${item.checked ? 'bg-black' : 'bg-white'}`}>
                    {item.checked && <Plus size={16} className="text-white rotate-45" />}
                  </div>
                  <div>
                    <p className={`font-black ${item.checked ? 'line-through' : ''}`}>{item.name}</p>
                    {item.price && <p className="text-xs font-bold text-gray-500">¥ {item.price}</p>}
                  </div>
                </div>
                <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyBuyBuyModal;