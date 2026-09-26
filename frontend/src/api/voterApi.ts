import type { PagedResponse, VoterResponse, VoterSearchParams } from "../types/voter";
import client from "./client";

export async function searchVoters(params: VoterSearchParams): Promise<PagedResponse<VoterResponse>> {
  const response = await client.get<PagedResponse<VoterResponse>>("/api/voters/search", { params });
  return response.data;
}

export async function updateVotingStatus(id: number, voted: boolean): Promise<VoterResponse> {
  const response = await client.patch<VoterResponse>(`/api/voters/${id}/voting-status`, { voted });
  return response.data;
}
