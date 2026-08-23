import { ArrowLeft, BookOpenText, Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import { apiJson } from "../api";
import LoadingState from "../components/LoadingState";
import QuizForm from "../components/QuizForm";

function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);
  const code = children?.props?.children ?? "";
  const className = children?.props?.className ?? "";
  const language = className.replace("language-", "") || "code";

  const copyCode = async () => {
    await navigator.clipboard.writeText(String(code).replace(/\n$/, ""));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="markdown-code-block">
      <div className="markdown-code-toolbar">
        <span>{language}</span>
        <button type="button" onClick={copyCode} aria-label="Copy code snippet">
          {copied ? <Check /> : <Copy />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre>{children}</pre>
    </div>
  );
}

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
      {lesson.image && (
        <img className="lesson-image" src={lesson.image} alt={`${lesson.title} visual guide`} />
      )}
      <article className="lesson-content">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            pre: CodeBlock,
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
