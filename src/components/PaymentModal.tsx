import { Sparkles, Shield, Zap } from 'lucide-react';

interface Props {
  selectedPlan: string;
  setShowPayment: (val: boolean) => void;
}

export default function PaymentModal({ selectedPlan, setShowPayment }: Props) {
  const planConfig: Record<string, { amount: string; icon: typeof Sparkles; color: string; bg: string }> = {
    'ذهبية': { amount: '3000', icon: Sparkles, color: 'var(--accent)', bg: 'rgba(245,158,11,0.1)' },
    'فضية': { amount: '1500', icon: Shield, color: 'var(--primary)', bg: 'rgba(99,102,241,0.1)' },
  };

  const plan = planConfig[selectedPlan] || { amount: '1500', icon: Zap, color: 'var(--primary)', bg: 'rgba(99,102,241,0.1)' };
  const PlanIcon = plan.icon;

  const paymentLinks: Record<string, string> = {
    'ذهبية': 'http://pay.chargily.net/test/payment-links/01ky0cqe8ktcksrs2w6xzq13j6',
    'فضية': 'http://pay.chargily.net/test/payment-links/01ky0cqe8ktcksrs2w6xzq13j6',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Plan Info */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        padding: 16, borderRadius: 14,
        background: plan.bg,
        border: `1.5px solid ${plan.color}30`,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: plan.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <PlanIcon size={24} style={{ color: '#fff' }} />
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800 }}>الباقة {selectedPlan}</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: plan.color }}>{plan.amount} د.ج</div>
        </div>
      </div>

      {/* Payment Methods */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <a
          href={paymentLinks[selectedPlan]}
          target="_blank"
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 18px', borderRadius: 14,
            background: 'var(--accent)',
            color: '#fff', textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
            fontWeight: 700, fontSize: 14,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(245,158,11,0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          {/* بطاقة ذهبية SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <rect x="2" y="4" width="20" height="16" rx="3" fill="#fff" stroke="#fff" strokeWidth="1"/>
            <rect x="2" y="4" width="20" height="16" rx="3" fill="url(#gold)"/>
            <line x1="2" y1="10" x2="22" y2="10" stroke="#fff" strokeWidth="0.5" opacity="0.5"/>
            <line x1="6" y1="15" x2="12" y2="15" stroke="#fff" strokeWidth="1.5" opacity="0.8"/>
            <defs>
              <linearGradient id="gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#FFD700"/>
                <stop offset="100%" stopColor="#FFA500"/>
              </linearGradient>
            </defs>
          </svg>
          <div>
            <div>الدفع بالبطاقة الذهبية / CIB</div>
            <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 400 }}>تحويل آمن وسريع عبر Chargily</div>
          </div>
        </a>

        <a
          href={`https://wa.me/213500000000?text=مرحباً، أريد الاشتراك في الباقة ${selectedPlan} والدفع عبر بريدي موب`}
          target="_blank"
          style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 18px', borderRadius: 14,
            background: '#25D366',
            color: '#fff', textDecoration: 'none',
            transition: 'transform 0.2s, box-shadow 0.2s',
            fontWeight: 700, fontSize: 14,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(37,211,102,0.3)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          {/* أيقونة WhatsApp SVG */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.768.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.075-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-1.536.925-2.757 2.236-3.514 3.771-.757 1.536-.849 3.186-.278 4.768.571 1.583 1.707 2.978 3.184 3.957 1.477.978 3.236 1.517 5.04 1.517 1.804 0 3.563-.539 5.04-1.517 1.477-.979 2.613-2.374 3.184-3.957.571-1.582.479-3.232-.278-4.768-.757-1.535-1.978-2.846-3.514-3.771a9.87 9.87 0 00-5.031-1.378zm0-2.382c2.15 0 4.232.707 5.973 2.025 1.741 1.318 3.056 3.165 3.682 5.348.626 2.183.507 4.532-.334 6.625-.841 2.092-2.354 3.805-4.27 4.882-1.917 1.077-4.158 1.629-6.458 1.629s-4.541-.552-6.458-1.629c-1.916-1.077-3.429-2.79-4.27-4.882-.841-2.093-.96-4.442-.334-6.625.626-2.183 1.941-4.03 3.682-5.348 1.741-1.318 3.823-2.025 5.973-2.025z"/>
          </svg>
          <div>
            <div>الدفع عبر بريدي موب (CCP)</div>
            <div style={{ fontSize: 11, opacity: 0.8, fontWeight: 400 }}>تواصل معنا عبر WhatsApp للتأكيد</div>
          </div>
        </a>
      </div>
    </div>
  );
}
