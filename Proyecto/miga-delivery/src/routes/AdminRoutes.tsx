import React from "react"
import { useAuthContext } from "../context/AuthContext"

interface AdminRoutesProps {
  children: React.ReactNode
}

export const AdminRoutes: React.FC<AdminRoutesProps> = ({ children }) => {
  const { user } = useAuthContext()

  if (user?.role !== "admin") {
    return (
      <div className="p-8 text-center bg-amber-50 text-amber-700 rounded-2xl m-4 border border-amber-200">
        <h3 className="font-bold text-lg mb-1">
          Área de Administración Protegida
        </h3>
        <p className="text-sm">
          Para probar este módulo, cambia de rol a "admin" en la barra superior.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
