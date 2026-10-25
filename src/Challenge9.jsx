import { useState, useMemo } from 'react';
import { NTree } from './NTree';
import { Home, Messages, Account, Profile, Security, FAQs } from './MenuComponents';

// Componente recursivo para renderizar los items y sus submenús
function MenuItem({ node, onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;

  const handleClick = (e) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
    if (node.data.component) {
      onSelect(node.data);
    }
  };

  return (
    <li style={{ listStyle: 'none', margin: '4px 0' }}>
      <div 
        onClick={handleClick}
        style={{
          padding: '8px 12px',
          cursor: 'pointer',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#2d3748',
          color: '#fff',
          userSelect: 'none'
        }}
      >
        <span>{node.data.title}</span>
        {hasChildren && <span>{isOpen ? '▲' : '▼'}</span>}
      </div>

      {hasChildren && isOpen && (
        <ul style={{ paddingLeft: '16px', margin: '4px 0 0 0' }}>
          {node.children.map((child, index) => (
            <MenuItem key={index} node={child} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Challenge9() {
  const [activeItem, setActiveItem] = useState(null);

  // Poblar el árbol N-ario con menús y submenús (Requerimiento 2)
  const menuTree = useMemo(() => {
    const tree = new NTree();

    // Menú Raíz / Principal
    tree.insert({ title: 'Dashboard', link: '/dashboard', component: Home });

    // Opciones principales y submenús
    tree.insert({ title: 'Messages', link: '/messages', component: Messages }, 'Dashboard');
    
    // Submenú Settings
    tree.insert({ title: 'Settings', link: '/settings', component: null }, 'Dashboard');
    tree.insert({ title: 'Account', link: '/settings/account', component: Account }, 'Settings');
    tree.insert({ title: 'Profile', link: '/settings/profile', component: Profile }, 'Settings');
    tree.insert({ title: 'Security & Privacy', link: '/settings/security', component: Security }, 'Settings');

    // Submenú Help
    tree.insert({ title: 'Help', link: '/help', component: null }, 'Dashboard');
    tree.insert({ title: 'FAQs', link: '/help/faqs', component: FAQs }, 'Help');

    return tree;
  }, []);

  const ActiveComponent = activeItem?.component || Home;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      {/* Sidebar (Requerimiento 3) */}
      <aside style={{ width: '260px', backgroundColor: '#1a202c', color: '#fff', padding: '16px' }}>
        <h3 style={{ borderBottom: '1px solid #4a5568', paddingBottom: '12px' }}>Menú Navegación</h3>
        <ul style={{ padding: 0, margin: 0 }}>
          {menuTree.root && <MenuItem node={menuTree.root} onSelect={setActiveItem} />}
        </ul>
      </aside>

      {/* Área de Contenido Principal */}
      <main style={{ flex: 1, padding: '24px', backgroundColor: '#f7fafc' }}>
        <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <ActiveComponent />
          {activeItem && <p><small>Ruta actual: <code>{activeItem.link}</code></small></p>}
        </div>
      </main>
    </div>
  );
}