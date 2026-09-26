import { useState, type FormEvent } from "react";
import type { NameMatchMode, VoterSearchParams } from "../../types/voter";
import { DataBlockSelector } from "./DataBlockSelector";

interface Props {
  onSearch: (params: VoterSearchParams) => void;
  submitting: boolean;
}

const GENDER_OPTIONS = [
  { value: "", label: "Any" },
  { value: "पुरुष", label: "पुरुष (Male)" },
  { value: "स्त्री", label: "स्त्री (Female)" },
  { value: "अज्ञात", label: "अज्ञात (Unknown)" },
];

export function VoterSearchForm({ onSearch, submitting }: Props) {
  const [dataBlockId, setDataBlockId] = useState("");
  const [serialNo, setSerialNo] = useState("");
  const [voterIdCode, setVoterIdCode] = useState("");
  const [name, setName] = useState("");
  const [relationName, setRelationName] = useState("");
  const [nameMatchMode, setNameMatchMode] = useState<NameMatchMode>("PREFIX");
  const [houseNumber, setHouseNumber] = useState("");
  const [gender, setGender] = useState("");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    onSearch({
      dataBlockId: dataBlockId || undefined,
      serialNo: serialNo ? Number(serialNo) : undefined,
      voterIdCode: voterIdCode || undefined,
      name: name || undefined,
      relationName: relationName || undefined,
      nameMatchMode,
      houseNumber: houseNumber || undefined,
      gender: gender || undefined,
      ageMin: ageMin ? Number(ageMin) : undefined,
      ageMax: ageMax ? Number(ageMax) : undefined,
      page: 0,
    });
  }

  return (
    <form className="voter-search-form" onSubmit={handleSubmit}>
      <DataBlockSelector value={dataBlockId} onChange={setDataBlockId} />

      <label className="field">
        Serial No.
        <input type="number" value={serialNo} onChange={(e) => setSerialNo(e.target.value)} />
      </label>

      <label className="field">
        Voter ID
        <input value={voterIdCode} onChange={(e) => setVoterIdCode(e.target.value)} placeholder="e.g. RJ/05/031/309517" />
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

      <button type="submit" disabled={submitting}>
        {submitting ? "Searching…" : "Search"}
      </button>
    </form>
  );
}
