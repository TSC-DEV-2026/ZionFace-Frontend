import { useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { authLogin } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const nav = useNavigate();
  const loc = useLocation();
  const { refresh } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && senha.trim().length > 0 && !loading;
  }, [email, senha, loading]);

  async function onSubmit(e) {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      // 1) faz login (backend deve setar cookies HttpOnly)
      await authLogin({ email: email.trim(), senha: senha.trim() });

      // 2) confirma sessão e carrega /auth/me
      const me = await refresh();

      // se não conseguiu carregar /me, normalmente é cookie não gravado/enviado
      if (!me) {
        setErro(
          "Login respondeu, mas a sessão não foi criada (cookie não foi salvo/enviado). " +
            "Verifique CORS/cookies no backend e se o axios está com withCredentials."
        );
        return;
      }

      // 3) redireciona para a rota anterior (se houver), senão dashboard
      const next = loc.state?.from?.pathname || "/";
      nav(next, { replace: true });
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Falha no login.";
      setErro(String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-void text-white">
      <div className="w-full max-w-md rounded-2xl bg-surface/60 border border-white/10 shadow-xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Entrar</h1>
          <p className="text-white/70 mt-1">Acesse sua conta para continuar.</p>
        </div>

        {erro ? (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {erro}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/80">E-mail</label>
            <input
              className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-accent/60"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@dominio.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Senha</label>
            <input
              className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-accent/60"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-xl px-4 py-2 font-medium bg-accent/90 hover:bg-accent disabled:opacity-50 disabled:hover:bg-accent/90 transition"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-5 text-sm text-white/70">
          Não tem conta?{" "}
          <Link className="text-accent hover:underline" to="/register">
            Criar agora
          </Link>
        </div>
      </div>
    </div>
  );
}