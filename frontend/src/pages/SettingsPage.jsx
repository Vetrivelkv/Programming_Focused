import { Check, Moon, Settings, Sun } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../App";

const OPTIONS = [
  {
    id: "default",
    title: "Default theme",
    description: "A warm, bright workspace designed for daytime learning.",
    icon: Sun,
  },
  {
    id: "dark",
    title: "Dark theme",
    description: "A calm, low-light workspace that is easier on your eyes at night.",
    icon: Moon,
  },
];

export default function SettingsPage() {
  const { theme, saveTheme } = useAuth();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const chooseTheme = async (nextTheme) => {
    if (saving || nextTheme === theme) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      await saveTheme(nextTheme);
      setMessage("Theme saved to your account.");
    } catch (caught) {
      setError(caught.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page settings-page">
      <header className="settings-hero">
        <span className="settings-hero-icon"><Settings /></span>
        <div>
          <p className="eyebrow">Account settings</p>
          <h1>Make the classroom yours.</h1>
          <p>Your theme follows your account and stays selected on every device.</p>
        </div>
      </header>

      <section className="settings-panel" aria-labelledby="appearance-heading">
        <div className="settings-heading">
          <div>
            <p className="eyebrow">Appearance</p>
            <h2 id="appearance-heading">Choose your theme</h2>
          </div>
          <span className="saved-preference">Saved in your profile</span>
        </div>

        <div className="theme-options" role="group" aria-label="Theme selection">
          {OPTIONS.map((option) => {
            const selected = theme === option.id;
            const Icon = option.icon;
            return (
              <button
                aria-pressed={selected}
                className={`theme-option ${option.id} ${selected ? "selected" : ""}`}
                disabled={saving}
                key={option.id}
                onClick={() => chooseTheme(option.id)}
                type="button"
              >
                <span className="theme-preview" aria-hidden="true">
                  <span className="preview-bar" />
                  <span className="preview-copy"><i /><i /><i /></span>
                  <span className="preview-card" />
                </span>
                <span className="theme-option-copy">
                  <span className="theme-option-icon"><Icon /></span>
                  <span><strong>{option.title}</strong><small>{option.description}</small></span>
                  <span className="theme-check">{selected && <Check />}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="settings-feedback" aria-live="polite">
          {saving && <p className="muted">Saving your preference…</p>}
          {message && <p className="form-success">{message}</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
        </div>
      </section>
    </div>
  );
}
