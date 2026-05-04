import React, { useState } from 'react';
import { X, Trash2 } from 'lucide-react';
import { theme } from '../theme';

// 內部的刪除確認彈窗組件
const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean, onConfirm: () => void, onCancel: () => void }) => {
  if (!isOpen) return null;
  
  const fontStyle = { fontFamily: 'MORITAD, sans-serif' };

  return (
    <div style={{ 
      position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', 
      alignItems: 'center', zIndex: 1100, backgroundColor: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)'
    }}>
      <div style={{ 
        backgroundColor: 'white', border: '5px solid black', borderRadius: '40px', 
        padding: '30px', width: '85%', maxWidth: '320px', boxShadow: '12px 12px 0px black', 
        textAlign: 'center', ...fontStyle 
      }}>
        {/* 標題：紅色的 OOPS! */}
        <h1 style={{ fontSize: '48px', color: '#FF4D4D', marginBottom: '10px', fontWeight: '900' }}>OOPS!</h1>
        
        {/* 文字內容 */}
        <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px', color: 'black' }}>確定不要了？</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* 確認按鈕：黑底白字 */}
          <button 
            onClick={onConfirm}
            style={{ 
              width: '100%', padding: '12px', backgroundColor: 'black', color: 'white', 
              borderRadius: '20px', border: '3px solid black', fontSize: '20px', 
              fontWeight: 'bold', cursor: 'pointer', ...fontStyle
            }}
          >
            確定
          </button>
          
          {/* 取消按鈕 */}
          <button 
            onClick={onCancel}
            style={{ 
              width: '100%', padding: '12px', backgroundColor: '#E5E7EB', color: 'black', 
              borderRadius: '20px', border: '3px solid black', fontSize: '20px', 
              fontWeight: 'bold', cursor: 'pointer', ...fontStyle
            }}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

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
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null); // 用於追蹤準備刪除的目標
  const fontStyle = { fontFamily: 'MORITAD, sans-serif' };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      onDelete(deleteTarget);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      <div style={{ 
        position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', 
        alignItems: 'center', zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)'
      }}>
        <div style={{ 
          backgroundColor: 'white', border: '6px solid black', borderRadius: '50px', 
          padding: '35px', width: '90%', maxWidth: '380px', boxShadow: '20px 20px 0px black', 
          textAlign: 'center', ...fontStyle 
        }}>
          {/* 關閉按鈕 */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '-20px', marginRight: '-10px' }}>
            <button onClick={onClose} style={{ cursor: 'pointer', border: 'none', background: 'none' }}>
              <X size={30} strokeWidth={3} />
            </button>
          </div>
          
          <h2 style={{ fontSize: '42px', marginBottom: '15px', marginTop: '-10px' }}>去哪裏玩？</h2>
          
          {/* 旅程列表 */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            {trips.map(t => (
              <div key={t} style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <button 
                  onClick={() => onSelect(t)} 
                  style={{ 
                    padding: '8px 18px', borderRadius: '15px', border: '3px solid black', 
                    cursor: 'pointer', fontSize: '18px', 
                    backgroundColor: currentTrip === t ? theme.colors.yellow : '#F0F0F0', 
                    boxShadow: currentTrip === t ? 'none' : '4px 4px 0px black',
                    fontWeight: 'bold', ...fontStyle
                  }}
                >
                  {t}
                </button>
                
                {t !== 'KYUSHU' && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(t); // 開啟自定義確認視窗
                    }}
                    style={{
                      position: 'absolute', top: '-8px', right: '-8px',
                      backgroundColor: '#FF4D4D', border: '2px solid black',
                      borderRadius: '50%', width: '24px', height: '24px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', boxShadow: '2px 2px 0px black'
                    }}
                  >
                    <Trash2 size={12} color="white" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'left', width: '100%', paddingLeft: '5px', marginBottom: '12px', marginTop: '-5px' }}>
            <div style={{ fontSize: '24px', fontWeight: '900', lineHeight: '1.2' }}>新增旅程</div>
            <div style={{ fontSize: '16px', color: '#444', fontWeight: 'bold' }}>切換旅程資料不會消失</div>
          </div>

          <input 
            type="text" 
            placeholder="新旅程..." 
            value={tempInput} 
            onChange={(e) => setTempInput(e.target.value)} 
            style={{ 
              width: '100%', padding: '15px', fontSize: '22px', border: '4px solid black', 
              borderRadius: '20px', marginBottom: '25px', textAlign: 'center', boxSizing: 'border-box',
              ...fontStyle 
            }} 
          />
          
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={() => {
                if (tempInput) {
                  const newDest = tempInput.toUpperCase();
                  onAdd(newDest);
                  onSelect(newDest);
                  setTempInput('');
                }
              }} 
              style={{ 
                flex: 1, padding: '15px', borderRadius: '20px', border: '4px solid black', 
                backgroundColor: 'black', color: 'white', fontSize: '20px', fontWeight: 'bold',
                cursor: 'pointer', ...fontStyle
              }}
            >
              出發！
            </button>
          </div>
        </div>
      </div>

      {/* 整合刪除確認彈窗 */}
      <DeleteConfirmModal 
        isOpen={!!deleteTarget}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};

export default DestinationModal;