import { createContext, useContext, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);

// A JWT's middle part is base64 JSON. We read the role from it so the UI
// can show admin controls. The real security check is still on the server.
function readRole(token) {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part)).role;
  } catch {
    return "user";
  }
}

export function AuthProvider({ children }) {
  // Restore the session from localStorage so a refresh doesn't log you out.
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("session"));
    } catch {
      return null;
    }
  });

  async function login(email, password) {
    const data = await api("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
    const next = {
      token: data.access_token,
      email,
      role: readRole(data.access_token),
    };
    localStorage.setItem("session", JSON.stringify(next));
    setSession(next);
  }

  async function register(email, password) {
    await api("/api/auth/register", { method: "POST", body: { email, password } });
    await login(email, password); // log in straight after signing up
  }

  function logout() {
    localStorage.removeItem("session");
    setSession(null);
  }

  const value = {
    session,
    isAdmin: session?.role === "admin",
    login,
    register,
    logout,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);