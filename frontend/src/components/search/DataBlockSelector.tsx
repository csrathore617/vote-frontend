import type { ChangeEvent } from "react";
import { useAuth } from "../../auth/useAuth";

interface Props {
  value: string;
  onChange: (dataBlockId: string) => void;
}

/**
 * Populated directly from {@link useAuth}'s {@code accessibleDataBlocks}
 * (sourced from the login response) -- no extra API call. The "All my
 * datasets" option is an empty string, which the search form omits from the
 * request entirely rather than sending as {@code dataBlockId=""}.
 */
export function DataBlockSelector({ value, onChange }: Props) {
  const { accessibleDataBlocks } = useAuth();

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    onChange(event.target.value);
  }

  return (
    <label className="field">
      Dataset
      <select value={value} onChange={handleChange}>
        <option value="">All my datasets</option>
        {accessibleDataBlocks.map((block) => (
          <option key={block.id} value={block.id}>
            {block.displayName}
          </option>
        ))}
      </select>
    </label>
  );
}
