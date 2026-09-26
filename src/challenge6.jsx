import Challenge4 from "./challenge4";
import Challenge5 from "./challenge5";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

// 1. VISTA DE LOGIN

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const result = login(email, password);
    if (result.success) {
      // Redirige a la primera vista privada sin permitir volver atrás con el navegador
      navigate("/exercise1", { replace: true });
    } else {
      setError(result.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "40px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Demo Login Page</h2>
      
      {error && <p style={{ color: "red", fontSize: "14px" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "12px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@mail.com"
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", marginBottom: "4px" }}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="123"
            required
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button type="submit" style={{ width: "100%", padding: "10px", cursor: "pointer" }}>
          Login
        </button>
      </form>
    </div>
  );
}

// 2. PRIMERA PÁGINA PRIVADA (Ejercicio 1)

export function Exercise1Page() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Página Privada - Ejercicio 1</h2>
      <p>Usuario logueado: <strong>{user?.email}</strong></p>
      
      <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #444", borderRadius: "5px" }}>
        {/* Renderizas tu ejercicio 4 aquí */}
        <Challenge4 />
      </div>

      <br />
      <button onClick={() => { logout(); navigate("/login"); }}>
        Cerrar Sesión
      </button>
    </div>
  );
}

// 3. SEGUNDA PÁGINA PRIVADA (Ejercicio 2)

export function Exercise2Page() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ padding: "20px" }}>
      <h2>Página Privada - Ejercicio 2</h2>
      <p>Usuario logueado: <strong>{user?.email}</strong></p>
      
      <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #444", borderRadius: "5px" }}>
        {/* Renderizas tu ejercicio 4 aquí */}
        <Challenge5 />
      </div>

      <br />
      <button onClick={() => { logout(); navigate("/login"); }}>
        Cerrar Sesión
      </button>
    </div>
  );
}