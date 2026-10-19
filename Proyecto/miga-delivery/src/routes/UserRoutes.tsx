import React from "react"
import { useAuthContext } from "../context/AuthContext"

interface UserRoutesProps {
  children: React.ReactNode
}

export const UserRoutes: React.FC<UserRoutesProps> = ({ children }) => {
  const { isAuthenticated } = useAuthContext()

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl m-4">
        Acceso restringido. Por favor inicia sesión como usuario.
      </div>
    )
  }

  return <>{children}</>
}
