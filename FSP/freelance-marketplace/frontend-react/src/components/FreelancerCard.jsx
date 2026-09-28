export default function FreelancerCard({ freelancer, onClick }) {
  const name = freelancer.user ? freelancer.user.fullName : "Unknown";
  const country = freelancer.user ? freelancer.user.country : "";

  return (
    <div className="col-md-6 col-lg-3">
      <div className="card freelancer-card" style={{ cursor: "pointer" }} onClick={() => onClick(freelancer.freelancerId)}>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="fw-bold">{name}</div>
              <div className="text-muted small mb-1">{country}</div>
            </div>
            <span className="badge bg-light text-dark">#{freelancer.freelancerId}</span>
          </div>
          <h6 className="card-title text-muted small fst-italic mb-2">{freelancer.professionalTitle}</h6>
          <div className="text-warning small mb-2">${Number(freelancer.hourlyRate).toFixed(2)}/hr</div>
          <div className="d-flex justify-content-between small text-muted">
            <span><i className="bi bi-star-fill text-warning"></i> {Number(freelancer.ratingAvg).toFixed(2)}</span>
            <span>{freelancer.yearsExperience} yrs exp</span>
          </div>
          <span className={`badge mt-2 ${freelancer.availabilityStatus === "available" ? "bg-success" : "bg-secondary"}`}>
            {freelancer.availabilityStatus}
          </span>
        </div>
      </div>
    </div>
  );
}
