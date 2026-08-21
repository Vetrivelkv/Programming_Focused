import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";
import { useState } from "react";

export default function QuizForm({ questions, requiredScore, onSubmit, submitLabel = "Submit answers" }) {
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(""));
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const updateAnswer = (index, value) => {
    setAnswers((current) => current.map((answer, i) => i === index ? value : answer));
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      setResult(await onSubmit(answers));
    } catch (caught) {
      setError(caught.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <section className={`result-card ${result.passed ? "success" : "retry"}`}>
        <div className="result-heading">
          {result.passed ? <CheckCircle2 /> : <RotateCcw />}
          <div>
            <p className="eyebrow">{result.passed ? "Module complete" : "Keep learning"}</p>
            <h2>{result.score} / {result.total}</h2>
          </div>
        </div>
        <p>{result.passed
          ? "Perfect score — the next item is now unlocked."
          : `A perfect ${requiredScore}/${requiredScore} is needed. Review the feedback and try again.`}</p>
        <div className="feedback-list">
          {result.feedback.map((item) => (
            <details key={item.index}>
              <summary>{item.correct ? <CheckCircle2 /> : <XCircle />} Question {item.index} — {item.correct ? "Correct" : `Correct answer: ${item.correctAnswer}`}</summary>
              <p>{item.explanation}</p>
            </details>
          ))}
        </div>
        <button className="button secondary" type="button" onClick={() => setResult(null)}>Try the quiz again</button>
      </section>
    );
  }

  return (
    <form className="quiz-form" onSubmit={submit}>
      <div className="quiz-intro">
        <div><p className="eyebrow">Knowledge check</p><h2>Subtopic quiz</h2></div>
        <span className="goal-pill">Goal: {requiredScore}/{requiredScore}</span>
      </div>
      {questions.map((question, index) => (
        <fieldset className="question-card" key={`${question.question}-${index}`}>
          <legend><span>{String(index + 1).padStart(2, "0")}</span>{question.question}</legend>
          {question.type === "fib" ? (
            <input
              className="text-answer"
              value={answers[index]}
              onChange={(event) => updateAnswer(index, event.target.value)}
              placeholder="Type your answer"
              required
            />
          ) : question.options.map((option) => (
            <label className={`option ${answers[index] === option ? "selected" : ""}`} key={option}>
              <input type="radio" name={`question-${index}`} value={option} required
                checked={answers[index] === option}
                onChange={(event) => updateAnswer(index, event.target.value)} />
              <span>{option}</span>
            </label>
          ))}
        </fieldset>
      ))}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button primary full" disabled={submitting} type="submit">
        {submitting ? "Checking…" : submitLabel}
      </button>
    </form>
  );
}
