import { Bell, Cpu, FileText, Package, Info } from 'lucide-react';

const notifications = [
  { id: 1, icon: Cpu, title: 'سوفتوير جديد', desc: 'Samsung UA32T5300 v2.5 متاح للتحميل', time: 'منذ ساعتين', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { id: 2, icon: FileText, title: 'مخطط جديد', desc: 'LG EAY64928801 Power Supply تمت إضافته', time: 'منذ 5 ساعات', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { id: 3, icon: Package, title: 'منتج جديد في المتجر', desc: 'مبرمجة RT809H متوفرة الآن', time: 'منذ يوم', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
  { id: 4, icon: Info, title: 'تحديث النظام', desc: 'تمت إضافة ميزات جديدة للوحة التحكم', time: 'منذ يومين', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { id: 5, icon: Cpu, title: 'سوفتوير جديد', desc: 'TCL 43P635 - Google TV متاح للتحميل', time: 'منذ 3 أيام', color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  { id: 6, icon: FileText, title: 'مخطط جديد', desc: 'Samsung BN94-12871A Main Board', time: 'منذ أسبوع', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
];

export default function NotificationsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="anim-fade-up">
        <h1 className="page-title">الإشعارات</h1>
        <p className="page-desc">آخر التحديثات والملفات الجديدة</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {notifications.map(n => (
          <div key={n.id} className="card anim-fade-up" style={{ padding: 20 }}>
            <div className="row" style={{ gap: 16 }}>
              <div className="icon-box icon-box-md" style={{ background: n.bg, color: n.color, flexShrink: 0 }}>
                <n.icon style={{ width: 22, height: 22 }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 4 }}>{n.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6 }}>{n.desc}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.time}</div>
              </div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.color, flexShrink: 0 }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
