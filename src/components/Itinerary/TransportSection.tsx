import React from 'react';

interface TransportSectionProps {
  currentTrip: string;
  onBack: () => void;
  cardBase: React.CSSProperties;
}

export default function TransportSection({ currentTrip, onBack, cardBase }: TransportSectionProps) {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: '#FF9933', zIndex: 200, overflowY: 'auto' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', padding: '20px' }}>
        <button onClick={onBack} style={{ ...cardBase, padding: '10px 24px', borderRadius: '15px', marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>← 返回</button>
        <div style={{ ...cardBase, borderRadius: '25px', padding: '40px', textAlign: 'center' }}>
          <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>🚗 {currentTrip} 交通資訊</h3>
          <p style={{ marginTop: '20px', color: '#666' }}>租車與交通票券整理中...</p>
        </div>
      </div>
    </div>
  );
}