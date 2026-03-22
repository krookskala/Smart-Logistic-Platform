const tech = [
  "Next.js + TypeScript frontend",
  "NestJS + Prisma backend",
  "PostgreSQL persistence",
  "Socket.IO live tracking updates",
  "Role-based access control",
  "Audit logging and workflow validation"
];

export default function LandingTechGrid() {
  return (
    <section className="landing-surface p-6 md:p-8">
      <div className="max-w-3xl">
        <p className="landing-label">Technical Credibility</p>
        <h2 className="landing-display mt-4 text-4xl font-semibold text-slate-950">
          Built on modern full-stack foundations for logistics software
        </h2>
        <p className="landing-muted mt-4 text-base leading-8">
          The platform combines real-time delivery workflows, backend
          validation, RBAC, and audit visibility in a portfolio-ready full-stack
          implementation.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tech.map((item) => (
          <div
            key={item}
            className="landing-panel px-5 py-5 text-sm font-medium text-slate-700"
          >
            {item}
          </div>
        ))}
      </div>
    </section>
  );
}
