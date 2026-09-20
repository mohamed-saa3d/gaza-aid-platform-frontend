import { adminHttp, type ApiResponse } from "@/lib/http"
import type { LiveStream, LiveStreamListResponse } from "./types"
import type { CreateLiveStreamInput } from "./schema"

export async function getLiveStreams(params?: {
  page?: number
  limit?: number
}): Promise<LiveStreamListResponse> {
  const response = await adminHttp.get<LiveStreamListResponse>("/live-streams", { params })
  return response.data
}

export async function getLiveStreamById(id: string): Promise<ApiResponse<LiveStream>> {
  const response = await adminHttp.get<ApiResponse<LiveStream>>(`/live-streams/${id}`)
  return response.data
}

export async function createLiveStream(
  data: CreateLiveStreamInput
): Promise<ApiResponse<LiveStream>> {
  const response = await adminHttp.post<ApiResponse<LiveStream>>("/live-streams", data)
  return response.data
}

export async function updateLiveStream(
  id: string,
  data: Partial<CreateLiveStreamInput>
): Promise<ApiResponse<LiveStream>> {
  const response = await adminHttp.put<ApiResponse<LiveStream>>(`/live-streams/${id}`, data)
  return response.data
}

export async function deleteLiveStream(id: string): Promise<ApiResponse<null>> {
  const response = await adminHttp.delete<ApiResponse<null>>(`/live-streams/${id}`)
  return response.data
}
