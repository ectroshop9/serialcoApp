import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { serviceCodes } from '../data/mockData';
import { Search, ChevronDown, ChevronUp, Zap, ArrowRight } from 'lucide-react';

export default function ServiceCodesPage() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [q, setQ] = useState('');

  const filtered = serviceCodes.filter(b =>
    !q || b.brand.toLowerCase().includes(q.toLowerCase()) ||
    b.codes.some(c => c.code.toLowerCase().includes(q.toLowerCase()) || c.description.includes(q))
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <button onClick={() => navigate('/tools')} className="btn btn-ghost btn-sm"><ArrowRight /> الأدوات</button>
      <h1 className="page-title">أكواد الخدمة السرية</h1>
      <div className="field" style={{ maxWidth: 400 }}>
        <span className="field-icon"><Search /></span>
        <input className="field-input" value={q} onChange={e => setQ(e.target.value)} placeholder="ابحث بالماركة أو الكود..." />
      </div>
      {filtered.map(b => (
        <div key={b.brand} className="card">
          <button onClick={() => setExpanded(expanded === b.brand ? null : b.brand)}
            className="row-between" style={{ width: '100%', padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer' }}>
            <div className="row"><Zap /> <span style={{ fontWeight: 800 }}>{b.brand}</span></div>
            {expanded === b.brand ? <ChevronUp /> : <ChevronDown />}
          </button>
          {expanded === b.brand && (
            <div style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {b.codes.map((c, i) => (
                <div key={i} className="row" style={{ padding: 14, borderRadius: 12, background: 'var(--bg-primary)' }}>
                  <code style={{ padding: '4px 12px', borderRadius: 8, background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontWeight: 800 }}>{c.code}</code>
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{c.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
