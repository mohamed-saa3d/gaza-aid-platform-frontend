export type {
  Project,
  ProjectFormData,
  ProjectStatus,
  CategoryId,
  QueryParams,
  PaginatedResponse,
  ApiSuccess,
} from "./models"

export interface ProjectFilterOptions {
  page: number
  limit: number
  search?: string
  category?: string
  status?: string
}
