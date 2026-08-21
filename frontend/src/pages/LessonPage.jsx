import { ArrowLeft, BookOpenText } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { apiJson } from "../api";
import LoadingState from "../components/LoadingState";
import QuizForm from "../components/QuizForm";

export default function LessonPage() {
  const { courseId, topic, moduleId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState("");
  const base = `/api/courses/${courseId}/learn/${encodeURIComponent(topic)}/${moduleId}`;
  useEffect(() => {
    apiJson(base).then(setLesson).catch((caught) => setError(caught.message));
  }, [base]);
  if (!lesson && !error) return <LoadingState label="Opening your lesson…" />;
  if (error) return <p className="form-error">{error}</p>;

  return (
    <div className="page lesson-page">
      <Link className="back-link" to={`/course/${courseId}`}><ArrowLeft /> Back to dashboard</Link>
      <header className="lesson-header">
        <span className="lesson-icon"><BookOpenText /></span>
        <p className="eyebrow">{topic}</p>
        <h1>{lesson.title}</h1>
        <p>Read the lesson carefully. A perfect quiz score unlocks the next module.</p>
      </header>
      {lesson.image && <img className="lesson-image" src={lesson.image} alt="" />}
      <article className="lesson-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            table: ({ children }) => (
              <div className="markdown-table-wrap">
                <table>{children}</table>
              </div>
            ),
          }}
        >
          {lesson.content}
        </ReactMarkdown>
      </article>
      <QuizForm
        questions={lesson.questions}
        requiredScore={lesson.requiredScore}
        onSubmit={(answers) => apiJson(`${base}/submit`, { method: "POST", body: JSON.stringify({ answers }) })}
      />
    </div>
  );
}
