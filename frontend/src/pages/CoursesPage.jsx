import { ArrowRight, BookMarked, Layers3, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiJson } from "../api";
import LoadingState from "../components/LoadingState";

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
        <h1>Choose today’s learning path.</h1>
        <p>Each course keeps its own progress, mastery scores, and unlocked lessons.</p>
      </header>
      {error && <p className="form-error">{error}</p>}
      <section className="course-grid">
        {courses?.map((course, index) => (
          <article className={`course-card accent-${course.accent}`} key={course.id}>
            <div className="course-number">0{index + 1}</div>
            <span className="course-icon"><BookMarked /></span>
            <p className="eyebrow">Programming pathway</p>
            <h2>{course.title}</h2>
            <p>{course.description}</p>
            <div className="course-stats">
              <span><Layers3 /> {course.moduleCount} modules</span>
              <span><Trophy /> {course.roundCount} challenges</span>
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
