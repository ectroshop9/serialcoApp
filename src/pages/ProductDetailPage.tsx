import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import { ShoppingCart, ArrowRight, CheckCircle, AlertCircle, Loader2, Coins } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  product_type: 'physical' | 'digital';
  image: string | null;
  description?: string;
  token_cost?: number;
  stock?: number;
}

const API_BASE_URL = 'https://serialcotv.onrender.com/api/store';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [serialModal, setSerialModal] = useState(false);
  const [serial, setSerial] = useState('');
  const [pin, setPin] = useState('');
  const [downloading, setDownloading] = useState(false);

  const [form, setForm] = useState({ full_name: '', phone: '', address: '', notes: '', quantity: 1 });
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/products/${id}/`)
      .then(res => res.json())
      .then(data => { setProduct(data.product || data); setLoading(false); })
      .catch(() => { setFetchError('فشل التحميل'); setLoading(false); });
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Loader2 className="spin" /><p>جاري التحميل...</p></div>;
  if (fetchError || !product) return <div className="card" style={{ textAlign: 'center', padding: 60 }}><AlertCircle /><h2>غير موجود</h2><button onClick={() => navigate('/store')} className="btn btn-primary">العودة</button></div>;
  if (submitted) return <div className="card" style={{ textAlign: 'center', padding: 40 }}><CheckCircle /><h2>تم!</h2><button onClick={() => navigate('/store')} className="btn btn-primary">العودة</button></div>;

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setDownloading(true);
    setTimeout(() => { setDownloading(false); setSerialModal(false); alert('تم التحميل'); }, 1000);
  };

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, items: [{ product_id: product.id, quantity: form.quantity }] }),
      });
      const data = await res.json();
      if (res.ok) setSubmitted(true);
      else setOrderError(data.message);
    } catch { setOrderError('خطأ'); }
    setSubmitting(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm"><ArrowRight /> رجوع</button>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          <div style={{ background: '#f8fafc', borderRadius: 16, textAlign: 'center' }}>
            <img src={product.image || '/placeholder.jpg'} alt={product.name} style={{ width: '100%', maxHeight: 400, objectFit: 'cover' }} />
          </div>

          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900 }}>{product.name}</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>{product.description}</p>
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)' }}>{product.price} ر.س</div>

            {product.product_type === 'digital' && product.token_cost && (
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--accent)', marginBottom: 24 }}>
                <Coins /> {product.token_cost} توكن
              </div>
            )}

            {product.product_type === 'digital' ? (
              <button onClick={() => setSerialModal(true)} className="btn btn-primary btn-block btn-lg"><Coins /> استخدام التوكن</button>
            ) : (
              <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input className="field-input" placeholder="الاسم الكامل" value={form.full_name} onChange={e => setForm({ ...form, full_name: e.target.value })} required />
                <input className="field-input" placeholder="رقم الهاتف" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
                <input className="field-input" placeholder="العنوان" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required />
                <input className="field-input" type="number" min="1" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })} />
                <textarea className="field-input" placeholder="ملاحظات" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} />
                {orderError && <div style={{ color: '#ef4444' }}>{orderError}</div>}
                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
                  {submitting ? <Loader2 className="spin" /> : <ShoppingCart />} تأكيد الطلب
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Modal isOpen={serialModal} onClose={() => setSerialModal(false)} title="استخدام التوكن">
        <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input className="field-input" placeholder="رقم السيريال" value={serial} onChange={e => setSerial(e.target.value)} required />
          <input className="field-input" type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} required />
          <button type="submit" className="btn btn-primary btn-block" disabled={downloading}>
            {downloading ? <Loader2 className="spin" /> : <Coins />} خصم التوكن والتحميل
          </button>
        </form>
      </Modal>
    </div>
  );
}
