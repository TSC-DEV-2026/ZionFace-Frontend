import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PublicRoute() {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center p-6">
        <div className="text-sm opacity-80">Carregando...</div>
      </div>
    );
  }

  if (isAuthenticated) return <Navigate to="/" replace />;

  return <Outlet />;
}
