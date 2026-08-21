import { ArrowRight, Braces, Code2, Database, Server, ShieldCheck, Sparkles } from "lucide-react";
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
        <div className="landing-brand">
          <span className="landing-brand-mark"><Code2 size={21} /></span>
          <span><strong>Programming</strong> Focused</span>
        </div>
        <div className="story-content">
          <span className="story-kicker"><Sparkles size={16} /> Learn by understanding, not memorizing</span>
          <h1>Think in code.<br /><em>Build with confidence.</em></h1>
          <p>Follow a practical path from JavaScript fundamentals to production-ready React and Node.js applications.</p>

          <div className="stack-list" aria-label="Technology tracks">
            <span><Braces size={15} /> JavaScript</span>
            <span><Code2 size={15} /> React</span>
            <span><Server size={15} /> Node.js</span>
            <span><Database size={15} /> Databases</span>
          </div>

          <div className="learning-path" aria-label="Learning roadmap">
            <article>
              <span className="path-step">01</span>
              <div><strong>Understand</strong><small>Core concepts and mental models</small></div>
            </article>
            <article>
              <span className="path-step">02</span>
              <div><strong>Practice</strong><small>Focused exercises and debugging</small></div>
            </article>
            <article>
              <span className="path-step">03</span>
              <div><strong>Ship</strong><small>APIs and full-stack projects</small></div>
            </article>
          </div>
        </div>

        <div className="code-console" aria-hidden="true">
          <div className="console-bar"><i /><i /><i /><span>learning-path.js</span></div>
          <code><b>const</b> nextSkill = roadmap<br />
            &nbsp;&nbsp;.practice(<em>daily</em>)<br />
            &nbsp;&nbsp;.build(<em>projects</em>);<br /><br />
            <span>console.log</span>(<q>ready to ship</q>);</code>
        </div>
        <div className="story-footer">
          <span><ShieldCheck size={17} /> Progress saved automatically</span>
          <span>React · Express · REST APIs</span>
        </div>
      </section>
      <section className="login-panel">
        <div className="login-card">
          <div className="login-card-heading">
            <span className="brand-mark large"><Code2 size={25} /></span>
            <div><p className="eyebrow">Your developer workspace</p><span className="status-dot">Learning system online</span></div>
          </div>
          <h2>{mode === "login" ? "Continue building" : "Start your journey"}</h2>
          <p className="muted">{mode === "login" ? "Your next programming milestone is waiting." : "Create a profile to track lessons, challenges, and mastery."}</p>
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
              {busy ? "Please wait…" : mode === "login" ? <>Open workspace <ArrowRight size={18} /></> : <>Create learning profile <ArrowRight size={18} /></>}
            </button>
          </form>
          <p className="login-note"><ShieldCheck size={15} /> Secure session · Progress stored per learning track</p>
        </div>
      </section>
    </main>
  );
}
