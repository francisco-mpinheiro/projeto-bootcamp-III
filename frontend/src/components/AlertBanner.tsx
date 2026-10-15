import React from 'react';
import { AlertTriangle, PlusCircle } from 'lucide-react';
import type { Product } from '../types';

interface AlertBannerProps {
  alertProducts: Product[];
  onQuickRestock: (product: Product) => void;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({ alertProducts, onQuickRestock }) => {
  if (!alertProducts || alertProducts.length === 0) {
    return null;
  }

  const criticalCount = alertProducts.filter((p) => p.status === 'CRITICAL').length;

  return (
    <div
      className="glass-panel"
      style={{
        padding: '16px 20px',
        marginBottom: '24px',
        background: 'linear-gradient(90deg, rgba(244, 63, 94, 0.12) 0%, rgba(245, 158, 11, 0.12) 100%)',
        border: '1px solid rgba(244, 63, 94, 0.3)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#f43f5e',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 12px rgba(244, 63, 94, 0.5)',
          }}>
            <AlertTriangle size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#fda4af' }}>
              Alerta de Ponto de Reposição ({alertProducts.length} itens necessitam de atenção)
            </h2>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {criticalCount > 0 ? (
                <span>
                  <strong style={{ color: '#ff6b81' }}>{criticalCount} item(s) com estoque zerado</strong>. Realize o pedido aos fornecedores para não perder vendas.
                </span>
              ) : (
                'Itens atingiram a quantidade mínima de segurança cadastrada.'
              )}
            </p>
          </div>
        </div>

        {/* Horizontal scroll of quick replenishment buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', maxWidth: '100%', padding: '4px 0' }}>
          {alertProducts.slice(0, 4).map((p) => (
            <button
              key={p.id}
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => onQuickRestock(p)}
              style={{
                fontSize: '0.75rem',
                border: p.status === 'CRITICAL' ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(245, 158, 11, 0.4)',
                background: 'rgba(15, 23, 42, 0.8)',
              }}
            >
              <PlusCircle size={14} color={p.status === 'CRITICAL' ? '#f43f5e' : '#f59e0b'} />
              <span>{p.name} ({p.currentStock}/{p.minStock} {p.unit})</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
