// Shared domain types used across all pages and components.
// Mirrors the shapes returned by the backend API.

export interface FeedItem {
  _id: string;
  title: string;
  description: string;
  source: string;
  url: string;
  image?: string;
  publishedAt: string;
}

export interface Bookmark {
  _id: string;
  content: FeedItem;
  createdAt: string;
}

export interface User {
  id?: string;
  _id?: string;
  name: string;
  email: string;
}

export interface Pagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage?: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: User;
    token: string;
  };
}

export interface SingleItemResponse<T> {
  success: boolean;
  data: T;
}
