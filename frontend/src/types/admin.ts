import type { NameMatchMode } from "./voter";

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  enabled: boolean;
  roles: string[];
}

export interface DataBlock {
  id: string;
  displayName: string;
  description: string | null;
  active: boolean;
}

export interface AccessGrant {
  id: number;
  userId: number;
  userEmail: string;
  dataBlockId: string;
  grantedByUserId: number | null;
  grantedAt: string;
  revokedAt: string | null;
}

export interface MasterVoter {
  id: number;
  sourceBatch: string | null;
  serialNo: number;
  voterIdCode: string | null;
  name: string;
  relationName: string | null;
  houseNumber: string | null;
  age: number | null;
  gender: string | null;
  sourcePage: number | null;
}

export interface MasterVoterFilter {
  serialNo?: number;
  voterIdCode?: string;
  name?: string;
  relationName?: string;
  nameMatchMode?: NameMatchMode;
  houseNumber?: string;
  gender?: string;
  ageMin?: number;
  ageMax?: number;
  sourceBatch?: string;
}

/** For a dry run, {@code added} is how many WOULD be copied into the block. */
export interface PopulationResult {
  matched: number;
  added: number;
  alreadyInBlock: number;
  dryRun: boolean;
}
