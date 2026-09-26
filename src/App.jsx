import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { PrivateRoute } from "./PrivateRoute";
import { LoginPage, Exercise1Page, Exercise2Page } from "./challenge6";

// Menú superior visible solo cuando el usuario está autenticado
function NavigationHeader() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <nav style={{ padding: "10px 20px", background: "#242424", marginBottom: "20px", display: "flex", gap: "15px" }}>
      <Link to="/exercise1" style={{ color: "#fff", textDecoration: "none" }}>Ejercicio 1</Link>
      <Link to="/exercise2" style={{ color: "#fff", textDecoration: "none" }}>Ejercicio 2</Link>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <NavigationHeader />
      
      <Routes>
        {/* Ruta pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas Privadas protegidas por PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/exercise1" element={<Exercise1Page />} />
          <Route path="/exercise2" element={<Exercise2Page />} />
        </Route>

        {/* Si escriben cualquier otra ruta, redirige al login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}