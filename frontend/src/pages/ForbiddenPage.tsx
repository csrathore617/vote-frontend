import { Link } from "react-router-dom";

export function ForbiddenPage() {
  return (
    <div className="page-message">
      <h1>Access denied</h1>
      <p>You don&apos;t have permission to view this page.</p>
      <Link to="/search">Back to search</Link>
    </div>
  );
}
