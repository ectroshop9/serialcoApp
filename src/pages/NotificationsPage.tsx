import { useState, useEffect } from 'react';
import { Cpu, FileText, Package, Info, CheckCheck, Trash2, BellOff } from 'lucide-react';

export interface NotificationItem {
  id: number;
  type: 'firmware' | 'schematic' | 'product' | 'system' | 'update' | 'info';
  title: string;
  description: string;
  created_at: string;
  is_read: boolean;
}

const getNotificationConfig = (type: NotificationItem['type']) => {
  switch (type) {
    case 'firmware':
      return { icon: Cpu, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' };
    case 'schematic':
      return { icon: FileText, color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
    case 'product':
      return { icon: Package, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
    case 'system':
    case 'update':
      return { icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' };
    case 'info':
    default:
      return { icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' };
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch('/api/accounts/notifications/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setNotifications(data.notifications.map((n: any) => ({
          ...n,
          type: n.type || 'info',
          description: n.description,
          is_read: n.is_read
        })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    for (const n of notifications.filter(n => !n.is_read)) {
      try {
        const token = localStorage.getItem('access_token');
        await fetch(`/api/accounts/notifications/${n.id}/read/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) {
        console.error(err);
      }
    }
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const toggleRead = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`/api/accounts/notifications/${id}/read/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.error(err);
    }
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    );
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="anim-fade-up" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 className="page-title">الإشعارات</h1>
          <p className="page-desc">
            آخر التحديثات والملفات الجديدة {unreadCount > 0 && `(${unreadCount} غير مقروء)`}
          </p>
        </div>

        {notifications.length > 0 && unreadCount > 0 && (
          <button type="button" onClick={markAllAsRead} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px',
            borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-card)',
            color: 'var(--text-primary)', fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            <CheckCheck style={{ width: 16, height: 16, color: 'var(--primary)' }} />
            تحديد الكل كمقروء
          </button>
        )}
      </div>

      {loading ? (
        <div className="card" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
          جاري التحميل...
        </div>
      ) : notifications.length === 0 ? (
        <div className="card anim-fade-up" style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)' }}>
          <BellOff style={{ width: 48, height: 48, margin: '0 auto 16px', opacity: 0.5 }} />
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>لا توجد إشعارات</div>
          <p style={{ fontSize: 14 }}>أنت مطلع على جميع التحديثات والملفات حالياً</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.map(n => {
            const config = getNotificationConfig(n.type);
            const IconComponent = config.icon;

            return (
              <div key={n.id} className="card anim-fade-up" onClick={() => toggleRead(n.id)} style={{
                padding: 20, cursor: 'pointer', opacity: n.is_read ? 0.75 : 1,
                borderRight: !n.is_read ? `4px solid ${config.color}` : '1px solid var(--border)',
                transition: 'all 0.2s ease',
              }}>
                <div className="row" style={{ gap: 16, alignItems: 'center' }}>
                  <div className="icon-box icon-box-md" style={{ background: config.bg, color: config.color, flexShrink: 0 }}>
                    <IconComponent style={{ width: 22, height: 22 }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: n.is_read ? 700 : 900, color: 'var(--text-primary)', marginBottom: 4 }}>
                      {n.title}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>
                      {n.description}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {n.created_at}
                    </div>
                  </div>
                  {!n.is_read && (
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: config.color, flexShrink: 0 }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
