import React, { useState, useEffect } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, AlertTriangle, Check } from 'lucide-react';
import type { CreateMovementInput, MovementType, Product } from '../types';

interface MovementModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  selectedProduct?: Product | null;
  onRegister: (data: CreateMovementInput) => Promise<void>;
}

export const MovementModal: React.FC<MovementModalProps> = ({
  isOpen,
  onClose,
  products,
  selectedProduct,
  onRegister,
}) => {
  const [productId, setProductId] = useState<number>(0);
  const [type, setType] = useState<MovementType>('ENTRY');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedProduct) {
      setProductId(selectedProduct.id);
      // If product has 0 stock, default to ENTRY
      if (selectedProduct.currentStock <= 0) {
        setType('ENTRY');
      }
    } else if (products.length > 0) {
      setProductId(products[0].id);
    }
    setQuantity(1);
    setReason('');
    setError(null);
  }, [selectedProduct, products, isOpen]);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === productId);

  // Dynamic calculations
  const currentStock = currentProduct ? currentProduct.currentStock : 0;
  const minStock = currentProduct ? currentProduct.minStock : 0;
  const isExit = type === 'EXIT';
  const newStock = isExit ? currentStock - quantity : currentStock + quantity;
  const isInsufficientStock = isExit && quantity > currentStock;
  const willTriggerAlert = isExit && !isInsufficientStock && newStock <= minStock;

  const quickReasons = isExit
    ? ['Venda no Balcão', 'Descarte / Avaria', 'Ajuste de Inventário', 'Devolução']
    : ['Compra de Fornecedor', 'Devolução de Cliente', 'Ajuste de Inventário', 'Carga Inicial'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productId) {
      setError('Selecione um produto.');
      return;
    }
    if (quantity <= 0) {
      setError('A quantidade deve ser maior que zero.');
      return;
    }
    if (isInsufficientStock) {
      setError(`Saldo insuficiente! O estoque atual é de ${currentStock} unidade(s).`);
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onRegister({
        productId,
        type,
        quantity,
        reason: reason.trim() || undefined,
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao registrar a movimentação.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: isExit ? 'var(--danger-bg)' : 'var(--success-bg)',
              padding: '8px',
              borderRadius: '10px',
              color: isExit ? '#f43f5e' : '#10b981',
            }}>
              {isExit ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
              Movimentar Estoque
            </h3>
          </div>
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

        {error && (
          <div style={{
            background: 'var(--danger-bg)',
            border: '1px solid var(--danger-border)',
            color: '#fda4af',
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.8125rem',
            marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Select Product */}
          <div className="form-group">
            <label className="form-label">Produto *</label>
            <select
              className="form-select"
              value={productId}
              onChange={(e) => setProductId(Number(e.target.value))}
              required
            >
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (Atual: {p.currentStock} {p.unit} | Mín: {p.minStock})
                </option>
              ))}
            </select>
          </div>

          {/* Toggle Type (Entry vs Exit) */}
          <div className="form-group">
            <label className="form-label">Tipo de Movimentação *</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setType('ENTRY')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: type === 'ENTRY' ? '2px solid #10b981' : '1px solid var(--border-subtle)',
                  background: type === 'ENTRY' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: type === 'ENTRY' ? '#34d399' : 'var(--text-muted)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <ArrowUpRight size={18} />
                <span>Entrada (Reposição)</span>
              </button>

              <button
                type="button"
                onClick={() => setType('EXIT')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: type === 'EXIT' ? '2px solid #f43f5e' : '1px solid var(--border-subtle)',
                  background: type === 'EXIT' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                  color: type === 'EXIT' ? '#fb7185' : 'var(--text-muted)',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <ArrowDownLeft size={18} />
                <span>Saída (Venda/Baixa)</span>
              </button>
            </div>
          </div>

          {/* Quantity */}
          <div className="form-group">
            <label className="form-label">Quantidade *</label>
            <input
              type="number"
              min="1"
              className="form-input"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
              required
            />
          </div>

          {/* Dynamic Stock Calculation Preview Box */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: isInsufficientStock
              ? '1px solid var(--danger-border)'
              : willTriggerAlert
              ? '1px solid var(--warning-border)'
              : '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Estoque Atual:</span>
              <strong style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {currentStock} {currentProduct?.unit}
              </strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8125rem', marginTop: '4px' }}>
              <span style={{ color: 'var(--text-muted)' }}>Operação:</span>
              <span style={{ color: isExit ? '#f43f5e' : '#10b981', fontWeight: 600 }}>
                {isExit ? `- ${quantity}` : `+ ${quantity}`} {currentProduct?.unit}
              </span>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.9375rem',
              fontWeight: 700,
              marginTop: '8px',
              paddingTop: '8px',
              borderTop: '1px solid var(--border-subtle)',
            }}>
              <span>Novo Estoque Previsto:</span>
              <span style={{
                color: isInsufficientStock ? '#f43f5e' : willTriggerAlert ? '#f59e0b' : '#34d399',
                fontFamily: "'JetBrains Mono', monospace",
              }}>
                {newStock} {currentProduct?.unit}
              </span>
            </div>

            {isInsufficientStock && (
              <div style={{ marginTop: '8px', color: '#f43f5e', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} />
                <span>Bloqueado: Não é possível dar saída maior que o saldo em estoque!</span>
              </div>
            )}

            {willTriggerAlert && (
              <div style={{ marginTop: '8px', color: '#fbbf24', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle size={14} />
                <span>Atenção: Esta saída fará o produto atingir o ponto de reposição ({minStock} {currentProduct?.unit}).</span>
              </div>
            )}
          </div>

          {/* Reason / Observation */}
          <div className="form-group">
            <label className="form-label">Motivo / Observação</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Compra NF 1234, Venda Balcão..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            {/* Quick Suggestions Chips */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
              {quickReasons.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(r)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-sm)',
                    color: 'var(--text-muted)',
                    fontSize: '0.6875rem',
                    padding: '3px 8px',
                    cursor: 'pointer',
                  }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '10px',
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)',
          }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn ${isExit ? 'btn-danger' : 'btn-success'}`}
              disabled={isSubmitting || isInsufficientStock}
              style={{ minWidth: '150px' }}
            >
              <Check size={16} />
              {isSubmitting ? 'Registrando...' : isExit ? 'Confirmar Saída' : 'Confirmar Entrada'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
