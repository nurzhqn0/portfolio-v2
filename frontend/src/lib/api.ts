import { ContactLink } from "../types/contactLink";
import { ContactMessage } from "../types/contactMessage";
import { Profile } from "../types/profile";
import { Project } from "../types/project";
import { getToken } from "./auth";

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

const API_PREFIX = `${API_BASE_URL}/api/v1`;

type RequestOptions = RequestInit & {
  auth?: boolean;
};

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;
  if (!isFormData) {
    headers.set("Content-Type", "application/json");
  }
  if (options.auth) {
    const token = getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_PREFIX}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(formatApiError(payload?.detail));
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

function formatApiError(detail: unknown) {
  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (!item || typeof item !== "object") return "Invalid value";
        const record = item as { loc?: unknown[]; msg?: string };
        const field = Array.isArray(record.loc)
          ? record.loc[record.loc.length - 1]
          : null;
        return `${field ? `${field}: ` : ""}${record.msg ?? "Invalid value"}`;
      })
      .join("\n");
  }

  return "Request failed. Please check the form and try again.";
}

export const api = {
  getProfile: () => request<Profile>("/profile"),

  getProjects: () => request<Project[]>("/projects"),

  getProject: (slug: string) => request<Project>(`/projects/${slug}`),

  getContactLinks: () => request<ContactLink[]>("/contact-links"),

  createContactMessage: (payload: {
    name: string;
    email: string;
    message: string;
  }) =>
    request<ContactMessage>("/contact-messages", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    request<{ access_token: string; token_type: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getMe: () =>
    request<{ id: number; email: string; is_active: boolean }>("/admin/me", {
      auth: true,
    }),

  listAdminProjects: () =>
    request<Project[]>("/admin/projects", { auth: true }),

  createProject: (payload: Partial<Project>) =>
    request<Project>("/admin/projects", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),

  updateProject: (id: number, payload: Partial<Project>) =>
    request<Project>(`/admin/projects/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    }),

  deleteProject: (id: number) =>
    request<void>(`/admin/projects/${id}`, {
      method: "DELETE",
      auth: true,
    }),

  updateProfile: (payload: Partial<Profile>) =>
    request<Profile>("/admin/profile", {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    }),

  listAdminContactLinks: () =>
    request<ContactLink[]>("/admin/contact-links", { auth: true }),

  createContactLink: (payload: Partial<ContactLink>) =>
    request<ContactLink>("/admin/contact-links", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),

  updateContactLink: (id: number, payload: Partial<ContactLink>) =>
    request<ContactLink>(`/admin/contact-links/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    }),

  deleteContactLink: (id: number) =>
    request<void>(`/admin/contact-links/${id}`, {
      method: "DELETE",
      auth: true,
    }),

  listMessages: () =>
    request<ContactMessage[]>("/admin/contact-messages", { auth: true }),

  updateMessage: (id: number, is_read: boolean) =>
    request<ContactMessage>(`/admin/contact-messages/${id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ is_read }),
    }),

  upload: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return request<{ url: string }>("/admin/uploads", {
      method: "POST",
      auth: true,
      body: form,
    });
  },
};

export function mediaUrl(url: string | null | undefined) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_BASE_URL}${url}`;
}
