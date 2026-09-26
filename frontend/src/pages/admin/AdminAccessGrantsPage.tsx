import { useEffect, useState, type FormEvent } from "react";
import { grantAccess, listAccessGrants, listUsers, revokeAccess } from "../../api/adminApi";
import { ErrorBanner } from "../../components/common/ErrorBanner";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import type { AccessGrant, AdminUser } from "../../types/admin";

export function AdminAccessGrantsPage() {
  const [grants, setGrants] = useState<AccessGrant[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState("");
  const [dataBlockId, setDataBlockId] = useState("");

  async function refresh() {
    setLoading(true);
    try {
      const [grantsPage, usersPage] = await Promise.all([listAccessGrants({}), listUsers(0, 200)]);
      setGrants(grantsPage.content);
      setUsers(usersPage.content);
      setError(null);
    } catch {
      setError("Could not load access grants.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function handleGrant(event: FormEvent) {
    event.preventDefault();
    try {
      await grantAccess(Number(userId), dataBlockId.toUpperCase());
      setUserId("");
      setDataBlockId("");
      await refresh();
    } catch {
      setError("Could not grant access. Check the user id and data block id.");
    }
  }

  async function handleRevoke(grantId: number) {
    try {
      await revokeAccess(grantId);
      await refresh();
    } catch {
      setError("Could not revoke access.");
    }
  }

  return (
    <div className="admin-access-grants-page">
      <h2>Access Grants</h2>
      <p className="hint">
        Granting or revoking access takes effect the next time that user logs in and gets a fresh token -- it does not
        change access for a session already in progress.
      </p>
      {error && <ErrorBanner message={error} />}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Data block</th>
                <th>Granted at</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {grants.map((grant) => (
                <tr key={grant.id}>
                  <td>{grant.userEmail}</td>
                  <td>{grant.dataBlockId}</td>
                  <td>{new Date(grant.grantedAt).toLocaleString()}</td>
                  <td>{grant.revokedAt ? "Revoked" : "Active"}</td>
                  <td>{!grant.revokedAt && <button type="button" onClick={() => handleRevoke(grant.id)}>Revoke</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3>Grant access</h3>
      <form onSubmit={handleGrant} className="admin-create-form">
        <select value={userId} onChange={(e) => setUserId(e.target.value)} required>
          <option value="" disabled>
            Select a user
          </option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email} ({user.fullName})
            </option>
          ))}
        </select>
        <input
          placeholder="Data block ID"
          value={dataBlockId}
          onChange={(e) => setDataBlockId(e.target.value.toUpperCase())}
          required
        />
        <button type="submit">Grant</button>
      </form>
    </div>
  );
}
