import { useEffect, useState, type FormEvent } from "react";
import { createUser, listUsers } from "../../api/adminApi";
import { ErrorBanner } from "../../components/common/ErrorBanner";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import type { AdminUser } from "../../types/admin";

export function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER");

  async function refresh() {
    setLoading(true);
    try {
      const page = await listUsers();
      setUsers(page.content);
      setError(null);
    } catch {
      setError("Could not load users.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleCreate(event: FormEvent) {
    event.preventDefault();
    try {
      await createUser({ email, fullName, password, roles: [role] });
      setEmail("");
      setFullName("");
      setPassword("");
      await refresh();
    } catch {
      setError("Could not create the user.");
    }
  }

  return (
    <div className="admin-users-page">
      <h2>Users</h2>
      {error && <ErrorBanner message={error} />}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name</th>
              <th>Roles</th>
              <th>Enabled</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.email}</td>
                <td>{user.fullName}</td>
                <td>{user.roles.join(", ")}</td>
                <td>{user.enabled ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Create user</h3>
      <form onSubmit={handleCreate} className="admin-create-form">
        <input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input
          placeholder="Password (min 8 characters)"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="USER">USER</option>
          <option value="ADMIN">ADMIN</option>
        </select>
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
