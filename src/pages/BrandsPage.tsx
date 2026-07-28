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
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch(`${API}/api/content/brands/`)
      .then(res => res.json())
      .then(data => { 
        setBrands(data.brands || []); 
        setLoading(false); 
      })
      .catch(() => setLoading(false));
  }, []);

  const getImageUrl = (path: string) => {
    if (!path) return '';
    let fullUrl = path;

    if (!path.startsWith('http') && (path.includes('image/upload') || path.includes('media/') || path.includes('cloudinary'))) {
      const cleanPath = path.startsWith('/') ? path.slice(1) : path;
      fullUrl = `${CLOUDINARY_BASE_URL}${cleanPath}`;
    } else if (!path.startsWith('http')) {
      const cleanPath = path.startsWith('/') ? path : `/${path}`;
      fullUrl = `${API}${cleanPath}`;
    }

    if (!/\.(jpg|jpeg|png|webp|svg|gif)$/i.test(fullUrl)) {
      fullUrl += '.png';
    }

    return fullUrl;
  };

  const filteredBrands = brands.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}>جاري التحميل...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      
      {/* صف الهيدر: يحتوي على العنوان يميناً وحقل البحث يساراً */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: 16 
      }}>
        <h1 className="page-title" style={{ margin: 0 }}>اختر الماركة</h1>

        {/* حقل البحث بالجهة اليسرى */}
        <input
          type="text"
          placeholder="ابحث عن ماركة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px 16px',
            fontSize: '15px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'transparent',
            color: 'inherit',
            outline: 'none',
            width: '100%',
            maxWidth: '280px' // حجم مناسب ليكون بجانب العنوان
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
        {filteredBrands.length > 0 ? (
          filteredBrands.map(b => (
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
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div style={{ fontSize: 24, fontWeight: 900 }}>{b.name}</div>
              )}
              <div style={{ marginTop: 8, fontWeight: 700 }}>{b.name}</div>
            </button>
          ))
        ) : (
          <div style={{ padding: 20, opacity: 0.7 }}>لا توجد ماركة بهذا الاسم</div>
        )}
      </div>
    </div>
  );
}
