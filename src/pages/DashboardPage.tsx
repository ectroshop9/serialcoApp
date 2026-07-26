import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import StatCard from '../components/UI/StatCard';
import { Coins, User, Key } from 'lucide-react';

const API = 'https://serialcotv.onrender.com';

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`${API}/api/accounts/profile/`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) setCustomer(data.customer);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (!isAuthenticated) return <Navigate to="/" replace />;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="anim-fade-up" style={{
        background: 'var(--grad-primary)', borderRadius: 20, padding: '32px 28px', color: '#fff'
      }}>
        <h1 style={{ fontSize: 26, fontWeight: 900 }}>
          مرحباً، {customer?.name || user?.name || 'ضيف'} 👋
        </h1>
        <p style={{ fontSize: 14, opacity: 0.8, marginTop: 8 }}>
          {customer?.email || customer?.phone || ''}
        </p>
      </div>

      <div className="stagger" style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12
      }}>
        <StatCard icon={<Coins />} label="رصيد التوكن"
          value={loading ? '...' : (customer?.token_balance?.toLocaleString() || '0')}
          subtitle="المتبقي" gradient="var(--grad-primary)" />
        <StatCard icon={<User />} label="الحالة"
          value={customer?.is_active ? 'نشط ✅' : 'غير نشط ❌'}
          subtitle="حالة الحساب" gradient="var(--grad-success)" />
        <StatCard icon={<Key />} label="رقم العميل"
          value={`#${customer?.id || '-'}`}
          subtitle="معرف الحساب" gradient="var(--grad-accent)" />
      </div>
    </div>
  );
}
