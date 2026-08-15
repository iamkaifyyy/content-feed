export interface FeedItem {
  _id: string;
  id?: string;
  title: string;
  description: string;
  body?: string;
  source: string;
  author?: string;
  tags?: string[];
  readTime?: string;
  url: string;
  image?: string;
  publishedAt: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateArticlePayload {
  title: string;
  description: string;
  body: string;
  source?: string;
  author?: string;
  tags?: string[];
  image?: string;
  url?: string;
}

export interface Bookmark {
  _id: string;
  user?: string;
  content: FeedItem;
  createdAt: string;
  updatedAt?: string;
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
