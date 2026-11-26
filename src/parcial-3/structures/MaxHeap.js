export class MaxHeap {
  constructor() {
    this.heap = [];
  }

  getParentIndex(i) {
    return Math.floor((i - 1) / 2);
  }

  getLeftChildIndex(i) {
    return 2 * i + 1;
  }

  getRightChildIndex(i) {
    return 2 * i + 2;
  }

  swap(i1, i2) {
    [this.heap[i1], this.heap[i2]] = [this.heap[i2], this.heap[i1]];
  }

  // Insertar canción y reordenar hacia arriba
  insert(song) {
    this.heap.push(song);
    this.heapifyUp();
  }

  heapifyUp() {
    let index = this.heap.length - 1;
    while (
      index > 0 &&
      this.heap[this.getParentIndex(index)].plays < this.heap[index].plays
    ) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }

  // Extraer el máximo (la canción #1)
  extractMax() {
    if (this.heap.length === 0) return null;
    if (this.heap.length === 1) return this.heap.pop();

    const max = this.heap[0];
    this.heap[0] = this.heap.pop();
    this.heapifyDown();
    return max;
  }

  heapifyDown() {
    let index = 0;
    while (this.getLeftChildIndex(index) < this.heap.length) {
      let largerChildIndex = this.getLeftChildIndex(index);
      const rightChildIndex = this.getRightChildIndex(index);

      if (
        rightChildIndex < this.heap.length &&
        this.heap[rightChildIndex].plays > this.heap[largerChildIndex].plays
      ) {
        largerChildIndex = rightChildIndex;
      }

      if (this.heap[index].plays >= this.heap[largerChildIndex].plays) {
        break;
      }

      this.swap(index, largerChildIndex);
      index = largerChildIndex;
    }
  }

  // Obtener el TOP N sin destruir el heap original
  getTopSongs(n = 5) {
    const tempHeap = new MaxHeap();
    tempHeap.heap = [...this.heap];

    const top = [];
    for (let i = 0; i < n && tempHeap.heap.length > 0; i++) {
      top.push(tempHeap.extractMax());
    }
    return top;
  }

  // Actualizar reproducciones cuando el usuario escucha una canción
  incrementPlays(songId) {
    const index = this.heap.findIndex((s) => s.id === songId);
    if (index !== -1) {
      this.heap[index].plays += 1;
      this.heapifyUpFrom(index);
    }
  }

  heapifyUpFrom(startIndex) {
    let index = startIndex;
    while (
      index > 0 &&
      this.heap[this.getParentIndex(index)].plays < this.heap[index].plays
    ) {
      this.swap(this.getParentIndex(index), index);
      index = this.getParentIndex(index);
    }
  }
}