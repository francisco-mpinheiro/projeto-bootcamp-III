import { useState, useEffect, useCallback } from 'react';
import { api } from './services/api';
import type { Product, DashboardSummary, CreateProductInput, CreateMovementInput } from './types';
import { Header } from './components/Header';
import { DashboardKPIs } from './components/DashboardKPIs';
import { AlertBanner } from './components/AlertBanner';
import { ProductList } from './components/ProductList';
import { ProductModal } from './components/ProductModal';
import { MovementModal } from './components/MovementModal';
import { MovementHistoryModal } from './components/MovementHistoryModal';
import { Toast } from './components/Toast';
import type { ToastMessage } from './components/Toast';

export function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedMovementProduct, setSelectedMovementProduct] = useState<Product | null>(null);

  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Toast notification
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: 'success' | 'alert' | 'error', title: string, message?: string) => {
    setToast({
      id: Math.random().toString(),
      type,
      title,
      message,
    });
  };

  // Fetch all initial data
  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [productsData, summaryData] = await Promise.all([
        api.getProducts(),
        api.getDashboardSummary(),
      ]);
      setProducts(productsData);
      setSummary(summaryData);
    } catch (err: unknown) {
      console.error('Erro ao carregar dados do Stockly:', err);
      showToast(
        'error',
        'Falha de comunicação',
        'Não foi possível conectar ao servidor do backend. Verifique se o servidor está ativo na porta 3001.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Product CRUD Handlers
  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleOpenEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = async (data: CreateProductInput) => {
    if (editingProduct) {
      await api.updateProduct(editingProduct.id, data);
      showToast('success', 'Produto atualizado', `${data.name} foi atualizado com sucesso.`);
    } else {
      await api.createProduct(data);
      showToast('success', 'Produto cadastrado', `${data.name} foi adicionado ao estoque.`);
    }
    await loadData();
  };

  const handleDeleteProduct = async (id: number) => {
    const product = products.find((p) => p.id === id);
    const confirmDelete = window.confirm(
      `Deseja realmente excluir o produto "${product?.name || id}"? Todas as movimentações deste produto também serão removidas.`
    );
    if (!confirmDelete) return;

    try {
      await api.deleteProduct(id);
      showToast('success', 'Produto removido', 'O item foi excluído do inventário.');
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao excluir produto.';
      showToast('error', 'Falha na exclusão', msg);
    }
  };

  // Movement Handlers
  const handleOpenMovement = (product?: Product | null) => {
    setSelectedMovementProduct(product || null);
    setIsMovementModalOpen(true);
  };

  const handleRegisterMovement = async (data: CreateMovementInput) => {
    const result = await api.registerMovement(data);
    const isExit = data.type === 'EXIT';
    const prodName = result.product.name;

    if (result.alertTriggered) {
      // Dispara Toast de Alerta destacado se atingir ou ficar abaixo do ponto de reposição!
      showToast(
        'alert',
        '⚠️ Ponto de Reposição Atingido!',
        `O produto "${prodName}" atingiu ${result.product.currentStock} ${result.product.unit} (estoque mínimo: ${result.product.minStock}). Necessita reposição urgente!`
      );
    } else {
      showToast(
        'success',
        isExit ? 'Saída registrada' : 'Entrada registrada',
        `${data.quantity} ${result.product.unit} de "${prodName}". Novo estoque: ${result.product.currentStock}.`
      );
    }

    await loadData();
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 16px' }}>
      {/* Header */}
      <Header
        onOpenNewProduct={handleOpenNewProduct}
        onOpenMovement={() => handleOpenMovement(null)}
        onOpenHistory={() => setIsHistoryModalOpen(true)}
        totalAlerts={summary?.metrics.totalAlerts || 0}
      />

      {/* Low Stock Urgent Alert Banner */}
      {summary && summary.alertProducts.length > 0 && (
        <AlertBanner
          alertProducts={summary.alertProducts}
          onQuickRestock={(product) => handleOpenMovement(product)}
        />
      )}

      {/* KPI Metrics Summary Cards */}
      {summary && (
        <DashboardKPIs
          metrics={summary.metrics}
          onFilterStatus={(status) => setStatusFilter(status)}
          activeStatusFilter={statusFilter}
        />
      )}

      {/* Main Inventory Product Table */}
      <ProductList
        products={products}
        isLoading={isLoading}
        onMovement={(product) => handleOpenMovement(product)}
        onEdit={handleOpenEditProduct}
        onDelete={handleDeleteProduct}
        onNewProduct={handleOpenNewProduct}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Modals */}
      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        onSave={handleSaveProduct}
        editingProduct={editingProduct}
      />

      <MovementModal
        isOpen={isMovementModalOpen}
        onClose={() => setIsMovementModalOpen(false)}
        products={products}
        selectedProduct={selectedMovementProduct}
        onRegister={handleRegisterMovement}
      />

      <MovementHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />

      {/* Floating Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

export default App;
