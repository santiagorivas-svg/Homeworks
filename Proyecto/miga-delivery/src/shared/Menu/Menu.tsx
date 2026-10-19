import React from 'react';
import { Compass, UtensilsCrossed, ShoppingBag, Heart, Bike, Shield, LogOut, LogIn } from 'lucide-react';
import { useAuthContext } from '../../context/AuthContext';
import styles from './Menu.module.css';

interface MenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ElementType;
  badge?: string | number;
}

export const Menu: React.FC<MenuProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout, setShowAuthModal } = useAuthContext();

  // 1. Opciones PÚBLICAS
  const navItems: NavItem[] = [
    { id: 'discover', label: 'Descubrir', icon: Compass },
    { id: 'restaurants', label: 'Restaurantes', icon: UtensilsCrossed },
  ];

  // 2. Opciones EXCLUSIVAS DE USUARIO
  if (user && user.role === 'user') {
    navItems.push(
      { id: 'orders', label: 'Mis pedidos', icon: ShoppingBag },
      { id: 'favorites', label: 'Favoritos', icon: Heart },
      { id: 'tracking', label: 'Rastreo en vivo', icon: Bike }
    );
  }

  // 3. Opciones EXCLUSIVAS DE ADMINISTRADOR
  if (user && user.role === 'admin') {
    navItems.push(
      { id: 'admin', label: 'Panel Admin', icon: Shield }
    );
  }

  return (
    <aside className={`${styles.sidebar || ''} w-64 bg-white border-r border-gray-100 p-6 flex flex-col justify-between h-screen sticky top-0 z-20`}>
      <div>
        {/* Logo Miga */}
        <div className="flex items-center gap-3 mb-10 cursor-pointer" onClick={() => setActiveTab('discover')}>
          <div className="bg-[#e0533c] p-2 rounded-xl text-white">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <span className="font-bold text-2xl tracking-tight text-gray-900">Miga.</span>
        </div>

        {/* Navegación Filtrada */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#23211f] text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-semibold">{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-[#e0533c] text-white' : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Widget inferior */}
      <div className="space-y-4">
        <div className="bg-[#d2e2d0] p-4 rounded-2xl">
          <div className="bg-[#5c8a58] w-8 h-8 rounded-xl flex items-center justify-center text-white mb-3">
            <Bike className="w-5 h-5" />
          </div>
          <p className="font-bold text-gray-900 text-xs leading-snug">
            Entrega sin prisas, pero sin esperas.
          </p>
          <p className="text-[11px] text-gray-600 mt-1">
            Sigue tu pedido en tiempo real desde la cocina hasta la UAO.
          </p>
        </div>

        {/* Perfil del Usuario / Botón de ingreso */}
        {user ? (
          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-[#e0533c] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-xs truncate">
                <p className="font-semibold text-gray-800 truncate">{user.name}</p>
                <p className="text-gray-400 capitalize text-[10px]">{user.role}</p>
              </div>
            </div>
            <button
              onClick={logout}
              title="Cerrar Sesión"
              className="text-gray-400 hover:text-red-500 transition-colors p-1 cursor-pointer shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAuthModal(true)}
            className="w-full flex items-center justify-center gap-2 bg-[#e0533c] text-white py-2.5 rounded-xl text-xs font-bold hover:bg-[#c8432d] transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4" /> Iniciar Sesión
          </button>
        )}
      </div>
    </aside>
  );
};