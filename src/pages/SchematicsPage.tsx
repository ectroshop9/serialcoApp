import { useState } from 'react';
import { schematicsData, brands, type Schematic } from '../data/mockData';
import Modal from '../components/UI/Modal';
import { Search, Filter, Download, FileText, Eye, X, Zap, Cpu, Monitor } from 'lucide-react';

const cats = [
  { value: '', label: 'جميع التصنيفات', icon: FileText },
  { value: 'power-supply', label: 'باور سبلاي', icon: Zap },
  { value: 'main-board', label: 'مين بورد', icon: Cpu },
  { value: 't-con', label: 'تي-كون', icon: Monitor },
];

const catLabel: Record<string, string> = { 'power-supply': 'باور سبلاي', 'main-board': 'مين بورد', 't-con': 'تي-كون' };
const catColor: Record<string, [string, string]> = {
  'power-supply': ['rgba(245,158,11,0.1)', '#f59e0b'],
  'main-board': ['rgba(99,102,241,0.1)', '#6366f1'],
  't-con': ['rgba(16,185,129,0.1)', '#10b981'],
};

export default function SchematicsPage() {
  const [q, setQ] = useState('');
  const [brand, setBrand] = useState('');
  const [cat, setCat] = useState('');
  const [sel, setSel] = useState<Schematic | null>(null);
  const [open, setOpen] = useState(false);
  const [serial, setSerial] = useState('');
  const [pin, setPin] = useState('');
  const [started, setStarted] = useState(false);

  const filtered = schematicsData.filter(s => {
    const ms = s.title.toLowerCase().includes(q.toLowerCase()) || s.model.toLowerCase().includes(q.toLowerCase());
    return ms && (!brand || s.brand === brand) && (!cat || s.category === cat);
  });

  const dl = (s: Schematic) => { setSel(s); setOpen(true); setSerial(''); setPin(''); setStarted(false); };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="anim-fade-up">
        <h1 className="page-title">المخططات</h1>
        <p className="page-desc">مخططات كهربائية للتلفزيونات — باور سبلاي، مين بورد، تي-كون</p>
      </div>

      {/* Category tabs */}
      <div className="anim-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {cats.map(c => (
          <button
            key={c.value}
            onClick={() => setCat(c.value)}
            className={cat === c.value ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
          >
            <c.icon /> {c.label}
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="card anim-fade-up" style={{ padding: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div className="field" style={{ flex: '1 1 250px' }}>
            <span className="field-icon"><Search /></span>
            <input className="field-input" placeholder="ابحث بالعنوان أو رقم الموديل..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
          <div className="field" style={{ flex: '0 0 200px' }}>
            <span className="field-icon"><Filter /></span>
            <select className="field-select" value={brand} onChange={e => setBrand(e.target.value)}>
              <option value="">جميع الماركات</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          {(q || brand || cat) && (
            <button onClick={() => { setQ(''); setBrand(''); setCat(''); }} className="btn btn-ghost btn-sm" style={{ color: '#ef4444' }}>
              <X /> مسح
            </button>
          )}
        </div>
      </div>

      <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
        عدد النتائج: <strong style={{ color: 'var(--text-primary)' }}>{filtered.length}</strong>
      </div>

      {/* Table */}
      <div className="card anim-fade-up">
        <div className="table-wrap">
          <table className="tbl">
            <thead>
              <tr>
                <th>العنوان</th>
                <th className="hidden sm:table-cell">التصنيف</th>
                <th className="hidden md:table-cell">الموديل</th>
                <th className="hidden lg:table-cell">الحجم</th>
                <th className="hidden lg:table-cell">التحميلات</th>
                <th style={{ textAlign: 'center' }}>إجراء</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => {
                const cc = catColor[s.category];
                return (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 600 }}>{s.title}</td>
                    <td className="hidden sm:table-cell">
                      <span className="badge" style={{ background: cc?.[0], color: cc?.[1] }}>{catLabel[s.category]}</span>
                    </td>
                    <td className="hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>{s.model}</td>
                    <td className="hidden lg:table-cell" style={{ color: 'var(--text-secondary)' }}>{s.size}</td>
                    <td className="hidden lg:table-cell">
                      <div className="row-tight" style={{ color: 'var(--text-muted)', fontSize: 13 }}>
                        <Eye style={{ width: 14, height: 14 }} /> {s.downloads}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => dl(s)} className="btn btn-success btn-sm">
                        <Download /> تحميل
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <FileText />
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>لا توجد نتائج</div>
            <div>جرّب البحث بعنوان أو ماركة مختلفة</div>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title="تحميل المخطط">
        {sel && (
          <div>
            <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 16, marginBottom: 20, border: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text-primary)', marginBottom: 8 }}>{sel.title}</div>
              <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
                <span style={{ color: 'var(--text-muted)' }}>الموديل: <b style={{ color: 'var(--text-primary)' }}>{sel.model}</b></span>
                <span style={{ color: 'var(--text-muted)' }}>الحجم: <b style={{ color: 'var(--text-primary)' }}>{sel.size}</b></span>
              </div>
            </div>

            {!started ? (
              <form onSubmit={e => { e.preventDefault(); setStarted(true); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>رقم السيريال</label>
                  <input className="field-input" style={{ paddingRight: 16 }} value={serial} onChange={e => setSerial(e.target.value)} placeholder="أدخل رقم السيريال" required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>رمز البين (PIN)</label>
                  <input className="field-input" style={{ paddingRight: 16 }} type="password" value={pin} onChange={e => setPin(e.target.value)} placeholder="أدخل رمز البين" required />
                </div>
                <button type="submit" className="btn btn-success btn-block"><Download /> تأكيد وتحميل</button>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: 16 }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px', background: 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Download style={{ width: 28, height: 28, color: '#10b981', animation: 'float 1s ease-in-out infinite' }} />
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>جاري التحميل...</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>سيبدأ التحميل تلقائياً خلال لحظات</div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
