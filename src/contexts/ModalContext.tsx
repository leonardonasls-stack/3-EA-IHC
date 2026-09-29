import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { X, CheckCircle, WarningCircle, XCircle } from '@phosphor-icons/react';

type ModalType = 'success' | 'warning' | 'error' | 'info';

interface ModalOptions {
  title: string;
  message: string;
  type?: ModalType;
}

interface ModalContextData {
  showModal: (options: ModalOptions) => void;
}

const ModalContext = createContext<ModalContextData>({} as ModalContextData);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState<ModalOptions | null>(null);

  const showModal = (options: ModalOptions) => {
    setModalContent(options);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => setModalContent(null), 300); // clear after animation
  };

  return (
    <ModalContext.Provider value={{ showModal }}>
      {children}
      {isOpen && modalContent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {modalContent.type === 'success' && <CheckCircle weight="fill" className="text-green-500" size={32} />}
                {modalContent.type === 'error' && <XCircle weight="fill" className="text-red-500" size={32} />}
                {modalContent.type === 'warning' && <WarningCircle weight="fill" className="text-amber-500" size={32} />}
                {!modalContent.type || modalContent.type === 'info' && <WarningCircle weight="fill" className="text-blue-500" size={32} />}
                <h3 className="text-lg font-bold text-gray-900">{modalContent.title}</h3>
              </div>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-600 mb-6 whitespace-pre-line">{modalContent.message}</p>
            <button
              onClick={closeModal}
              className={`w-full py-3 rounded-xl font-bold text-white transition-colors
                ${modalContent.type === 'success' ? 'bg-green-600 hover:bg-green-700' : ''}
                ${modalContent.type === 'error' ? 'bg-red-600 hover:bg-red-700' : ''}
                ${modalContent.type === 'warning' ? 'bg-amber-500 hover:bg-amber-600' : ''}
                ${!modalContent.type || modalContent.type === 'info' ? 'bg-blue-600 hover:bg-blue-700' : ''}
              `}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
