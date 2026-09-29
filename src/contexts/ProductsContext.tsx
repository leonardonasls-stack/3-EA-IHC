import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../types';

interface ProductsContextData {
  products: Product[];
  grossSales: number;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  updateStock: (id: string, newStock: number) => void;
  registerSale: (items: { product: Product, quantity: number }[]) => void;
}

const defaultProducts: Product[] = [
  { id: '1', name: 'Skol Litrão', price: 8.0, stock: 95, category: 'Bebidas', iconType: 'beer', color: 'amber' },
  { id: '2', name: 'Coca-Cola 2L', price: 10.0, stock: 12, category: 'Bebidas', iconType: 'drop', color: 'red' },
  { id: '3', name: 'Água Mineral 500ml', price: 2.5, stock: 50, category: 'Bebidas', iconType: 'drop', color: 'blue' },
  { id: '4', name: 'Carvão 3kg', price: 20.0, stock: 0, category: 'Mercearia', iconType: 'drop', color: 'amber' },
  { id: '5', name: 'Cerveja Lata 350ml', price: 4.5, stock: 15, category: 'Bebidas', iconType: 'beer', color: 'amber' },
  { id: '6', name: 'Queijo Mussarela 1kg', price: 45.0, stock: 8, category: 'Frios', iconType: 'package', color: 'amber' },
  { id: '7', name: 'Presunto 1kg', price: 30.0, stock: 10, category: 'Frios', iconType: 'package', color: 'red' },
  { id: '8', name: 'Pão de Alho', price: 15.0, stock: 25, category: 'Mercearia', iconType: 'package', color: 'amber' },
  { id: '9', name: 'Suco Del Valle 1L', price: 8.5, stock: 20, category: 'Bebidas', iconType: 'drop', color: 'red' },
  { id: '10', name: 'Gelo 5kg', price: 12.0, stock: 30, category: 'Mercearia', iconType: 'drop', color: 'blue' },
  { id: '11', name: 'Sabão em Pó 1kg', price: 18.0, stock: 20, category: 'Limpeza', iconType: 'package', color: 'blue' },
  { id: '12', name: 'Detergente Líquido', price: 2.5, stock: 40, category: 'Limpeza', iconType: 'drop', color: 'amber' },
  { id: '13', name: 'Pão Francês (kg)', price: 18.0, stock: 10, category: 'Padaria', iconType: 'package', color: 'amber' },
  { id: '14', name: 'Bolo de Chocolate', price: 25.0, stock: 5, category: 'Padaria', iconType: 'package', color: 'red' },
];

const ProductsContext = createContext<ProductsContextData>({} as ProductsContextData);

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('@CaixaRapido:products_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return defaultProducts;
      }
    }
    return defaultProducts;
  });

  const [grossSales, setGrossSales] = useState<number>(() => {
    const saved = localStorage.getItem('@CaixaRapido:grossSales_v2');
    return saved ? Number(saved) : 0;
  });

  useEffect(() => {
    localStorage.setItem('@CaixaRapido:products_v2', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('@CaixaRapido:grossSales_v2', String(grossSales));
  }, [grossSales]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: String(Date.now()) };
    setProducts((prev) => [...prev, newProduct]);
  };

  const updateProduct = (id: string, data: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...data } : p))
    );
  };

  const removeProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const updateStock = (id: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stock: newStock } : p))
    );
  };

  const registerSale = (items: { product: Product, quantity: number }[]) => {
    // Diminui estoque
    setProducts(prev => prev.map(p => {
      const soldItem = items.find(i => i.product.id === p.id);
      if (soldItem) {
        return { ...p, stock: Math.max(0, p.stock - soldItem.quantity) };
      }
      return p;
    }));

    // Aumenta Vendas Brutas
    const saleTotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    setGrossSales(prev => prev + saleTotal);
  };

  return (
    <ProductsContext.Provider
      value={{ products, grossSales, addProduct, updateProduct, removeProduct, updateStock, registerSale }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);
