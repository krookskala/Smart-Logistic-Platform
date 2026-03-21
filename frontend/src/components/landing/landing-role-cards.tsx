const roles = [
  {
    name: "User",
    eyebrow: "Customer Experience",
    tone: "border-amber-200 bg-amber-50/70",
    description:
      "Create shipment requests, manage eligible edits or cancellations, and track delivery progress through a cleaner self-service workspace."
  },
  {
    name: "Courier",
    eyebrow: "Field Operations",
    tone: "border-emerald-200 bg-emerald-50/70",
    description:
      "Manage assignment readiness, focus on active deliveries, and submit structured status updates with clear workflow guidance."
  },
  {
    name: "Admin",
    eyebrow: "Command Center",
    tone: "border-sky-200 bg-sky-50/70",
    description:
      "Oversee platform activity, coordinate dispatch decisions, manage account roles, and inspect audit history from a centralized operations view."
  }
];

export default function LandingRoleCards() {
  return (
    <section id="roles" className="landing-surface p-6 md:p-8">
      <div className="max-w-3xl">
        <p className="landing-label">Role Experiences</p>
        <h2 className="landing-display mt-4 text-4xl font-semibold text-slate-950">
          Three focused workspaces connected by one logistics platform
        </h2>
        <p className="landing-muted mt-4 text-base leading-8">
          Smart Logistics is structured around how each role actually works, so
          customers, couriers, and administrators each get an interface aligned
          with their daily responsibilities.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {roles.map((role) => (
          <article
            key={role.name}
            className={`rounded-[28px] border p-6 shadow-sm ${role.tone}`}
          >
            <p className="landing-label">{role.eyebrow}</p>
            <h3 className="mt-4 text-2xl font-semibold text-slate-950">
              {role.name}
            </h3>
            <p className="mt-4 text-sm leading-7 text-slate-700">
              {role.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
