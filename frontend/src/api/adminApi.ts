import type { AccessGrant, AdminUser, DataBlock } from "../types/admin";
import type { PagedResponse } from "../types/voter";
import client from "./client";

export async function listUsers(page = 0, size = 25): Promise<PagedResponse<AdminUser>> {
  const response = await client.get<PagedResponse<AdminUser>>("/api/admin/users", { params: { page, size } });
  return response.data;
}

export async function createUser(data: {
  email: string;
  fullName: string;
  password: string;
  roles: string[];
}): Promise<AdminUser> {
  const response = await client.post<AdminUser>("/api/admin/users", data);
  return response.data;
}

export async function updateUser(
  id: number,
  data: Partial<{ fullName: string; enabled: boolean; roles: string[] }>,
): Promise<AdminUser> {
  const response = await client.patch<AdminUser>(`/api/admin/users/${id}`, data);
  return response.data;
}

export async function listDataBlocks(page = 0, size = 25): Promise<PagedResponse<DataBlock>> {
  const response = await client.get<PagedResponse<DataBlock>>("/api/admin/data-blocks", { params: { page, size } });
  return response.data;
}

export async function createDataBlock(data: { id: string; displayName: string; description?: string }): Promise<DataBlock> {
  const response = await client.post<DataBlock>("/api/admin/data-blocks", data);
  return response.data;
}

export async function updateDataBlock(
  id: string,
  data: Partial<{ displayName: string; description: string; active: boolean }>,
): Promise<DataBlock> {
  const response = await client.patch<DataBlock>(`/api/admin/data-blocks/${id}`, data);
  return response.data;
}

export async function listAccessGrants(params: {
  userId?: number;
  dataBlockId?: string;
  page?: number;
  size?: number;
}): Promise<PagedResponse<AccessGrant>> {
  const response = await client.get<PagedResponse<AccessGrant>>("/api/admin/access-grants", { params });
  return response.data;
}

export async function grantAccess(userId: number, dataBlockId: string): Promise<AccessGrant> {
  const response = await client.post<AccessGrant>("/api/admin/access-grants", { userId, dataBlockId });
  return response.data;
}

export async function revokeAccess(grantId: number): Promise<void> {
  await client.delete(`/api/admin/access-grants/${grantId}`);
}
