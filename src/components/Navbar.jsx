import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Activity, UserPlus, ShieldCheck, LayoutDashboard, User } from "lucide-react";
import clsx from "clsx";
import { useAuth } from "../contexts/AuthContext";

const protectedLinks = [
  { to: "/", label: "Home", icon: LayoutDashboard, exact: true },
  { to: "/enroll", label: "Cadastro", icon: UserPlus },
  { to: "/verify", label: "Verificar (1:1)", icon: ShieldCheck },
  { to: "/identify", label: "Identificar (1:N)", icon: Activity },
];

export default function Navbar() {
  const { isAuthenticated, me } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Esconde navbar nas rotas públicas
  const isPublic = location.pathname === "/login" || location.pathname === "/register";
  if (isPublic) return null;

  return (
    <header
      className={clsx(
        "fixed inset-x-0 top-0 z-50 border-b backdrop-blur",
        scrolled ? "bg-black/40 border-white/10" : "bg-transparent border-transparent"
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-2xl bg-white/10 grid place-items-center font-bold">
            Z
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold">ZionFace</div>
            <div className="text-[11px] opacity-70">
              {isAuthenticated ? (me?.pessoa?.nome || me?.usuario?.email || "Sessão ativa") : "Sessão"}
            </div>
          </div>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {protectedLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={!!l.exact}
              className={({ isActive }) =>
                clsx(
                  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
                  isActive ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
                )
              }
            >
              <l.icon className="h-4 w-4 opacity-90" />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!isAuthenticated && (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  clsx(
                    "rounded-xl px-3 py-2 text-sm font-semibold transition",
                    isActive ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
                  )
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className="rounded-xl bg-emerald-500/90 px-3 py-2 text-sm font-semibold text-black hover:bg-emerald-500/95"
              >
                Cadastrar
              </NavLink>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-3 md:hidden">
        <div className="flex flex-wrap gap-2">
          {protectedLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={!!l.exact}
              className={({ isActive }) =>
                clsx(
                  "inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition",
                  isActive ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
                )
              }
            >
              <l.icon className="h-4 w-4 opacity-90" />
              <span>{l.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
