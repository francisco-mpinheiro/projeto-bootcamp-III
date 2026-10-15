import React, { useState, useEffect } from 'react';
import { X, Package, Check } from 'lucide-react';
import type { CreateProductInput, Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateProductInput) => Promise<void>;
  editingProduct?: Product | null;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingProduct,
}) => {
  const [formData, setFormData] = useState<CreateProductInput>({
    name: '',
    category: '',
    sku: '',
    unit: 'un',
    currentStock: 0,
    minStock: 5,
    price: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: editingProduct.category,
        sku: editingProduct.sku || '',
        unit: editingProduct.unit || 'un',
        currentStock: editingProduct.currentStock,
        minStock: editingProduct.minStock,
        price: editingProduct.price || 0,
      });
    } else {
      setFormData({
        name: '',
        category: '',
        sku: '',
        unit: 'un',
        currentStock: 0,
        minStock: 5,
        price: 0,
      });
    }
    setError(null);
  }, [editingProduct, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('O nome do produto é obrigatório.');
      return;
    }
    if (!formData.category.trim()) {
      setError('A categoria é obrigatória.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await onSave(formData);
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao salvar o produto.');
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
              background: 'rgba(99, 102, 241, 0.15)',
              padding: '8px',
              borderRadius: '10px',
              color: 'var(--primary)',
            }}>
              <Package size={20} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>
              {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
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
          <div className="form-group">
            <label className="form-label">Nome do Produto *</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ex: Arroz Branco Tipo 1 5kg"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Categoria *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Mercearia, Limpeza..."
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Código de Barras / SKU</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: 78910001001"
                value={formData.sku || ''}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Unidade</label>
              <select
                className="form-select"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              >
                <option value="un">un (Unidade)</option>
                <option value="kg">kg (Quilograma)</option>
                <option value="pct">pct (Pacote)</option>
                <option value="cx">cx (Caixa)</option>
                <option value="l">l (Litro)</option>
                <option value="g">g (Grama)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Estoque Atual *</label>
              <input
                type="number"
                min="0"
                className="form-input"
                value={formData.currentStock}
                onChange={(e) => setFormData({ ...formData, currentStock: Number(e.target.value) })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{ color: '#fbbf24' }}>
                Ponto de Reposição *
              </label>
              <input
                type="number"
                min="0"
                className="form-input"
                style={{ borderColor: 'rgba(245, 158, 11, 0.4)' }}
                title="Quando o estoque atingir ou ficar abaixo deste valor, um alerta será disparado"
                value={formData.minStock}
                onChange={(e) => setFormData({ ...formData, minStock: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Preço Unitário (R$)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              className="form-input"
              placeholder="0.00"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            />
          </div>

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
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              <Check size={16} />
              {isSubmitting ? 'Salvando...' : editingProduct ? 'Atualizar Produto' : 'Cadastrar Produto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
