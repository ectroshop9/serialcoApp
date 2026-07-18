import { useState } from 'react';
import { smdResistorCodes, serviceCodes } from '../data/mockData';
import { Calculator, Key, Search, ChevronDown, ChevronUp, Zap } from 'lucide-react';

export default function ToolsPage() {
  const [tab, setTab] = useState<'smd' | 'codes'>('smd');
  const [smdIn, setSmdIn] = useState('');
  const [smdOut, setSmdOut] = useState('');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [codeQ, setCodeQ] = useState('');

  const calcSMD = (code: string) => {
    setSmdIn(code);
    if (code.length === 3) {
      const known = smdResistorCodes[code];
      if (known) { setSmdOut(known); return; }
      const base = parseInt(code.substring(0, 2));
      const mul = parseInt(code.substring(2));
      if (!isNaN(base) && !isNaN(mul)) {
        const v = base * Math.pow(10, mul);
        setSmdOut(v >= 1e6 ? `${(v/1e6).toFixed(1)} MΩ` : v >= 1000 ? `${(v/1000).toFixed(1)} kΩ` : `${v} Ω`);
      } else setSmdOut('كود غير صالح');
    } else if (code.length === 4) {
      const base = parseInt(code.substring(0, 3));
      const mul = parseInt(code.substring(3));
      if (!isNaN(base) && !isNaN(mul)) {
        const v = base * Math.pow(10, mul);
        setSmdOut(v >= 1e6 ? `${(v/1e6).toFixed(2)} MΩ` : v >= 1000 ? `${(v/1000).toFixed(2)} kΩ` : `${v} Ω`);
      } else setSmdOut('كود غير صالح');
    } else if (!code) setSmdOut('');
    else setSmdOut('أدخل 3 أو 4 أرقام');
  };

  const filteredCodes = serviceCodes.filter(b =>
    !codeQ || b.brand.toLowerCase().includes(codeQ.toLowerCase()) ||
    b.codes.some(c => c.code.toLowerCase().includes(codeQ.toLowerCase()) || c.description.includes(codeQ))
  );

  const isErr = smdOut.includes('غير') || smdOut.includes('أدخل');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="anim-fade-up">
        <h1 className="page-title">الأدوات</h1>
        <p className="page-desc">أدوات مساعدة للفنيين — حاسبة مقاومة SMD وأكواد الخدمة</p>
      </div>

      {/* Tabs */}
      <div className="anim-fade-up" style={{ display: 'flex', gap: 10 }}>
        <button onClick={() => setTab('smd')} className={tab === 'smd' ? 'btn btn-primary' : 'btn btn-ghost'}>
          <Calculator /> حاسبة مقاومة SMD
        </button>
        <button onClick={() => setTab('codes')} className={tab === 'codes' ? 'btn btn-accent' : 'btn btn-ghost'}>
          <Key /> أكواد الخدمة السرية
        </button>
      </div>

      {/* SMD */}
      {tab === 'smd' && (
        <div className="anim-fade-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {/* Calc */}
          <div className="card" style={{ padding: 24 }}>
            <div className="row" style={{ marginBottom: 24 }}>
              <div className="icon-box icon-box-md" style={{ background: 'var(--grad-primary)' }}>
                <Calculator style={{ width: 20, height: 20 }} />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)' }}>حاسبة مقاومة SMD</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>أدخل الكود المطبوع على المقاومة</div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                كود المقاومة (3 أو 4 أرقام)
              </label>
              <input
                className="field-input"
                style={{ paddingRight: 16, textAlign: 'center', fontSize: 22, fontFamily: 'monospace', letterSpacing: 6 }}
                value={smdIn}
                onChange={e => calcSMD(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="472"
                maxLength={4}
              />
            </div>

            {smdOut && (
              <div
                className="anim-scale-in"
                style={{
                  borderRadius: 12, padding: 20, textAlign: 'center',
                  background: isErr ? 'rgba(239,68,68,0.08)' : 'rgba(16,185,129,0.08)',
                  border: `1.5px solid ${isErr ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)'}`,
                }}
              >
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>القيمة</div>
                <div style={{ fontSize: 32, fontWeight: 900, color: isErr ? '#ef4444' : '#10b981' }}>{smdOut}</div>
              </div>
            )}

            {/* How it works */}
            <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { t: '🔢 كود 3 أرقام', d: 'الرقمان الأولان = القيمة، الثالث = عدد الأصفار. مثال: 472 = 47×10² = 4.7kΩ' },
                { t: '🔢 كود 4 أرقام', d: 'ثلاثة أرقام = القيمة، الرابع = عدد الأصفار. مثال: 4702 = 470×10² = 47kΩ' },
              ].map(x => (
                <div key={x.t} style={{ background: 'var(--bg-primary)', borderRadius: 12, padding: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{x.t}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.8 }}>{x.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Common values */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16 }}>القيم الشائعة</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, maxHeight: 480, overflowY: 'auto' }}>
              {Object.entries(smdResistorCodes).slice(0, 24).map(([c, v]) => (
                <button
                  key={c}
                  onClick={() => calcSMD(c)}
                  className="row-between"
                  style={{
                    padding: '10px 14px',
                    borderRadius: 10,
                    border: '1px solid var(--border-light)',
                    background: 'var(--bg-card)',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                    fontSize: 13,
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'var(--bg-card)')}
                >
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, color: 'var(--primary)' }}>{c}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{v}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Codes */}
      {tab === 'codes' && (
        <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="field" style={{ maxWidth: 400 }}>
            <span className="field-icon"><Search /></span>
            <input className="field-input" value={codeQ} onChange={e => setCodeQ(e.target.value)} placeholder="ابحث بالماركة أو الكود..." />
          </div>

          {filteredCodes.map(b => (
            <div key={b.brand} className="card">
              <button
                onClick={() => setExpanded(expanded === b.brand ? null : b.brand)}
                className="row-between"
                style={{
                  width: '100%', padding: '18px 20px',
                  background: 'none', border: 'none', cursor: 'pointer',
                }}
              >
                <div className="row">
                  <div className="icon-box icon-box-md" style={{ background: 'var(--grad-accent)' }}>
                    <Zap style={{ width: 20, height: 20 }} />
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)' }}>{b.brand}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{b.codes.length} أكواد</div>
                  </div>
                </div>
                {expanded === b.brand
                  ? <ChevronUp style={{ width: 20, height: 20, color: 'var(--text-muted)' }} />
                  : <ChevronDown style={{ width: 20, height: 20, color: 'var(--text-muted)' }} />
                }
              </button>

              {expanded === b.brand && (
                <div className="anim-fade-up" style={{ padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {b.codes.map((c, i) => (
                    <div key={i} className="row" style={{
                      padding: 14, borderRadius: 12,
                      background: 'var(--bg-primary)',
                      alignItems: 'flex-start',
                    }}>
                      <code style={{
                        fontSize: 13, fontWeight: 800,
                        padding: '4px 12px', borderRadius: 8,
                        background: 'rgba(245,158,11,0.1)', color: '#f59e0b',
                        whiteSpace: 'nowrap', flexShrink: 0,
                      }}>
                        {c.code}
                      </code>
                      <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>{c.description}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
