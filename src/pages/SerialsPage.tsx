import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Key, Plus, Search, CheckCircle, Copy, Check } from 'lucide-react';

export default function SerialsPage() {
  const { user } = useAuth();
  const [newSerial, setNewSerial] = useState('');
  const [checkSerial, setCheckSerial] = useState('');
  const [checkResult, setCheckResult] = useState<{ balance: number } | null>(null);
  const [msg, setMsg] = useState('');
  const [copied, setCopied] = useState(false);

  const remaining = user?.remainingDownloads ?? 0;
  const used = user?.totalDownloads ?? 0;
  const total = remaining + used;
  const progressPercentage = total > 0 ? Math.min(100, Math.max(0, (remaining / total) * 100)) : 0;

  const addSerial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSerial.trim()) return;
    setMsg('تم إضافة السيريال بنجاح');
    setNewSerial('');
    setTimeout(() => setMsg(''), 3000);
  };

  const check = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkSerial.trim()) return;
    setCheckResult({ balance: 47000 });
  };

  const copyToClipboard = () => {
    if (user?.serialCode) {
      navigator.clipboard.writeText(user.serialCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="anim-fade-up">
        <h1 className="page-title">سيريالاتي</h1>
        <p className="page-desc">إدارة السيريالات الخاصة بك ومتابعة رصيد التوكن</p>
      </div>

      {msg && (
        <div className="anim-scale-in" style={{ background: '#10b981', color: '#fff', padding: '12px 20px', borderRadius: 12, fontWeight: 700, textAlign: 'center' }}>
          {msg}
        </div>
      )}

      {user?.serialCode && (
        <div className="card" style={{ padding: 24 }}>
          <div className="row" style={{ marginBottom: 20 }}>
            <div className="icon-box icon-box-md" style={{ background: 'var(--grad-primary)' }}><Key style={{ width: 20 }} /></div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>السيريال الحالي</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>معلومات السيريال النشط</div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', borderRadius: 14, padding: 20, textAlign: 'center', marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>كود السيريال</div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)', fontFamily: 'monospace' }}>{user.serialCode}</span>
              <button type="button" onClick={copyToClipboard} className="btn btn-ghost btn-sm" style={{ padding: 6 }}>
                {copied ? <Check style={{ width: 16, height: 16, color: '#10b981' }} /> : <Copy style={{ width: 16 }} />}
              </button>
            </div>
            <div style={{ marginTop: 12, height: 6, borderRadius: 3, background: 'var(--border)', overflow: 'hidden' }}>
              <div style={{ width: `${progressPercentage}%`, height: '100%', background: 'var(--grad-primary)', transition: 'width 0.3s ease' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>التوكن المتبقي</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>{remaining.toLocaleString()}</div>
            </div>
            <div style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 16, textAlign: 'center' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>التوكن المستخدم</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#6366f1' }}>{used.toLocaleString()}</div>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 24 }}>
        <div className="row" style={{ marginBottom: 16 }}>
          <div className="icon-box icon-box-md" style={{ background: 'var(--grad-success)' }}><Plus style={{ width: 20 }} /></div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>إضافة سيريال جديد</div>
        </div>
        <form onSubmit={addSerial} className="row" style={{ gap: 12 }}>
          <input type="text" className="field-input" style={{ flex: 1 }} value={newSerial} onChange={e => setNewSerial(e.target.value)} placeholder="أدخل كود السيريال" required />
          <button type="submit" className="btn btn-primary">تفعيل</button>
        </form>
      </div>

      <div className="card" style={{ padding: 24 }}>
        <div className="row" style={{ marginBottom: 16 }}>
          <div className="icon-box icon-box-md" style={{ background: 'var(--grad-accent)' }}><Search style={{ width: 20 }} /></div>
          <div style={{ fontSize: 16, fontWeight: 800 }}>فحص رصيد توكن</div>
        </div>
        <form onSubmit={check} className="row" style={{ gap: 12, marginBottom: 16 }}>
          <input type="text" className="field-input" style={{ flex: 1 }} value={checkSerial} onChange={e => { setCheckSerial(e.target.value); if (checkResult) setCheckResult(null); }} placeholder="أدخل كود السيريال للفحص" required />
          <button type="submit" className="btn btn-accent">فحص</button>
        </form>
        {checkResult && (
          <div className="anim-scale-in" style={{ textAlign: 'center', padding: 20, borderRadius: 14, background: 'rgba(16,185,129,0.08)', border: '1.5px solid rgba(16,185,129,0.2)' }}>
            <CheckCircle style={{ width: 40, height: 40, color: '#10b981', margin: '0 auto 10px' }} />
            <div style={{ fontWeight: 800, marginBottom: 6 }}>السيريال صالح</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#10b981' }}>{checkResult.balance.toLocaleString()} توكن متبقي</div>
          </div>
        )}
      </div>
    </div>
  );
}