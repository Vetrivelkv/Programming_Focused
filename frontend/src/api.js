const configuredBaseUrl = import.meta.env?.VITE_API_BASE_URL?.trim() || "";
const API_BASE_URL = configuredBaseUrl.replace(/\/$/, "");
const coldStartRetryMs = Number(import.meta.env?.VITE_COLD_START_RETRY_MS) || 1500;
export const SESSION_EXPIRED_EVENT = "programming-focused:session-expired";

const RETRYABLE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);
const RETRYABLE_STATUSES = new Set([502, 503, 504]);
const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export async function fetchWithColdStartRetry(url, options = {}, {
  fetchImpl = globalThis.fetch,
  retryDelayMs = coldStartRetryMs,
  sleep = delay,
} = {}) {
  const method = String(options.method || "GET").toUpperCase();
  const firstResponse = await fetchImpl(url, options);
  if (!RETRYABLE_METHODS.has(method) || !RETRYABLE_STATUSES.has(firstResponse.status)) {
    return firstResponse;
  }
  await sleep(Math.max(0, retryDelayMs));
  return fetchImpl(url, options);
}

export async function apiFetch(path, options = {}) {
  const { sessionAware = true, ...fetchOptions } = options;
  const response = await fetchWithColdStartRetry(`${API_BASE_URL}${path}`, {
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
