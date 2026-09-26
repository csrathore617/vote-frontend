import { useState } from "react";
import { updateVotingStatus } from "../../api/voterApi";
import type { VoterResponse } from "../../types/voter";
import { ErrorBanner } from "../common/ErrorBanner";

interface Props {
  voter: VoterResponse;
  onClose: () => void;
  onUpdated: (voter: VoterResponse) => void;
}

export function VotingStatusModal({ voter, onClose, onUpdated }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function mark(voted: boolean) {
    setSubmitting(true);
    setError(null);
    try {
      const updated = await updateVotingStatus(voter.id, voted);
      onUpdated(updated);
      onClose();
    } catch {
      setError("Could not save the voting status. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <h3>{voter.name}</h3>
        <dl className="voter-detail-list">
          <dt>Voter ID</dt>
          <dd>{voter.voterIdCode ?? "—"}</dd>
          <dt>Serial No.</dt>
          <dd>{voter.serialNo}</dd>
          <dt>Data block</dt>
          <dd>{voter.dataBlockId}</dd>
          <dt>Current status</dt>
          <dd>{voter.voted === true ? "Voted" : voter.voted === false ? "Not voted" : "Not marked yet"}</dd>
        </dl>

        {error && <ErrorBanner message={error} />}

        <div className="modal-actions">
          <button type="button" disabled={submitting} onClick={() => mark(true)}>
            Mark Voted
          </button>
          <button type="button" disabled={submitting} onClick={() => mark(false)}>
            Mark Not Voted
          </button>
          <button type="button" className="secondary" disabled={submitting} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
