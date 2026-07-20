import { useState, useEffect, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from '../components/UI/Modal';
import { Search, Download, ShoppingCart, Tv } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  product_type: 'physical' | 'digital';
  image: string | null;
  description?: string;
}

const API_BASE_URL = 'https://serialcotv.onrender.com/api/store';
const PLACEHOLDER_IMAGE = '/placeholder.jpg';

export default function PublicProductsPage() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  
  // حالات النافذة المنبثقة (Modal)
  const [isSerialModalOpen, setIsSerialModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [serialCode, setSerialCode] = useState<string>('');
  const [pinCode, setPinCode] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const params = new URLSearchParams();
    if (selectedType) {
      params.append('type', selectedType);
    }

    fetch(`${API_BASE_URL}/products/?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setProducts(data.products || []);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Error fetching products:', error);
        if (isMounted) {
          setProducts([]);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [selectedType]);

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleProductAction = (product: Product) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

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

    alert(`جاري بدء تحميل: ${selectedProduct?.name || 'المنتج'}`);
    handleCloseModal();
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* الشريط العلوي */}
      <header
        style={{
          background: 'var(--grad-primary)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Tv style={{ width: 28, height: 28 }} />
          <span style={{ fontSize: 20, fontWeight: 900 }}>SerialCo TV</span>
        </div>
        <Link
          to="/login"
          style={{
            color: '#ffffff',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          دخول / تسجيل
        </Link>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
        {/* شريط البحث */}
        <div style={{ marginBottom: 24 }}>
          <div className="field">
            <span className="field-icon">
              <Search style={{ width: 18, height: 18 }} />
            </span>
            <input
              className="field-input"
              placeholder="ابحث عن منتج..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* أزرار التصفية حسب النوع */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {[
            { value: '', label: 'الكل' },
            { value: 'physical', label: 'منتجات مادية' },
            { value: 'digital', label: 'منتجات رقمية' },
          ].map(typeFilter => (
            <button
              key={typeFilter.value}
              type="button"
              onClick={() => setSelectedType(typeFilter.value)}
              className={selectedType === typeFilter.value ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
            >
              {typeFilter.label}
            </button>
          ))}
        </div>

        {/* قائمة المنتجات */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            جاري التحميل...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            لا توجد منتجات مطابقة للبحث
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 16,
            }}
          >
            {filteredProducts.map(product => (
              <div key={product.id} className="card" style={{ padding: 20, display: 'flex', flexDirection: 'column' }}>
                <img
                  src={product.image || PLACEHOLDER_IMAGE}
                  alt={product.name}
                  onError={e => {
                    (e.currentTarget as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                  }}
                  style={{
                    width: '100%',
                    height: 180,
                    objectFit: 'cover',
                    borderRadius: 12,
                    marginBottom: 16,
                  }}
                />
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4, flex: 1 }}>
                  {product.name}
                </div>
                <div style={{ fontSize: 18, fontWeight: 900, color: 'var(--primary)', marginBottom: 12 }}>
                  {product.price} ر.س
                </div>
                <button
                  type="button"
                  onClick={() => handleProductAction(product)}
                  className="btn btn-primary btn-block"
                >
                  {product.product_type === 'digital' ? (
                    <>
                      <Download style={{ width: 18, height: 18 }} /> تحميل
                    </>
                  ) : (
                    <>
                      <ShoppingCart style={{ width: 18, height: 18 }} /> اطلب الآن
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* نافذة إدخال السيريال للتحميل */}
      <Modal isOpen={isSerialModalOpen} onClose={handleCloseModal} title="التحميل يتطلب سيريال">
        <form onSubmit={handleDownloadConfirm} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            className="field-input"
            placeholder="رقم السيريال"
            value={serialCode}
            onChange={e => setSerialCode(e.target.value)}
            required
          />
          <input
            className="field-input"
            type="password"
            placeholder="PIN"
            value={pinCode}
            onChange={e => setPinCode(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary btn-block">
            <Download style={{ width: 18, height: 18 }} /> تأكيد التحميل
          </button>
        </form>
      </Modal>
    </div>
  );
}