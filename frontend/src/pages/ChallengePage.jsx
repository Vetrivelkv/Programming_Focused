import { ArrowLeft, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiJson } from "../api";
import LoadingState from "../components/LoadingState";
import QuizForm from "../components/QuizForm";

export default function ChallengePage() {
  const { courseId, topic, roundNumber } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [error, setError] = useState("");
  const base = `/api/courses/${courseId}/challenges/${encodeURIComponent(topic)}/${roundNumber}`;
  useEffect(() => {
    apiJson(base).then(setChallenge).catch((caught) => setError(caught.message));
  }, [base]);
  if (!challenge && !error) return <LoadingState label="Preparing your challenge…" />;
  if (error) return <p className="form-error">{error}</p>;

  return (
    <div className="page lesson-page challenge-page">
      <Link className="back-link" to={`/course/${courseId}`}><ArrowLeft /> Back to dashboard</Link>
      <header className="lesson-header">
        <span className="lesson-icon"><Trophy /></span>
        <p className="eyebrow">{topic} · Round {challenge.roundNumber}</p>
        <h1>{challenge.title}</h1>
        <p>Score a perfect {challenge.requiredScore}/{challenge.requiredScore} to unlock the next challenge.</p>
      </header>
      <QuizForm
        questions={challenge.questions}
        requiredScore={challenge.requiredScore}
        submitLabel="Complete challenge"
        onSubmit={(answers) => apiJson(`${base}/submit`, { method: "POST", body: JSON.stringify({ answers }) })}
      />
    </div>
  );
}
