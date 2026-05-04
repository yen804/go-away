import React, { useState } from 'react';
import { X, ArrowUpDown, Delete } from 'lucide-react';
import { theme } from '../theme';

interface CalculatorProps {
  onClose: () => void;
}

const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const [input, setInput] = useState('0');
  const [isJpToTwd, setIsJpToTwd] = useState(true);
  const [currentCurrency, setCurrentCurrency] = useState('JPY');

  const rates: { [key: string]: number } = {
    JPY: 0.21, KRW: 0.024, USD: 32.5, GBP: 40.8, AUD: 21.3,
    HKD: 4.15, VND: 0.0013, PHP: 0.57, IDR: 0.002, CNY: 4.5, SGD: 24.0
  };

  const currencyNames: { [key: string]: string } = {
    JPY: '日圓', KRW: '韓幣', USD: '美金', GBP: '英鎊', AUD: '澳幣',
    HKD: '港幣', VND: '越南幣', PHP: '披索', IDR: '印尼盾', CNY: '人民幣', SGD: '新幣'
  };

  const handleBtnClick = (val: string) => {
    if (val === 'AC') {
      setInput('0');
    } else if (val === 'DEL') {
      setInput(input.length > 1 ? input.slice(0, -1) : '0');
    } else if (val === '%') {
      try {
        const result = new Function(`return ${input} / 100`)();
        setInput(String(result));
      } catch { setInput('Error'); }
    } else if (val === '=') {
      try {
        // 將介面顯示的 ÷ 改回 /，× 改回 * 進行運算
        const expression = input.replace(/÷/g, '/').replace(/×/g, '*');
        const result = new Function(`return ${expression}`)();
        setInput(String(result));
      } catch { setInput('Error'); }
    } else {
      if (input === '0' && !['+', '-', '×', '÷'].includes(val)) {
        setInput(val);
      } else {
        setInput(input + val);
      }
    }
  };

  const calculateResult = () => {
    let finalNum = 0;
    try {
      const expression = input.replace(/÷/g, '/').replace(/×/g, '*');
      finalNum = parseFloat(new Function(`return ${expression}`)());
    } catch { finalNum = 0; }

    const rate = rates[currentCurrency];
    if (isNaN(finalNum)) return '0';
    return isJpToTwd 
      ? (finalNum * rate).toLocaleString(undefined, { maximumFractionDigits: 2 })
      : (finalNum / rate).toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  // 按鈕定義，對應圖片的 4x5 佈局
  const btnRows = [
    ['DEL', 'AC', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['+/-', '0', '.', '=']
  ];

  const isOperator = (btn: string) => ['÷', '×', '-', '+', '='].includes(btn);

  return (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div style={{ 
        backgroundColor: theme.colors.white, border: '4px solid black', borderRadius: '40px', 
        width: '100%', maxWidth: '380px', padding: '25px', boxShadow: '8px 8px 0px black', fontFamily: 'MORITAD, sans-serif' 
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div style={{ backgroundColor: 'black', color: 'white', padding: '4px 15px', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold' }}>CALCULATOR</div>
          <button onClick={onClose} style={{ cursor: 'pointer', border: 'none', background: 'none' }}><X size={32} strokeWidth={4} /></button>
        </div>

        <select 
          value={currentCurrency} onChange={(e) => setCurrentCurrency(e.target.value)}
          style={{ width: '100%', padding: '10px', borderRadius: '15px', border: '3px solid black', marginBottom: '15px', fontSize: '18px', fontWeight: '900' }}
        >
          {Object.keys(rates).map(code => <option key={code} value={code}>{code} - {currencyNames[code]}</option>)}
        </select>

        <div style={{ backgroundColor: '#F3F4F6', border: '3px solid black', borderRadius: '20px', padding: '15px', textAlign: 'right', marginBottom: '15px' }}>
          <div style={{ fontSize: '14px', color: '#666', fontWeight: 'bold' }}>{isJpToTwd ? currentCurrency : 'TWD'}</div>
          <div style={{ fontSize: '36px', fontWeight: 900, lineHeight: 1.2 }}>{input}</div>
          <div style={{ borderTop: '2px dashed #CCC', margin: '8px 0' }}></div>
          <div style={{ fontSize: '14px', color: theme.colors.red, fontWeight: 'bold' }}>≈ {isJpToTwd ? 'TWD' : currentCurrency}</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: theme.colors.red }}>{calculateResult()}</div>
        </div>

        <button 
          onClick={() => setIsJpToTwd(!isJpToTwd)}
          style={{ width: '100%', backgroundColor: 'black', color: 'white', padding: '10px', borderRadius: '15px', marginBottom: '15px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          {isJpToTwd ? `${currentCurrency} → TWD` : `TWD → ${currentCurrency}`} <ArrowUpDown size={18} />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {btnRows.flat().map((btn) => (
            <button
              key={btn}
              onClick={() => handleBtnClick(btn === '+/-' ? '-' : btn)}
              style={{
                padding: '12px 0', fontSize: '22px', fontWeight: '900',
                backgroundColor: isOperator(btn) ? '#FF9933' : (['DEL', 'AC', '%', '+/-'].includes(btn) ? '#E5E7EB' : 'white'),
                border: '3px solid black', borderRadius: '15px', cursor: 'pointer',
                boxShadow: '4px 4px 0px black',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {btn === 'DEL' ? <Delete size={20} strokeWidth={3} /> : btn}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;