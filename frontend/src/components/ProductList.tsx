import React, { useState, useMemo } from 'react';
import { Search, Plus, ArrowLeftRight, Edit2, Trash2, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';
import type { Product, StockStatus } from '../types';

interface ProductListProps {
  products: Product[];
  isLoading: boolean;
  onMovement: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number) => void;
  onNewProduct: () => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({
  products,
  isLoading,
  onMovement,
  onEdit,
  onDelete,
  onNewProduct,
  statusFilter,
  onStatusFilterChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Extract distinct categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set).sort();
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory = !categoryFilter || p.category.toLowerCase() === categoryFilter.toLowerCase();
      const matchStatus = !statusFilter || p.status === statusFilter;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [products, searchTerm, categoryFilter, statusFilter]);

  const renderStatusBadge = (status: StockStatus) => {
    switch (status) {
      case 'CRITICAL':
        return (
          <span className="badge badge-critical" title="Estoque zerado!">
            <AlertOctagon size={12} /> Zerado
          </span>
        );
      case 'LOW':
        return (
          <span className="badge badge-low" title="Abaixo do ponto de reposição">
            <AlertTriangle size={12} /> Repor
          </span>
        );
      case 'NORMAL':
        return (
          <span className="badge badge-normal" title="Estoque seguro">
            <CheckCircle2 size={12} /> Normal
          </span>
        );
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      {/* Top Filter Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px',
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '240px' }}>
          <Search
            size={18}
            color="var(--text-subtle)"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '38px' }}
            placeholder="Buscar por produto, categoria ou código de barras/SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category & Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <select
            className="form-select"
            style={{ width: 'auto', minWidth: '160px' }}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Todas as Categorias</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Quick status tabs */}
          <div style={{
            display: 'flex',
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            {[
              { label: 'Todos', value: '' },
              { label: 'Normal', value: 'NORMAL' },
              { label: 'Alerta', value: 'LOW' },
              { label: 'Zerado', value: 'CRITICAL' },
            ].map((tab) => {
              const active = statusFilter === tab.value;
              return (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => onStatusFilterChange(tab.value)}
                  style={{
                    background: active ? 'var(--primary)' : 'transparent',
                    color: active ? '#ffffff' : 'var(--text-muted)',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    padding: '6px 12px',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>Carregando estoque...</div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ padding: '60px 0', textAlign: 'center' }}>
          <div style={{ fontSize: '1rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Nenhum produto encontrado com os filtros aplicados.
          </div>
          <button type="button" className="btn btn-primary" onClick={onNewProduct}>
            <Plus size={16} /> Cadastrar Novo Produto
          </button>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{
                borderBottom: '1px solid var(--border-medium)',
                color: 'var(--text-muted)',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                <th style={{ padding: '12px 14px' }}>Produto</th>
                <th style={{ padding: '12px 14px' }}>Categoria</th>
                <th style={{ padding: '12px 14px' }}>Estoque Atual / Reposição</th>
                <th style={{ padding: '12px 14px' }}>Preço Unit.</th>
                <th style={{ padding: '12px 14px' }}>Status</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((p) => {
                // Stock progress ratio
                const maxBar = Math.max(p.minStock * 2, p.currentStock, 10);
                const percentage = Math.min(100, Math.round((p.currentStock / maxBar) * 100));

                let barColor = '#10b981';
                if (p.status === 'LOW') barColor = '#f59e0b';
                if (p.status === 'CRITICAL') barColor = '#f43f5e';

                return (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      transition: 'background 0.15s ease',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Name & SKU */}
                    <td style={{ padding: '14px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9375rem' }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', fontFamily: "'JetBrains Mono', monospace", marginTop: '2px' }}>
                        {p.sku ? `SKU: ${p.sku}` : `ID: #${p.id}`}
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: '14px' }}>
                      <span style={{
                        background: 'rgba(255, 255, 255, 0.06)',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)'
                      }}>
                        {p.category}
                      </span>
                    </td>

                    {/* Stock level + Progress Bar */}
                    <td style={{ padding: '14px', minWidth: '180px' }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{
                          fontFamily: "'JetBrains Mono', monospace",
                          fontWeight: 700,
                          fontSize: '1rem',
                          color: p.status === 'CRITICAL' ? '#f43f5e' : 'var(--text-main)',
                        }}>
                          {p.currentStock} {p.unit}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-subtle)' }}>
                          mín: {p.minStock} {p.unit}
                        </span>
                      </div>
                      <div style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}>
                        <div style={{
                          width: `${percentage}%`,
                          height: '100%',
                          background: barColor,
                          borderRadius: '3px',
                          transition: 'width 0.3s ease',
                        }} />
                      </div>
                    </td>

                    {/* Price */}
                    <td style={{ padding: '14px', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.875rem' }}>
                      {p.price !== undefined && p.price !== null
                        ? `R$ ${Number(p.price).toFixed(2).replace('.', ',')}`
                        : '—'}
                    </td>

                    {/* Status Badge */}
                    <td style={{ padding: '14px' }}>
                      {renderStatusBadge(p.status)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onMovement(p)}
                          title="Registrar entrada ou saída rápida"
                          style={{ borderColor: 'rgba(99, 102, 241, 0.4)' }}
                        >
                          <ArrowLeftRight size={14} color="var(--primary)" />
                          <span>Movimentar</span>
                        </button>

                        <button
                          type="button"
                          className="btn btn-secondary btn-sm"
                          onClick={() => onEdit(p)}
                          title="Editar cadastro do produto"
                          style={{ padding: '6px' }}
                        >
                          <Edit2 size={14} color="var(--text-muted)" />
                        </button>

                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => onDelete(p.id)}
                          title="Remover produto do estoque"
                          style={{ padding: '6px' }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
