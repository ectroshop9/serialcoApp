import { useNavigate } from 'react-router-dom';
import { Cpu, Zap, Monitor, HardDrive, CircuitBoard, Package, LucideIcon } from 'lucide-react';

interface Category {
  key: string;
  label: string;
  icon: LucideIcon;
  color: string;
  desc: string;
}

const CATEGORIES: Category[] = [
  { key: 'firmware', label: 'سوفتوير', icon: Cpu, color: '#6366f1', desc: 'سوفتويرات التلفزيونات بجميع الإصدارات' },
  { key: 'power_supply', label: 'باور سبلاي', icon: Zap, color: '#f59e0b', desc: 'مخططات وتصليح دوائر الباور' },
  { key: 'main_board', label: 'مين بورد', icon: CircuitBoard, color: '#10b981', desc: 'مخططات المين بورد الرئيسية' },
  { key: 't_con', label: 'تي كون', icon: Monitor, color: '#3b82f6', desc: 'مخططات وتصميم لوحة T-Con' },
  { key: 'emmc', label: 'مخططات EMMC', icon: HardDrive, color: '#8b5cf6', desc: 'مخططات ذاكرة EMMC و EEPROM' },
  { key: 'parts', label: 'قطع إلكترونية', icon: Package, color: '#ef4444', desc: 'قطع غيار وأدوات صيانة' },
];

export default function StorePage() {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryKey: string) => {
    navigate(`/store/products?category=${encodeURIComponent(categoryKey)}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* رأس الصفحة */}
      <div className="anim-fade-up">
        <h1 className="page-title">المتجر</h1>
        <p className="page-desc">اختر نوع المحتوى أو القطع التي تبحث عنها لتصفح الأقسام</p>
      </div>

      {/* شبكة التصنيفات */}
      <div
        className="stagger"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 16,
        }}
      >
        {CATEGORIES.map(category => {
          const IconComponent = category.icon;

          return (
            <button
              key={category.key}
              type="button"
              onClick={() => handleCategoryClick(category.key)}
              className="card"
              style={{
                padding: 28,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface, #ffffff)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100%',
              }}
            >
              <div
                className="icon-box icon-box-lg"
                style={{
                  background: `${category.color}18`,
                  color: category.color,
                  marginBottom: 16,
                  width: 64,
                  height: 64,
                  borderRadius: 20,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconComponent style={{ width: 32, height: 32 }} />
              </div>

              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: 'var(--text-primary)',
                  marginBottom: 8,
                }}
              >
                {category.label}
              </div>

              <div
                style={{
                  fontSize: 13,
                  color: 'var(--text-muted)',
                  lineHeight: 1.6,
                }}
              >
                {category.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}