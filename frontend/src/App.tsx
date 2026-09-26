import { Navigate, Route, Routes } from "react-router-dom";
import { AdminRoute, ProtectedRoute } from "./auth/ProtectedRoute";
import { AdminAccessGrantsPage } from "./pages/admin/AdminAccessGrantsPage";
import { AdminDataBlocksPage } from "./pages/admin/AdminDataBlocksPage";
import { AdminLayout } from "./pages/admin/AdminLayout";
import { AdminUsersPage } from "./pages/admin/AdminUsersPage";
import { ForbiddenPage } from "./pages/ForbiddenPage";
import { LoginPage } from "./pages/LoginPage";
import { SearchPage } from "./pages/SearchPage";

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route
        path="/search"
        element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="users" replace />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="data-blocks" element={<AdminDataBlocksPage />} />
        <Route path="access-grants" element={<AdminAccessGrantsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/search" replace />} />
    </Routes>
  );
}
