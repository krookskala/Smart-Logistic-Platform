const steps = [
  {
    step: "01",
    title: "Create shipment requests",
    description:
      "Users create structured shipment requests, then monitor whether each delivery is still editable, assigned, or completed."
  },
  {
    step: "02",
    title: "Assign courier coverage",
    description:
      "Administrators review the active queue, search shipment work, and route requests to the right available courier."
  },
  {
    step: "03",
    title: "Submit live delivery updates",
    description:
      "Couriers move work through validated status transitions with notes and live updates that keep shipment visibility current."
  },
  {
    step: "04",
    title: "Inspect audit and access activity",
    description:
      "Administrators review change history, manage account updates, and preserve traceability across platform operations."
  }
];

export default function LandingWorkflowBand() {
  return (
    <section className="landing-surface p-6 md:p-8">
      <div className="max-w-3xl">
        <p className="landing-label">Operational Workflow</p>
        <h2 className="landing-display mt-4 text-4xl font-semibold text-slate-950">
          Built around the actual path of a delivery operation
        </h2>
        <p className="landing-muted mt-4 text-base leading-8">
          The platform supports the end-to-end workflow from shipment request to
          dispatch, live tracking, and operational oversight.
        </p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {steps.map((item) => (
          <article key={item.step} className="landing-panel p-5 md:p-6">
            <div className="flex items-center gap-3">
              <span className="landing-chip">{item.step}</span>
              <p className="text-xl font-semibold text-slate-950">
                {item.title}
              </p>
            </div>
            <p className="landing-muted mt-4 text-sm leading-7">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
