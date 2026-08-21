import { ArrowRight, BookMarked, CalendarDays, Layers3, RefreshCw, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiJson } from "../api";
import LoadingState from "../components/LoadingState";

function formatCourseDate(value) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

export default function CoursesPage() {
  const [courses, setCourses] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiJson("/api/courses").then(setCourses).catch((caught) => setError(caught.message));
  }, []);
  if (!courses && !error) return <LoadingState label="Opening the course library…" />;

  return (
    <div className="page">
      <header className="page-hero compact">
        <p className="eyebrow">Course library</p>
        <h1>Your TypeScript learning path.</h1>
        <p>Build the language foundations, practise each concept, and prove your mastery in a focused challenge.</p>
      </header>
      {error && <p className="form-error">{error}</p>}
      <section className={`course-grid ${courses?.length === 1 ? "single" : ""}`}>
        {courses?.map((course, index) => (
          <article className={`course-card accent-${course.accent}`} key={course.id}>
            <div className="course-number">0{index + 1}</div>
            <span className="course-icon"><BookMarked /></span>
            <p className="eyebrow">Programming pathway</p>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <div className="course-stats">
              <span><Layers3 /> {course.moduleCount} modules</span>
              <span><Trophy /> {course.roundCount} {course.roundCount === 1 ? "challenge" : "challenges"}</span>
            </div>
            <div className="course-dates" aria-label="Course dates">
              <span><CalendarDays /> Created {formatCourseDate(course.createdAt)}</span>
              <span><RefreshCw /> Updated {formatCourseDate(course.updatedAt)}</span>
            </div>
            <Link className="button primary" to={`/course/${course.id}`}>
              Open course <ArrowRight size={18} />
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
