import { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { downloadHistory, storeOrders } from '../data/mockData';
import StatCard from '../components/UI/StatCard';
import Modal from '../components/UI/Modal';
import {
  User, Download, ShoppingCart, Key, Search, Plus, CheckCircle, X,
  Clock, Truck, Package, AlertCircle, Mail, Phone, Calendar, Shield, Star,
  Copy, RotateCw, ChevronUp, ChevronDown, Lock, Eye, EyeOff
} from 'lucide-react';

function useToast() {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const show = (msg: string, type: 'success' | 'error' = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };
  return { toast, show };
}

type SortField = 'date' | 'title' | 'size';
function useSort<T>(data: T[], defaultField: SortField) {
  const [field, setField] = useState<SortField>(defaultField);
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');
  const sorted = useMemo(() => [...data].sort((a: any, b: any) => {
    if (dir === 'asc') return a[field] > b[field] ? 1 : -1;
    return a[field] < b[field] ? 1 : -1;
  }), [data, field, dir]);
  return { sorted, field, dir, toggle: (f: SortField) => { if (field === f) setDir(d => d === 'asc' ? 'desc' : 'asc'); else { setField(f); setDir('desc'); } } };
}

function usePagination<T>(data: T[], perPage = 8) {
  const [page, setPage] = useState(1);
  const total = Math.ceil(data.length / perPage);
  const slice = useMemo(() => data.slice((page - 1) * perPage, page * perPage), [data, page, perPage]);
  return { slice, page, total, setPage };
}

const statusCfg: Record<string, { label: string; color: string; bg: string; Icon: typeof Clock }> = {
  pending: { label: 'قيد الانتظار', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', Icon: Clock },
  processing: { label: 'قيد التجهيز', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', Icon: Package },
  shipped: { label: 'تم الشحن', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', Icon: Truck },
  delivered: { label: 'تم التوصيل', color: '#10b981', bg: 'rgba(16,185,129,0.1)', Icon: CheckCircle },
};

type Tab = 'info' | 'downloads' | 'serial' | 'orders' | 'password';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [tab, setTab] = useState<Tab>('info');
  const [q, setQ] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [checkModal, setCheckModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [newSer, setNewSer] = useState('');
  const [checkSer, setCheckSer] = useState('');
  const [result, setResult] = useState<{ balance: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast, show } = useToast();
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState({ old: '', newP: '', confirm: '' });

  useEffect(() => { setTimeout(() => setLoading(false), 600); }, []);

  const filteredDl = useMemo(() => {
    if (!q.trim()) return downloadHistory;
    return downloadHistory.filter(d => d.title.toLowerCase().includes(q.toLowerCase()));
  }, [q]);

  const { sorted, field, dir, toggle } = useSort(filteredDl, 'date');
  const { slice, page, total, setPage } = usePagination(sorted);

  useEffect(() => { setPage(1); }, [q]);

  const copySerial = () => {
    if (user?.serialCode) { navigator.clipboard.writeText(user.serialCode); show('تم نسخ كود السيريال'); }
  };

  const refresh = () => { setLoading(true); setTimeout(() => setLoading(false), 500); show('تم تحديث البيانات', 'success'); };

  const Skeleton = () => <div className="skeleton" style={{ height: 200, borderRadius: 20 }} />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {toast && (
        <div className="anim-scale-in" style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: toast.type === 'success' ? '#10b981' : '#ef4444', color: '#fff', padding: '12px 24px', borderRadius: 12, fontWeight: 700, fontSize: 14, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>{toast.msg}</div>
      )}

      <div className="row-between anim-fade-up">
        <div><h1 className="page-title">حسابي</h1><p className="page-desc">إدارة حسابك والسيريالات والتحميلات</p></div>
        <div className="row" style={{ gap: 8 }}>
          <button onClick={refresh} className="btn btn-ghost btn-sm"><RotateCw /></button>
          <button onClick={() => setLogoutModal(true)} className="btn btn-danger btn-sm">تسجيل خروج</button>
        </div>
      </div>

      {loading ? <Skeleton /> : (
        <div className="card anim-fade-up" style={{ overflow: 'hidden' }}>
          <div style={{ height: 80, background: 'var(--grad-primary)', position: 'relative' }}>
            <div style={{ position: 'absolute', bottom: -32, right: 24, width: 64, height: 64, borderRadius: 16, background: 'var(--grad-accent)', border: '4px solid var(--bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 22, fontWeight: 900, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
          </div>
          <div style={{ padding: '44px 24px 20px' }}>
            <div style={{ fontSize: 18, fontWeight: 900 }}>{user?.name || 'مستخدم'}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{user?.email || 'لا يوجد بريد'}</div>
          </div>
        </div>
      )}

      <div className="anim-fade-up" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {[{ key: 'info', label: 'معلوماتي', Icon: User }, { key: 'downloads', label: 'التحميلات', Icon: Download }, { key: 'serial', label: 'السيريال', Icon: Key }, { key: 'orders', label: 'الطلبات', Icon: ShoppingCart }, { key: 'password', label: 'كلمة المرور', Icon: Lock }].map(t => (
          <button key={t.key} onClick={() => setTab(t.key as Tab)} className={tab === t.key ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}><t.Icon style={{ width: 18 }} /> {t.label}</button>
        ))}
      </div>

      {/* INFO */}
      {tab === 'info' && (loading ? <Skeleton /> : (
        <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>المعلومات الشخصية</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ Icon: User, l: 'الاسم', v: user?.name }, { Icon: Mail, l: 'البريد', v: user?.email }, { Icon: Phone, l: 'الهاتف', v: user?.phone }, { Icon: Calendar, l: 'تاريخ الانضمام', v: user?.joinDate }, { Icon: Shield, l: 'السيريال', v: user?.serialCode }, { Icon: Star, l: 'الباقة', v: user?.plan }].map((it, i) => (
                <div key={i} className="row" style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 14 }}>
                  <div className="icon-box icon-box-sm" style={{ background: 'rgba(99,102,241,0.08)', color: 'var(--primary)', borderRadius: 10 }}><it.Icon style={{ width: 16 }} /></div>
                  <div><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{it.l}</div><div style={{ fontSize: 14, fontWeight: 700 }}>{it.v || 'غير متوفر'}</div></div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <StatCard icon={<Download style={{ width: 24 }} />} label="التحميلات المتبقية" value={user?.remainingDownloads || 0} subtitle="من أصل 200" gradient="var(--grad-primary)" />
            <StatCard icon={<Shield style={{ width: 24 }} />} label="إجمالي التحميلات" value={user?.totalDownloads || 0} subtitle="منذ الاشتراك" gradient="var(--grad-success)" />
          </div>
        </div>
      ))}

      {/* DOWNLOADS */}
      {tab === 'downloads' && (
        <div className="card anim-fade-up">
          <div className="row-between" style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
            <div className="field" style={{ maxWidth: 280 }}>
              <span className="field-icon"><Search /></span>
              <input className="field-input" placeholder="ابحث..." value={q} onChange={e => setQ(e.target.value)} />
              {q && <span className="field-icon-left" onClick={() => setQ('')} style={{ cursor: 'pointer' }}><X style={{ width: 16 }} /></span>}
            </div>
          </div>
          <div className="table-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th>الملف <button onClick={() => toggle('title')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', verticalAlign: 'middle' }}>{field === 'title' ? (dir === 'asc' ? <ChevronUp style={{ width: 14 }} /> : <ChevronDown style={{ width: 14 }} />) : null}</button></th>
                  <th className="hidden sm:table-cell">النوع</th>
                  <th className="hidden md:table-cell">الحجم <button onClick={() => toggle('size')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>{field === 'size' ? (dir === 'asc' ? <ChevronUp style={{ width: 14 }} /> : <ChevronDown style={{ width: 14 }} />) : null}</button></th>
                  <th>التاريخ <button onClick={() => toggle('date')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}>{field === 'date' ? (dir === 'asc' ? <ChevronUp style={{ width: 14 }} /> : <ChevronDown style={{ width: 14 }} />) : null}</button></th>
                </tr>
              </thead>
              <tbody>
                {slice.length > 0 ? slice.map(d => (
                  <tr key={d.id}>
                    <td style={{ fontWeight: 600 }}>{d.title}</td>
                    <td className="hidden sm:table-cell"><span className="badge" style={{ background: d.type === 'سوفتوير' ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)', color: d.type === 'سوفتوير' ? '#6366f1' : '#10b981' }}>{d.type}</span></td>
                    <td className="hidden md:table-cell" style={{ color: 'var(--text-secondary)' }}>{d.size}</td>
                    <td style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{d.date}</td>
                  </tr>
                )) : <tr><td colSpan={4} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>لا توجد نتائج</td></tr>}
              </tbody>
            </table>
          </div>
          {total > 1 && (
            <div className="row-between" style={{ padding: '12px 20px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>صفحة {page} من {total}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-ghost btn-sm">السابق</button>
                <button onClick={() => setPage(p => Math.min(total, p + 1))} disabled={page === total} className="btn btn-ghost btn-sm">التالي</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* SERIAL */}
      {tab === 'serial' && (
        <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
          <div className="card" style={{ padding: 24 }}>
            <div className="row" style={{ marginBottom: 20 }}>
              <div className="icon-box icon-box-md" style={{ background: 'var(--grad-primary)' }}><Key style={{ width: 20 }} /></div>
              <div><div style={{ fontSize: 15, fontWeight: 800 }}>السيريال الحالي</div><div style={{ fontSize: 12, color: 'var(--text-muted)' }}>معلومات السيريال النشط</div></div>
            </div>
            <div className="anim-glow" style={{ background: 'var(--bg-primary)', borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>كود السيريال</div>
              <div className="row" style={{ justifyContent: 'center', gap: 8 }}>
                <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)', fontFamily: 'monospace' }}>{user?.serialCode || 'لا يوجد'}</span>
                <button onClick={copySerial} className="btn btn-ghost btn-sm"><Copy style={{ width: 16 }} /></button>
              </div>
              {user?.remainingDownloads !== undefined && user?.totalDownloads ? (
                <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ width: `${(user.remainingDownloads / (user.remainingDownloads + user.totalDownloads)) * 100}%`, height: '100%', background: 'var(--grad-primary)', transition: 'width 0.5s' }} />
                </div>
              ) : null}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 16, textAlign: 'center' }}><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>المتبقي</div><div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>{user?.remainingDownloads || 0}</div></div>
              <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 16, textAlign: 'center' }}><div style={{ fontSize: 11, color: 'var(--text-muted)' }}>المستخدم</div><div style={{ fontSize: 28, fontWeight: 900, color: '#6366f1' }}>{user?.totalDownloads || 0}</div></div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setAddModal(true)} className="btn btn-primary" style={{ flex: 1 }}><Plus /> إضافة</button>
              <button onClick={() => { setCheckModal(true); setResult(null); setCheckSer(''); }} className="btn btn-ghost" style={{ flex: 1 }}><Search /> فحص</button>
            </div>
          </div>
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 16 }}>ملاحظات</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[{ Icon: AlertCircle, t: 'كل سيريال يحتوي على عدد محدد من التحميلات', c: '#f59e0b' }, { Icon: Shield, t: 'لا يمكن استخدام نفس السيريال على أكثر من جهاز', c: '#6366f1' }, { Icon: CheckCircle, t: 'يمكنك إضافة سيريال جديد لزيادة رصيد التحميلات', c: '#10b981' }, { Icon: Key, t: 'احتفظ بكود السيريال في مكان آمن', c: '#ef4444' }].map((tip, i) => (
                <div key={i} className="row" style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 14, alignItems: 'flex-start' }}><tip.Icon style={{ width: 20, height: 20, color: tip.c, flexShrink: 0, marginTop: 2 }} /><span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{tip.t}</span></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ORDERS */}
      {tab === 'orders' && (
        <div className="card anim-fade-up">
          <div className="table-wrap">
            <table className="tbl">
              <thead><tr><th>رقم الطلب</th><th>المنتج</th><th className="hidden sm:table-cell">السعر</th><th>الحالة</th><th className="hidden md:table-cell">التاريخ</th></tr></thead>
              <tbody>
                {storeOrders.length > 0 ? storeOrders.map(o => { const s = statusCfg[o.status] || { label: 'غير معروف', color: '#9ca3af', bg: 'rgba(156,163,175,0.1)', Icon: Clock }; return (<tr key={o.id}><td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{o.orderNumber}</td><td style={{ fontWeight: 600 }}>{o.product}</td><td className="hidden sm:table-cell" style={{ color: 'var(--text-secondary)' }}>{o.price} ر.س</td><td><span className="badge" style={{ background: s.bg, color: s.color }}><s.Icon style={{ width: 14 }} /> {s.label}</span></td><td className="hidden md:table-cell" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>{o.date}</td></tr>); }) : <tr><td colSpan={5} style={{ textAlign: 'center', padding: 30, color: 'var(--text-muted)' }}>لا توجد طلبات</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* PASSWORD */}
      {tab === 'password' && (
        <div className="card anim-fade-up" style={{ padding: 24, maxWidth: 500 }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 20 }}>تغيير كلمة المرور</div>
          <form onSubmit={e => { e.preventDefault(); if (pw.newP !== pw.confirm) { show('كلمتا المرور غير متطابقتين', 'error'); return; } show('تم تغيير كلمة المرور'); setPw({ old: '', newP: '', confirm: '' }); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {['القديمة', 'الجديدة', 'تأكيد الجديدة'].map((l, i) => (
              <div key={i} className="field">
                <span className="field-icon"><Lock /></span>
                <input className="field-input field-input-both" type={showPw ? 'text' : 'password'} placeholder={`كلمة المرور ${l}`} value={i === 0 ? pw.old : i === 1 ? pw.newP : pw.confirm} onChange={e => setPw(prev => i === 0 ? { ...prev, old: e.target.value } : i === 1 ? { ...prev, newP: e.target.value } : { ...prev, confirm: e.target.value })} />
                <span className="field-icon-left" onClick={() => setShowPw(!showPw)} style={{ cursor: 'pointer' }}>{showPw ? <EyeOff style={{ width: 18 }} /> : <Eye style={{ width: 18 }} />}</span>
              </div>
            ))}
            <button type="submit" className="btn btn-primary btn-block">تحديث كلمة المرور</button>
          </form>
        </div>
      )}

      {/* MODALS */}
      <Modal isOpen={addModal} onClose={() => setAddModal(false)} title="إضافة سيريال جديد" size="sm">
        <form onSubmit={e => { e.preventDefault(); show('تم إضافة السيريال بنجاح'); setAddModal(false); setNewSer(''); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label htmlFor="new-serial-input" style={{ fontSize: 13, fontWeight: 700 }}>كود السيريال</label>
          <input id="new-serial-input" className="field-input" value={newSer} onChange={e => setNewSer(e.target.value)} placeholder="أدخل كود السيريال الجديد" required />
          <button type="submit" className="btn btn-primary btn-block">إضافة السيريال</button>
        </form>
      </Modal>

      <Modal isOpen={checkModal} onClose={() => setCheckModal(false)} title="فحص رصيد سيريال" size="sm">
        <form onSubmit={e => { e.preventDefault(); setResult({ balance: 47 }); }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label htmlFor="check-serial-input" style={{ fontSize: 13, fontWeight: 700 }}>كود السيريال</label>
          <input id="check-serial-input" className="field-input" value={checkSer} onChange={e => setCheckSer(e.target.value)} placeholder="أدخل كود السيريال للفحص" required />
          <button type="submit" className="btn btn-primary btn-block">فحص الرصيد</button>
        </form>
        {result && (
          <div className="anim-scale-in" style={{ marginTop: 16, padding: 20, borderRadius: 14, textAlign: 'center', background: 'rgba(16,185,129,0.08)', border: '1.5px solid rgba(16,185,129,0.2)' }}>
            <CheckCircle style={{ width: 40, height: 40, color: '#10b981', margin: '0 auto 10px' }} />
            <div style={{ fontWeight: 800, marginBottom: 6 }}>السيريال صالح</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>{result.balance} تحميل متبقي</div>
          </div>
        )}
      </Modal>

      <Modal isOpen={logoutModal} onClose={() => setLogoutModal(false)} title="تأكيد تسجيل الخروج" size="sm">
        <p style={{ marginBottom: 20, color: 'var(--text-secondary)' }}>هل أنت متأكد من تسجيل الخروج؟</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { logout(); setLogoutModal(false); }} className="btn btn-danger" style={{ flex: 1 }}>تأكيد</button>
          <button onClick={() => setLogoutModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}