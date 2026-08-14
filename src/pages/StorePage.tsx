import { useNavigate } from 'react-router-dom';
import { Cpu, CircuitBoard } from 'lucide-react';

const CATEGORIES = [
  { 
    key: 'firmware', 
    label: 'سوفتوير', 
    icon: Cpu, 
    color: '#6366f1', 
    desc: 'سوفتويرات التلفزيونات المحدثة', 
    path: '/files/brands',
    bg: 'linear-gradient(135deg, #6366f1, #8b5cf6)'
  },
  { 
    key: 'schematic', 
    label: 'مخططات', 
    icon: CircuitBoard, 
    color: '#10b981', 
    desc: 'مخططات الصيانة الدقيقة', 
    path: '/store/products?category=schematic',
    bg: 'linear-gradient(135deg, #10b981, #059669)'
  },
];

export default function StorePage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '20px 16px', maxWidth: '800px', margin: '0 auto' }}>
      
      {/* Header */}
      <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 12 }}>
        <h1 className="page-title" style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 900, marginBottom: 8 }}>
          المتجر
        </h1>
        <p className="page-desc" style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          اختر القسم الذي تريد تصفحه
        </p>
      </div>

      {/* Categories Grid */}
      <div 
        className="stagger" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
          gap: 20 
        }}
      >
        {CATEGORIES.map((c, index) => (
          <button 
            key={c.key} 
            onClick={() => navigate(c.path)}
            className="card"
            style={{ 
              padding: '32px 24px',
              textAlign: 'center', 
              cursor: 'pointer',
              border: '1px solid var(--border)',
              borderRadius: 20,
              background: 'var(--bg-card)',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              position: 'relative',
              overflow: 'hidden',
              animation: `fadeInUp 0.5s ease ${index * 100}ms forwards`,
              opacity: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = `0 20px 40px ${c.color}20`;
              e.currentTarget.style.borderColor = c.color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            {/* Glow Effect */}
            <div style={{
              position: 'absolute',
              top: -60,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 200,
              height: 120,
              background: `${c.color}15`,
              borderRadius: '50%',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }} />

            {/* Icon */}
            <div style={{ 
              background: c.bg,
              color: '#fff',
              width: 72,
              height: 72,
              borderRadius: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: `0 8px 20px ${c.color}40`,
              position: 'relative',
              zIndex: 1,
            }}>
              <c.icon style={{ width: 34, height: 34 }} />
            </div>

            {/* Label */}
            <div style={{ 
              fontSize: 20, 
              fontWeight: 900, 
              marginBottom: 8,
              color: 'var(--text-primary)',
              position: 'relative',
              zIndex: 1,
            }}>
              {c.label}
            </div>

            {/* Description */}
            <div style={{ 
              fontSize: 13, 
              color: 'var(--text-muted)',
              lineHeight: 1.5,
              position: 'relative',
              zIndex: 1,
            }}>
              {c.desc}
            </div>

            {/* Arrow Hint */}
            <div style={{
              marginTop: 20,
              fontSize: 12,
              fontWeight: 700,
              color: c.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              position: 'relative',
              zIndex: 1,
            }}>
              تصفح الآن
              <span style={{ fontSize: 18 }}>←</span>
            </div>
          </button>
        ))}
      </div>

      {/* Footer Note */}
      <div style={{ 
        textAlign: 'center', 
        padding: '16px', 
        fontSize: 12, 
        color: 'var(--text-muted)',
        background: 'var(--bg-card)',
        borderRadius: 12,
        border: '1px solid var(--border)',
      }}>
        💡 جميع الملفات مضمونة ومحدثة باستمرار
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}