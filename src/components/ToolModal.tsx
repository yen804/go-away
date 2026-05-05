import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Plus, Trash2 } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  url: string;
  icon?: string;
}

interface ToolModalProps {
  onClose: () => void;
}

// 內部刪除確認組件
const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean, onConfirm: () => void, onCancel: () => void }) => {
  if (!isOpen) return null;
  const style = { fontFamily: 'MORITAD' };
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px', zIndex: 3000 }}>
      <div style={{ backgroundColor: 'white', border: '5px solid black', borderRadius: '35px', width: '100%', padding: '30px', textAlign: 'center', boxShadow: '12px 12px 0px black', ...style }}>
        <h2 style={{ fontSize: '50px', color: '#EF4444', fontWeight: '900', marginBottom: '10px', letterSpacing: '2px', ...style }}>OOPS!</h2>
        <p style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '25px', color: 'black', ...style }}>確定不要了？</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={onConfirm} 
            style={{ width: '100%', padding: '15px', backgroundColor: 'black', color: 'white', border: '3px solid black', borderRadius: '20px', fontSize: '22px', fontWeight: '900', cursor: 'pointer', ...style }}
          >
            確定
          </button>
          <button 
            onClick={onCancel} 
            style={{ width: '100%', padding: '15px', backgroundColor: '#E5E7EB', color: 'black', border: '3px solid black', borderRadius: '20px', fontSize: '22px', fontWeight: '900', cursor: 'pointer', ...style }}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

const ToolModal: React.FC<ToolModalProps> = ({ onClose }) => {
  const defaultTools: Tool[] = [
    { id: '1', name: 'Visit Japan Web', url: 'https://www.vjw.digital.go.jp/', icon: '🇯🇵' },
    { id: '2', name: 'Google Translate', url: 'https://translate.google.com/', icon: '🗣️' },
    { id: '3', name: '轉乘案內 (Jorudan)', url: 'https://www.jorudan.co.jp/', icon: '🚇' },
    { id: '4', name: '天氣預報 (Tenki.jp)', url: 'https://tenki.jp/', icon: '☁️' },
    { id: '5', name: '台灣銀行匯率', url: 'https://rate.bot.com.tw/xrt?Lang=zh-TW', icon: '⚖️' },
    { id: '6', name: 'Trip.com', url: 'https://tw.trip.com/', icon: '✈️' },
    { id: '7', name: 'Skyscanner', url: 'https://www.skyscanner.com.tw/', icon: '✈️' },
  ];

  const [tools, setTools] = useState<Tool[]>(() => {
    const saved = localStorage.getItem('user_tools');
    return saved ? JSON.parse(saved) : defaultTools;
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newToolName, setNewToolName] = useState('');
  const [newToolUrl, setNewToolUrl] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('user_tools', JSON.stringify(tools));
  }, [tools]);

  const globalStyle = { fontFamily: 'MORITAD' };

  const handleAddTool = () => {
    const trimmedName = newToolName.trim();
    const trimmedUrl = newToolUrl.trim();

    if (trimmedName && trimmedUrl) {
      let finalUrl = trimmedUrl;
      if (!/^https?:\/\//i.test(trimmedUrl)) {
        finalUrl = `https://${trimmedUrl}`;
      }

      const newTool: Tool = {
        id: Date.now().toString(),
        name: trimmedName,
        url: finalUrl,
        icon: '🔗'
      };
      
      setTools([...tools, newTool]);
      setNewToolName('');
      setNewToolUrl('');
      setIsAdding(false);
    }
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setTools(tools.filter(t => t.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)' }}>
      <div style={{ backgroundColor: '#FF9933', border: '6px solid black', borderRadius: '50px', width: '95%', maxWidth: '440px', height: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '20px 20px 0px black', position: 'relative', padding: '25px', boxSizing: 'border-box', ...globalStyle }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '40px', margin: 0, fontWeight: '900', ...globalStyle }}>TOOLS</h2>
          <button onClick={onClose} style={{ cursor: 'pointer', border: '3px solid black', background: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <X size={24} strokeWidth={4} />
          </button>
        </div>

        {/* 工具列表 */}
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', paddingRight: '5px' }}>
          {tools.map(tool => (
            <div key={tool.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <a 
                href={tool.url} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ flex: 1, textDecoration: 'none', color: 'black', display: 'flex', alignItems: 'center', gap: '15px', backgroundColor: 'white', border: '4px solid black', borderRadius: '20px', padding: '15px 20px', boxShadow: '6px 6px 0px black', cursor: 'pointer', ...globalStyle }}
              >
                <span style={{ fontSize: '24px' }}>{tool.icon}</span>
                <span style={{ fontSize: '20px', fontWeight: '900', flex: 1, ...globalStyle }}>{tool.name}</span>
                <ExternalLink size={20} color="#666" />
              </a>
              <button 
                onClick={() => setDeleteTargetId(tool.id)}
                style={{ backgroundColor: '#FF4D4D', border: '3px solid black', borderRadius: '12px', padding: '10px', cursor: 'pointer', boxShadow: '3px 3px 0px black' }}
              >
                <Trash2 size={18} color="white" />
              </button>
            </div>
          ))}
        </div>

        {/* 新增按鈕 */}
        <button 
          onClick={() => setIsAdding(true)}
          style={{ marginTop: '20px', width: '100%', backgroundColor: 'black', color: 'white', border: '4px solid black', borderRadius: '20px', padding: '15px', fontSize: '22px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', boxShadow: '0px 6px 0px #333', ...globalStyle }}
        >
          <Plus size={24} strokeWidth={4} /> 新增連結
        </button>

        {/* 新增連結彈窗 */}
        {isAdding && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', zIndex: 2100 }}>
            <div style={{ backgroundColor: 'white', border: '5px solid black', borderRadius: '35px', width: '100%', padding: '25px', boxShadow: '10px 10px 0px black', ...globalStyle }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '28px', fontWeight: '900', ...globalStyle }}>ADD LINK</span>
                <button onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={30} /></button>
              </div>
              <input 
                value={newToolName} 
                onChange={e => setNewToolName(e.target.value)} 
                placeholder="網站名稱 (例: 官方網站)" 
                style={{ width: '100%', padding: '15px', border: '3px solid black', borderRadius: '15px', fontSize: '18px', marginBottom: '15px', boxSizing: 'border-box', ...globalStyle }} 
              />
              <input 
                value={newToolUrl} 
                onChange={e => setNewToolUrl(e.target.value)} 
                placeholder="網址 (例: www.google.com)" 
                style={{ width: '100%', padding: '15px', border: '3px solid black', borderRadius: '15px', fontSize: '18px', marginBottom: '20px', boxSizing: 'border-box', ...globalStyle }} 
              />
              <button 
                onClick={handleAddTool}
                style={{ width: '100%', padding: '15px', backgroundColor: 'black', color: 'white', border: '4px solid black', borderRadius: '15px', fontSize: '22px', fontWeight: '900', cursor: 'pointer', ...globalStyle }}
              >
                儲存工具
              </button>
            </div>
          </div>
        )}

        <DeleteConfirmModal 
          isOpen={deleteTargetId !== null} 
          onConfirm={confirmDelete} 
          onCancel={() => setDeleteTargetId(null)} 
        />
      </div>
    </div>
  );
};

export default ToolModal;