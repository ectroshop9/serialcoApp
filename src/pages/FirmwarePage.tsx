import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { firmwareData, brands, type Firmware } from '../data/mockData';
import Modal from '../components/UI/Modal';
import { Search, Filter, Download, Eye, X, ChevronUp, ChevronDown, RotateCw, Coins } from 'lucide-react';

function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const show = (msg: string, type: 'success' | 'error' = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  return { toast, show };
}

type SortField = 'brand' | 'model' | 'version' | 'downloads' | 'size';
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
  const [brand, setBrand] = useState(searchParams.get('brand') || '');
  const [sel, setSel] = useState<Firmware | null>(null);
  const [open, setOpen] = useState(false);
  const [serial, setSerial] = useState('');
  const [pin, setPin] = useState('');
  const [started, setStarted] = useState(false);
  const { toast, show } = useToast();

  useEffect(() => {
    const params: Record<string, string> = {};
    if (q) params.q = q;
    if (brand) params.brand = brand;
    setSearchParams(params, { replace: true });
  }, [q, brand]);

  const filtered = useMemo(() => firmwareData.filter(fw => {
    const s = fw.model.toLowerCase().includes(q.toLowerCase()) || fw.brand.toLowerCase().includes(q.toLowerCase());
    return s && (!brand || fw.brand === brand);
  }), [q, brand]);

  const { sorted, field, dir, toggle } = useSort(filtered, 'brand');
  const { slice, page, total, setPage } = usePagination(sorted);
  useEffect(() => { setPage(1); }, [q, brand]);

  const dl = (fw: Firmware) => { setSel(fw); setOpen(true); setSerial(''); setPin(''); setStarted(false); };

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setStarted(true);
    setTimeout(() => {
      show(`تم استخدام التوكن لـ ${sel?.model}`);
      setOpen(false);
    }, 2000);
  };

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
        <button onClick={() => { setQ(''); setBrand(''); }} className="btn btn-ghost btn-sm"><RotateCw /> تحديث</button>
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
            <select className="field-select" value={brand} onChange={e => setBrand(e.target.value)}>
              <option value="">جميع الماركات</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          {(q || brand) && (
            <button onClick={() => { setQ(''); setBrand(''); }} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}><X /> مسح</button>
          )}
        </div>
      </div>

      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
        عدد النتائج: <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong>
      </div>

      <div className="card anim-fade-up">
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th><SortBtn f="brand" label="الماركة" /></th>
                <th><SortBtn f="model" label="الموديل" /></th>
                <th className="hidden md:table-cell"><SortBtn f="version" label="الإصدار" /></th>
                <th className="hidden lg:table-cell">النوع</th>
                <th className="hidden sm:table-cell"><SortBtn f="size" label="التوكن" /></th>
                <th className="hidden lg:table-cell"><SortBtn f="downloads" label="التحميلات" /></th>
                <th style={{ textAlign: 'center' }}>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {slice.length > 0 ? slice.map(fw => (
                <tr key={fw.id}>
                  <td><span className="badge" style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1' }}>{fw.brand}</span></td>
                  <td style={{ fontWeight: 700 }}>{fw.model}</td>
                  <td className="hidden md:table-cell" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{fw.version}</td>
                  <td className="hidden lg:table-cell">
                    <span className="badge" style={{ background: fw.type === 'Full Dump' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)', color: fw.type === 'Full Dump' ? '#f59e0b' : '#10b981' }}>{fw.type}</span>
                  </td>
                  <td className="hidden sm:table-cell" style={{ color: 'var(--primary)', fontWeight: 700 }}>
                    <Coins style={{ width: 14, height: 14, marginLeft: 4 }} />{fw.size}
                  </td>
                  <td className="hidden lg:table-cell">
                    <div className="row-tight" style={{ color: 'var(--text-muted)', fontSize: 13 }}><Eye style={{ width: 14, height: 14 }} /> {fw.downloads}</div>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button onClick={() => dl(fw)} className="btn btn-primary btn-sm"><Download /> استخدام التوكن</button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>لا توجد نتائج</td></tr>
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
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="استخدام التوكن">
        {sel && (
          <div>
            <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid var(--border)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 20px', fontSize: 13 }}>
                {[['الماركة', sel.brand], ['الموديل', sel.model], ['التوكن', sel.size], ['النوع', sel.type]].map(([l, v]) => (
                  <div key={l}><span style={{ color: 'var(--text-muted)' }}>{l}: </span><strong style={{ color: 'var(--text-primary)' }}>{v}</strong></div>
                ))}
              </div>
            </div>

            {!started ? (
              <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>رقم السيريال</label>
                  <input className="field-input" style={{ paddingRight: 16 }} value={serial} onChange={e => setSerial(e.target.value)} placeholder="أدخل رقم السيريال" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>رمز البين (PIN)</label>
                  <input className="field-input" style={{ paddingRight: 16 }} type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="أدخل رمز البين" required />
                </div>
                <button type="submit" className="btn btn-primary btn-block"><Coins /> استخدام التوكن</button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Coins style={{ width: 28, height: 28, color: '#10b981', animation: 'float 1s ease-in-out infinite' }} />
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>جاري خصم التوكن...</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>سيتم خصم التوكن من رصيدك</div>
                <div style={{ width: '100%', height: 8, borderRadius: 10, background: 'var(--bg-primary)', overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', borderRadius: 10, background: 'var(--grad-success)', animation: 'pulseGlow 1.5s infinite' }} />
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}