import { useState, useEffect } from 'react';

// ==========================================
// 1. COMPONENTE: LOADER (Petición Inicial)
// ==========================================
function Loader() {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <div style={{
        width: '40px',
        height: '40px',
        margin: '0 auto 15px auto',
        border: '4px solid #e2e8f0',
        borderTop: '4px solid #6366f1',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <h3 style={{ margin: 0, color: '#475569' }}>Cargando contactos...</h3>
      <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '5px' }}>
        Simulando petición inicial con useEffect
      </p>
    </div>
  );
}

// ==========================================
// 2. COMPONENTE: FORMULARIO
// ==========================================
function ContactForm({ onAddContact }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    onAddContact({ name: name.trim(), phone: phone.trim() });
    setName('');
    setPhone('');
  };

  return (
    <form onSubmit={handleSubmit} style={{
      backgroundColor: '#f8fafc',
      padding: '20px',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      marginBottom: '20px'
    }}>
      <h3 style={{ marginTop: 0, color: '#1e293b' }}>Agregar Nuevo Contacto</h3>
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Nombre</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Jonathan López"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            boxSizing: 'border-box'
          }}
        />
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>Teléfono</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Ej. 315 926 5443"
          style={{
            width: '100%',
            padding: '8px 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            boxSizing: 'border-box'
          }}
        />
      </div>
      <button
        type="submit"
        style={{
          width: '100%',
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          border: 'none',
          padding: '10px',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        Guardar Contacto
      </button>
    </form>
  );
}

// ==========================================
// 3. COMPONENTE: ÍTEM DE CONTACTO
// ==========================================
function ContactItem({ contact, onDelete }) {
  return (
    <li style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px 16px',
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: '8px'
    }}>
      <div>
        <strong style={{ display: 'block', color: '#0f172a' }}>{contact.name}</strong>
        <span style={{ fontSize: '13px', color: '#64748b' }}>{contact.phone}</span>
      </div>
      <button
        onClick={() => onDelete(contact.id)}
        style={{
          backgroundColor: '#fee2e2',
          color: '#ef4444',
          border: 'none',
          padding: '6px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '12px',
          fontWeight: 'bold'
        }}
      >
        Eliminar
      </button>
    </li>
  );
}

// ==========================================
// 4. COMPONENTE: LISTA DE CONTACTOS
// ==========================================
function ContactList({ contacts, onDeleteContact }) {
  return (
    <div>
      <h3 style={{ color: '#1e293b' }}>Lista de Contactos ({contacts.length})</h3>
      {contacts.length === 0 ? (
        <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No hay contactos en la lista.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {contacts.map((contact) => (
            <ContactItem
              key={contact.id}
              contact={contact}
              onDelete={onDeleteContact}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

// ==========================================
// 5. COMPONENTE PRINCIPAL (App)
// ==========================================
export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [contacts, setContacts] = useState([]);

  // Simulando carga inicial de datos con useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      setContacts([
        { id: 1, name: 'Jonathan López Londoño', phone: '+57 315 926 5443' },
        { id: 2, name: 'Universidad Autónoma de Occidente', phone: '(602) 318 8000' }
      ]);
      setIsLoading(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  const handleAddContact = (newContact) => {
    const contactWithId = { ...newContact, id: Date.now() };
    setContacts((prev) => [contactWithId, ...prev]);
  };

  const handleDeleteContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '40px auto',
      padding: '24px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Estilo keyframe para la animación del spinner */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      <header style={{ textCenter: 'center', marginBottom: '30px', borderBottom: '2px solid #f1f5f9', pb: '16px' }}>
        <h1 style={{ margin: 0, color: '#0f172a' }}>Directorio de Contactos</h1>
        <p style={{ color: '#64748b', fontSize: '14px', marginTop: '4px' }}>
          Estructuras de Datos II — Challenge 02
        </p>
      </header>

      {isLoading ? (
        <Loader />
      ) : (
        <main>
          <ContactForm onAddContact={handleAddContact} />
          <ContactList contacts={contacts} onDeleteContact={handleDeleteContact} />
        </main>
      )}
    </div>
  );
}