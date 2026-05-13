import React from 'react';

interface FlightSectionProps {
  currentTrip: string;
  onBack: () => void;
  cardBase: React.CSSProperties;
}

export default function FlightSection({ currentTrip, onBack, cardBase }: FlightSectionProps) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FF9933', zIndex: 200, overflowY: 'auto' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', padding: '20px' }}>
        <button onClick={onBack} style={{ ...cardBase, padding: '10px 24px', borderRadius: '15px', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>← 返回</button>
        
        {/* 機票卡片 */}
        <div style={{ ...cardBase, borderRadius: '30px', padding: '25px', backgroundColor: 'white' }}>
          <div style={{ borderBottom: '2px dashed black', marginBottom: '15px', paddingBottom: '10px' }}>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>FLIGHT DETAILS</p>
            <h3 style={{ fontSize: '28px', fontWeight: 'bold', margin: '5px 0' }}>{currentTrip} 機票資訊</h3>
          </div>
          
          <div style={{ textAlign: 'left', marginBottom: '20px' }}>
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
  );
}