import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API = 'https://serialcotv.onrender.com';

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
      .then(data => { setBrands(data.brands || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: 80 }}>جاري التحميل...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 className="page-title">اختر الماركة</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 16 }}>
        {brands.map(b => (
          <button key={b.id} onClick={() => navigate(`/files/firmware?brand=${b.name}`)}
            className="card" style={{ padding: 24, textAlign: 'center', cursor: 'pointer' }}>
            {b.logo ? <img src={`${b.logo}.jpg`} alt={b.name} style={{ width: 80, height: 80, objectFit: 'contain' }} /> : <div style={{ fontSize: 24, fontWeight: 900 }}>{b.name}</div>}
            <div style={{ marginTop: 8, fontWeight: 700 }}>{b.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
