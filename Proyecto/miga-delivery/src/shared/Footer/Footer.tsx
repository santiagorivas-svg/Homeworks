import React from 'react';
import { ShoppingBag, MapPin } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { user } = useAuthContext();

  return (
    <footer className="bg-[#1c1a19] text-gray-400 py-10 px-8 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 items-start">
        
        {/* Columna 1: Branding y Universidad */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('discover')}>
            <div className="bg-[#e0533c] p-2 rounded-xl text-white">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">Miga.</span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Plataforma de domicilios optimizada con 5 estructuras de datos fundamentales.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold bg-amber-500/10 px-3 py-1.5 rounded-full w-fit border border-amber-500/20">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span>Cali, Colombia • Universidad Autónoma de Occidente</span>
          </div>
        </div>

        {/* Columna 2: Navegación Rápida */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Navegación</h4>
          <ul className="space-y-2.5 text-xs">
            <li>
              <button onClick={() => setActiveTab('discover')} className="hover:text-white transition-colors cursor-pointer">
                Descubrir Menú
              </button>
            </li>
            {user?.role === 'user' && (
              <>
                <li>
                  <button onClick={() => setActiveTab('orders')} className="hover:text-white transition-colors cursor-pointer">
                    Mis Pedidos
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('favorites')} className="hover:text-white transition-colors cursor-pointer">
                    Mis Favoritos
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('tracking')} className="hover:text-white transition-colors cursor-pointer">
                    Rastreo en Vivo
                  </button>
                </li>
              </>
            )}
            {user?.role === 'admin' && (
              <li>
                <button onClick={() => setActiveTab('admin')} className="hover:text-amber-400 text-amber-400 font-bold transition-colors cursor-pointer">
                  🛡️ Panel de Administración
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Columna 3: Estructuras de Datos */}
        <div>
          <h4 className="text-sm font-bold text-white mb-4 uppercase tracking-wider">Estructuras Aplicadas</h4>
          <ul className="space-y-2 text-[11px] text-gray-400">
            <li><strong className="text-emerald-400">Trie:</strong> Búsqueda en tiempo real</li>
            <li><strong className="text-indigo-400">Grafo / Dijkstra:</strong> Ruta óptima barrio Granada ➔ UAO</li>
            <li><strong className="text-amber-400">Queue (FIFO):</strong> Cola de cocina de pedidos</li>
            <li><strong className="text-purple-400">Stack (LIFO):</strong> Historial de estados</li>
            <li><strong className="text-blue-400">Min Heap:</strong> Asignación por cercanía</li>
          </ul>
        </div>

        {/* Columna 4: Elaborado Por con el título DENTRO de la tarjeta y alineado */}
        <div className="bg-[#262321] p-5 rounded-2xl border border-gray-800 -mt-2">
          <h4 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">
            Elaborado Por
          </h4>
          <div className="space-y-2">
            <p className="text-xs text-gray-300 font-medium">Santiago Rivas Diaz</p>
            <p className="text-xs text-gray-300 font-medium">Alejandro Ruiz Diaz</p>
            <p className="text-xs text-gray-300 font-medium">Dilan González Martínez</p>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-gray-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
        <p>© 2026 Miga Delivery App — Proyecto Estructura de Datos II • UAO Cali.</p>
        <p>Desarrollado con React 19, TypeScript, Vite & Tailwind CSS v4.</p>
      </div>
    </footer>
  );
};