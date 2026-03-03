import { Routes, Route } from "react-router-dom";

import Dashboard from "../src/pages/Dashboard";
import EnrollPage from "../src/pages/EnrollPage";
import VerifyPage from "../src/pages/VerifyPage";
import IdentifyPage from "../src/pages/IdentifyPage";

import LoginPage from "../src/pages/LoginPage";
import RegisterPage from "../src/pages/RegisterPage";

import ProtectedRoute from "../src/components/ProtectedRoute";
import PublicRoute from "../src/components/PublicRoute";
import AppShell from "../src/components/AppShell";

export default function App() {
  return (
    <Routes>
      {/* Rotas públicas (se já estiver logado, redireciona para /) */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Rotas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/enroll" element={<EnrollPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          <Route path="/identify" element={<IdentifyPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
