import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'https://serialcotv.onrender.com';
const CLOUDINARY_BASE_URL = 'https://res.cloudinary.com/rsmjekym/';

interface Brand {
  id: number;
  name: string;
  logo: string | null;
}

export default function BrandsPage() {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/content/brands/`)
      .then(res => res.json())
      .then(data => { 
        setBrands(data.brands || []); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  // دالة لتجهيز رابط الصورة وتفادي أخطاء CORB والمسارات الناقصة
  const getImageUrl = (path: string) => {
    if (!path) return '';

    let fullUrl = path;

    // 1. إذا كان المسار يتبع لـ Cloudinary أو يحتوي على مسار الميديا لكن بدون النطاق الرئيسي
    if (!path.startsWith('http') && (path.includes('image/upload') || path.includes('media/') || path.includes('cloudinary'))) {
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      fullUrl = `${CLOUDINARY_BASE_URL}${cleanPath}`;
    } 
    // 2. إذا كان مساراً نسبياً عادياً على سيرفر الـ API
    else if (!path.startsWith('http')) {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      fullUrl = `${API}${cleanPath}`;
    }

    // 3. إضافة امتداد .png تلقائياً إذا كان الرابط لا ينتهي بامتداد صورة معرّف
    if (!/\.(jpg|jpeg|png|webp|svg|gif)$/i.test(fullUrl)) {
      fullUrl += '.png';
    }

    return fullUrl;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}>جاري التحميل...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 className="page-title">اختر الماركة</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
        {brands.map(b => (
          <button 
            key={b.id} 
            onClick={() => navigate(`/files/firmware?brand=${b.name}`)}
            className="card" 
            style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }}
          >
            {b.logo ? (
              <img 
                src={getImageUrl(b.logo)} 
                alt={b.name} 
                style={{ width: 80, height: 80, objectFit: 'contain' }} 
                onError={(e) => {
                  // إخفاء الصورة المكسورة فوراً في حال فشل تحميلها
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div style={{ fontSize: 24, fontWeight: 900 }}>{b.name}</div>
            )}
            <div style={{ marginTop: 8, fontWeight: 700 }}>{b.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
