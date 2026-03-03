import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { authMe } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [me, setMe] = useState(null); // backend returns { usuario, pessoa }
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const data = await authMe();
      setMe(data);
      return data;
    } catch {
      setMe(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(() => {
    const pessoaId =
      me?.pessoa?.id ??
      me?.pessoa?.pessoa_id ??
      me?.usuario?.pessoa_id ??
      null;

    return {
      me,
      loading,
      isAuthenticated: !!me,
      pessoaId,
      refresh,
      // "logout" real depende de rota no backend; aqui é só limpar cache local
      localSignOut: () => setMe(null),
    };
  }, [me, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
