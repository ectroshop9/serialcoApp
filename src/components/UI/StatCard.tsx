import { type ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subtitle?: string;
  gradient: string;
  delay?: number;
}

export default function StatCard({ icon, label, value, subtitle, gradient, delay = 0 }: StatCardProps) {
  return (
    <div
      className="card anim-fade-up"
      style={{
        padding: 20,
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        animationDelay: `${delay}ms`,
      }}
    >
      <div className="row-between" style={{ alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>
            {label}
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: 4 }}>
            {value}
          </div>
          {subtitle && (
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              {subtitle}
            </div>
          )}
        </div>
        <div className="icon-box icon-box-lg" style={{ background: gradient }}>
          {icon}
        </div>
      </div>
      {/* Bottom accent line */}
      <div style={{
        position: 'absolute', bottom: 0, right: 0, left: 0,
        height: 3, background: gradient, opacity: 0.5,
      }} />
    </div>
  );
}
