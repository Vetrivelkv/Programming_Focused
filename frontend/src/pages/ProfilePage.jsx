import { Award, BookCheck, CircleUserRound, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { apiJson } from "../api";
import LoadingState from "../components/LoadingState";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiJson("/api/profile").then(setProfile).catch((caught) => setError(caught.message));
  }, []);
  if (!profile && !error) return <LoadingState label="Gathering your achievements…" />;
  if (error) return <p className="form-error">{error}</p>;
  const learned = profile.courses.reduce((sum, course) => sum + course.learning.filter((row) => row.passed).length, 0);
  const passed = profile.courses.reduce((sum, course) => sum + course.challenges.filter((row) => row.passed).length, 0);
  const attempts = profile.courses.reduce((sum, course) =>
    sum + [...course.learning, ...course.challenges].reduce((total, row) => total + row.attempts, 0), 0);

  return (
    <div className="page">
      <header className="profile-hero">
        <span><CircleUserRound /></span>
        <div><p className="eyebrow">Learner profile</p><h1>Hello, {profile.user.username}.</h1><p>Every attempt is evidence that you’re moving forward.</p></div>
      </header>
      <section className="stat-grid">
        <article><BookCheck /><strong>{learned}</strong><span>Modules learned</span></article>
        <article><Award /><strong>{passed}</strong><span>Challenges passed</span></article>
        <article><Target /><strong>{attempts}</strong><span>Total attempts</span></article>
      </section>
      <section className="profile-courses">
        <div className="section-heading"><div><p className="eyebrow">Detailed progress</p><h2>Your course records</h2></div></div>
        {profile.courses.map((course) => (
          <article className="profile-course" key={course.id}>
            <div><h3>{course.title}</h3><p>{course.learning.length} modules attempted · {course.challenges.length} rounds attempted</p></div>
            <div className="progress-tables">
              <ProgressTable title="Learning journey" rows={course.learning} kind="learning" />
              <ProgressTable title="Challenge rounds" rows={course.challenges} kind="challenge" />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}

function ProgressTable({ title, rows, kind }) {
  return (
    <div>
      <h4>{title}</h4>
      {!rows.length ? <p className="empty-note">No attempts yet.</p> : (
        <div className="table-wrap"><table>
          <thead><tr><th>{kind === "learning" ? "Module" : "Round"}</th><th>Status</th><th>Best</th><th>Attempts</th></tr></thead>
          <tbody>{rows.map((row) => (
            <tr key={row.id}>
              <td>{kind === "learning" ? row.subtopic_id : `${row.topic_name} · ${row.round_number}`}</td>
              <td><span className={`status ${row.passed ? "passed" : ""}`}>{row.passed ? "Passed" : "Attempting"}</span></td>
              <td>{row.high_score}</td><td>{row.attempts}</td>
            </tr>
          ))}</tbody>
        </table></div>
      )}
    </div>
  );
}
