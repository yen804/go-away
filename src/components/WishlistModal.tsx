import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, ChevronLeft, MapPin, Clock, Calendar, Pencil, Trash2, ShoppingCart, CheckCircle2, Utensils, ShoppingBag, Globe } from 'lucide-react';

// 新增幣種定義
const currencyNames: { [key: string]: string } = {
  JPY: '日圓', KRW: '韓幣', USD: '美金', GBP: '英鎊', AUD: '澳幣',
  HKD: '港幣', VND: '越南幣', PHP: '披索', IDR: '印尼盾', CNY: '人民幣', SGD: '新幣', TWD: '台幣'
};

const DeleteConfirmModal = ({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) => (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 2000, 
    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', 
    justifyContent: 'center', alignItems: 'center'
  }}>
    <div style={{
      backgroundColor: 'white', width: '320px', borderRadius: '40px', 
      padding: '40px 20px', textAlign: 'center', border: '4px solid black',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px',
      boxShadow: '0px 10px 0px rgba(0,0,0,0.2)'
    }}>
      <div style={{ color: '#FF5A5A', fontSize: '42px', fontWeight: '900', fontFamily: 'MORITAD' }}>OOPS!</div>
      <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'black', fontFamily: 'MORITAD' }}>確定不要了？</div>
      <button 
        onClick={onConfirm}
        style={{
          width: '100%', backgroundColor: 'black', color: 'white', 
          borderRadius: '25px', padding: '15px', fontSize: '22px', 
          fontWeight: 'bold', border: 'none', cursor: 'pointer',
          fontFamily: 'MORITAD', marginTop: '10px'
        }}
      >
        OK
      </button>
      <div onClick={onCancel} style={{ fontSize: '16px', color: '#666', cursor: 'pointer', textDecoration: 'underline', fontFamily: 'MORITAD' }}>
        返回
      </div>
    </div>
  </div>
);

interface BuyItem {
  id: number;
  trip: string;
  itemName: string;
  quantity: number;
  location: string;
  link: string;
  price: string;
  currency: string;
  taxFreePrice: string;
  buyer: string;
  category: 'EAT' | 'BUY';
  image: string | null;
  completed: boolean;
  time1_start: string;
  time1_end: string;
  time2_start?: string;
  time2_end?: string;
  restDays: string[];
}

interface Props {
  currentTrip: string;
  onClose: () => void;
}

