
export class NodoPaciente {
  constructor(nombre) {
    this.nombre = nombre;
    this.siguiente = null;
  }
}

export class ListaPacientes {
  constructor() {
    this.cabeza = null;
  }

  enqueue(nombre) {
    const nuevo = new NodoPaciente(nombre);
    if (!this.cabeza) {
      this.cabeza = nuevo;
    } else {
      let actual = this.cabeza;
      while (actual.siguiente) {
        actual = actual.siguiente;
      }
      actual.siguiente = nuevo;
    }
  }

  dequeue() {
    if (!this.cabeza) return null;
    const paciente = this.cabeza.nombre;
    this.cabeza = this.cabeza.siguiente;
    return paciente;
  }

  toArray() {
    const elementos = [];
    let actual = this.cabeza;
    while (actual) {
      elementos.push(actual.nombre);
      actual = actual.siguiente;
    }
    return elementos;
  }
}


export class NodoHistorial {
  constructor(nombre) {
    this.nombre = nombre;
    this.siguiente = null;
    this.anterior = null;
  }
}

export class ListaHistorial {
  constructor() {
    this.cabeza = null;
    this.cola = null;
  }

  agregar(nombre) {
    const nuevo = new NodoHistorial(nombre);
    if (!this.cabeza) {
      this.cabeza = nuevo;
      this.cola = nuevo;
    } else {
      this.cola.siguiente = nuevo;
      nuevo.anterior = this.cola;
      this.cola = nuevo;
    }
  }

  toArray() {
    const elementos = [];
    let actual = this.cabeza;
    while (actual) {
      elementos.push(actual.nombre);
      actual = actual.siguiente;
    }
    return elementos;
  }
}


export class NodoMedico {
  constructor(nombre) {
    this.nombre = nombre;
    this.siguiente = null;
  }
}

export class ListaMedicos {
  constructor() {
    this.cabeza = null;
    this.actual = null;
  }

  agregar(nombre) {
    const nuevo = new NodoMedico(nombre);
    if (!this.cabeza) {
      this.cabeza = nuevo;
      nuevo.siguiente = this.cabeza;
      this.actual = this.cabeza; // <--- Se corrigió esta línea
    } else {
      let temp = this.cabeza;
      while (temp.siguiente !== this.cabeza) {
        temp = temp.siguiente;
      }
      temp.siguiente = nuevo;
      nuevo.siguiente = this.cabeza;
    }
  }

  siguienteMedico() {
    if (this.actual) {
      this.actual = this.actual.siguiente;
    }
    return this.actual ? this.actual.nombre : "Sin médicos";
  }

  getMedicoActual() {
    return this.actual ? this.actual.nombre : "Sin médicos";
  }
}

export class NodoComite {
  constructor(nombre) {
    this.nombre = nombre;
    this.siguiente = null;
    this.anterior = null;
  }
}

export class ListaComite {
  constructor() {
    this.cabeza = null;
  }

  agregar(nombre) {
    const nuevo = new NodoComite(nombre);
    if (!this.cabeza) {
      this.cabeza = nuevo;
      nuevo.siguiente = nuevo;
      nuevo.anterior = nuevo;
    } else {
      const cola = this.cabeza.anterior;
      cola.siguiente = nuevo;
      nuevo.anterior = cola;
      nuevo.siguiente = this.cabeza;
      this.cabeza.anterior = nuevo;
    }
  }

  toArray() {
    if (!this.cabeza) return [];
    const elementos = [];
    let actual = this.cabeza;
    do {
      elementos.push(actual.nombre);
      actual = actual.siguiente;
    } while (actual !== this.cabeza);
    return elementos;
  }
}