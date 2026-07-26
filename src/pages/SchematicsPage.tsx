import { useState, useEffect } from 'react';
import Modal from '../components/UI/Modal';
import { Search, FileText, Eye, X, Zap, Cpu, Monitor, Coins } from 'lucide-react';

const API = 'https://serialcotv.onrender.com';

interface Schematic {
  id: number;
  title: string;
  model_number: string;
  brand__name: string;
  schematic_type: string;
  token_cost: number;
  downloads_count: number;
}

export default function SchematicsPage() {
  const [q, setQ] = useState('');
  const [schematics, setSchematics] = useState<Schematic[]>([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel] = useState<Schematic | null>(null);
  const [open, setOpen] = useState(false);
  const [serial, setSerial] = useState('');
  const [pin, setPin] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/schematics/`)
      .then(res => res.json())
      .then(data => { setSchematics(data.schematics || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = schematics.filter(s =>
    s.title.toLowerCase().includes(q.toLowerCase()) ||
    s.model_number.toLowerCase().includes(q.toLowerCase())
  );

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sel || !serial || !pin) return;
    setDownloading(true);
    try {
      const res = await fetch(`${API}/api/schematics/${sel.id}/?serial_number=${serial}&pin=${pin}`);
      const data = await res.json();
      if (data.success) {
        window.open(data.download_url, '_blank');
        setOpen(false);
      } else alert(data.message);
    } catch { alert('خطأ'); }
    finally { setDownloading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h1 className="page-title">المخططات</h1>
      
      <div className="card" style={{ padding: 20 }}>
        <div className="field">
          <span className="field-icon"><Search /></span>
          <input className="field-input" placeholder="ابحث..." value={q} onChange={e => setQ(e.target.value)} />
          {q && <span onClick={() => setQ('')}><X /></span>}
        </div>
      </div>

      {loading ? <div style={{ textAlign: 'center', padding: 40 }}>جاري التحميل...</div> :
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>العنوان</th><th>الماركة</th><th>الموديل</th><th>التوكن</th><th>تحميل</th></tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>{s.title}</td>
                  <td>{s.brand__name}</td>
                  <td>{s.model_number}</td>
                  <td><Coins /> {s.token_cost}</td>
                  <td><button onClick={() => { setSel(s); setOpen(true); }} className="btn btn-primary btn-sm"><FileText /> تحميل</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }

      <Modal isOpen={open} onClose={() => setOpen(false)} title="تأكيد التحميل">
        {sel && (
          <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><strong>{sel.title}</strong> ({sel.token_cost} توكن)</div>
            <input className="field-input" placeholder="رقم السيريال" value={serial} onChange={e => setSerial(e.target.value)} required disabled={downloading} />
            <input className="field-input" type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} required disabled={downloading} />
            <button className="btn btn-primary btn-block" disabled={downloading}>{downloading ? 'جاري...' : <><Coins /> تأكيد التحميل</>}</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
