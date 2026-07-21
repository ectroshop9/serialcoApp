import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import { Search, ShoppingCart,  Coins } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  product_type: 'physical' | 'digital';
  image: string | null;
  description?: string;
  token_cost?: number;
}

const API_BASE_URL = 'https://serialcotv.onrender.com/api/store';
const PLACEHOLDER_IMAGE = '/placeholder.jpg';

export default function PublicProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [isSerialModalOpen, setIsSerialModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [serialCode, setSerialCode] = useState<string>('');
  const [pinCode, setPinCode] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const params = new URLSearchParams();
    if (selectedType) params.append('type', selectedType);
    fetch(`${API_BASE_URL}/products/?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) { setProducts(data.products || []); setLoading(false); }
      })
      .catch(() => { if (isMounted) { setProducts([]); setLoading(false); } });
    return () => { isMounted = false; };
  }, [selectedType]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleProductAction = (product: Product) => {
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    if (product.product_type === 'digital') {
      setSelectedProduct(product);
      setIsSerialModalOpen(true);
    } else {
      navigate(`/store/product/${product.id}`);
    }
  };

  const handleCloseModal = () => {
    setIsSerialModalOpen(false);
    setSelectedProduct(null);
    setSerialCode('');
    setPinCode('');
  };

  const handleDownloadConfirm = (e: FormEvent) => {
    e.preventDefault();
    if (!serialCode.trim() || !pinCode.trim()) return;
    alert(`تم خصم ${selectedProduct?.token_cost || 500} توكن - جاري التحميل: ${selectedProduct?.name || 'المنتج'}`);
    handleCloseModal();
  };

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', direction: 'rtl', minHeight: '100vh' }}>
      
      <nav className="glass sticky top-0 z-50" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '10px 16px' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div className="text-lg font-black tracking-wider" style={{ color: 'var(--primary)' }}>SERIALCO<span style={{ color: 'var(--accent)' }}>TV</span></div>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/login" className="btn btn-ghost text-xs px-3 py-1.5">دخول / تسجيل</Link>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        <div style={{ marginBottom: 24 }}>
          <div className="field">
            <span className="field-icon"><Search style={{ width: 18, height: 18 }} /></span>
            <input className="field-input" placeholder="ابحث عن منتج..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[{ value: '', label: 'الكل' }, { value: 'physical', label: 'منتجات مادية' }, { value: 'digital', label: 'منتجات رقمية' }].map(f => (
            <button key={f.value} type="button" onClick={() => setSelectedType(f.value)}
              className={selectedType === f.value ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}>
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>جاري التحميل...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="card" style={{ padding: 60, textAlign: 'center' }}>
            <p style={{ fontSize: 16, fontWeight: 700 }}>لا توجد منتجات</p>
            <p style={{ color: 'var(--text-muted)' }}>لا توجد منتجات مطابقة للبحث</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {filteredProducts.map(product => (
              <div key={product.id} className="card" style={{ padding: 20 }}>
                <img src={product.image || PLACEHOLDER_IMAGE} alt={product.name}
                  onError={e => { (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE; }}
                  style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: 12, marginBottom: 16 }} />
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{product.name}</div>
                {product.product_type === 'digital' && product.token_cost && (
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--accent)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <Coins style={{ width: 16, height: 16 }} />
                    {product.token_cost.toLocaleString()} توكن
                  </div>
                )}
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary)', marginBottom: 12 }}>{product.price} ر.س</div>
                <button type="button" onClick={() => handleProductAction(product)} className="btn btn-primary btn-block">
                  {product.product_type === 'digital' ? <><Coins /> استخدام التوكن</> : <><ShoppingCart /> اطلب الآن</>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isSerialModalOpen} onClose={handleCloseModal} title="استخدام التوكن">
        <form onSubmit={handleDownloadConfirm} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input className="field-input" placeholder="رقم السيريال" value={serialCode} onChange={e => setSerialCode(e.target.value)} required />
          <input className="field-input" type="password" placeholder="PIN" value={pinCode} onChange={e => setPinCode(e.target.value)} required />
          <button type="submit" className="btn btn-primary btn-block"><Coins /> خصم التوكن والتحميل</button>
        </form>
      </Modal>

      {/* Footer موحد */}
      <footer className="reveal" data-reveal style={{ background: 'var(--bg-sidebar)', color: 'var(--text-sidebar)', borderTop: '1px solid var(--border)', padding: '32px 16px 16px 16px' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-base font-black text-white tracking-wider" style={{ marginBottom: '8px' }}>SERIALCO<span style={{ color: 'var(--accent)' }}>TV</span></div>
            <p style={{ fontSize: '11px', lineHeight: 1.5, opacity: 0.8 }}>المنصة الأولى لدعم فنيي الشاشات بملفات السوفتوير والمخططات المضمونة في الجزائر.</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>روابط سريعة</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '11px' }}>
              <li style={{ marginBottom: '4px' }}><Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>اتصل بنا</Link></li>
              <li style={{ marginBottom: '4px' }}><Link to="/privacy" style={{ color: 'inherit', textDecoration: 'none' }}>سياسة الاستخدام</Link></li>
              <li style={{ marginBottom: '4px' }}><Link to="/terms" style={{ color: 'inherit', textDecoration: 'none' }}>شروط الاستخدام</Link></li>
              <li style={{ marginBottom: '4px' }}><Link to="/faq" style={{ color: 'inherit', textDecoration: 'none' }}>الأسئلة الشائعة</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>تابعنا</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ background: '#1877F2', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#fff' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ background: '#0088cc', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#fff' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.46-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.145.118.185.276.204.408.019.132.043.43.024.662z"/></svg>
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" style={{ background: '#FF0000', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#fff' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #334155', fontSize: '11px', opacity: 0.7 }}>
          <p>&copy; 2026 SerialcoTV. جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </div>
  );
}