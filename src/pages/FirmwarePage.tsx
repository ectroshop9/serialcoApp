import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import { Search, Download, X, RotateCw, Coins } from 'lucide-react';

const API = 'https://serialcotv.onrender.com';

interface Firmware {
  id: number;
  brand__name: string;
  model_number: string;
  version: string;
  token_cost: number;
  downloads_count: number;
}

export default function FirmwarePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [sel, setSel] = useState<Firmware | null>(null);
  const [open, setOpen] = useState(false);
  const [serial, setSerial] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [firmwares, setFirmwares] = useState<Firmware[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => { fetchFirmwares(); }, []);

  const fetchFirmwares = async () => {
    try {
      const res = await fetch(`${API}/api/content/firmware/`);
      const data = await res.json();
      if (data.success) setFirmwares(data.firmwares);
    } catch (err) { console.error(err); }
    finally { setLoadingData(false); }
  };

  const filtered = firmwares.filter(fw =>
    fw.model_number.toLowerCase().includes(q.toLowerCase()) ||
    fw.brand__name.toLowerCase().includes(q.toLowerCase())
  );

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sel || !serial || !pin) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/content/firmware/${sel.id}/?serial_number=${serial}&pin=${pin}`);
      const data = await res.json();
      if (data.success) {
        setToast('تم الخصم! جاري التحميل...');
        setTimeout(() => { window.open(data.download_url, '_blank'); setOpen(false); }, 500);
        fetchFirmwares();
      } else setToast(data.message || 'فشل');
    } catch { setToast('خطأ في الاتصال'); }
    finally { setLoading(false); setTimeout(() => setToast(null), 3000); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {toast && <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: '#10b981', color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 700 }}>{toast}</div>}

      <div className="row-between">
        <h1 className="page-title">السوفتويرات</h1>
        <button onClick={fetchFirmwares} className="btn btn-ghost btn-sm"><RotateCw /> تحديث</button>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div className="field">
          <span className="field-icon"><Search /></span>
          <input className="field-input" placeholder="ابحث برقم الموديل..." value={q} onChange={e => setQ(e.target.value)} />
          {q && <span onClick={() => setQ('')}><X /></span>}
        </div>
      </div>

      {loadingData ? <div style={{ textAlign: 'center', padding: 40 }}>جاري التحميل...</div> :
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>الماركة</th><th>الموديل</th><th>التوكن</th><th>تحميل</th></tr></thead>
            <tbody>
              {filtered.map(fw => (
                <tr key={fw.id}>
                  <td>{fw.brand__name}</td><td>{fw.model_number}</td>
                  <td><Coins /> {fw.token_cost}</td>
                  <td><button onClick={() => { setSel(fw); setOpen(true); }} className="btn btn-primary btn-sm"><Download /> تحميل</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      }

      <Modal isOpen={open} onClose={() => setOpen(false)} title="تأكيد التحميل">
        {sel && (
          <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><strong>{sel.brand__name} - {sel.model_number}</strong> ({sel.token_cost} توكن)</div>
            <input className="field-input" placeholder="رقم السيريال" value={serial} onChange={e => setSerial(e.target.value)} required disabled={loading} />
            <input className="field-input" type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} required disabled={loading} />
            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>{loading ? 'جاري...' : <><Coins /> تأكيد التحميل</>}</button>
          </form>
        )}
      </Modal>
    </div>
  );
}
