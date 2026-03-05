import { Routes, Route } from "react-router-dom";

import Dashboard from "./paginas/dashboard/Dashboard";
import CadastroRosto from "./paginas/cadastro/CadastroRosto";
import VerificarPessoa from "./paginas/verificar/VerificarPessoa";
import IdentificarPessoa from "./paginas/identificar/IdentificarPessoa";

import Login from "./paginas/login/Login";
import RegistroUsuario from "./paginas/registro/RegistroUsuario";

import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import AppShell from "./components/AppShell";

export default function App() {
  return (
    <Routes>
      {/* Rotas públicas (se já estiver logado, redireciona para /) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<RegistroUsuario />} />
      </Route>

      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/enroll" element={<CadastroRosto />} />
          <Route path="/verify" element={<VerificarPessoa />} />
          <Route path="/identify" element={<IdentificarPessoa />} />
        </Route>
      </Route>
    </Routes>
  );
}
