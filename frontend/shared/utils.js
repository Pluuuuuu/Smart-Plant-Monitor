// API base URL - works in both development and Docker
// In Docker, nginx proxies /api to the backend service
// Check if we're accessing via port 3000 (Docker) or direct backend access
const API_BASE = window.location.port === '3000' || window.location.port === ''
  ? "/api"  // Use proxy in Docker (port 3000) or when no port specified
  : "http://127.0.0.1:8000";  // Direct connection for local development

async function apiGet(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

async function apiPut(path, body) {
  const res = await fetch(API_BASE + path, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`PUT ${path} failed: ${res.status}`);
  return res.json();
}

async function apiDelete(path) {
  const res = await fetch(API_BASE + path, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  // Some DELETE endpoints may not return a body
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

function formatDateTime(isoString) {
  if (!isoString) return "Unknown";
  // Ensure the string ends with Z if it doesn't have timezone info
  let dateString = isoString;
  if (!dateString.includes('Z') && !dateString.includes('+') && !dateString.includes('-', 10)) {
    // If no timezone info, assume UTC and add Z
    dateString = dateString + 'Z';
  }
  const dt = new Date(dateString);
  // Ensure proper timezone conversion and format
  return dt.toLocaleString(undefined, {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
}

function formatRelative(isoString) {
  if (!isoString) return "Unknown";
  const dt = new Date(isoString);
  const diffMs = Date.now() - dt.getTime();
  const diffMins = Math.round(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.round(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

async function loadLayout() {
  const headerContainer = document.getElementById("spm-header-container");
  const footerContainer = document.getElementById("spm-footer-container");

  if (headerContainer) {
    const res = await fetch("../shared/header.html");
    headerContainer.innerHTML = await res.text();
  }

  if (footerContainer) {
    const res = await fetch("../shared/footer.html");
    footerContainer.innerHTML = await res.text();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadLayout().catch(console.error);
});
