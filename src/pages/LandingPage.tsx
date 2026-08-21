import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, Download, FileText, Package, Wrench, Shield, Truck, Star, Search, X, TrendingUp, ArrowRight, Coins, Sparkles, Zap, ChevronLeft } from 'lucide-react';

const API = 'https://serialcotv.onrender.com';

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchBrand, setSearchBrand] = useState('ALL');
  const [featuredFiles, setFeaturedFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const slides = [
    { image: '/hero/firmware.jpg' },
    { image: '/hero/schematics.jpg' },
    { image: '/hero/updates.jpg' },
  ];

  useEffect(() => {
    let isMounted = true;
    fetch(`${API}/api/content/firmware/`)
      .then(r => r.json())
      .then(data => {
        if (isMounted) setFeaturedFiles((data?.firmwares || []).slice(0, 6));
      })
      .catch(() => {
        if (isMounted) setFeaturedFiles([]);
      })
      .finally(() => { if (isMounted) setLoadingFiles(false); });
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setCurrentSlide((prev) => (prev + 1) % slides.length), 4500);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!elements.length) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { 
        if (entry.isIntersecting) { 
          entry.target.classList.add('is-visible'); 
          observer.unobserve(entry.target); 
        } 
      });
    }, { threshold: 0.1 });

    elements.forEach(el => { 
      if (el.getBoundingClientRect().top < window.innerHeight * 0.9) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [featuredFiles, loadingFiles]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (searchBrand !== 'ALL') params.append('brand', searchBrand);
    navigate(`/store?${params.toString()}`);
  };

  const fileTypes = [
    { key: 'firmware', label: 'سوفتويرات', icon: Download, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)' },
    { key: 'schematics', label: 'مخططات', icon: FileText, color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)' },
    { key: 'power_supply', label: 'باور سبلاي', icon: Zap, color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.08)' },
    { key: 'main_board', label: 'مين بورد', icon: Cpu, color: '#10b981', bg: 'rgba(16, 185, 129, 0.08)' },
  ];

  const features = [
    { icon: Shield, title: 'ملفات مضمونة', description: 'جميع الملفات مجربة ومفحوصة.' },
    { icon: Truck, title: 'تحميل فوري', description: 'حمل مباشر بعد الدفع.' },
    { icon: Wrench, title: 'دعم تقني', description: 'فريق متخصص لمساعدتك.' },
    { icon: Star, title: 'أسعار تنافسية', description: 'أفضل أسعار التوكنز.' },
    { icon: Zap, title: 'تحديثات يومية', description: 'ملفات جديدة كل يوم.' }, 
    { icon: TrendingUp, title: 'آلاف الموديلات', description: 'تغطية شاملة للشاشات.' },
    { icon: Package, title: 'مخططات دقيقة', description: 'مخططات هندسية واضحة.' },
    { icon: Search, title: 'بحث سريع', description: 'ابحث برقم الموديل فوراً.' },
  ];

  const brands = [
    { name: 'Samsung', code: 'samsung' },
    { name: 'LG', code: 'lg' },
    { name: 'Condor', code: 'condor' },
    { name: 'Iris', code: 'iris' },
    { name: 'Geant', code: 'geant' },
    { name: 'Stream', code: 'stream' },
    { name: 'Maxtor', code: 'maxtor' },
    { name: 'Kiowa', code: 'kiowa' },
  ];

  return (
    <div style={{ background: '#f1f5f9', color: '#0f172a', direction: 'rtl', minHeight: '100vh', fontFamily: "'Cairo', sans-serif" }}>
      
      {/* هيدر علوي Glassmorphism */}
      <nav style={{ background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(226, 232, 240, 0.8)', padding: '14px 20px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: 24, fontWeight: 900, letterSpacing: '-0.5px' }}>
            <span style={{ color: '#4f46e5' }}>SerialCo</span><span style={{ color: '#f59e0b' }}>TV</span>
          </Link>
          <Link to="/store" className="btn-glow" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: '#fff', padding: '9px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: 14, transition: 'all 0.3s ease' }}>المتجر</Link>
        </div>
      </nav>

      {/* سلايدر البانر */}
      <header className="hero-banner" style={{ position: 'relative', overflow: 'hidden', background: '#090d16' }}>
        {slides.map((slide, index) => (
          <div key={index} style={{ position: 'absolute', inset: 0, backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: currentSlide === index ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(15,23,42,0.4) 0%, rgba(15,23,42,0.85) 100%)' }} />
          </div>
        ))}
      </header>

      {/* صندوق البحث الحائم */}
      <section style={{ maxWidth: 880, margin: '-50px auto 0', padding: '0 16px', position: 'relative', zIndex: 20 }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 20, padding: '16px', boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.08)' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <select value={searchBrand} onChange={e => setSearchBrand(e.target.value)} style={{ padding: '12px 16px', border: '1px solid #cbd5e1', borderRadius: 12, background: '#f8fafc', outline: 'none', fontSize: 13, color: '#334155', cursor: 'pointer', flex: '1 1 140px', fontWeight: 600 }}>
              <option value="ALL">كل الماركات</option>
              {brands.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
            </select>
            
            <div style={{ position: 'relative', flex: '3 1 240px' }}>
              <input type="text" placeholder="ابحث برقم الموديل، المين بورد، أو رقم الشاشة..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px 42px', border: '1px solid #cbd5e1', borderRadius: 12, background: '#f8fafc', outline: 'none', boxSizing: 'border-box', fontSize: 14, fontWeight: 500 }} />
              <Search size={20} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              {searchQuery && <button type="button" onClick={() => setSearchQuery('')} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2 }}><X size={18} /></button>}
            </div>
            
            <button type="submit" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: '#fff', border: 'none', padding: '12px 28px', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: 14, flex: '0 1 auto', boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)' }}>بحث</button>
          </form>
        </div>
      </section>

      {/* أنواع الملفات */}
      <section style={{ padding: '48px 16px 24px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <h2 data-reveal style={{ fontSize: 'clamp(20px, 4vw, 24px)', fontWeight: 900, textAlign: 'center', marginBottom: 24, color: '#0f172a' }} className="reveal-item">تصنيفات المكتبة</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
            {fileTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button key={type.key} data-reveal onClick={() => navigate(`/store?type=${type.key}`)} className="reveal-item modern-card" style={{ padding: '18px 14px', textAlign: 'center', cursor: 'pointer', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, transition: 'all 0.25s ease', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
                  <div style={{ background: type.bg, color: type.color, margin: '0 auto 12px', width: 52, height: 52, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={26} />
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#1e293b' }}>{type.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* أحدث الملفات */}
      <section style={{ padding: '24px 16px 36px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 900, color: '#0f172a', margin: 0 }}>أحدث السوفتويرات والمخططات</h2>
              <p style={{ fontSize: 13, color: '#64748b', margin: '4px 0 0 0' }}>ملفات جاهزة ومفحوصة مع تحليلات الشاشة</p>
            </div>
            <Link to="/store" style={{ color: '#4f46e5', fontWeight: 700, fontSize: 13, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              عرض الكل <ChevronLeft size={16} />
            </Link>
          </div>

          {loadingFiles ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
              {[1, 2, 3, 4, 5, 6].map(n => <div key={n} style={{ background: '#fff', height: 230, borderRadius: 16, border: '1px solid #e2e8f0', animation: 'pulse 1.5s infinite ease-in-out' }} />)}
            </div>
          ) : featuredFiles.length === 0 ? (
            <div style={{ background: '#fff', padding: 32, borderRadius: 16, textAlign: 'center', border: '1px solid #e2e8f0', color: '#64748b', fontSize: 14 }}>لا توجد ملفات متوفرة حالياً</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 }}>
              {featuredFiles.map(file => (
                <div key={file.id} onClick={() => navigate(`/store/product/${file.id}?type=firmware`)} className="file-card" style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: 12, cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                  
                  <div>
                    <div style={{ height: 90, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', borderRadius: 12, marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                      <FileText size={36} style={{ color: '#94a3b8', opacity: 0.8 }} />
                      <span style={{ position: 'absolute', top: 6, right: 6, background: '#4f46e5', color: '#fff', fontSize: 10, fontWeight: 800, padding: '2px 8px', borderRadius: 20 }}>
                        {file.brand__name || 'Brand'}
                      </span>
                    </div>

                    <h3 style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {file.model_number || 'موديل غير معرف'}
                    </h3>

                    <div style={{ fontSize: 13, fontWeight: 800, color: '#059669', marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 4, background: '#ecfdf5', padding: '3px 8px', borderRadius: 6 }}>
                      <Coins size={13} /> {file.token_cost} توكن
                    </div>
                  </div>

                  <button className="download-btn" style={{ width: '100%', background: '#f1f5f9', color: '#334155', border: 'none', padding: '9px 12px', borderRadius: 10, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s ease' }}>
                    <span>تحميل الملف</span>
                    <Download size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* المميزات */}
      <section style={{ padding: '36px 16px', background: '#fff', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <h2 data-reveal style={{ fontSize: 'clamp(18px, 3.5vw, 22px)', fontWeight: 900, textAlign: 'center', marginBottom: 28, color: '#0f172a' }} className="reveal-item">لماذا يفضل الفنيون منصتنا؟</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} data-reveal className="reveal-item" style={{ padding: 16, textAlign: 'center', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: 14 }}>
                  <div style={{ background: '#e0e7ff', color: '#4f46e5', width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                    <Icon size={22} />
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 4, color: '#0f172a' }}>{f.title}</h3>
                  <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* شبكة الماركات */}
      <section style={{ padding: '36px 16px' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <h2 data-reveal style={{ fontSize: 'clamp(18px, 3.5vw, 22px)', fontWeight: 900, textAlign: 'center', marginBottom: 20 }} className="reveal-item">تصفح حسب الماركة العالمية</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 12 }}>
            {brands.map((brand, i) => (
              <button key={i} data-reveal onClick={() => navigate(`/store?brand=${brand.code}`)} className="reveal-item brand-card" style={{ padding: '12px 8px', textAlign: 'center', cursor: 'pointer', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 60, transition: 'all 0.2s', fontWeight: 800, fontSize: 13, color: '#334155', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <span>{brand.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* الباقات */}
      <section style={{ padding: '16px 16px 20px' }}>
        <div data-reveal className="reveal-item" style={{ maxWidth: 880, margin: '0 auto', background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)', border: '1px solid #c7d2fe', borderRadius: 20, padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: '1 1 260px' }}>
            <span style={{ background: '#4f46e5', color: '#fff', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 12, display: 'inline-block', marginBottom: 8 }}>وفّر أكثر</span>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#1e1b4b', margin: '0 0 6px 0' }}>باقات الرصيد والتوكنز</h3>
            <p style={{ fontSize: 13, color: '#4338ca', margin: 0, lineHeight: 1.5 }}>اشحن حسابك بالتوكنز واستفد من خصومات التحميل اليومية على المخططات والسوفتويرات.</p>
          </div>
          <Link to="/store" className="btn-glow" style={{ background: '#4f46e5', color: '#fff', padding: '12px 24px', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap', boxShadow: '0 6px 20px rgba(79, 70, 229, 0.3)' }}>
            <Sparkles size={16} />
            <span>عرض الباقات</span>
          </Link>
        </div>
      </section>

      {/* دعوة للتحميل */}
      <section style={{ padding: '24px 16px 40px' }}>
        <div data-reveal className="reveal-item" style={{ maxWidth: 880, margin: '0 auto', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 20, padding: '36px 24px', textAlign: 'center', color: '#fff', boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.2)' }}>
          <h2 style={{ fontSize: 'clamp(20px, 4vw, 26px)', fontWeight: 900, color: '#f59e0b', marginBottom: 10 }}>تبحث عن ملف محدد؟</h2>
          <p style={{ color: '#94a3b8', marginBottom: 24, fontSize: 14, maxWidth: 500, margin: '0 auto 24px' }}>نوفر أضخم قاعدة بيانات للسوفتويرات النادرة والمخططات في الجزائر والوطن العربي.</p>
          <Link to="/store" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)', color: '#fff', padding: '12px 28px', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <span>تصفح كل المكتبة</span>
            <ArrowRight size={16} style={{ transform: 'rotate(180deg)' }} />
          </Link>
        </div>
      </section>

      {/* الفوتر */}
      <footer style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '32px 16px 40px', textAlign: 'center' }}>
        <div style={{ maxWidth: 880, margin: '0 auto' }}>
          <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 6 }}>SerialCo<span style={{ color: '#f59e0b' }}>TV</span></div>
          <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>المنصة التقنية الأولى للتحديثات، السوفتوير والمخططات الهندسية</p>
        </div>
      </footer>

      {/* CSS */}
      <style>{`
        .hero-banner { height: 260px; }
        @media (min-width: 640px) { .hero-banner { height: 380px; } }
        
        .reveal-item { opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
        .reveal-item.is-visible { opacity: 1 !important; transform: translateY(0) !important; }
        
        .modern-card:hover { transform: translateY(-4px); border-color: #818cf8 !important; box-shadow: 0 12px 20px -5px rgba(99, 102, 241, 0.12) !important; }
        
        .file-card:hover { transform: translateY(-5px); border-color: #6366f1 !important; box-shadow: 0 16px 25px -5px rgba(15, 23, 42, 0.08) !important; }
        .file-card:hover .download-btn { background: #4f46e5 !important; color: #fff !important; }
        
        .brand-card:hover { border-color: #4f46e5 !important; color: #4f46e5 !important; transform: translateY(-2px); }
        
        .btn-glow:hover { opacity: 0.95; transform: scale(1.02); }

        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 0.3; } 100% { opacity: 0.6; } }
      `}</style>
    </div>
  );
}