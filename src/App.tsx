import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PDV } from './pages/POS'
import { GestaoMobile } from './pages/Inventory'
import { CartProvider } from './contexts/CartContext'
import { ProductsProvider } from './contexts/ProductsContext'
import { ModalProvider } from './contexts/ModalContext'

function App() {
  return (
    <ModalProvider>
      <ProductsProvider>
        <CartProvider>
          <BrowserRouter>
            <div className="w-screen h-screen flex flex-col bg-slate-100 overflow-hidden">
              <Routes>
                <Route path="/pdv" element={<PDV />} />
                <Route path="/gestao" element={<GestaoMobile />} />
                <Route path="/" element={<Navigate to="/pdv" replace />} />
              </Routes>
            </div>
          </BrowserRouter>
        </CartProvider>
      </ProductsProvider>
    </ModalProvider>
  )
}

export default App
