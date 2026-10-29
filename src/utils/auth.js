export function getCurrentUser() {
  const user = localStorage.getItem("currentUser");
  return user ? JSON.parse(user) : null;
}

export function isTechnician() {
  const user = getCurrentUser();
  return user?.role === "Technician";
}

export function isAdmin() {
  const user = getCurrentUser();
  return user?.role === "Admin";
}

export function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "/login";
}