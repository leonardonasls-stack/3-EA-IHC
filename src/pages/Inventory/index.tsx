import { useState } from 'react';
import { ArrowLeft, XCircle, Warning, CheckCircle, X } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../contexts/ProductsContext';
import type { Product } from '../../types';

export function GestaoMobile() {
  const navigate = useNavigate();
  const { products, grossSales, updateStock } = useProducts();
  
  const [replenishModal, setReplenishModal] = useState<{ isOpen: boolean; product: Product | null }>({ isOpen: false, product: null });
  const [replenishAmount, setReplenishAmount] = useState('');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  // Exemplo de cálculos fixos/dinâmicos baseados nas Vendas Brutas
  const capitalDeGiro = grossSales * 0.5; // Calculado como 50% das vendas brutas 
  const lucroLivreEstimado = grossSales - capitalDeGiro;

  return (
    <div className="w-full h-full bg-gray-50 overflow-hidden flex flex-col">
      
      <div className="flex items-center p-5 bg-blue-900 text-white shrink-0">
        <button type="button" aria-label="Voltar para o PDV" onClick={() => navigate('/pdv')}
          className="touch-target mr-3 hover:bg-blue-800 rounded-full p-2 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-lg font-bold">Gestão & Estoque</h2>
      </div>

      <div className="p-5 flex flex-col gap-6 flex-grow overflow-y-auto">

        {/* Resumo Financeiro */}
        <section aria-labelledby="resumo-titulo" className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden shrink-0">
          <div className="bg-gray-100 p-3 border-b border-gray-200">
            <h3 id="resumo-titulo" className="text-xs font-bold text-gray-600 uppercase tracking-wider">Resumo do Dia</h3>
          </div>
          <div className="p-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500 font-medium">Vendas Brutas</p>
              <p className="text-lg font-bold text-gray-900">{formatCurrency(grossSales)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Capital de Giro</p>
              <p className="text-lg font-bold text-blue-600">{formatCurrency(capitalDeGiro)}</p>
            </div>
            <div className="col-span-2 pt-3 border-t border-gray-100 flex justify-between items-center">
              <p className="text-sm text-gray-600 font-bold">Lucro Livre Estimado</p>
              <p className={`text-xl font-black ${lucroLivreEstimado >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(lucroLivreEstimado)}
              </p>
            </div>
          </div>
        </section>

        {/* Semáforo de Estoque */}
        <section aria-labelledby="estoque-titulo" className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
          <div className="bg-gray-100 p-3 border-b border-gray-200 flex justify-between items-center shrink-0">
            <h3 id="estoque-titulo" className="text-xs font-bold text-gray-600 uppercase tracking-wider">Avisos de Estoque</h3>
          </div>
          <ul className="divide-y divide-gray-100 overflow-y-auto flex-grow">
            {products.map((product) => {
              let status = 'ok';
              if (product.stock === 0) status = 'falta';
              else if (product.stock <= 15) status = 'atencao';

              return (
                <li key={product.id} className={`p-4 flex items-center justify-between ${status === 'falta' ? 'bg-red-50' : ''}`}>
                  <div className="flex items-center gap-3">
                    {status === 'falta' && <XCircle weight="fill" className="text-red-600" size={24} aria-hidden="true" />}
                    {status === 'atencao' && <Warning weight="fill" className="text-amber-500" size={24} aria-hidden="true" />}
                    {status === 'ok' && <CheckCircle weight="fill" className="text-green-500" size={24} aria-hidden="true" />}
                    
                    <div>
                      <p className="text-sm font-bold text-gray-900">{product.name}</p>
                      {status === 'falta' && <p className="text-xs font-bold text-red-700 mt-1">FALTA - {product.stock} unidades</p>}
                      {status === 'atencao' && <p className="text-xs font-medium text-amber-700 mt-1">Atenção - {product.stock} unidades</p>}
                      {status === 'ok' && <p className="text-xs font-medium text-green-700 mt-1">Normal - {product.stock} unidades</p>}
                    </div>
                  </div>
                  {(status === 'falta' || status === 'atencao') && (
                    <button type="button" onClick={() => setReplenishModal({ isOpen: true, product })} className={`${status === 'falta' ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-500 hover:bg-amber-600'} text-white px-4 py-2 rounded-lg text-xs font-bold touch-target shadow-sm transition-colors`}>
                      Repor
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      </div>

      {/* Fixed Bottom Button */}
      <div className="w-full p-4 bg-white border-t border-gray-200 shrink-0">
        <button type="button" className="w-full py-3 touch-target bg-blue-900 text-white font-bold text-base rounded-xl shadow-lg hover:bg-blue-800 transition-colors">
          Abrir Câmera / Bipar Produto
        </button>
      </div>

      {/* Modal de Reposição */}
      {replenishModal.isOpen && replenishModal.product && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-gray-900">Repor Estoque</h3>
              <button onClick={() => { setReplenishModal({ isOpen: false, product: null }); setReplenishAmount(''); }} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">
              Quantas unidades de <strong>{replenishModal.product.name}</strong> você deseja adicionar ao estoque?
            </p>
            <p className="text-xs text-gray-500 mb-4">Estoque atual: {replenishModal.product.stock} un.</p>
            
            <input 
              type="number" 
              min="1"
              value={replenishAmount}
              onChange={(e) => setReplenishAmount(e.target.value)}
              placeholder="Ex: 10"
              autoFocus
              className="w-full border-2 border-gray-300 rounded-lg p-3 text-lg mb-6 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
            />

            <button
              onClick={() => {
                const added = parseInt(replenishAmount, 10);
                if (!isNaN(added) && added > 0 && replenishModal.product) {
                  updateStock(replenishModal.product.id, replenishModal.product.stock + added);
                  setReplenishModal({ isOpen: false, product: null });
                  setReplenishAmount('');
                }
              }}
              disabled={!replenishAmount || isNaN(parseInt(replenishAmount, 10)) || parseInt(replenishAmount, 10) <= 0}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
            >
              Confirmar Reposição
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
