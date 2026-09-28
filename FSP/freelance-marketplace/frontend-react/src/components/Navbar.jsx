import { useState } from "react";
import { useSession } from "../context/SessionContext";

// No bootstrap.js dependency: the mobile toggle and the Register dropdown
// are controlled entirely with React state, so this works even though we
// only import Bootstrap's CSS, not its JS bundle.
export default function Navbar({ onOpenModal }) {
  const { session, logout } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  function openModal(name) {
    setMenuOpen(false);
    setRegisterOpen(false);
    onOpenModal(name);
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top">
      <div className="container">
        <a className="navbar-brand fw-bold" href="#">
          <i className="bi bi-pin-angle-fill text-warning"></i> Corkboard
        </a>
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item">
              <a className="nav-link" href="#projects" onClick={() => setMenuOpen(false)}>Projects</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#freelancers" onClick={() => setMenuOpen(false)}>Freelancers</a>
            </li>

            <li className={`nav-item dropdown ${registerOpen ? "show" : ""}`}>
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                onClick={(e) => { e.preventDefault(); setRegisterOpen((v) => !v); }}
              >
                Register
              </a>
              <ul className={`dropdown-menu dropdown-menu-end ${registerOpen ? "show" : ""}`}>
                <li>
                  <button className="dropdown-item" onClick={() => openModal("registerClient")}>
                    As a Client
                  </button>
                </li>
                <li>
                  <button className="dropdown-item" onClick={() => openModal("registerFreelancer")}>
                    As a Freelancer
                  </button>
                </li>
              </ul>
            </li>

            {!session && (
              <li className="nav-item">
                <button className="nav-link btn btn-link" onClick={() => openModal("login")}>
                  Login
                </button>
              </li>
            )}

            {session && (
              <li className="nav-item d-flex align-items-center">
                <span className="navbar-text text-light me-2">
                  {session.fullName} ({session.role})
                </span>
                <button className="btn btn-outline-light btn-sm" onClick={logout}>
                  Logout
                </button>
              </li>
            )}

            <li className="nav-item ms-lg-2">
              <button
                className="nav-link btn btn-success text-white px-3"
                onClick={() => openModal("postProject")}
              >
                Post a Project
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
