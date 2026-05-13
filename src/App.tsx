import React, { useState, useEffect, useCallback } from 'react';
import { Map, Heart, Luggage, ShoppingBag, Calculator as CalcIcon, ArrowRight, Wrench } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// 子組件引入
import Calculator from './components/Calculator';
import PackingModal from './components/PackingModal';
import WishlistModal from './components/WishlistModal';
import DestinationModal from './components/DestinationModal';
import BuyBuyBuyModal from './components/BuyBuyBuyModal';
import ToolModal from './components/ToolModal';

const supabase = createClient(
  'https://zjcdhfafehcbbiljevoi.supabase.co', 
  'sb_publishable_8f530wHsNhiv4O7JZ--O7Q_IolVAPyF'
);

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
  const [buyStats, setBuyStats] = useState({ total: 0, todo: 0 });
  const [packingProgress, setPackingProgress] = useState(0);

  const fontStyle = { 
    fontFamily: 'MORITAD, "PingFang TC", "Microsoft JhengHei", sans-serif' 
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

  useEffect(() => {
    fetchLatestStatus();
    const interval = setInterval(fetchLatestStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchLatestStatus]);

  useEffect(() => {
    localStorage.setItem('travel_trips', JSON.stringify(trips));
    updateAllStats();
  }, [trips, currentTrip, activeModal]);

  const updateAllStats = () => {
    try {
      const wishRaw = localStorage.getItem('travel_buys');
      const wishAll = wishRaw ? JSON.parse(wishRaw) : [];
      if (Array.isArray(wishAll)) {
        const currentItems = wishAll.filter((i: any) => i.trip === currentTrip);
        setWishStats({ total: currentItems.length, todo: currentItems.length - currentItems.filter((i: any) => i.completed).length });
      }
      const buyRaw = localStorage.getItem('buy_buy_buy_v10');
      const buyAll = buyRaw ? JSON.parse(buyRaw) : [];
      if (Array.isArray(buyAll)) {
        const currentItems = buyAll.filter((i: any) => i.trip === currentTrip);
        setBuyStats({ total: currentItems.length, todo: currentItems.length - currentItems.filter((i: any) => i.completed).length });
      }
      const packingRaw = localStorage.getItem(`packing_${currentTrip}`);
      const packingData = packingRaw ? JSON.parse(packingRaw) : [];
      if (Array.isArray(packingData)) {
        const packed = packingData.filter((i: any) => i.packed).length;
        setPackingProgress(packingData.length > 0 ? Math.round((packed / packingData.length) * 100) : 0);
      }
    } catch (e) { console.error("統計錯誤"); }
  };

  const handleTripChange = (dest: string) => {
    setCurrentTrip(dest);
    localStorage.setItem('current_trip', dest);
    setActiveModal(null);
  };

  const cardBase: React.CSSProperties = {
    backgroundColor: 'white', border: '4px solid black', boxShadow: '8px 8px 0px black', cursor: 'pointer', ...fontStyle
  };

  return (
    <div style={{ backgroundColor: '#e2e8f0', minHeight: '100vh', display: 'flex', justifyContent: 'center', ...fontStyle }}>
      <div style={{ width: '100%', maxWidth: '420px', minHeight: '100vh', backgroundColor: '#FF9933', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
        
        {/* 首頁 Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ transform: 'rotate(-6deg)' }}>
              <span style={{ backgroundColor: 'black', color: 'white', fontSize: '18px', padding: '6px 16px', borderRadius: '12px', fontWeight: 'bold' }}>離家出走計劃中</span>
            </div>
            <h1 style={{ fontSize: '64px', marginTop: '15px', color: 'black', lineHeight: 1 }}>哈囉<br />{currentTrip}!</h1>
            <button onClick={() => setActiveModal('destination')} style={{ ...cardBase, borderRadius: '25px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', fontWeight: 'bold' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#3B82F6', borderRadius: '50%' }}></div>切換旅程
            </button>
          </div>
          <div onClick={() => setActiveModal('calc')} style={{ ...cardBase, padding: '12px', borderRadius: '20px' }}><CalcIcon size={28} /></div>
        </div>

        {/* 看行程主按鈕 */}
        <div onClick={() => setActiveModal('itinerary')} style={{ ...cardBase, borderRadius: '40px', padding: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: 'black', padding: '10px', borderRadius: '50%' }}><Map color="white" size={30} /></div>
            <span style={{ fontSize: '32px', fontWeight: 'bold' }}>看行程</span>
          </div>
          <ArrowRight size={36} strokeWidth={3} />
        </div>

        {/* 功能網格 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div onClick={() => setActiveModal('wish')} style={{ ...cardBase, borderRadius: '30px', padding: '20px' }}>
            <Heart size={28} color="#EF4444" fill="#EF4444" />
            <p style={{ fontSize: '20px', marginTop: '10px', fontWeight: 'bold' }}>許願清單</p>
            <div style={{ backgroundColor: 'black', color: 'white', padding: '2px 8px', borderRadius: '8px', fontSize: '12px', display: 'inline-block' }}>{wishStats.todo} / {wishStats.total}</div>
          </div>
          <div onClick={() => setActiveModal('packing')} style={{ ...cardBase, borderRadius: '30px', padding: '20px' }}>
            <Luggage size={28} color="#3B82F6" />
            <p style={{ fontSize: '20px', marginTop: '10px', fontWeight: 'bold' }}>行李檢查</p>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#EEE', borderRadius: '3px', marginTop: '8px' }}>
              <div style={{ width: `${packingProgress}%`, height: '100%', backgroundColor: '#10B981' }}></div>
            </div>
          </div>
          <div onClick={() => setActiveModal('buy')} style={{ ...cardBase, borderRadius: '30px', padding: '20px' }}>
            <ShoppingBag size={28} color="#F97316" />
            <p style={{ fontSize: '20px', marginTop: '10px', fontWeight: 'bold' }}>必買好物</p>
            <div style={{ backgroundColor: 'black', color: 'white', padding: '2px 8px', borderRadius: '8px', fontSize: '12px', display: 'inline-block' }}>{buyStats.todo} / {buyStats.total}</div>
          </div>
          <div onClick={() => setActiveModal('tools')} style={{ ...cardBase, borderRadius: '30px', padding: '20px' }}>
            <Wrench size={28} color="#6B7280" />
            <p style={{ fontSize: '20px', marginTop: '10px', fontWeight: 'bold' }}>工具箱</p>
          </div>
        </div>

        {/* 二層 Modal: 看行程 */}
        {activeModal === 'itinerary' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, minHeight: '100vh', backgroundColor: '#FF9933', zIndex: 100, padding: '20px' }}>
            <button onClick={() => setActiveModal(null)} style={{ ...cardBase, padding: '8px 16px', borderRadius: '15px', marginBottom: '20px' }}>← 返回</button>
            <h2 style={{ fontSize: '32px', marginBottom: '30px', fontWeight: 'bold' }}>{currentTrip} 旅程總覽</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                { name: '航班 & 票價', img: '/assets/flight_icon.png', id: 'flight' },
                { name: '旅程地圖', img: '/assets/map_icon.png', id: 'map' },
                { name: '行程票選', img: '/assets/vote_icon.png', id: 'vote' },
                { name: '每日行程', img: '/assets/daily_icon.png', id: 'daily' },
                { name: '交通資訊', img: '/assets/transport_icon.png', id: 'transport' },
                { name: '飯店資訊', img: '/assets/hotel_icon.png', id: 'hotel' }
              ].map(item => (
                <div key={item.id} onClick={() => setSubModal(item.id)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  <img src={item.img} alt={item.name} style={{ width: '100%', filter: 'drop-shadow(4px 4px 6px rgba(0,0,0,0.2))' }} />
                  <div style={{ fontWeight: 'bold', marginTop: '8px', fontSize: '18px' }}>{item.name}</div>
                </div>
              ))}
            </div>

            {/* 三層 Modal: 航班細節 */}
            {subModal === 'flight' && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, minHeight: '100vh', backgroundColor: '#FF9933', zIndex: 200, padding: '20px' }}>
                <button onClick={() => setSubModal(null)} style={{ ...cardBase, padding: '8px 16px', borderRadius: '15px', marginBottom: '20px' }}>← 返回</button>
                <h3 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: 'bold' }}>✈️ 航班 & 票價</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {[
                    { type: 'DEPARTURE', date: '2026/09/08', from: 'TPE', to: 'FUK', fLoc: '桃園', tLoc: '福岡', time: '08:10 - 11:20', code: 'BR106', rev: false },
                    { type: 'RETURN', date: '2026/09/12', from: 'FUK', to: 'TPE', fLoc: '福岡', tLoc: '桃園', time: '12:20 - 13:45', code: 'BR105', rev: true }
                  ].map((f, i) => (
                    <div key={i} style={{ backgroundColor: 'white', border: '4px solid black', borderRadius: '25px', padding: '20px', boxShadow: '8px 8px 0px rgba(0,0,0,0.1)' }}>
                      <div style={{ fontSize: '13px', color: '#666', borderBottom: '2px dashed #ddd', paddingBottom: '8px', marginBottom: '12px' }}>{f.type} - {f.date}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '38px', fontWeight: '900' }}>{f.from}</div>
                          <div style={{ fontSize: '14px' }}>{f.fLoc}</div>
                        </div>
                        <div style={{ flex: 1, borderTop: '3px solid black', margin: '0 15px', position: 'relative' }}>
                          <span style={{ position: 'absolute', top: '-14px', left: '45%', fontSize: '20px', transform: f.rev ? 'scaleX(-1)' : 'none' }}>✈️</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: '38px', fontWeight: '900' }}>{f.to}</div>
                          <div style={{ fontSize: '14px' }}>{f.tLoc}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold', color: '#E67E22', fontSize: '22px' }}>
                        {f.time} <span style={{ fontSize: '16px', color: '#666' }}>({f.code})</span>
                      </div>
                    </div>
                  ))}
                  
                  <button onClick={() => window.open('https://your-appsheet-url.com', '_blank')} style={{ ...cardBase, backgroundColor: 'black', color: 'white', padding: '18px', borderRadius: '20px', fontSize: '22px', fontWeight: 'bold' }}>
                    📊 查看明細
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 其他基礎 Modal */}
        {activeModal === 'destination' && <DestinationModal trips={trips} currentTrip={currentTrip} onSelect={handleTripChange} onAdd={(n) => setTrips([...trips, n])} onDelete={(t) => setTrips(trips.filter(x => x !== t))} onClose={() => setActiveModal(null)} />}
        {activeModal === 'calc' && <Calculator onClose={() => setActiveModal(null)} />}
        {activeModal === 'wish' && <WishlistModal currentTrip={currentTrip} onClose={() => setActiveModal(null)} />}
        {activeModal === 'packing' && <PackingModal currentTrip={currentTrip} onClose={() => setActiveModal(null)} />}
        {activeModal === 'buy' && <BuyBuyBuyModal isOpen={true} currentTrip={currentTrip} onClose={() => setActiveModal(null)} />}
        {activeModal === 'tools' && <ToolModal onClose={() => setActiveModal(null)} />}
      </div>
    </div>
  );
}