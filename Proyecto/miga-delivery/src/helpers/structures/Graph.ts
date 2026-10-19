export class Graph {
  private adjacencyList: Map<string, { node: string; weight: number }[]> = new Map();

  addVertex(vertex: string): void {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
  }

  addEdge(vertex1: string, vertex2: string, weight: number): void {
    this.addVertex(vertex1);
    this.addVertex(vertex2);
    this.adjacencyList.get(vertex1)?.push({ node: vertex2, weight });
    this.adjacencyList.get(vertex2)?.push({ node: vertex1, weight });
  }

  getShortestPath(startNode: string, endNode: string) {
    const distances: { [key: string]: number } = {};
    const previous: { [key: string]: string | null } = {};
    const unvisited = new Set<string>();

    this.adjacencyList.forEach((_, vertex) => {
      distances[vertex] = Infinity;
      previous[vertex] = null;
      unvisited.add(vertex);
    });

    distances[startNode] = 0;

    while (unvisited.size > 0) {
      let current: string | null = null;
      unvisited.forEach((vertex) => {
        if (current === null || distances[vertex] < distances[current]) {
          current = vertex;
        }
      });

      if (!current || distances[current] === Infinity) break;
      if (current === endNode) break;

      unvisited.delete(current);

      const neighbors = this.adjacencyList.get(current) || [];
      for (const neighbor of neighbors) {
        if (unvisited.has(neighbor.node)) {
          const alt = distances[current] + neighbor.weight;
          if (alt < distances[neighbor.node]) {
            distances[neighbor.node] = alt;
            previous[neighbor.node] = current;
          }
        }
      }
    }

    const path: string[] = [];
    let curr: string | null = endNode;
    while (curr) {
      path.unshift(curr);
      curr = previous[curr];
    }

    return { distance: distances[endNode], path };
  }
}