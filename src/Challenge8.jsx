import { useState, useMemo } from 'react';
import Tree from 'react-d3-tree';
import { NTree } from './NTree';

export default function Challenge8() {
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  // Inicializar el árbol y sus datos una sola vez con useMemo
  const { treeInstance, treeData } = useMemo(() => {
    const tree = new NTree();

    // 1. Insertar una serie de números
    tree.insert(10);        // Raíz
    tree.insert(5, 10);     // Hijo de 10
    tree.insert(15, 10);    // Hijo de 10
    tree.insert(3, 5);      // Hijo de 5
    tree.insert(7, 5);      // Hijo de 5
    tree.insert(12, 15);    // Hijo de 15

    // Imprimir recorridos en consola
    console.log("Inorder:", tree.inorder());
    console.log("Postorder:", tree.postorder());
    console.log("Preorder:", tree.preorder());

    return {
      treeInstance: tree,
      treeData: tree.toD3Format()
    };
  }, []);

  // 2. Función para buscar un valor
  const handleSearch = () => {
    if (!searchValue) return;
    const val = Number(searchValue);
    const exists = treeInstance.contains(val);
    setSearchResult(
      exists 
        ? `El valor ${val} SÍ existe en el árbol.` 
        : `El valor ${val} NO existe en el árbol.`
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Challenge 08 - Árboles</h2>

      {/* Búsqueda */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="number"
          placeholder="Ingrese un número"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
        <button onClick={handleSearch} style={{ marginLeft: '10px' }}>
          Buscar en el árbol
        </button>
        {searchResult && <p><strong>{searchResult}</strong></p>}
      </div>

      {/* 3. Visualización con react-d3-tree */}
      <div id="treeWrapper" style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}>
        {treeData && (
          <Tree 
            data={treeData} 
            orientation="vertical"
            pathFunc="step"
          />
        )}
      </div>
    </div>
  );
}