import React, { useState } from 'react';

// Función para generar una fecha de llegada aleatoria dentro de los últimos 60 minutos
const getRandomArrivalDate = () => {
  const now = new Date();
  const randomMinutes = Math.floor(Math.random() * 60);
  const arrival = new Date(now.getTime() - randomMinutes * 60000);
  return arrival;
};

// Datos iniciales ficticios (mock data)
const initialPeople = [
  { name: "Carlos Pérez", amount: 200000, arrivalDate: getRandomArrivalDate() },
  { name: "María Rodríguez", amount: 500000, arrivalDate: getRandomArrivalDate() },
  { name: "Juan Gómez", amount: 150000, arrivalDate: getRandomArrivalDate() }
].sort((a, b) => a.arrivalDate - b.arrivalDate); // Ordenados por fecha de llegada (FIFO)

export default function Challenge5() {
  const [queue, setQueue] = useState(initialPeople);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !amount) {
      alert("Por favor completa el nombre y el monto.");
      return;
    }

    // Al registrar, el sistema asigna la fecha/hora actual
    const newPerson = {
      name,
      amount: Number(amount),
      arrivalDate: new Date()
    };

    // Agregar al final de la cola (Enqueue) y ordenar por fecha de llegada
    const updatedQueue = [...queue, newPerson].sort((a, b) => a.arrivalDate - b.arrivalDate);
    setQueue(updatedQueue);

    setName('');
    setAmount('');
  };

  const handleDequeue = () => {
    if (queue.length === 0) return;
    // Atender al primero en la fila (Dequeue)
    const updated = [...queue];
    updated.shift();
    setQueue(updated);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>Challenge 05: Cola del Cajero Automático (Queue)</h2>

      {/* Formulario para agregar una persona a la cola */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Nombre del cliente"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Monto a retirar ($)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit" style={{ padding: '10px', cursor: 'pointer', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px' }}>
          Enqueue (Hacer Fila)
        </button>
      </form>

      <button 
        onClick={handleDequeue} 
        disabled={queue.length === 0}
        style={{ padding: '8px 16px', marginBottom: '20px', cursor: 'pointer', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px' }}
      >
        Dequeue (Atender al Primero)
      </button>

      <h3>Fila de Espera (Total: {queue.length})</h3>

      {/* Renderizado de la fila en orden de llegada */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {queue.length === 0 ? (
          <p>No hay personas en la cola.</p>
        ) : (
          queue.map((person, index) => (
            <div 
              key={index} 
              style={{
                border: '2px solid #333',
                borderRadius: '6px',
                padding: '12px',
                backgroundColor: index === 0 ? '#d4edda' : '#f9f9f9'
              }}
            >
              {index === 0 && <strong style={{ color: '#28a745' }}>[PRIMERO EN ATENDER (FRONT)]</strong>}
              <p style={{ margin: '4px 0' }}><strong>Turno #{index + 1}:</strong> {person.name}</p>
              <p style={{ margin: '4px 0' }}><strong>Monto a Retirar:</strong> ${person.amount.toLocaleString()}</p>
              <p style={{ margin: '4px 0' }}><strong>Hora de Llegada:</strong> {new Date(person.arrivalDate).toLocaleTimeString()}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}