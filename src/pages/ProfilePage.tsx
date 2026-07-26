import { useState, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/UI/Modal';
import { User, Key, Lock, Eye, EyeOff, Coins, LogOut } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [pw, setPw] = useState({ old: '', newP: '', confirm: '' });
  const [msg, setMsg] = useState('');
  const [logoutModal, setLogoutModal] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/accounts/profile/', { headers: { 'Authorization': `Bearer ${token}` } });
      const data = await res.json();
      if (data.success) setProfile(data.customer);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handlePassword = async (e: FormEvent) => {
    e.preventDefault();
    if (pw.newP !== pw.confirm) { setMsg('كلمتا المرور غير متطابقتين'); return; }
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/accounts/update-profile/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ password: pw.newP })
      });
      const data = await res.json();
      setMsg(data.success ? 'تم تغيير كلمة المرور' : data.message);
      setPw({ old: '', newP: '', confirm: '' });
    } catch (err) { setMsg('خطأ في الاتصال'); }
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}>جاري التحميل...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="row-between">
        <h1 className="page-title">حسابي</h1>
        <button onClick={() => setLogoutModal(true)} className="btn btn-danger btn-sm"><LogOut /> خروج</button>
      </div>

      {msg && <div style={{ padding: 12, borderRadius: 12, background: msg.includes('تم') ? '#10b981' : '#ef4444', color: '#fff', textAlign: 'center' }}>{msg}</div>}

      <div className="card" style={{ padding: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 900 }}>{profile?.name || user?.name}</div>
        <div style={{ color: 'var(--text-secondary)' }}>{profile?.email || profile?.phone || '-'}</div>
      </div>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <Coins style={{ width: 24, height: 24, color: 'var(--primary)' }} />
          <div style={{ fontSize: 24, fontWeight: 900 }}>{profile?.token_balance || 0}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>رصيد التوكن</div>
        </div>
        <div className="card" style={{ padding: 20, textAlign: 'center' }}>
          <User style={{ width: 24, height: 24, color: 'var(--success)' }} />
          <div style={{ fontSize: 16, fontWeight: 700 }}>{profile?.is_active ? 'نشط' : 'غير نشط'}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>حالة الحساب</div>
        </div>
      </div>

      <div className="card" style={{ padding: 24, maxWidth: 500 }}>
        <h3 style={{ marginBottom: 16 }}><Lock /> تغيير كلمة المرور</h3>
        <form onSubmit={handlePassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="field">
            <input className="field-input" type={showPw ? 'text' : 'password'} placeholder="كلمة المرور الجديدة" value={pw.newP} onChange={e => setPw({ ...pw, newP: e.target.value })} required />
            <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', left: 12 }}>{showPw ? <EyeOff /> : <Eye />}</button>
          </div>
          <div className="field">
            <input className="field-input" type={showPw ? 'text' : 'password'} placeholder="تأكيد كلمة المرور" value={pw.confirm} onChange={e => setPw({ ...pw, confirm: e.target.value })} required />
          </div>
          <button type="submit" className="btn btn-primary btn-block">تحديث</button>
        </form>
      </div>

      <Modal isOpen={logoutModal} onClose={() => setLogoutModal(false)} title="تأكيد الخروج">
        <p style={{ marginBottom: 20 }}>هل أنت متأكد؟</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => { logout(); setLogoutModal(false); }} className="btn btn-danger" style={{ flex: 1 }}>خروج</button>
          <button onClick={() => setLogoutModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>إلغاء</button>
        </div>
      </Modal>
    </div>
  );
}
