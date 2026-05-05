import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, ChevronLeft, MapPin, User, ShoppingBag, Gift, ShoppingCart, Trash2, Edit2, Clock, Calendar, CheckCircle2 } from 'lucide-react';

const exchangeRates: { [key: string]: number } = {
  JPY: 0.21, KRW: 0.024, USD: 32.5, GBP: 41.2, AUD: 21.5,
  HKD: 4.15, VND: 0.0013, PHP: 0.57, IDR: 0.002, CNY: 4.5, SGD: 24.1
};

const currencyNames: { [key: string]: string } = {
  JPY: '日圓', KRW: '韓幣', USD: '美金', GBP: '英鎊', AUD: '澳幣',
  HKD: '港幣', VND: '越南幣', PHP: '披索', IDR: '印尼盾', CNY: '人民幣', SGD: '新幣'
};

interface BuyItem {
  id: number;
  trip: string;
  itemName: string;
  quantity: string;
  storeName: string;
  locationUrl: string;
  paymentMethod: string;
  date: string;
  time: string;
  selectedType: string;
  buyerName: string;
  currency: string;
  price: string;
  taxFreeJpy: string;
  image: string | null;
  completed: boolean;
  restDays: string[];
  time1_start: string;
  time1_end: string;
  time2_start?: string;
  time2_end?: string;
}

