const TOKEN_KEY = "notes_token";

// PUBLIC_INTERFACE
export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// PUBLIC_INTERFACE
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// PUBLIC_INTERFACE
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}
