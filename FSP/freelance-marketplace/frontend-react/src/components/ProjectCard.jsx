function fmt(n) {
  return "$" + Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
}

export default function ProjectCard({ project, onSubmitProposal, onViewProposals, onDelete }) {
  return (
    <div className="col-md-6 col-lg-4">
      <div className="card project-card">
        <div className="card-body d-flex flex-column">
          <span className="badge bg-light text-dark mb-2 align-self-start">
            {project.category ? project.category.categoryName : ""}
          </span>
          <h5 className="card-title">{project.title}</h5>
          <p className="card-text text-muted small flex-grow-1">
            {(project.description || "").slice(0, 100)}...
          </p>
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="fw-bold">
              {fmt(project.budgetMin)} – {fmt(project.budgetMax)}
            </span>
            <span className={`badge badge-status-${project.status}`}>
              {project.status.replace("_", " ")}
            </span>
          </div>
          <div className="text-muted small mt-2">
            <i className="bi bi-calendar-event"></i> Deadline: {project.deadline}
          </div>
          <div className="d-flex gap-2 mt-3">
            <button
              className="btn btn-success btn-sm flex-fill"
              onClick={() => onSubmitProposal(project)}
            >
              <i className="bi bi-send"></i> Submit Proposal
            </button>
            <button
              className="btn btn-outline-primary btn-sm"
              onClick={() => onViewProposals(project)}
            >
              <i className="bi bi-people"></i>
            </button>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => onDelete(project.projectId)}
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