const BuyBuyBuyList: React.FC<{ isOpen: boolean; onClose: () => void; currentTrip: string }> = ({ isOpen, onClose, currentTrip }) => {
  const [view, setView] = useState<'LIST' | 'ADD'>('LIST');
  const [items, setItems] = useState<BuyItem[]>([]);
  
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [storeName, setStoreName] = useState('');
  const [locationUrl, setLocationUrl] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState(''); 
  const [selectedType, setSelectedType] = useState('自己');
  const [buyerName, setBuyerName] = useState('');
  const [currency, setCurrency] = useState('JPY');
  const [price, setPrice] = useState('');
  const [taxFreeJpy, setTaxFreeJpy] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [restDays, setRestDays] = useState<string[]>([]);
  const [time1, setTime1] = useState({ start: '10:00', end: '20:00' });
  const [time2, setTime2] = useState({ start: '', end: '' });
  const [showTime2, setShowTime2] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const days = ['日', '一', '二', '三', '四', '五', '六'];
  const THEME_ORANGE = '#FF9933'; 
  const COMPLETED_GRAY = '#D1D1D1';
  const baseStyle = { fontFamily: 'MORITAD, sans-serif' };

  const historyPayments = Array.from(new Set(items.map(i => i.paymentMethod).filter(Boolean)));
  const historyBuyers = Array.from(new Set(items.map(i => i.buyerName).filter(Boolean)));

  useEffect(() => {
    if (isOpen) {
      const saved = JSON.parse(localStorage.getItem('buy_buy_buy_v10') || '[]');
      setItems(saved.filter((item: BuyItem) => item.trip === currentTrip));
    }
  }, [isOpen, currentTrip]);

  const resetForm = () => {
    setEditingId(null); setItemName(''); setQuantity(''); setStoreName(''); setLocationUrl('');
    setPaymentMethod(''); setDate(''); setTime(''); setSelectedType('自己');
    setBuyerName(''); setCurrency('JPY'); setPrice(''); setTaxFreeJpy(''); setImage(null);
    setRestDays([]); setTime1({ start: '10:00', end: '20:00' }); setTime2({ start: '', end: '' }); setShowTime2(false);
  };

  const handleSave = () => {
    if (!itemName) return;
    const allItems = JSON.parse(localStorage.getItem('buy_buy_buy_v10') || '[]');
    
    const newItem: BuyItem = {
      id: editingId || Date.now(),
      trip: currentTrip,
      itemName, quantity, storeName, locationUrl, paymentMethod, date, time,
      selectedType, buyerName, currency, price, taxFreeJpy, image,
      completed: editingId ? (items.find(i => i.id === editingId)?.completed || false) : false,
      restDays, time1_start: time1.start, time1_end: time1.end,
      ...(showTime2 && { time2_start: time2.start, time2_end: time2.end }),
    };

    const updatedAll = editingId 
      ? allItems.map((it: any) => it.id === editingId ? newItem : it) 
      : [...allItems, newItem];

    localStorage.setItem('buy_buy_buy_v10', JSON.stringify(updatedAll));
    setItems(updatedAll.filter((it: any) => it.trip === currentTrip));
    resetForm();
    setView('LIST'); 
  };

  const toggleComplete = (id: number) => {
    const allItems = JSON.parse(localStorage.getItem('buy_buy_buy_v10') || '[]');
    const updatedAll = allItems.map((it: any) => it.id === id ? { ...it, completed: !it.completed } : it);
    localStorage.setItem('buy_buy_buy_v10', JSON.stringify(updatedAll));
    setItems(updatedAll.filter((it: any) => it.trip === currentTrip));
  };

  const openLink = (e: React.MouseEvent, target: string) => {
    e.stopPropagation();
    if (!target) return;
    if (target.startsWith('http')) {
      window.open(target, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(target)}`, '_blank');
    }
  };

  const handleEdit = (item: BuyItem) => {
    setEditingId(item.id); setItemName(item.itemName); setQuantity(item.quantity); setStoreName(item.storeName);
    setLocationUrl(item.locationUrl); setPaymentMethod(item.paymentMethod); setDate(item.date); setTime(item.time);
    setSelectedType(item.selectedType); setBuyerName(item.buyerName); setCurrency(item.currency); setPrice(item.price);
    setTaxFreeJpy(item.taxFreeJpy); setImage(item.image); setRestDays(item.restDays || []);
    setTime1({ start: item.time1_start || '10:00', end: item.time1_end || '20:00' });
    if (item.time2_start) { setTime2({ start: item.time2_start, end: item.time2_end || '' }); setShowTime2(true); } else { setShowTime2(false); }
    setView('ADD');
  };

  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 }}>
      <div style={{ backgroundColor: THEME_ORANGE, width: '100%', maxWidth: '420px', height: '92vh', borderRadius: '50px', border: '6px solid black', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {view === 'LIST' ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '25px 20px 15px' }}>
              <button onClick={onClose} style={{ background: 'white', border: '4px solid black', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '4px 4px 0px black' }}>
                <ChevronLeft size={28} strokeWidth={4} />
              </button>
              <h2 style={{ flex: 1, textAlign: 'center', fontSize: '32px', fontWeight: '900', margin: 0, marginRight: '45px', ...baseStyle }}>BUY LIST</h2>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '10px 15px' }}>
              {items.map(item => (
                <div key={item.id} style={{ position: 'relative', marginBottom: '25px' }}>
                  <div style={{ backgroundColor: item.completed ? COMPLETED_GRAY : 'white', border: '4px solid black', borderRadius: '40px', padding: '20px' }}>
                    
                    <div style={{ fontSize: '24px', fontWeight: '900', marginBottom: '10px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: item.completed ? '#444' : 'black', ...baseStyle }}>
                      {item.itemName}
                    </div>

                    <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                      <div onClick={() => toggleComplete(item.id)} style={{ width: '40px', height: '45px', borderRadius: '12px', border: '3px solid black', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: item.completed ? '#666' : '#F8F9FA', flexShrink: 0, marginTop: '2px' }}>
                        {item.completed ? <CheckCircle2 color="white" size={20} /> : (item.selectedType === '代購' ? <ShoppingBag color="#3B82F6" size={20} /> : item.selectedType === '伴手禮' ? <Gift color="#FF5A5A" size={20} /> : <User color="black" size={20} />)}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '18px', fontWeight: 'bold', color: item.completed ? '#555' : 'black', marginBottom: '4px' }}>{item.storeName}</div>
                        <div onClick={(e) => openLink(e, item.locationUrl || item.storeName)} style={{ display: 'flex', alignItems: 'flex-start', gap: '4px', fontSize: '15px', color: item.completed ? '#666' : '#007AFF', cursor: 'pointer', textAlign: 'left', marginBottom: '12px', textDecoration: 'underline' }}>
                          <MapPin size={16} style={{flexShrink: 0}} /> 
                          <span style={{display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>{item.locationUrl || '點擊開啟地址'}</span>
                        </div>
                      </div>

                      <div style={{ width: '85px', height: '85px', borderRadius: '15px', border: '3px solid black', overflow: 'hidden', backgroundColor: '#EEE', flexShrink: 0 }}>
                        {item.image ? <img src={item.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : null}
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: '10px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '15px', fontWeight: 'bold', color: item.completed ? '#666' : '#444', whiteSpace: 'nowrap', ...baseStyle }}>營業時段：</span>
                        <div style={{ fontSize: '16px', fontWeight: 'bold', color: item.completed ? '#666' : '#444', display: 'flex', flexDirection: 'column', gap: '2px', ...baseStyle }}>
                          <div>{item.time1_start} - {item.time1_end}</div>
                          {item.time2_start && <div>{item.time2_start} - {item.time2_end}</div>}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', width: '85px', flexShrink: 0 }}>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 'bold', color: '#666', whiteSpace: 'nowrap', ...baseStyle }}>
                           <Clock size={14}/> 打烊: {item.time2_end || item.time1_end}
                         </div>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 'bold', color: '#666', whiteSpace: 'nowrap', ...baseStyle }}>
                           <Calendar size={14}/> 休息: {item.restDays?.length > 0 ? item.restDays.join(',') : '無'}
                         </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '3px dashed #DDD', margin: '15px 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '900', ...baseStyle }}>
                      <div style={{ fontSize: '18px' }}>數量 : {item.quantity}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '18px' }}>{item.currency} {Number(item.price).toLocaleString()}</span>
                        <span style={{ border: '3px solid black', padding: '2px 15px', borderRadius: '20px', backgroundColor: 'white', fontSize: '15px' }}>{item.buyerName}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ position: 'absolute', right: '-12px', top: '15px', display: 'flex', flexDirection: 'column', gap: '10px', zIndex: 10 }}>
                    <button onClick={() => handleEdit(item)} style={{ background: 'white', border: '2px solid black', borderRadius: '10px', padding: '6px', boxShadow: '2px 2px 0px black' }}><Edit2 size={18}/></button>
                    <button onClick={() => { 
                      if(window.confirm('確定刪除？')) { 
                        const allItems = JSON.parse(localStorage.getItem('buy_buy_buy_v10') || '[]');
                        const updatedAll = allItems.filter((i: any) => i.id !== item.id);
                        localStorage.setItem('buy_buy_buy_v10', JSON.stringify(updatedAll));
                        setItems(updatedAll.filter((i: any) => i.trip === currentTrip));
                      } 
                    }} style={{ background: 'white', border: '2px solid black', borderRadius: '10px', padding: '6px', color: 'red', boxShadow: '2px 2px 0px black' }}><Trash2 size={18}/></button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ padding: '25px' }}>
              <button onClick={() => { resetForm(); setView('ADD'); }} style={{ width: '100%', backgroundColor: 'white', border: '5px solid black', borderRadius: '35px', padding: '18px', fontSize: '26px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', boxShadow: '0px 8px 0px black', ...baseStyle }}>
                <ShoppingCart size={28} color="#FF5A5A" strokeWidth={3} fill="#FF5A5A" /> 新增項目
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: '40px', borderTopRightRadius: '40px', padding: '30px', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ ...baseStyle, fontSize: '30px', color: '#FF5A5A', fontWeight: '900', margin: 0 }}>BUY ITEM</h2>
              <X size={32} strokeWidth={3} onClick={() => { resetForm(); setView('LIST'); }} style={{ cursor: 'pointer' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input placeholder="商品名稱" style={inputStyle} value={itemName} onChange={e => setItemName(e.target.value)} />
              <input placeholder="數量" style={inputStyle} value={quantity} onChange={e => setQuantity(e.target.value)} />
              <input placeholder="店家名稱" style={inputStyle} value={storeName} onChange={e => setStoreName(e.target.value)} />
              <input placeholder="地點 / 網址" style={inputStyle} value={locationUrl} onChange={e => setLocationUrl(e.target.value)} />

              <div style={{ border: '3px solid black', borderRadius: '25px', padding: '15px' }}>
                <div style={{ ...baseStyle, fontSize: '12px', color: '#E57373', marginBottom: '10px', fontWeight: 'bold' }}>DATE & TIME</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#999', fontWeight: 'bold' }}>預定日期</span>
                    <input type="date" value={date} style={gridInput} onChange={e => setDate(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#999', fontWeight: 'bold' }}>付款方式</span>
                    <input placeholder="選擇或輸入" list="pay-hist" style={gridInput} value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} />
                    <datalist id="pay-hist">{historyPayments.map(p => <option key={p} value={p} />)}</datalist>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#999', fontWeight: 'bold' }}>預定時間</span>
                    <input type="time" value={time} style={gridInput} onChange={e => setTime(e.target.value)} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ fontSize: '11px', color: '#999', fontWeight: 'bold' }}>商品圖片</span>
                    <div onClick={() => fileInputRef.current?.click()} style={{ ...gridInput, border: '3px dashed black', cursor: 'pointer' }}>
                      <Camera size={18} /> <span>{image ? '已選取' : '上傳圖片'}</span>
                      <input type="file" ref={fileInputRef} style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if(f){ const r = new FileReader(); r.onloadend = () => setImage(r.result as string); r.readAsDataURL(f); } }} />
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                {[{ id: '自己', icon: <User size={18}/> }, { id: '代購', icon: <ShoppingBag size={18}/> }, { id: '伴手禮', icon: <Gift size={18}/> }].map(t => (
                  <button key={t.id} onClick={() => setSelectedType(t.id)} style={{ ...gridInput, backgroundColor: selectedType === t.id ? '#FFD64D' : 'white', height: '50px', flexDirection: 'column', gap: 2 }}>
                    {t.icon} <span style={{fontSize:'12px'}}>{t.id}</span>
                  </button>
                ))}
              </div>

              <input placeholder="委託人" list="buyer-hist" style={inputStyle} value={buyerName} onChange={e => setBuyerName(e.target.value)} />
              <datalist id="buyer-hist">{historyBuyers.map(b => <option key={b} value={b} />)}</datalist>

              <div>
                <div style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '5px' }}>休息日:</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  {days.map(d => (
                    <div key={d} onClick={() => setRestDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])} 
                      style={{ width: '32px', height: '32px', border: '3px solid black', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', cursor: 'pointer', backgroundColor: restDays.includes(d) ? 'black' : 'white', color: restDays.includes(d) ? 'white' : 'black', fontSize: '12px' }}>{d}</div>
                  ))}
                </div>
              </div>

              <div style={{ border: '3px solid black', borderRadius: '20px', padding: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontWeight: 'bold', fontSize: '13px' }}>
                  <span>營業時段 1:</span>
                  {!showTime2 && <button onClick={()=>setShowTime2(true)} style={{ background:'black', color:'white', border:'none', borderRadius:'5px', padding:'2px 8px', fontSize:'11px'}}>+ 增加時段 2</button>}
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input type="time" value={time1.start} onChange={e=>setTime1({...time1, start:e.target.value})} style={gridInput} />
                  <input type="time" value={time1.end} onChange={e=>setTime1({...time1, end:e.target.value})} style={gridInput} />
                </div>
                {showTime2 && (
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <input type="time" value={time2.start} onChange={e=>setTime2({...time2, start:e.target.value})} style={gridInput} />
                    <input type="time" value={time2.end} onChange={e=>setTime2({...time2, end:e.target.value})} style={gridInput} />
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                <select value={currency} style={inputStyle} onChange={e => setCurrency(e.target.value)}>
                  {Object.entries(currencyNames).map(([code, name]) => (
                    <option key={code} value={code}>{code} - {name}</option>
                  ))}
                </select>
                <input type="number" placeholder="金額" style={inputStyle} value={price} onChange={e => setPrice(e.target.value)} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '10px', alignItems: 'center' }}>
                <div style={{ fontWeight: '900', ...baseStyle }}>Tax Free ({currency})</div>
                <input type="number" style={inputStyle} value={taxFreeJpy} onChange={e => setTaxFreeJpy(e.target.value)} />
              </div>

              <div style={{ backgroundColor: '#FFD64D', padding: '12px', borderRadius: '15px', border: '3px solid black', display: 'flex', justifyContent: 'space-between', fontWeight: '900', ...baseStyle }}>
                <span>預估台幣 (TWD)</span>
                <span>NT$ {Math.round(Number(price) * (exchangeRates[currency] || 0)).toLocaleString()}</span>
              </div>
              
              <div style={{ backgroundColor: '#D1EAFF', padding: '12px', borderRadius: '15px', border: '3px solid black', display: 'flex', justifyContent: 'space-between', fontWeight: '900', ...baseStyle }}>
                <span>免稅額 (TWD)</span>
                <span>NT$ {Math.round(Number(taxFreeJpy) * (exchangeRates[currency] || 0)).toLocaleString()}</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '30px' }}>
                <button onClick={() => { resetForm(); setView('LIST'); }} style={{ padding: '15px', backgroundColor: 'white', border: '4px solid black', color: 'black', borderRadius: '20px', fontWeight: '900', fontSize: '22px', ...baseStyle }}>取消</button>
                <button onClick={handleSave} style={{ padding: '15px', backgroundColor: 'black', color: 'white', border: '4px solid black', borderRadius: '20px', fontWeight: '900', fontSize: '22px', ...baseStyle }}>儲存</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = { border: '3px solid black', borderRadius: '15px', padding: '12px', fontSize: '18px', fontWeight: 'bold', width: '100%', boxSizing: 'border-box', fontFamily: 'MORITAD, sans-serif' };
const gridInput: React.CSSProperties = { border: '3px solid black', borderRadius: '12px', padding: '6px', fontSize: '14px', fontWeight: 'bold', width: '100%', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', boxSizing: 'border-box', fontFamily: 'MORITAD, sans-serif', backgroundColor: 'white' };

export default BuyBuyBuyList;