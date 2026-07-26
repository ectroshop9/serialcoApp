import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import { ShoppingCart, ArrowRight, CheckCircle, AlertCircle, Loader2, Coins } from 'lucide-react';

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

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [serial, setSerial] = useState('');
  const [pin, setPin] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/firmware/${id}/?serial_number=test&pin=0000`)
      .then(res => res.json())
      .then(data => {
        if (data.firmware) {
          setProduct({
            id: data.firmware.id || Number(id),
            name: data.firmware.model || 'منتج',
            price: `${data.firmware.token_cost || 0} توكن`,
            product_type: 'digital',
            image: null,
            token_cost: data.firmware.token_cost,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serial || !pin) return;
    setDownloading(true);
    try {
      const res = await fetch(`${API}/api/firmware/${id}/?serial_number=${serial}&pin=${pin}`);
      const data = await res.json();
      if (data.success) {
        window.open(data.download_url, '_blank');
        setMsg('تم التحميل!');
      } else {
        setMsg(data.message || 'فشل');
      }
    } catch { setMsg('خطأ'); }
    setDownloading(false);
    setTimeout(() => setMsg(''), 3000);
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}><Loader2 className="spin" /></div>;
  if (!product) return <div className="card" style={{ textAlign: 'center', padding: 60 }}><AlertCircle /><button onClick={() => navigate('/store')} className="btn btn-primary">العودة</button></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm"><ArrowRight /> رجوع</button>

      <div className="card" style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>{product.name}</h1>
        {product.token_cost && <div style={{ color: 'var(--accent)', fontSize: 18, marginBottom: 20 }}><Coins /> {product.token_cost} توكن</div>}

        {msg && <div style={{ padding: 12, borderRadius: 8, background: msg.includes('تم') ? '#10b981' : '#ef4444', color: '#fff', textAlign: 'center', marginBottom: 16 }}>{msg}</div>}

        <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input className="field-input" placeholder="رقم السيريال" value={serial} onChange={e => setSerial(e.target.value)} required disabled={downloading} />
          <input className="field-input" type="password" placeholder="PIN" value={pin} onChange={e => setPin(e.target.value)} required disabled={downloading} />
          <button type="submit" className="btn btn-primary btn-block" disabled={downloading}>
            {downloading ? <Loader2 className="spin" /> : <Coins />} خصم التوكن والتحميل
          </button>
        </form>
      </div>
    </div>
  );
}
