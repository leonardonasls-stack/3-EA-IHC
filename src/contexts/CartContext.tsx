import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Product, CartItem } from '../types';
import { useModal } from './ModalContext';

interface CartContextData {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const { showModal } = useModal();

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      
      if (existing) {
        if (existing.quantity >= product.stock) {
          showModal({
            title: 'Estoque Insuficiente',
            message: `Você já adicionou todas as ${product.stock} unidades de ${product.name} no carrinho.`,
            type: 'warning'
          });
          return prev;
        }
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      if (product.stock <= 0) {
        showModal({
          title: 'Produto Esgotado',
          message: `${product.name} está sem estoque no momento!`,
          type: 'error'
        });
        return prev;
      }
      
      return [...prev, { product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((item) => {
      if (item.product.id === productId) {
        if (quantity > item.product.stock) {
          showModal({
            title: 'Estoque Insuficiente',
            message: `Só existem ${item.product.stock} unidades de ${item.product.name} no estoque.`,
            type: 'warning'
          });
          return { ...item, quantity: item.product.stock };
        }
        return { ...item, quantity };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
