import axios from "axios";

export function getCurrentUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const stored = localStorage.getItem("currentUser");
  return stored ? JSON.parse(stored) : null;
}

export function getAuthToken() {
  const user = getCurrentUser();
  return user?.token || null;
}

export function setAxiosAuthToken(token) {
  if (typeof window === "undefined") {
    return;
  }

  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common.Authorization;
  }
}

export function setCurrentUser(user, token) {
  if (typeof window === "undefined") {
    return;
  }

  const storedUser = {
    ...user,
    token,
  };

  localStorage.setItem("currentUser", JSON.stringify(storedUser));
  setAxiosAuthToken(token);
}

export function clearCurrentUser() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem("currentUser");
  setAxiosAuthToken(null);
}

export function initializeAuth() {
  const token = getAuthToken();
  if (token) {
    setAxiosAuthToken(token);
  }
}
