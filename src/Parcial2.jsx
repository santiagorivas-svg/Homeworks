import { useState, useEffect } from 'react';
import { NTree } from './NTree';

export default function Parcial2() {
  // 1. Estado de Autenticación
  const [user, setUser] = useState(null);
  const [emailInput, setEmailInput] = useState('');

  // 2. Estado del Árbol N-ario y nodo seleccionado
  const [tree, setTree] = useState(null);
  const [selectedFolderId, setSelectedFolderId] = useState('root');
  const [newItemName, setNewItemName] = useState('');
  const [isFolder, setIsFolder] = useState(true);

  // Cargar datos persistidos o inicializar
  useEffect(() => { 
    const savedTree = localStorage.getItem('parcial2_tree');
    if (savedTree) {
      const parsed = JSON.parse(savedTree);
      setTree(new NTree(parsed.root));
    } else {
      setTree(new NTree());
    }
  }, []);

  // Guardar en localStorage cada vez que cambie el árbol (Persistencia)
  const saveTree = (updatedTree) => {
    const newTreeInstance = new NTree(updatedTree.root);
    setTree(newTreeInstance);
    localStorage.setItem('parcial2_tree', JSON.stringify(newTreeInstance));
  };

  // Manejador de Login Mock
  const handleLogin = (e) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setUser({ email: emailInput.trim() });
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  // Crear Archivo o Carpeta
  const handleCreate = (e) => {
    e.preventDefault();

    // Validador de usuario registrado
    if (!user) {
      alert('Debes estar registrado/autenticado para crear archivos o carpetas.');
      return;
    }

    if (!newItemName.trim()) return;

    const result = tree.addNode(selectedFolderId, newItemName, isFolder, user.email);

    if (result.success) {
      saveTree(tree);
      setNewItemName('');
    } else {
      alert(result.message);
    }
  };

  // Renderizado recursivo del Árbol N-ario
  const renderTree = (node) => {
    const isSelected = selectedFolderId === node.id;

    return (
      <div key={node.id} style={{ marginLeft: '20px', marginTop: '6px' }}>
        <div
          onClick={() => node.isFolder && setSelectedFolderId(node.id)}
          style={{
            padding: '6px 10px',
            borderRadius: '4px',
            backgroundColor: isSelected ? '#374151' : '#1f2937',
            color: '#f3f4f6',
            cursor: node.isFolder ? 'pointer' : 'default',
            display: 'inline-block',
            border: isSelected ? '1px solid #60a5fa' : '1px solid #374151'
          }}
        >
          <span>{node.isFolder ? '📂 ' : '📄 '}</span>
          <strong>{node.name}</strong>
          <small style={{ marginLeft: '10px', color: '#9ca3af', fontSize: '11px' }}>
            (Creado por: {node.createdBy})
          </small>
        </div>

        {/* Solo las carpetas renderizan a sus hijos */}
        {node.isFolder && node.children && node.children.length > 0 && (
          <div style={{ borderLeft: '2px dotted #4b5563', marginLeft: '10px' }}>
            {node.children.map((child) => renderTree(child))}
          </div>
        )}
      </div>
    );
  };

  if (!tree) return <div>Cargando parcial...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h2>Parcial 2 - Gestión Jerárquica de Archivos y Carpetas</h2>

      {/* Seccion de Autenticacion */}
      <div style={{ background: '#2d3748', color: '#fff', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        {user ? (
          <div>
            <p>Usuario autenticado: <strong>{user.email}</strong></p>
            <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer' }}>Cerrar Sesión</button>
          </div>
        ) : (
          <form onSubmit={handleLogin} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="email"
              placeholder="Ingresa tu correo para ingresar"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              required
              style={{ padding: '8px', flex: 1 }}
            />
            <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>Iniciar Sesión</button>
          </form>
        )}
      </div>

      {/* Formulario de Creacion */}
      <div style={{ background: '#f7fafc', color: '#333', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Crear Nuevo Elemento</h3>
        <p>Carpeta Padre Seleccionada ID: <code>{selectedFolderId}</code></p>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="text"
            placeholder="Nombre del archivo o carpeta"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            style={{ padding: '8px' }}
          />
          <div>
            <label style={{ marginRight: '15px' }}>
              <input
                type="radio"
                checked={isFolder}
                onChange={() => setIsFolder(true)}
              /> Carpeta 📂
            </label>
            <label>
              <input
                type="radio"
                checked={!isFolder}
                onChange={() => setIsFolder(false)}
              /> Archivo 📄
            </label>
          </div>
          <button type="submit" style={{ padding: '8px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Crear Elemento
          </button>
        </form>
      </div>

      {/* Visualizacion del Arbol */}
      <div style={{ background: '#111827', padding: '20px', borderRadius: '8px' }}>
        <h3 style={{ color: '#fff' }}>Estructura del Árbol</h3>
        {renderTree(tree.root)}
      </div>
    </div>
  );
}