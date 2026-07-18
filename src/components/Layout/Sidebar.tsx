import { useEffect } from 'react';
import { useLocation, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard, FileText, Wrench, User, LogOut, ShoppingCart, Key, Bell, X, Tv
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'الرئيسية' },
  { path: '/files', icon: FileText, label: 'الملفات المخزنة' },
  { path: '/serials', icon: Key, label: 'سيريالاتي' },
  { path: '/tools', icon: Wrench, label: 'الأدوات' },
  { path: '/store', icon: ShoppingCart, label: 'المتجر' },
  { path: '/notifications', icon: Bell, label: 'الإشعارات' },
  { path: '/profile', icon: User, label: 'حسابي' },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('فشل تسجيل الخروج:', error);
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        style={{
          backgroundColor: 'var(--bg-sidebar)',
          width: 270,
          minWidth: 270,
          transition: 'transform 0.3s ease',
        }}
        className={`fixed top-0 right-0 z-50 h-full flex flex-col
          lg:static lg:z-auto lg:translate-x-0
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '20px 20px' }}
          className="row-between"
        >
          <NavLink to="/dashboard" className="row cursor-pointer" style={{ textDecoration: 'none' }}>
            <div className="icon-box icon-box-md" style={{ background: 'var(--grad-primary)' }}>
              <Tv style={{ width: 22, height: 22, color: '#fff' }} />
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1.3 }}>
                SerialCo TV
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
                لوحة تحكم الفنيين
              </div>
            </div>
          </NavLink>

          <button
            onClick={onClose}
            className="lg:hidden"
            aria-label="إغلاق القائمة"
            style={{
              background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
              cursor: 'pointer', padding: 4, display: 'flex',
            }}
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
        </div>

        <nav style={{ padding: '16px 12px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                style={{ textDecoration: 'none' }}
              >
                {({ isActive }) => (
                  <>
                    <item.icon style={{ flexShrink: 0 }} />
                    <span>{item.label}</span>
                    {isActive && (
                      <span
                        style={{
                          marginRight: 'auto',
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          background: '#fff',
                        }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button
            onClick={handleLogout}
            className="nav-item"
            style={{ color: '#f87171', width: '100%', background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <LogOut style={{ flexShrink: 0 }} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>
    </>
  );
}