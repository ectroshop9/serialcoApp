import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import { Search, Filter, Download, Eye, X, ChevronUp, ChevronDown, RotateCw, Coins } from 'lucide-react';

const API = 'https://serialcotv.onrender.com';

interface Firmware {
  id: number;
  brand__name: string;
  model_number: string;
  version: string;
  token_cost: number;
  downloads_count: number;
}

interface Brand {
  id: number;
  name: string;
}

function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const show = (msg: string, type: 'success' | 'error' = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  return { toast, show };
}

type SortField = 'brand__name' | 'model_number' | 'version' | 'downloads_count' | 'token_cost';
function useSort(data: Firmware[], defaultField: SortField) {
  const [field, setField] = useState<SortField>(defaultField);
  const [dir, setDir] = useState<'asc' | 'desc'>('asc');
  const sorted = useMemo(() => [...data].sort((a: any, b: any) => {
    if (dir === 'asc') return a[field] > b[field] ? 1 : -1;
    return a[field] < b[field] ? 1 : -1;
  }), [data, field, dir]);
  return { sorted, field, dir, toggle: (f: SortField) => { if (field === f) setDir(d => d === 'asc' ? 'desc' : 'asc'); else { setField(f); setDir('asc'); } } };
}

function usePagination<T>(data: T[], perPage = 10) {
  const [page, setPage] = useState(1);
  const total = Math.ceil(data.length / perPage);
  const slice = useMemo(() => data.slice((page - 1) * perPage, page * perPage), [data, page, perPage]);
  return { slice, page, total, setPage };
}

export default function FirmwarePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') || '');
  const [brandFilter, setBrandFilter] = useState(searchParams.get('brand') || '');
  const [sel, setSel] = useState<Firmware | null>(null);
  const [open, setOpen] = useState(false);
  const [serial, setSerial] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [firmwares, setFirmwares] = useState<Firmware[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const { toast, show } = useToast();

  useEffect(() => { fetchFirmwares(); fetchBrands(); }, []);

  const fetchFirmwares = async () => {
    try {
      const res = await fetch(`${API}/api/firmware/`);
      const data = await res.json();
      if (data.success) setFirmwares(data.firmwares);
    } catch (err) { console.error(err); }
    finally { setLoadingData(false); }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch(`${API}/api/brands/`);
      const data = await res.json();
      if (data.success) setBrands(data.brands);
    } catch (err) { console.error(err); }
  };

  const filtered = useMemo(() => firmwares.filter(fw => {
    const s = fw.model_number.toLowerCase().includes(q.toLowerCase()) || fw.brand__name.toLowerCase().includes(q.toLowerCase());
    return s && (!brandFilter || fw.brand__name === brandFilter);
  }), [q, brandFilter, firmwares]);

  const { sorted, field, dir, toggle } = useSort(filtered, 'brand__name');
  const { slice, page, total, setPage } = usePagination(sorted);
  useEffect(() => { setPage(1); }, [q, brandFilter]);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sel || !serial || !pin) return;
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/firmware/${sel.id}/?serial_number=${serial}&pin=${pin}`);
      const data = await res.json();
      if (data.success) {
        show('تم الخصم! التحميل جاري...', 'success');
        setTimeout(() => { window.open(data.download_url, '_blank'); setOpen(false); }, 500);
        fetchFirmwares();
      } else show(data.message || 'فشل', 'error');
    } catch { show('خطأ في الاتصال', 'error'); }
    finally { setLoading(false); }
  };

  const dl = (fw: Firmware) => { setSel(fw); setOpen(true); setSerial(''); setPin(''); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {toast && <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: toast.type === 'success' ? '#10b981' : '#ef4444', color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 700 }}>{toast.msg}</div>}

      <div className="row-between">
        <h1 className="page-title">السوفتويرات</h1>
        <button onClick={fetchFirmwares} className="btn btn-ghost btn-sm"><RotateCw /> تحديث</button>
      </div>

      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div className="field" style={{ flex: '1 1 250px' }}>
            <span className="field-icon"><Search /></span>
            <input className="field-input" placeholder="ابحث برقم الموديل..." value={q} onChange={e => setQ(e.target.value)} />
            {q && <span className="field-icon-left" onClick={() => setQ('')}><X /></span>}
          </div>
          <select className="field-select" value={brandFilter} onChange={e => setBrandFilter(e.target.value)}>
            <option value="">جميع الماركات</option>
            {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
          </select>
        </div>
      </div>

      {loadingData ? <div style={{ textAlign: 'center', padding: 40 }}>جاري التحميل...</div> :
        <div className="table-wrap">
          <table className="tbl">
            <thead><tr><th>الماركة</th><th>الموديل</th><th>الإصدار</th><th>التوكن</th><th>التحميلات</th><th>تحميل</th></tr></thead>
            <tbody>
              {slice.map(fw => (
                <tr key={fw.id}>
                  <td>{fw.brand__name}</td><td>{fw.model_number}</td><td>{fw.version || '-'}</td>
                  <td><Coins /> {fw.token_cost}</td><td>{fw.downloads_count}</td>
                  <td><button onClick={() => dl(fw)} className="btn btn-primary btn-sm"><Download /> تحميل</button></td>
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
