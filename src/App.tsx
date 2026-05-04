import React, { useState, useEffect } from 'react';
import { Map, Heart, Luggage, ShoppingBag, Calculator as CalcIcon, ArrowRight, Wrench } from 'lucide-react';
import { theme } from './theme';

// 引入子組件
import Calculator from './components/Calculator';
import PackingModal from './components/PackingModal';
import WishlistModal from './components/WishlistModal';
import DestinationModal from './components/DestinationModal';
import BuyBuyBuyModal from './components/BuyBuyBuyModal';
import ToolModal from './components/ToolModal';

export default function App() {
  const [trips, setTrips] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('travel_trips') || '["KYUSHU"]');
    } catch { return ["KYUSHU"]; }
  });
  
  const [currentTrip, setCurrentTrip] = useState(() => localStorage.getItem('current_trip') || 'KYUSHU');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // 進度狀態
  const [wishStats, setWishStats] = useState({ total: 0, todo: 0 });
  const [buyStats, setBuyStats] = useState({ total: 0, todo: 0 });
  const [packingProgress, setPackingProgress] = useState(0);

  const fontStyle = { fontFamily: 'MORITAD, sans-serif' };

  // 當旅程切換或 Modal 關閉時，刷新數據
  useEffect(() => {
    localStorage.setItem('travel_trips', JSON.stringify(trips));
    localStorage.setItem('current_trip', currentTrip);
    updateAllStats();
  }, [trips, currentTrip, activeModal]);

  const updateAllStats = () => {
    try {
      // 1. 許願清單
      const wishRaw = localStorage.getItem('travel_buys');
      const wishAll = wishRaw ? JSON.parse(wishRaw) : [];
      if (Array.isArray(wishAll)) {
        const currentItems = wishAll.filter((i: any) => i.trip === currentTrip);
        const doneCount = currentItems.filter((i: any) => i.completed === true).length;
        setWishStats({ total: currentItems.length, todo: currentItems.length - doneCount });
      }

      // 2. 必買好物 (修正過濾邏輯)
      const buyRaw = localStorage.getItem('buy_buy_buy_v10');
      const buyAll = buyRaw ? JSON.parse(buyRaw) : [];
      if (Array.isArray(buyAll)) {
        const currentItems = buyAll.filter((i: any) => i.trip === currentTrip);
        const doneCount = currentItems.filter((i: any) => i.completed === true).length;
        setBuyStats({ total: currentItems.length, todo: currentItems.length - doneCount });
      }

      // 3. 行李檢查
      const packingRaw = localStorage.getItem(`packing_${currentTrip}`);
      const packingData = packingRaw ? JSON.parse(packingRaw) : [];
      if (Array.isArray(packingData)) {
        const packed = packingData.filter((i: any) => i.packed === true).length;
        setPackingProgress(packingData.length > 0 ? Math.round((packed / packingData.length) * 100) : 0);
      }
    } catch (e) {
      console.error("同步數據失敗:", e);
    }
  };

  const handleDeleteTrip = (tripToDelete: string) => {
    const updatedTrips = trips.filter(t => t !== tripToDelete);
    setTrips(updatedTrips);
    if (currentTrip === tripToDelete) {
      setCurrentTrip(updatedTrips[0] || 'KYUSHU');
    }
  };

  const cardBase: React.CSSProperties = {
    backgroundColor: 'white',
    border: '4px solid black',
    boxShadow: '8px 8px 0px black',
    cursor: 'pointer',
    ...fontStyle
  };

  const StatBadge = ({ todo, total }: { todo: number, total: number }) => (
    <div style={{ 
      fontSize: '14px', backgroundColor: 'black', color: 'white', 
      padding: '2px 10px', borderRadius: '10px', marginTop: '8px', 
      display: 'inline-block', fontWeight: '900' 
    }}>
      {todo} / {total}
    </div>
  );

  return (
    <div style={{ 
      backgroundColor: '#FF9933', minHeight: '100vh', display: 'flex', 
      justifyContent: 'center', alignItems: 'center', padding: '20px', ...fontStyle 
    }}>
      {/* 主容器：當 Modal 開啟時加上模糊或淡出效果 */}
      <div style={{ 
        width: '100%', maxWidth: '420px', display: 'flex', 
        flexDirection: 'column', gap: '20px', 
        opacity: activeModal ? 0 : 1, 
        visibility: activeModal ? 'hidden' : 'visible',
        transition: '0.3s' 
      }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'inline-block', transform: 'rotate(-6deg)', transformOrigin: 'left bottom' }}>
              <span style={{ backgroundColor: 'black', color: 'white', fontSize: '18px', padding: '6px 16px', borderRadius: '12px', letterSpacing: '2px', fontWeight: 'bold' }}>
                離家出走計畫中
              </span>
            </div>
            <h1 style={{ fontSize: '56px', marginTop: '8px', marginBottom: '20px', lineHeight: 1.1, color: 'black', transform: 'rotate(-2deg)' }}>
              哈囉<br /><span style={{ display: 'block', marginTop: '10px' }}>{currentTrip}!</span>
            </h1>
            <button 
              onClick={() => setActiveModal('destination')} 
              style={{ ...cardBase, borderRadius: '25px', padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '18px', fontWeight: 'bold' }}
            >
              <div style={{ width: '12px', height: '12px', backgroundColor: '#3B82F6', borderRadius: '50%' }}></div>
              切換旅程
            </button>
          </div>
          <div onClick={() => setActiveModal('calc')} style={{ ...cardBase, padding: '12px', borderRadius: '20px', display: 'flex' }}>
            <CalcIcon size={28} strokeWidth={3} />
          </div>
        </div>

        {/* 看行程卡片 */}
        <div style={{ ...cardBase, borderRadius: '35px', padding: '20px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'rotate(1deg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ backgroundColor: 'black', padding: '10px', borderRadius: '50%', display: 'flex' }}>
              <Map color="white" size={28} />
            </div>
            <span style={{ fontSize: '28px', fontWeight: 'bold' }}>看行程</span>
          </div>
          <ArrowRight size={32} strokeWidth={4} />
        </div>

        {/* 四格功能區塊 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div onClick={() => setActiveModal('wish')} style={{ ...cardBase, borderRadius: '30px', padding: '15px', transform: 'rotate(-1.5deg)' }}>
            <Heart size={28} color="#EF4444" fill="#EF4444" />
            <p style={{ fontSize: '20px', margin: '8px 0 0 0', fontWeight: 'bold' }}>許願清單</p>
            <StatBadge todo={wishStats.todo} total={wishStats.total} />
          </div>

          <div onClick={() => setActiveModal('packing')} style={{ ...cardBase, borderRadius: '30px', padding: '15px', transform: 'rotate(1.2deg)' }}>
            <Luggage size={28} color="#3B82F6" />
            <p style={{ fontSize: '20px', margin: '8px 0 5px 0', fontWeight: 'bold' }}>行李檢查</p>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#EEE', border: '2px solid black', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${packingProgress}%`, height: '100%', backgroundColor: '#10B981' }}></div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '4px', display: 'block' }}>{packingProgress}%</span>
          </div>

          <div onClick={() => setActiveModal('buy')} style={{ ...cardBase, borderRadius: '30px', padding: '15px', transform: 'rotate(1deg)' }}>
            <ShoppingBag size={28} color="#F97316" />
            <p style={{ fontSize: '20px', margin: '8px 0 0 0', fontWeight: 'bold' }}>必買好物</p>
            <StatBadge todo={buyStats.todo} total={buyStats.total} />
          </div>

          <div onClick={() => setActiveModal('tools')} style={{ ...cardBase, borderRadius: '30px', padding: '15px', transform: 'rotate(-1deg)' }}>
            <Wrench size={28} color="#6B7280" />
            <p style={{ fontSize: '20px', marginTop: '8px', marginBottom: 0, fontWeight: 'bold' }}>工具箱</p>
          </div>
        </div>
      </div>

      {/* 彈窗渲染 */}
      {activeModal === 'destination' && (
        <DestinationModal 
          trips={trips} 
          currentTrip={currentTrip} 
          onSelect={(dest) => { setCurrentTrip(dest); setActiveModal(null); }} 
          onAdd={(newDest) => setTrips([...trips, newDest])} 
          onDelete={handleDeleteTrip} 
          onClose={() => setActiveModal(null)} 
        />
      )}
      
      {activeModal === 'calc' && <Calculator onClose={() => setActiveModal(null)} />}
      
      {activeModal === 'wish' && (
        <WishlistModal 
          currentTrip={currentTrip} 
          onClose={() => { updateAllStats(); setActiveModal(null); }} 
        />
      )}
      
      {activeModal === 'packing' && (
        <PackingModal 
          currentTrip={currentTrip} 
          onClose={() => { updateAllStats(); setActiveModal(null); }} 
        />
      )}
      
      {activeModal === 'buy' && (
        <BuyBuyBuyModal 
          isOpen={true} 
          currentTrip={currentTrip} 
          onClose={() => { updateAllStats(); setActiveModal(null); }} 
        />
      )}
      
      {activeModal === 'tools' && <ToolModal onClose={() => setActiveModal(null)} />}
    </div>
  );
}