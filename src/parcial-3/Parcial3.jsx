import { useState } from 'react';
import { Trie } from './structures/Trie';
import { MaxHeap } from './structures/MaxHeap';
import { Graph } from './structures/Graph';
import './styles/parcial3.scss';

const INITIAL_SONGS = [
  { id: 1, title: 'Algoritmos en Acción', artist: 'Code Beats', category: 'Programación', plays: 340 },
  { id: 2, title: 'Álgebra Lineal Lo-Fi', artist: 'MathChill', category: 'Matemáticas', plays: 510 },
  { id: 3, title: 'Árboles y Grafos', artist: 'Data Synth', category: 'Estructuras', plays: 420 },
  { id: 4, title: 'Cálculo Diferencial Chill', artist: 'MathChill', category: 'Matemáticas', plays: 290 },
  { id: 5, title: 'Complejidad Big O', artist: 'Code Beats', category: 'Programación', plays: 615 },
  { id: 6, title: 'Historia de la Computación', artist: 'EduCast', category: 'Historia', plays: 180 },
];

function createInitialStructures() {
  const trie = new Trie();
  const heap = new MaxHeap();
  const graph = new Graph();

  INITIAL_SONGS.forEach((song) => {
    trie.insert(song);
    heap.insert({ ...song });
    graph.addSong(song);
  });

  // Conexiones no dirigidas entre canciones educativas similares
  graph.addRelation(1, 3);
  graph.addRelation(1, 5);
  graph.addRelation(3, 5);
  graph.addRelation(2, 4);
  graph.addRelation(5, 6);

  return { trie, heap, graph };
}

