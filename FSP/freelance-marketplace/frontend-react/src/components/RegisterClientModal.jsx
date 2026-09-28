import { useState } from "react";
import Modal from "./Modal";
import { registerClient } from "../api/client";
import { useSession } from "../context/SessionContext";

const initialForm = {
  fullName: "", email: "", password: "", country: "", companyName: "", industry: "",
};

export default function RegisterClientModal({ show, onClose }) {
  const { login } = useSession();
  const [form, setForm] = useState(initialForm);
  const [alert, setAlert] = useState(null);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setAlert(null);
    try {
      const data = await registerClient(form);
      login(data);
      setAlert({ type: "success", text: `Registered! You're now logged in as ${data.fullName} (Client ID ${data.userId}).` });
      setTimeout(() => {
        onClose();
        setForm(initialForm);
        setAlert(null);
      }, 1200);
    } catch (err) {
      setAlert({ type: "danger", text: err.message });
    }
  }

  return (
    <Modal show={show} title="Register as a Client" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input className="form-control" value={form.fullName} onChange={update("fullName")} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={form.email} onChange={update("email")} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" minLength={6} value={form.password} onChange={update("password")} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Country</label>
          <input className="form-control" value={form.country} onChange={update("country")} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Company Name</label>
          <input className="form-control" value={form.companyName} onChange={update("companyName")} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Industry</label>
          <input className="form-control" placeholder="e.g. Retail, Technology, Healthcare"
                 value={form.industry} onChange={update("industry")} required />
        </div>
        <div className="modal-footer px-0 pb-0">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-success">Register</button>
        </div>
      </form>
    </Modal>
  );
}
