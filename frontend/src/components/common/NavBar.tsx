import { Link } from "react-router-dom";
import { hasAdminRole } from "../../auth/roles";
import { useAuth } from "../../auth/useAuth";

export function NavBar() {
  const { user, logout } = useAuth();
  const isAdmin = hasAdminRole(user?.roles);

  return (
    <nav className="navbar">
      <Link to="/search" className="navbar-brand">
        Voter Roll Search
      </Link>
      <div className="navbar-links">
        {/* Cosmetic only -- hiding this link doesn't grant/deny anything; the
            backend's hasRole("ADMIN") check is the actual boundary. */}
        {isAdmin && <Link to="/admin">Admin</Link>}
        <span className="navbar-user">{user?.email}</span>
        <button type="button" onClick={logout}>
          Sign out
        </button>
      </div>
    </nav>
  );
}
