import { useState } from "react";
import { searchVoters } from "../api/voterApi";
import { ErrorBanner } from "../components/common/ErrorBanner";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { NavBar } from "../components/common/NavBar";
import { Pagination } from "../components/search/Pagination";
import { VoterResultsTable } from "../components/search/VoterResultsTable";
import { VoterSearchForm } from "../components/search/VoterSearchForm";
import type { PagedResponse, VoterResponse, VoterSearchParams } from "../types/voter";

export function SearchPage() {
  const [results, setResults] = useState<PagedResponse<VoterResponse> | null>(null);
  const [lastParams, setLastParams] = useState<VoterSearchParams | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch(params: VoterSearchParams) {
    setLoading(true);
    setError(null);
    try {
      const response = await searchVoters(params);
      setResults(response);
      setLastParams(params);
    } catch {
      setError("Could not complete the search. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handlePageChange(page: number) {
    if (lastParams) {
      runSearch({ ...lastParams, page });
    }
  }

  return (
    <div className="search-page">
      <NavBar />
      <main>
        <VoterSearchForm onSearch={runSearch} submitting={loading} />
        {error && <ErrorBanner message={error} />}
        {loading && <LoadingSpinner />}
        {!loading && results && (
          <>
            <p className="result-count">{results.totalElements} record(s) found</p>
            <VoterResultsTable voters={results.content} />
            <Pagination page={results.page} totalPages={results.totalPages} onChange={handlePageChange} />
          </>
        )}
      </main>
    </div>
  );
}
