export interface HeapItem {
  priority: number
  data: any
}

export class MinHeap {
  private heap: HeapItem[] = []

  insert(priority: number, data: any): void {
    this.heap.push({ priority, data })
    this.bubbleUp(this.heap.length - 1)
  }

  extractMin(): HeapItem | null {
    if (this.heap.length === 0) return null
    if (this.heap.length === 1) return this.heap.pop()!
    const min = this.heap[0]
    this.heap[0] = this.heap.pop()!
    this.sinkDown(0)
    return min
  }

  private bubbleUp(index: number): void {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2)
      if (this.heap[index].priority >= this.heap[parentIndex].priority) break
      ;[this.heap[index], this.heap[parentIndex]] = [
        this.heap[parentIndex],
        this.heap[index],
      ]
      index = parentIndex
    }
  }

  private sinkDown(index: number): void {
    const length = this.heap.length
    while (true) {
      let smallest = index
      const left = 2 * index + 1
      const right = 2 * index + 2

      if (
        left < length &&
        this.heap[left].priority < this.heap[smallest].priority
      ) {
        smallest = left
      }
      if (
        right < length &&
        this.heap[right].priority < this.heap[smallest].priority
      ) {
        smallest = right
      }
      if (smallest === index) break
      ;[this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ]
      index = smallest
    }
  }

  getItems(): HeapItem[] {
    return [...this.heap]
  }
}
