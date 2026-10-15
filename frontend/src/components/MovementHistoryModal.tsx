import React, { useState, useEffect } from 'react';
import { X, History, ArrowDownLeft, ArrowUpRight, RefreshCw } from 'lucide-react';
import type { Movement } from '../types';
import { api } from '../services/api';

interface MovementHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MovementHistoryModal: React.FC<MovementHistoryModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadMovements = async () => {
    try {
      setIsLoading(true);
      const data = await api.getMovements({ limit: 40 });
      setMovements(data);
    } catch (err) {
      console.error('Falha ao carregar histórico:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadMovements();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const formatDate = (isoString: string) => {
    const d = new Date(isoString);
    return d.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '640px' }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'rgba(99, 102, 241, 0.15)',
              padding: '8px',
              borderRadius: '10px',
              color: 'var(--primary)',
            }}>
              <History size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
                Histórico de Movimentações
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Auditoria de entradas e saídas recentes
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={loadMovements}
              title="Atualizar histórico"
            >
              <RefreshCw size={14} className={isLoading ? 'spin' : ''} />
            </button>
            <button
              type="button"
              onClick={onClose}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-subtle)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {isLoading ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Carregando histórico...
          </div>
        ) : movements.length === 0 ? (
          <div style={{ padding: '40px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Nenhuma movimentação registrada ainda.
          </div>
        ) : (
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
              <thead>
                <tr style={{
                  borderBottom: '1px solid var(--border-medium)',
                  color: 'var(--text-subtle)',
                  textAlign: 'left',
                }}>
                  <th style={{ padding: '10px 8px' }}>Data/Hora</th>
                  <th style={{ padding: '10px 8px' }}>Produto</th>
                  <th style={{ padding: '10px 8px' }}>Tipo</th>
                  <th style={{ padding: '10px 8px', textAlign: 'right' }}>Qtd</th>
                  <th style={{ padding: '10px 8px' }}>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((m) => {
                  const isExit = m.type === 'EXIT';
                  return (
                    <tr key={m.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 8px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                        {formatDate(m.createdAt)}
                      </td>
                      <td style={{ padding: '10px 8px', fontWeight: 600 }}>
                        {m.product ? m.product.name : `Produto #${m.productId}`}
                      </td>
                      <td style={{ padding: '10px 8px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.6875rem',
                          fontWeight: 700,
                          background: isExit ? 'var(--danger-bg)' : 'var(--success-bg)',
                          color: isExit ? '#fb7185' : '#34d399',
                        }}>
                          {isExit ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
                          {isExit ? 'SAÍDA' : 'ENTRADA'}
                        </span>
                      </td>
                      <td style={{
                        padding: '10px 8px',
                        textAlign: 'right',
                        fontWeight: 700,
                        fontFamily: "'JetBrains Mono', monospace",
                        color: isExit ? '#fb7185' : '#34d399',
                      }}>
                        {isExit ? `-${m.quantity}` : `+${m.quantity}`} {m.product?.unit || 'un'}
                      </td>
                      <td style={{ padding: '10px 8px', color: 'var(--text-muted)' }}>
                        {m.reason || '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
