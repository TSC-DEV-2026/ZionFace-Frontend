import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authRegister } from "../services/api";

function onlyDigits(v) {
  return (v || "").replace(/\D/g, "");
}

function toDdMmYyyy(v) {
  const s = (v || "").trim();
  if (!s) return "";

  if (/^\d{2}-\d{2}-\d{4}$/.test(s)) return s;

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, d] = s.split("-");
    return `${d}-${m}-${y}`;
  }

  return s;
}

export default function RegisterPage() {
  const nav = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [ok, setOk] = useState("");

  const canSubmit = useMemo(() => {
    const cpfDigits = onlyDigits(cpf);
    const dn = toDdMmYyyy(dataNascimento);
    return (
      nome.trim().length > 0 &&
      cpfDigits.length === 11 &&
      dn.length >= 8 &&
      email.trim().length > 0 &&
      senha.trim().length > 0 &&
      !loading
    );
  }, [nome, cpf, dataNascimento, email, senha, loading]);

  async function onSubmit(e) {
    e.preventDefault();
    setErro("");
    setOk("");
    setLoading(true);
    try {
      const payload = {
        pessoa: {
          nome: nome.trim(),
          cpf: onlyDigits(cpf),
          data_nascimento: toDdMmYyyy(dataNascimento),
        },
        usuario: {
          email: email.trim(),
          senha: senha.trim(),
        },
      };

      await authRegister(payload);

      setOk("Cadastro realizado. Você já pode entrar.");
      setTimeout(() => nav("/login"), 600);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        "Falha no cadastro.";
      setErro(String(msg));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-void text-white">
      <div className="w-full max-w-md rounded-2xl bg-surface/60 border border-white/10 shadow-xl p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Criar conta</h1>
          <p className="text-white/70 mt-1">Cadastre seus dados para acessar.</p>
        </div>

        {erro ? (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {erro}
          </div>
        ) : null}

        {ok ? (
          <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {ok}
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-white/80">Nome</label>
            <input
              className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-accent/60"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome"
              autoComplete="name"
            />
          </div>

          <div>
            <label className="text-sm text-white/80">CPF</label>
            <input
              className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-accent/60"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="Somente números"
              inputMode="numeric"
              autoComplete="off"
            />
            <div className="mt-1 text-xs text-white/50">Precisa ter 11 dígitos.</div>
          </div>

          <div>
            <label className="text-sm text-white/80">Data de nascimento</label>
            <input
              className="mt-1 w-full rounded-xl bg-black/30 border border-white/10 px-3 py-2 outline-none focus:border-accent/60"
              value={dataNascimento}
              onChange={(e) => setDataNascimento(e.target.value)}
              placeholder="DD-MM-AAAA (ex: 15-01-2008) ou 2008-01-15"
              autoComplete="bday"
            />
          </div>

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
              placeholder="Crie uma senha"
              autoComplete="new-password"
            />
          </div>

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-xl px-4 py-2 font-medium bg-accent/90 hover:bg-accent disabled:opacity-50 disabled:hover:bg-accent/90 transition"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <div className="mt-5 text-sm text-white/70">
          Já tem conta?{" "}
          <Link className="text-accent hover:underline" to="/login">
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
}