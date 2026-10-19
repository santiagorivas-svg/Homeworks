class TrieNode {
  children: { [key: string]: TrieNode } = {}
  isEndOfWord: boolean = false
  data: any = null
}

export class Trie {
  root: TrieNode = new TrieNode()

  insert(word: string, data: any = null): void {
    let current = this.root
    const lowerWord = word.toLowerCase()
    for (const char of lowerWord) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode()
      }
      current = current.children[char]
    }
    current.isEndOfWord = true
    current.data = data
  }

  searchPrefix(prefix: string): any[] {
    let current = this.root
    const lowerPrefix = prefix.toLowerCase()
    for (const char of lowerPrefix) {
      if (!current.children[char]) return []
      current = current.children[char]
    }
    return this.collectAllWords(current)
  }

  private collectAllWords(node: TrieNode, results: any[] = []): any[] {
    if (node.isEndOfWord) results.push(node.data)
    for (const child in node.children) {
      this.collectAllWords(node.children[child], results)
    }
    return results
  }
}
