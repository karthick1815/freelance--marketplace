import { useEffect, useState, useCallback } from "react";
import { SessionProvider } from "./context/SessionContext";
import { getCategories, getProjects, getFreelancers, deleteProject as apiDeleteProject } from "./api/client";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Stats from "./components/Stats";
import ProjectGrid from "./components/ProjectGrid";
import FreelancerGrid from "./components/FreelancerGrid";
import Footer from "./components/Footer";

import PostProjectModal from "./components/PostProjectModal";
import SubmitProposalModal from "./components/SubmitProposalModal";
import ViewProposalsModal from "./components/ViewProposalsModal";
import FreelancerDetailModal from "./components/FreelancerDetailModal";
import LoginModal from "./components/LoginModal";
import RegisterClientModal from "./components/RegisterClientModal";
import RegisterFreelancerModal from "./components/RegisterFreelancerModal";

function AppContent() {
  const [apiStatus, setApiStatus] = useState("checking"); // checking | connected | error
  const [categories, setCategories] = useState([]);
  const [projects, setProjects] = useState([]);
  const [freelancers, setFreelancers] = useState([]);

  // Which modal is open, and any data it needs
  const [activeModal, setActiveModal] = useState(null); // "login" | "registerClient" | "registerFreelancer" | "postProject" | "submitProposal" | "viewProposals" | "freelancerDetail" | null
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedFreelancerId, setSelectedFreelancerId] = useState(null);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setSelectedProject(null);
    setSelectedFreelancerId(null);
  }, []);

  async function loadAll() {
    try {
      const [cats, projs, freels] = await Promise.all([
        getCategories(),
        getProjects(),
        getFreelancers(),
      ]);
      setCategories(cats);
      setProjects(projs);
      setFreelancers(freels);
      setApiStatus("connected");
    } catch {
      setApiStatus("error");
    }
  }

  useEffect(() => {
    loadAll();
  }, []);

  function handleProjectCreated(saved) {
    setProjects((prev) => [...prev, saved]);
  }

  async function handleDeleteProject(projectId) {
    if (!confirm("Are you sure you want to delete this project? This cannot be undone.")) return;
    try {
      await apiDeleteProject(projectId);
      setProjects((prev) => prev.filter((p) => p.projectId !== projectId));
    } catch {
      alert("Could not delete this project. Make sure the backend is running and try again.");
    }
  }

  const openCount = projects.filter((p) => p.status === "open").length;

  return (
    <>
      <Navbar onOpenModal={setActiveModal} />
      <Hero apiStatus={apiStatus} />
      <Stats
        projectCount={projects.length}
        freelancerCount={freelancers.length}
        categoryCount={categories.length}
        openCount={openCount}
      />

      {apiStatus === "error" && (
        <div className="container">
          <div className="alert alert-warning">
            Could not reach the backend at <code>http://localhost:8080/api</code>. Make sure the
            Spring Boot application is running.
          </div>
        </div>
      )}

      <ProjectGrid
        projects={projects}
        categories={categories}
        onSubmitProposal={(project) => { setSelectedProject(project); setActiveModal("submitProposal"); }}
        onViewProposals={(project) => { setSelectedProject(project); setActiveModal("viewProposals"); }}
        onDelete={handleDeleteProject}
      />

      <FreelancerGrid
        freelancers={freelancers}
        onSelect={(id) => { setSelectedFreelancerId(id); setActiveModal("freelancerDetail"); }}
      />

      <Footer />

      {/* Modals: only one renders meaningfully at a time, driven by activeModal */}
      <LoginModal show={activeModal === "login"} onClose={closeModal} />
      <RegisterClientModal show={activeModal === "registerClient"} onClose={closeModal} />
      <RegisterFreelancerModal show={activeModal === "registerFreelancer"} onClose={closeModal} />
      <PostProjectModal
        show={activeModal === "postProject"}
        onClose={closeModal}
        categories={categories}
        onCreated={handleProjectCreated}
      />
      <SubmitProposalModal
        show={activeModal === "submitProposal"}
        onClose={closeModal}
        project={selectedProject}
      />
      <ViewProposalsModal
        show={activeModal === "viewProposals"}
        onClose={closeModal}
        project={selectedProject}
      />
      <FreelancerDetailModal
        show={activeModal === "freelancerDetail"}
        onClose={closeModal}
        freelancerId={selectedFreelancerId}
      />
    </>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <AppContent />
    </SessionProvider>
  );
}