export default function Parcial3() {
  const [{ trie, heap, graph }] = useState(createInitialStructures);

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState(INITIAL_SONGS);
  const [exactCheckMessage, setExactCheckMessage] = useState('');
  const [topSongs, setTopSongs] = useState(() => heap.getTopSongs(5));
  const [selectedSong, setSelectedSong] = useState(INITIAL_SONGS[0]);
  const [recommendations, setRecommendations] = useState(() =>
    graph.getRecommendations(INITIAL_SONGS[0].id)
  );

  // Estados para insertar nueva canción
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [nextId, setNextId] = useState(INITIAL_SONGS.length + 1);

  // Autocompletado por prefijo en el Trie
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setExactCheckMessage('');
    setSuggestions(trie.autocomplete(value));
  };

  // Verificar si una canción exacta existe en el Trie
  const handleExactCheck = () => {
    if (!query.trim()) return;
    const exists = trie.search(query.trim());
    setExactCheckMessage(
      exists
        ? `La canción "${query}" SÍ existe en el catálogo.`
        : `La canción "${query}" NO está registrada.`
    );
  };

  // Seleccionar canción para ver vecinos en el Grafo
  const handleSelectSong = (song) => {
    setSelectedSong(song);
    setRecommendations(graph.getRecommendations(song.id));
  };

  // Reproducir canción: incrementa reproducciones y reordena el Max Heap
  const handlePlaySong = (e, song) => {
    e.stopPropagation();
    heap.incrementPlays(song.id);
    setTopSongs(heap.getTopSongs(5));
    setSuggestions(trie.autocomplete(query));
    handleSelectSong(song);
  };

  // Insertar nueva canción en las 3 estructuras
  const handleAddSong = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newArtist.trim()) return;

    const newSong = {
      id: nextId,
      title: newTitle.trim(),
      artist: newArtist.trim(),
      category: 'Educativa',
      plays: 100,
    };

    trie.insert(newSong);
    heap.insert({ ...newSong });
    graph.addSong(newSong);

    if (selectedSong) {
      graph.addRelation(newSong.id, selectedSong.id);
    }

    setNextId((prev) => prev + 1);
    setNewTitle('');
    setNewArtist('');
    setSuggestions(trie.autocomplete(query));
    setTopSongs(heap.getTopSongs(5));
    if (selectedSong) {
      setRecommendations(graph.getRecommendations(selectedSong.id));
    }
  };

  return (
    <div className="spotify-edu-dashboard">
      <header className="spotify-edu-dashboard__header">
        <div>
          <h1>
            Spotify <span>Edu</span> — Panel de Música Educativa
          </h1>
          <p>Buscador Trie • Ranking Max Heap • Recomendaciones con Grafo No Dirigido</p>
        </div>
      </header>

      <main className="spotify-edu-dashboard__grid">
        {/* 1. BUSCADOR PREDICTIVO (TRIE) */}
        <section className="panel-card">
          <h2>
            Buscador Predictivo <small>Trie</small>
          </h2>

          <div className="search-controls">
            <input
              type="text"
              placeholder="Escribe un prefijo (ej. Alg, Álb, Cál)..."
              value={query}
              onChange={handleSearchChange}
            />
            <div className="search-controls__actions">
              <button type="button" className="btn-secondary" onClick={handleExactCheck}>
                ¿Existe título exacto?
              </button>
            </div>
            {exactCheckMessage && <div className="status-badge">{exactCheckMessage}</div>}
          </div>

          <ul className="song-list">
            {suggestions.length === 0 ? (
              <li>No hay sugerencias para "{query}"</li>
            ) : (
              suggestions.map((song) => (
                <li
                  key={song.id}
                  className={selectedSong?.id === song.id ? 'active' : ''}
                  onClick={() => handleSelectSong(song)}
                >
                  <div className="song-info">
                    <strong>{song.title}</strong>
                    <span>{song.artist}</span>
                  </div>
                  <div className="song-meta">
                    <span className="plays">{song.plays} plays</span>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={(e) => handlePlaySong(e, song)}
                    >
                      ▶
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>

          <form className="add-form" onSubmit={handleAddSong}>
            <input
              type="text"
              placeholder="Nueva canción..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Artista..."
              value={newArtist}
              onChange={(e) => setNewArtist(e.target.value)}
            />
            <button type="submit" className="btn-primary">
              + Insertar
            </button>
          </form>
        </section>

        {/* 2. RANKING DE POPULARIDAD (MAX HEAP) */}
        <section className="panel-card">
          <h2>
            TOP Canciones Populares <small>Max Heap</small>
          </h2>

          <ul className="song-list">
            {topSongs.map((song, index) => (
              <li
                key={song.id}
                className={selectedSong?.id === song.id ? 'active' : ''}
                onClick={() => handleSelectSong(song)}
              >
                <div className="song-info">
                  <strong>
                    #{index + 1} — {song.title}
                  </strong>
                  <span>{song.artist}</span>
                </div>
                <div className="song-meta">
                  <span className="plays">{song.plays} reprod.</span>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={(e) => handlePlaySong(e, song)}
                  >
                    +1 Play
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* 3. RECOMENDACIONES RELACIONADAS (GRAFO NO DIRIGIDO) */}
        <section className="panel-card">
          <h2>
            Canciones Relacionadas <small>Grafo No Dirigido</small>
          </h2>

          {selectedSong ? (
            <>
              <div className="status-badge">
                Similares a: <strong>{selectedSong.title}</strong>
              </div>
              <ul className="song-list">
                {recommendations.length === 0 ? (
                  <li>Esta canción aún no tiene conexiones en el grafo.</li>
                ) : (
                  recommendations.map((rec) => (
                    <li key={rec.id} onClick={() => handleSelectSong(rec)}>
                      <div className="song-info">
                        <strong>{rec.title}</strong>
                        <span>
                          {rec.artist} • {rec.category}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="btn-primary"
                        onClick={(e) => handlePlaySong(e, rec)}
                      >
                        ▶
                      </button>
                    </li>
                  ))
                )}
              </ul>
            </>
          ) : (
            <p>Selecciona una canción para ver sus nodos adyacentes.</p>
          )}
        </section>
      </main>
    </div>
  );
}