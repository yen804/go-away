import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  MapPin, 
  ShoppingBag, 
  CheckCircle2, 
  Calendar,
  Globe
} from 'lucide-react';
import BuyBuyBuyModal from './components/BuyBuyBuyModal';
import DestinationModal from './components/DestinationModal';
import PackingModal from './components/PackingModal';

const INITIAL_TRIPS = ["9月北九州", "KYUSHU"];

function App() {
  const [activeTab, setActiveTab] = useState<'itinerary' | 'wishlist' | 'shopping' | 'packing'>('itinerary');
  const [trips, setTrips] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('travel_trips');
      return saved ? JSON.parse(saved) : INITIAL_TRIPS;
    } catch { return INITIAL_TRIPS; }
  });
  const [currentTrip, setCurrentTrip] = useState(() => localStorage.getItem('current_trip') || INITIAL_TRIPS[0]);
  const [showTripMenu, setShowTripMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem('travel_trips', JSON.stringify(trips));
    localStorage.setItem('current_trip', currentTrip);
  }, [trips, currentTrip]);

  const handleAddTrip = () => {
    const name = prompt('請輸入新旅程名稱：');
    if (name && !trips.includes(name)) {
      setTrips([...trips, name]);
      setCurrentTrip(name);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF9] pb-24">
      <header className="bg-white border-b-4 border-black p-6 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div className="relative">
            <button onClick={() => setShowTripMenu(!showTripMenu)} className="flex items-center gap-2 bg-[#FFD93D] border-4 border-black px-4 py-2 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <Globe size={20} /> {currentTrip}
            </button>
            {showTripMenu && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-20">
                {trips.map(trip => (
                  <button key={trip} onClick={() => { setCurrentTrip(trip); setShowTripMenu(false); }} className={`w-full text-left px-4 py-3 font-bold border-b-2 border-black last:border-b-0 hover:bg-[#FFD93D] ${currentTrip === trip ? 'bg-[#FFD93D]' : ''}`}>
                    {trip}
                  </button>
                ))}
                <button onClick={handleAddTrip} className="w-full text-left px-4 py-3 font-bold bg-black text-white flex items-center gap-2">
                  <Plus size={16} /> 新增旅程
                </button>
              </div>
            )}
          </div>
          <h1 className="text-2xl font-black italic">TRAVELER_v1</h1>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-8">
        {activeTab === 'itinerary' && (
          <div className="space-y-4">
            <div className="bg-[#FF6B6B] border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white">
              <h2 className="text-xl font-black flex items-center gap-2"><Calendar /> 旅程計畫</h2>
              <p className="mt-2 font-bold">快來規劃妳的北九州之旅！</p>
            </div>
            <div className="aspect-video bg-gray-100 border-4 border-black border-dashed flex items-center justify-center font-bold">地圖功能建置中...</div>
          </div>
        )}
        <DestinationModal />
        <PackingModal />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-4 z-10">
        <div className="max-w-md mx-auto flex justify-around">
          <NavButton active={activeTab === 'itinerary'} onClick={() => setActiveTab('itinerary')} icon={<MapPin />} label="地圖" />
          <NavButton active={activeTab === 'wishlist'} onClick={() => setActiveTab('wishlist')} icon={<Plus />} label="願望" />
          <NavButton active={activeTab === 'shopping'} onClick={() => setActiveTab('shopping')} icon={<ShoppingBag />} label="必買" />
          <NavButton active={activeTab === 'packing'} onClick={() => setActiveTab('packing')} icon={<CheckCircle2 />} label="行李" />
        </div>
      </nav>
    </div>
  );
}

function NavButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 p-2 ${active ? 'scale-110 text-[#FF6B6B]' : 'text-gray-400'}`}>
      {icon} <span className="text-xs font-black">{label}</span>
    </button>
  );
}

export default App;