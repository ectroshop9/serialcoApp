import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import { Search, Filter, Download, Eye, X, ChevronUp, ChevronDown, RotateCw, Coins } from 'lucide-react';

interface Firmware {
  id: number;
  brand__name: string;
  model_number: string;
  version: string;
  token_cost: number;
  downloads_count: number;
  description: string;
  created_at: string;
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

  useEffect(() => {
    fetchFirmwares();
    fetchBrands();
  }, []);

  const fetchFirmwares = async () => {
    try {
      const res = await fetch('/api/firmware/');
      const data = await res.json();
      if (data.success) setFirmwares(data.firmwares);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands/');
      const data = await res.json();
      if (data.success) setBrands(data.brands);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (brandFilter) params.brand = brandFilter;
    setSearchParams(params, { replace: true });
  }, [q, brandFilter]);

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
      const res = await fetch(`/api/firmware/${sel.id}/?serial_number=${serial}&pin=${pin}`);
      const data = await res.json();
      
      if (data.success) {
        show(`تم الخصم! التحميل جاري...`, 'success');
        setTimeout(() => {
          window.open(data.download_url, '_blank');
          setOpen(false);
        }, 500);
        fetchFirmwares();
      } else {
        show(data.message || 'فشل التحميل', 'error');
      }
    } catch (err) {
      show('حدث خطأ في الاتصال', 'error');
    } finally {
      setLoading(false);
    }
  };

  const dl = (fw: Firmware) => { setSel(fw); setOpen(true); setSerial(''); setPin(''); };

  const SortBtn = ({ f, label }: { f: SortField; label: string }) => (
    <button onClick={() => toggle(f)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 600, fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
      {label}
      {field === f && (dir === 'asc' ? <ChevronUp style={{ width: 12 }} /> : <ChevronDown style={{ width: 12 }} />)}
    </button>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {toast && (
        <div className="anim-scale-in" style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: toast.type === 'success' ? '#10b981' : '#ef4444', color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>{toast.msg}</div>
      )}

      <div className="row-between anim-fade-up">
        <div>
          <h1 className="page-title">السوفتويرات</h1>
          <p className="page-desc">ابحث عن سوفتوير التلفزيون بالموديل أو الماركة</p>
        </div>
        <button onClick={fetchFirmwares} className="btn btn-ghost btn-sm"><RotateCw /> تحديث</button>
      </div>

      <div className="card anim-fade-up" style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div className="field" style={{ flex: '1 1 250px' }}>
            <span className="field-icon"><Search /></span>
            <input className="field-input" placeholder="ابحث برقم الموديل..." value={q} onChange={e => setQ(e.target.value)} />
            {q && <span className="field-icon-left" onClick={() => setQ('')} style={{ cursor: 'pointer' }}><X style={{ width: 16 }} /></span>}
          </div>
          <div className="field" style={{ flex: '0 0 200px' }}>
            <span className="field-icon"><Filter /></span>
            <select className="field-select" value={brandFilter} onChange={e => setBrandFilter(e.target.value)}>
              <option value="">جميع الماركات</option>
              {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          </div>
          {(q || brandFilter) && (
            <button onClick={() => { setQ(''); setBrandFilter(''); }} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}><X /> مسح</button>
          )}
        </div>
      </div>

      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
        عدد النتائج: <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong>
      </div>

      <div className="card anim-fade-up">
        {loadingData ? (
          <div style={{ textAlign: 'center', padding: 40 }}>جاري التحميل...</div>
        ) : (
          <>
            <div className="table-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    <th><SortBtn f="brand__name" label="الماركة" /></th>
                    <th><SortBtn f="model_number" label="الموديل" /></th>
                    <th className="hidden md:table-cell"><SortBtn f="version" label="الإصدار" /></th>
                    <th className="hidden sm:table-cell"><SortBtn f="token_cost" label="التوكن" /></th>
                    <th className="hidden lg:table-cell"><SortBtn f="downloads_count" label="التحميلات" /></th>
                    <th style={{ textAlign: 'center' }}>تحميل</th>
                  </tr>
                </thead>
                <tbody>
                  {slice.length > 0 ? slice.map(fw => (
                    <tr key={fw.id}>
                      <td><span className="badge" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>{fw.brand__name}</span></td>
                      <td style={{ fontWeight: 700 }}>{fw.model_number}</td>
                      <td className="hidden md:table-cell" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{fw.version || '-'}</td>
                      <td className="hidden sm:table-cell" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                        <Coins style={{ width: 14, height: 14, marginLeft: 4 }} />{fw.token_cost}
                      </td>
                      <td className="hidden lg:table-cell">
                        <div className="row-tight" style={{ color: 'var(--text-muted)', fontSize: 13 }}><Eye style={{ width: 14, height: 14 }} /> {fw.downloads_count}</div>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button onClick={() => dl(fw)} className="btn btn-primary btn-sm"><Download /> تحميل</button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>لا توجد نتائج</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {total > 1 && (
              <div className="row-between" style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>صفحة {page} من {total}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-ghost btn-sm">السابق</button>
                  {Array.from({ length: total }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} className={page === p ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}>{p}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(total, p + 1))} disabled={page === total} className="btn btn-ghost btn-sm">التالي</button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="تأكيد التحميل">
        {sel && (
          <div>
            <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', fontSize: 13 }}>
                <div><span style={{ color: 'var(--text-muted)' }}>الماركة: </span><strong>{sel.brand__name}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>الموديل: </span><strong>{sel.model_number}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>التوكن: </span><strong style={{ color: 'var(--primary)' }}>{sel.token_cost}</strong></div>
                <div><span style={{ color: 'var(--text-muted)' }}>الإصدار: </span><strong>{sel.version || '-'}</strong></div>
              </div>
            </div>

            <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>رقم السيريال</label>
                <input className="field-input" value={serial} onChange={e => setSerial(e.target.value)} placeholder="أدخل رقم السيريال" required disabled={loading} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>رمز البين (PIN)</label>
                <input className="field-input" type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="أدخل رمز البين" required disabled={loading} />
              </div>
              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'جاري التحميل...' : <><Coins /> تأكيد الخصم والتحميل</>}
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}
