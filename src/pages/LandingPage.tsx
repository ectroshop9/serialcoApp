import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle, Shield, Star, Zap, Search, ChevronLeft, 
  Check, Sparkles, Coins, Loader2 
} from 'lucide-react';
import Modal from '../components/UI/Modal';
import PaymentModal from '../components/PaymentModal';

const API = 'https://serialcotv.onrender.com';

export default function LandingPage() {
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [latestFiles, setLatestFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const navigate = useNavigate();

  // Reveal Animations on Scroll
  useEffect(() => {
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

  // Fetch Latest Firmware Files
  useEffect(() => {
    const controller = new AbortController();
    setLoadingFiles(true);

    fetch(`${API}/api/content/firmware/`, { signal: controller.signal })
      .then(r => r.json())
      .then(data => {
        setLatestFiles(data.firmwares || []);
        setLoadingFiles(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setLatestFiles([]);
          setLoadingFiles(false);
        }
      });

    return () => controller.abort();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sanitizedQuery = searchQuery.trim();
    if (!sanitizedQuery) return;
    navigate(`/store?q=${encodeURIComponent(sanitizedQuery)}`);
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
    { name: 'Maxtor', image: '/brands/maxtor.png' },
    { name: 'Kiowa', image: '/brands/kiowa.png' },
  ];

  const features = [
    { icon: CheckCircle, title: 'ملفات مختبرة ومضمونة', description: 'جميع ملفات السوفتوير تم فحصها وتجربتها بعناية لضمان عدم تلف جهازك وتقليل المرتجعات.' },
    { icon: Shield, title: 'مخططات هندسية دقيقة', description: 'انسَ البحث العشوائي، نوفر مخططات تفصيلية لتتبع المسارات واكتشاف الأعطال بسهولة.' },
    { icon: Star, title: 'دعم فني جزائري', description: 'نحن نفهم السوق المحلية ونوفر تحديثات حصرية للأجهزة الأكثر انتشاراً في الجزائر.' },
    { icon: Zap, title: 'تحديثات يومية وفورية', description: 'نضيف ملفات ومخططات جديدة يومياً لمواكبة أحدث الموديلات والأعطال الشائعة بالورشات.' },
  ];

  return (
    <div dir="rtl" className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans selection:bg-indigo-500 selection:text-white">
      
      <Helmet>
        <title>SerialcoTV | منصة السوفتوير والمخططات الأولى في الجزائر</title>
        <meta name="description" content="أول منصة جزائرية موثوقة توفر تحديثات السوفتوير والمخططات الهندسية الدقيقة لأكثر من 10,000 موديل شاشة." />
        <meta property="og:title" content="SerialcoTV | منصة السوفتوير والمخططات" />
        <meta property="og:description" content="حمل أحدث ملفات السوفتوير والمخططات بأسعار تنافسية والدفع عبر بريدي موب أو البطاقة الذهبية." />
      </Helmet>

      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 bg-[var(--bg-secondary)]/90 backdrop-blur-md border-b border-[var(--border)] px-4 py-3 transition-all">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div 
            className="text-lg md:text-xl font-black tracking-wider cursor-pointer select-none text-[var(--primary)]" 
            onClick={() => navigate('/')}
          >
            SERIALCO<span className="text-[var(--accent)]">TV</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-3">
            <Link 
              to="/store" 
              className="btn btn-ghost btn-sm text-xs md:text-sm px-3 py-1.5 flex items-center gap-1.5 hover:bg-black/5 rounded-lg transition"
            >
              <Search size={16} /> 
              <span>المتجر</span>
            </Link>
            <button 
              onClick={() => setShowPayment(true)} 
              className="btn btn-primary btn-sm text-xs md:text-sm px-4 py-1.5 font-bold shadow-md hover:shadow-lg transition-transform active:scale-95"
            >
              اشترك الآن
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="hero-wrapper relative overflow-hidden py-12 md:py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto relative z-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black leading-tight mb-4">
            الحل الجذري لأعطال شاشات LED و Plasma
            <span className="block text-[var(--accent)] mt-1">في ثوانٍ معدودة.</span>
          </h1>
          <p className="text-sm md:text-base text-slate-200 opacity-90 max-w-xl mx-auto mb-8 px-2 leading-relaxed">
            أول منصة جزائرية موثوقة توفر تحديثات السوفتوير والمخططات الهندسية الدقيقة لأكثر من 10,000 موديل شاشة.
          </p>
          <div className="flex justify-center gap-3">
            <Link 
              to="/store" 
              className="btn btn-accent text-xs md:text-sm py-3 px-6 rounded-xl font-bold inline-flex items-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition"
            >
              <span>تصفح الملفات</span>
              <ChevronLeft size={18} />
            </Link>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="max-w-xl mx-auto -mt-6 px-4 relative z-20 mb-12">
        <div className="card bg-[var(--bg-card)] p-2 sm:p-3 rounded-2xl shadow-xl border border-[var(--border)]">
          <form className="flex gap-2" onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="ابحث برقم الموديل أو اللوحة..." 
              className="field-input w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-transparent focus:border-[var(--primary)] outline-none transition" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
            />
            <button 
              type="submit" 
              className="btn btn-primary text-xs sm:text-sm px-5 py-2.5 whitespace-nowrap font-bold rounded-xl shadow transition active:scale-95"
            >
              بحث
            </button>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-black text-center mb-8 text-[var(--primary)]">
            لماذا يثق الفنيون في منصتنا؟
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="card bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border)] text-center transition hover:-translate-y-1 hover:shadow-lg">
                  <div className="bg-indigo-500/10 text-[var(--primary)] mx-auto mb-3 w-12 h-12 rounded-xl flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-sm md:text-base font-bold mb-2">{feature.title}</h3>
                  <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="bg-[var(--bg-secondary)] py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl md:text-2xl font-black text-center mb-8 text-[var(--primary)]">
            ندعم آلاف الموديلات لأشهر العلامات
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
            {brands.map((brand, index) => (
              <div key={index} className="card bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border)] flex items-center justify-center hover:scale-105 transition">
                <img 
                  src={brand.image} 
                  alt={brand.name} 
                  loading="lazy" 
                  className="w-full h-12 object-contain rounded-lg filter drop-shadow-sm" 
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Available Files Section */}
      <section className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl md:text-2xl font-black text-center mb-8 text-[var(--primary)]">
            أحدث الملفات المتاحة
          </h2>
          
          <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory">
            {loadingFiles ? (
              <div className="w-full flex justify-center py-8">
                <Loader2 className="animate-spin text-[var(--primary)]" size={32} />
              </div>
            ) : latestFiles.length === 0 ? (
              <p className="text-[var(--text-muted)] text-center w-full text-xs md:text-sm">لا توجد ملفات متوفرة حالياً</p>
            ) : (
              latestFiles.slice(0, 10).map((file: any) => (
                <div 
                  key={file.id} 
                  className="snap-start min-w-[180px] max-w-[180px] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-4 flex-shrink-0 cursor-pointer hover:border-[var(--accent)] hover:shadow-md transition active:scale-95"
                  onClick={() => navigate(`/store/product/${file.id}?type=firmware`)}
                >
                  <div className="text-sm font-bold truncate mb-1">{file.brand__name}</div>
                  <div className="text-xs text-[var(--text-muted)] truncate mb-3">{file.model_number}</div>
                  <div className="text-xs font-black text-[var(--accent)] flex items-center gap-1.5">
                    <Coins size={14} /> 
                    <span>{file.token_cost} توكن</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="bg-[var(--bg-secondary)] py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-xl md:text-2xl font-black mb-2 text-[var(--primary)]">اختر الباقة المناسبة</h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)]">اشتراكات بسيطة تناسب جميع احتياجات الفنيين</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* Gold Plan */}
            <div className="bg-[var(--bg-card)] border-2 border-[var(--accent)] rounded-2xl p-6 relative flex flex-col justify-between shadow-xl">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[var(--accent)] text-white text-[11px] font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow-sm whitespace-nowrap">
                <Sparkles size={12} />
                <span>الأكثر مبيعاً</span>
              </div>
              
              <div>
                <h3 className="text-lg font-bold">الباقة الذهبية</h3>
                <p className="mb-4 text-xs text-[var(--text-secondary)]">للمحترفين والورش النشطة</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-[var(--accent)]">3000</span>
                  <span className="text-xs text-[var(--text-secondary)]">د.ج</span>
                </div>
                <hr className="border-[var(--border)] mb-4" />
                <ul className="space-y-3 text-xs md:text-sm text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2"><Check size={16} className="text-[var(--accent)]" />3,000 توكن</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-[var(--accent)]" />مخططات ومستندات كاملة</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-[var(--accent)]" />أولوية في الدعم الفني</li>
                </ul>
              </div>

              <button 
                onClick={() => handleSubscribe('ذهبية')} 
                className="btn btn-accent w-full mt-6 py-2.5 text-xs md:text-sm font-bold rounded-xl shadow transition active:scale-95"
              >
                اشترك الآن
              </button>
            </div>

            {/* Silver Plan */}
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6 flex flex-col justify-between shadow-md">
              <div>
                <h3 className="text-lg font-bold">الباقة الفضية</h3>
                <p className="mb-4 text-xs text-[var(--text-secondary)]">للورش الخفيفة والمبتدئين</p>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-black text-[var(--primary)]">1500</span>
                  <span className="text-xs text-[var(--text-secondary)]">د.ج</span>
                </div>
                <hr className="border-[var(--border)] mb-4" />
                <ul className="space-y-3 text-xs md:text-sm text-[var(--text-secondary)]">
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" />1,500 توكن</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" />مخططات ومستندات كاملة</li>
                  <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" />صلاحية غير محدودة</li>
                </ul>
              </div>

              <button 
                onClick={() => handleSubscribe('فضية')} 
                className="btn btn-ghost border border-[var(--border)] w-full mt-6 py-2.5 text-xs md:text-sm font-bold rounded-xl transition hover:bg-black/5 active:scale-95"
              >
                اشترك الآن
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Payment Modal */}
      <Modal isOpen={showPayment} onClose={() => setShowPayment(false)} title="اختر طريقة الدفع">
        <PaymentModal selectedPlan={selectedPlan} onClose={() => setShowPayment(false)} />
      </Modal>

      {/* Footer */}
      <footer className="bg-[var(--bg-sidebar)] text-[var(--text-sidebar)] border-t border-[var(--border)] pt-10 pb-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-lg font-black text-white tracking-wider mb-2">SERIALCO<span className="text-[var(--accent)]">TV</span></div>
            <p className="text-xs leading-relaxed opacity-80">المنصة الأولى لدعم فنيي الشاشات بملفات السوفتوير والمخططات المضمونة في الجزائر.</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs md:text-sm">روابط سريعة</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/contact" className="hover:underline opacity-90 transition">اتصل بنا</Link></li>
              <li><Link to="/privacy" className="hover:underline opacity-90 transition">سياسة الاستخدام</Link></li>
              <li><Link to="/terms" className="hover:underline opacity-90 transition">شروط الاستخدام</Link></li>
              <li><Link to="/faq" className="hover:underline opacity-90 transition">الأسئلة الشائعة</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-3 text-xs md:text-sm">تابعنا</h4>
            <div className="flex gap-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="bg-[#1877F2] w-9 h-9 flex items-center justify-center rounded-xl text-white hover:opacity-90 transition">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="https://telegram.org" target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="bg-[#0088cc] w-9 h-9 flex items-center justify-center rounded-xl text-white hover:opacity-90 transition">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.46-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.145.118.185.276.204.408.019.132.043.43.024.662z"/></svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="bg-[#FF0000] w-9 h-9 flex items-center justify-center rounded-xl text-white hover:opacity-90 transition">
                <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 pt-4 border-t border-slate-700/60 text-xs opacity-70">
          <p>&copy; 2026 SerialcoTV. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

      {/* Floating Messenger Button */}
      <a 
        href="https://m.me/serialcotv" 
        target="_blank" 
        rel="noopener noreferrer" 
        aria-label="تواصل معنا عبر ميسنجر"
        title="تواصل معنا عبر ميسنجر"
        className="fixed bottom-5 left-5 w-12 h-12 rounded-full bg-gradient-to-tr from-[#0084FF] to-[#00C6FF] flex items-center justify-center text-white shadow-lg shadow-blue-500/30 z-40 hover:scale-110 active:scale-95 transition-transform"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.45 5.513 3.714 7.214V22l3.355-1.843c.928.257 1.91.397 2.931.397 5.523 0 10-4.145 10-9.296C22 6.145 17.523 2 12 2zm1.193 12.48l-2.556-2.727-4.99 2.727 5.49-5.823 2.622 2.727 4.925-2.727-5.491 5.823z" />
        </svg>
      </a>

    </div>
  );
}