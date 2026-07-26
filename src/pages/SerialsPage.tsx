import React, { useState, useEffect } from 'react';
import { Plus, Search, CheckCircle } from 'lucide-react';

const API = 'https://serialcotv.onrender.com';

export default function SerialsPage() {
  const [profile, setProfile] = useState<any>(null);
  const [serialInput, setSerialInput] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [checkSerialInput, setCheckSerialInput] = useState('');
  const [checkPinInput, setCheckPinInput] = useState('');
  const [checkResult, setCheckResult] = useState<any>(null);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${API}/api/accounts/profile/`, { headers: { 'Authorization': `Bearer ${token}` } });
    const data = await res.json();
    if (data.success) setProfile(data.customer);
  };

  const linkSerial = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API}/api/accounts/link-serial/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ serial_number: serialInput, pin: pinInput })
      });
      const data = await res.json();
      setMsg(data.success ? `تم ربط السيريال! ${data.tokens_added} توكن` : data.message);
      if (data.success) { setSerialInput(''); setPinInput(''); fetchProfile(); }
    } catch (err) {
      setMsg('خطأ في الاتصال');
    }
    setLoading(false);
    setTimeout(() => setMsg(''), 4000);
  };

  const checkSerial = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/api/serials/check/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serial_number: checkSerialInput, pin: checkPinInput })
      });
      setCheckResult(await res.json());
    } catch (err) {
      setCheckResult({ success: false, message: 'خطأ في الاتصال' });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 className="page-title">سيريالاتي</h1>
      {msg && <div style={{ background: msg.includes('تم') ? '#10b981' : '#ef4444', color: '#fff', padding: 12, borderRadius: 12, textAlign: 'center' }}>{msg}</div>}

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
          <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>رصيد التوكن</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>{profile?.token_balance || 0}</div>
          </div>
          <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>الحالة</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#6366f1' }}>{profile?.is_active ? 'نشط' : 'غير نشط'}</div>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}><Plus /> تفعيل سيريال جديد</div>
          <form onSubmit={linkSerial} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="field-input" placeholder="كود السيريال" value={serialInput} onChange={e => setSerialInput(e.target.value)} required disabled={loading} />
            <input className="field-input" placeholder="PIN" value={pinInput} onChange={e => setPinInput(e.target.value)} required disabled={loading} />
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'جاري...' : 'تفعيل'}</button>
          </form>
        </div>

        <div>
          <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 12 }}><Search /> فحص سيريال</div>
          <form onSubmit={checkSerial} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <input className="field-input" placeholder="كود السيريال" value={checkSerialInput} onChange={e => setCheckSerialInput(e.target.value)} required />
            <input className="field-input" placeholder="PIN" value={checkPinInput} onChange={e => setCheckPinInput(e.target.value)} required />
            <button type="submit" className="btn btn-accent">فحص</button>
          </form>
          {checkResult && (
            <div style={{ marginTop: 16, textAlign: 'center', padding: 20, borderRadius: 14, background: checkResult.success ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
              <CheckCircle style={{ color: checkResult.success ? '#10b981' : '#ef4444' }} />
              <div>{checkResult.message}</div>
              {checkResult.success && <div style={{ fontSize: 24, fontWeight: 900 }}>{checkResult.serial?.tokens_remaining} توكن</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
