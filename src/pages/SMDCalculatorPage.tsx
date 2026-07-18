import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { smdResistorCodes } from '../data/mockData';
import { Calculator, ArrowRight } from 'lucide-react';

export default function SMDCalculatorPage() {
  const navigate = useNavigate();
  const [inp, setInp] = useState('');
  const [out, setOut] = useState('');

  const calc = (code: string) => {
    setInp(code);
    if (code.length === 3) {
      const base = parseInt(code.substring(0,2));
      const mul = parseInt(code.substring(2));
      if (!isNaN(base) && !isNaN(mul)) {
        const v = base * Math.pow(10, mul);
        setOut(v >= 1e6 ? `${(v/1e6).toFixed(1)} MΩ` : v >= 1000 ? `${(v/1000).toFixed(1)} kΩ` : `${v} Ω`);
      } else setOut('كود غير صالح');
    } else if (code.length === 4) {
      const base = parseInt(code.substring(0,3));
      const mul = parseInt(code.substring(3));
      if (!isNaN(base) && !isNaN(mul)) {
        const v = base * Math.pow(10, mul);
        setOut(v >= 1e6 ? `${(v/1e6).toFixed(2)} MΩ` : v >= 1000 ? `${(v/1000).toFixed(2)} kΩ` : `${v} Ω`);
      } else setOut('كود غير صالح');
    } else if (!code) setOut('');
    else setOut('أدخل 3 أو 4 أرقام');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <button onClick={() => navigate('/tools')} className="btn btn-ghost btn-sm"><ArrowRight /> الأدوات</button>
      <h1 className="page-title">حاسبة مقاومة SMD</h1>
      <div className="card" style={{ padding: 24, maxWidth: 500 }}>
        <input className="field-input" style={{ textAlign: 'center', fontSize: 24, fontFamily: 'monospace', letterSpacing: 8, marginBottom: 20 }}
          value={inp} onChange={e => calc(e.target.value.replace(/\D/g,'').slice(0,4))} placeholder="472" maxLength={4} />
        {out && <div style={{ textAlign: 'center', fontSize: 32, fontWeight: 900, color: out.includes('غير')||out.includes('أدخل') ? '#ef4444' : '#10b981' }}>{out}</div>}
      </div>
    </div>
  );
}
