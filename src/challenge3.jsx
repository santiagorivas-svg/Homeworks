import { useState } from 'react';

// ==========================================
// 1. ESTRUCTURA: LISTA SIMPLEMENTE ENLAZADA
// ==========================================
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  size() {
    return this.length;
  }

  remove(value) {
    if (!this.head) return null;

    if (this.head.value === value) {
      this.head = this.head.next;
      if (!this.head) this.tail = null;
      this.length--;
      return;
    }

    let current = this.head;
    while (current.next && current.next.value !== value) {
      current = current.next;
    }

    if (current.next) {
      current.next = current.next.next;
      if (!current.next) this.tail = current;
      this.length--;
    }
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}

// ==========================================
// 2. ESTRUCTURA: LISTA DOBLEMENTE ENLAZADA
// ==========================================
class DoubleNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  append(value) {
    const newNode = new DoubleNode(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.length++;
      return;
    }

    this.tail.next = newNode;
    newNode.prev = this.tail;
    this.tail = newNode;
    this.length++;
  }

  size() {
    return this.length;
  }

  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}

// MOCK DATA
const MOCK_SONGS = [
  { id: 1, title: 'Bohemian Rhapsody', artist: 'Queen' },
  { id: 2, title: 'Hotel California', artist: 'Eagles' },
  { id: 3, title: 'Starboy', artist: 'The Weeknd' },
];

const MOCK_PAGES = [
  { id: 1, title: 'Google', url: 'https://google.com' },
  { id: 2, title: 'GitHub', url: 'https://github.com' },
  { id: 3, title: 'React Docs', url: 'https://react.dev' },
];

export default function Challenge3() {
  const [activeTab, setActiveTab] = useState('singly');

  // --- Singly LinkedList State ---
  const [musicList, setMusicList] = useState(() => {
    const list = new LinkedList();
    MOCK_SONGS.forEach((song) => list.append(song));
    return list;
  });

  // Asignación directa del valor inicial
  const [currentSongNode, setCurrentSongNode] = useState(() => musicList.head);

  const handleNextSong = () => {
    if (currentSongNode && currentSongNode.next) {
      setCurrentSongNode(currentSongNode.next);
    } else {
      setCurrentSongNode(musicList.head);
    }
  };

  const handleRemoveSong = (songObj) => {
    musicList.remove(songObj);
    if (currentSongNode && currentSongNode.value.id === songObj.id) {
      setCurrentSongNode(currentSongNode.next || musicList.head);
    }
    const newList = new LinkedList();
    musicList.toArray().forEach((s) => newList.append(s));
    setMusicList(newList);
  };

  // --- Doubly LinkedList State ---
  const [browserList] = useState(() => {
    const list = new DoublyLinkedList();
    MOCK_PAGES.forEach((page) => list.append(page));
    return list;
  });

  // Asignación directa del valor inicial
  const [currentPageNode, setCurrentPageNode] = useState(() => browserList.head);

  const handleGoBack = () => {
    if (currentPageNode && currentPageNode.prev) {
      setCurrentPageNode(currentPageNode.prev);
    }
  };

  const handleGoForward = () => {
    if (currentPageNode && currentPageNode.next) {
      setCurrentPageNode(currentPageNode.next);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#0f172a', color: '#fff', minHeight: '100vh' }}>
      <h1>Challenge 03 — Listas Enlazadas</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('singly')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
          1. Singly Linked List (Música)
        </button>
        <button onClick={() => setActiveTab('doubly')} style={{ padding: '10px 15px', cursor: 'pointer' }}>
          2. Doubly Linked List (Navegador)
        </button>
      </div>

      {activeTab === 'singly' && (
        <div style={{ border: '1px solid #334155', padding: '15px', borderRadius: '8px' }}>
          <h2>Reproductor de Música (Singly)</h2>
          <p>Reproduciendo: <strong>{currentSongNode ? currentSongNode.value.title : 'Fin de la lista'}</strong> - {currentSongNode?.value.artist}</p>
          <button onClick={handleNextSong} style={{ padding: '8px 12px', cursor: 'pointer' }}>Siguiente Canción ➔</button>

          <h3 style={{ marginTop: '20px' }}>Lista de Canciones:</h3>
          <ul>
            {musicList.toArray().map((song) => (
              <li key={song.id} style={{ marginBottom: '8px' }}>
                {song.title} - {song.artist}{' '}
                <button onClick={() => handleRemoveSong(song)} style={{ color: 'red', marginLeft: '10px' }}>Eliminar</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'doubly' && (
        <div style={{ border: '1px solid #334155', padding: '15px', borderRadius: '8px' }}>
          <h2>Historial del Navegador (Doubly)</h2>
          <div style={{ marginBottom: '15px' }}>
            <button onClick={handleGoBack} disabled={!currentPageNode?.prev} style={{ marginRight: '10px' }}>
              ◀ Atrás (prev)
            </button>
            <button onClick={handleGoForward} disabled={!currentPageNode?.next}>
              Adelante (next) ▶
            </button>
          </div>
          <p>Página actual: <strong>{currentPageNode ? currentPageNode.value.title : 'Nula'}</strong> ({currentPageNode?.value.url})</p>
        </div>
      )}
    </div>
  );
}