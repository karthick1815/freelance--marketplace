import { useState } from "react";
import Modal from "./Modal";
import { createProject } from "../api/client";
import { useSession } from "../context/SessionContext";

const initialForm = {
  title: "", description: "", budgetMin: "", budgetMax: "", categoryId: "", deadline: "",
};

export default function PostProjectModal({ show, onClose, categories, onCreated }) {
  const { session } = useSession();
  const [form, setForm] = useState(initialForm);
  const [alert, setAlert] = useState(null);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAlert(null);

    if (!session || session.role !== "client") {
      setAlert({ type: "warning", text: "Please login as a client before posting a project." });
      return;
    }

    try {
      const payload = {
        title: form.title,
        description: form.description,
        budgetMin: parseFloat(form.budgetMin),
        budgetMax: parseFloat(form.budgetMax),
        status: "open",
        postedDate: new Date().toISOString().slice(0, 10),
        deadline: form.deadline,
        category: { categoryId: parseInt(form.categoryId, 10) },
        client: { clientId: session.userId },
      };
      const saved = await createProject(payload);
      setAlert({ type: "success", text: "Project posted successfully!" });
      onCreated(saved);
      setTimeout(() => {
        onClose();
        setForm(initialForm);
        setAlert(null);
      }, 1000);
    } catch (err) {
      setAlert({ type: "danger", text: err.message });
    }
  }

  return (
    <Modal show={show} title="Post a New Project" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}

        <div className="mb-3">
          <label className="form-label">Title</label>
          <input className="form-control" value={form.title} onChange={update("title")} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" rows={3} value={form.description} onChange={update("description")} />
        </div>
        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label">Budget Min ($)</label>
            <input type="number" step="0.01" className="form-control" value={form.budgetMin} onChange={update("budgetMin")} required />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label">Budget Max ($)</label>
            <input type="number" step="0.01" className="form-control" value={form.budgetMax} onChange={update("budgetMax")} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <select className="form-select" value={form.categoryId} onChange={update("categoryId")} required>
            <option value="" disabled>Select a category</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          {session && session.role === "client" ? (
            <div className="alert alert-info small mb-0">
              Posting as: <strong>{session.fullName} (ID {session.userId})</strong>
            </div>
          ) : (
            <div className="alert alert-warning small mb-0">
              You must login as a client to post a project.
            </div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Deadline</label>
          <input type="date" className="form-control" value={form.deadline} onChange={update("deadline")} required />
        </div>

        <div className="modal-footer px-0 pb-0">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-success">Post Project</button>
        </div>
      </form>
    </Modal>
  );
}
