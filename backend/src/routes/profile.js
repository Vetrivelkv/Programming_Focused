import asyncRoute from "../lib/async-route.js";
import { listCourses } from "../logic/courses.js";
import { getChallengeProgress, getLearningProgress } from "../models/progress.js";

export default function registerProfileRoutes(app) {
  app.get("/api/profile", asyncRoute(async (request, response) => {
    const courses = await Promise.all(listCourses().map(async (course) => {
      const [learning, challenges] = await Promise.all([
        getLearningProgress(request.user.id, course.id),
        getChallengeProgress(request.user.id, course.id),
      ]);
      return { ...course, learning, challenges };
    }));
    response.json({ user: request.user, courses });
  }));
}
