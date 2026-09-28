import { useState, useEffect } from "react";
import Modal from "./Modal";
import { submitProposal } from "../api/client";
import { useSession } from "../context/SessionContext";

const initialForm = { bidAmount: "", deliveryDays: "", coverLetter: "" };

export default function SubmitProposalModal({ show, onClose, project }) {
  const { session } = useSession();
  const [form, setForm] = useState(initialForm);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    if (show) {
      setForm(initialForm);
      setAlert(null);
    }
  }, [show, project]);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAlert(null);

    if (!session || session.role !== "freelancer") {
      setAlert({ type: "warning", text: "Please login as a freelancer before submitting a proposal." });
      return;
    }

    try {
      const payload = {
        project: { projectId: project.projectId },
        freelancer: { freelancerId: session.userId },
        bidAmount: parseFloat(form.bidAmount),
        deliveryDays: parseInt(form.deliveryDays, 10),
        coverLetter: form.coverLetter,
        status: "pending",
        submittedDate: new Date().toISOString().slice(0, 10),
      };
      await submitProposal(payload);
      setAlert({ type: "success", text: "Proposal submitted!" });
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      setAlert({ type: "danger", text: err.message });
    }
  }

  if (!project) return null;

  return (
    <Modal show={show} title={`Submit a Proposal — ${project.title}`} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

        <div className="mb-3">
          {session && session.role === "freelancer" ? (
            <div className="alert alert-info small mb-0">
              Submitting as: <strong>{session.fullName} (ID {session.userId})</strong>
            </div>
          ) : (
            <div className="alert alert-warning small mb-0">
              You must login as a freelancer to submit a proposal.
            </div>
          )}
        </div>

        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label">Bid Amount ($)</label>
            <input type="number" step="0.01" className="form-control" value={form.bidAmount} onChange={update("bidAmount")} required />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label">Delivery (days)</label>
            <input type="number" className="form-control" value={form.deliveryDays} onChange={update("deliveryDays")} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Cover Letter</label>
          <textarea className="form-control" rows={3} placeholder="Why you're the right fit for this project..."
                    value={form.coverLetter} onChange={update("coverLetter")} />
        </div>

        <div className="modal-footer px-0 pb-0">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-success">Submit Proposal</button>
        </div>
      </form>
    </Modal>
  );
}
