import { NavLink, Outlet } from "react-router-dom";
import { NavBar } from "../../components/common/NavBar";

export function AdminLayout() {
  return (
    <div className="admin-layout">
      <NavBar />
      <nav className="admin-tabs">
        <NavLink to="/admin/users">Users</NavLink>
        <NavLink to="/admin/data-blocks">Data Blocks</NavLink>
        <NavLink to="/admin/access-grants">Access Grants</NavLink>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
