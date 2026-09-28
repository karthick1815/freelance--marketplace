export default function Hero({ apiStatus }) {
  const badgeClass =
    apiStatus === "connected" ? "badge bg-success" :
    apiStatus === "error" ? "badge bg-danger" :
    "badge bg-secondary";

  const badgeText =
    apiStatus === "connected" ? "API connected" :
    apiStatus === "error" ? "API not reachable — is the Spring Boot backend running on :8080?" :
    "Checking API connection...";

  return (
    <header className="hero text-white text-center py-5">
      <div className="container py-4">
        <h1 className="display-5 fw-bold">Post it. Pin it. Get it built.</h1>
        <p className="lead col-lg-7 mx-auto">
          A Java Spring Boot + MySQL powered freelance marketplace, with a React frontend.
          Data below is fetched live from the REST API.
        </p>
        <div className={badgeClass}>{badgeText}</div>
      </div>
    </header>
  );
}
