import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { apiFetch, SESSION_EXPIRED_EVENT } from "./api";
import AppShell from "./components/AppShell";
import SessionExpiredModal from "./components/SessionExpiredModal";
import LoginPage from "./pages/LoginPage";
import CoursesPage from "./pages/CoursesPage";
import DashboardPage from "./pages/DashboardPage";
import LessonPage from "./pages/LessonPage";
import ChallengePage from "./pages/ChallengePage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  const { user, checking, expired, logout, clearExpired } = useAuth();
  const navigate = useNavigate();
  if (checking) return <div className="splash"><span className="brand-mark">PF</span><p>Preparing your workspace…</p></div>;

  const acknowledgeExpiry = async () => {
    await logout();
    clearExpired();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/courses" replace /> : <LoginPage />} />
        <Route element={<Protected><AppShell /></Protected>}>
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/course/:courseId" element={<DashboardPage />} />
          <Route path="/course/:courseId/learn/:topic/:moduleId" element={<LessonPage />} />
          <Route path="/course/:courseId/challenge/:topic/:roundNumber" element={<ChallengePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to={user ? "/courses" : "/login"} replace />} />
      </Routes>
      {expired && <SessionExpiredModal onConfirm={acknowledgeExpiry} />}
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);
  const [checking, setChecking] = useState(true);
  const [expired, setExpired] = useState(false);
  const [theme, setTheme] = useState("default");

  useEffect(() => {
    apiFetch("/api/auth/session", { sessionAware: false })
      .then(async (response) => {
        if (!response.ok) return;
        const data = await response.json();
        setUser(data.user);
        setTheme(data.user.theme === "dark" ? "dark" : "default");
        setExpiresAt(data.expiresAt);
      })
      .finally(() => setChecking(false));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme === "dark" ? "dark" : "light";
  }, [theme]);

  useEffect(() => {
    const handleExpired = () => setExpired(true);
    window.addEventListener(SESSION_EXPIRED_EVENT, handleExpired);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, handleExpired);
  }, []);

  useEffect(() => {
    if (!expiresAt) return undefined;
    const delay = expiresAt - Date.now();
    if (delay <= 0) {
      setExpired(true);
      return undefined;
    }
    const timer = window.setTimeout(() => setExpired(true), delay);
    return () => window.clearTimeout(timer);
  }, [expiresAt]);

  const value = useMemo(() => ({
    user,
    checking,
    expired,
    login: (session) => {
      setUser(session.user);
      setTheme(session.user.theme === "dark" ? "dark" : "default");
      setExpiresAt(session.expiresAt);
      setExpired(false);
    },
    logout: async () => {
      await apiFetch("/api/auth/logout", { method: "POST", sessionAware: false }).catch(() => {});
      setUser(null);
      setTheme("default");
      setExpiresAt(null);
    },
    theme,
    saveTheme: async (nextTheme) => {
      const previousTheme = theme;
      setTheme(nextTheme);
      try {
        const response = await apiFetch("/api/settings", {
          method: "PATCH",
          body: JSON.stringify({ theme: nextTheme }),
        });
        const settings = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(settings.detail || "Unable to save theme.");
        setTheme(settings.theme);
      } catch (error) {
        setTheme(previousTheme);
        throw error;
      }
    },
    clearExpired: () => setExpired(false),
  }), [user, checking, expired, theme]);

  return <AuthContext.Provider value={value}><BrowserRouter><AppRoutes /></BrowserRouter></AuthContext.Provider>;
}
