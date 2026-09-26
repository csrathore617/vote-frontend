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
