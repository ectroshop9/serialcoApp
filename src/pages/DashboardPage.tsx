import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StatCard from '../components/UI/StatCard';
import { Coins, TrendingUp, Star, Eye, EyeOff } from 'lucide-react';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [showSerial, setShowSerial] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const response = await fetch('/api/accounts/profile/', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setProfile(data.customer);
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  const formatSerial = (code?: string) => {
    if (!code) return '-';
    if (showSerial) return code;
    if (code.length <= 4) return '••••';
    return `••••-••••-${code.slice(-4)}`;
  };

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
          icon={<Coins style={{ width: 20, height: 20 }} />}
          label="رصيد التوكن"
          value={profile?.token_balance?.toLocaleString() || '0'}
          subtitle="التوكن المتاح"
          gradient="var(--grad-primary)"
        />

        <StatCard
          icon={<TrendingUp style={{ width: 20, height: 20 }} />}
          label="الحالة"
          value={profile?.is_active ? 'نشط' : 'غير نشط'}
          subtitle="حالة الحساب"
          gradient="var(--grad-success)"
        />

        <StatCard
          icon={
            <button
              type="button"
              onClick={() => setShowSerial(!showSerial)}
              style={{
                background: 'none', border: 'none', padding: 0,
                cursor: 'pointer', color: 'inherit', display: 'flex', alignItems: 'center'
              }}
            >
              {showSerial ? <EyeOff style={{ width: 20, height: 20 }} /> : <Eye style={{ width: 20, height: 20 }} />}
            </button>
          }
          label="كود السيريال"
          value={formatSerial(profile?.serial_code)}
          subtitle={showSerial ? "اضغط للإخفاء" : "اضغط للإظهار"}
          gradient="var(--grad-accent)"
        />

        <StatCard
          icon={<Star style={{ width: 20, height: 20 }} />}
          label="الاسم"
          value={profile?.name || user.name || '-'}
          subtitle={profile?.phone || ''}
          gradient="var(--grad-info)"
        />
      </div>
    </div>
  );
}
