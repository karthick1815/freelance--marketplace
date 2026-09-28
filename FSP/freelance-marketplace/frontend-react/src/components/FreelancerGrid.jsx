import FreelancerCard from "./FreelancerCard";

export default function FreelancerGrid({ freelancers, onSelect }) {
  return (
    <section className="container my-5" id="freelancers">
      <h2 className="mb-3"><i className="bi bi-person-badge"></i> Top Freelancers</h2>
      <div className="row g-3">
        {freelancers.length === 0 ? (
          <div className="col-12 text-center text-muted py-4">No freelancers yet.</div>
        ) : (
          freelancers.map((f) => (
            <FreelancerCard key={f.freelancerId} freelancer={f} onClick={onSelect} />
          ))
        )}
      </div>
    </section>
  );
}
