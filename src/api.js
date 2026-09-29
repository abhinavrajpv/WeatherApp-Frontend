const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const TOKEN_KEY = "weather.accessToken";
const REFRESH_KEY = "weather.refreshToken";

export function getTokens() {
  return {
    accessToken: localStorage.getItem(TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_KEY)
  };
}

export function setTokens(accessToken, refreshToken) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

async function parseErrorMessage(response) {
  try {
    const body = await response.json();
    if (body?.error) return body.error;
    if (body?.message) return body.message;
    // Validation errors come back as a field -> message map.
    const firstValue = Object.values(body || {})[0];
    if (typeof firstValue === "string") return firstValue;
  } catch {
    // Response had no JSON body.
  }
  return `Request failed (${response.status})`;
}

async function rawRequest(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, options);
  if (!response.ok) {
    const message = await parseErrorMessage(response);
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  if (response.status === 204) return null;
  return response.json();
}

async function refreshAccessToken() {
  const { refreshToken } = getTokens();
  if (!refreshToken) throw new Error("No refresh token available");
  const data = await rawRequest("/auth/refresh", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken })
  });
  setTokens(data.accessToken, data.refreshToken);
  return data.accessToken;
}

/**
 * Authenticated request helper. Attaches the current access token and,
 * on a single 401, tries one refresh-and-retry before giving up.
 */
export async function authRequest(path, { method = "GET", body } = {}) {
  const { accessToken } = getTokens();
  const headers = { "Content-Type": "application/json" };
  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;

  try {
    return await rawRequest(path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch (error) {
    if (error.status !== 401) throw error;
    const newAccessToken = await refreshAccessToken();
    const retryHeaders = { "Content-Type": "application/json", Authorization: `Bearer ${newAccessToken}` };
    return rawRequest(path, { method, headers: retryHeaders, body: body ? JSON.stringify(body) : undefined });
  }
}

export const authApi = {
  register: (payload) =>
    rawRequest("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    rawRequest("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
};

export const cityApi = {
  list: () => authRequest("/cities"),
  add: (payload) => authRequest("/cities", { method: "POST", body: payload }),
  remove: (id) => authRequest(`/cities/${id}`, { method: "DELETE" })
};

export const weatherApi = {
  get: (payload) => authRequest("/weather", { method: "POST", body: payload })
};
