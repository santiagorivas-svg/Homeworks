import { useState, useEffect, useRef } from 'react';
import { 
  ListaPacientes, 
  ListaHistorial, 
  ListaMedicos, 
  ListaComite 
} from './estructuras';

export function App() {
  // Instancias de las estructuras (referencias para mantener el estado entre re-renders)
  const pacientesRef = useRef(new ListaPacientes());
  const historialRef = useRef(new ListaHistorial());
  const medicosRef = useRef(new ListaMedicos());
  const comiteRef = useRef(new ListaComite());

  // Estados visuales de React
  const [pacientes, setPacientes] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [medicoActual, setMedicoActual] = useState('Sin médicos');
  const [comite, setComite] = useState([]);
  const [nuevoPaciente, setNuevoPaciente] = useState('');

  // Inicialización de datos de prueba
  useEffect(() => {
    // Cargar Médicos (Lista Circular)
    medicosRef.current.agregar('Dr. Pérez');
    medicosRef.current.agregar('Dra. Gómez');
    medicosRef.current.agregar('Dr. Rodríguez');
    setMedicoActual(medicosRef.current.getMedicoActual());

    // Cargar Comité (Lista Circular Doble)
    comiteRef.current.agregar('Dra. López (Directora)');
    comiteRef.current.agregar('Dr. Martínez (Vicedirector)');
    comiteRef.current.agregar('Dra. Fernández (Secretaria)');
    setComite(comiteRef.current.toArray());

    // Cargar Pacientes iniciales
    pacientesRef.current.enqueue('Carlos Ruiz');
    pacientesRef.current.enqueue('Ana Torres');
    setPacientes(pacientesRef.current.toArray());
  }, []);

  // Temporizador: Rotación automática del médico de guardia cada 10 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      const siguiente = medicosRef.current.siguienteMedico();
      setMedicoActual(siguiente);
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  // Handler: Agregar un nuevo paciente en espera
  const handleAgregarPaciente = (e) => {
    e.preventDefault();
    if (!nuevoPaciente.trim()) return;
    pacientesRef.current.enqueue(nuevoPaciente);
    setPacientes(pacientesRef.current.toArray());
    setNuevoPaciente('');
  };

  // Handler: Atender paciente (sale de Lista Simple y pasa a Lista Doble)
  const handleAtenderPaciente = () => {
    const pacienteAtendido = pacientesRef.current.dequeue();
    if (pacienteAtendido) {
      historialRef.current.agregar(`${pacienteAtendido} (Atendido por ${medicoActual})`);
      setPacientes(pacientesRef.current.toArray());
      setHistorial(historialRef.current.toArray());
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🏥 Sistema de Gestión Clínica</h1>

      {/* MÉDICO DE GUARDIA */}
      <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>👨‍⚕️ Médico de Guardia Actual (Lista Circular)</h2>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#0d47a1' }}>{medicoActual}</p>
        <small>⏳ Cambia automáticamente cada 10 segundos.</small>
      </div>

      {/* PACIENTES EN ESPERA */}
      <div style={{ background: '#fff3e0', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>⏳ Pacientes en Espera (Lista Simplemente Enlazada)</h2>
        
        <form onSubmit={handleAgregarPaciente} style={{ marginBottom: '10px' }}>
          <input 
            type="text" 
            placeholder="Nombre del paciente"
            value={nuevoPaciente} 
            onChange={(e) => setNuevoPaciente(e.target.value)}
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <button type="submit" style={{ padding: '8px 12px' }}>Agregar Paciente</button>
        </form>

        <ul>
          {pacientes.length === 0 ? <li>No hay pacientes en espera.</li> : pacientes.map((p, i) => <li key={i}>{p}</li>)}
        </ul>

        <button 
          onClick={handleAtenderPaciente} 
          disabled={pacientes.length === 0}
          style={{ padding: '10px 15px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          ✅ Atender Siguiente Paciente
        </button>
      </div>

      {/* HISTORIAL DE ATENCIÓN */}
      <div style={{ background: '#e8f5e9', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>📜 Historial de Atención (Lista Doblemente Enlazada)</h2>
        <ul>
          {historial.length === 0 ? <li>Sin atenciones registradas.</li> : historial.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      </div>

      {/* COMITÉ ADMINISTRATIVO */}
      <div style={{ background: '#f3e5f5', padding: '15px', borderRadius: '8px' }}>
        <h2>🏛️ Comité Administrativo (Lista Circular Doble)</h2>
        <ul>
          {comite.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </div>
    </div>
  );
}

export default App;