export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  iconType: 'beer' | 'drop' | 'water' | 'package'; // simplifies the icon choice
  color: 'amber' | 'red' | 'blue';
}

export interface CartItem {
  product: Product;
  quantity: number;
}
