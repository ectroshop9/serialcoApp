import { Navigate } from 'react-router-dom'; // تم حذف useMemo لأنه غير مستخدم
import { useAuth } from '../contexts/AuthContext';
import StatCard from '../components/UI/StatCard';
import { Download, TrendingUp, Shield, Star } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

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
            مرحباً، {user.name?.split(' ')[0] || 'ضيف'} 👋
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
        // تم تقليل الحجم الأدنى للبطاقة من 220px إلى 180px لتصغيرها
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        // تم تقليل المسافة بين البطاقات لتكون أنسق مع الحجم الأصغر
        gap: 12, 
      }}>
        {/* تم تصغير حجم الأيقونات من 24 إلى 20 */}
        <StatCard icon={<Download style={{ width: 20, height: 20 }} />} label="التحميلات المتبقية" value={user.remainingDownloads || 0} subtitle="من أصل 200 تحميل" gradient="var(--grad-primary)" />
        <StatCard icon={<TrendingUp style={{ width: 20, height: 20 }} />} label="إجمالي التحميلات" value={user.totalDownloads || 0} subtitle="منذ الاشتراك" gradient="var(--grad-success)" />
        <StatCard icon={<Shield style={{ width: 20, height: 20 }} />} label="كود السيريال" value={user.serialCode || '-'} subtitle="نشط" gradient="var(--grad-accent)" />
        <StatCard icon={<Star style={{ width: 20, height: 20 }} />} label="الباقة الحالية" value={user.plan || '-'} subtitle="اشتراك سنوي" gradient="var(--grad-info)" />
      </div>
    </div>
  );
}