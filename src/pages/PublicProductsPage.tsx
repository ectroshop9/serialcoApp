import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import { Search, ShoppingCart, Coins } from 'lucide-react';

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

export default function PublicProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const [modal, setModal] = useState(false);
  const [sel, setSel] = useState<Product | null>(null);
  const [serial, setSerial] = useState('');
  const [pin, setPin] = useState('');
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const params = type ? `?type=${type}` : '';
    fetch(`${API_BASE_URL}/products/${params}`)
      .then(res => res.json())
      .then(data => { setProducts(data.products || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [type]);

  const filtered = products.filter(p => p.name.toLowerCase().includes(q.toLowerCase()));

  const handleAction = (product: Product) => {
    if (!localStorage.getItem('access_token')) { navigate('/login'); return; }
    if (product.product_type === 'digital') { setSel(product); setModal(true); }
    else navigate(`/store/product/${product.id}`);
  };

  const handleDownload = async (e: FormEvent) => {
    e.preventDefault();
    if (!sel || !serial || !pin) return;
    setDownloading(true);
    try {
      const res = await fetch(`${API}/api/firmware/${sel.id}/?serial_number=${serial}&pin=${pin}`);
      const data = await res.json();
      if (data.success) {
        window.open(data.download_url, '_blank');
        setModal(false);
        setSerial(''); setPin('');
      } else alert(data.message || 'فشل');
    } catch { alert('خطأ في الاتصال'); }
    finally { setDownloading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <nav style={{ background: 'var(--bg-secondary)', padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between' }}>
          <Link to="/" style={{ fontWeight: 900, color: 'var(--primary)', textDecoration: 'none', fontSize: 18 }}>SERIALCO<span style={{ color: 'var(--accent)' }}>TV</span></Link>
          <Link to="/login" className="btn btn-ghost btn-sm">دخول / تسجيل</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <div className="field" style={{ marginBottom: 24 }}>
          <span className="field-icon"><Search /></span>
          <input className="field-input" placeholder="بحث..." value={q} onChange={e => setQ(e.target.value)} />
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {['', 'physical', 'digital'].map(t => (
            <button key={t} onClick={() => setType(t)} className={type === t ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}>
              {t === '' ? 'الكل' : t === 'physical' ? 'مادي' : 'رقمي'}
            </button>
          ))}
        </div>

        {loading ? <div style={{ textAlign: 'center', padding: 60 }}>جاري التحميل...</div> :
         filtered.length === 0 ? <div className="card" style={{ padding: 60, textAlign: 'center' }}>لا توجد منتجات</div> :
         <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
           {filtered.map(p => (
             <div key={p.id} className="card" style={{ padding: 20 }}>
               <img src={p.image || '/placeholder.jpg'} alt={p.name} style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
               <h3>{p.name}</h3>
               {p.token_cost && <div><Coins /> {p.token_cost} توكن</div>}
               <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary)', marginBottom: 12 }}>{p.price} ر.س</div>
               <button onClick={() => handleAction(p)} className="btn btn-primary btn-block">
                 {p.product_type === 'digital' ? <><Coins /> استخدام التوكن</> : <><ShoppingCart /> اطلب الآن</>}
               </button>
             </div>
           ))}
         </div>
        }
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="استخدام التوكن">
        <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input className="field-input" placeholder="رقم السيريال" value={serial} onChange={e => setSerial(e.target.value)} required disabled={downloading} />
          <input className="field-input" type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} required disabled={downloading} />
          <button type="submit" className="btn btn-primary btn-block" disabled={downloading}>
            {downloading ? 'جاري...' : <><Coins /> خصم التوكن والتحميل</>}
          </button>
        </form>
      </Modal>
    </div>
  );
}
