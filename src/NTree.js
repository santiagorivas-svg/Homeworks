// src/NTree.js
export class Node {
  constructor(data) {
    this.data = data; // Objeto con { title, link, component }
    this.children = [];
  }
}

export class NTree {
  constructor() {
    this.root = null;
  }

  insert(data, parentTitle = null) {
    const newNode = new Node(data);

    if (!this.root) {
      this.root = newNode;
      return true;
    }

    if (!parentTitle) {
      this.root.children.push(newNode);
      return true;
    }

    const parentNode = this.searchNode(this.root, parentTitle);
    if (parentNode) {
      parentNode.children.push(newNode);
      return true;
    }

    return false;
  }

  searchNode(node, title) {
    if (!node) return null;
    if (node.data.title === title) return node;

    for (let child of node.children) {
      const found = this.searchNode(child, title);
      if (found) return found;
    }
    return null;
  }
}