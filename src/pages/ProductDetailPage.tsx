import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, Loader2, Coins, CheckCircle } from 'lucide-react';

const API = 'https://serialcotv.onrender.com';

interface Product {
  id: number;
  name: string;
  price: string;
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
  const [msgType, setMsgType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    setLoading(true);
    fetch(`${API}/api/content/firmware/${id}/`)
      .then(res => res.json())
      .then(data => {
        if (data.firmware) {
          setProduct({
            id: data.firmware.id || Number(id),
            name: data.firmware.model || data.firmware.model_number || 'منتج',
            price: `${data.firmware.token_cost || 0} توكن`,
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
    setMsg('');
    
    try {
      // الرابط الصحيح - GET مع serial_number و pin
      const res = await fetch(
        `${API}/api/content/firmware/${id}/?serial_number=${serial}&pin=${pin}`
      );
      const data = await res.json();
      
      if (data.success) {
        setMsgType('success');
        setMsg(`✅ تم خصم التوكن! المتبقي: ${data.tokens_remaining} توكن`);
        
        // فتح رابط التحميل
        if (data.download_url) {
          const fullUrl = `${API}${data.download_url}`;
          window.open(fullUrl, '_blank');
        }
      } else {
        setMsgType('error');
        setMsg(data.message || 'فشل التحميل');
      }
    } catch (err) {
      setMsgType('error');
      setMsg('خطأ في الاتصال');
    }
    
    setDownloading(false);
    setTimeout(() => setMsg(''), 4000);
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <Loader2 className="spin" />
    </div>
  );
  
  if (!product) return (
    <div className="card" style={{ textAlign: 'center', padding: 60 }}>
      <AlertCircle />
      <p>المنتج غير موجود</p>
      <button onClick={() => navigate('/store')} className="btn btn-primary">العودة</button>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">
        <ArrowRight /> رجوع
      </button>

      <div className="card" style={{ padding: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900 }}>{product.name}</h1>
        {product.token_cost && (
          <div style={{ color: 'var(--accent)', fontSize: 18, marginBottom: 20 }}>
            <Coins /> {product.token_cost} توكن
          </div>
        )}

        {msg && (
          <div style={{ 
            padding: 12, 
            borderRadius: 8, 
            background: msgType === 'success' ? '#10b981' : '#ef4444', 
            color: '#fff', 
            textAlign: 'center', 
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8
          }}>
            {msgType === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {msg}
          </div>
        )}

        <form onSubmit={handleDownload} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input 
            className="field-input" 
            placeholder="رقم السيريال" 
            value={serial} 
            onChange={e => setSerial(e.target.value)} 
            required 
            disabled={downloading} 
          />
          <input 
            className="field-input" 
            type="password" 
            placeholder="PIN (4 أرقام)" 
            value={pin} 
            onChange={e => setPin(e.target.value)} 
            required 
            disabled={downloading}
            maxLength={4}
          />
          <button type="submit" className="btn btn-primary btn-block" disabled={downloading}>
            {downloading ? <Loader2 className="spin" /> : <Coins />} خصم التوكن والتحميل
          </button>
        </form>
      </div>
    </div>
  );
}