import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Cpu, Download, FileText, Package, Wrench, Shield, Truck, Star, Search, X, TrendingUp, ArrowRight, Coins, Sparkles, Zap } from 'lucide-react';

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
        if (isMounted) setFeaturedFiles((data?.firmwares || []).slice(0, 5));
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
    { key: 'firmware', label: 'سوفتويرات', icon: Download, color: '#3b82f6' },
    { key: 'schematics', label: 'مخططات', icon: FileText, color: '#f59e0b' },
    { key: 'power_supply', label: 'باور سبلاي', icon: Zap, color: '#6366f1' },
    { key: 'main_board', label: 'مين بورد', icon: Cpu, color: '#10b981' },
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
    <div style={{ background: '#f8fafc', color: '#1e293b', direction: 'rtl', minHeight: '100vh', fontFamily: "'Cairo', sans-serif" }}>
      
      {/* هيدر علوي */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '12px 16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/" style={{ textDecoration: 'none', fontSize: 22, fontWeight: 900 }}>
            <span style={{ color: '#6366f1' }}>SerialCo</span><span style={{ color: '#f59e0b' }}>TV</span>
          </Link>
          <Link to="/store" style={{ background: '#6366f1', color: '#fff', padding: '8px 18px', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: 14 }}>المتجر</Link>
        </div>
      </nav>

      {/* سلايدر البانر */}
      <header className="hero-banner" style={{ position: 'relative', overflow: 'hidden', background: '#0f172a' }}>
        {slides.map((slide, index) => (
          <div key={index} style={{ position: 'absolute', inset: 0, backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: currentSlide === index ? 1 : 0, transition: 'opacity 1s ease-in-out' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }} />
          </div>
        ))}
      </header>

      {/* صندوق البحث */}
      <section style={{ maxWidth: 850, margin: '-40px auto 0', padding: '0 16px', position: 'relative', zIndex: 20 }}>
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 16, padding: '14px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <select value={searchBrand} onChange={e => setSearchBrand(e.target.value)} style={{ padding: '12px 14px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', outline: 'none', fontSize: 13, color: '#334155', cursor: 'pointer', flex: '1 1 120px' }}>
              <option value="ALL">كل الماركات</option>
              {brands.map(b => <option key={b.code} value={b.code}>{b.name}</option>)}
            </select>
            
            <div style={{ position: 'relative', flex: '2 1 200px' }}>
              <input type="text" placeholder="ابحث برقم الموديل، اللوحة..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px 36px 12px 36px', border: '1px solid #e2e8f0', borderRadius: 10, background: '#f8fafc', outline: 'none', boxSizing: 'border-box', fontSize: 13 }} />
              <Search size={18} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              {searchQuery && <button type="button" onClick={() => setSearchQuery('')} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2 }}><X size={16} /></button>}
            </div>
            
            <button type="submit" style={{ background: '#6366f1', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 10, fontWeight: 700, cursor: 'pointer', fontSize: 14, flex: '0 1 auto' }}>بحث</button>
          </form>
        </div>
      </section>

      {/* أنواع الملفات */}
      <section style={{ padding: '40px 16px 20px' }}>
        <div style={{ maxWidth: 850, margin: '0 auto' }}>
          <h2 data-reveal style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 900, textAlign: 'center', marginBottom: 20, color: '#0f172a' }} className="reveal-item">أنواع الملفات</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, maxWidth: 700, margin: '0 auto' }}>
            {fileTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button key={type.key} data-reveal onClick={() => navigate(`/store?type=${type.key}`)} className="reveal-item" style={{ padding: 14, textAlign: 'center', cursor: 'pointer', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, transition: 'all 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = type.color; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#e2e8f0'; }}>
                  <div style={{ background: `${type.color}15`, color: type.color, margin: '0 auto 10px', width: 48, height: 48, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icon size={24} /></div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{type.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* أحدث الملفات */}
      <section style={{ padding: '20px 16px 30px' }}>
        <div style={{ maxWidth: 850, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <h2 style={{ fontSize: 'clamp(18px, 4vw, 20px)', fontWeight: 900, color: '#0f172a', margin: 0 }}>أحدث السوفتويرات</h2>
            <p style={{ fontSize: 12, color: '#64748b', margin: '4px 0 0 0' }}>ملفات مجربة وجاهزة للتحميل</p>
          </div>
          {loadingFiles ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {[1, 2, 3, 4, 5].map(n => <div key={n} style={{ background: '#fff', height: 220, borderRadius: 12, border: '1px solid #e2e8f0', animation: 'pulse 1.5s infinite ease-in-out' }} />)}
            </div>
          ) : featuredFiles.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#64748b', fontSize: 13 }}>لا توجد ملفات بعد</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
              {featuredFiles.map(file => (
                <div key={file.id} onClick={() => navigate(`/store/product/${file.id}?type=firmware`)} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: 10, cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#6366f1'} onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}>
                  <div>
                    <div style={{ height: 80, background: '#fafafa', borderRadius: 8, overflow: 'hidden', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30 }}>
                      📥
                    </div>
                    <h3 style={{ fontSize: 12, fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{file.brand__name} - {file.model_number}</h3>
                    <div style={{ fontSize: 13, fontWeight: 800, color: '#6366f1', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Coins size={12} /> {file.token_cost} توكن
                    </div>
                  </div>
                  <button style={{ width: '100%', background: '#6366f1', color: '#fff', border: 'none', padding: '8px 10px', borderRadius: 8, fontWeight: 700, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <span>تحميل</span>
                    <Download size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* المميزات */}
      <section style={{ padding: '30px 16px' }}>
        <div style={{ maxWidth: 850, margin: '0 auto' }}>
          <h2 data-reveal style={{ fontSize: 'clamp(17px, 3.5vw, 20px)', fontWeight: 900, textAlign: 'center', marginBottom: 20 }} className="reveal-item">لماذا يثق الفنيون في SerialCoTV؟</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, maxWidth: 700, margin: '0 auto' }}>
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div key={i} data-reveal className="reveal-item" style={{ padding: 14, textAlign: 'center', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                  <div style={{ background: 'rgba(99,102,241,0.1)', color: '#6366f1', width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}><Icon size={20} /></div>
                  <h3 style={{ fontSize: 13, fontWeight: 800, marginBottom: 4, color: '#0f172a' }}>{f.title}</h3>
                  <p style={{ fontSize: 11, color: '#64748b', margin: 0, lineHeight: 1.4 }}>{f.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* شبكة الماركات */}
      <section style={{ padding: '24px 16px 20px' }}>
        <div style={{ maxWidth: 850, margin: '0 auto' }}>
          <h2 data-reveal style={{ fontSize: 'clamp(17px, 3.5vw, 20px)', fontWeight: 900, textAlign: 'center', marginBottom: 16 }} className="reveal-item">ملفات لجميع الماركات</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))', gap: 10 }}>
            {brands.map((brand, i) => (
              <button key={i} data-reveal onClick={() => navigate(`/store?brand=${brand.code}`)} className="reveal-item" style={{ padding: '10px 6px', textAlign: 'center', cursor: 'pointer', background: '#fff', border: '1px solid #e2e8f0', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 65, transition: 'all 0.2s', fontWeight: 700, fontSize: 12, color: '#334155' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <span>{brand.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* الباقات */}
      <section style={{ padding: '16px 16px 10px' }}>
        <div data-reveal className="reveal-item custom-part-card" style={{ maxWidth: 850, margin: '0 auto', background: '#ffffff', border: '2px dashed #6366f1', borderRadius: 16, padding: '20px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
          <div style={{ flex: '1 1 240px' }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>اشترك في الباقات</h3>
            <p style={{ fontSize: 12, color: '#64748b', margin: 0, lineHeight: 1.5 }}>احصل على توكنز بأسعار مناسبة وحمّل كل الملفات التي تحتاجها.</p>
          </div>
          <Link to="/store" style={{ background: '#6366f1', color: '#fff', padding: '10px 18px', borderRadius: 10, textDecoration: 'none', fontWeight: 800, fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.2)' }}>
            <Sparkles size={15} />
            <span>اشترك الآن</span>
          </Link>
        </div>
      </section>

      {/* دعوة للتحميل */}
      <section style={{ padding: '24px 16px 30px' }}>
        <div data-reveal className="reveal-item" style={{ maxWidth: 850, margin: '0 auto', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: 16, padding: '28px 18px', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ fontSize: 'clamp(18px, 4vw, 22px)', fontWeight: 900, color: '#f59e0b', marginBottom: 8 }}>هل تبحث عن سوفتوير نادر؟</h2>
          <p style={{ color: '#94a3b8', marginBottom: 20, fontSize: 13 }}>نوفر لك أحدث الملفات والمخططات لمختلف الشاشات والماركات.</p>
          <Link to="/store" style={{ background: '#6366f1', color: '#fff', padding: '10px 24px', borderRadius: 10, textDecoration: 'none', fontWeight: 800, fontSize: 14, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span>تصفح المتجر الآن</span>
            <ArrowRight size={15} style={{ transform: 'rotate(180deg)' }} />
          </Link>
        </div>
      </section>

      {/* الفوتر */}
      <footer style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '24px 16px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 850, margin: '0 auto' }}>
          <div style={{ fontSize: 18, fontWeight: 900, marginBottom: 4 }}>SerialCo<span style={{ color: '#f59e0b' }}>TV</span></div>
          <p style={{ fontSize: 12, color: '#64748b', margin: 0 }}>منصة السوفتوير والمخططات الأولى في الجزائر</p>
        </div>
      </footer>

      <style>{`
        .hero-banner { height: 240px; }
        @media (min-width: 640px) { .hero-banner { height: 350px; } }
        .reveal-item { opacity: 0; transform: translateY(20px); transition: all 0.6s ease; }
        .reveal-item.is-visible { opacity: 1 !important; transform: translateY(0) !important; }
        @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 0.3; } 100% { opacity: 0.6; } }
      `}</style>
    </div>
  );
}