import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import { Download, ShoppingCart, ArrowRight, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  product_type: 'physical' | 'digital';
  image: string | null;
  description?: string;
  stock?: number;
}

// تجاوز خطأ TypeScript في بيئة العمل بدون الحاجة لإعدادات إضافية
const API_BASE_URL =
  ((import.meta as any).env?.VITE_API_URL as string) ||
  'https://serialcotv.onrender.com/api/store';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // حالة النافذة المنبثقة والسيريال للمنتجات الرقمية
  const [serialModal, setSerialModal] = useState(false);
  const [serial, setSerial] = useState('');
  const [pin, setPin] = useState('');
  const [downloading, setDownloading] = useState(false);

  // حالة نموذج الطلب للمنتجات الفيزيائية
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    notes: '',
    quantity: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // جلب بيانات المنتج عند تحميل الصفحة
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setFetchError(null);

    fetch(`${API_BASE_URL}/products/${id}/`)
      .then(async res => {
        if (!res.ok) throw new Error('فشل في جلب بيانات المنتج');
        return res.json();
      })
      .then(data => {
        if (isMounted) {
          setProduct(data.product || data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setFetchError(err.message || 'حدث خطأ أثناء تحميل المنتج');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  // إغلاق نافذة السيريال وإعادة ضبط المدخلات
  const closeSerialModal = () => {
    setSerialModal(false);
    setSerial('');
    setPin('');
  };

  // تنزيل المنتج الرقمي
  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial.trim() || !pin.trim()) return;

    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      closeSerialModal();
      alert(`جاري بدء تحميل: ${product?.name}`);
    }, 1000);
  };

  // إرسال طلب شراء للمنتج الفيزيائي
  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError(null);

    if (!form.full_name.trim() || !form.phone.trim() || !form.address.trim()) {
      setOrderError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (form.quantity < 1) {
      setOrderError('الكمية يجب أن تكون 1 على الأقل');
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/orders/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          notes: form.notes.trim(),
          items: [{ product_id: product?.id, quantity: form.quantity }],
        }),
      });

      const data = await response.json();

      if (response.ok && (data.success || data.id)) {
        setSubmitted(true);
      } else {
        setOrderError(data.message || 'فشل في إرسال الطلب، يرجى المحاولة لاحقاً');
      }
    } catch {
      setOrderError('تعذر الاتصال بالخادم، تحقق من اتصال الإنترنت');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
        <Loader2 style={{ width: 32, height: 32, margin: '0 auto 12px' }} className="spin" />
        <p>جاري تحميل بيانات المنتج...</p>
      </div>
    );
  }

  if (fetchError || !product) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '60px 20px', maxWidth: 480, margin: '40px auto' }}>
        <AlertCircle style={{ width: 48, height: 48, color: '#ef4444', margin: '0 auto 16px' }} />
        <h2 style={{ fontSize: 20, marginBottom: 8 }}>لم يتم العثور على المنتج</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 20 }}>{fetchError || 'المنتج غير موجود أو تم إزالته'}</p>
        <button type="button" onClick={() => navigate('/store')} className="btn btn-primary">
          العودة للمتجر
        </button>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="card anim-scale-in" style={{ maxWidth: 500, margin: '40px auto', padding: 40, textAlign: 'center' }}>
        <CheckCircle style={{ width: 60, height: 60, color: '#10b981', margin: '0 auto 16px' }} />
        <h2 style={{ marginBottom: 8, fontSize: 22 }}>تم استلام طلبك بنجاح!</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.6 }}>
          شكراً لك، سيتم التواصل معك عبر رقم الهاتف لتأكيد الشحن والتسليم.
        </p>
        <button type="button" onClick={() => navigate('/store')} className="btn btn-primary btn-block">
          العودة للمتجر
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <button type="button" onClick={() => navigate(-1)} className="btn btn-ghost btn-sm" style={{ alignSelf: 'flex-start' }}>
        <ArrowRight style={{ width: 18, height: 18 }} /> رجوع
      </button>

      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32, alignItems: 'start' }}>
          
          {/* صورة المنتج */}
          <div style={{ background: 'var(--bg-subtle, #f8fafc)', borderRadius: 16, overflow: 'hidden', textAlign: 'center' }}>
            <img
              src={product.image || '/placeholder.jpg'}
              alt={product.name}
              style={{ width: '100%', maxHeight: 400, objectFit: 'cover', display: 'block' }}
            />
          </div>

          {/* تفاصيل المنتج والنموذج */}
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 12, lineHeight: 1.3 }}>{product.name}</h1>
            {product.description && (
              <p style={{ color: 'var(--text-muted)', marginBottom: 20, lineHeight: 1.7, fontSize: 14 }}>
                {product.description}
              </p>
            )}
            
            <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--primary)', marginBottom: 24 }}>
              {product.price} ر.س
            </div>

            {/* رسالة الخطأ عند الطلب */}
            {orderError && (
              <div style={{ padding: '10px 14px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', borderRadius: 8, color: '#ef4444', fontSize: 13, marginBottom: 16 }}>
                {orderError}
              </div>
            )}

            {product.product_type === 'digital' ? (
              <button type="button" onClick={() => setSerialModal(true)} className="btn btn-primary btn-block btn-lg">
                <Download style={{ width: 20, height: 20 }} /> تحميل الملف
              </button>
            ) : (
              <form onSubmit={handleOrder} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>الاسم الكامل *</label>
                  <input
                    className="field-input"
                    placeholder="مثال: محمد أحمد"
                    value={form.full_name}
                    onChange={e => setForm({ ...form, full_name: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>رقم الهاتف *</label>
                  <input
                    type="tel"
                    className="field-input"
                    placeholder="05xxxxxxxx"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>العنوان التفصيلي *</label>
                  <input
                    className="field-input"
                    placeholder="المدينة، الحي، اسم الشارع"
                    value={form.address}
                    onChange={e => setForm({ ...form, address: e.target.value })}
                    required
                    disabled={submitting}
                  />
                </div>

                <div className="field">
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>الكمية</label>
                  <input
                    className="field-input"
                    type="number"
                    min="1"
                    value={form.quantity}
                    onChange={e => setForm({ ...form, quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                    disabled={submitting}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>ملاحظات إضافية</label>
                  <textarea
                    className="field-input"
                    placeholder="ملاحظات حول وقت التسليم أو أي تفاصيل أخرى..."
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                    disabled={submitting}
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 style={{ width: 20, height: 20 }} className="spin" /> جاري إرسال الطلب...
                    </>
                  ) : (
                    <>
                      <ShoppingCart style={{ width: 20, height: 20 }} /> تأكيد الطلب (الدفع عند الاستلام)
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* نافذة إدخال السيريال للمنتجات الرقمية */}
      <Modal isOpen={serialModal} onClose={closeSerialModal} title="التحميل يتطلب سيريال">
        <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>رقم السيريال *</label>
            <input
              className="field-input"
              placeholder="أدخل رقم السيريال الخاص بك"
              value={serial}
              onChange={e => setSerial(e.target.value)}
              required
              disabled={downloading}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>رمز PIN *</label>
            <input
              className="field-input"
              type="password"
              placeholder="PIN"
              value={pin}
              onChange={e => setPin(e.target.value)}
              required
              disabled={downloading}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={downloading}>
            {downloading ? (
              <>
                <Loader2 style={{ width: 18, height: 18 }} className="spin" /> جاري التحقق...
              </>
            ) : (
              <>
                <Download style={{ width: 18, height: 18 }} /> تأكيد التحميل
              </>
            )}
          </button>
        </form>
      </Modal>
    </div>
  );
}