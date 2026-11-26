import React, { useState, useMemo } from 'react';
import { Search, MapPin, Plus, Minus, Trash2, Send, CheckCircle2, Clock, Bike, ShoppingBag, X, LogIn, Check, Heart, Package } from 'lucide-react';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import { CartProvider, useCartContext } from './context/CartContext';
import { Menu } from './shared/Menu/Menu';
import { CardItem } from './components/CardItem/CardItem';
import { AppRoutes } from './routes/AppRoutes';
import { formatCOP } from './helpers/formatters';
import { DeliveryMap } from './components/DeliveryMap';
import { Footer } from './shared/Footer/Footer';

// Estructuras de datos
import { Trie } from './helpers/structures/Trie';
import { Graph } from './helpers/structures/Graph';
import { Queue } from './helpers/structures/Queue';
import { Stack } from './helpers/structures/Stack';
import { MinHeap } from './helpers/structures/MinHeap';

// Catálogo en Pesos Colombianos (COP)
const SAMPLE_PRODUCTS = [
  { id: 'p1', title: 'Pizza de la huerta', price: 38000, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500', badge: 'Más pedido' },
  { id: 'p2', title: 'Bowl verde mediterráneo', price: 29000, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500', badge: 'Envío gratis' },
  { id: 'p3', title: 'Hamburguesa Trufada', price: 34000, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500', badge: 'Oferta' },
  { id: 'p4', title: 'Sushi Roll Salmón (10 bocados)', price: 42000, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500' },
  { id: 'p5', title: 'Ramen Tonkotsu Especial', price: 32000, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500' },
  { id: 'p6', title: 'Tacos Al Pastor (3 unidades)', price: 25000, image: 'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?w=500' },
];

function MainApp() {
  const [activeTab, setActiveTab] = useState('discover');
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('Todo');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Estado global de Favoritos
  const [favoriteIds, setFavoriteIds] = useState<string[]>(['p1']);

  // Modal Auth
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // 1. Queue de Pedidos Real
  const [orderQueueInstance] = useState(() => new Queue<any>());
  const [ordersList, setOrdersList] = useState<any[]>([]);

  // 2. MinHeap de Repartidores Real
  const driverHeap = useMemo(() => {
    const heap = new MinHeap();
    heap.insert(0.8, { id: 'd1', name: 'Mateo K.', dist: '0.8 km', vehicle: 'Scooter' });
    heap.insert(1.2, { id: 'd2', name: 'Juan P.', dist: '1.2 km', vehicle: 'Moto' });
    heap.insert(2.5, { id: 'd3', name: 'Laura G.', dist: '2.5 km', vehicle: 'Bicicleta' });
    return heap;
  }, []);

  const [driversList, setDriversList] = useState<any[]>(() => driverHeap.getItems());
  
  // Modal de Asignación Interactiva
  const [selectedDriverToAssign, setSelectedDriverToAssign] = useState<any | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');

  const [chatMessages, setChatMessages] = useState<string[]>([
    'Repartidor: Hola, voy en camino al restaurante en Granada a recoger tu pedido.',
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const { user, login, register, logout, showAuthModal, setShowAuthModal, isAuthenticated } = useAuthContext();
  const { cart, addToCart, updateQuantity, removeFromCart, total, clearCart } = useCartContext();

  const toggleFavorite = (productId: string) => {
    if (!isAuthenticated) {
      setAuthError('Debes iniciar sesión para agregar a favoritos.');
      setShowAuthModal(true);
      return;
    }
    setFavoriteIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleAddToCart = (product: any) => {
    if (!isAuthenticated) {
      setAuthError('Debes iniciar sesión para agregar productos o realizar un pedido.');
      setShowAuthModal(true);
      return;
    }
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      setAuthError('Debes iniciar sesión para completar la compra.');
      setShowAuthModal(true);
      return;
    }

    if (cart.length > 0) {
      const newOrder = {
        id: `#${Math.floor(100 + Math.random() * 900)}`,
        client: user?.name || 'Usuario Miga',
        userEmail: user?.email,
        items: cart.map((i) => `${i.quantity}x ${i.title}`).join(', '),
        status: 'En cocina',
        total: total,
        date: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        driverAssigned: null,
      };

      orderQueueInstance.enqueue(newOrder);
      setOrdersList(orderQueueInstance.getItems());

      clearCart();
      setIsCartOpen(false);
      setShowSuccessModal(true);
    }
  };

  // 1. Trie
  const trie = useMemo(() => {
    const t = new Trie();
    SAMPLE_PRODUCTS.forEach((prod) => t.insert(prod.title, prod));
    return t;
  }, []);

  const searchResults = searchQuery
    ? trie.searchPrefix(searchQuery)
    : SAMPLE_PRODUCTS;

  // 2. Grafo
  const routeGraph = useMemo(() => {
    const g = new Graph();
    g.addEdge('Sede Granada', 'Av. 6ta (Zona Rosa)', 2.1);
    g.addEdge('Av. 6ta (Zona Rosa)', 'Calle 5ta (Estación MIO San Bosco)', 3.2);
    g.addEdge('Calle 5ta (Estación MIO San Bosco)', 'Av. Cañasgordas (Valle del Lili)', 5.8);
    g.addEdge('Av. Cañasgordas (Valle del Lili)', 'Universidad Autónoma de Occidente (UAO)', 1.8);

    g.addEdge('Sede Granada', 'Autopista Simón Bolívar', 5.5);
    g.addEdge('Autopista Simón Bolívar', 'Ciudad 2000 / El Caney', 5.2);
    g.addEdge('Ciudad 2000 / El Caney', 'Universidad Autónoma de Occidente (UAO)', 3.5);

    return g;
  }, []);

  const shortestRoute = routeGraph.getShortestPath('Sede Granada', 'Universidad Autónoma de Occidente (UAO)');

  const alternativeRoute = {
    path: ['Sede Granada', 'Autopista Simón Bolívar', 'Ciudad 2000 / El Caney', 'Universidad Autónoma de Occidente (UAO)'],
    distance: 14.2,
  };

  // 4. Stack
  const [statusStack] = useState(() => {
    const s = new Stack<string>();
    s.push('Pedido recibido');
    s.push('En preparación en cocina');
    s.push('Asignado a repartidor');
    s.push('En camino a destino');
    return s;
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (isRegisterMode) {
      if (!authName || !authEmail || !authPass) return setAuthError('Completa todos los campos');
      const ok = register(authName, authEmail, authPass);
      if (!ok) setAuthError('El correo ya se encuentra registrado');
    } else {
      const ok = login(authEmail, authPass);
      if (!ok) setAuthError('Credenciales incorrectas');
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [...prev, `Tú: ${inputMsg}`]);
    setInputMsg('');
  };

  const handleConfirmAssignment = () => {
    if (!selectedOrderId) return;

    setOrdersList((prevOrders) =>
      prevOrders.map((ord) => {
        if (ord.id === selectedOrderId) {
          return {
            ...ord,
            status: 'En camino',
            driverAssigned: selectedDriverToAssign.data.name,
          };
        }
        return ord;
      })
    );

    driverHeap.extractMin();
    setDriversList(driverHeap.getItems());

    setSelectedDriverToAssign(null);
    setSelectedOrderId('');
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // VISTA PRINCIPAL (DESCUBRIR)
  const HomeView = (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto justify-between">
      <div className="p-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-4 py-2.5 rounded-full">
            <MapPin className="w-4 h-4 text-[#e0533c]" />
            <span>ENTREGAR EN <strong>Universidad Autónoma de Occidente (UAO)</strong></span>
          </div>

          {/* Buscador Trie */}
          <div className="relative flex-1 max-w-xl">
            <Search className="w-5 h-5 absolute left-4 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="¿Qué te apetece hoy? (Búsqueda optimizada Trie)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-100 pl-12 pr-4 py-2.5 rounded-full text-xs outline-none focus:ring-2 focus:ring-[#e0533c]/30"
            />
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-gray-200 text-gray-800">
                {user.role === 'admin' ? '🛡️ Rol: ADMIN' : `👤 Hola, ${user.name}`}
              </span>
              <button
                onClick={() => {
                  logout();
                  setIsCartOpen(false);
                }}
                className="text-xs text-red-500 font-bold hover:underline cursor-pointer"
              >
                Salir
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 bg-[#e0533c] text-white px-5 py-2.5 rounded-full text-xs font-semibold hover:bg-[#c8432d] cursor-pointer"
            >
              <LogIn className="w-4 h-4" /> Iniciar Sesión / Registro
            </button>
          )}
        </div>

        {/* Banner */}
        <div className="bg-[#23211f] text-white rounded-3xl p-8 mb-8 relative overflow-hidden flex items-center justify-between">
          <div className="max-w-md z-10">
            <span className="text-xs font-semibold tracking-wider text-amber-400 uppercase bg-white/10 px-3 py-1 rounded-full">
              • Sabores locales
            </span>
            <h1 className="text-3xl font-bold mt-4 mb-3 leading-tight">Tu antojo, a un clic.</h1>
            <p className="text-gray-300 text-xs mb-6">Cocina local, ingredientes de verdad y entrega rápida en COP.</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600"
            alt="Banner"
            className="w-1/2 h-56 object-cover rounded-2xl hidden md:block"
          />
        </div>

        {/* Categorías */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {['Todo', 'Pizza', 'Saludable', 'Japonés', 'Hamburguesas', 'Postres'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs font-medium transition-colors cursor-pointer ${
                category === cat ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <h2 className="text-lg font-bold text-gray-900 mb-4">Los favoritos de hoy ({searchResults.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {searchResults.map((item: any) => (
            <div key={item.id} className="relative group">
              <CardItem
                {...item}
                onAddToCart={() => handleAddToCart(item)}
              />
              <button
                onClick={() => toggleFavorite(item.id)}
                className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-transform active:scale-95 cursor-pointer ${
                  favoriteIds.includes(item.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white/80 text-gray-600 hover:text-red-500'
                }`}
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );

  // VISTA MIS PEDIDOS
  const MyOrdersView = (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto justify-between">
      <div className="p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Package className="text-[#e0533c]" /> Mis Pedidos Realizados
        </h1>

        {!user ? (
          <div className="bg-white p-8 rounded-3xl border border-gray-100 text-center max-w-md mx-auto space-y-4">
            <p className="text-xs text-gray-500">Inicia sesión para consultar tus pedidos en tiempo real.</p>
            <button
              onClick={() => setShowAuthModal(true)}
              className="bg-[#e0533c] text-white px-6 py-2.5 rounded-full text-xs font-bold cursor-pointer"
            >
              Iniciar Sesión
            </button>
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mb-8">
            {ordersList.filter((o) => o.userEmail === user.email).length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center space-y-3">
                <ShoppingBag className="w-10 h-10 text-gray-300 mx-auto" />
                <p className="text-sm font-bold text-gray-800">Aún no has realizado pedidos</p>
                <p className="text-xs text-gray-400">Agrega productos al carrito y completa tu primer pedido.</p>
              </div>
            ) : (
              ordersList
                .filter((o) => o.userEmail === user.email)
                .map((ord) => (
                  <div key={ord.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-base text-gray-900">{ord.id}</span>
                        <span className="text-xs text-gray-400">• {ord.date}</span>
                      </div>
                      <p className="text-xs text-gray-600">{ord.items}</p>
                      <p className="text-sm font-bold text-emerald-600 mt-2">{formatCOP(ord.total)}</p>
                      {ord.driverAssigned && (
                        <p className="text-xs text-indigo-600 font-medium">🛵 Repartidor: {ord.driverAssigned}</p>
                      )}
                    </div>
                    <div className="text-right space-y-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                          ord.status === 'En camino'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {ord.status}
                      </span>
                      <button
                        onClick={() => setActiveTab('tracking')}
                        className="block text-xs text-[#e0533c] font-bold hover:underline cursor-pointer"
                      >
                        Ver mapa →
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        )}
      </div>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );

  // VISTA FAVORITOS
  const FavoritesView = (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto justify-between">
      <div className="p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Heart className="text-red-500 fill-current" /> Mis Favoritos Guardados
        </h1>

        {SAMPLE_PRODUCTS.filter((p) => favoriteIds.includes(p.id)).length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border border-gray-100 text-center max-w-md mx-auto space-y-3 mb-8">
            <Heart className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-bold text-gray-800">No tienes favoritos aún</p>
            <p className="text-xs text-gray-400">Presiona el ícono de corazón en los productos para guardarlos aquí.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {SAMPLE_PRODUCTS.filter((p) => favoriteIds.includes(p.id)).map((item) => (
              <div key={item.id} className="relative group">
                <CardItem
                  {...item}
                  onAddToCart={() => handleAddToCart(item)}
                />
                <button
                  onClick={() => toggleFavorite(item.id)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-red-500 text-white backdrop-blur-md transition-transform active:scale-95 cursor-pointer"
                >
                  <Heart className="w-4 h-4 fill-current" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );

  // VISTA RASTREO CON MAPA Y RUTAS
  const TrackingView = (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto justify-between">
      <div className="p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Bike className="text-[#e0533c]" /> Rastreando Ruta de Entrega en Cali, Colombia
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    • Trazado Geográfico sobre OpenStreetMap
                  </span>
                  <h3 className="text-base font-bold text-gray-900 mt-2">
                    Trayecto Principal: Granada ➔ Calle 5ta ➔ UAO
                  </h3>
                </div>
              </div>

              <DeliveryMap distance={shortestRoute.distance} />
            </div>

            <div className="bg-[#0b1d16] text-emerald-100 p-6 rounded-3xl relative overflow-hidden shadow-2xl border border-emerald-900/60">
              <h3 className="font-bold text-base text-white mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Análisis del Algoritmo de Grafo (Dijkstra)
              </h3>

              <div className="space-y-4">
                <div className="bg-[#132c22] p-4 rounded-2xl border border-emerald-500/40 relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-wider text-emerald-300 uppercase bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
                      ✓ Ruta Óptima por Calle 5ta (Más rápida)
                    </span>
                    <span className="font-bold text-amber-400 text-sm">{Number(shortestRoute.distance).toFixed(1)} Km</span>
                  </div>
                  <p className="text-xs text-gray-200 leading-relaxed">
                    <strong className="text-emerald-400">Puntos recorridos: </strong>
                    {shortestRoute.path.join(' ➔ ')}
                  </p>
                </div>

                <div className="bg-[#10221a] p-4 rounded-2xl border border-emerald-900/40 opacity-80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase bg-black/30 px-2.5 py-1 rounded-full border border-gray-800">
                      Ruta Alternativa (Autopista Simón Bolívar)
                    </span>
                    <span className="font-semibold text-gray-400 text-sm">{alternativeRoute.distance} Km</span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    <strong className="text-gray-300">Puntos recorridos: </strong>
                    {alternativeRoute.path.join(' ➔ ')}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
              <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" /> Historial de Estados (Pila / Stack)
              </h3>
              <div className="space-y-3">
                {statusStack.getItems().map((st, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-xs text-gray-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>{st}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 flex flex-col h-[520px] shadow-xs">
            <h3 className="font-bold text-gray-900 text-sm mb-4 border-b pb-3">Chat con Repartidor en Cali</h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl text-xs max-w-[85%] ${
                    msg.startsWith('Tú:') ? 'bg-[#e0533c] text-white ml-auto' : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {msg}
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Ej: Te espero en la portería de la UAO..."
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                className="flex-1 bg-gray-100 px-4 py-2.5 rounded-full text-xs outline-none"
              />
              <button type="submit" className="bg-gray-900 text-white p-2.5 rounded-full hover:bg-gray-800 cursor-pointer">
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );

  // VISTA ADMIN COMPLETA
  const AdminView = (
    <div className="flex-1 flex flex-col h-screen overflow-y-auto justify-between">
      <div className="p-8">
        <h1 className="text-xl font-bold text-gray-900 mb-6">Panel Exclusivo de Administración</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Clock className="text-amber-500" /> Cola de Pedidos Global (Queue)
              </h3>
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-bold">
                {ordersList.length} en espera
              </span>
            </div>

            <div className="space-y-3">
              {ordersList.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">
                  No hay pedidos en la cola. Inicia sesión como usuario y realiza una compra.
                </p>
              ) : (
                ordersList.map((ord, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between text-xs border border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{ord.id} - {ord.client}</p>
                        <span className="text-[10px] bg-gray-200 text-gray-700 px-2 py-0.5 rounded-md font-semibold">
                          Posición {idx + 1}
                        </span>
                      </div>
                      <p className="text-gray-500 mt-0.5">{ord.items}</p>
                      <p className="font-semibold text-emerald-600 mt-1">{formatCOP(ord.total)}</p>
                      {ord.driverAssigned && (
                        <p className="text-[11px] text-indigo-600 font-bold mt-1">
                          🛵 Repartidor: {ord.driverAssigned}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                        ord.status === 'En camino'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                <Bike className="text-indigo-500" /> Repartidores Disponibles (Min Heap)
              </h3>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-full font-bold">
                Priorizado por distancia
              </span>
            </div>

            <div className="space-y-3">
              {driversList.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">
                  Todos los repartidores han sido asignados.
                </p>
              ) : (
                driversList.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl flex items-center justify-between text-xs border ${
                      idx === 0
                        ? 'bg-indigo-50/80 border-indigo-200 shadow-xs'
                        : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-900">{item.data.name} ({item.data.vehicle})</p>
                        {idx === 0 && (
                          <span className="bg-indigo-600 text-white text-[9px] px-2 py-0.5 rounded-full font-bold">
                            ★ Menor Distancia
                          </span>
                        )}
                      </div>
                      <p className="text-indigo-600 font-medium mt-0.5">Proximidad: {item.data.dist}</p>
                    </div>

                    <button
                      onClick={() => {
                        if (ordersList.length === 0) {
                          alert('Primero debe haber un pedido en la Cola (Queue) para poder asignarle repartidor.');
                          return;
                        }
                        setSelectedDriverToAssign(item);
                        setSelectedOrderId(ordersList[0]?.id || '');
                      }}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                        idx === 0
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      Asignar
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {selectedDriverToAssign && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full relative shadow-2xl space-y-4">
              <button
                onClick={() => setSelectedDriverToAssign(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-bold text-lg text-gray-900">Asignar Repartidor a Pedido</h3>
              <p className="text-xs text-gray-500">
                Se extraerá a <strong>{selectedDriverToAssign.data.name}</strong> ({selectedDriverToAssign.data.dist}) del Min Heap y se asignará al pedido seleccionado de la Cola.
              </p>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Selecciona el Pedido Objetivo (Queue):</label>
                <select
                  value={selectedOrderId}
                  onChange={(e) => setSelectedOrderId(e.target.value)}
                  className="w-full bg-gray-100 p-3 rounded-xl text-xs outline-none border border-gray-200 font-medium"
                >
                  {ordersList.map((ord) => (
                    <option key={ord.id} value={ord.id}>
                      {ord.id} - {ord.client} ({formatCOP(ord.total)}) [{ord.status}]
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleConfirmAssignment}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-2xl text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" /> Confirmar Asignación en Tiempo Real
              </button>
            </div>
          </div>
        )}
      </div>

      <Footer setActiveTab={setActiveTab} />
    </div>
  );

  return (
    <div className="flex h-screen bg-[#faf9f6] font-sans relative overflow-hidden">
      <Menu activeTab={activeTab} setActiveTab={setActiveTab} />

      <AppRoutes
        activeTab={activeTab}
        HomeView={HomeView}
        TrackingView={TrackingView}
        AdminView={AdminView}
        MyOrdersView={MyOrdersView}
        FavoritesView={FavoritesView}
      />

      {user?.role !== 'admin' && (
        <>
          {!isCartOpen && isAuthenticated && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="fixed bottom-6 right-6 bg-[#e0533c] text-white p-4 rounded-full shadow-2xl flex items-center gap-2 z-40 hover:bg-[#c8432d] cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="font-bold text-xs">{totalCartCount}</span>
            </button>
          )}

          {isCartOpen && (
            <aside className="w-80 bg-white border-l border-gray-100 p-6 flex flex-col justify-between h-screen sticky top-0 z-30 transition-all">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TU PEDIDO</span>
                    <h2 className="text-xl font-bold text-gray-900">La cesta</h2>
                  </div>
                  <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-gray-600 cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
                  {cart.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-8">Tu cesta está vacía</p>
                  ) : (
                    cart.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img src={item.image} alt={item.title} className="w-12 h-12 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-gray-900 truncate">{item.title}</p>
                          <p className="text-xs text-gray-500">{formatCOP(item.price)}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
                            >
                              <Minus className="w-3 h-3 text-gray-600" />
                            </button>
                            <span className="text-xs font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 rounded bg-gray-100 hover:bg-gray-200 cursor-pointer"
                            >
                              <Plus className="w-3 h-3 text-gray-600" />
                            </button>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 p-1 cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Subtotal</span>
                  <span>{formatCOP(total)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Envío</span>
                  <span className="text-emerald-600 font-bold">Gratis</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t">
                  <span>Total</span>
                  <span>{formatCOP(total)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cart.length === 0}
                  className="w-full bg-[#e0533c] hover:bg-[#c8432d] disabled:bg-gray-200 text-white font-bold py-3 px-4 rounded-2xl text-xs flex items-center justify-between transition-colors mt-2 cursor-pointer"
                >
                  <span>Pedir ahora</span>
                  <span>{formatCOP(total)} →</span>
                </button>
              </div>
            </aside>
          )}
        </>
      )}

      {/* Modal Auth */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {isRegisterMode ? 'Crear Cuenta' : 'Iniciar Sesión'}
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Ingresa tus datos o usa Admin: <strong>admin@miga.com</strong> / <strong>admin123</strong>
            </p>

            {authError && <div className="bg-red-50 text-red-600 text-xs p-3 rounded-xl mb-4">{authError}</div>}

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {isRegisterMode && (
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={authName}
                  onChange={(e) => setAuthName(e.target.value)}
                  className="w-full bg-gray-100 px-4 py-2.5 rounded-xl text-xs outline-none"
                />
              )}
              <input
                type="email"
                placeholder="Correo electrónico"
                value={authEmail}
                onChange={(e) => setAuthEmail(e.target.value)}
                className="w-full bg-gray-100 px-4 py-2.5 rounded-xl text-xs outline-none"
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={authPass}
                onChange={(e) => setAuthPass(e.target.value)}
                className="w-full bg-gray-100 px-4 py-2.5 rounded-xl text-xs outline-none"
              />

              <button
                type="submit"
                className="w-full bg-gray-900 text-white font-bold py-2.5 rounded-xl text-xs hover:bg-gray-800 transition-colors mt-2 cursor-pointer"
              >
                {isRegisterMode ? 'Registrarse' : 'Ingresar'}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsRegisterMode(!isRegisterMode);
                  setAuthError('');
                }}
                className="text-xs text-[#e0533c] hover:underline font-semibold cursor-pointer"
              >
                {isRegisterMode ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmación */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center relative shadow-2xl">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-2">¡Pedido Realizado!</h2>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              Tu pedido ha sido enviado con éxito a la cocina. Puedes seguir el recorrido en tiempo real.
            </p>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                setActiveTab('orders');
              }}
              className="w-full bg-[#e0533c] text-white font-bold py-3 rounded-2xl text-xs hover:bg-[#c8432d] transition-colors shadow-md cursor-pointer"
            >
              Ver mis pedidos →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MainApp />
      </CartProvider>
    </AuthProvider>
  );
}