import { useNavigate } from 'react-router-dom';
import { Cpu, Zap, Monitor, HardDrive, CircuitBoard, Package } from 'lucide-react';

const CATEGORIES = [
  { key: 'firmware', label: 'سوفتوير', icon: Cpu, color: '#6366f1', desc: 'سوفتويرات التلفزيونات' },
  { key: 'power_supply', label: 'باور سبلاي', icon: Zap, color: '#f59e0b', desc: 'مخططات دوائر الباور' },
  { key: 'main_board', label: 'مين بورد', icon: CircuitBoard, color: '#10b981', desc: 'مخططات المين بورد' },
  { key: 't_con', label: 'تي كون', icon: Monitor, color: '#3b82f6', desc: 'مخططات T-Con' },
  { key: 'emmc', label: 'مخططات EMMC', icon: HardDrive, color: '#8b5cf6', desc: 'ذاكرة EMMC و EEPROM' },
  { key: 'parts', label: 'قطع إلكترونية', icon: Package, color: '#ef4444', desc: 'قطع غيار وأدوات' },
];

export default function StorePage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="anim-fade-up">
        <h1 className="page-title">المتجر</h1>
        <p className="page-desc">اختر القسم اللي تبحث عنه</p>
      </div>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        {CATEGORIES.map(c => (
          <button key={c.key} onClick={() => navigate(`/store/products?category=${c.key}`)}
            className="card" style={{ padding: 28, textAlign: 'center', cursor: 'pointer', border: '1px solid var(--border)' }}>
            <div style={{ background: `${c.color}18`, color: c.color, width: 64, height: 64, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <c.icon style={{ width: 32, height: 32 }} />
            </div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{c.label}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{c.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
