import React, { useEffect, useMemo, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  UserPlus,
  ShieldCheck,
  LayoutDashboard,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../contexts/AuthContext";

const protectedLinks = [
  { to: "/", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/enroll", label: "Cadastro", icon: UserPlus },
  { to: "/verify", label: "Verificar (1:1)", icon: ShieldCheck },
  { to: "/identify", label: "Identificar (1:N)", icon: Activity },
];

function initials(name) {
  const n = (name || "").trim();
  if (!n) return "Z";
  const parts = n.split(/\s+/).slice(0, 2);
  return parts.map((p) => (p[0] ? p[0].toUpperCase() : "")).join("");
}

export default function Navbar() {
  const { isAuthenticated, me, signout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  // Esconde navbar nas rotas públicas
  const isPublic = location.pathname === "/login" || location.pathname === "/register";
  if (isPublic) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha menus quando muda rota
  useEffect(() => {
    setMobileOpen(false);
    setUserOpen(false);
  }, [location.pathname]);

  // Bloqueia scroll do body quando menu mobile está aberto
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

  const displayName = useMemo(() => {
    return me?.pessoa?.nome || me?.usuario?.email || "Sessão";
  }, [me]);

  const subtitle = useMemo(() => {
    if (!isAuthenticated) return "Sessão";
    return me?.usuario?.email || "Sessão ativa";
  }, [isAuthenticated, me]);

  const onLogout = async () => {
    await signout?.();
    navigate("/login");
  };

  return (
    <>
      <header
        className={clsx(
          "sticky top-0 z-50 w-full [padding-top:env(safe-area-inset-top)]",
          "backdrop-blur",
          scrolled
            ? "bg-black/55 border-b border-white/10 shadow-[0_10px_30px_-20px_rgba(0,0,0,.8)]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            {/* Brand */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 rounded-2xl bg-white/10 grid place-items-center font-extrabold">
                <span className="text-sm">Z</span>
                <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400/90 ring-2 ring-black/60" />
              </div>

              <div className="min-w-0 leading-tight">
                <div className="truncate text-sm font-extrabold tracking-wide">
                  ZionFace
                </div>
                <div className="truncate text-[11px] opacity-70">{subtitle}</div>
              </div>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-2">
              {protectedLinks.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={!!l.exact}
                  className={({ isActive }) =>
                    clsx(
                      "group relative inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-semibold transition",
                      "border border-white/10",
                      isActive ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
                    )
                  }
                >
                  <l.icon className="h-4 w-4 opacity-90" />
                  <span className="whitespace-nowrap">{l.label}</span>

                  <span
                    className={clsx(
                      "pointer-events-none absolute -bottom-[7px] left-1/2 h-[3px] w-10 -translate-x-1/2 rounded-full transition",
                      location.pathname === l.to ||
                        (!!l.exact && location.pathname === "/" && l.to === "/")
                        ? "bg-emerald-400/90"
                        : "bg-transparent"
                    )}
                  />
                </NavLink>
              ))}
            </nav>

            {/* Right actions */}
            <div className="flex shrink-0 items-center gap-2">
              {/* Desktop user dropdown */}
              <div className="relative hidden lg:block">
                <button
                  type="button"
                  onClick={() => setUserOpen((v) => !v)}
                  className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 px-3 py-2 transition"
                  aria-label="Menu do usuário"
                >
                  <div className="h-8 w-8 rounded-2xl bg-white/10 grid place-items-center text-xs font-extrabold">
                    {initials(me?.pessoa?.nome || me?.usuario?.email)}
                  </div>
                  <div className="hidden xl:block text-left leading-tight max-w-[220px]">
                    <div className="truncate text-sm font-semibold">{displayName}</div>
                    <div className="truncate text-[11px] opacity-70">{me?.pessoa?.cpf || ""}</div>
                  </div>
                  <ChevronDown className={clsx("h-4 w-4 transition", userOpen && "rotate-180")} />
                </button>

                {userOpen && (
                  <>
                    <button
                      type="button"
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={() => setUserOpen(false)}
                      aria-label="Fechar"
                    />
                    <div className="absolute right-0 z-50 mt-2 w-[280px] overflow-hidden rounded-2xl border border-white/10 bg-black/80 backdrop-blur shadow-xl">
                      <div className="p-3">
                        <div className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 p-3">
                          <div className="h-10 w-10 rounded-2xl bg-white/10 grid place-items-center font-extrabold">
                            {initials(me?.pessoa?.nome || me?.usuario?.email)}
                          </div>
                          <div className="min-w-0">
                            <div className="truncate text-sm font-semibold">{displayName}</div>
                            <div className="truncate text-[12px] opacity-70">{me?.usuario?.email}</div>
                          </div>
                        </div>

                        <div className="mt-3 grid gap-2">
                          {isAuthenticated && (
                            <button
                              type="button"
                              onClick={onLogout}
                              className="flex items-center gap-2 rounded-2xl bg-emerald-500/90 hover:bg-emerald-500/95 px-3 py-2 text-sm font-extrabold text-black"
                            >
                              <LogOut className="h-4 w-4" />
                              Sair
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="lg:hidden inline-flex items-center justify-center rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 w-11 h-11"
                aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/55"
            onClick={() => setMobileOpen(false)}
            aria-label="Fechar"
          />

          <div className="absolute right-0 top-0 h-full w-[86%] max-w-[360px] bg-black/85 backdrop-blur border-l border-white/10 shadow-2xl">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-10 w-10 rounded-2xl bg-white/10 grid place-items-center font-extrabold">
                  {initials(me?.pessoa?.nome || me?.usuario?.email)}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-extrabold">{displayName}</div>
                  <div className="truncate text-[12px] opacity-70">{me?.usuario?.email}</div>
                </div>
              </div>

              <button
                type="button"
                className="rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 w-10 h-10 grid place-items-center"
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-4 pb-4">
              <div className="text-xs uppercase tracking-wide text-white/60 px-1 pb-2">
                Navegação
              </div>

              <div className="grid gap-2">
                {protectedLinks.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={!!l.exact}
                    className={({ isActive }) =>
                      clsx(
                        "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold transition border",
                        isActive ? "bg-white/10 border-white/15" : "bg-white/5 hover:bg-white/10 border-white/10"
                      )
                    }
                  >
                    <l.icon className="h-4 w-4 opacity-90" />
                    <span className="whitespace-nowrap">{l.label}</span>
                  </NavLink>
                ))}
              </div>

              <div className="mt-4">
                <div className="text-xs uppercase tracking-wide text-white/60 px-1 pb-2">
                  Conta
                </div>

                {!isAuthenticated ? (
                  <div className="grid grid-cols-2 gap-2">
                    <NavLink
                      to="/login"
                      className="rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-3 text-sm font-semibold text-center"
                    >
                      Login
                    </NavLink>
                    <NavLink
                      to="/register"
                      className="rounded-2xl bg-emerald-500/90 hover:bg-emerald-500/95 px-3 py-3 text-sm font-extrabold text-black text-center"
                    >
                      Cadastrar
                    </NavLink>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <button
                      type="button"
                      onClick={onLogout}
                      className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-500/90 hover:bg-emerald-500/95 px-3 py-3 text-sm font-extrabold text-black"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </div>
                )}
              </div>

              <div className="[height:env(safe-area-inset-bottom)]" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}