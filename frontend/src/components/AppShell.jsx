import { BookOpen, GraduationCap, LogOut, Settings, UserRound } from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../App";

export default function AppShell() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const courseMatch = location.pathname.match(/^\/course\/([^/]+)/);
  const courseId = courseMatch?.[1];

  const signOut = async () => {
    await logout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="app-frame">
      <header className="topbar">
        <NavLink className="brand" to="/courses" aria-label="Programming Focused courses">
          <span className="brand-mark"><GraduationCap size={22} /></span>
          <span><strong>Programming</strong> Focused</span>
        </NavLink>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/courses"><BookOpen size={18} /> Courses</NavLink>
          {courseId && <NavLink to={`/course/${courseId}`}>Dashboard</NavLink>}
          <NavLink to="/profile"><UserRound size={18} /> {user.username}</NavLink>
          <NavLink className="settings-nav-link" to="/settings" aria-label="Settings" title="Settings">
            <Settings size={19} /><span>Settings</span>
          </NavLink>
          <button className="nav-button" type="button" onClick={signOut}><LogOut size={18} /> Sign out</button>
        </nav>
      </header>
      <main className="main-content"><Outlet /></main>
    </div>
  );
}
