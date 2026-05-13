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

// 初始化 Supabase
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
  // --- 狀態管理 ---
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
    fontFamily: 'MORITAD, "PingFang TC", "Hiragino Sans GB", "Heiti TC", "Microsoft JhengHei", sans-serif' 
  };

  const fetchLatestStatus = useCallback(async () => {
    if (!navigator.onLine) return;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); 
    try {
      const { data, error } = await supabase
        .from('Go_Away')
        .select('name')
        .order('created_at', { ascending: false })
        .limit(1)
        .abortSignal(controller.signal);
      if (!error && data && data.length > 0) {
        if (data[0].name !== currentTrip) {
          setCurrentTrip(data[0].name);
          localStorage.setItem('current_trip', data[0].name);
        }
      }
    } catch (e) { console.warn("同步超時"); } finally { clearTimeout(timeoutId); }
  }, [currentTrip]);

  const syncToCloud = async (tripName: string) => {
    if (!navigator.onLine) return;
    try {
      await supabase.from('Go_Away').insert([{ name: tripName, category: '旅程切換', device: getDeviceLabel(), is_checked: false, created_at: new Date().toISOString() }]);
    } catch (e) { console.error("雲端寫入失敗"); }
  };

  useEffect(() => {
    fetchLatestStatus();
    const interval = setInterval(() => fetchLatestStatus(), 5000);
    return () => clearInterval(interval);
  }, [fetchLatestStatus]);

  const handleTripChange = (dest: string) => {
    setCurrentTrip(dest);
    localStorage.setItem('current_trip', dest);
    syncToCloud(dest); 
    setActiveModal(null);
  };

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
    } catch (e) { console.error("統計資料讀取錯誤"); }
  };

  const cardBase: React.CSSProperties = {
    backgroundColor: 'white', border: '4px solid black', boxShadow: '8px 8px 0px black', cursor: 'pointer', ...fontStyle
  };

  return (
    <div style={{ backgroundColor: '#e2e8f0', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0', margin: '0', ...fontStyle }}>
      {/* 1. 電腦版版面固定容器 */}
      <div style={{ width: '100%', maxWidth: '420px', minHeight: '100vh', backgroundColor: '#FF9933', padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', boxShadow: '0 0 50px rgba(0,0,0,0.1)' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'inline-block', transform: 'rotate(-6deg)', transformOrigin: 'left bottom' }}>
              <span style={{ backgroundColor: 'black', color: 'white', fontSize: '18px', padding: '6px 16px', borderRadius: '12px', letterSpacing: '2px', fontWeight: 'bold' }}>離家出走計劃中</span>
            </div>
            <h1 style={{ fontSize: '64px', marginTop: '8px', marginBottom: '20px', lineHeight: 1, color: 'black', transform: 'rotate(-2deg)' }}>哈囉<br /><span style={{ display: 'block', marginTop: '15px' }}>{currentTrip}!</span></h1>
            <button onClick={() => setActiveModal('destination')} style={{ ...cardBase, borderRadius: '25px', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', fontWeight: 'bold', border: '5px solid black' }}>
              <div style={{ width: '14px', height: '14px', backgroundColor: '#3B82F6', borderRadius: '50%' }}></div>切換旅程
            </button>
          </div>
          <div onClick={() => setActiveModal('calc')} style={{ ...cardBase, padding: '15px', borderRadius: '25px', display: 'flex' }}><CalcIcon size={32} strokeWidth={3} /></div>
        </div>

        {/* 看行程主按鈕 */}
        <div onClick={() => setActiveModal('itinerary')} style={{ ...cardBase, borderRadius: '40px', padding: '25px 30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transform: 'rotate(1deg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ backgroundColor: 'black', padding: '12px', borderRadius: '50%', display: 'flex' }}><Map color="white" size={32} /></div>
            <span style={{ fontSize: '32px', fontWeight: 'bold' }}>看行程</span>
          </div>
          <ArrowRight size={40} strokeWidth={4} />
        </div>

        {/* 其餘原功能區塊 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div onClick={() => setActiveModal('wish')} style={{ ...cardBase, borderRadius: '35px', padding: '20px', transform: 'rotate(-1.5deg)' }}>
            <Heart size={30} color="#EF4444" fill="#EF4444" />
            <p style={{ fontSize: '22px', margin: '10px 0 0 0', fontWeight: 'bold' }}>許願清單</p>
            <div style={{ fontSize: '14px', backgroundColor: 'black', color: 'white', padding: '2px 10px', borderRadius: '10px', marginTop: '8px', display: 'inline-block', fontWeight: '900' }}>{wishStats.todo} / {wishStats.total}</div>
          </div>
          <div onClick={() => setActiveModal('packing')} style={{ ...cardBase, borderRadius: '35px', padding: '20px', transform: 'rotate(1.2deg)' }}>
            <Luggage size={30} color="#3B82F6" />
            <p style={{ fontSize: '22px', margin: '10px 0 5px 0', fontWeight: 'bold' }}>行李檢查</p>
            <div style={{ width: '100%', height: '8px', backgroundColor: '#EEE', border: '2px solid black', borderRadius: '5px', overflow: 'hidden' }}><div style={{ width: `${packingProgress}%`, height: '100%', backgroundColor: '#10B981' }}></div></div>
          </div>
          <div onClick={() => setActiveModal('buy')} style={{ ...cardBase, borderRadius: '35px', padding: '20px', transform: 'rotate(1deg)' }}>
            <ShoppingBag size={30} color="#F97316" />
            <p style={{ fontSize: '22px', margin: '10px 0 0 0', fontWeight: 'bold' }}>必買好物</p>
            <div style={{ fontSize: '14px', backgroundColor: 'black', color: 'white', padding: '2px 10px', borderRadius: '10px', marginTop: '8px', display: 'inline-block', fontWeight: '900' }}>{buyStats.todo} / {buyStats.total}</div>
          </div>
          <div onClick={() => setActiveModal('tools')} style={{ ...cardBase, borderRadius: '35px', padding: '20px', transform: 'rotate(-1deg)' }}>
            <Wrench size={30} color="#6B7280" />
            <p style={{ fontSize: '22px', marginTop: '10px', marginBottom: 0, fontWeight: 'bold' }}>工具箱</p>
          </div>
        </div>

        {/* 二層頁面：看行程 (6 個圖片按鈕) */}
        {activeModal === 'itinerary' && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, minHeight: '100vh', backgroundColor: 'white', zIndex: 100, padding: '20px', ...fontStyle }}>
            <button onClick={() => setActiveModal(null)} style={{ ...cardBase, padding: '10px 20px', borderRadius: '15px', marginBottom: '20px' }}>← 返回</button>
            <h2 style={{ fontSize: '32px', marginBottom: '30px', fontWeight: '900' }}>{currentTrip} 旅程總覽</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {[
                { name: '航班 & 票價', img: './assets/flight_icon.png', key: 'flight' },
                { name: '旅程地圖', img: './assets/map_icon.png', key: 'map' },
                { name: '行程票選', img: './assets/vote_icon.png', key: 'vote' },
                { name: '每日行程', img: './assets/daily_icon.png', key: 'daily' },
                { name: '交通資訊', img: './assets/transport_icon.png', key: 'transport' },
                { name: '飯店資訊', img: './assets/hotel_icon.png', key: 'hotel' }
              ].map(item => (
                <div key={item.key} onClick={() => setSubModal(item.key)} style={{ cursor: 'pointer', textAlign: 'center' }}>
                  {/* 無外框、右下陰影的圖片按鈕 */}
                  <img src={item.img} alt={item.name} style={{ width: '100%', borderRadius: '20px', boxShadow: '6px 6px 15px rgba(0,0,0,0.1)' }} />
                  <div style={{ fontWeight: 'bold', marginTop: '8px', fontSize: '18px' }}>{item.name}</div>
                </div>
              ))}
            </div>

            {/* 三層頁面：航班頁面 */}
            {subModal === 'flight' && (
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, minHeight: '100vh', backgroundColor: '#F8F9FA', zIndex: 200, padding: '20px' }}>
                <button onClick={() => setSubModal(null)} style={{ ...cardBase, padding: '10px 20px', borderRadius: '15px', marginBottom: '20px' }}>← 返回模組</button>
                <h3 style={{ fontSize: '28px', marginBottom: '25px', fontWeight: '900' }}>✈️ 航班 & 票價</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* 去程機票卡 (帶陰影) */}
                  <div style={{ backgroundColor: 'white', border: '3px solid black', borderRadius: '25px', padding: '18px', boxShadow: '8px 8px 15px rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: '12px', color: '#666', borderBottom: '1px dashed #DDD', paddingBottom: '8px', marginBottom: '12px' }}>DEPARTURE - 2026/09/08</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: '900' }}>TPE</div><div style={{ fontSize: '12px' }}>桃園</div></div>
                      <div style={{ flex: 1, borderTop: '2px solid black', margin: '0 15px', position: 'relative' }}><span style={{ position: 'absolute', top: '-14px', left: '42%', fontSize: '20px' }}>✈️</span></div>
                      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: '900' }}>FUK</div><div style={{ fontSize: '12px' }}>福岡</div></div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold', color: '#FF9933', fontSize: '18px' }}>08:10 - 11:20 (BR106)</div>
                  </div>

                  {/* 回程機票卡 (帶陰影) */}
                  <div style={{ backgroundColor: 'white', border: '3px solid black', borderRadius: '25px', padding: '18px', boxShadow: '8px 8px 15px rgba(0,0,0,0.08)' }}>
                    <div style={{ fontSize: '12px', color: '#666', borderBottom: '1px dashed #DDD', paddingBottom: '8px', marginBottom: '12px' }}>RETURN - 2026/09/12</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: '900' }}>FUK</div><div style={{ fontSize: '12px' }}>福岡</div></div>
                      <div style={{ flex: 1, borderTop: '2px solid black', margin: '0 15px', position: 'relative' }}><span style={{ position: 'absolute', top: '-14px', left: '42%', fontSize: '20px', transform: 'scaleX(-1)' }}>✈️</span></div>
                      <div style={{ textAlign: 'center' }}><div style={{ fontSize: '28px', fontWeight: '900' }}>TPE</div><div style={{ fontSize: '12px' }}>桃園</div></div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '15px', fontWeight: 'bold', color: '#FF9933', fontSize: '18px' }}>12:20 - 13:45 (BR105)</div>
                  </div>
                  
                  <button onClick={() => window.open('YOUR_APPSHEET_URL', '_blank')} style={{ ...cardBase, backgroundColor: 'black', color: 'white', padding: '20px', borderRadius: '25px', fontSize: '22px', fontWeight: 'bold' }}>
                    📊 查看票價明細
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 其他 Modal 渲染 */}
        {activeModal === 'destination' && <DestinationModal trips={trips} currentTrip={currentTrip} onSelect={handleTripChange} onAdd={(n) => setTrips([...trips, n])} onDelete={(t) => setTrips(trips.filter(x => x !== t))} onClose={() => setActiveModal(null)} />}
        {activeModal === 'calc' && <Calculator onClose={() => setActiveModal(null)} />}
        {activeModal === 'wish' && <WishlistModal currentTrip={currentTrip} onClose={() => { updateAllStats(); setActiveModal(null); }} />}
        {activeModal === 'packing' && <PackingModal currentTrip={currentTrip} onClose={() => { updateAllStats(); setActiveModal(null); }} />}
        {activeModal === 'buy' && <BuyBuyBuyModal isOpen={true} currentTrip={currentTrip} onClose={() => { updateAllStats(); setActiveModal(null); }} />}
        {activeModal === 'tools' && <ToolModal onClose={() => setActiveModal(null)} />}
      </div>
    </div>
  );
}