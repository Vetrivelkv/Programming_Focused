import { BookOpenCheck, Brain, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../App";
import { apiJson } from "../api";

export default function LoginPage() {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "register") {
        await apiJson("/api/auth/register", {
          method: "POST", sessionAware: false, body: JSON.stringify({ username, password }),
        });
        setMessage("Your account is ready. Sign in to start learning.");
        setMode("login");
        setPassword("");
      } else {
        login(await apiJson("/api/auth/login", {
          method: "POST", sessionAware: false, body: JSON.stringify({ username, password }),
        }));
      }
    } catch (caught) {
      setError(caught.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-story">
        <div className="story-content">
          <span className="story-kicker"><Sparkles size={17} /> A focused path to confident programming</span>
          <h1>Learn the rule.<br /><em>Prove you know it.</em></h1>
          <p>Move through focused lessons, earn perfect scores, and unlock every step of your programming journey.</p>
          <div className="story-features">
            <span><BookOpenCheck /> Structured learning</span>
            <span><Brain /> Mastery challenges</span>
          </div>
        </div>
        <div className="word-orbit" aria-hidden="true">
          <span>noun</span><span>verb</span><span>subject</span><span>confidence</span>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <span className="brand-mark large">PF</span>
          <p className="eyebrow">Programming Focused</p>
          <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
          <p className="muted">{mode === "login" ? "Continue from where you left off." : "Your learning record starts here."}</p>
          <div className="auth-tabs">
            <button className={mode === "login" ? "active" : ""} type="button" onClick={() => setMode("login")}>Sign in</button>
            <button className={mode === "register" ? "active" : ""} type="button" onClick={() => setMode("register")}>Register</button>
          </div>
          <form onSubmit={submit}>
            <label className="field-label">Username
              <input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required minLength={3} />
            </label>
            <label className="field-label">Password
              <input type="password" value={password} onChange={(event) => setPassword(event.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"} required minLength={6} />
            </label>
            {message && <p className="form-success">{message}</p>}
            {error && <p className="form-error" role="alert">{error}</p>}
            <button className="button primary full" disabled={busy} type="submit">
              {busy ? "Please wait…" : mode === "login" ? "Enter your classroom" : "Create account"}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
