// Base URL of the Spring Boot backend
const API_BASE = "http://localhost:8080/api";
const SESSION_KEY = "corkboard_session";

let allProjects = [];
let allCategories = [];

// ---------- Session helpers ----------
function getSession() {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

function setSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  updateSessionUI();
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  updateSessionUI();
}

// Reflects the current login state across the navbar and the Post Project / Submit Proposal forms
function updateSessionUI() {
  const session = getSession();
  const loginNavItem = document.getElementById("loginNavItem");
  const sessionNavItem = document.getElementById("sessionNavItem");
  const sessionLabel = document.getElementById("sessionLabel");

  if (session) {
    loginNavItem.classList.add("d-none");
    sessionNavItem.classList.remove("d-none");
    sessionLabel.textContent = `${session.fullName} (${session.role})`;
  } else {
    loginNavItem.classList.remove("d-none");
    sessionNavItem.classList.add("d-none");
  }

  // Post Project modal: only meaningful if logged in as a client
  const clientNote = document.getElementById("pClientSessionNote");
  const clientNameEl = document.getElementById("pClientSessionName");
  const clientIdField = document.getElementById("pClientId");
  if (session && session.role === "client") {
    clientNote.className = "alert alert-info small mb-0";
    clientNameEl.textContent = `${session.fullName} (ID ${session.userId})`;
    clientIdField.value = session.userId;
  } else {
    clientNote.className = "alert alert-warning small mb-0";
    clientNameEl.textContent = "";
    clientNote.innerHTML = `You must <a href="#" data-bs-dismiss="modal" onclick="openLoginPromptFromPost()">login as a client</a> to post a project.`;
    clientIdField.value = "";
  }

  // Submit Proposal modal: only meaningful if logged in as a freelancer
  const freelancerNote = document.getElementById("spFreelancerSessionNote");
  const freelancerNameEl = document.getElementById("spFreelancerSessionName");
  const freelancerIdField = document.getElementById("spFreelancerId");
  if (session && session.role === "freelancer") {
    freelancerNote.className = "alert alert-info small mb-0";
    freelancerNameEl.textContent = `${session.fullName} (ID ${session.userId})`;
    freelancerIdField.value = session.userId;
  } else {
    freelancerNote.className = "alert alert-warning small mb-0";
    freelancerNote.innerHTML = `You must <a href="#" data-bs-dismiss="modal" onclick="openLoginPromptFromProposal()">login as a freelancer</a> to submit a proposal.`;
    freelancerIdField.value = "";
  }
}

function openLoginPromptFromPost() {
  setTimeout(() => new bootstrap.Modal(document.getElementById("loginModal")).show(), 300);
}
function openLoginPromptFromProposal() {
  setTimeout(() => new bootstrap.Modal(document.getElementById("loginModal")).show(), 300);
}

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  checkApiStatus();
  loadCategories();
  loadProjects();
  loadFreelancers();
  updateSessionUI();

  document.getElementById("searchInput").addEventListener("input", applyFilters);
  document.getElementById("categoryFilter").addEventListener("change", applyFilters);
  document.getElementById("postProjectForm").addEventListener("submit", submitProject);
  document.getElementById("submitProposalForm").addEventListener("submit", submitProposal);
  document.getElementById("registerFreelancerForm").addEventListener("submit", registerFreelancer);
  document.getElementById("registerClientForm").addEventListener("submit", registerClient);
  document.getElementById("loginForm").addEventListener("submit", loginUser);

  // Re-check session state each time these modals are about to open,
  // so the note/ID always reflects the latest login status.
  document.getElementById("postProjectModal").addEventListener("show.bs.modal", updateSessionUI);
  document.getElementById("submitProposalModal").addEventListener("show.bs.modal", updateSessionUI);
});

// ---------- API status check ----------
async function checkApiStatus() {
  const badge = document.getElementById("apiStatus");
  try {
    const res = await fetch(`${API_BASE}/categories`);
    if (res.ok) {
      badge.textContent = "API connected";
      badge.className = "badge bg-success";
    } else {
      throw new Error("Bad response");
    }
  } catch (err) {
    badge.textContent = "API not reachable — is the Spring Boot backend running on :8080?";
    badge.className = "badge bg-danger";
  }
}

