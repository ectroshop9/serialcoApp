import { useState, useEffect, useCallback } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const { isAuthenticated } = useAuth();

  // مراقبة حجم الشاشة
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 1. تثبيت دالة الإغلاق باستخدام useCallback
  const closeSidebar = useCallback(() => {
    // إغلاق القائمة الجانبية فقط إذا كانت الشاشة صغيرة (هاتف/تابلت)
    // لا نريد إغلاقها في شاشات الكمبيوتر عند النقر على الروابط
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, []);

  // 2. تثبيت دالة التبديل (فتح/إغلاق) واستخدام القيمة السابقة (prev)
  const toggleSidebar = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);

  // حماية المسار
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* تمرير الدالة المثبتة هنا */}
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* تمرير الدالة المثبتة هنا */}
        <Navbar onMenuToggle={toggleSidebar} />
        
        <main style={{ flex: 1, padding: '24px', overflow: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}