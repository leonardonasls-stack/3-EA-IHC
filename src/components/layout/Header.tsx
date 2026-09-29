import { List, WifiHigh } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between p-4 bg-blue-900 text-white">
      <div className="flex items-center gap-4">
        <button type="button" aria-label="Abrir menu principal" onClick={() => navigate('/gestao')}
          className="p-2 hover:bg-blue-800 rounded-md transition-colors touch-target">
          <List size={24} />
        </button>
        <h1 className="text-2xl font-bold tracking-tight">CaixaRápido</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500 text-green-950 rounded-full font-bold text-xs uppercase tracking-wider"
          role="status" aria-label="Sistema Online">
          <WifiHigh weight="fill" size={16} /> Online
        </div>
      </div>
    </header>
  );
}
