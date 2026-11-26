import { useState } from 'react';

// ==========================================
// 1. ESTRUCTURA DE DATOS: MAX HEAP
// ==========================================
class MaxHeap {
  constructor() {
    this.heap = [];
  }

  insert(item) {
    this.heap.push(item);
    this.bubbleUp();
  }

  bubbleUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].popularity <= this.heap[parentIndex].popularity) break;
      [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();
    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.sinkDown(0);
    return max;
  }

  sinkDown(index) {
    const length = this.heap.length;
    const element = this.heap[index];

    while (true) {
      let leftChildIdx = 2 * index + 1;
      let rightChildIdx = 2 * index + 2;
      let leftChild, rightChild;
      let swap = null;

      if (leftChildIdx < length) {
        leftChild = this.heap[leftChildIdx];
        if (leftChild.popularity > element.popularity) {
          swap = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        rightChild = this.heap[rightChildIdx];
        if (
          (swap === null && rightChild.popularity > element.popularity) ||
          (swap !== null && rightChild.popularity > leftChild.popularity)
        ) {
          swap = rightChildIdx;
        }
      }

      if (swap === null) break;
      this.heap[index] = this.heap[swap];
      this.heap[swap] = element;
      index = swap;
    }
  }
}

// ==========================================
// 2. ESTRUCTURA DE DATOS: TRIE (ÁRBOL PREFIJO)
// ==========================================
class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.popularity = 0;
    this.name = '';
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  insert(name, popularity) {
    let node = this.root;
    const cleanName = name.toLowerCase();

    for (let char of cleanName) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
    node.name = name;
    node.popularity = popularity;
  }

  // Busca todos los productos que comienzan con el prefijo dado
  findWordsByPrefix(prefix) {
    let node = this.root;
    const cleanPrefix = prefix.toLowerCase();

    for (let char of cleanPrefix) {
      if (!node.children[char]) return [];
      node = node.children[char];
    }

    const results = [];
    this._collectAllWords(node, results);
    return results;
  }

  _collectAllWords(node, results) {
    if (node.isEndOfWord) {
      results.push({ name: node.name, popularity: node.popularity });
    }
    for (let childKey in node.children) {
      this._collectAllWords(node.children[childKey], results);
    }
  }

  // 3. Método searchTopK combinando Trie + Heap (Requisito principal)
  searchTopK(prefix, k) {
    if (!prefix.trim()) return [];

    // 1. Obtener todas las coincidencias del Trie
    const matches = this.findWordsByPrefix(prefix);

    // 2. Insertar las coincidencias en el Max Heap
    const heap = new MaxHeap();
    for (let product of matches) {
      heap.insert(product);
    }

    // 3. Extraer los K elementos con mayor popularidad
    const topK = [];
    const count = Math.min(k, matches.length);
    for (let i = 0; i < count; i++) {
      topK.push(heap.extractMax());
    }

    return topK;
  }
}

// Inicializar el Trie con los datos de ejemplo
const searchEngine = new Trie();
searchEngine.insert('air max', 90);
searchEngine.insert('air force', 95);
searchEngine.insert('air jordan', 85);
searchEngine.insert('adidas boost', 80);
searchEngine.insert('air zoom', 92);
searchEngine.insert('adidas superstar', 88);

// ==========================================
// 4. COMPONENTE REACT DE INTERFAZ
// ==========================================
export const Challenge12 = () => {
  const [prefix, setPrefix] = useState('air');
  const [topK, setTopK] = useState(2);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPopularity, setNewProductPopularity] = useState('');

  // Realizar búsqueda usando Trie + Heap
  const searchResults = searchEngine.searchTopK(prefix, topK);

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (newProductName && newProductPopularity) {
      searchEngine.insert(newProductName, Number(newProductPopularity));
      setNewProductName('');
      setNewProductPopularity('');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
      <h2>Challenge 12: Motor de Búsqueda Inteligente (Trie + Heap)</h2>

      {/* Formulario para agregar productos al Trie */}
      <div style={{ background: '#f5f5f5', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Agregar nuevo producto al Trie</h3>
        <form onSubmit={handleAddProduct} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Nombre (ej: air pegasus)"
            value={newProductName}
            onChange={(e) => setNewProductName(e.target.value)}
            style={{ padding: '8px', flex: 1 }}
            required
          />
          <input
            type="number"
            placeholder="Popularidad (ej: 91)"
            value={newProductPopularity}
            onChange={(e) => setNewProductPopularity(e.target.value)}
            style={{ padding: '8px', width: '130px' }}
            required
          />
          <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>
            Insertar
          </button>
        </form>
      </div>

      {/* Buscador de Prefijo y Top K */}
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px' }}>
        <h3>Buscador por Prefijo</h3>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <div style={{ flex: 1 }}>
            <label>Prefijo de búsqueda: </label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              style={{ padding: '8px', width: '100%', marginTop: '5px' }}
              placeholder="Escribe 'air' o 'adidas'..."
            />
          </div>
          <div style={{ width: '100px' }}>
            <label>Top K: </label>
            <input
              type="number"
              min="1"
              max="10"
              value={topK}
              onChange={(e) => setTopK(Number(e.target.value))}
              style={{ padding: '8px', width: '100%', marginTop: '5px' }}
            />
          </div>
        </div>

        <h4>Resultados (Top {topK} más populares para "{prefix}"):</h4>
        {searchResults.length === 0 ? (
          <p style={{ color: '#888' }}>No se encontraron coincidencias.</p>
        ) : (
          <ol style={{ paddingLeft: '20px' }}>
            {searchResults.map((prod, index) => (
              <li key={index} style={{ marginBottom: '8px', fontSize: '16px' }}>
                <strong>{prod.name}</strong> — Popularidad: <span style={{ color: 'green' }}>{prod.popularity}</span>
              </li>
            ))}
          </ol>
        )}

        <div style={{ marginTop: '20px', background: '#eef6ff', padding: '10px', borderRadius: '5px' }}>
          <small>
            <strong>Estructuras utilizadas:</strong><br />
            • <strong>Trie:</strong> Filtra rápidamente las palabras que inician con "{prefix}".<br />
            • <strong>Max Heap:</strong> Ordena y extrae los {topK} resultados con mayor popularidad.
          </small>
        </div>
      </div>
    </div>
  );
};