import { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import MainLayout from './components/Layout/MainLayout';
import LandingPage from './pages/LandingPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FilesPage from './pages/FilesPage';
import FirmwarePage from './pages/FirmwarePage';
import SchematicsPage from './pages/SchematicsPage';
import ToolsPage from './pages/ToolsPage';
import SMDCalculatorPage from './pages/SMDCalculatorPage';
import ServiceCodesPage from './pages/ServiceCodesPage';
import SerialsPage from './pages/SerialsPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import StorePage from './pages/StorePage';
import ProductsPage from './pages/ProductsPage';
import PublicProductsPage from './pages/PublicProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <HashRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsOfUsePage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<PublicProductsPage />} />
            
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/files" element={<FilesPage />} />
              <Route path="/files/firmware" element={<FirmwarePage />} />
              <Route path="/files/schematics" element={<SchematicsPage />} />
              <Route path="/tools" element={<ToolsPage />} />
              <Route path="/tools/smd" element={<SMDCalculatorPage />} />
              <Route path="/tools/codes" element={<ServiceCodesPage />} />
              <Route path="/serials" element={<SerialsPage />} />
              <Route path="/notifications" element={<NotificationsPage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/store/products" element={<ProductsPage />} />
              <Route path="/store/product/:id" element={<ProductDetailPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}