class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.songData = null;
  }
}

export class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // Insertar una canción (objeto { id, title, artist, plays })
  insert(song) {
    let current = this.root;
    const word = song.title.toLowerCase();

    for (const char of word) {
      if (!current.children[char]) {
        current.children[char] = new TrieNode();
      }
      current = current.children[char];
    }
    current.isEndOfWord = true;
    current.songData = song;
  }

  // Buscar si una canción exacta existe
  search(title) {
    let current = this.root;
    const word = title.toLowerCase();

    for (const char of word) {
      if (!current.children[char]) return false;
      current = current.children[char];
    }
    return current.isEndOfWord;
  }

  // Mostrar sugerencias por prefijo
  autocomplete(prefix) {
    let current = this.root;
    const lowerPrefix = prefix.toLowerCase();

    for (const char of lowerPrefix) {
      if (!current.children[char]) return [];
      current = current.children[char];
    }

    const suggestions = [];
    this._collectAllWords(current, suggestions);
    return suggestions;
  }

  _collectAllWords(node, suggestions) {
    if (node.isEndOfWord && node.songData) {
      suggestions.push(node.songData);
    }
    for (const char in node.children) {
      this._collectAllWords(node.children[char], suggestions);
    }
  }
}