import type { PagedResponse, VoterResponse, VoterSearchParams } from "../types/voter";
import client from "./client";

export async function searchVoters(params: VoterSearchParams): Promise<PagedResponse<VoterResponse>> {
  const response = await client.get<PagedResponse<VoterResponse>>("/api/voters/search", { params });
  return response.data;
}
