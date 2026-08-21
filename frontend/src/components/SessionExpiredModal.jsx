import { Clock3 } from "lucide-react";

export default function SessionExpiredModal({ onConfirm }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <section className="modal" role="dialog" aria-modal="true" aria-labelledby="expired-title">
        <span className="modal-icon"><Clock3 /></span>
        <h2 id="expired-title">Your session has ended</h2>
        <p>For your security, sign in again to continue learning.</p>
        <button className="button primary full" type="button" onClick={onConfirm}>Return to sign in</button>
      </section>
    </div>
  );
}
