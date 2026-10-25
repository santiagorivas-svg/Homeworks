// NTree.js
export class Node {
  constructor(value) {
    this.value = value;
    this.children = []; // Para un árbol N-ario
  }
}

export class NTree {
  constructor() {
    this.root = null;
  }

  // Insertar un nuevo nodo
  insert(value, parentValue = null) {
    const newNode = new Node(value);
    if (!this.root) {
      this.root = newNode;
      return true;
    }

    if (!parentValue) {
      this.root.children.push(newNode);
      return true;
    }

    const parentNode = this.searchNode(this.root, parentValue);
    if (parentNode) {
      parentNode.children.push(newNode);
      return true;
    }
    return false;
  }

  // Requerimiento 2: Función para verificar si un valor existe en el árbol
  contains(value, node = this.root) {
    if (!node) return false;
    if (node.value === value) return true;

    for (let child of node.children) {
      if (this.contains(value, child)) return true;
    }
    return false;
  }

  searchNode(node, value) {
    if (!node) return null;
    if (node.value === value) return node;

    for (let child of node.children) {
      const found = this.searchNode(child, value);
      if (found) return found;
    }
    return null;
  }

  // Requerimiento 1: Recorridos
  // Preorder: Raíz -> Hijos
  preorder(node = this.root, result = []) {
    if (!node) return result;
    result.push(node.value);
    for (let child of node.children) {
      this.preorder(child, result);
    }
    return result;
  }

  // Postorder: Hijos -> Raíz
  postorder(node = this.root, result = []) {
    if (!node) return result;
    for (let child of node.children) {
      this.postorder(child, result);
    }
    result.push(node.value);
    return result;
  }

  // Inorder (Adaptado para N-ario: Primer hijo -> Raíz -> Resto de hijos)
  inorder(node = this.root, result = []) {
    if (!node) return result;
    if (node.children.length > 0) {
      this.inorder(node.children[0], result);
    }
    result.push(node.value);
    for (let i = 1; i < node.children.length; i++) {
      this.inorder(node.children[i], result);
    }
    return result;
  }

  // Formateador para convertir la estructura a la requerida por react-d3-tree ({ name, children })
  toD3Format(node = this.root) {
    if (!node) return null;
    return {
      name: String(node.value),
      children: node.children.map(child => this.toD3Format(child))
    };
  }
}