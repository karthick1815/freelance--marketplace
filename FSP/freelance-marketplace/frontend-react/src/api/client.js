// Base URL of the Spring Boot backend
export const API_BASE = "http://localhost:8080/api";

// Small wrapper around fetch() so every call handles errors the same way
async function request(path, options = {}) {
  const session = JSON.parse(
    localStorage.getItem("corkboard_session") || "null"
  );

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (session?.token) {
    headers.Authorization = `Bearer ${session.token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // some endpoints (e.g. DELETE) return no body
  }

  if (!res.ok) {
    const message = (data && data.error) || `Request failed (${res.status})`;
    throw new Error(message);
  }

  return data;
}
// ---------- Categories ----------
export const getCategories = () => request("/categories");

// ---------- Projects ----------
export const getProjects = () => request("/projects");
export const getProject = (id) => request(`/projects/${id}`);
export const createProject = (payload) =>
  request("/projects", { method: "POST", body: JSON.stringify(payload) });
export const deleteProject = (id) =>
  request(`/projects/${id}`, { method: "DELETE" });

// ---------- Freelancers ----------
export const getFreelancers = () => request("/freelancers");
export const getFreelancer = (id) => request(`/freelancers/${id}`);

// ---------- Proposals ----------
export const getProposalsForProject = (projectId) =>
  request(`/proposals/project/${projectId}`);
export const getProposalsForFreelancer = (freelancerId) =>
  request(`/proposals/freelancer/${freelancerId}`);
export const submitProposal = (payload) =>
  request("/proposals", { method: "POST", body: JSON.stringify(payload) });
export const updateProposalStatus = (proposalId, status) =>
  request(`/proposals/${proposalId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });

// ---------- Auth ----------
export const registerClient = (payload) =>
  request("/auth/register/client", { method: "POST", body: JSON.stringify(payload) });
export const registerFreelancer = (payload) =>
  request("/auth/register/freelancer", { method: "POST", body: JSON.stringify(payload) });
export const loginUser = (payload) =>
  request("/auth/login", { method: "POST", body: JSON.stringify(payload) });
