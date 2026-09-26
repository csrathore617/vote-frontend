import type { VoterResponse } from "../../types/voter";

export function VoterResultsTable({ voters }: { voters: VoterResponse[] }) {
  if (voters.length === 0) {
    return <p className="no-results">No records match your search.</p>;
  }

  return (
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
        </tr>
      </thead>
      <tbody>
        {voters.map((voter) => (
          <tr key={voter.id}>
            <td>{voter.serialNo}</td>
            <td>{voter.voterIdCode ?? "—"}</td>
            <td>{voter.name}</td>
            <td>{voter.relationName ?? "—"}</td>
            <td>{voter.houseNumber ?? "—"}</td>
            <td>{voter.age ?? "—"}</td>
            <td>{voter.gender ?? "—"}</td>
            <td>{voter.dataBlockId}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
