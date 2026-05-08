import React, { useState, useEffect } from 'react';
import { Map, Heart, Luggage, ShoppingBag, Calculator as CalcIcon, ArrowRight, Wrench } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// 引入子組件 (請確保您的元件路徑正確)
import Calculator from './components/Calculator';
import PackingModal from './components/PackingModal';
import WishlistModal from './components/WishlistModal';
import DestinationModal from './components/DestinationModal';
import BuyBuyBuyModal from './components/BuyBuyBuyModal';
import ToolModal from './components/ToolModal';

// 初始化 Supabase
const supabase = createClient(
  'https://zjcdhfafehcbbiljevoi.supabase.co', 
  'sb_publishable_8f530wHsNhiv4O7JZ--O7Q_IolVAPyF'
);

// 辨識使用者設備
const getDeviceLabel = () => {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/i.test(ua)) return "家人iPhone";
  if (/Android/i.test(ua)) return "家人Android";
  return "主控電腦";
};

export default function App() {
  // --- 狀態管理 ---
  const [trips, setTrips] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('travel_trips') || '["KYUSHU", "TAIWAN"]');
    } catch { return ["KYUSHU", "TAIWAN"]; }
  });
  
  const [currentTrip, setCurrentTrip] = useState(() => localStorage.getItem('current_trip') || 'KYUSHU');
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const [wishStats, setWishStats] = useState({ total: 0, todo: 0 });
  const [buyStats, setBuyStats] = useState({ total: 0, todo: 0 });
  const [packingProgress, setPackingProgress] = useState(0);

  const fontStyle = { fontFamily: 'MORITAD, sans-serif' };

  // --- 核心同步邏輯 (離線防護強化) ---
  
  // 1. 從雲端抓取最新狀態 (接收端)
  const fetchLatestStatus = async () => {
    // 💡 離線檢查：若無網路，直接結束函式，不報錯也不等待
    if (!navigator.onLine) return;

    try {
      const { data, error } = await supabase
        .from('Go_Away')
        .select('name, device')
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.warn("同步讀取暫時失效 (可能是網路不穩):", error.message);
        return;
      }

      if (data && data.length > 0) {
        const lastAction = data[0];
        if (lastAction.name !== currentTrip) {
          console.log(`📡 同步：雲端最新旅程為 ${lastAction.name}`);
          setCurrentTrip(lastAction.name);
          localStorage.setItem('current_trip', lastAction.name);
        }
      }
    } catch (e) {
      // 捕捉網路超時或其他異常，確保 App 不崩潰
      console.warn("目前無法連線至雲端，維持本地模式運作。");
    }
  };

  // 2. 寫入雲端 (傳送端)
  const syncToCloud = async (tripName: string) => {
    if (!navigator.onLine) {
      console.log("離線狀態，略過雲端同步。");
      return;
    }

    try {
      const label = getDeviceLabel();
      const { error } = await supabase.from('Go_Away').insert([
        { 
          name: tripName, 
          category: '旅程切換', 
          device: label,
          is_checked: false // 確保符合資料庫 NOT NULL 限制
        }
      ]);

      if (error) {
        console.error("寫入雲端失敗:", error.message);
      }
    } catch (e) {
      console.error("執行寫入時發生連線異常");
    }
  };

  // --- 副作用處理 ---

  // 定時器：每 10 秒嘗試同步一次 (僅在有網時生效)
  useEffect(() => {
    fetchLatestStatus();
    const interval = setInterval(fetchLatestStatus, 10000);
    return () => clearInterval(interval);
  }, [currentTrip]);

  // 當手動切換旅程時
  const handleTripChange = (dest: string) => {
    setCurrentTrip(dest);
    localStorage.setItem('current_trip', dest);
    syncToCloud(dest); 
    setActiveModal(null);
  };

  // 數據統計更新 (讀取 LocalStorage)
  useEffect(() => {
    localStorage.setItem('travel_trips', JSON.stringify(trips));
    updateAllStats();
  }, [trips, currentTrip, activeModal]);

  const updateAllStats = () => {
    try {
      // 許願清單統計
      const wishRaw = localStorage.getItem('travel_buys');
      const wishAll = wishRaw ? JSON.parse(wishRaw) : [];
      if (Array.isArray(wishAll)) {
        const currentItems = wishAll.filter((i: any) => i.trip === currentTrip);
        const done = currentItems.filter((i: any) => i.completed).length;
        setWishStats({ total: currentItems.length, todo: currentItems.length - done });
      }

      // 必買好物統計
      const buyRaw = localStorage.getItem('buy_buy_buy_v10');
      const buyAll = buyRaw ? JSON.parse(buyRaw) : [];
      if (Array.isArray(buyAll)) {
        const currentItems = buyAll.filter((i: any) => i.trip === currentTrip);
        const done = currentItems.filter((i: any) => i.completed).length;
        setBuyStats({ total: currentItems.length, todo: currentItems.length - done });
      }

      // 行李進度統計
      const packingRaw = localStorage.getItem(`packing_${currentTrip}`);
      const packingData = packingRaw ? JSON.parse(packingRaw) : [];
      if (Array.isArray(packingData)) {
        const packed = packingData.filter((i: any) => i.packed).length;
        setPackingProgress(packingData.length > 0 ? Math.round((packed / packingData.length) * 100) : 0);
      }
    } catch (e) { console.error("數據統計異常", e); }
  };

  // --- UI 組件 ---
  const cardBase: React.CSSProperties = {
    backgroundColor: 'white', border: '4px solid black', boxShadow: '8px 8px 0px black', cursor: 'pointer', ...fontStyle
  };

  const StatBadge = ({ todo, total }: { todo: number, total: number }) => (
    <div style={{ fontSize: '14px', backgroundColor: 'black', color: 'white', padding: '2px 10px', borderRadius: '10px', marginTop: '8px', display: 'inline-block', fontWeight: '900' }}>
      {todo} / {total}
    </div>
  );

  return (
    <div style={{ backgroundColor: '#FF9933', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', ...fontStyle }}>
      <div style={{ width: '100%', maxWidth: '420px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* Header 區塊 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'inline-block', transform: 'rotate(-6deg)', transformOrigin: 'left bottom' }}>
              <span style={{ backgroundColor: 'black', color: 'white', fontSize: '18px', padding: '6px 16px', borderRadius: '12px', letterSpacing: '2px', fontWeight: 'bold' }}>
                離家出走計劃中
              </span>
            </div>
            <h1 style={{ fontSize: '64px', marginTop: '8px', marginBottom: '20px', lineHeight: 1, color: 'black', transform: 'rotate(-2deg)' }}>
              哈囉<br /><span style={{ display: 'block', marginTop: '15px' }}>{currentTrip}!</span>
            </h1>
            <button onClick={() => setActiveModal('destination')} style={{ ...cardBase, borderRadius: '25px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: 'bold', border: '5px solid black' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#3B82F6', borderRadius: '50%' }}></div>
              切換旅程
            </button>
          </div>
          <div onClick={() => setActiveModal('calc')} style={{ ...cardBase, padding: '15px', borderRadius: '25px', display: 'flex' }}>
            <CalcIcon size={32} strokeWidth={3} />
          </div>
        </div>

        {/* 行程按鈕 (未來改裝重點) */}
        <div style={{ ...cardBase, borderRadius: '40px', padding: '25px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'rotate(1deg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: 'black', padding: '12px', borderRadius: '50%', display: 'flex' }}><Map color="white" size={32} /></div>
            <span style={{ fontSize: '32px', fontWeight: 'bold' }}>看行程</span>
          </div>
          <ArrowRight size={40} strokeWidth={4} />
        </div>

        {/* 功能網格 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div onClick={() => setActiveModal('wish')} style={{ ...cardBase, borderRadius: '35px', padding: '20px', transform: 'rotate(-1.5deg)' }}>
            <Heart size={30} color="#EF4444" fill="#EF4444" />
            <p style={{ fontSize: '22px', margin: '10px 0 0 0', fontWeight: 'bold' }}>許願清單</p>
            <StatBadge todo={wishStats.todo} total={wishStats.total} />
          </div>

          <div onClick={() => setActiveModal('packing')} style={{ ...cardBase, borderRadius: '35px', padding: '20px', transform: 'rotate(1.2deg)' }}>
            <Luggage size={30} color="#3B82F6" />
            <p style={{ fontSize: '22px', margin: '10px 0 5px 0', fontWeight: 'bold' }}>行李檢查</p>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#EEE', border: '2px solid black', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{ width: `${packingProgress}%`, height: '100%', backgroundColor: '#10B981' }}></div>
            </div>
            <span style={{ fontSize: '12px', fontWeight: 'bold', marginTop: '4px', display: 'block' }}>進度 {packingProgress}%</span>
          </div>

          <div onClick={() => setActiveModal('buy')} style={{ ...cardBase, borderRadius: '35px', padding: '20px', transform: 'rotate(1deg)' }}>
            <ShoppingBag size={30} color="#F97316" />
            <p style={{ fontSize: '22px', margin: '10px 0 0 0', fontWeight: 'bold' }}>必買好物</p>
            <StatBadge todo={buyStats.todo} total={buyStats.total} />
          </div>

          <div onClick={() => setActiveModal('tools')} style={{ ...cardBase, borderRadius: '35px', padding: '20px', transform: 'rotate(-1deg)' }}>
            <Wrench size={30} color="#6B7280" />
            <p style={{ fontSize: '22px', marginTop: '10px', marginBottom: 0, fontWeight: 'bold' }}>工具箱</p>
          </div>
        </div>
      </div>

      {/* 彈窗渲染 */}
      {activeModal === 'destination' && (
        <DestinationModal trips={trips} currentTrip={currentTrip} onSelect={handleTripChange} onAdd={(n) => setTrips([...trips, n])} onDelete={(t) => setTrips(trips.filter(x => x !== t))} onClose={() => setActiveModal(null)} />
      )}
      {activeModal === 'calc' && <Calculator onClose={() => setActiveModal(null)} />}
      {activeModal === 'wish' && <WishlistModal currentTrip={currentTrip} onClose={() => { updateAllStats(); setActiveModal(null); }} />}
      {activeModal === 'packing' && <PackingModal currentTrip={currentTrip} onClose={() => { updateAllStats(); setActiveModal(null); }} />}
      {activeModal === 'buy' && <BuyBuyBuyModal isOpen={true} currentTrip={currentTrip} onClose={() => { updateAllStats(); setActiveModal(null); }} />}
      {activeModal === 'tools' && <ToolModal onClose={() => setActiveModal(null)} />}
    </div>
  );
}