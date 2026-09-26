export interface UserSummary {
  id: number;
  email: string;
  fullName: string;
  enabled: boolean;
  roles: string[];
}

export interface AccessibleDataBlock {
  id: string;
  displayName: string;
}

export interface LoginResponse {
  token: string;
  user: UserSummary;
  accessibleDataBlocks: AccessibleDataBlock[];
}
