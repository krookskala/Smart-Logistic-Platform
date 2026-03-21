const highlights = [
  {
    title: "Live shipment visibility",
    description:
      "Follow shipment progress in real time and keep delivery movement visible across the full workflow."
  },
  {
    title: "Role-based operations",
    description:
      "Separate workspaces for customers, couriers, and administrators keep each role aligned with its responsibilities."
  },
  {
    title: "Dispatch and audit control",
    description:
      "Coordinate courier assignment, manage access changes, and review platform activity from one connected system."
  }
];

export default function LandingFeatureStrip() {
  return (
    <section className="landing-surface p-6 md:p-8">
      <div className="grid gap-4 lg:grid-cols-3">
        {highlights.map((item) => (
          <article key={item.title} className="landing-panel p-5 md:p-6">
            <p className="landing-label">{item.title}</p>
            <p className="mt-4 text-xl font-semibold text-slate-950">
              {item.title}
            </p>
            <p className="landing-muted mt-3 text-sm leading-7">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
