export class TreeNode {
  constructor(id, name, isFolder, createdBy) {
    this.id = id;
    this.name = name;
    this.isFolder = isFolder; // true = carpeta, false = archivo
    this.createdBy = createdBy; // correo del creador
    this.children = isFolder ? [] : null; // Un archivo NO puede tener hijos
  }
}

export class NTree {
  constructor(rootNode = null) {
    this.root = rootNode || new TreeNode('root', 'Raíz', true, 'sistema@app.com');
  }

  // Método recursivo para buscar un nodo por su ID
  findNode(node, id) {
    if (!node) return null;
    if (node.id === id) return node;

    if (node.isFolder && node.children) {
      for (let child of node.children) {
        const found = this.findNode(child, id);
        if (found) return found;
      }
    }
    return null;
  }

  // Insertar un nuevo archivo o carpeta bajo un nodo padre específico
  addNode(parentId, name, isFolder, createdBy) {
    const parent = this.findNode(this.root, parentId);

    // Regla de negocio: Solo las carpetas pueden tener hijos
    if (!parent) return { success: false, message: 'Carpeta padre no encontrada.' };
    if (!parent.isFolder) return { success: false, message: 'Un archivo no puede contener elementos.' };

    const newNode = new TreeNode(Date.now().toString(), name, isFolder, createdBy);
    parent.children.push(newNode);
    return { success: true, node: newNode };
  }
}