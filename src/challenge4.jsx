import React, { useState } from 'react';

// Mock data inicial
const initialBooks = [
  { name: "Cien años de soledad", isbn: "978-0307474728", author: "Gabriel García Márquez", editorial: "Sudamericana" },
  { name: "Don Quijote de la Mancha", isbn: "978-8424922498", author: "Miguel de Cervantes", editorial: "Espasa" },
  { name: "Rayuela", isbn: "978-8437604572", author: "Julio Cortázar", editorial: "Cátedra" }
];

export default function Challenge4() {
  const [books, setBooks] = useState(initialBooks);

  const [formData, setFormData] = useState({
    name: '',
    isbn: '',
    author: '',
    editorial: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.isbn || !formData.author || !formData.editorial) {
      alert("Por favor completa todos los campos");
      return;
    }

    // Agregar nuevo libro a la cima de la pila (LIFO)
    setBooks([formData, ...books]);

    // Limpiar formulario
    setFormData({ name: '', isbn: '', author: '', editorial: '' });
  };

  const handlePop = () => {
    if (books.length === 0) return;
    const updated = [...books];
    updated.shift();
    setBooks(updated);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Challenge 04: Pila de Libros (Stack)</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          name="name"
          placeholder="Nombre del Libro"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="text"
          name="isbn"
          placeholder="ISBN"
          value={formData.isbn}
          onChange={handleChange}
        />
        <input
          type="text"
          name="author"
          placeholder="Autor"
          value={formData.author}
          onChange={handleChange}
        />
        <input
          type="text"
          name="editorial"
          placeholder="Editorial"
          value={formData.editorial}
          onChange={handleChange}
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Push (Agregar a la Pila)
        </button>
      </form>

      <button 
        onClick={handlePop} 
        disabled={books.length === 0}
        style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}
      >
        Pop (Desapilar del Tope)
      </button>

      <h3>Contenido de la Pila (Total: {books.length})</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {books.length === 0 ? (
          <p>La pila está vacía.</p>
        ) : (
          books.map((book, index) => (
            <div 
              key={index} 
              style={{
                border: '2px solid #333',
                borderRadius: '6px',
                padding: '12px',
                backgroundColor: index === 0 ? '#e3f2fd' : '#f9f9f9'
              }}
            >
              {index === 0 && <strong style={{ color: '#007bff' }}>[TOPE DE LA PILA]</strong>}
              <p style={{ margin: '4px 0' }}><strong>Título:</strong> {book.name}</p>
              <p style={{ margin: '4px 0' }}><strong>ISBN:</strong> {book.isbn}</p>
              <p style={{ margin: '4px 0' }}><strong>Autor:</strong> {book.author}</p>
              <p style={{ margin: '4px 0' }}><strong>Editorial:</strong> {book.editorial}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}