import { ArrowRight, Check, ChevronDown, LockKeyhole, Play, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../App";
import { apiJson } from "../api";
import LoadingState from "../components/LoadingState";

const keyOf = (...parts) => parts.join("::");

export default function DashboardPage() {
  const { courseId } = useParams();
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    setData(null);
    apiJson(`/api/courses/${courseId}/dashboard`).then(setData).catch((caught) => setError(caught.message));
  }, [courseId]);

  const maps = useMemo(() => {
    const learning = new Map(data?.learningProgress.map((row) => [keyOf(row.topic_name, row.subtopic_id), row]));
    const challenges = new Map(data?.challengeProgress.map((row) => [keyOf(row.topic_name, row.round_number), row]));
    return { learning, challenges };
  }, [data]);

  if (!data && !error) return <LoadingState label="Building your learning dashboard…" />;
  if (error) return <p className="form-error">{error}</p>;
  const passedModules = data.learningProgress.filter((row) => row.passed).length;
  const totalModules = data.learningTopics.reduce((sum, topic) => sum + topic.modules.length, 0);
  const progressPercent = totalModules ? Math.round((passedModules / totalModules) * 100) : 0;

  return (
    <div className="page">
      <header className="dashboard-hero">
        <div>
          <Link className="back-link" to="/courses">← Change course</Link>
          <p className="eyebrow">Your learning dashboard</p>
          <h1>Welcome back, {user.username}.</h1>
          <p>{data.course.title} · Build skill one perfect score at a time.</p>
        </div>
        <div className="progress-medallion">
          <strong>{progressPercent}%</strong><span>course mastery</span>
        </div>
      </header>

      <section className="section-heading">
        <div><p className="eyebrow">Learning journey</p><h2>Study the theory, then master the quiz.</h2></div>
        <span>{passedModules} of {totalModules} learned</span>
      </section>
      <div className="topic-stack">
        {data.learningTopics.map((topic, topicIndex) => (
          <details className="topic-panel" key={topic.name} open={topicIndex === 0}>
            <summary><span>{String(topicIndex + 1).padStart(2, "0")}</span><strong>{topic.name}</strong><small>{topic.modules.length} modules</small><ChevronDown /></summary>
            <div className="module-grid">
              {topic.modules.map((module, index) => {
                const progress = maps.learning.get(keyOf(topic.name, module.id));
                const previous = index ? maps.learning.get(keyOf(topic.name, topic.modules[index - 1].id)) : null;
                const unlocked = index === 0 || previous?.passed;
                return (
                  <article className={`module-card ${progress?.passed ? "complete" : ""} ${!unlocked ? "locked" : ""}`} key={module.id}>
                    <div className="module-status">{progress?.passed ? <Check /> : unlocked ? <Play /> : <LockKeyhole />}</div>
                    <p className="eyebrow">Module {index + 1}</p>
                    <h3>{module.title}</h3>
                    <p>{progress?.passed ? `Learned · Best ${progress.high_score}/${module.questionCount}` : unlocked ? `${module.questionCount} question mastery quiz` : "Pass the previous module to unlock"}</p>
                    {unlocked
                      ? <Link to={`/course/${courseId}/learn/${encodeURIComponent(topic.name)}/${module.id}`}>Learn <ArrowRight /></Link>
                      : <span className="disabled-link">Locked <LockKeyhole /></span>}
                  </article>
                );
              })}
            </div>
          </details>
        ))}
      </div>

      <section className="section-heading challenge-heading">
        <div><p className="eyebrow">Challenge rounds</p><h2>Test what you can do without the lesson.</h2></div>
        <Trophy />
      </section>
      <div className="topic-stack">
        {data.challengeTopics.map((topic, topicIndex) => (
          <details className="topic-panel challenge" key={topic.name} open={topicIndex === 0}>
            <summary><span>{String(topicIndex + 1).padStart(2, "0")}</span><strong>{topic.name}</strong><small>{topic.rounds.length} rounds</small><ChevronDown /></summary>
            <div className="round-list">
              {topic.rounds.map((round, index) => {
                const progress = maps.challenges.get(keyOf(topic.name, round.roundNumber));
                const previous = index ? maps.challenges.get(keyOf(topic.name, topic.rounds[index - 1].roundNumber)) : null;
                const unlocked = index === 0 || previous?.passed;
                return (
                  <article className={!unlocked ? "locked" : ""} key={round.roundNumber}>
                    <span className="round-number">{round.roundNumber}</span>
                    <div><h3>{round.title}</h3><p>{progress?.passed ? `Passed · Best ${progress.high_score}/${round.questionCount}` : `${round.questionCount} questions`}</p></div>
                    {unlocked
                      ? <Link className="button secondary" to={`/course/${courseId}/challenge/${encodeURIComponent(topic.name)}/${round.roundNumber}`}>{progress?.passed ? "Replay" : "Start"}</Link>
                      : <span className="disabled-link"><LockKeyhole /> Locked</span>}
                  </article>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
