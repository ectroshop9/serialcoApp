import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import { Search, Download, ShoppingCart, Tv } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  product_type: 'physical' | 'digital';
  image: string | null;
  description?: string;
}

export default function PublicProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [serialModal, setSerialModal] = useState(false);
  const [selProduct, setSelProduct] = useState<Product | null>(null);
  const [serial, setSerial] = useState('');
  const [pin, setPin] = useState('');

  const API = 'https://serialcotv.onrender.com/api/store';

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    fetch(`${API}/products/?${params}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [type]);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  const handleAction = (p: Product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    if (p.product_type === 'digital') {
      setSelProduct(p);
      setSerialModal(true);
    } else {
      navigate(`/store/product/${p.id}`);
    }
  };

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`تحميل ${selProduct?.name}...`);
    setSerialModal(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <header style={{
        background: 'var(--grad-primary)', padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        color: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Tv style={{ width: 28, height: 28 }} />
          <span style={{ fontSize: 20, fontWeight: 900 }}>SerialCo TV</span>
        </div>
        <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
          دخول / تسجيل
        </Link>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <div className="field">
            <span className="field-icon"><Search /></span>
            <input className="field-input" placeholder="ابحث عن منتج..." value={q} onChange={e => setQ(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {['', 'physical', 'digital'].map(t => (
            <button key={t} onClick={() => setType(t)} className={type === t ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}>
              {t === '' ? 'الكل' : t === 'physical' ? 'منتجات مادية' : 'منتجات رقمية'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>جاري التحميل...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {filtered.map(p => (
              <div key={p.id} className="card" style={{ padding: 20 }}>
                <img src={p.image || '/placeholder.jpg'} alt={p.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{p.name}</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary)', marginBottom: 12 }}>{p.price} ر.س</div>
                <button onClick={() => handleAction(p)} className="btn btn-primary btn-block">
                  {p.product_type === 'digital' ? <><Download /> تحميل</> : <><ShoppingCart /> اطلب الآن</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={serialModal} onClose={() => setSerialModal(false)} title="التحميل يتطلب سيريال">
        <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input className="field-input" placeholder="رقم السيريال" value={serial} onChange={e => setSerial(e.target.value)} required />
          <input className="field-input" type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} required />
          <button type="submit" className="btn btn-primary btn-block"><Download /> تأكيد التحميل</button>
        </form>
      </Modal>
    </div>
  );
}