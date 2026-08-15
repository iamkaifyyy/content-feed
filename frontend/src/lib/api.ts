import {
  FeedItem,
  Bookmark,
  PaginatedResponse,
  AuthResponse,
  SingleItemResponse,
} from "../types";

const API_URL = import.meta.env.VITE_API_URL as string || "http://localhost:5001/api/v1";

interface FetchOptions {
  method?: string;
  body?: unknown;
  auth?: boolean;
}

async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const { method = "GET", body, auth = false } = options;
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  if (auth) {
    const token = localStorage.getItem("token");
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(
      (data as { message?: string }).message ||
        `Request failed with status ${res.status}`
    );
  }

  return data as T;
}

export const api = {
  getFeed: (page = 1, limit = 20, sort = "latest"): Promise<PaginatedResponse<FeedItem>> =>
    apiFetch<PaginatedResponse<FeedItem>>(
      `/feed?page=${page}&limit=${limit}&sort=${sort}`
    ),

  getFeedItem: (id: string): Promise<SingleItemResponse<FeedItem>> =>
    apiFetch<SingleItemResponse<FeedItem>>(`/feed/${id}`),

  register: (payload: {
    name: string;
    email: string;
    password: string;
  }): Promise<AuthResponse> =>
    apiFetch<AuthResponse>("/auth/register", { method: "POST", body: payload }),

  login: (payload: {
    email: string;
    password: string;
  }): Promise<AuthResponse> =>
    apiFetch<AuthResponse>("/auth/login", { method: "POST", body: payload }),

  addBookmark: (id: string): Promise<SingleItemResponse<Bookmark>> =>
    apiFetch<SingleItemResponse<Bookmark>>(`/feed/${id}/bookmark`, {
      method: "POST",
      auth: true,
    }),

  removeBookmark: (id: string): Promise<{ success: boolean; message: string }> =>
    apiFetch<{ success: boolean; message: string }>(`/feed/${id}/bookmark`, {
      method: "DELETE",
      auth: true,
    }),

  getBookmarks: (page = 1, limit = 20): Promise<PaginatedResponse<Bookmark>> =>
    apiFetch<PaginatedResponse<Bookmark>>(
      `/bookmarks?page=${page}&limit=${limit}`,
      { auth: true }
    ),
};
