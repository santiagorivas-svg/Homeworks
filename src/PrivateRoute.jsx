import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";

export function PrivateRoute() {
  const { user } = useAuth();

  // Si no hay usuario logueado, redirige a la ruta de login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza la vista hija
  return <Outlet />;
}