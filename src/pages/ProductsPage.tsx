import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, ArrowRight, AlertCircle, Loader2, X, Coins } from 'lucide-react';

const API = 'https://serialcotv.onrender.com';
const API_BASE_URL = `${API}/api/store`;

interface Product {
  id: number;
  name: string;
  price: string;
  product_type: 'physical' | 'digital';
  image: string | null;
  token_cost?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  firmware: 'سوفتوير',
  power_supply: 'باور سبلاي',
  main_board: 'مين بورد',
  t_con: 'تي كون',
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
    setLoading(true);
    const url = category === 'firmware'
      ? `${API}/api/firmware/`
      : `${API_BASE_URL}/products/${category ? `?category=${category}` : ''}`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (category === 'firmware') {
          const items = (data.firmwares || []).map((f: any) => ({
            id: f.id,
            name: `${f.brand__name} - ${f.model_number}${f.version ? ' v' + f.version : ''}`,
            price: `${f.token_cost} توكن`,
            product_type: 'digital' as const,
            image: null,
            token_cost: f.token_cost,
          }));
          setProducts(items);
        } else {
          setProducts(data.products || []);
        }
        setLoading(false);
      })
      .catch(() => { setError('فشل التحميل'); setLoading(false); });
  }, [category]);

  const filtered = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Loader2 className="spin" /><p>جاري التحميل...</p></div>;
  if (error) return <div className="card" style={{ textAlign: 'center', padding: 40 }}><AlertCircle /><p>{error}</p><button onClick={() => window.location.reload()} className="btn btn-primary">إعادة</button></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="row-between">
        <div>
          <button onClick={() => navigate('/store')} className="btn btn-ghost btn-sm"><ArrowRight /> العودة</button>
          <h1 className="page-title">{CATEGORY_LABELS[category] || 'المنتجات'}</h1>
          <p className="page-desc">{filtered.length} منتج</p>
        </div>
      </div>

      <div className="field" style={{ maxWidth: 400 }}>
        <span className="field-icon"><Search /></span>
        <input className="field-input" placeholder="بحث..." value={q} onChange={e => setQ(e.target.value)} />
        {q && <button onClick={() => setQ('')}><X /></button>}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 60, textAlign: 'center' }}><p>لا توجد منتجات</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {filtered.map(p => (
            <div key={p.id} className="card" style={{ padding: 20 }}>
              <img src={p.image || '/placeholder.jpg'} alt={p.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
              <h3>{p.name}</h3>
              {p.token_cost && <div><Coins /> {p.token_cost} توكن</div>}
              <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary)', marginBottom: 16 }}>{p.price}</div>
              <button onClick={() => navigate(`/store/product/${p.id}`)} className="btn btn-primary btn-block">
                {p.product_type === 'digital' ? <><Coins /> استخدام التوكن</> : <><ShoppingCart /> اطلب الآن</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
