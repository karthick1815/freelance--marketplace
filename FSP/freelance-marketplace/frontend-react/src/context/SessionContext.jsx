import { createContext, useContext, useState, useCallback } from "react";

const SESSION_KEY = "corkboard_session";
const SessionContext = createContext(null);

function readStoredSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function SessionProvider({ children }) {
  const [session, setSessionState] = useState(readStoredSession);

  const login = useCallback((user) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    setSessionState(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setSessionState(null);
  }, []);

  return (
    <SessionContext.Provider value={{ session, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used within a SessionProvider");
  return ctx;
}
