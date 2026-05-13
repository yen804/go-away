import React from 'react';
import FlightSection from './FlightSection';
import VoteSection from './VoteSection';       // 新增
import TransportSection from './TransportSection'; // 新增
import HotelSection from './HotelSection';     // 新增

interface ItineraryModalProps {
  currentTrip: string;
  onClose: () => void;
  subModal: string | null;
  setSubModal: (id: string | null) => void;
  cardBase: React.CSSProperties;
}

export default function ItineraryModal({ currentTrip, onClose, subModal, setSubModal, cardBase }: ItineraryModalProps) {
  
  // 核心路由邏輯
  if (subModal === 'flight') {
    return <FlightSection currentTrip={currentTrip} onBack={() => setSubModal(null)} cardBase={cardBase} />;
  }
  if (subModal === 'vote') {
    return <VoteSection currentTrip={currentTrip} onBack={() => setSubModal(null)} cardBase={cardBase} />;
  }
  if (subModal === 'transport') {
    return <TransportSection currentTrip={currentTrip} onBack={() => setSubModal(null)} cardBase={cardBase} />;
  }
  if (subModal === 'hotel') {
    return <HotelSection currentTrip={currentTrip} onBack={() => setSubModal(null)} cardBase={cardBase} />;
  }

  // 原始的 6 個按鈕圖層列表
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
    </div>
  );
}