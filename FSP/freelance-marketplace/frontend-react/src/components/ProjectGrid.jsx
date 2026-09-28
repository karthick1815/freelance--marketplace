import { useMemo, useState } from "react";
import ProjectCard from "./ProjectCard";

export default function ProjectGrid({ projects, categories, onSubmitProposal, onViewProposals, onDelete }) {
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryId || (p.category && String(p.category.categoryId) === categoryId);
      return matchesSearch && matchesCategory;
    });
  }, [projects, search, categoryId]);

  return (
    <section className="container my-5" id="projects">
      <h2 className="mb-3"><i className="bi bi-clipboard-check"></i> Browse Projects</h2>

      <div className="row g-2 mb-3">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search projects by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-3">
        {filtered.length === 0 ? (
          <div className="col-12 text-center text-muted py-4">No projects match your filters.</div>
        ) : (
          filtered.map((p) => (
            <ProjectCard
              key={p.projectId}
              project={p}
              onSubmitProposal={onSubmitProposal}
              onViewProposals={onViewProposals}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </section>
  );
}
