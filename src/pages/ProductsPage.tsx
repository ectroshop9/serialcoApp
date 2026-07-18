import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, Download, ShoppingCart, ArrowRight } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  product_type: 'physical' | 'digital';
  image: string | null;
  category__name: string;
  description?: string;
}

export default function ProductsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const category = searchParams.get('category') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');

  const API = 'https://serialcotv.onrender.com/api/store';

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/products/?category=${category}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [category]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  const categoryLabels: Record<string, string> = {
    firmware: 'سوفتوير',
    power_supply: 'باور سبلاي',
    main_board: 'مين بورد',
    t_con: 'تي كون',
    emmc: 'مخططات EMMC',
    parts: 'قطع إلكترونية',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="row-between anim-fade-up">
        <div>
          <button onClick={() => navigate('/store')} className="btn btn-ghost btn-sm" style={{ marginBottom: 8 }}>
            <ArrowRight style={{ width: 18, height: 18 }} /> المتجر
          </button>
          <h1 className="page-title">{categoryLabels[category] || 'المنتجات'}</h1>
          <p className="page-desc">{products.length} منتج متاح</p>
        </div>
      </div>

      <div className="anim-fade-up">
        <div className="field" style={{ maxWidth: 400 }}>
          <span className="field-icon"><Search /></span>
          <input className="field-input" placeholder="ابحث عن منتج..." value={q} onChange={e => setQ(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>جاري التحميل...</div>
      ) : filtered.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>لا توجد منتجات</p>
          <p style={{ color: 'var(--text-muted)' }}>لم يتم العثور على منتجات في هذا التصنيف</p>
        </div>
      ) : (
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {filtered.map(p => (
            <div key={p.id} className="card" style={{ padding: 20 }}>
              <img src={p.image || '/placeholder.jpg'} alt={p.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
              <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary)', marginBottom: 12 }}>{p.price} ر.س</div>
              <button onClick={() => navigate(`/store/product/${p.id}`)} className="btn btn-primary btn-block">
                {p.product_type === 'digital' ? <><Download /> تحميل</> : <><ShoppingCart /> اطلب الآن</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
