export interface Category {
  id: string
  nameAr: string
  nameEn: string
  /** Locale-resolved name returned by the backend for the requested locale. */
  name?: string
  /** Locale-resolved description returned by the backend. */
  description?: string
  descriptionAr?: string
  descriptionEn?: string
  createdAt?: string
  updatedAt?: string
}

export interface CategoryListResponse {
  success: boolean
  data: Category[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface CategoryDeleteConfirmationRequired {
  success: false
  code: "CATEGORY_HAS_PROJECTS"
  message: string
  data: {
    categoryId: string
    categoryName: string
    linkedProjectCount: number
    confirmationRequired: true
  }
}

export interface CategoryDeleteSuccess {
  success: true
  message: string
  data: {
    id: string
    unassignedProjectCount: number
  }
}

/**
 * Union of every shape the delete endpoint can return on success paths.
 * A 409 with `code: CATEGORY_HAS_PROJECTS` means nothing was deleted yet.
 */
export type DeleteCategoryResult = CategoryDeleteSuccess | CategoryDeleteConfirmationRequired

export function isConfirmationRequired(
  result: DeleteCategoryResult,
): result is CategoryDeleteConfirmationRequired {
  return result.success === false && result.code === "CATEGORY_HAS_PROJECTS"
}