// ---------- Categories ----------
async function loadCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`);
    allCategories = await res.json();

    document.getElementById("statCategories").textContent = allCategories.length;

    const filterSelect = document.getElementById("categoryFilter");
    const formSelect = document.getElementById("pCategory");
    allCategories.forEach(c => {
      filterSelect.insertAdjacentHTML("beforeend",
        `<option value="${c.categoryId}">${c.categoryName}</option>`);
      formSelect.insertAdjacentHTML("beforeend",
        `<option value="${c.categoryId}">${c.categoryName}</option>`);
    });
  } catch (err) {
    console.error("Failed to load categories", err);
  }
}

// ---------- Projects ----------
async function loadProjects() {
  try {
    const res = await fetch(`${API_BASE}/projects`);
    allProjects = await res.json();

    document.getElementById("statProjects").textContent = allProjects.length;
    document.getElementById("statOpen").textContent =
      allProjects.filter(p => p.status === "open").length;

    renderProjects(allProjects);
  } catch (err) {
    document.getElementById("projectGrid").innerHTML =
      `<div class="col-12"><div class="alert alert-warning">Could not load projects. Make sure the Spring Boot backend is running at ${API_BASE}.</div></div>`;
  }
}

function renderProjects(projects) {
  const grid = document.getElementById("projectGrid");
  if (!projects.length) {
    grid.innerHTML = `<div class="col-12 text-center text-muted py-4">No projects match your filters.</div>`;
    return;
  }

  grid.innerHTML = projects.map(p => `
    <div class="col-md-6 col-lg-4">
      <div class="card project-card">
        <div class="card-body d-flex flex-column">
          <span class="badge bg-light text-dark mb-2 align-self-start">${p.category ? p.category.categoryName : ""}</span>
          <h5 class="card-title">${p.title}</h5>
          <p class="card-text text-muted small flex-grow-1">${(p.description || "").slice(0, 100)}...</p>
          <div class="d-flex justify-content-between align-items-center mt-2">
            <span class="fw-bold">$${Number(p.budgetMin).toFixed(0)} – $${Number(p.budgetMax).toFixed(0)}</span>
            <span class="badge badge-status-${p.status}">${p.status.replace("_"," ")}</span>
          </div>
          <div class="text-muted small mt-2"><i class="bi bi-calendar-event"></i> Deadline: ${p.deadline}</div>
          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-success btn-sm flex-fill" onclick="openProposalModal(${p.projectId}, '${p.title.replace(/'/g, "\\'")}')">
              <i class="bi bi-send"></i> Submit Proposal
            </button>
            <button class="btn btn-outline-primary btn-sm" onclick="viewProposals(${p.projectId}, '${p.title.replace(/'/g, "\\'")}')">
              <i class="bi bi-people"></i> Proposals
            </button>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteProject(${p.projectId}, this)">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `).join("");
}

function applyFilters() {
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  const catId = document.getElementById("categoryFilter").value;

  const filtered = allProjects.filter(p => {
    const matchesQ = !q || p.title.toLowerCase().includes(q);
    const matchesCat = !catId || (p.category && String(p.category.categoryId) === catId);
    return matchesQ && matchesCat;
  });

  renderProjects(filtered);
}

// ---------- Freelancers ----------
async function loadFreelancers() {
  try {
    const res = await fetch(`${API_BASE}/freelancers`);
    const freelancers = await res.json();

    document.getElementById("statFreelancers").textContent = freelancers.length;

    const grid = document.getElementById("freelancerGrid");
    grid.innerHTML = freelancers.map(f => `
      <div class="col-md-6 col-lg-3">
        <div class="card freelancer-card" style="cursor:pointer" onclick="viewFreelancerDetail(${f.freelancerId})">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <div class="fw-bold">${f.user ? f.user.fullName : "Unknown"}</div>
                <div class="text-muted small mb-1">${f.user ? f.user.country : ""}</div>
              </div>
              <span class="badge bg-light text-dark">#${f.freelancerId}</span>
            </div>
            <h6 class="card-title text-muted small fst-italic mb-2">${f.professionalTitle}</h6>
            <div class="text-warning small mb-2">$${Number(f.hourlyRate).toFixed(2)}/hr</div>
            <div class="d-flex justify-content-between small text-muted">
              <span><i class="bi bi-star-fill text-warning"></i> ${Number(f.ratingAvg).toFixed(2)}</span>
              <span>${f.yearsExperience} yrs exp</span>
            </div>
            <span class="badge mt-2 ${f.availabilityStatus === 'available' ? 'bg-success' : 'bg-secondary'}">${f.availabilityStatus}</span>
          </div>
        </div>
      </div>
    `).join("");
  } catch (err) {
    document.getElementById("freelancerGrid").innerHTML =
      `<div class="col-12"><div class="alert alert-warning">Could not load freelancers.</div></div>`;
  }
}

