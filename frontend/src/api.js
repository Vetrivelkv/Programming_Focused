const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || "";
const API_BASE_URL = configuredBaseUrl.replace(/\/$/, "");
export const SESSION_EXPIRED_EVENT = "programming-focused:session-expired";

export async function apiFetch(path, options = {}) {
  const { sessionAware = true, ...fetchOptions } = options;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    credentials: "include",
    headers: {
      ...(fetchOptions.body ? { "Content-Type": "application/json" } : {}),
      ...fetchOptions.headers,
    },
  });
  if (response.status === 401 && sessionAware) {
    const body = await response.clone().json().catch(() => ({}));
    if (body.code === "SESSION_EXPIRED") {
      window.dispatchEvent(new CustomEvent(SESSION_EXPIRED_EVENT));
    }
  }
  return response;
}

export async function apiJson(path, options) {
  const response = await apiFetch(path, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.detail || "Something went wrong.");
  return body;
}
