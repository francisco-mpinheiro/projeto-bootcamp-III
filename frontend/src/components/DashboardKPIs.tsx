import React from 'react';
import { Package, Layers, AlertTriangle, AlertOctagon } from 'lucide-react';
import type { DashboardMetrics } from '../types';

interface DashboardKPIsProps {
  metrics: DashboardMetrics;
  onFilterStatus?: (status: string) => void;
  activeStatusFilter?: string;
}

export const DashboardKPIs: React.FC<DashboardKPIsProps> = ({
  metrics,
  onFilterStatus,
  activeStatusFilter,
}) => {
  const cards = [
    {
      id: 'TOTAL',
      label: 'Produtos Cadastrados',
      value: metrics.totalProducts,
      subtitle: `${metrics.totalStockUnits} itens no estoque físico`,
      icon: Package,
      color: '#6366f1',
      bgGlow: 'rgba(99, 102, 241, 0.15)',
      filterKey: '',
    },
    {
      id: 'NORMAL',
      label: 'Estoque Saudável',
      value: metrics.normalStockCount,
      subtitle: 'Acima do ponto de reposição',
      icon: Layers,
      color: '#10b981',
      bgGlow: 'rgba(16, 185, 129, 0.15)',
      filterKey: 'NORMAL',
    },
    {
      id: 'LOW',
      label: 'Ponto de Reposição Atingido',
      value: metrics.lowStockCount,
      subtitle: 'Necessita pedido de compra',
      icon: AlertTriangle,
      color: '#f59e0b',
      bgGlow: 'rgba(245, 158, 11, 0.15)',
      filterKey: 'LOW',
      highlight: metrics.lowStockCount > 0,
    },
    {
      id: 'CRITICAL',
      label: 'Sem Estoque (Crítico)',
      value: metrics.outOfStockCount,
      subtitle: 'Risco iminente de perda de vendas',
      icon: AlertOctagon,
      color: '#f43f5e',
      bgGlow: 'rgba(244, 63, 94, 0.15)',
      filterKey: 'CRITICAL',
      highlight: metrics.outOfStockCount > 0,
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      marginBottom: '24px',
    }}>
      {cards.map((c) => {
        const Icon = c.icon;
        const isSelected = activeStatusFilter === c.filterKey;

        return (
          <div
            key={c.id}
            className="glass-panel"
            onClick={() => onFilterStatus && onFilterStatus(c.filterKey)}
            style={{
              padding: '20px',
              cursor: onFilterStatus ? 'pointer' : 'default',
              border: isSelected ? `2px solid ${c.color}` : '1px solid var(--border-subtle)',
              position: 'relative',
              overflow: 'hidden',
              background: isSelected ? 'rgba(30, 41, 59, 0.9)' : 'var(--bg-surface)',
            }}
          >
            {/* Top Accent Gradient Light */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, transparent, ${c.color}, transparent)`,
              opacity: c.highlight || isSelected ? 1 : 0.4,
            }} />

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  {c.label}
                </span>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  lineHeight: '1.2',
                  marginTop: '6px',
                  fontFamily: "'JetBrains Mono', monospace",
                }}>
                  {c.value}
                </div>
              </div>

              <div style={{
                background: c.bgGlow,
                padding: '10px',
                borderRadius: '12px',
                color: c.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Icon size={22} />
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '12px',
              fontSize: '0.75rem',
              color: c.highlight ? c.color : 'var(--text-subtle)',
              fontWeight: c.highlight ? 600 : 400,
            }}>
              <span>{c.subtitle}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
