import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Menu, Sun, Moon, Bell, Search, Maximize, Minimize,
  User, Settings, LogOut
} from 'lucide-react';

interface NavbarProps {
  onMenuToggle: () => void;
}

export default function Navbar({ onMenuToggle }: NavbarProps) {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [searchVal, setSearchVal] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setShowUserMenu(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotif(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/firmware?search=${encodeURIComponent(searchVal)}`);
      setSearchVal('');
    }
  };

  const getInitials = () => {
    const first = user?.name?.charAt(0) || 'ف';
    const last = user?.name?.split(' ')[1]?.charAt(0) || '';
    return `${first}${last}`;
  };

  const iconBtnStyle: React.CSSProperties = {
    background: 'none', border: 'none', cursor: 'pointer',
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
    width: 40, height: 40, borderRadius: 12,
    transition: 'background 0.2s, transform 0.2s', flexShrink: 0,
  };

  const dropdownStyle: React.CSSProperties = {
    position: 'absolute', top: '100%', left: 0, zIndex: 50,
    minWidth: 220, background: 'var(--bg-card)', borderRadius: 16,
    border: '1px solid var(--border)', boxShadow: '0 16px 32px rgba(0,0,0,0.12)',
    padding: 8, marginTop: 8,
  };

  return (
    <header
      className="glass"
      style={{
        position: 'sticky', top: 0, zIndex: 30,
        borderBottom: `1px solid var(--border)`,
        background: isDark ? 'rgba(15,23,42,0.82)' : 'rgba(241,245,249,0.82)',
      }}
    >
      <div className="row-between" style={{ padding: '0 20px', height: 64 }}>
        {/* Right */}
        <div className="row">
          <button onClick={onMenuToggle} className="lg:hidden" style={{ ...iconBtnStyle, color: 'var(--text-primary)' }}>
            <Menu style={{ width: 22, height: 22 }} />
          </button>

          <form onSubmit={handleSearch} className={`${showSearch ? 'flex' : 'hidden'} md:flex`}>
            <div className="field">
              <span className="field-icon"><Search /></span>
              <input type="text" placeholder="بحث سريع..." className="field-input" style={{ width: 260 }} value={searchVal} onChange={e => setSearchVal(e.target.value)} />
            </div>
          </form>

          <button onClick={() => setShowSearch(!showSearch)} className="md:hidden" style={{ ...iconBtnStyle, color: 'var(--text-secondary)' }}>
            <Search style={{ width: 20, height: 20 }} />
          </button>
        </div>

        {/* Left */}
        <div className="row">
          <button onClick={toggleFullscreen} title="ملء الشاشة" style={{ ...iconBtnStyle, color: 'var(--text-secondary)' }}>
            {isFullscreen ? <Minimize style={{ width: 20, height: 20 }} /> : <Maximize style={{ width: 20, height: 20 }} />}
          </button>

          <button onClick={toggleTheme} title={isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
            style={{ ...iconBtnStyle, background: isDark ? 'rgba(251,191,36,0.1)' : 'rgba(99,102,241,0.08)', color: isDark ? '#fbbf24' : '#6366f1' }}>
            {isDark ? <Sun style={{ width: 20, height: 20 }} /> : <Moon style={{ width: 20, height: 20 }} />}
          </button>

          {/* Notifications */}
          <div ref={notifRef} style={{ position: 'relative' }}>
            <button onClick={() => setShowNotif(!showNotif)} style={{ ...iconBtnStyle, color: 'var(--text-secondary)', position: 'relative' }}>
              <Bell style={{ width: 20, height: 20 }} />
              <span style={{ position: 'absolute', top: 8, left: 8, width: 9, height: 9, borderRadius: '50%', background: '#ef4444', border: '2px solid var(--bg-primary)' }} />
            </button>
            {showNotif && (
              <div style={dropdownStyle}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontWeight: 700, fontSize: 14 }}>الإشعارات</span>
                </div>
                {[
                  { title: 'سوفتوير جديد متاح', desc: 'Samsung UA32T5300 v2.5', time: 'منذ ساعتين' },
                  { title: 'تم شحن طلبك', desc: 'طلب #SC-2024-0892', time: 'منذ 5 ساعات' },
                  { title: 'تحديث النظام', desc: 'ميزات جديدة متاحة', time: 'منذ يوم' },
                ].map((n, i) => (
                  <div key={i} className="row" style={{ padding: '10px 14px', gap: 12, borderBottom: '1px solid var(--border-light)', cursor: 'pointer' }}>
                    <div className="icon-box icon-box-sm" style={{ background: 'var(--grad-primary)', flexShrink: 0 }}><Bell style={{ width: 14, height: 14 }} /></div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{n.title}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{n.desc}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{n.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: 1, height: 28, background: 'var(--border)', margin: '0 4px' }} />

          {/* User Avatar فقط بدون اسم */}
          <div ref={userMenuRef} style={{ position: 'relative' }}>
            <div onClick={() => setShowUserMenu(!showUserMenu)} style={{ cursor: 'pointer' }}>
              <div
                style={{
                  background: 'var(--grad-primary)',
                  borderRadius: '50%',
                  width: 40,
                  height: 40,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 15,
                  fontWeight: 900,
                  color: '#fff',
                }}
              >
                {getInitials()}
              </div>
            </div>

            {showUserMenu && (
              <div style={dropdownStyle}>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{user?.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{user?.email}</div>
                </div>
                <button onClick={() => { navigate('/profile'); setShowUserMenu(false); }} className="nav-item" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}>
                  <User style={{ width: 18, height: 18 }} /> الملف الشخصي
                </button>
                <button onClick={() => { navigate('/profile'); setShowUserMenu(false); }} className="nav-item" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px' }}>
                  <Settings style={{ width: 18, height: 18 }} /> الإعدادات
                </button>
                <div style={{ borderTop: '1px solid var(--border)', marginTop: 4, paddingTop: 4 }}>
                  <button onClick={() => { logout(); setShowUserMenu(false); }} className="nav-item" style={{ width: '100%', justifyContent: 'flex-start', padding: '10px 14px', color: '#f87171' }}>
                    <LogOut style={{ width: 18, height: 18 }} /> تسجيل الخروج
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}