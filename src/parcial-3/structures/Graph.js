export class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  // Agregar canción (vértice)
  addSong(song) {
    if (!this.adjacencyList.has(song.id)) {
      this.adjacencyList.set(song.id, {
        song,
        neighbors: [],
      });
    }
  }

  // Conectar dos canciones similares (arista no dirigida)
  addRelation(songId1, songId2) {
    if (
      !this.adjacencyList.has(songId1) ||
      !this.adjacencyList.has(songId2)
    ) {
      return;
    }

    const node1 = this.adjacencyList.get(songId1);
    const node2 = this.adjacencyList.get(songId2);

    if (!node1.neighbors.some((s) => s.id === songId2)) {
      node1.neighbors.push(node2.song);
    }
    if (!node2.neighbors.some((s) => s.id === songId1)) {
      node2.neighbors.push(node1.song);
    }
  }

  // Obtener recomendaciones (vecinos directos)
  getRecommendations(songId) {
    if (!this.adjacencyList.has(songId)) return [];
    return this.adjacencyList.get(songId).neighbors;
  }
}