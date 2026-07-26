import { useState, FormEvent } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { Tv, Mail, Lock, User, Phone, Sun, Moon, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const { login, loginWithGoogle, loginWithFacebook, register, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [isRegister, setIsRegister] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', email: '', password: '', acceptTerms: false });

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const validateForm = () => {
    if (!form.email || !form.password) return 'البريد الإلكتروني وكلمة المرور مطلوبان';
    if (form.password.length < 6) return 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (isRegister) {
      if (!form.name || !form.phone) return 'يرجى ملء جميع الحقول المطلوبة';
      if (!form.acceptTerms) return 'يجب الموافقة على سياسة الخصوصية وشروط الاستخدام للمتابعة';
    }
    return null;
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    try {
      if (isRegister) {
        await register(form.name, form.phone, form.email, form.password);
      } else {
        await login(form.email, form.password);
      }
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err?.message || 'حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  // ⚠️ معطل مؤقتاً
  /*
  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setError(null);
    setIsLoading(true);
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithFacebook();
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError('فشل تسجيل الدخول عبر وسائل التواصل الاجتماعي.');
    } finally {
      setIsLoading(false);
    }
  };
  */

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setError(null);
    setForm({ name: '', phone: '', email: '', password: '', acceptTerms: false }); 
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 20, background: 'var(--bg-primary)', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -120, right: -120, width: 340, height: 340, borderRadius: '50%', background: 'var(--grad-primary)', opacity: 0.12, filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', bottom: -120, left: -120, width: 340, height: 340, borderRadius: '50%', background: 'var(--grad-accent)', opacity: 0.12, filter: 'blur(80px)' }} />

      <button onClick={toggleTheme} style={{
        position: 'absolute', top: 20, left: 20, zIndex: 10, width: 42, height: 42, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: isDark ? 'rgba(251,191,36,0.1)' : 'rgba(99,102,241,0.08)',
        color: isDark ? '#fbbf24' : '#6366f1', border: 'none', cursor: 'pointer',
      }}>
        {isDark ? <Sun style={{ width: 20, height: 20 }} /> : <Moon style={{ width: 20, height: 20 }} />}
      </button>

      <div className="anim-scale-in" style={{
        position: 'relative', width: '100%', maxWidth: 440, background: 'var(--bg-card)',
        border: '1px solid var(--border)', borderRadius: 24, padding: '40px 32px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="anim-float" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: 20, background: 'var(--grad-primary)', marginBottom: 16 }}>
            <Tv style={{ width: 32, height: 32, color: '#fff' }} />
          </div>
          <h1 className="grad-text" style={{ fontSize: 26, fontWeight: 900, marginBottom: 6 }}>SerialCo TV</h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            {isRegister ? 'إنشاء حساب جديد' : 'مرحباً بعودتك! سجّل دخولك'}
          </p>
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)',
            padding: '12px', borderRadius: '8px', marginBottom: '20px', fontSize: '14px', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
          {isRegister && (
            <>
              <div className="field">
                <span className="field-icon"><User /></span>
                <input required className="field-input" placeholder="الاسم الكامل" autoComplete="name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} disabled={isLoading} />
              </div>
              <div className="field">
                <span className="field-icon"><Phone /></span>
                <input required className="field-input" type="tel" placeholder="رقم الهاتف" autoComplete="tel" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} disabled={isLoading} />
              </div>
            </>
          )}
          <div className="field">
            <span className="field-icon"><Mail /></span>
            <input required className="field-input" type="email" placeholder="البريد الإلكتروني" autoComplete="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} disabled={isLoading} />
          </div>
          <div className="field">
            <span className="field-icon"><Lock /></span>
            <input required className="field-input field-input-both" type={showPw ? 'text' : 'password'} placeholder="كلمة المرور" autoComplete={isRegister ? "new-password" : "current-password"} value={form.password} onChange={e => setForm({...form, password: e.target.value})} disabled={isLoading} />
            <span className="field-icon-left" onClick={() => setShowPw(!showPw)} style={{ cursor: 'pointer' }}>
              {showPw ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
            </span>
          </div>

          {isRegister && (
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 4, marginBottom: 4 }}>
              <input 
                type="checkbox" 
                id="acceptTerms" 
                checked={form.acceptTerms} 
                onChange={e => setForm({...form, acceptTerms: e.target.checked})}
                style={{ width: 18, height: 18, accentColor: 'var(--primary)', cursor: 'pointer', marginTop: 2, flexShrink: 0 }}
              />
              <label htmlFor="acceptTerms" style={{ fontSize: 13, color: 'var(--text-secondary)', cursor: 'pointer', lineHeight: 1.5 }}>
                أوافق على سياسة الخصوصية وشروط الاستخدام
              </label>
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={isLoading} style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
            {isLoading ? 'جاري التحميل...' : (isRegister ? 'إنشاء الحساب' : 'تسجيل الدخول')}
          </button>
        </form>

        {/* ⚠️ Social Login معطل مؤقتاً */}
        {/* 
        <div className="row" style={{ gap: 16, marginBottom: 24, display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>أو الدخول السريع</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>
        <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
          <button type="button" className="btn btn-google">Google</button>
          <button type="button" className="btn btn-facebook">Facebook</button>
        </div>
        */}

        <p style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-secondary)' }}>
          {isRegister ? 'لديك حساب بالفعل؟' : 'ليس لديك حساب؟'}{' '}
          <button type="button" onClick={toggleMode} disabled={isLoading} style={{ background: 'none', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', color: 'var(--primary)', fontWeight: 700, fontSize: 14, textDecoration: 'underline' }}>
            {isRegister ? 'سجّل دخولك' : 'سجّل الآن'}
          </button>
        </p>
      </div>
    </div>
  );
}
