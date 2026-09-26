import type { KeyboardEvent } from "react";
import type { VoterResponse } from "../../types/voter";

function StatusBadge({ voted }: { voted: boolean | null }) {
  if (voted === true) {
    return <span className="status-badge status-voted">Voted</span>;
  }
  if (voted === false) {
    return <span className="status-badge status-not-voted">Not voted</span>;
  }
  return <span className="status-badge status-unmarked">—</span>;
}

interface Props {
  voters: VoterResponse[];
  onSelectVoter: (voter: VoterResponse) => void;
}

export function VoterResultsTable({ voters, onSelectVoter }: Props) {
  if (voters.length === 0) {
    return <p className="no-results">No records match your search.</p>;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTableRowElement>, voter: VoterResponse) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelectVoter(voter);
    }
  }

  return (
    <div className="table-scroll">
      <table className="voter-results-table">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Voter ID</th>
            <th>Name</th>
            <th>Father&apos;s / husband&apos;s name</th>
            <th>House No.</th>
            <th>Age</th>
            <th>Gender</th>
            <th>Data block</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {voters.map((voter) => (
            <tr
              key={voter.id}
              className="clickable-row"
              tabIndex={0}
              role="button"
              onClick={() => onSelectVoter(voter)}
              onKeyDown={(e) => handleKeyDown(e, voter)}
            >
              <td>{voter.serialNo}</td>
              <td>{voter.voterIdCode ?? "—"}</td>
              <td>{voter.name}</td>
              <td>{voter.relationName ?? "—"}</td>
              <td>{voter.houseNumber ?? "—"}</td>
              <td>{voter.age ?? "—"}</td>
              <td>{voter.gender ?? "—"}</td>
              <td>{voter.dataBlockId}</td>
              <td>
                <StatusBadge voted={voter.voted} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
