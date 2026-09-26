import axios from "axios";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  listDataBlocks,
  populateBlockFromFilter,
  populateBlockFromIds,
  searchMasterVoters,
} from "../../api/adminApi";
import { ErrorBanner } from "../../components/common/ErrorBanner";
import { GENDER_OPTIONS } from "../../components/search/VoterSearchForm";
import { Pagination } from "../../components/search/Pagination";
import type { DataBlock, MasterVoter, MasterVoterFilter, PopulationResult } from "../../types/admin";
import type { NameMatchMode, PagedResponse } from "../../types/voter";

const PAGE_SIZE = 25;

function apiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const details = error.response?.data?.details;
    if (Array.isArray(details) && details.length > 0) {
      return String(details[0]);
    }
  }
  return fallback;
}

function hasAnyCriterion(filter: MasterVoterFilter): boolean {
  return Object.entries(filter).some(([key, value]) => key !== "nameMatchMode" && value !== undefined);
}

/**
 * Admin-only. Filter the master electoral roll, then copy matches into a data
 * block -- either everything the filter matches (after a dry-run preview) or
 * hand-picked rows. Every candidate's block is its own copy, so state marked
 * in one block never shows up in another.
 */
export function AdminBlockBuilderPage() {
  const [blocks, setBlocks] = useState<DataBlock[]>([]);
  const [blockId, setBlockId] = useState("");

  const [serialNo, setSerialNo] = useState("");
  const [voterIdCode, setVoterIdCode] = useState("");
  const [name, setName] = useState("");
  const [relationName, setRelationName] = useState("");
  const [nameMatchMode, setNameMatchMode] = useState<NameMatchMode>("PREFIX");
  const [houseNumber, setHouseNumber] = useState("");
  const [gender, setGender] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [sourceBatch, setSourceBatch] = useState("");

  const [results, setResults] = useState<PagedResponse<MasterVoter> | null>(null);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [preview, setPreview] = useState<{ key: string; result: PopulationResult } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    listDataBlocks(0, 100)
      .then((page) => setBlocks(page.content))
      .catch(() => setError("Could not load data blocks."));
  }, []);

  const filter: MasterVoterFilter = useMemo(
    () => ({
      serialNo: serialNo ? Number(serialNo) : undefined,
      voterIdCode: voterIdCode.trim() || undefined,
      name: name.trim() || undefined,
      relationName: relationName.trim() || undefined,
      nameMatchMode,
      houseNumber: houseNumber.trim() || undefined,
      gender: gender || undefined,
      ageMin: ageMin ? Number(ageMin) : undefined,
      ageMax: ageMax ? Number(ageMax) : undefined,
      sourceBatch: sourceBatch.trim() || undefined,
    }),
    [serialNo, voterIdCode, name, relationName, nameMatchMode, houseNumber, gender, ageMin, ageMax, sourceBatch],
  );

  // A preview is only trustworthy for the exact block + filter it was run for.
  const previewKey = JSON.stringify({ blockId, filter });
  const validPreview = preview && preview.key === previewKey ? preview.result : null;
  const filterHasCriterion = hasAnyCriterion(filter);

  async function runSearch(page: number) {
    setBusy(true);
    setError(null);
    try {
      setResults(await searchMasterVoters({ ...filter, page, size: PAGE_SIZE }));
    } catch (e) {
      setError(apiErrorMessage(e, "Could not search master data."));
    } finally {
      setBusy(false);
    }
  }

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    setNotice(null);
    runSearch(0);
  }

  async function handlePreview() {
    setBusy(true);
    setError(null);
    setNotice(null);
    try {
      const result = await populateBlockFromFilter(blockId, filter, true);
      setPreview({ key: previewKey, result });
    } catch (e) {
      setError(apiErrorMessage(e, "Could not preview."));
    } finally {
      setBusy(false);
    }
  }

  async function handleAddAll() {
    if (!validPreview || validPreview.added === 0) {
      return;
    }
    if (!window.confirm(`Copy ${validPreview.added} voters into ${blockId}?`)) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await populateBlockFromFilter(blockId, filter, false);
      setNotice(`Added ${result.added} voters to ${blockId} (${result.alreadyInBlock} were already there).`);
      setPreview(null);
    } catch (e) {
      setError(apiErrorMessage(e, "Could not add voters to the block."));
    } finally {
      setBusy(false);
    }
  }

  async function handleAddSelected() {
    if (selected.size === 0 || !window.confirm(`Copy ${selected.size} selected voters into ${blockId}?`)) {
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const result = await populateBlockFromIds(blockId, [...selected], false);
      setNotice(`Added ${result.added} voters to ${blockId} (${result.alreadyInBlock} were already there).`);
      setSelected(new Set());
      setPreview(null);
    } catch (e) {
      setError(apiErrorMessage(e, "Could not add the selected voters."));
    } finally {
      setBusy(false);
    }
  }

  function toggle(id: number) {
    setSelected((current) => {
      const next = new Set(current);
      if (!next.delete(id)) {
        next.add(id);
      }
      return next;
    });
  }

  const pageIds = results?.content.map((voter) => voter.id) ?? [];
  const allOnPageSelected = pageIds.length > 0 && pageIds.every((id) => selected.has(id));

  function togglePage() {
    setSelected((current) => {
      const next = new Set(current);
      pageIds.forEach((id) => (allOnPageSelected ? next.delete(id) : next.add(id)));
      return next;
    });
  }

  return (
    <div className="block-builder-page">
      <h2>Block Builder</h2>
      <p className="hint">
        Filter the master roll, then copy voters into a candidate&apos;s data block. Each block gets its own copy, so
        marking a voter in one block never affects another. Create the block first on the Data Blocks tab.
      </p>

      {error && <ErrorBanner message={error} />}
      {notice && (
        <div className="success-banner" role="status">
          {notice}
        </div>
      )}

      <label className="field builder-target">
        Target data block
        <select value={blockId} onChange={(e) => setBlockId(e.target.value)}>
          <option value="">Select a block…</option>
          {blocks.map((block) => (
            <option key={block.id} value={block.id}>
              {block.displayName} ({block.id})
            </option>
          ))}
        </select>
      </label>

      <form className="voter-search-form" onSubmit={handleSearch}>
        <label className="field">
          Source batch
          <input value={sourceBatch} onChange={(e) => setSourceBatch(e.target.value)} placeholder="e.g. VILLAGE-A-2025" />
        </label>
        <label className="field">
          Serial No.
          <input type="number" value={serialNo} onChange={(e) => setSerialNo(e.target.value)} />
        </label>
        <label className="field">
          Voter ID
          <input value={voterIdCode} onChange={(e) => setVoterIdCode(e.target.value)} />
        </label>
        <label className="field">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label className="field">
          Father&apos;s / husband&apos;s name
          <input value={relationName} onChange={(e) => setRelationName(e.target.value)} />
        </label>
        <label className="field">
          Name match
          <select value={nameMatchMode} onChange={(e) => setNameMatchMode(e.target.value as NameMatchMode)}>
            <option value="PREFIX">Starts with (fast)</option>
            <option value="CONTAINS">Contains (slower)</option>
          </select>
        </label>
        <label className="field">
          House number
          <input value={houseNumber} onChange={(e) => setHouseNumber(e.target.value)} />
        </label>
        <label className="field">
          Gender
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            {GENDER_OPTIONS.map((option) => (
              <option key={option.value || "any"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Age
          <span className="age-range">
            <input type="number" value={ageMin} onChange={(e) => setAgeMin(e.target.value)} placeholder="min" />
            <input type="number" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} placeholder="max" />
          </span>
        </label>
        <button type="submit" disabled={busy}>
          {busy ? "Working…" : "Search master"}
        </button>
      </form>

      <section className="builder-actions">
        <button type="button" onClick={handlePreview} disabled={busy || !blockId || !filterHasCriterion}>
          Preview adding all matches
        </button>
        {!filterHasCriterion && <span className="hint">Enter at least one filter to add by filter.</span>}
        {validPreview && (
          <span className="preview-box" role="status">
            {validPreview.matched} match · <strong>{validPreview.added} new</strong> · {validPreview.alreadyInBlock} already
            in {blockId}
          </span>
        )}
        <button type="button" onClick={handleAddAll} disabled={busy || !validPreview || validPreview.added === 0}>
          Add {validPreview ? validPreview.added : ""} to block
        </button>
      </section>

      {results && (
        <>
          <p className="result-count">
            {results.totalElements} master voter{results.totalElements === 1 ? "" : "s"} match
            {selected.size > 0 && ` · ${selected.size} selected`}
          </p>
          {selected.size > 0 && (
            <div className="builder-actions">
              <button type="button" onClick={handleAddSelected} disabled={busy || !blockId}>
                Add {selected.size} selected to block
              </button>
              <button type="button" onClick={() => setSelected(new Set())} disabled={busy}>
                Clear selection
              </button>
              {!blockId && <span className="hint">Choose a target block first.</span>}
            </div>
          )}
          {results.content.length === 0 ? (
            <p className="no-results">No master records match.</p>
          ) : (
            <div className="table-scroll">
              <table className="voter-results-table">
                <thead>
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        aria-label="Select all on this page"
                        checked={allOnPageSelected}
                        onChange={togglePage}
                      />
                    </th>
                    <th>Serial No.</th>
                    <th>Voter ID</th>
                    <th>Name</th>
                    <th>Father&apos;s / husband&apos;s name</th>
                    <th>House No.</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Batch</th>
                  </tr>
                </thead>
                <tbody>
                  {results.content.map((voter) => (
                    <tr key={voter.id}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`Select ${voter.name}`}
                          checked={selected.has(voter.id)}
                          onChange={() => toggle(voter.id)}
                        />
                      </td>
                      <td>{voter.serialNo}</td>
                      <td>{voter.voterIdCode ?? "—"}</td>
                      <td>{voter.name}</td>
                      <td>{voter.relationName ?? "—"}</td>
                      <td>{voter.houseNumber ?? "—"}</td>
                      <td>{voter.age ?? "—"}</td>
                      <td>{voter.gender ?? "—"}</td>
                      <td>{voter.sourceBatch ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={results.page} totalPages={results.totalPages} onChange={runSearch} />
        </>
      )}
    </div>
  );
}
