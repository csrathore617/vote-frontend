import { useEffect, useState, type FormEvent } from "react";
import { createDataBlock, listDataBlocks } from "../../api/adminApi";
import { ErrorBanner } from "../../components/common/ErrorBanner";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import type { DataBlock } from "../../types/admin";

export function AdminDataBlocksPage() {
  const [blocks, setBlocks] = useState<DataBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");

  async function refresh() {
    setLoading(true);
    try {
      const page = await listDataBlocks();
      setBlocks(page.content);
      setError(null);
    } catch {
      setError("Could not load data blocks.");
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
      await createDataBlock({ id, displayName, description: description || undefined });
      setId("");
      setDisplayName("");
      setDescription("");
      await refresh();
    } catch {
      setError("Could not create the data block. Check the id format (e.g. SIKAR-WARD-22).");
    }
  }

  return (
    <div className="admin-data-blocks-page">
      <h2>Data Blocks</h2>
      {error && <ErrorBanner message={error} />}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Display name</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => (
                <tr key={block.id}>
                  <td>{block.id}</td>
                  <td>{block.displayName}</td>
                  <td>{block.active ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3>Create data block</h3>
      <form onSubmit={handleCreate} className="admin-create-form">
        <input
          placeholder="ID (e.g. SIKAR-WARD-22)"
          value={id}
          onChange={(e) => setId(e.target.value.toUpperCase())}
          required
        />
        <input placeholder="Display name" value={displayName} onChange={(e) => setDisplayName(e.target.value)} required />
        <input placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
