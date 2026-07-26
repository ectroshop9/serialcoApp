import { useState, useEffect } from 'react';
import { Cpu, FileText, Package, Info, CheckCheck, BellOff } from 'lucide-react';

const API = 'https://serialcotv.onrender.com';

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
    case 'firmware': return { icon: Cpu, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' };
    case 'schematic': return { icon: FileText, color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
    case 'product': return { icon: Package, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
    default: return { icon: Info, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' };
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchNotifications(); }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const res = await fetch(`${API}/api/accounts/notifications/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) setNotifications(data.notifications);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const markAllAsRead = async () => {
    for (const n of notifications.filter(n => !n.is_read)) {
      try {
        const token = localStorage.getItem('access_token');
        await fetch(`${API}/api/accounts/notifications/${n.id}/read/`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) { console.error(err); }
    }
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const toggleRead = async (id: number) => {
    try {
      const token = localStorage.getItem('access_token');
      await fetch(`${API}/api/accounts/notifications/${id}/read/`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)));
    } catch (err) { console.error(err); }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading) return <div style={{ textAlign: 'center', padding: 40 }}>جاري التحميل...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1 className="page-title">الإشعارات {unreadCount > 0 && `(${unreadCount})`}</h1>
        {unreadCount > 0 && <button onClick={markAllAsRead} className="btn btn-ghost btn-sm"><CheckCheck /> تحديد الكل كمقروء</button>}
      </div>

      {notifications.length === 0 ? (
        <div className="card" style={{ padding: 48, textAlign: 'center' }}><BellOff /><p>لا توجد إشعارات</p></div>
      ) : (
        notifications.map(n => {
          const { icon: Icon, color, bg } = getNotificationConfig(n.type);
          return (
            <div key={n.id} onClick={() => toggleRead(n.id)} className="card" style={{ padding: 20, opacity: n.is_read ? 0.7 : 1, borderRight: !n.is_read ? `4px solid ${color}` : '1px solid var(--border)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                <div style={{ background: bg, color, padding: 10, borderRadius: 12 }}><Icon /></div>
                <div>
                  <div style={{ fontWeight: 800 }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{n.description}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.created_at}</div>
                </div>
                {!n.is_read && <div style={{ width: 10, height: 10, borderRadius: '50%', background: color }} />}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
