import React from 'react';
import { Package, Plus, ArrowLeftRight, History } from 'lucide-react';

interface HeaderProps {
  onOpenNewProduct: () => void;
  onOpenMovement: () => void;
  onOpenHistory: () => void;
  totalAlerts: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewProduct,
  onOpenMovement,
  onOpenHistory,
  totalAlerts,
}) => {
  return (
    <header className="glass-panel" style={{ padding: '18px 24px', marginBottom: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            padding: '12px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99, 102, 241, 0.4)'
          }}>
            <Package size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(180deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Stockly
              </h1>
              <span className="badge" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                v2.0 • Bootcamp III
              </span>
            </div>
            <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '2px' }}>
              Controle Inteligente de Estoque & Ponto de Reposição para Pequeno Varejo
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenHistory}
            title="Visualizar histórico recente de movimentações"
          >
            <History size={16} />
            <span>Histórico</span>
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onOpenMovement}
            title="Registrar entrada ou saída de mercadoria"
            style={{ position: 'relative' }}
          >
            <ArrowLeftRight size={16} />
            <span>Movimentar Estoque</span>
            {totalAlerts > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#f43f5e',
                color: '#fff',
                fontSize: '0.6875rem',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--bg-primary)'
              }}>
                {totalAlerts}
              </span>
            )}
          </button>

          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenNewProduct}
          >
            <Plus size={18} />
            <span>Novo Produto</span>
          </button>
        </div>
      </div>
    </header>
  );
};
