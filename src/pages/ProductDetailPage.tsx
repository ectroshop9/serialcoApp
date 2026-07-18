import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import { Download, ShoppingCart, ArrowRight, CheckCircle } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  product_type: 'physical' | 'digital';
  image: string | null;
  description?: string;
  stock?: number;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [serialModal, setSerialModal] = useState(false);
  const [serial, setSerial] = useState('');
  const [pin, setPin] = useState('');
  const [form, setForm] = useState({ full_name: '', phone: '', address: '', notes: '', quantity: 1 });
  const [submitted, setSubmitted] = useState(false);

  const API = 'https://serialcotv.onrender.com/api/store';

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/products/${id}/`)
      .then(res => res.json())
      .then(data => {
        setProduct(data.product);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`تحميل ${product?.name}...`);
    setSerialModal(false);
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    fetch(`${API}/orders/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: form.full_name,
        phone: form.phone,
        address: form.address,
        notes: form.notes,
        items: [{ product_id: product?.id, quantity: form.quantity }],
      }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSubmitted(true);
        }
      });
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>جاري التحميل...</div>;
  }

  if (!product) {
    return <div style={{ textAlign: 'center', padding: 60 }}>المنتج غير موجود</div>;
  }

  if (submitted) {
    return (
      <div className="card anim-scale-in" style={{ maxWidth: 500, margin: '40px auto', padding: 40, textAlign: 'center' }}>
        <CheckCircle style={{ width: 60, height: 60, color: '#10b981', margin: '0 auto 16px' }} />
        <h2 style={{ marginBottom: 8 }}>تم استلام طلبك!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>سيتم التواصل معك قريباً لتأكيد الطلب</p>
        <button onClick={() => navigate('/store')} className="btn btn-primary">العودة للمتجر</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }}>
        <ArrowRight style={{ width: 18, height: 18 }} /> رجوع
      </button>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24 }}>
          <img src={product.image || '/placeholder.jpg'} alt={product.name} style={{ width: '100%', borderRadius: 16 }} />
          
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>{product.name}</h1>
            {product.description && <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>{product.description}</p>}
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)', marginBottom: 24 }}>{product.price} ر.س</div>
            
            {product.product_type === 'digital' ? (
              <button onClick={() => setSerialModal(true)} className="btn btn-primary btn-block btn-lg">
                <Download /> تحميل
              </button>
            ) : (
              <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input className="field-input" placeholder="الاسم الكامل" value={form.full_name} onChange={e => setForm({...form, full_name: e.target.value})} required />
                <input className="field-input" placeholder="رقم الهاتف" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} required />
                <input className="field-input" placeholder="العنوان التفصيلي" value={form.address} onChange={e => setForm({...form, address: e.target.value})} required />
                <div className="field">
                  <span className="field-icon">الكمية</span>
                  <input className="field-input" type="number" min="1" value={form.quantity} onChange={e => setForm({...form, quantity: +e.target.value})} />
                </div>
                <textarea className="field-input" placeholder="ملاحظات (اختياري)" value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} rows={3} />
                <button type="submit" className="btn btn-primary btn-block btn-lg">
                  <ShoppingCart /> تأكيد الطلب (الدفع عند الاستلام)
                </button>
              </form>
            )}
          </div>
        </div>
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
