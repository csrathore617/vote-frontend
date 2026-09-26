import type { LoginResponse } from "../types/auth";
import client from "./client";

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await client.post<LoginResponse>("/api/auth/login", { email, password });
  return response.data;
}
