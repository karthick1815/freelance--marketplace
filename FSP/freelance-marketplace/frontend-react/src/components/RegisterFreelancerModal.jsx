import { useState } from "react";
import Modal from "./Modal";
import { registerFreelancer } from "../api/client";
import { useSession } from "../context/SessionContext";

const initialForm = {
  fullName: "", email: "", password: "", country: "", professionalTitle: "",
  hourlyRate: "", yearsExperience: 0, availabilityStatus: "available",
};

export default function RegisterFreelancerModal({ show, onClose }) {
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
      const payload = {
        ...form,
        hourlyRate: parseFloat(form.hourlyRate),
        yearsExperience: parseInt(form.yearsExperience, 10),
      };
      const data = await registerFreelancer(payload);
      login(data);
      setAlert({ type: "success", text: `Registered! You're now logged in as ${data.fullName} (Freelancer ID ${data.userId}).` });
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
    <Modal show={show} title="Register as a Freelancer" onClose={onClose}>
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
          <label className="form-label">Professional Title</label>
          <input className="form-control" placeholder="e.g. Full-Stack Web Developer"
                 value={form.professionalTitle} onChange={update("professionalTitle")} required />
        </div>
        <div className="row">
          <div className="col-6 mb-3">
            <label className="form-label">Hourly Rate ($)</label>
            <input type="number" step="0.01" className="form-control" value={form.hourlyRate} onChange={update("hourlyRate")} required />
          </div>
          <div className="col-6 mb-3">
            <label className="form-label">Years Experience</label>
            <input type="number" className="form-control" value={form.yearsExperience} onChange={update("yearsExperience")} required />
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Availability</label>
          <select className="form-select" value={form.availabilityStatus} onChange={update("availabilityStatus")}>
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="unavailable">Unavailable</option>
          </select>
        </div>
        <div className="modal-footer px-0 pb-0">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-success">Register</button>
        </div>
      </form>
    </Modal>
  );
}
