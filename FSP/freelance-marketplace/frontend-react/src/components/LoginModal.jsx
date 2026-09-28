import { useState } from "react";
import Modal from "./Modal";
import { loginUser } from "../api/client";
import { useSession } from "../context/SessionContext";

export default function LoginModal({ show, onClose }) {
  const { login } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [alert, setAlert] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setAlert(null);
    try {
      const data = await loginUser({ email, password });
      login(data);
      setAlert({ type: "success", text: `Welcome back, ${data.fullName}!` });
      setTimeout(() => {
        onClose();
        setEmail("");
        setPassword("");
        setAlert(null);
      }, 800);
    } catch (err) {
      setAlert({ type: "danger", text: err.message });
    }
  }

  return (
    <Modal show={show} title="Login" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        {alert && <div className={`alert alert-${alert.type}`}>{alert.text}</div>}
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={email}
                 onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" className="form-control" value={password}
                 onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-text mb-3">
          Note: only accounts created through Register have a password. The original 30 seed
          accounts (from the SQL file) don't — register a new account to log in.
        </div>
        <div className="modal-footer px-0 pb-0">
          <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-success">Login</button>
        </div>
      </form>
    </Modal>
  );
}
