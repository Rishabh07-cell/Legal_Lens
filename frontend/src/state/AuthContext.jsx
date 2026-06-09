import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("legallens_token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    let active = true;

    async function loadUser() {
      if (!token) {
        setLoading(false);
        setUser(null);
        return;
      }

      try {
        const response = await api.get("/auth/me");
        if (active) {
          setUser(response.data.user);
        }
      } catch (_error) {
        localStorage.removeItem("legallens_token");
        if (active) {
          setToken(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadUser();
    return () => {
      active = false;
    };
  }, [token]);

  const value = useMemo(
    () => ({
      loading,
      token,
      user,
      async login(email, password) {
        const response = await api.post("/auth/login", { email, password });
        localStorage.setItem("legallens_token", response.data.access_token);
        setToken(response.data.access_token);
        setUser(response.data.user);
      },
      async register(name, email, password) {
        const response = await api.post("/auth/register", { name, email, password });
        localStorage.setItem("legallens_token", response.data.access_token);
        setToken(response.data.access_token);
        setUser(response.data.user);
      },
      logout() {
        localStorage.removeItem("legallens_token");
        setToken(null);
        setUser(null);
      },
    }),
    [loading, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return value;
}
