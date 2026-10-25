import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';

export default function Challenge10() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tareas, setTareas] = useState([]);
  const [nuevoTitulo, setNuevoTitulo] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);

  // 1. Escuchar el estado de autenticación
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Cargar tareas y conectar con Realtime cuando hay sesión activa
  useEffect(() => {
    if (!session) return;

    const cargarTareas = async () => {
      const { data, error } = await supabase
        .from('tareas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error("Error al cargar tareas:", error.message);
      else setTareas(data || []);
    };

    cargarTareas();

    // Suscripción Realtime
    const canal = supabase
      .channel('cambios-tareas')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tareas' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTareas((prev) => [payload.new, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          setTareas((prev) => prev.map((t) => (t.id === payload.new.id ? payload.new : t)));
        } else if (payload.eventType === 'DELETE') {
          setTareas((prev) => prev.filter((t) => t.id !== payload.old.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, [session]);

  // Autenticación: Login, Registro y Logout
  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else alert('Registro exitoso. Revisa tu correo o inicia sesión.');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
  };

  const handleLogout = () => supabase.auth.signOut();

  // CRUD de Tareas
  const crearTarea = async (e) => {
    e.preventDefault();
    if (!nuevoTitulo.trim()) return;

    const { error } = await supabase.from('tareas').insert({
      titulo: nuevoTitulo,
      user_id: session.user.id
    });

    if (error) {
      alert("Error al agregar tarea: " + error.message);
    } else {
      setNuevoTitulo('');
    }
  };

  const toggleCompletada = async (id, estadoActual) => {
    const { error } = await supabase
      .from('tareas')
      .update({ completada: !estadoActual })
      .eq('id', id);

    if (error) alert(error.message);
  };

  const borrarTarea = async (id) => {
    const { error } = await supabase.from('tareas').delete().eq('id', id);
    if (error) alert(error.message);
  };

  // Subida de Avatar al bucket 'avatars'
  const subirAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file || !session) return;

    const ruta = `${session.user.id}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from('avatars').upload(ruta, file, { upsert: true });

    if (error) {
      alert("Error al subir avatar: " + error.message);
      return;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(ruta);
    setAvatarUrl(data.publicUrl);
  };

  // Pantalla de Autenticación si no hay sesión
  if (!session) {
    return (
      <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
        <h2>Challenge 10 - Iniciar Sesión</h2>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '8px' }}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '8px' }}
          />
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleLogin} style={{ padding: '8px 16px', cursor: 'pointer' }}>
              Iniciar Sesión
            </button>
            <button onClick={handleRegister} style={{ padding: '8px 16px', cursor: 'pointer' }}>
              Registrarse
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Panel Principal de Tareas
  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2>Challenge 10 - Panel de Tareas</h2>
      <p>Usuario: <strong>{session.user.email}</strong></p>
      <button onClick={handleLogout} style={{ padding: '6px 12px', cursor: 'pointer' }}>
        Cerrar Sesión
      </button>

      <hr style={{ margin: '20px 0' }} />

      {/* Subir Avatar */}
      <div>
        <h3>Avatar de Usuario</h3>
        <input type="file" accept="image/*" onChange={subirAvatar} />
        {avatarUrl && (
          <div style={{ marginTop: '12px' }}>
            <img src={avatarUrl} alt="Avatar de usuario" width={100} height={100} style={{ borderRadius: '50%', objectFit: 'cover' }} />
          </div>
        )}
      </div>

      <hr style={{ margin: '20px 0' }} />

      {/* Agregar Tarea */}
      <h3>Agregar Tarea</h3>
      <form onSubmit={crearTarea} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Escribe el título de la tarea..."
          value={nuevoTitulo}
          onChange={(e) => setNuevoTitulo(e.target.value)}
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Agregar
        </button>
      </form>

      {/* Lista de Tareas con Realtime */}
      <h3>Mis Tareas (Live List)</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tareas.map((tarea) => (
          <li
            key={tarea.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px',
              borderBottom: '1px solid #444',
              marginBottom: '6px'
            }}
          >
            <span
              onClick={() => toggleCompletada(tarea.id, tarea.completada)}
              style={{
                cursor: 'pointer',
                textDecoration: tarea.completada ? 'line-through' : 'none',
                opacity: tarea.completada ? 0.6 : 1
              }}
            >
              {tarea.titulo}
            </span>
            <button
              onClick={() => borrarTarea(tarea.id)}
              style={{ padding: '4px 8px', cursor: 'pointer', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '4px' }}
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}