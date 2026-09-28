import { useEffect, useState } from "react";
import Modal from "./Modal";
import { getFreelancer, getProposalsForFreelancer } from "../api/client";

const statusBadge = { pending: "bg-warning text-dark", accepted: "bg-success", rejected: "bg-danger" };

export default function FreelancerDetailModal({ show, freelancerId, onClose }) {
  const [freelancer, setFreelancer] = useState(null);
  const [proposals, setProposals] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!show || !freelancerId) return;
    setFreelancer(null);
    setProposals([]);
    setError(null);

    Promise.all([getFreelancer(freelancerId), getProposalsForFreelancer(freelancerId)])
      .then(([f, props]) => {
        setFreelancer(f);
        setProposals(props);
      })
      .catch(() => setError("Could not load this freelancer's profile. Is the backend running?"));
  }, [show, freelancerId]);

  if (!show) return null;

  const name = freelancer?.user ? freelancer.user.fullName : "Unknown";
  const country = freelancer?.user ? freelancer.user.country : "";
  const email = freelancer?.user ? freelancer.user.email : "";

  return (
    <Modal show={show} title="Freelancer Profile" onClose={onClose} size="modal-lg">
      {error && <div className="alert alert-warning">{error}</div>}

      {!error && !freelancer && (
        <div className="text-center text-muted py-4">Loading profile...</div>
      )}

      {!error && freelancer && (
        <>
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div>
              <h4 className="mb-0">{name}</h4>
              <div className="text-muted">{freelancer.professionalTitle} &middot; {country}</div>
              <div className="text-muted small">{email}</div>
            </div>
            <span className={`badge fs-6 ${freelancer.availabilityStatus === "available" ? "bg-success" : "bg-secondary"}`}>
              {freelancer.availabilityStatus}
            </span>
          </div>

          <div className="row text-center g-2 mb-4">
            <div className="col-3">
              <div className="border rounded p-2">
                <div className="fw-bold">${Number(freelancer.hourlyRate).toFixed(2)}</div>
                <div className="text-muted small">per hour</div>
              </div>
            </div>
            <div className="col-3">
              <div className="border rounded p-2">
                <div className="fw-bold"><i className="bi bi-star-fill text-warning"></i> {Number(freelancer.ratingAvg).toFixed(2)}</div>
                <div className="text-muted small">rating</div>
              </div>
            </div>
            <div className="col-3">
              <div className="border rounded p-2">
                <div className="fw-bold">{freelancer.yearsExperience}</div>
                <div className="text-muted small">yrs exp</div>
              </div>
            </div>
            <div className="col-3">
              <div className="border rounded p-2">
                <div className="fw-bold">
                  ${Number(freelancer.totalEarned).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </div>
                <div className="text-muted small">earned</div>
              </div>
            </div>
          </div>

          <h6>Proposal History ({proposals.length})</h6>
          {proposals.length === 0 ? (
            <div className="text-muted small">This freelancer hasn't submitted any proposals yet.</div>
          ) : (
            proposals.map((prop) => (
              <div key={prop.proposalId} className="border rounded p-2 mb-2 d-flex justify-content-between align-items-center">
                <div>
                  <div className="small">Project #{prop.project.projectId}</div>
                  <div className="text-muted small">${Number(prop.bidAmount).toFixed(2)} &middot; {prop.deliveryDays} days</div>
                </div>
                <span className={`badge ${statusBadge[prop.status] || "bg-secondary"}`}>{prop.status}</span>
              </div>
            ))
          )}
        </>
      )}
    </Modal>
  );
}
