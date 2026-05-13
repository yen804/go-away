import React from 'react';

interface ItineraryModalProps {
  currentTrip: string;
  onClose: () => void;
  subModal: string | null;
  setSubModal: (id: string | null) => void;
  cardBase: React.CSSProperties;
}

export default function ItineraryModal({ 
  currentTrip, 
  onClose, 
  subModal, 
  setSubModal, 
  cardBase 
}: ItineraryModalProps) {
  
  const menuItems = [
    { id: 'flight', src: '/assets/flight_icon.png' },
    { id: 'map', src: '/assets/map_icon.png' },
    { id: 'vote', src: '/assets/vote_icon.png' },
    { id: 'daily', src: '/assets/daily_icon.png' },
    { id: 'transport', src: '/assets/transport_icon.png' },
    { id: 'hotel', src: '/assets/hotel_icon.png' }
  ];

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FF9933', zIndex: 100, overflowY: 'auto' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', padding: '20px' }}>
        <button onClick={onClose} style={{ ...cardBase, padding: '10px 24px', borderRadius: '15px', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>← 返回</button>
        <h2 style={{ fontSize: '32px', marginBottom: '30px', fontWeight: 'bold' }}>{currentTrip} 旅程總覽</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {menuItems.map(item => (
            <div key={item.id} onClick={() => setSubModal(item.id)} style={{ ...cardBase, borderRadius: '25px', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '150px' }}>
              <img src={item.src} alt={item.id} style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
            </div>
          ))}
        </div>
      </div>

      {/* 航班與票價子頁面 */}
      {subModal === 'flight' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FF9933', zIndex: 200, overflowY: 'auto' }}>
          <div style={{ maxWidth: '420px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => setSubModal(null)} style={{ ...cardBase, padding: '10px 24px', borderRadius: '15px', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>← 返回</button>
            
            {/* 機票卡片 */}
            <div style={{ ...cardBase, borderRadius: '30px', padding: '25px', backgroundColor: 'white' }}>
              <div style={{ borderBottom: '2px dashed black', marginBottom: '15px', paddingBottom: '10px' }}>
                <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>FLIGHT DETAILS</p>
                <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0' }}>{currentTrip} 機票資訊</h3>
              </div>
              
              <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                {/* 這裡未來可透過 Supabase 讀取 AppSheet 更新的資料 */}
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ color: '#888' }}>航班班次</span>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>待 AppSheet 填寫...</div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <span style={{ color: '#888' }}>行李數 / 票價</span>
                  <div style={{ fontSize: '20px', fontWeight: 'bold' }}>$ --- (待更新)</div>
                </div>
              </div>

              <a 
                href="https://www.appsheet.com/start/6a31ffaf-6bdb-4b55-af3f-1aa6be918736" 
                target="_blank" 
                rel="noreferrer"
                style={{ display: 'block', textAlign: 'center', backgroundColor: 'black', color: 'white', padding: '15px', borderRadius: '15px', textDecoration: 'none', fontWeight: 'bold', fontSize: '18px' }}
              >
                ➔ 查看票價明細
              </a>
            </div>
          </div>
        </div>
      )}

      {/* 其他功能子頁面 */}
      {subModal && subModal !== 'flight' && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FF9933', zIndex: 200, overflowY: 'auto' }}>
          <div style={{ maxWidth: '420px', margin: '0 auto', padding: '20px' }}>
            <button onClick={() => setSubModal(null)} style={{ ...cardBase, padding: '10px 24px', borderRadius: '15px', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>← 返回</button>
            <div style={{ ...cardBase, borderRadius: '25px', padding: '40px', textAlign: 'center' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>{subModal.toUpperCase()} 內容整理中...</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}