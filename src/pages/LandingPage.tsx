import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle, Shield, Star, Zap, Search, ChevronLeft, 
  Check, Sparkles, Loader2, Coins
} from 'lucide-react';
import Modal from '../components/UI/Modal';
import PaymentModal from '../components/PaymentModal';

const API = 'https://serialcotv.onrender.com';

export default function LandingPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [latestFiles, setLatestFiles] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) setIsLoggedIn(true);

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!elements.length) return;

    const revealElement = (element: HTMLElement) => { element.classList.add('is-visible'); };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { 
          revealElement(entry.target as HTMLElement); 
          observer.unobserve(entry.target); 
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    elements.forEach((element) => {
      const alreadyInView = element.getBoundingClientRect().top < window.innerHeight * 0.9;
      if (alreadyInView) { revealElement(element); } else { observer.observe(element); }
    });

    return () => observer.disconnect();
  }, []);

  // جلب أحدث الملفات
  useEffect(() => {
    fetch(`${API}/api/content/firmware/`)
      .then(r => r.json())
      .then(data => setLatestFiles(data.firmwares || []))
      .catch(() => setLatestFiles([]));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedQuery = searchQuery.trim();
    if (!sanitizedQuery) return;

    setIsSearching(true);
    setTimeout(() => {
      navigate(`/search?q=${encodeURIComponent(sanitizedQuery)}`);
      setIsSearching(false);
    }, 400);
  };

  const handleSubscribe = (plan: string) => {
    setSelectedPlan(plan);
    setShowPayment(true);
  };

  const brands = [
    { name: 'Samsung', image: '/brands/samsung.png' },
    { name: 'LG', image: '/brands/lg.png' },
    { name: 'Geant', image: '/brands/geant.png' },
    { name: 'Condor', image: '/brands/condor.png' },
    { name: 'Iris', image: '/brands/iris-logo.png' },
    { name: 'Stream', image: '/brands/stream.png' },
    { name: 'maxtor', image: '/brands/maxtor.png' },
    { name: 'kiowa', image: '/brands/kiowa.png' },
  ];

  const features = [
    { icon: CheckCircle, title: 'ملفات مختبرة ومضمونة', description: 'جميع ملفات السوفتوير تم فحصها وتجربتها بعناية لضمان عدم تلف جهازك وتقليل المرتجعات.' },
    { icon: Shield, title: 'مخططات هندسية دقيقة', description: 'انسَ البحث العشوائي، نوفر مخططات تفصيلية لتتبع المسارات واكتشاف الأعطال بسهولة.' },
    { icon: Star, title: 'دعم فني جزائري', description: 'نحن نفهم السوق المحلية ونوفر تحديثات حصرية للأجهزة الأكثر انتشاراً في الجزائر.' },
    { icon: Zap, title: 'تحديثات يومية وفورية', description: 'نضيف ملفات ومخططات جديدة يومياً لمواكبة أحدث الموديلات والأعطال الشائعة بالورشات.' },
  ];

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', direction: 'rtl', minHeight: '100vh' }}>
      
      <Helmet>
        <title>SerialcoTV | منصة السوفتوير والمخططات الأولى في الجزائر</title>
        <meta name="description" content="أول منصة جزائرية موثوقة توفر تحديثات السوفتوير والمخططات الهندسية الدقيقة لأكثر من 10,000 موديل شاشة." />
        <meta property="og:title" content="SerialcoTV | منصة السوفتوير والمخططات" />
        <meta property="og:description" content="حمل أحدث ملفات السوفتوير والمخططات بأسعار تنافسية والدفع عبر بريدي موب أو البطاقة الذهبية." />
      </Helmet>

      {/* Navbar */}
      <nav className="glass sticky top-0 z-50" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '10px 16px' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-lg font-black tracking-wider" style={{ color: 'var(--primary)' }}>SERIALCO<span style={{ color: 'var(--accent)' }}>TV</span></div>
          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Link to="/dashboard" className="btn btn-primary text-xs px-3 py-1.5">لوحة التحكم</Link>
            ) : (
              <Link to="/login" className="btn btn-ghost text-xs px-3 py-1.5 hidden sm:inline-flex">تسجيل الدخول</Link>
            )}
            <Link to="/store" className="btn btn-ghost text-xs px-3 py-1.5">المتجر</Link>
            <button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="btn btn-primary text-xs px-3 py-1.5">اشترك الآن</button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="hero-wrapper reveal" data-reveal style={{ padding: '40px 16px 60px 16px' }}>
        <div className="max-w-3xl mx-auto text-center reveal" data-reveal>
          <h1 style={{ fontSize: 'clamp(20px, 3.5vw, 32px)', fontWeight: 900, marginBottom: '12px', lineHeight: 1.35 }}>الحل الجذري لأعطال شاشات LED و Plasma<br /><span style={{ color: 'var(--accent)' }}>في ثوانٍ معدودة.</span></h1>
          <p style={{ fontSize: '13px', color: '#f1f5f9', opacity: 0.9, maxWidth: '550px', margin: '0 auto 20px auto' }}>أول منصة جزائرية موثوقة توفر تحديثات السوفتوير والمخططات الهندسية الدقيقة لأكثر من 10,000 موديل شاشة.</p>
          <Link to="/store" className="btn btn-accent text-xs py-2.5 px-5 shadow-md" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>تصفح الآن</span><ChevronLeft size={16} />
          </Link>
        </div>
      </header>

      {/* Search Section */}
      <section id="search" className="search-section reveal" data-reveal style={{ maxWidth: '700px', margin: '-30px auto 30px auto', padding: '0 16px' }}>
        <div className="card" style={{ padding: '12px 16px', boxShadow: '0 8px 20px rgba(0,0,0,0.06)' }}>
          <form style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }} onSubmit={handleSearch}>
            <div className="field" style={{ flex: '1 1 200px' }}>
              <input type="text" placeholder="ابحث برقم الموديل أو رقم اللوحة (MainBoard)..." className="field-input" style={{ padding: '8px 12px', fontSize: '12px' }} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} disabled={isSearching} />
            </div>
            <button type="submit" className="btn btn-primary text-xs" style={{ minWidth: '90px', padding: '8px 14px' }} disabled={isSearching}>
              {isSearching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              <span>{isSearching ? 'جاري...' : 'بحث'}</span>
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section style={{ background: 'var(--bg-primary)', padding: '40px 16px' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="reveal" data-reveal style={{ fontSize: '20px', fontWeight: 900, textAlign: 'center', marginBottom: '24px', color: 'var(--primary)' }}>لماذا يثق الفنيون في منصتنا؟</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card reveal" data-reveal style={{ padding: '16px 12px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div className="icon-box icon-box-md" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--primary)', marginBottom: '12px', width: '36px', height: '36px' }}><Icon size={20} /></div>
                  <h3 style={{ fontSize: '13.5px', fontWeight: 'bold', marginBottom: '6px' }}>{feature.title}</h3>
                  <p style={{ fontSize: '11.5px', lineHeight: '1.5', color: 'var(--text-secondary)' }}>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section style={{ background: 'var(--bg-secondary)', padding: '36px 16px' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="reveal" data-reveal style={{ fontSize: '22px', fontWeight: 900, textAlign: 'center', marginBottom: '24px', color: 'var(--primary)' }}>ندعم آلاف الموديلات لأشهر العلامات التجارية</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {brands.map((brand, index) => (
              <div key={index} className="card reveal" data-reveal style={{ padding: '10px 8px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s ease-in-out' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <img src={brand.image} alt={brand.name} loading="lazy" style={{ width: '100%', height: '56px', objectFit: 'contain', borderRadius: '10px' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Files Section - جديد */}
      <section style={{ background: 'var(--bg-primary)', padding: '40px 16px' }}>
        <div className="max-w-6xl mx-auto">
          <h2 style={{ fontSize: '22px', fontWeight: 900, textAlign: 'center', marginBottom: '24px', color: 'var(--primary)' }}>
            أحدث الملفات المتاحة
          </h2>
          
          <div style={{ 
            display: 'flex', 
            gap: 16, 
            overflowX: 'auto', 
            paddingBottom: 12,
            scrollbarWidth: 'thin',
          }}>
            {latestFiles.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', width: '100%' }}>لا توجد ملفات بعد</p>
            ) : (
              latestFiles.slice(0, 10).map((file: any) => (
                <div key={file.id} style={{ 
                  minWidth: 220, 
                  maxWidth: 220,
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border)', 
                  borderRadius: 14, 
                  padding: 16,
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; }}
                onClick={() => navigate(`/store/product/${file.id}?type=firmware`)}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{file.brand__name}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>{file.model_number}</div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Coins size={14} /> {file.token_cost} توكن
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ background: 'var(--bg-primary)', padding: '50px 16px', width: '100%' }}>
        <div style={{ maxWidth: '750px', margin: '0 auto', width: '100%' }}>
          <div className="reveal" data-reveal style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 900, marginBottom: '8px', color: 'var(--primary)' }}>اختر الباقة المناسبة</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>اشتراكات بسيطة تناسب جميع احتياجات الفنيين</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'stretch' }}>
            
            {/* الباقة الذهبية */}
            <div style={{ background: 'var(--bg-secondary)', border: '2px solid var(--accent)', borderRadius: '14px', padding: '26px 20px 20px 20px', position: 'relative', marginTop: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 6px 20px rgba(0,0,0,0.06)' }}>
              <div style={{ position: 'absolute', top: '-16px', left: '50%', transform: 'translateX(-50%)', background: 'var(--accent)', color: '#fff', fontSize: '11px', fontWeight: 'bold', padding: '4px 14px', borderRadius: '20px', boxShadow: '0 3px 8px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', zIndex: 10 }}>
                <Sparkles size={12} /><span>الأكثر مبيعاً</span>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>الباقة الذهبية</h3>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'rgba(245,158,11,0.12)', color: 'var(--accent)', fontWeight: 700 }}>توفير أكبر</span>
                </div>
                <p style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>للمحترفين والورش النشطة</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: 'var(--accent)' }}>3000</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>د.ج / باقة</span>
                </div>
                <hr style={{ borderColor: 'var(--border)', margin: '0 0 16px 0' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><Check size={14} style={{ color: 'var(--accent)' }} /><span style={{ fontWeight: 'bold' }}>3,000 توكن</span></li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><Check size={14} style={{ color: 'var(--accent)' }} /><span>مخططات ومستندات كاملة</span></li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><Check size={14} style={{ color: 'var(--accent)' }} /><span>أولوية ومساندة في الدعم الفني</span></li>
                </ul>
              </div>
              <button onClick={() => handleSubscribe('ذهبية')} className="btn btn-accent btn-block text-xs py-2.5" style={{ width: '100%', marginTop: 'auto' }}>اشترك الآن</button>
            </div>

            {/* الباقة الفضية */}
            <div className="reveal" data-reveal style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', borderRadius: '14px', padding: '26px 20px 20px 20px', position: 'relative', marginTop: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 6px 20px rgba(0,0,0,0.04)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold' }}>الباقة الفضية</h3>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '6px', background: 'var(--bg-hover)', color: 'var(--text-muted)', fontWeight: 600 }}>للبداية</span>
                </div>
                <p style={{ marginBottom: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>للورش الخفيفة والمبتدئين</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '26px', fontWeight: 900, color: 'var(--primary)' }}>1500</span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--text-secondary)' }}>د.ج / باقة</span>
                </div>
                <hr style={{ borderColor: 'var(--border)', margin: '0 0 16px 0' }} />
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><Check size={14} style={{ color: 'var(--success)' }} /><span>1,500 توكن</span></li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><Check size={14} style={{ color: 'var(--success)' }} /><span>مخططات ومستندات كاملة</span></li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}><Check size={14} style={{ color: 'var(--success)' }} /><span>صلاحية استخدام غير محدودة</span></li>
                </ul>
              </div>
              <button onClick={() => handleSubscribe('فضية')} className="btn btn-ghost btn-block text-xs py-2.5" style={{ width: '100%', marginTop: 'auto' }}>اشترك الآن</button>
            </div>

          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} title="اختر طريقة الدفع">
        <PaymentModal selectedPlan={selectedPlan} onClose={() => setShowPayment(false)} />
      </Modal>

      {/* Footer */}
      <footer className="reveal" data-reveal style={{ background: 'var(--bg-sidebar)', color: 'var(--text-sidebar)', borderTop: '1px solid var(--border)', padding: '32px 16px 16px 16px' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-base font-black text-white tracking-wider" style={{ marginBottom: '8px' }}>SERIALCO<span style={{ color: 'var(--accent)' }}>TV</span></div>
            <p style={{ fontSize: '11px', lineHeight: 1.5, opacity: 0.8 }}>المنصة الأولى لدعم فنيي الشاشات بملفات السوفتوير والمخططات المضمونة في الجزائر.</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>روابط سريعة</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '11px' }}>
              <li style={{ marginBottom: '4px' }}><Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>اتصل بنا</Link></li>
              <li style={{ marginBottom: '4px' }}><Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>سياسة الاستخدام</Link></li>
              <li style={{ marginBottom: '4px' }}><Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>شروط الاستخدام</Link></li>
              <li style={{ marginBottom: '4px' }}><Link to="/faq" style={{ color: 'inherit', textDecoration: 'none' }}>الأسئلة الشائعة</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>تابعنا</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ background: '#1877F2', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#fff' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" style={{ background: '#0088cc', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#fff' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.46-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.145.118.185.276.204.408.019.132.043.43.024.662z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={{ background: '#FF0000', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#fff' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #334155', fontSize: '11px', opacity: 0.7 }}>
          <p>&copy; 2026 SerialcoTV. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

      {/* Floating Facebook Messenger Button */}
      <a 
        href="https://m.me/serialcotv" 
        target="_blank" 
        rel="noopener noreferrer" 
        style={{ 
          position: 'fixed', 
          bottom: '24px', 
          left: '24px', 
          width: '56px', 
          height: '56px', 
          borderRadius: '50%', 
          background: 'linear-gradient(135deg, #0084FF 0%, #00C6FF 100%)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          boxShadow: '0 4px 14px rgba(0, 132, 255, 0.45)', 
          zIndex: 40, 
          transition: 'all 0.3s ease-in-out', 
          color: '#fff' 
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
        title="تواصل معنا عبر ميسنجر"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.45 5.513 3.714 7.214V22l3.355-1.843c.928.257 1.91.397 2.931.397 5.523 0 10-4.145 10-9.296C22 6.145 17.523 2 12 2zm1.193 12.48l-2.556-2.727-4.99 2.727 5.49-5.823 2.622 2.727 4.925-2.727-5.491 5.823z" />
        </svg>
      </a>

    </div>
  );
}