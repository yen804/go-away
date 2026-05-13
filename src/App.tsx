import React, { useState, useEffect, useCallback } from 'react';
import { Map, Heart, Luggage, Calculator as CalcIcon, ArrowRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// 子組件引入
import Calculator from './components/Calculator';
import PackingModal from './components/PackingModal';
import WishlistModal from './components/WishlistModal';
import DestinationModal from './components/DestinationModal';
import BuyBuyBuyModal from './components/BuyBuyBuyModal';
import ToolModal from './components/ToolModal';
import ItineraryModal from './components/Itinerary/ItineraryModal'; // 修正後的正確路徑

const supabase = createClient(
  'https://zjcdhfafehcbbiljevoi.supabase.co', 
  'sb_publishable_8f530wHsNhiv4O7JZ--O7Q_IolVAPyF'
);

const getDeviceLabel = () => {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "家人iPhone";
  if (/Android/i.test(ua)) return "家人Android";
  return "主控電腦";
};

export default function App() {
  const [trips, setTrips] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('travel_trips') || '["KYUSHU", "TAIWAN", "CHUPEI"]');
    } catch { return ["KYUSHU", "TAIWAN", "CHUPEI"]; }
  });
  
  const [currentTrip, setCurrentTrip] = useState(() => localStorage.getItem('current_trip') || 'KYUSHU');
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [subModal, setSubModal] = useState<string | null>(null);
  const [wishStats, setWishStats] = useState({ total: 0, todo: 0 });
  const [packingProgress, setPackingProgress] = useState(0);

  const fontStyle = { 
    fontFamily: 'MORITAD, "PingFang TC", "Hiragino Sans GB", "Heiti TC", "Microsoft JhengHei", sans-serif' 
  };

  const fetchLatestStatus = useCallback(async () => {
    if (!navigator.onLine) return;
    try {
      const { data, error } = await supabase
        .from('Go_Away')
        .select('name')
        .order('created_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        if (data[0].name !== currentTrip) {
          setCurrentTrip(data[0].name);
          localStorage.setItem('current_trip', data[0].name);
        }
      }
    } catch (e) { console.warn("同步失敗"); }
  }, [currentTrip]);

  const syncToCloud = async (tripName: string) => {
    if (!navigator.onLine) return;
    try {
      await supabase.from('Go_Away').insert([
        { name: tripName, category: '旅程切換', device: getDeviceLabel(), is_checked: false, created_at: new Date().toISOString() }
      ]);
    } catch (e) { console.error("雲端寫入失敗"); }
  };

  useEffect(() => {
    fetchLatestStatus();
    const interval = setInterval(fetchLatestStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchLatestStatus]);

  const updateAllStats = useCallback(() => {
    try {
      const wishRaw = localStorage.getItem('travel_buys');
      const wishAll = wishRaw ? JSON.parse(wishRaw) : [];
      if (Array.isArray(wishAll)) {
        const currentItems = wishAll.filter((i: any) => i.trip === currentTrip);
        setWishStats({ total: currentItems.length, todo: currentItems.length - currentItems.filter((i: any) => i.completed).length });
      }
      const packingRaw = localStorage.getItem(`packing_${currentTrip}`);
      const packingData = packingRaw ? JSON.parse(packingRaw) : [];
      if (Array.isArray(packingData)) {
        const packed = packingData.filter((i: any) => i.packed).length;
        setPackingProgress(packingData.length > 0 ? Math.round((packed / packingData.length) * 100) : 0);
      }
    } catch (e) { console.error("統計更新錯誤"); }
  }, [currentTrip]);

  useEffect(() => {
    localStorage.setItem('travel_trips', JSON.stringify(trips));
    updateAllStats();
  }, [trips, currentTrip, activeModal, updateAllStats]);

  const cardBase: React.CSSProperties = {
    backgroundColor: 'white', border: '4px solid black', boxShadow: '8px 8px 0px black', cursor: 'pointer', ...fontStyle
  };

  return (
    <div style={{ backgroundColor: '#FF9933', minHeight: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '20px 0', ...fontStyle, overflowX: 'hidden' }}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 20px' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '20px' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'inline-block', transform: 'rotate(-6deg)', transformOrigin: 'left bottom' }}>
              <span style={{ backgroundColor: 'black', color: 'white', fontSize: '18px', padding: '6px 16px', borderRadius: '12px', letterSpacing: '2px', fontWeight: 'bold' }}>
                離家出走計劃中
              </span>
            </div>
            <h1 style={{ fontSize: '64px', marginTop: '8px', marginBottom: '20px', lineHeight: 1, color: 'black', transform: 'rotate(-2deg)' }}>
              哈囉<br /><span style={{ display: 'block', marginTop: '15px' }}>{currentTrip}!</span>
            </h1>
            <button onClick={() => setActiveModal('destination')} style={{ ...cardBase, borderRadius: '25px', padding: '12px 24px', fontSize: '24px', fontWeight: 'bold', border: '5px solid black' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#3B82F6', borderRadius: '50%', display: 'inline-block', marginRight: '10px' }}></div>
              切換旅程
            </button>
          </div>
          <div onClick={() => setActiveModal('calc')} style={{ ...cardBase, padding: '15px', borderRadius: '25px', display: 'flex' }}>
            <CalcIcon size={32} strokeWidth={3} />
          </div>
        </div>

        {/* 行程主按鈕 */}
        <div onClick={() => setActiveModal('itinerary')} style={{ ...cardBase, borderRadius: '40px', padding: '25px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'rotate(1deg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: 'black', padding: '12px', borderRadius: '50%', display: 'flex' }}><Map color="white" size={32} /></div>
            <span style={{ fontSize: '32px', fontWeight: 'bold' }}>看行程</span>
          </div>
          <ArrowRight size={40} strokeWidth={4} />
        </div>

        {/* 功能 Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div onClick={() => setActiveModal('wish')} style={{ ...cardBase, borderRadius: '35px', padding: '20px', transform: 'rotate(-1.5deg)' }}>
            <Heart size={30} color="#EF4444" fill="#EF4444" />
            <p style={{ fontSize: '22px', margin: '10px 0 0 0', fontWeight: 'bold' }}>許願清單</p>
            <div style={{ fontSize: '14px', backgroundColor: 'black', color: 'white', padding: '2px 10px', borderRadius: '10px', marginTop: '8px', display: 'inline-block', fontWeight: '900' }}>
              {wishStats.todo} / {wishStats.total}
            </div>
          </div>
          <div onClick={() => setActiveModal('packing')} style={{ ...cardBase, borderRadius: '35px', padding: '20px', transform: 'rotate(1.2deg)' }}>
            <Luggage size={30} color="#3B82F6" />
            <p style={{ fontSize: '22px', margin: '10px 0 5px 0', fontWeight: 'bold' }}>行李檢查</p>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#EEE', border: '2px solid black', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${packingProgress}%`, height: '100%', backgroundColor: '#10B981' }}></div>
            </div>
          </div>
          <div onClick={() => setActiveModal('buy')} style={{ ...cardBase, borderRadius: '35px', padding: '20px', transform: 'rotate(1deg)' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold' }}>必買好物</p>
          </div>
          <div onClick={() => setActiveModal('tools')} style={{ ...cardBase, borderRadius: '35px', padding: '20px', transform: 'rotate(-1deg)' }}>
            <p style={{ fontSize: '22px', fontWeight: 'bold' }}>工具箱</p>
          </div>
        </div>

        {/* Modal 渲染 */}
        {activeModal === 'itinerary' && (
          <ItineraryModal 
            currentTrip={currentTrip} 
            onClose={() => setActiveModal(null)} 
            subModal={subModal} 
            setSubModal={setSubModal} 
            cardBase={cardBase} 
          />
        )}

        {activeModal === 'destination' && <DestinationModal trips={trips} currentTrip={currentTrip} onSelect={(d) => { setCurrentTrip(d); syncToCloud(d); setActiveModal(null); }} onAdd={(n) => setTrips([...trips, n])} onDelete={(t) => setTrips(trips.filter(x => x !== t))} onClose={() => setActiveModal(null)} />}
        {activeModal === 'calc' && <Calculator onClose={() => setActiveModal(null)} />}
        {activeModal === 'wish' && <WishlistModal currentTrip={currentTrip} onClose={() => { updateAllStats(); setActiveModal(null); }} />}
        {activeModal === 'packing' && <PackingModal currentTrip={currentTrip} onClose={() => { updateAllStats(); setActiveModal(null); }} />}
        {activeModal === 'buy' && <BuyBuyBuyModal isOpen={true} currentTrip={currentTrip} onClose={() => { updateAllStats(); setActiveModal(null); }} />}
        {activeModal === 'tools' && <ToolModal onClose={() => setActiveModal(null)} />}
      </div>
    </div>
  );
}