import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, ArrowRight, AlertCircle, Loader2, X, Coins } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  product_type: 'physical' | 'digital';
  image: string | null;
  category__name?: string;
  description?: string;
  token_cost?: number;
}

const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_URL as string) ||
  'https://serialcotv.onrender.com/api/store';

const CATEGORY_LABELS: Record<string, string> = {
  firmware: 'سوفتوير',
  power_supply: 'باور سبلاي',
  main_board: 'مين بورد',
  t_con: 'تي كون',
  emmc: 'مخططات EMMC',
  parts: 'قطع إلكترونية',
};

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const url = `${API_BASE_URL}/products/${category ? `?category=${encodeURIComponent(category)}` : ''}`;

    fetch(url)
      .then(async res => {
        if (!res.ok) throw new Error('فشل في جلب المنتجات من الخادم');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          setProducts(data.products || (Array.isArray(data) ? data : []));
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || 'حدث خطأ أثناء تحميل المنتجات');
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [category]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(q.trim().toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="row-between anim-fade-up">
        <div>
          <button type="button" onClick={() => navigate('/store')} className="btn btn-ghost btn-sm" style={{ marginBottom: 8 }}>
            <ArrowRight style={{ width: 18, height: 18 }} /> العودة للمتجر
          </button>
          <h1 className="page-title">{CATEGORY_LABELS[category] || 'جميع المنتجات'}</h1>
          <p className="page-desc">{loading ? 'جاري التحميل...' : `${filteredProducts.length} منتج متاح`}</p>
        </div>
      </div>

      <div className="anim-fade-up">
        <div className="field" style={{ maxWidth: 400, position: 'relative' }}>
          <span className="field-icon"><Search style={{ width: 18, height: 18 }} /></span>
          <input type="text" className="field-input" placeholder="ابحث عن منتج..." value={q} onChange={e => setQ(e.target.value)} style={{ paddingLeft: q ? 36 : undefined }} />
          {q && (
            <button type="button" onClick={() => setQ('')} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }} title="مسح البحث">
              <X style={{ width: 16, height: 16 }} />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
          <Loader2 style={{ width: 32, height: 32, margin: '0 auto 12px' }} className="spin" />
          <p>جاري تحميل المنتجات...</p>
        </div>
      ) : error ? (
        <div className="card" style={{ padding: '40px 20px', textAlign: 'center', maxWidth: 480, margin: '20px auto' }}>
          <AlertCircle style={{ width: 48, height: 48, color: '#ef4444', margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 18, marginBottom: 8 }}>حدث خطأ</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>{error}</p>
          <button type="button" onClick={() => window.location.reload()} className="btn btn-primary">إعادة المحاولة</button>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>لا توجد منتجات</p>
          <p style={{ color: 'var(--text-muted)' }}>{q ? `لم يتم العثور على نتائج تطابق "${q}"` : 'لم يتم العثور على منتجات في هذا التصنيف'}</p>
        </div>
      ) : (
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filteredProducts.map(product => (
            <div key={product.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ background: 'var(--bg-subtle, #f8fafc)', borderRadius: 12, overflow: 'hidden', marginBottom: 16 }}>
                  <img src={product.image || '/placeholder.jpg'} alt={product.name} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, lineHeight: 1.3 }}>{product.name}</h3>
                {product.product_type === 'digital' && product.token_cost && (
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Coins style={{ width: 16, height: 16 }} />
                    {product.token_cost.toLocaleString()} توكن
                  </div>
                )}
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary)', marginBottom: 16 }}>{product.price} ر.س</div>
              </div>
              <button type="button" onClick={() => navigate(`/store/product/${product.id}`)} className="btn btn-primary btn-block">
                {product.product_type === 'digital' ? <><Coins style={{ width: 18, height: 18 }} /> استخدام التوكن</> : <><ShoppingCart style={{ width: 18, height: 18 }} /> اطلب الآن</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}