import { useState } from 'react';
import { Barcode, MagnifyingGlass, BeerBottle, Drop, Trash, QrCode, CreditCard, Money, Package } from '@phosphor-icons/react';
import { Header } from '../../components/layout/Header';
import { AlertContainer } from '../../components/common/AlertContainer';
import { useCart } from '../../contexts/CartContext';
import { useProducts } from '../../contexts/ProductsContext';
import { useModal } from '../../contexts/ModalContext';
import type { CartItem } from '../../types';

export function PDV() {
  const { cart, addToCart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const { products, registerSale } = useProducts();
  const { showModal } = useModal();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão' | 'Dinheiro'>('Cartão');

  const categories = ['Todos', 'Bebidas', 'Frios', 'Mercearia', 'Limpeza', 'Padaria'];

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Todos' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  const handleFinishSale = () => {
    if (cart.length === 0) return;
    registerSale(cart);
    showModal({
      title: 'Venda Finalizada!',
      message: `Total: ${formatCurrency(cartTotal)}\nMétodo: ${paymentMethod}`,
      type: 'success'
    });
    clearCart();
  };

  const getIcon = (type: string, size = 36) => {
    if (type === 'beer') return <BeerBottle weight="fill" size={size} />;
    if (type === 'drop') return <Drop weight="fill" size={size} />;
    return <Package weight="fill" size={size} />;
  };

  return (
    <main className="w-full h-full bg-white flex flex-col overflow-hidden">
      <Header />

      <div className="flex flex-col lg:flex-row w-full flex-grow overflow-y-auto lg:overflow-hidden pb-48 sm:pb-0">
        {/* Esquerda: Produtos */}
        <div className="w-full lg:w-[65%] p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 border-b lg:border-b-0 lg:border-r border-gray-200 bg-gray-50 lg:overflow-hidden shrink-0 lg:shrink">
          
          {/* Busca */}
          <div className="flex flex-col gap-1">
            <label htmlFor="busca-produto" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Buscar Produto
            </label>
            <div className="flex items-center w-full border-2 border-gray-300 hover:border-blue-500 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-200 rounded-lg px-3 bg-white transition-all">
              <Barcode size={24} className="text-gray-500 mr-2" aria-hidden="true" />
              <input id="busca-produto" type="text" placeholder='Ex: "Skol"'
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-grow outline-none text-base placeholder-gray-400 py-3 text-gray-900" />
              <button type="button" aria-label="Pesquisar" className="touch-target text-blue-600 hover:text-blue-800">
                <MagnifyingGlass size={24} />
              </button>
            </div>
          </div>

          {/* Categorias */}
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider" id="cat-label">Categorias Rápidas</h2>
            <div className="flex flex-wrap gap-2" role="group" aria-labelledby="cat-label">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  type="button"
                  className={`px-5 py-2 text-sm font-bold rounded-lg shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors ${
                    activeCategory === cat
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600 hover:text-blue-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Produtos */}
          <div className="flex flex-col gap-6 mt-2 overflow-y-auto pr-2">
            {categories.filter(c => c !== 'Todos').map(category => {
              const categoryProducts = filteredProducts.filter(p => p.category === category);
              if (categoryProducts.length === 0) return null;

              return (
                <div key={category} className="flex flex-col gap-3">
                  <h2 className="text-xs font-bold text-gray-700 uppercase tracking-wider pb-1 border-b border-gray-200">
                    {category}
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-3 sm:gap-4">
                    {categoryProducts.map((product) => (
                      <button key={product.id} onClick={() => addToCart(product)} type="button" 
                        disabled={product.stock <= 0}
                        className={`bg-white border rounded-xl p-2 sm:p-3 flex flex-col gap-2 transition-all text-left group focus:ring-2 focus:ring-blue-600
                          ${product.stock <= 0 ? 'border-gray-200 opacity-50 cursor-not-allowed grayscale' : 'border-gray-200 hover:border-blue-500 hover:shadow-md'}
                        `}>
                        <span className={`w-full h-16 sm:h-24 bg-${product.color}-100 rounded-lg flex items-center justify-center text-${product.color}-600 ${product.stock > 0 ? 'group-hover:scale-105' : ''} transition-transform block`}>
                          {getIcon(product.iconType)}
                        </span>
                        <span className="flex flex-col">
                          <span className="text-xs sm:text-sm font-bold text-gray-900 leading-tight truncate">{product.name}</span>
                          <span className={`text-[10px] sm:text-xs mt-1 font-medium ${product.stock <= 0 ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
                            {product.stock <= 0 ? 'ESGOTADO' : `${product.stock} un.`} - {formatCurrency(product.price)}
                          </span>
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
            {filteredProducts.length === 0 && (
              <p className="text-center text-gray-500 py-8">Nenhum produto encontrado.</p>
            )}
          </div>
        </div>

        {/* Direita: Cupom e Pagamento */}
        <div className="w-full lg:w-[40%] flex flex-col bg-white lg:overflow-hidden shrink-0 lg:shrink">
          <div className="p-4 flex items-center justify-between bg-gray-100 border-b border-gray-200">
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Cupom Atual</h2>
            <span className="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-bold text-gray-600 shadow-sm">
              {cart.length > 0 ? `#${Math.floor(Math.random() * 10000)}` : 'Vazio'}
            </span>
          </div>

          <div className="flex-grow p-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex items-center justify-between p-3 border border-gray-100 bg-gray-50 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQty = parseInt(e.target.value, 10);
                        if (!isNaN(newQty)) {
                          updateQuantity(item.product.id, newQty);
                        }
                      }}
                      className="w-14 h-8 bg-white border border-gray-300 text-blue-900 rounded-md px-1 text-center text-sm font-bold focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                    <span className="text-sm font-semibold text-gray-800">{item.product.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-900">{formatCurrency(item.product.price * item.quantity)}</span>
                    <button type="button" onClick={() => removeFromCart(item.product.id)} aria-label={`Remover ${item.product.name}`} className="text-gray-400 hover:text-red-600 touch-target">
                      <Trash size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <p className="text-center text-gray-600 font-medium text-sm mt-10">O carrinho está vazio. Comece a adicionar produtos.</p>
              )}
            </div>
          </div>

          {/* Pagamento */}
          <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-200 flex flex-col gap-4 sm:gap-6 fixed sm:static bottom-0 left-0 right-0 w-full sm:w-auto z-20 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] sm:shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-600 uppercase tracking-wider">Total a Pagar</span>
              <span className="text-3xl sm:text-4xl font-black text-blue-900">{formatCurrency(cartTotal)}</span>
            </div>

            <fieldset>
              <legend className="text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Forma de Pagamento</legend>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <button type="button" onClick={() => setPaymentMethod('PIX')} 
                  className={`flex flex-col items-center justify-center py-2 sm:py-4 rounded-xl border-2 transition-all gap-1 sm:gap-2 ${paymentMethod === 'PIX' ? 'bg-blue-50 text-blue-700 border-blue-600 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600'}`} aria-pressed={paymentMethod === 'PIX'}>
                  <QrCode size={24} className="sm:hidden" />
                  <QrCode size={32} className="hidden sm:block" />
                  <span className="text-[10px] sm:text-xs font-bold">PIX</span>
                </button>
                <button type="button" onClick={() => setPaymentMethod('Cartão')} 
                  className={`flex flex-col items-center justify-center py-2 sm:py-4 rounded-xl border-2 transition-all gap-1 sm:gap-2 ${paymentMethod === 'Cartão' ? 'bg-blue-50 text-blue-700 border-blue-600 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600'}`} aria-pressed={paymentMethod === 'Cartão'}>
                  <CreditCard size={24} className="sm:hidden" />
                  <CreditCard size={32} className="hidden sm:block" />
                  <span className="text-[10px] sm:text-xs font-bold">Cartão</span>
                </button>
                <button type="button" onClick={() => setPaymentMethod('Dinheiro')} 
                  className={`flex flex-col items-center justify-center py-2 sm:py-4 rounded-xl border-2 transition-all gap-1 sm:gap-2 ${paymentMethod === 'Dinheiro' ? 'bg-blue-50 text-blue-700 border-blue-600 shadow-sm' : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600'}`} aria-pressed={paymentMethod === 'Dinheiro'}>
                  <Money size={24} className="sm:hidden" />
                  <Money size={32} className="hidden sm:block" />
                  <span className="text-[10px] sm:text-xs font-bold">Dinheiro</span>
                </button>
              </div>
            </fieldset>

            <div className="flex gap-2 sm:gap-3 w-full">
              <button type="button" onClick={clearCart} className="flex-1 py-3 sm:py-4 bg-white text-red-600 font-bold text-xs sm:text-sm border-2 border-red-200 hover:border-red-600 rounded-xl transition-all touch-target focus:ring-2 focus:ring-red-600">
                CANCELAR
              </button>
              <button type="button" onClick={handleFinishSale} disabled={cart.length === 0} 
                className="flex-1 py-3 sm:py-4 bg-green-700 hover:bg-green-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm sm:text-lg border-2 border-transparent rounded-xl shadow-lg transition-all touch-target focus:ring-2 focus:ring-offset-2 focus:ring-green-700">
                FINALIZAR VENDA
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <AlertContainer />
    </main>
  );
}