const WishListModal = ({ currentTrip, onClose }: Props) => {
  const [view, setView] = useState<'LIST' | 'ADD'>('LIST');
  const [items, setItems] = useState<BuyItem[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [location, setLocation] = useState('');
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('JPY - 日圓');
  const [taxFreePrice, setTaxFreePrice] = useState('');
  const [category, setCategory] = useState<'EAT' | 'BUY'>('BUY');
  const [image, setImage] = useState<string | null>(null);
  
  const [time1, setTime1] = useState({ start: '10:00', end: '20:00' });
  const [time2, setTime2] = useState({ start: '', end: '' });
  const [showTime2, setShowTime2] = useState(false);
  const [restDays, setRestDays] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  
  const globalStyle: React.CSSProperties = { fontFamily: 'MORITAD, sans-serif' };
  const COMPLETED_GRAY = '#D1D1D1';

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('travel_buys') || '[]');
    setItems(saved.filter((item: BuyItem) => item.trip === currentTrip));
  }, [currentTrip, view]);

  // 修正：有效的連結邏輯
  const handleLinkClick = (target: string) => {
    if (!target) return;
    if (target.startsWith('http')) {
      window.open(target, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target)}`, '_blank');
    }
  };

  const handleSave = () => {
    if (!itemName) return;
    const all = JSON.parse(localStorage.getItem('travel_buys') || '[]');
    const newItem: BuyItem = {
      id: editingId || Date.now(),
      trip: currentTrip,
      itemName, quantity, location, link, price, currency, taxFreePrice, category, image,
      buyer: 'Sherry.C',
      time1_start: time1.start,
      time1_end: time1.end,
      ...(showTime2 && { time2_start: time2.start, time2_end: time2.end }),
      restDays,
      completed: editingId ? (items.find(i => i.id === editingId)?.completed || false) : false
    };

    const updated = editingId ? all.map((i: any) => i.id === editingId ? newItem : i) : [...all, newItem];
    localStorage.setItem('travel_buys', JSON.stringify(updated));
    resetForm();
    setView('LIST');
  };

  const resetForm = () => {
    setEditingId(null); setItemName(''); setQuantity(1); setLocation(''); setLink(''); setPrice('');
    setTaxFreePrice(''); setCategory('BUY'); setImage(null); setRestDays([]);
    setTime1({ start: '10:00', end: '20:00' }); setTime2({ start: '', end: '' }); setShowTime2(false);
  };

  const handleEdit = (item: BuyItem) => {
    setEditingId(item.id); setItemName(item.itemName); setQuantity(item.quantity);
    setLocation(item.location); setLink(item.link); setPrice(item.price);
    setTaxFreePrice(item.taxFreePrice); setCategory(item.category || 'BUY'); setImage(item.image);
    setRestDays(item.restDays || []); setTime1({ start: item.time1_start, end: item.time1_end });
    if (item.time2_start) { setTime2({ start: item.time2_start, end: item.time2_end || '' }); setShowTime2(true); }
    setView('ADD');
  };

  const toggleComplete = (id: number) => {
    const all = JSON.parse(localStorage.getItem('travel_buys') || '[]');
    const updated = all.map((item: any) => item.id === id ? { ...item, completed: !item.completed } : item);
    localStorage.setItem('travel_buys', JSON.stringify(updated));
    setItems(updated.filter((item: any) => item.trip === currentTrip));
  };

  const renderListView = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', padding: '25px 20px 10px' }}>
        <button onClick={onClose} style={{ background: 'white', border: '4px solid black', borderRadius: '50%', width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0px black' }}>
          <ChevronLeft size={28} strokeWidth={3} />
        </button>
        <h2 style={{ flex: 1, textAlign: 'center', fontSize: '34px', fontWeight: '900', margin: 0, marginRight: '48px', ...globalStyle }}>WISH LIST</h2>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '10px 20px' }}>
        {items.map(item => (
          <div key={item.id} style={{ position: 'relative', marginBottom: '25px' }}>
            <div style={{ backgroundColor: item.completed ? COMPLETED_GRAY : 'white', border: '4px solid black', borderRadius: '40px', padding: '20px' }}>
              <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                <div onClick={() => toggleComplete(item.id)} style={{ width: '55px', height: '65px', backgroundColor: item.completed ? '#666' : '#F8F9FA', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid black', flexShrink: 0, cursor: 'pointer' }}>
                  {item.completed ? <CheckCircle2 color="white" size={24} /> : (item.category === 'EAT' ? <Utensils color="#FF5A5A" size={24} /> : <ShoppingBag color="#3B82F6" size={24} />)}
                </div>
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '24px', fontWeight: '900', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '4px', ...globalStyle }}>{item.itemName}</div>
                  
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'black', marginBottom: '4px', ...globalStyle }}>
                    {item.location || '未指定店家'}
                  </div>

                  <div 
                    onClick={() => handleLinkClick(item.link || item.location)}
                    style={{ fontSize: '15px', color: '#007AFF', display: 'flex', alignItems: 'flex-start', gap: '4px', marginBottom: '8px', cursor: 'pointer', textDecoration: 'underline', ...globalStyle }}
                  >
                    {item.link?.startsWith('http') ? <Globe size={16} /> : <MapPin size={16} />}
                    <span style={{ overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }}>
                      {item.link || '點擊開啟地址'}
                    </span>
                  </div>
                  
                  {/* 修正：營業時段左側對齊圖示邊緣 */}
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', marginLeft: '-70px', paddingLeft: '70px' }}>
                    <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#444', whiteSpace: 'nowrap', ...globalStyle }}>營業時段：</span>
                    <div style={{ display: 'flex', flexDirection: 'column', fontSize: '16px', fontWeight: 'bold', color: '#444', ...globalStyle }}>
                      <div>{item.time1_start} - {item.time1_end}</div>
                      {item.time2_start && <div>{item.time2_start} - {item.time2_end}</div>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
                  <div onClick={() => item.image && setPreviewImage(item.image)} style={{ width: '85px', height: '85px', border: '3px solid black', borderRadius: '15px', overflow: 'hidden', flexShrink: 0, cursor: item.image ? 'zoom-in' : 'default', backgroundColor: '#EEE' }}>
                    {item.image ? <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="wish" /> : null}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '14px', fontWeight: 'bold', color: '#444', ...globalStyle }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> 打烊: {item.time2_end || item.time1_end}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14}/> 休息: {item.restDays?.length > 0 ? item.restDays.join(',') : '無'}</div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '3px dashed #DDD', margin: '15px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '18px', fontWeight: '900', ...globalStyle }}>
                  數量 : {item.quantity}
                  <span style={{ marginLeft: '20px' }}>{item.currency.split(' ')[0]} {item.price}</span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#666', ...globalStyle }}>
                  {item.category === 'EAT' ? '美食清單' : '購物清單'}
                </div>
              </div>
            </div>

            <div style={{ position: 'absolute', right: '-12px', top: '15px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 10 }}>
              <button onClick={() => handleEdit(item)} style={{ background: 'white', border: '2px solid black', borderRadius: '10px', padding: '6px', boxShadow: '2px 2px 0px black' }}><Pencil size={18} /></button>
              <button onClick={() => setShowDeleteConfirm(item.id)} style={{ background: 'white', border: '2px solid black', borderRadius: '10px', padding: '6px', boxShadow: '2px 2px 0px black' }}><Trash2 size={18} color="red" /></button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '25px' }}>
        <button onClick={() => { resetForm(); setView('ADD'); }} style={{ width: '100%', backgroundColor: 'white', border: '5px solid black', borderRadius: '35px', padding: '18px', fontSize: '26px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0px 8px 0px black', ...globalStyle }}>
          <ShoppingCart fill="#FF5A5A" color="#FF5A5A" size={28} /> 新增項目
        </button>
      </div>
    </div>
  );

  const renderAddView = () => (
    <div style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', padding: '30px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: '#FF5A5A', fontSize: '30px', fontWeight: '900', ...globalStyle }}>WISH ITEM</h3>
        <X onClick={() => setView('LIST')} style={{ cursor: 'pointer' }} size={32} strokeWidth={3} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input style={{ ...inputStyle, ...globalStyle }} placeholder="商品名稱" value={itemName} onChange={e => setItemName(e.target.value)} />
        <input type="number" style={{ ...inputStyle, ...globalStyle }} placeholder="數量" value={quantity} onChange={e => setQuantity(Number(e.target.value))} />
        <input style={{ ...inputStyle, ...globalStyle }} placeholder="購買地點 / 店名" value={location} onChange={e => setLocation(e.target.value)} />
        <input style={{ ...inputStyle, ...globalStyle }} placeholder="地址 / 網頁連結" value={link} onChange={e => setLink(e.target.value)} />
        
        <div>
          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '8px', ...globalStyle }}>休息日:</div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            {days.map(d => (
              <div key={d} onClick={() => setRestDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])} 
                style={{ width: '38px', height: '38px', border: '3px solid black', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', backgroundColor: restDays.includes(d) ? 'black' : 'white', color: restDays.includes(d) ? 'white' : 'black', fontSize: '15px', ...globalStyle }}>
                {d}
              </div>
            ))}
          </div>
        </div>

        <div style={{ border: '3px solid black', borderRadius: '20px', padding: '15px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontWeight: 'bold', fontSize: '16px', ...globalStyle }}>
            <span>營業時段 1:</span>
            {!showTime2 && <button onClick={()=>setShowTime2(true)} style={{ background:'black', color:'white', border:'none', borderRadius:'8px', padding:'4px 10px', fontSize:'13px', ...globalStyle }}>+ 增加時段 2</button>}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input type="time" value={time1.start} onChange={e=>setTime1({...time1, start:e.target.value})} style={{ ...timeInputStyle, ...globalStyle }} />
            <input type="time" value={time1.end} onChange={e=>setTime1({...time1, end:e.target.value})} style={{ ...timeInputStyle, ...globalStyle }} />
          </div>
          {showTime2 && (
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input type="time" value={time2.start} onChange={e=>setTime2({...time2, start:e.target.value})} style={{ ...timeInputStyle, ...globalStyle }} />
              <input type="time" value={time2.end} onChange={e=>setTime2({...time2, end:e.target.value})} style={{ ...timeInputStyle, ...globalStyle }} />
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '15px' }}>
          <div onClick={() => setCategory('EAT')} style={{ ...catBtnStyle, backgroundColor: category === 'EAT' ? '#FFD64D' : 'white', ...globalStyle }}>
            <Utensils size={20} /> EAT
          </div>
          <div onClick={() => setCategory('BUY')} style={{ ...catBtnStyle, backgroundColor: category === 'BUY' ? '#FFD64D' : 'white', ...globalStyle }}>
            <ShoppingBag size={20} /> BUY
          </div>
        </div>

        <div onClick={() => fileInputRef.current?.click()} style={{ border: '3px dashed black', borderRadius: '15px', padding: '20px', textAlign: 'center', cursor: 'pointer' }}>
          <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={e => {
            const file = e.target.files?.[0];
            if(file){ const reader = new FileReader(); reader.onloadend = () => setImage(reader.result as string); reader.readAsDataURL(file); }
          }} />
          {image ? <img src={image} style={{ height: '70px', borderRadius: '10px' }} /> : <div style={{ fontWeight: 'bold', fontSize: '18px', ...globalStyle }}><Camera size={22} style={{verticalAlign:'middle', marginRight:'8px'}}/>上傳照片</div>}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* 修正：增加顯示更多幣種 */}
          <select style={{ ...inputStyle, ...globalStyle, flex: 1.2 }} value={currency} onChange={e => setCurrency(e.target.value)}>
            {Object.entries(currencyNames).map(([code, name]) => (
              <option key={code} value={`${code} - ${name}`}>{code} - {name}</option>
            ))}
          </select>
          <input style={{ ...inputStyle, ...globalStyle, flex: 1 }} placeholder="金額" value={price} onChange={e => setPrice(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
        <button onClick={() => setView('LIST')} style={{ flex: 1, padding: '15px', border: '4px solid black', borderRadius: '20px', fontWeight: '900', fontSize: '22px', backgroundColor: 'white', ...globalStyle }}>取消</button>
        <button onClick={handleSave} style={{ flex: 1, padding: '15px', border: '4px solid black', borderRadius: '20px', backgroundColor: 'black', color: 'white', fontWeight: '900', fontSize: '22px', ...globalStyle }}>儲存</button>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ backgroundColor: '#FF8C00', width: '92%', maxWidth: '440px', height: '90vh', borderRadius: '50px', border: '6px solid black', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {view === 'LIST' ? renderListView() : renderAddView()}
      </div>

      {previewImage && (
        <div onClick={() => setPreviewImage(null)} style={{ position: 'fixed', inset: 0, zIndex: 1100, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }}>
          <img src={previewImage} style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: '20px', border: '6px solid white' }} alt="preview" />
        </div>
      )}

      {showDeleteConfirm && (
        <DeleteConfirmModal 
          onConfirm={() => {
            const all = JSON.parse(localStorage.getItem('travel_buys') || '[]');
            const updated = all.filter((i: any) => i.id !== showDeleteConfirm);
            localStorage.setItem('travel_buys', JSON.stringify(updated));
            setItems(updated.filter((i: any) => i.trip === currentTrip));
            setShowDeleteConfirm(null);
          }}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
    </div>
  );
};

const inputStyle = { border: '3px solid black', borderRadius: '15px', padding: '12px', fontSize: '18px', fontWeight: 'bold' as const };
const timeInputStyle = { flex: 1, border: '2px solid black', borderRadius: '10px', padding: '8px' };
const catBtnStyle = { flex: 1, padding: '15px', border: '3px solid black', borderRadius: '15px', textAlign: 'center' as const, fontWeight: '900' as const, fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' };

export default WishListModal;