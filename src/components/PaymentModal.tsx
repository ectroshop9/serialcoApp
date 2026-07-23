import { Sparkles, Shield, Zap, X } from 'lucide-react';

interface Props {
  selectedPlan: string;
  onClose: () => void;
}

export default function PaymentModal({ selectedPlan, onClose }: Props) {
  const planConfig: Record<string, { amount: string; icon: typeof Sparkles; color: string; bg: string }> = {
    'ذهبية': { amount: '3000', icon: Sparkles, color: 'var(--accent, #f59e0b)', bg: 'rgba(245,158,11,0.1)' },
    'فضية': { amount: '1500', icon: Shield, color: 'var(--primary, #6366f1)', bg: 'rgba(99,102,241,0.1)' },
  };

  const plan = planConfig[selectedPlan] || { amount: '1500', icon: Zap, color: 'var(--primary, #6366f1)', bg: 'rgba(99,102,241,0.1)' };
  const PlanIcon = plan.icon;

  // روابط الدفع لبيئة الاختبار (Sandbox)
  const paymentLinks: Record<string, string> = {
    'ذهبية': 'https://pay.chargily.net/test/checkouts/01ky84gbysmfmsgj5c9krbw9dv/pay',
    'فضية': 'https://pay.chargily.net/test/checkouts/01ky84br8djr0ebcnaantwnf39/pay',
  };

  return (
    <div 
      style={{
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.75)', 
        backdropFilter: 'blur(4px)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        zIndex: 9999, 
        padding: 16,
        direction: 'rtl'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          background: 'var(--bg-card, #18181b)', 
          borderRadius: 20, 
          border: '1px solid var(--border, #27272a)',
          padding: 24, 
          width: '100%', 
          maxWidth: 420, 
          position: 'relative',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)', 
          color: 'var(--text-primary, #ffffff)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* زر إغلاق المودال */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', 
            top: 16, 
            left: 16, 
            background: 'none', 
            border: 'none',
            color: 'var(--text-secondary, #a1a1aa)', 
            cursor: 'pointer', 
            padding: 4, 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, textAlign: 'center', color: 'var(--text-primary, #fff)' }}>
          اختر طريقة الدفع
        </h3>

        {/* تفاصيل الباقة */}
        <div 
          style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: 14,
            padding: 16, 
            borderRadius: 14, 
            background: plan.bg,
            border: `1.5px solid ${plan.color}30`, 
            marginBottom: 20
          }}
        >
          <div 
            style={{
              width: 48, 
              height: 48, 
              borderRadius: 14, 
              background: plan.color,
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <PlanIcon size={24} style={{ color: '#fff' }} />
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--text-primary, #fff)' }}>الباقة {selectedPlan}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: plan.color }}>{plan.amount} د.ج</div>
          </div>
        </div>

        {/* خيارا الدفع */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* الخيار 1: Chargily */}
          <a
            href={paymentLinks[selectedPlan] || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: 14, 
              padding: '16px 18px',
              borderRadius: 14, 
              background: 'var(--accent, #f59e0b)', 
              color: '#fff',
              textDecoration: 'none', 
              fontWeight: 700, 
              fontSize: 14
            }}
          >
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

          {/* الخيار 2: Messenger */}
          <a
            href="https://m.me/serialcotv"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', 
              alignItems: 'center', 
              gap: 14, 
              padding: '16px 18px',
              borderRadius: 14, 
              background: 'linear-gradient(135deg, #0084FF 0%, #00C6FF 100%)',
              color: '#fff', 
              textDecoration: 'none', 
              fontWeight: 700, 
              fontSize: 14
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#fff" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
              <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.91 1.45 5.513 3.714 7.214V22l3.355-1.843c.928.257 1.91.397 2.931.397 5.523 0 10-4.145 10-9.296C22 6.145 17.523 2 12 2zm1.193 12.48l-2.556-2.727-4.99 2.727 5.49-5.823 2.622 2.727 4.925-2.727-5.491 5.823z" />
            </svg>
            <div>
              <div>الاستمرار عبر Messenger</div>
              <div style={{ fontSize: 11, opacity: 0.9, fontWeight: 400 }}>للدفع عبر بريدي موب وتأكيد الاشتراك</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}