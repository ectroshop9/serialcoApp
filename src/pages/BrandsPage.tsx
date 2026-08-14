import { useState, useEffect, useMemo } from 'react';
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
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    fetch(`${API}/api/content/brands/`)
      .then((res) => res.json())
      .then((data) => {
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

  const filteredBrands = useMemo(() => {
    return brands.filter((b) =>
      b.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [brands, searchQuery]);

  const handleImageError = (brandId: number) => {
    setImageErrors((prev) => ({ ...prev, [brandId]: true }));
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 16px', color: 'var(--text-secondary)' }}>
        جاري التحميل...
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, padding: '16px 0' }}>
      
      {/* صف الهيدر */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <h1 className="page-title" style={{ margin: 0, fontSize: '24px', fontWeight: 800 }}>
          اختر الماركة
        </h1>

        {/* حقل البحث */}
        <input
          type="text"
          placeholder="ابحث عن ماركة..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: '10px 16px',
            fontSize: '14px',
            borderRadius: '8px',
            border: '1px solid var(--border, #000000)',
            backgroundColor: 'transparent',
            color: 'inherit',
            outline: 'none',
            width: '100%',
            maxWidth: '280px',
          }}
        />
      </div>

      {/* شبكة الماركات */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 16,
        }}
      >
        {filteredBrands.length > 0 ? (
          filteredBrands.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/files/firmware?brand=${encodeURIComponent(b.name)}`)}
              className="card"
              style={{
                padding: 20,
                textAlign: 'center',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-secondary, #fff)',
                borderRadius: '12px',
                border: '1px solid var(--border, #eee)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {b.logo && !imageErrors[b.id] ? (
                <img
                  src={getImageUrl(b.logo)}
                  alt={b.name}
                  style={{ width: 70, height: 70, objectFit: 'contain', marginBottom: 8 }}
                  onError={() => handleImageError(b.id)}
                />
              ) : (
                <div
                  style={{
                    width: 70,
                    height: 70,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 20,
                    fontWeight: 900,
                    borderRadius: '50%',
                    background: 'var(--bg-primary, #f0f0f0)',
                    marginBottom: 8,
                  }}
                >
                  {b.name.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div style={{ marginTop: 4, fontWeight: 700, fontSize: '14px' }}>{b.name}</div>
            </button>
          ))
        ) : (
          <div style={{ padding: 20, opacity: 0.7, gridColumn: '1 / -1', textAlign: 'center' }}>
            لا توجد ماركة بهذا الاسم
          </div>
        )}
      </div>
    </div>
  );
}