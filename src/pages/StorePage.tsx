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
        const firmwares = (firmwareData.firmwares || []).map((f: any) => ({
          id: f.id,
          name: `${f.brand__name} - ${f.model_number}${f.version ? ' v' + f.version : ''}`,
          type: 'firmware' as const,
          token_cost: f.token_cost,
          brand: f.brand__name,
          model_number: f.model_number,
          description: f.description,
        }));

        const schematics = (schematicData.schematics || []).map((s: any) => ({
          id: s.id,
          name: `${s.brand__name} - ${s.model_number} - ${s.title}`,
          type: 'schematic' as const,
          token_cost: s.token_cost,
          brand: s.brand__name,
          model_number: s.model_number,
          description: s.description,
        }));

        setProducts([...firmwares, ...schematics]);
        setBrands(brandData.brands || []);
        setLoading(false);
      })
      .catch(() => {
        setError('فشل تحميل الملفات');
        setLoading(false);
      });
  }, []);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchTab = activeTab === 'all' || p.type === activeTab;
    const matchBrand = !selectedBrand || p.brand === brands.find(b => b.id === selectedBrand)?.name;
    return matchSearch && matchTab && matchBrand;
  });

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <Loader2 className="spin" size={36} />
      <p>جاري التحميل...</p>
    </div>
  );

  if (error) return (
    <div className="card" style={{ textAlign: 'center', padding: 40 }}>
      <AlertCircle />
      <p>{error}</p>
      <button onClick={() => window.location.reload()} className="btn btn-primary">إعادة</button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: '20px 16px', maxWidth: '1100px', margin: '0 auto' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 8 }}>
        <h1 className="page-title" style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 900, marginBottom: 8 }}>
          مكتبة الملفات
        </h1>
        <p className="page-desc" style={{ fontSize: 14, color: 'var(--text-muted)' }}>
          {filtered.length} ملف متاح
        </p>
      </div>

      {/* Search */}
      <div className="field" style={{ maxWidth: 500, margin: '0 auto', width: '100%' }}>
        <span className="field-icon"><Search /></span>
        <input 
          className="field-input" 
          placeholder="ابحث برقم الموديل أو الماركة..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, background: 'var(--bg-card)', padding: 4, borderRadius: 12, border: '1px solid var(--border)' }}>
          {[
            { key: 'all', label: 'الكل', icon: null },
            { key: 'firmware', label: 'سوفتوير', icon: Cpu },
            { key: 'schematic', label: 'مخططات', icon: CircuitBoard },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                padding: '8px 16px',
                borderRadius: 8,
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: activeTab === tab.key ? 'var(--grad-primary)' : 'transparent',
                color: activeTab === tab.key ? '#fff' : 'var(--text-muted)',
                transition: 'all 0.2s',
              }}
            >
              {tab.icon && <tab.icon size={14} />}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Brand Filter */}
        <select
          value={selectedBrand || ''}
          onChange={e => setSelectedBrand(e.target.value ? Number(e.target.value) : null)}
          className="field-input"
          style={{ maxWidth: 180, padding: '8px 12px', borderRadius: 8 }}
        >
          <option value="">كل الماركات</option>
          {brands.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <p>لا توجد ملفات مطابقة</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', 
          gap: 16 
        }}>
          {filtered.map(p => (
            <div 
              key={`${p.type}-${p.id}`} 
              className="card" 
              style={{ 
                padding: 20,
                cursor: 'pointer',
                transition: 'all 0.3s',
                border: '1px solid var(--border)',
                borderRadius: 16,
              }}
              onClick={() => navigate(`/store/product/${p.id}?type=${p.type}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Icon */}
              <div style={{ 
                background: p.type === 'firmware' ? 'var(--grad-primary)' : 'var(--grad-success)',
                width: 48,
                height: 48,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}>
                {p.type === 'firmware' ? <Cpu size={22} color="#fff" /> : <CircuitBoard size={22} color="#fff" />}
              </div>

              {/* Name */}
              <h3 style={{ fontSize: 14, fontWeight: 800, marginBottom: 6, lineHeight: 1.4 }}>
                {p.name}
              </h3>

              {/* Brand */}
              <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12 }}>
                {p.brand} | {p.model_number}
              </div>

              {/* Token Cost */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 6,
                fontSize: 14,
                fontWeight: 800,
                color: 'var(--accent)',
              }}>
                <Coins size={16} /> {p.token_cost} توكن
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}