import { useEffect, useState } from "react";
import Modal from "./Modal";
import { getProposalsForProject, updateProposalStatus } from "../api/client";

const statusBadge = { pending: "bg-warning text-dark", accepted: "bg-success", rejected: "bg-danger" };

export default function ViewProposalsModal({ show, project, onClose }) {
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    if (!project) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getProposalsForProject(project.projectId);
      setProposals(data);
    } catch {
      setError("Could not load proposals. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (show) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, project]);

  async function handleStatusChange(proposalId, status) {
    try {
      await updateProposalStatus(proposalId, status);
      await load(); // refresh the list to reflect the new status
    } catch {
      alert("Could not update the proposal status. Make sure the backend is running.");
    }
  }

  if (!show || !project) return null;

  return (
    <Modal show={show} title={`Proposals for — ${project.title}`} onClose={onClose} size="modal-lg">
      {loading && <div className="text-center text-muted py-4">Loading proposals...</div>}
      {error && <div className="alert alert-warning">{error}</div>}

      {!loading && !error && proposals.length === 0 && (
        <div className="text-center text-muted py-4">No proposals submitted for this project yet.</div>
      )}

      {!loading && !error && proposals.map((prop) => (
        <div key={prop.proposalId} className="border rounded p-3 mb-2">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <strong>Freelancer #{prop.freelancer.freelancerId}</strong>
              <span className={`badge ms-2 ${statusBadge[prop.status] || "bg-secondary"}`}>{prop.status}</span>
            </div>
            <div className="fw-bold">${Number(prop.bidAmount).toFixed(2)} &middot; {prop.deliveryDays} days</div>
          </div>
          <p className="text-muted small mt-2 mb-2">{prop.coverLetter}</p>
          {prop.status === "pending" && (
            <div className="d-flex gap-2">
              <button className="btn btn-sm btn-success" onClick={() => handleStatusChange(prop.proposalId, "accepted")}>
                Accept
              </button>
              <button className="btn btn-sm btn-outline-danger" onClick={() => handleStatusChange(prop.proposalId, "rejected")}>
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </Modal>
  );
}
