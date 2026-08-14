import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Coins, Cpu, CircuitBoard, Loader2, AlertCircle, X } from 'lucide-react';

const API = 'https://serialcotv.onrender.com';

interface Product {
  id: number;
  name: string;
  type: 'firmware' | 'schematic';
  token_cost: number;
  brand: string;
  model_number: string;
  description?: string;
}

export default function StorePage() {
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'firmware' | 'schematic'>('all');
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`${API}/api/content/firmware/`).then(r => r.json()),
      fetch(`${API}/api/content/schematics/`).then(r => r.json()),
      fetch(`${API}/api/content/brands/`).then(r => r.json()),
    ])
      .then(([firmwareData, schematicData, brandData]) => {
        console.log('Firmware:', firmwareData);
        console.log('Schematics:', schematicData);
        console.log('Brands:', brandData);

        const firmwares = (firmwareData.firmwares || firmwareData.results || []).map((f: any) => ({
          id: f.id,
          name: `${f.brand__name || f.brand_name || f.brand} - ${f.model_number}${f.version ? ' v' + f.version : ''}`,
          type: 'firmware' as const,
          token_cost: f.token_cost || 0,
          brand: f.brand__name || f.brand_name || f.brand || '',
          model_number: f.model_number,
          description: f.description,
        }));

        const schematics = (schematicData.schematics || schematicData.results || []).map((s: any) => ({
          id: s.id,
          name: `${s.brand__name || s.brand_name || s.brand} - ${s.model_number} - ${s.title}`,
          type: 'schematic' as const,
          token_cost: s.token_cost || 0,
          brand: s.brand__name || s.brand_name || s.brand || '',
          model_number: s.model_number,
          description: s.description,
        }));

        setProducts([...firmwares, ...schematics]);
        setBrands(brandData.brands || brandData.results || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error:', err);
        setError('فشل تحميل الملفات');
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === 'all' || p.type === activeTab;
    const matchBrand = !selectedBrand || brands.find(b => b.id === selectedBrand)?.name === p.brand;
    return matchSearch && matchTab && matchBrand;
  });

  const firmwareCount = products.filter(p => p.type === 'firmware').length;
  const schematicCount = products.filter(p => p.type === 'schematic').length;

  if (loading) return (
    <div style={{ 
      textAlign: 'center', 
      padding: 80,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 16,
      minHeight: '100vh',
      justifyContent: 'center',
    }}>
      <Loader2 className="spin" size={48} style={{ color: 'var(--primary)' }} />
      <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-muted)' }}>جاري تحميل الملفات...</p>
    </div>
  );

  if (error) return (
    <div className="card" style={{ textAlign: 'center', padding: 60, margin: 40 }}>
      <AlertCircle size={48} style={{ color: '#ef4444' }} />
      <p style={{ fontSize: 16, marginBottom: 16 }}>{error}</p>
      <button onClick={() => window.location.reload()} className="btn btn-primary">إعادة المحاولة</button>
    </div>
  );

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      gap: 20, 
      padding: '24px 16px', 
      maxWidth: '1100px', 
      margin: '0 auto',
      minHeight: '100vh',
    }}>
      
      {/* Hero Section */}
      <div style={{ 
        textAlign: 'center', 
        marginBottom: 12,
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        borderRadius: 24,
        color: '#fff',
      }}>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 900, marginBottom: 8 }}>
          مكتبة الملفات
        </h1>
        <p style={{ fontSize: 14, opacity: 0.9, marginBottom: 24 }}>
          سوفتويرات ومخططات محدثة لجميع الماركات
        </p>
        
        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 20px', borderRadius: 12, backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 24, fontWeight: 900 }}>{products.length}</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>ملف إجمالي</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 20px', borderRadius: 12, backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 24, fontWeight: 900 }}>{firmwareCount}</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>سوفتوير</div>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.15)', padding: '10px 20px', borderRadius: 12, backdropFilter: 'blur(10px)' }}>
            <div style={{ fontSize: 24, fontWeight: 900 }}>{schematicCount}</div>
            <div style={{ fontSize: 11, opacity: 0.9 }}>مخططات</div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="field" style={{ width: '100%' }}>
          <span className="field-icon"><Search /></span>
          <input 
            className="field-input" 
            placeholder="ابحث برقم الموديل أو اسم الماركة..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)}
            style={{ padding: '14px 40px', fontSize: 15 }}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'absolute', left: 12 }}>
              <X size={18} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: activeTab === 'all' ? '2px solid #6366f1' : '1px solid var(--border)',
              background: activeTab === 'all' ? 'rgba(99,102,241,0.1)' : 'transparent',
              color: activeTab === 'all' ? '#6366f1' : 'var(--text-muted)',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: 13,
            }}
          >
            الكل ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('firmware')}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: activeTab === 'firmware' ? '2px solid #6366f1' : '1px solid var(--border)',
              background: activeTab === 'firmware' ? 'rgba(99,102,241,0.1)' : 'transparent',
              color: activeTab === 'firmware' ? '#6366f1' : 'var(--text-muted)',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Cpu size={16} /> سوفتوير ({firmwareCount})
          </button>
          <button
            onClick={() => setActiveTab('schematic')}
            style={{
              padding: '10px 20px',
              borderRadius: 12,
              border: activeTab === 'schematic' ? '2px solid #10b981' : '1px solid var(--border)',
              background: activeTab === 'schematic' ? 'rgba(16,185,129,0.1)' : 'transparent',
              color: activeTab === 'schematic' ? '#10b981' : 'var(--text-muted)',
              fontWeight: 800,
              cursor: 'pointer',
              fontSize: 13,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <CircuitBoard size={16} /> مخططات ({schematicCount})
          </button>

          <select
            value={selectedBrand || ''}
            onChange={e => setSelectedBrand(e.target.value ? Number(e.target.value) : null)}
            style={{
              padding: '10px 16px',
              borderRadius: 12,
              border: '1px solid var(--border)',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--text-muted)',
              marginRight: 'auto',
            }}
          >
            <option value="">كل الماركات</option>
            {brands.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'var(--bg-card)', borderRadius: 20, border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>لا توجد ملفات مطابقة</p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>جرب تغيير البحث أو الفلاتر</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: 16 
        }}>
          {filtered.map(p => (
            <div 
              key={`${p.type}-${p.id}`} 
              onClick={() => navigate(`/store/product/${p.id}?type=${p.type}`)}
              style={{ 
                padding: 20,
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '1px solid var(--border)',
                borderRadius: 16,
                background: 'var(--bg-card)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ 
                background: p.type === 'firmware' ? 'rgba(99,102,241,0.1)' : 'rgba(16,185,129,0.1)',
                width: 48,
                height: 48,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}>
                {p.type === 'firmware' ? <Cpu size={22} color="#6366f1" /> : <CircuitBoard size={22} color="#10b981" />}
              </div>

              <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 6, lineHeight: 1.4 }}>
                {p.name}
              </h3>

              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                {p.brand}
              </div>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6,
                fontSize: 14,
                fontWeight: 800,
                color: '#f59e0b',
              }}>
                <Coins size={16} /> {p.token_cost} توكن
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}