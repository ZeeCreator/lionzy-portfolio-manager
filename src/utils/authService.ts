
// Simple authentication service using base64 encoding
// Note: This is not secure for production environments

const USERNAME = "lionzy";
const PASSWORD = "zerotzy";
const CREDENTIALS = btoa(`${USERNAME}:${PASSWORD}`);
const AUTH_TOKEN_KEY = "lionzy_auth_token";

export const login = (username: string, password: string): boolean => {
  if (username === USERNAME && password === PASSWORD) {
    const token = btoa(`${username}:${password}`);
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    return true;
  }
  return false;
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);
  return token === CREDENTIALS;
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};
