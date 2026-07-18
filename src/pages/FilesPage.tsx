import { useNavigate } from 'react-router-dom';
import { Cpu, FileText } from 'lucide-react';

export default function FilesPage() {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div className="anim-fade-up">
        <h1 className="page-title">الملفات المخزنة</h1>
        <p className="page-desc">اختر نوع الملف الذي تبحث عنه</p>
      </div>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
        <button onClick={() => navigate('/files/firmware')} className="card" style={{ padding: 40, textAlign: 'center', cursor: 'pointer' }}>
          <div className="icon-box icon-box-lg" style={{ background: 'var(--grad-primary)', margin: '0 auto 20px', width: 80, height: 80, borderRadius: 24 }}>
            <Cpu style={{ width: 40, height: 40 }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>السوفتويرات</div>
          <div style={{ color: 'var(--text-muted)' }}>Firmware لجميع الماركات والموديلات</div>
        </button>

        <button onClick={() => navigate('/files/schematics')} className="card" style={{ padding: 40, textAlign: 'center', cursor: 'pointer' }}>
          <div className="icon-box icon-box-lg" style={{ background: 'var(--grad-success)', margin: '0 auto 20px', width: 80, height: 80, borderRadius: 24 }}>
            <FileText style={{ width: 40, height: 40 }} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>المخططات</div>
          <div style={{ color: 'var(--text-muted)' }}>Schematics باور سبلاي، مين بورد، تي-كون</div>
        </button>
      </div>
    </div>
  );
}
