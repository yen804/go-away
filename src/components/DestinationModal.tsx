import { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { theme } from '../theme';

interface Props {
  trips: string[];
  currentTrip: string;
  onSelect: (dest: string) => void;
  onAdd: (newDest: string) => void;
  onDelete: (dest: string) => void;
  onClose: () => void;
}

const DestinationModal = ({ trips, currentTrip, onSelect, onAdd, onDelete, onClose }: Props) => {
  const [tempInput, setTempInput] = useState('');
  const fontStyle = { fontFamily: theme.font.family };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
      <div style={{ backgroundColor: 'white', border: '6px solid black', borderRadius: '50px', padding: '35px', width: '90%', maxWidth: '380px', boxShadow: '20px 20px 0px black', textAlign: 'center', ...fontStyle, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-20px', marginRight: '-10px' }}>
          <button onClick={onClose} style={{ cursor: 'pointer', border: 'none', background: 'none' }}><X size={30} strokeWidth={3} /></button>
        </div>
        <h2 style={{ fontSize: '42px', marginBottom: '15px', marginTop: '-10px' }}>去哪裏玩？</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
          {trips.map(t => (
            <div key={t} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <button onClick={() => onSelect(t)} style={{ padding: '8px 18px', borderRadius: '15px', border: '3px solid black', cursor: 'pointer', fontSize: '18px', backgroundColor: currentTrip === t ? theme.colors.yellow : '#F0F0F0', boxShadow: currentTrip === t ? 'none' : '4px 4px 0px black', fontWeight: 'bold', ...fontStyle }}>{t}</button>
              {t !== 'KYUSHU' && (
                <button onClick={(e) => { e.stopPropagation(); if(window.confirm(`確定要刪除「${t}」嗎？`)) onDelete(t); }} style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#FF4D4D', border: '2px solid black', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '2px 2px 0px black' }}><Trash2 size={12} color="white" /></button>
              )}
            </div>
          ))}
        </div>
        <input type="text" placeholder="新旅程..." value={tempInput} onChange={(e) => setTempInput(e.target.value)} style={{ width: '100%', padding: '15px', fontSize: '22px', border: '4px solid black', borderRadius: '20px', marginBottom: '15px', textAlign: 'center', boxSizing: 'border-box', ...fontStyle }} />
        <button onClick={() => { if (tempInput) { const newDest = tempInput.toUpperCase(); onAdd(newDest); onSelect(newDest); setTempInput(''); } }} style={{ width: '100%', padding: '15px', borderRadius: '20px', border: '4px solid black', backgroundColor: 'black', color: 'white', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', ...fontStyle }}>出發！</button>
      </div>
    </div>
  );
};

export default DestinationModal;