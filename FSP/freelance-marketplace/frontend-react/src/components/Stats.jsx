export default function Stats({ projectCount, freelancerCount, categoryCount, openCount }) {
  const stats = [
    { label: "Projects", value: projectCount },
    { label: "Freelancers", value: freelancerCount },
    { label: "Categories", value: categoryCount },
    { label: "Open Right Now", value: openCount },
  ];

  return (
    <section className="container my-4">
      <div className="row text-center g-3">
        {stats.map((s) => (
          <div className="col-6 col-md-3" key={s.label}>
            <div className="card stat-card">
              <div className="card-body">
                <div className="fs-3 fw-bold text-warning">{s.value ?? "–"}</div>
                <div className="text-muted small">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
