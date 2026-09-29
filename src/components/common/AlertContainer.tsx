import { BellRinging, WarningCircle, XCircle } from '@phosphor-icons/react';
import { useProducts } from '../../contexts/ProductsContext';
import { useModal } from '../../contexts/ModalContext';

export function AlertContainer() {
  const { products } = useProducts();
  const { showModal } = useModal();

  const outOfStock = products.filter(p => p.stock === 0);
  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 15);

  const showLowStockModal = () => {
    if (lowStock.length === 0) return;
    const message = lowStock.map(p => `• ${p.name}: ${p.stock} un.`).join('\n');
    showModal({
      title: 'Produtos em Baixa',
      message: message,
      type: 'warning'
    });
  };

  const showOutOfStockModal = () => {
    if (outOfStock.length === 0) return;
    const message = outOfStock.map(p => `• ${p.name}`).join('\n');
    showModal({
      title: 'Produtos Esgotados',
      message: message,
      type: 'error'
    });
  };

  if (outOfStock.length === 0 && lowStock.length === 0) {
    return null;
  }

  return (
    <div className="bg-indigo-900 p-4 flex flex-col sm:flex-row items-center gap-4" aria-live="polite" role="status">
      <span className="text-xs font-bold text-indigo-200 uppercase tracking-widest flex items-center gap-2">
        <BellRinging size={18} /> Avisos do Sistema
      </span>
      <div className="flex flex-wrap gap-3">
        {lowStock.length > 0 && (
          <button onClick={showLowStockModal} className="flex items-center gap-2 bg-amber-100 border border-amber-300 text-amber-900 px-4 py-2 rounded-lg shadow-sm hover:bg-amber-200 transition-colors focus:ring-2 focus:ring-amber-500 outline-none">
            <WarningCircle weight="fill" size={18} aria-hidden="true" />
            <span className="text-sm font-bold">{lowStock.length} produto(s) em baixa</span>
          </button>
        )}
        {outOfStock.length > 0 && (
          <button onClick={showOutOfStockModal} className="flex items-center gap-2 bg-red-100 border border-red-300 text-red-900 px-4 py-2 rounded-lg shadow-sm hover:bg-red-200 transition-colors focus:ring-2 focus:ring-red-500 outline-none">
            <XCircle weight="fill" size={18} aria-hidden="true" />
            <span className="text-sm font-bold">{outOfStock.length} produto(s) esgotado(s)</span>
          </button>
        )}
      </div>
    </div>
  );
}
