import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StatCard from '../components/UI/StatCard';
import { Download, TrendingUp, Star, Eye, EyeOff } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  
  // حالة التحكم بإخفاء/إظهار كود السيريال
  const [showSerial, setShowSerial] = useState(false);

  // التحقق من تسجيل الدخول
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // دالة تشفيـر/إخفاء كود السيريال ترجع نصاً (string) لتعمل مع StatCard بدون أخطاء
  const formatSerial = (code?: string) => {
    if (!code) return '-';
    if (showSerial) return code;
    if (code.length <= 4) return '••••';
    return `••••-••••-${code.slice(-4)}`;
  };

  // استخراج الاسم الأول بأمان
  const firstName = user.name?.trim() ? user.name.trim().split(' ')[0] : 'ضيف';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Welcome banner */}
      <div
        className="anim-fade-up"
        style={{
          background: 'var(--grad-primary)',
          borderRadius: 20,
          padding: '32px 28px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>
            مرحباً، {firstName} 👋
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
            لوحة التحكم الخاصة بك — تصفح السوفتويرات والمخططات بسهولة
          </p>
        </div>
        <div style={{ position: 'absolute', top: -40, left: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ position: 'absolute', bottom: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
      </div>

      {/* Stats */}
      <div className="stagger" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 12, 
      }}>
        <StatCard 
          icon={<Download style={{ width: 20, height: 20 }} />} 
          label="التحميلات المتبقية" 
          value={user.remainingDownloads ?? 0} 
          subtitle="من أصل 200 تحميل" 
          gradient="var(--grad-primary)" 
        />
        
        <StatCard 
          icon={<TrendingUp style={{ width: 20, height: 20 }} />} 
          label="إجمالي التحميلات" 
          value={user.totalDownloads ?? 0} 
          subtitle="منذ الاشتراك" 
          gradient="var(--grad-success)" 
        />
        
        <StatCard 
          icon={
            <button
              type="button"
              onClick={() => setShowSerial(!showSerial)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center'
              }}
              title={showSerial ? "إخفاء الكود" : "إظهار الكود"}
            >
              {showSerial ? <EyeOff style={{ width: 20, height: 20 }} /> : <Eye style={{ width: 20, height: 20 }} />}
            </button>
          } 
          label="كود السيريال" 
          value={formatSerial(user.serialCode)} 
          subtitle={showSerial ? "اضغط أيقونة العين للإخفاء" : "اضغط أيقونة العين للإظهار"} 
          gradient="var(--grad-accent)" 
        />
        
        <StatCard 
          icon={<Star style={{ width: 20, height: 20 }} />} 
          label="الباقة الحالية" 
          value={user.plan || 'غير محدد'} 
          subtitle="اشتراك سنوي" 
          gradient="var(--grad-info)" 
        />
      </div>
    </div>
  );
}