import { useState, useEffect } from 'react';
import { X, CheckCircle, Circle, PlusCircle, ListPlus } from 'lucide-react';

interface Props {
  onClose: () => void;
  currentTrip: string;
}

// 內部刪除確認組件
const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel }: { isOpen: boolean, onConfirm: () => void, onCancel: () => void }) => {
  if (!isOpen) return null;
  const style = { fontFamily: 'MORITAD' };
  return (
    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px', zIndex: 2300 }}>
      <div style={{ backgroundColor: 'white', border: '5px solid black', borderRadius: '35px', width: '100%', padding: '30px', textAlign: 'center', boxShadow: '12px 12px 0px black', ...style }}>
        <h2 style={{ fontSize: '53px', color: '#EF4444', fontWeight: '900', marginBottom: '10px', letterSpacing: '2px' }}>OOPS!</h2>
        <p style={{ fontSize: '26px', fontWeight: 'bold', marginBottom: '25px', color: 'black' }}>確定不要了？</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button 
            onClick={onConfirm} 
            style={{ width: '100%', padding: '15px', backgroundColor: 'black', color: 'white', border: '3px solid black', borderRadius: '20px', fontSize: '24px', fontWeight: '900', cursor: 'pointer', ...style }}
          >
            確定
          </button>
          <button 
            onClick={onCancel} 
            style={{ width: '100%', padding: '15px', backgroundColor: '#E5E7EB', color: 'black', border: '3px solid black', borderRadius: '20px', fontSize: '24px', fontWeight: '900', cursor: 'pointer', ...style }}
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

const PackingModal: React.FC<Props> = ({ onClose, currentTrip }) => {
  const defaultItems = [
    { id: 1, text: '手機 / 藍牙耳機', packed: false, cat: '隨身行李' },
    { id: 2, text: '錢包 (少量台幣 / 外幣 / 信用卡)', packed: false, cat: '隨身行李' },
    { id: 3, text: '護照 (效期 > 6個月)', packed: false, cat: '隨身行李' },
    { id: 4, text: '證件 (身分證 / 健保卡)', packed: false, cat: '隨身行李' },
    { id: 5, text: '機票 / 簽證 / 飯店單據', packed: false, cat: '隨身行李' },
    { id: 6, text: 'eSIM / WiFi 機', packed: false, cat: '隨身行李' },
    { id: 7, text: '少量藥品 (處方藥，需攜帶醫師處方箋)', packed: false, cat: '隨身行李' },
    { id: 8, text: '防曬品 / 墨鏡 / 濕紙巾 / 口罩 (依天數)', packed: false, cat: '隨身行李' },
    { id: 9, text: '行動電源 (Wh 電池容量、數量依各航空公司規定)', packed: false, cat: '隨身行李' },
    { id: 10, text: '筆電 / 平板 / 相機 / Switch', packed: false, cat: '手提行李' },
    { id: 11, text: '電動牙刷', packed: false, cat: '手提行李' },
    { id: 12, text: '帽子 / 防曬外套 / 禦寒外套 (依天氣)', packed: false, cat: '手提行李' },
    { id: 13, text: '< 100ml 液體 ( 總容量 < 1L;須裝在 20x20cm 可密封透明塑膠袋內 )', packed: false, cat: '手提行李' },
    { id: 14, text: '其他 (貴重珠寶 / 易碎品)', packed: false, cat: '手提行李' },
    { id: 15, text: '換洗衣物 (依天數)', packed: false, cat: '托運行李' },
    { id: 16, text: '鞋子 (拖鞋 / 便鞋)', packed: false, cat: '托運行李' },
    { id: 17, text: '保養品 / 防曬 / 化妝品', packed: false, cat: '托運行李' },
    { id: 18, text: '衛生用品 (牙膏 / 毛巾 / 刮鬍刀)', packed: false, cat: '托運行李' },
    { id: 19, text: '生理用品 (衛生棉 / 衛生棉條 / 月亮碟片)', packed: false, cat: '托運行李' },
    { id: 20, text: '常備藥品 (止痛 / 腸胃 / 感冒)', packed: false, cat: '托運行李' },
    { id: 21, text: '> 100ml 液體 (洗髮精 / 沐浴乳 / 大瓶噴霧 / 酒類)', packed: false, cat: '托運行李' },
    { id: 22, text: '雨傘 / 腳架 / 自拍棒 (收合後 > 60cm)', packed: false, cat: '托運行李' },
    { id: 23, text: '尖銳物品 (任何刀具皆須托運)', packed: false, cat: '托運行李' },
    { id: 24, text: '充電線 / 充電器 / 萬用轉接頭', packed: false, cat: '手提 / 托運' },
    { id: 25, text: '吹風機 / 離子夾 (有線款)', packed: false, cat: '手提 / 托運' },
  ];

  const categories = ['隨身行李', '手提行李', '托運行李', '手提 / 托運'];
  // 字體放大 10% (基礎 1.1倍)
  const globalStyle = { fontFamily: 'MORITAD' };

  const [items, setItems] = useState<any[]>(() => {
    const saved = localStorage.getItem(`packing_${currentTrip}`);
    return saved ? JSON.parse(saved) : [];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null); // 新增刪除目標狀態
  const [newItemName, setNewItemName] = useState('');
  const [newCat] = useState('隨身行李');

  useEffect(() => {
    localStorage.setItem(`packing_${currentTrip}`, JSON.stringify(items));
  }, [items, currentTrip]);

  const importLazyBag = () => {
    const existingTexts = items.map(i => i.text);
    const toAdd = defaultItems.filter(di => !existingTexts.includes(di.text));
    if (toAdd.length === 0) return;

    const newTotalList = [...items, ...toAdd].sort((a, b) => {
      const orderA = defaultItems.find(di => di.text === a.text)?.id || 999;
      const orderB = defaultItems.find(di => di.text === b.text)?.id || 999;
      return orderA - orderB;
    });
    setItems(newTotalList);
    setShowSuccess(true);
  };

  const toggleItem = (id: number) => setItems(items.map(i => i.id === id ? { ...i, packed: !i.packed } : i));
  const confirmDelete = () => {
    if (deleteTargetId !== null) {
      setItems(items.filter(i => i.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const progress = items.length > 0 ? Math.round((items.filter(i => i.packed).length / items.length) * 100) : 0;

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000, backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(5px)' }}>
      {/* 背景改為橘色 #FF9933 */}
      <div style={{ backgroundColor: '#FF9933', border: '6px solid black', borderRadius: '50px', width: '95%', maxWidth: '440px', height: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '20px 20px 0px black', position: 'relative', ...globalStyle }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px 25px 10px 25px' }}>
           <button onClick={onClose} style={{ cursor: 'pointer', border: '4px solid black', background: 'white', borderRadius: '50%', padding: '5px' }}><X size={26} strokeWidth={4} /></button>
           <h2 style={{ fontSize: '37.4px', margin: 0, fontWeight: '900', letterSpacing: '2px' }}>PACKING</h2>
           <div style={{ width: '40px' }}></div>
        </div>

        {/* 匯入按鈕 */}
        <div style={{ padding: '0 25px 10px 25px' }}>
          <button onClick={importLazyBag} style={{ width: '100%', backgroundColor: '#DBEAFE', color: 'black', border: '3px solid black', borderRadius: '15px', padding: '11px', fontSize: '19.8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer', boxShadow: '4px 4px 0px black', ...globalStyle }}>
            <ListPlus size={22} /> 行李懶人包 (一鍵匯入)
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{ padding: '0 25px 15px 25px' }}>
          <div style={{ backgroundColor: 'white', border: '4px solid black', borderRadius: '20px', padding: '13px 20px', boxShadow: '5px 5px 0px black' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '5px', fontSize: '18.7px' }}>
              <span>收納進度</span><span>{progress}%</span>
            </div>
            <div style={{ height: '16.5px', backgroundColor: '#EEE', border: '2px solid black', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${progress}%`, height: '100%', backgroundColor: '#10B981', transition: '0.3s' }}></div>
            </div>
          </div>
        </div>

        {/* List Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 100px 20px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '50px', color: '#333', fontSize: '19.8px', fontWeight: 'bold' }}>目前清單空空如也...<br/>點擊上方按鈕匯入懶人包吧！</div>
          ) : (
            categories.map(cat => {
              const catItems = items.filter(i => i.cat === cat);
              if (catItems.length === 0) return null;
              return (
                <div key={cat} style={{ marginBottom: '25px' }}>
                  <h3 style={{ fontSize: '20.9px', fontWeight: '900', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', borderBottom: '3px solid black', paddingBottom: '5px' }}>
                    {cat} 
                    <span style={{ fontSize: '14.3px', backgroundColor: 'black', color: 'white', padding: '2px 8px', borderRadius: '10px' }}>
                      {catItems.filter(i => i.packed).length}/{catItems.length}
                    </span>
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {catItems.map(item => (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: 'white', border: '3px solid black', borderRadius: '15px', padding: '13px', boxShadow: '4px 4px 0px black' }}>
                        <div onClick={() => toggleItem(item.id)} style={{ cursor: 'pointer' }}>
                          {item.packed ? <CheckCircle size={24} color="#10B981" fill="#10B981" /> : <Circle size={24} color="#DDD" />}
                        </div>
                        <span style={{ flex: 1, fontWeight: 'bold', textDecoration: item.packed ? 'line-through' : 'none', color: item.packed ? '#AAA' : 'black', fontSize: '17.6px' }}>{item.text}</span>
                        <button onClick={() => setDeleteTargetId(item.id)} style={{ color: '#BBB', border: 'none', background: 'none', cursor: 'pointer' }}><X size={18} /></button>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Button */}
        <div style={{ position: 'absolute', bottom: '25px', left: 0, right: 0, display: 'flex', justifyContent: 'center', pointerEvents: 'none' }}>
           <button onClick={() => setIsAdding(true)} style={{ pointerEvents: 'auto', backgroundColor: '#D1D5DB', color: 'black', border: '4px solid black', borderRadius: '50px', padding: '16px 66px', fontSize: '25.3px', fontWeight: '900', boxShadow: '0px 8px 0px black', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', ...globalStyle }}>
             <PlusCircle size={26} /> 加東西
           </button>
        </div>

        {/* 匯入成功視窗 */}
        {showSuccess && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '30px', zIndex: 2200 }}>
            <div style={{ backgroundColor: 'white', border: '5px solid black', borderRadius: '30px', width: '100%', padding: '30px', textAlign: 'center', boxShadow: '10px 10px 0px black', ...globalStyle }}>
              <h2 style={{ fontSize: '35.2px', color: '#EF4444', fontWeight: '900', marginBottom: '10px', letterSpacing: '2px' }}>OOPS!</h2>
              <p style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '25px' }}>預設清單匯入成功！</p>
              <button onClick={() => setShowSuccess(false)} style={{ width: '100%', padding: '13px', backgroundColor: 'black', color: 'white', border: 'none', borderRadius: '12px', fontSize: '22px', fontWeight: '900', cursor: 'pointer', ...globalStyle }}>
                OK
              </button>
            </div>
          </div>
        )}

        {/* 加東西彈窗 */}
        {isAdding && (
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: '44px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px', zIndex: 2100 }}>
            <div style={{ backgroundColor: 'white', border: '5px solid black', borderRadius: '35px', width: '100%', padding: '27px', boxShadow: '10px 10px 0px black', ...globalStyle }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '27.5px', fontWeight: '900', color: '#3B82F6' }}>ADD ITEM</span>
                <button onClick={() => setIsAdding(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={33} /></button>
              </div>
              <input value={newItemName} onChange={e => setNewItemName(e.target.value)} placeholder="物品名稱..." style={{ width: '100%', padding: '16.5px', border: '3px solid black', borderRadius: '15px', fontSize: '20.9px', marginBottom: '22px', boxSizing: 'border-box', ...globalStyle }} />
              <button 
                onClick={() => { 
                  if(!newItemName) return; 
                  setItems([...items, { id: Date.now(), text: newItemName, packed: false, cat: newCat }]); 
                  setNewItemName(''); 
                  setIsAdding(false); 
                }} 
                style={{ width: '100%', padding: '16.5px', backgroundColor: '#D1D5DB', color: 'black', border: '4px solid black', borderRadius: '15px', fontSize: '23.1px', fontWeight: '900', cursor: 'pointer', ...globalStyle }}
              >
                ADD ITEM
              </button>
            </div>
          </div>
        )}

        {/* 整合 DeleteConfirmModal */}
        <DeleteConfirmModal 
          isOpen={deleteTargetId !== null} 
          onConfirm={confirmDelete} 
          onCancel={() => setDeleteTargetId(null)} 
        />
      </div>
    </div>
  );
};

export default PackingModal;