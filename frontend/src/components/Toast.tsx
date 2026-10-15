import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertOctagon, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'alert' | 'error';
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  let borderColor = 'var(--border-subtle)';
  let bgColor = '#111827';
  let Icon = CheckCircle2;
  let iconColor = '#10b981';

  if (toast.type === 'alert') {
    borderColor = 'rgba(245, 158, 11, 0.5)';
    bgColor = 'rgba(30, 24, 15, 0.95)';
    Icon = AlertTriangle;
    iconColor = '#f59e0b';
  } else if (toast.type === 'error') {
    borderColor = 'rgba(244, 63, 94, 0.5)';
    bgColor = 'rgba(35, 15, 22, 0.95)';
    Icon = AlertOctagon;
    iconColor = '#f43f5e';
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        maxWidth: '420px',
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: 'var(--radius-lg)',
        padding: '16px',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        zIndex: 2000,
        animation: 'slideUp 0.25s ease',
      }}
    >
      <div style={{ color: iconColor, flexShrink: 0, marginTop: '2px' }}>
        <Icon size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-main)' }}>
          {toast.title}
        </h4>
        {toast.message && (
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            {toast.message}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-subtle)',
          cursor: 'pointer',
          padding: '2px',
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
};
