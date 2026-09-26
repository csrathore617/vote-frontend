export type NameMatchMode = "PREFIX" | "CONTAINS";

export interface VoterSearchParams {
  dataBlockId?: string;
  serialNo?: number;
  voterIdCode?: string;
  name?: string;
  relationName?: string;
  nameMatchMode?: NameMatchMode;
  houseNumber?: string;
  gender?: string;
  ageMin?: number;
  ageMax?: number;
  page?: number;
  size?: number;
}

export interface VoterResponse {
  id: number;
  dataBlockId: string;
  serialNo: number;
  voterIdCode: string | null;
  name: string;
  relationName: string | null;
  houseNumber: string | null;
  age: number | null;
  gender: string | null;
  sourcePage: number | null;
  voted: boolean | null;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}