// ---------- Delete a project (DELETE request) ----------
async function deleteProject(projectId, buttonEl) {
  const confirmed = confirm("Are you sure you want to delete this project? This cannot be undone.");
  if (!confirmed) return;

  buttonEl.disabled = true;
  buttonEl.textContent = "Deleting...";

  try {
    const res = await fetch(`${API_BASE}/projects/${projectId}`, {
      method: "DELETE"
    });

    if (!res.ok && res.status !== 204) {
      throw new Error("Delete failed");
    }

    // Remove it from the in-memory list and re-render without a full reload
    allProjects = allProjects.filter(p => p.projectId !== projectId);
    document.getElementById("statProjects").textContent = allProjects.length;
    document.getElementById("statOpen").textContent =
      allProjects.filter(p => p.status === "open").length;
    applyFilters();
  } catch (err) {
    alert("Could not delete this project. Make sure the backend is running and try again.");
    buttonEl.disabled = false;
    buttonEl.innerHTML = `<i class="bi bi-trash"></i> Delete`;
  }
}

// ---------- Post a project (POST request) ----------
async function submitProject(e) {
  e.preventDefault();
  const alertBox = document.getElementById("postProjectAlert");

  const session = getSession();
  if (!session || session.role !== "client") {
    alertBox.innerHTML = `<div class="alert alert-warning">Please login as a client before posting a project.</div>`;
    return;
  }

  const payload = {
    title: document.getElementById("pTitle").value,
    description: document.getElementById("pDescription").value,
    budgetMin: parseFloat(document.getElementById("pBudgetMin").value),
    budgetMax: parseFloat(document.getElementById("pBudgetMax").value),
    status: "open",
    postedDate: new Date().toISOString().slice(0, 10),
    deadline: document.getElementById("pDeadline").value,
    category: { categoryId: parseInt(document.getElementById("pCategory").value) },
    client: { clientId: parseInt(document.getElementById("pClientId").value) }
  };

  try {
    const res = await fetch(`${API_BASE}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Server rejected the request");

    alertBox.innerHTML = `<div class="alert alert-success">Project posted successfully!</div>`;
    await loadProjects();
    setTimeout(() => {
      bootstrap.Modal.getInstance(document.getElementById("postProjectModal")).hide();
      document.getElementById("postProjectForm").reset();
      alertBox.innerHTML = "";
    }, 1200);
  } catch (err) {
    alertBox.innerHTML = `<div class="alert alert-danger">Failed to post project. Check that the backend is running and the client ID exists.</div>`;
  }
}

// ---------- Open the "Submit Proposal" modal for a specific project ----------
function openProposalModal(projectId, projectTitle) {
  document.getElementById("spProjectId").value = projectId;
  document.getElementById("proposalProjectTitle").textContent = projectTitle;
  document.getElementById("submitProposalAlert").innerHTML = "";
  document.getElementById("submitProposalForm").reset();
  document.getElementById("spProjectId").value = projectId; // reset() clears hidden fields too, so set again
  new bootstrap.Modal(document.getElementById("submitProposalModal")).show();
}

// ---------- Submit a proposal (freelancer side, POST request) ----------
async function submitProposal(e) {
  e.preventDefault();
  const alertBox = document.getElementById("submitProposalAlert");

  const session = getSession();
  if (!session || session.role !== "freelancer") {
    alertBox.innerHTML = `<div class="alert alert-warning">Please login as a freelancer before submitting a proposal.</div>`;
    return;
  }

  const payload = {
    project: { projectId: parseInt(document.getElementById("spProjectId").value) },
    freelancer: { freelancerId: parseInt(document.getElementById("spFreelancerId").value) },
    bidAmount: parseFloat(document.getElementById("spBidAmount").value),
    deliveryDays: parseInt(document.getElementById("spDeliveryDays").value),
    coverLetter: document.getElementById("spCoverLetter").value,
    status: "pending",
    submittedDate: new Date().toISOString().slice(0, 10)
  };

  try {
    const res = await fetch(`${API_BASE}/proposals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error("Server rejected the request");

    alertBox.innerHTML = `<div class="alert alert-success">Proposal submitted!</div>`;
    setTimeout(() => {
      bootstrap.Modal.getInstance(document.getElementById("submitProposalModal")).hide();
      alertBox.innerHTML = "";
    }, 1000);
  } catch (err) {
    alertBox.innerHTML = `<div class="alert alert-danger">Failed to submit proposal. Check that the backend is running and the freelancer ID exists.</div>`;
  }
}

// ---------- View proposals for a project (client side) ----------
async function viewProposals(projectId, projectTitle) {
  document.getElementById("viewProposalsTitle").textContent = projectTitle;
  const listEl = document.getElementById("proposalsList");
  listEl.innerHTML = `<div class="text-center text-muted py-4">Loading proposals...</div>`;
  new bootstrap.Modal(document.getElementById("viewProposalsModal")).show();

  try {
    const res = await fetch(`${API_BASE}/proposals/project/${projectId}`);
    const proposals = await res.json();
    renderProposalsList(proposals);
  } catch (err) {
    listEl.innerHTML = `<div class="alert alert-warning">Could not load proposals. Is the backend running?</div>`;
  }
}

function renderProposalsList(proposals) {
  const listEl = document.getElementById("proposalsList");
  if (!proposals.length) {
    listEl.innerHTML = `<div class="text-center text-muted py-4">No proposals submitted for this project yet.</div>`;
    return;
  }

  const statusBadge = { pending: "bg-warning text-dark", accepted: "bg-success", rejected: "bg-danger" };

  listEl.innerHTML = proposals.map(prop => `
    <div class="border rounded p-3 mb-2">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <strong>${prop.freelancer.user ? prop.freelancer.user.fullName : "Freelancer #" + prop.freelancer.freelancerId}</strong>
          <span class="text-muted small">(#${prop.freelancer.freelancerId})</span>
          <span class="badge ${statusBadge[prop.status] || 'bg-secondary'} ms-2">${prop.status}</span>
        </div>
        <div class="fw-bold">$${Number(prop.bidAmount).toFixed(2)} · ${prop.deliveryDays} days</div>
      </div>
      <p class="text-muted small mt-2 mb-2">${prop.coverLetter || ""}</p>
      ${prop.status === "pending" ? `
        <div class="d-flex gap-2">
          <button class="btn btn-sm btn-success" onclick="updateProposalStatus(${prop.proposalId}, 'accepted', ${prop.project.projectId})">Accept</button>
          <button class="btn btn-sm btn-outline-danger" onclick="updateProposalStatus(${prop.proposalId}, 'rejected', ${prop.project.projectId})">Reject</button>
        </div>
      ` : ""}
    </div>
  `).join("");
}

// ---------- Accept or reject a proposal (client side, PUT request) ----------
async function updateProposalStatus(proposalId, newStatus, projectId) {
  try {
    const res = await fetch(`${API_BASE}/proposals/${proposalId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus })
    });

    if (!res.ok) throw new Error("Failed to update proposal");

    // Refresh the list inside the open modal
    const projTitle = document.getElementById("viewProposalsTitle").textContent;
    viewProposals(projectId, projTitle);
  } catch (err) {
    alert("Could not update the proposal status. Make sure the backend is running.");
  }
}

// ---------- View a single freelancer's full profile ----------
async function viewFreelancerDetail(freelancerId) {
  const modalBody = document.getElementById("freelancerDetailBody");
  modalBody.innerHTML = `<div class="text-center text-muted py-4">Loading profile...</div>`;
  new bootstrap.Modal(document.getElementById("freelancerDetailModal")).show();

  try {
    const [profileRes, proposalsRes] = await Promise.all([
      fetch(`${API_BASE}/freelancers/${freelancerId}`),
      fetch(`${API_BASE}/proposals/freelancer/${freelancerId}`)
    ]);

    if (!profileRes.ok) throw new Error("Freelancer not found");

    const f = await profileRes.json();
    const proposals = proposalsRes.ok ? await proposalsRes.json() : [];

    const name = f.user ? f.user.fullName : "Unknown";
    const country = f.user ? f.user.country : "";
    const email = f.user ? f.user.email : "";

    const statusBadge = { pending: "bg-warning text-dark", accepted: "bg-success", rejected: "bg-danger" };

    modalBody.innerHTML = `
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h4 class="mb-0">${name}</h4>
          <div class="text-muted">${f.professionalTitle} &middot; ${country}</div>
          <div class="text-muted small">${email}</div>
        </div>
        <span class="badge ${f.availabilityStatus === 'available' ? 'bg-success' : 'bg-secondary'} fs-6">${f.availabilityStatus}</span>
      </div>

      <div class="row text-center g-2 mb-4">
        <div class="col-3">
          <div class="border rounded p-2">
            <div class="fw-bold">$${Number(f.hourlyRate).toFixed(2)}</div>
            <div class="text-muted small">per hour</div>
          </div>
        </div>
        <div class="col-3">
          <div class="border rounded p-2">
            <div class="fw-bold"><i class="bi bi-star-fill text-warning"></i> ${Number(f.ratingAvg).toFixed(2)}</div>
            <div class="text-muted small">rating</div>
          </div>
        </div>
        <div class="col-3">
          <div class="border rounded p-2">
            <div class="fw-bold">${f.yearsExperience}</div>
            <div class="text-muted small">yrs exp</div>
          </div>
        </div>
        <div class="col-3">
          <div class="border rounded p-2">
            <div class="fw-bold">$${Number(f.totalEarned).toLocaleString(undefined, {maximumFractionDigits:0})}</div>
            <div class="text-muted small">earned</div>
          </div>
        </div>
      </div>

      <h6>Proposal History (${proposals.length})</h6>
      ${proposals.length === 0
        ? `<div class="text-muted small">This freelancer hasn't submitted any proposals yet.</div>`
        : proposals.map(prop => `
            <div class="border rounded p-2 mb-2 d-flex justify-content-between align-items-center">
              <div>
                <div class="small">Project #${prop.project.projectId}</div>
                <div class="text-muted small">$${Number(prop.bidAmount).toFixed(2)} &middot; ${prop.deliveryDays} days</div>
              </div>
              <span class="badge ${statusBadge[prop.status] || 'bg-secondary'}">${prop.status}</span>
            </div>
          `).join("")
      }
    `;
  } catch (err) {
    modalBody.innerHTML = `<div class="alert alert-warning">Could not load this freelancer's profile. Is the backend running?</div>`;
  }
}

// ---------- Register a brand-new freelancer (POST request) ----------
async function registerFreelancer(e) {
  e.preventDefault();
  const alertBox = document.getElementById("registerFreelancerAlert");

  const payload = {
    fullName: document.getElementById("rfName").value,
    email: document.getElementById("rfEmail").value,
    password: document.getElementById("rfPassword").value,
    country: document.getElementById("rfCountry").value,
    professionalTitle: document.getElementById("rfTitle").value,
    hourlyRate: parseFloat(document.getElementById("rfRate").value),
    yearsExperience: parseInt(document.getElementById("rfYears").value),
    availabilityStatus: document.getElementById("rfAvailability").value
  };

  try {
    const res = await fetch(`${API_BASE}/auth/register/freelancer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");

    alertBox.innerHTML = `<div class="alert alert-success">
      Registered! You're now logged in as <strong>${data.fullName}</strong> (Freelancer ID ${data.userId}).
    </div>`;

    setSession(data); // logs them straight in
    await loadFreelancers();

    setTimeout(() => {
      bootstrap.Modal.getInstance(document.getElementById("registerFreelancerModal")).hide();
      document.getElementById("registerFreelancerForm").reset();
      alertBox.innerHTML = "";
    }, 1500);
  } catch (err) {
    alertBox.innerHTML = `<div class="alert alert-danger">${err.message || "Registration failed. Check that the backend is running."}</div>`;
  }
}

// ---------- Register a brand-new client (POST request) ----------
async function registerClient(e) {
  e.preventDefault();
  const alertBox = document.getElementById("registerClientAlert");

  const payload = {
    fullName: document.getElementById("rcName").value,
    email: document.getElementById("rcEmail").value,
    password: document.getElementById("rcPassword").value,
    country: document.getElementById("rcCountry").value,
    companyName: document.getElementById("rcCompanyName").value,
    industry: document.getElementById("rcIndustry").value
  };

  try {
    const res = await fetch(`${API_BASE}/auth/register/client`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Registration failed");

    alertBox.innerHTML = `<div class="alert alert-success">
      Registered! You're now logged in as <strong>${data.fullName}</strong> (Client ID ${data.userId}).
    </div>`;

    setSession(data); // logs them straight in

    setTimeout(() => {
      bootstrap.Modal.getInstance(document.getElementById("registerClientModal")).hide();
      document.getElementById("registerClientForm").reset();
      alertBox.innerHTML = "";
    }, 1500);
  } catch (err) {
    alertBox.innerHTML = `<div class="alert alert-danger">${err.message || "Registration failed. Check that the backend is running."}</div>`;
  }
}

// ---------- Login (client or freelancer) ----------
async function loginUser(e) {
  e.preventDefault();
  const alertBox = document.getElementById("loginAlert");

  const payload = {
    email: document.getElementById("loginEmail").value,
    password: document.getElementById("loginPassword").value
  };

  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    setSession(data);
    alertBox.innerHTML = `<div class="alert alert-success">Welcome back, ${data.fullName}!</div>`;

    setTimeout(() => {
      bootstrap.Modal.getInstance(document.getElementById("loginModal")).hide();
      document.getElementById("loginForm").reset();
      alertBox.innerHTML = "";
    }, 1000);
  } catch (err) {
    alertBox.innerHTML = `<div class="alert alert-danger">${err.message || "Login failed. Check that the backend is running."}</div>`;
  }
}
