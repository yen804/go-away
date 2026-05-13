import React, { useState, useEffect, useCallback } from 'react';
import { Map, Heart, Luggage, ShoppingBag, Calculator as CalcIcon, ArrowRight, Wrench } from 'lucide-react';

// 子組件引入 (假設路徑不變)
import Calculator from './components/Calculator';
import PackingModal from './components/PackingModal';
import WishlistModal from './components/WishlistModal';
import DestinationModal from './components/DestinationModal';
import BuyBuyBuyModal from './components/BuyBuyBuyModal';
import ToolModal from './components/ToolModal';

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
    fontFamily: '"PingFang TC", "Microsoft JhengHei", sans-serif' 
  };

  const updateAllStats = useCallback(() => {
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
  }, [currentTrip]);

  useEffect(() => {
    localStorage.setItem('travel_trips', JSON.stringify(trips));
    updateAllStats();
  }, [trips, currentTrip, activeModal, updateAllStats]);

  // 通用卡片與按鈕樣式
  const cardBase: React.CSSProperties = {
    backgroundColor: 'white', border: '4px solid black', boxShadow: '6px 6px 0px black', cursor: 'pointer', ...fontStyle
  };

  // 文字放大 20% 樣式
  const enlargedTextStyle = { fontSize: '24px', fontWeight: 'bold' };

  return (
    <div style={{ backgroundColor: '#e2e8f0', minHeight: '100vh', display: 'flex', justifyContent: 'center', ...fontStyle }}>
      <div style={{ width: '100%', maxWidth: '420px', minHeight: '100vh', backgroundColor: '#FF9933', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ transform: 'rotate(-6deg)' }}>
              <span style={{ backgroundColor: 'black', color: 'white', fontSize: '18px', padding: '6px 16px', borderRadius: '12px', fontWeight: 'bold' }}>離家出走計劃中</span>
            </div>
            <h1 style={{ fontSize: '64px', marginTop: '15px', color: 'black', lineHeight: 1 }}>哈囉<br />{currentTrip}!</h1>
            {/* 1. 切換旅程文字放大 20% */}
            <button onClick={() => setActiveModal('destination')} style={{ ...cardBase, borderRadius: '25px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px', ...enlargedTextStyle }}>
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

        {/* 功能網格 (主頁面) */}
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

        {/* 行程總覽 Modal */}
        {activeModal === 'itinerary' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, minHeight: '100vh', backgroundColor: '#FF9933', zIndex: 100, padding: '20px' }}>
            {/* 1. 返回文字放大 20% */}
            <button onClick={() => setActiveModal(null)} style={{ ...cardBase, padding: '10px 20px', borderRadius: '15px', marginBottom: '20px', ...enlargedTextStyle }}>← 返回</button>
            <h2 style={{ fontSize: '32px', marginBottom: '30px', fontWeight: 'bold' }}>{currentTrip} 旅程總覽</h2>
            
            {/* 2. 6 個按鈕改回圓角黑框白底，拿掉說明文字 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              {[
                { id: 'flight', img: '/assets/flight_icon.png' },
                { id: 'map', img: '/assets/map_icon.png' },
                { id: 'vote', img: '/assets/vote_icon.png' },
                { id: 'daily', img: '/assets/daily_icon.png' },
                { id: 'transport', img: '/assets/transport_icon.png' },
                { id: 'hotel', img: '/assets/hotel_icon.png' }
              ].map(item => (
                <div key={item.id} onClick={() => setSubModal(item.id)} style={{ ...cardBase, borderRadius: '25px', padding: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '140px' }}>
                  <img src={item.img} alt={item.id} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
                  {/* 說明文字已移除 */}
                </div>
              ))}
            </div>

            {/* 航班細節 (範例) */}
            {subModal === 'flight' && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, minHeight: '100vh', backgroundColor: '#FF9933', zIndex: 200, padding: '20px' }}>
                <button onClick={() => setSubModal(null)} style={{ ...cardBase, padding: '10px 20px', borderRadius: '15px', marginBottom: '20px', ...enlargedTextStyle }}>← 返回</button>
                <h3 style={{ fontSize: '28px', marginBottom: '20px', fontWeight: 'bold' }}>✈️ 航班資訊</h3>
                <div style={{ backgroundColor: 'white', border: '4px solid black', borderRadius: '25px', padding: '20px' }}>
                  <p>載入中...</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 其他基礎彈窗 */}
        {activeModal === 'destination' && <DestinationModal trips={trips} currentTrip={currentTrip} onSelect={(dest) => { setCurrentTrip(dest); setActiveModal(null); }} onAdd={(n) => setTrips([...trips, n])} onDelete={(t) => setTrips(trips.filter(x => x !== t))} onClose={() => setActiveModal(null)} />}
        {activeModal === 'calc' && <Calculator onClose={() => setActiveModal(null)} />}
        {activeModal === 'wish' && <WishlistModal currentTrip={currentTrip} onClose={() => setActiveModal(null)} />}
        {activeModal === 'packing' && <PackingModal currentTrip={currentTrip} onClose={() => setActiveModal(null)} />}
        {activeModal === 'buy' && <BuyBuyBuyModal isOpen={true} currentTrip={currentTrip} onClose={() => setActiveModal(null)} />}
        {activeModal === 'tools' && <ToolModal onClose={() => setActiveModal(null)} />}
      </div>
    </div>
  );
}