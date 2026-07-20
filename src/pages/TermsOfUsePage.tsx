import { FileText, ArrowRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function TermsOfUsePage() {
  const navigate = useNavigate();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!elements.length) return;

    const revealElement = (element: HTMLElement) => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealElement(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    elements.forEach((element) => {
      const alreadyInView = element.getBoundingClientRect().top < window.innerHeight * 0.9;
      if (alreadyInView) {
        revealElement(element);
      } else {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, []);

  const cardStyle = (delay: number): React.CSSProperties => ({
    padding: '20px',
    borderRadius: '12px',
    border: '1px solid var(--border)',
    opacity: 0,
    transform: 'translateY(30px)',
    transition: `all 0.5s ease ${delay}ms`,
  });

  return (
    <div style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', direction: 'rtl', minHeight: '100vh' }}>
      
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50" style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border)', padding: '10px 16px' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-lg font-black tracking-wider cursor-pointer" onClick={() => navigate('/')} style={{ color: 'var(--primary)' }}>
            SERIALCO<span style={{ color: 'var(--accent)' }}>TV</span>
          </div>
          <button onClick={() => navigate('/')} className="btn btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5">
            <ArrowRight size={14} /><span>العودة للرئيسية</span>
          </button>
        </div>
      </nav>

      {/* Header */}
      <header style={{ padding: '40px 16px 20px 16px', textAlign: 'center' }}>
        <div className="max-w-3xl mx-auto">
          <div className="icon-box icon-box-md" style={{ background: 'rgba(99,102,241,0.12)', color: 'var(--primary)', margin: '0 auto 16px auto', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={24} />
          </div>
          <h1 style={{ fontSize: 'clamp(22px, 3.5vw, 30px)', fontWeight: 900, marginBottom: '10px', color: 'var(--primary)' }}>شروط الاستخدام</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
            يرجى قراءة الشروط والأحكام التالية بعناية قبل استخدام منصة SerialcoTV والاستفادة من خدماتنا.
          </p>
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: '20px 16px 60px 16px' }}>
        <div className="max-w-3xl mx-auto" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div className="card" data-reveal style={cardStyle(0)}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary)' }}>1.</span> قبول الشروط والأحكام
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              باستخدامك لمنصة <strong>SerialcoTV</strong> أو تسجيلك لحساب فيها، فإنك توافق على الالتزام بهذه الشروط والأحكام بكافة بنودها. إذا كنت لا توافق على أي جزء من هذه الشروط، يُرجى عدم استخدام المنصة أو الاستفادة من خدماتها.
            </p>
          </div>

          <div className="card" data-reveal style={cardStyle(100)}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary)' }}>2.</span> طبيعة الخدمة
            </h3>
            <ul style={{ listStyle: 'disc', paddingRight: '20px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li><strong>SerialcoTV</strong> هي منصة رقمية متخصصة موجهة لـ <strong>فنيي صيانة الشاشات وأصحاب الورش</strong>، وتهدف إلى توفير ملفات السوفتوير (الفلاشات) والمخططات الهندسية الخاصة بأجهزة التلفزيون (LED و Plasma).</li>
              <li>جميع الملفات والمخططات المتاحة على المنصة يتم جمعها وتدقيقها واختبارها بعناية، ولكنها تُقدم على أساس مساعدتهم في أعمال الصيانة المهنية.</li>
            </ul>
          </div>

          <div className="card" data-reveal style={cardStyle(200)}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary)' }}>3.</span> الحسابات وأمن المعلومات
            </h3>
            <ul style={{ listStyle: 'disc', paddingRight: '20px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>لتتمكن من تحميل الملفات والاستفادة من الباقات، يجب عليك إنشاء حساب شخصي ببيانات صحيحة.</li>
              <li><strong>الحساب الشخصي للاستخدام الفردي فقط:</strong> يُحظر تماماً مشاركة بيانات تسجيل الدخول (اسم المستخدم وكلمة المرور) مع أي شخص آخر أو استخدام الحساب من عدة ورش مختلفة في نفس الوقت.</li>
              <li>تحتفظ الإدارة بحق إيقاف أو حظر أي حساب يثبت تورطه في مشاركة البيانات أو إساءة استخدام المنصة دون إنذار مسبق ودون تعويض.</li>
            </ul>
          </div>

          <div className="card" data-reveal style={cardStyle(300)}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary)' }}>4.</span> الاشتراكات والباقات المالية
            </h3>
            <ul style={{ listStyle: 'disc', paddingRight: '20px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>توفر المنصة باقات اشتراك متنوعة بأسعار محددة بالدينار الجزائري (د.ج).</li>
              <li>عدد التحميلات والمميزات مرتبطة بنوع الباقة المختارة وفترة صلاحيتها.</li>
              <li>المدفوعات والرسوم المدفوعة مقابل الباقات غير قابلة للاسترداد بعد تفعيل الحساب أو استهلاك جزء من رصيد التحميلات، إلا في حالات تقنية استثنائية تقررها الإدارة.</li>
            </ul>
          </div>

          <div className="card" data-reveal style={cardStyle(400)}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary)' }}>5.</span> حقوق الملكية الفكرية والاستخدام العادل
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '8px' }}>
              كافة الملفات، المخططات، التصاميم، والمحتويات المنشورة على منصة <strong>SerialcoTV</strong> محمية بموجب حقوق الملكية الفكرية. يُمنع منعاً باتاً:
            </p>
            <ul style={{ listStyle: 'disc', paddingRight: '20px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <li>إعادة بيع الملفات أو المخططات التي يتم تحميلها من المنصة.</li>
              <li>نشر الملفات الحصرية في مواقع أو مجموعات عامة أخرى بغرض القرصنة أو التوزيع المجاني.</li>
              <li>استخراج محتوى المنصة بطرق آليّة (Scraping).</li>
            </ul>
          </div>

          <div className="card" data-reveal style={cardStyle(500)}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary)' }}>6.</span> إخلاء المسؤولية وحدود المسؤولية
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              بالرغم من أننا نحرص على اختبار جميع ملفات السوفتوير والمخططات لضمان دقتها، إلا أن عملية الشحن (Flashing) أو التدخل التقني في اللوحات الإلكترونية (MainBoards) تحمل بطبيعتها مخاطر مرتبطة بحالة الأجهزة التالفة أصلاً. لا تتحمل منصة <strong>SerialcoTV</strong> أو فريق إدارتها أي مسؤولية قانونية أو مادية عن أي تلف في الأجهزة أو القطع الإلكترونية الناتجة عن سوء الاستخدام أو الخطأ في اختيار الملف أو إجراءات البرمجة الخاطئة من طرف الفني.
            </p>
          </div>

          <div className="card" data-reveal style={cardStyle(600)}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary)' }}>7.</span> التعديلات على الشروط
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              يحق لإدارة <strong>SerialcoTV</strong> تعديل أو تغيير هذه الشروط في أي وقت، وستدخل التعديلات حيز التنفيذ فور نشرها على الموقع. يُنصح بمراجعة هذه الصفحة دورياً للاطلاع على أي مستجدات.
            </p>
          </div>

          <div className="card" data-reveal style={{ ...cardStyle(700), background: 'var(--bg-secondary)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 'bold', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: 'var(--primary)' }}>8.</span> اتصل بنا
            </h3>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              إذا كانت لديك أي استفسارات أو واجهتك مشكلة تقنية تتعلق بشروط الاستخدام، يمكنك التواصل معنا عبر قنوات الدعم الفني المتاحة داخل المنصة أو عبر وسائل الاتصال الرسمية الخاصة بنا.
            </p>
          </div>

        </div>
      </main>

      {/* Footer موحد */}
      <footer className="reveal" data-reveal style={{ background: 'var(--bg-sidebar)', color: 'var(--text-sidebar)', borderTop: '1px solid var(--border)', padding: '32px 16px 16px 16px' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-base font-black text-white tracking-wider" style={{ marginBottom: '8px' }}>SERIALCO<span style={{ color: 'var(--accent)' }}>TV</span></div>
            <p style={{ fontSize: '11px', lineHeight: 1.5, opacity: 0.8 }}>المنصة الأولى لدعم فنيي الشاشات بملفات السوفتوير والمخططات المضمونة في الجزائر.</p>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>روابط سريعة</h4>
            <ul style={{ listStyle: 'none', padding: 0, fontSize: '11px' }}>
              <li style={{ marginBottom: '4px' }}><Link to="/contact" className="hover:text-white transition" style={{ color: 'inherit', textDecoration: 'none' }}>اتصل بنا</Link></li>
              <li style={{ marginBottom: '4px' }}><Link to="/privacy" className="hover:text-white transition" style={{ color: 'inherit', textDecoration: 'none' }}>سياسة الاستخدام</Link></li>
              <li style={{ marginBottom: '4px' }}><Link to="/terms" className="hover:text-white transition" style={{ color: 'inherit', textDecoration: 'none' }}>شروط الاستخدام</Link></li>
              <li style={{ marginBottom: '4px' }}><Link to="/faq" className="hover:text-white transition" style={{ color: 'inherit', textDecoration: 'none' }}>الأسئلة الشائعة</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#fff', fontWeight: 'bold', marginBottom: '8px', fontSize: '12px' }}>تابعنا</h4>
            <div style={{ display: 'flex', gap: '8px' }}>
              <a href="#" style={{ background: '#1877F2', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#fff', textDecoration: 'none' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#" style={{ background: '#0088cc', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#fff', textDecoration: 'none' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.46-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.145.118.185.276.204.408.019.132.043.43.024.662z"/></svg>
              </a>
              <a href="#" style={{ background: '#FF0000', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', color: '#fff', textDecoration: 'none' }}>
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div style={{ textAlign: 'center', marginTop: '24px', paddingTop: '12px', borderTop: '1px solid #334155', fontSize: '11px', opacity: 0.7 }}>
          <p>&copy; 2026 SerialcoTV. جميع الحقوق محفوظة.</p>
        </div>
      </footer>

    </div>
  );
}