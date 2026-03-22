type AuthSidePanelProps = {
  eyebrow: string;
  title: string;
  description: string;
  highlights: string[];
  accent?: "sky" | "amber";
};

export default function AuthSidePanel({
  eyebrow,
  title,
  description,
  highlights,
  accent = "sky"
}: AuthSidePanelProps) {
  const dotClass = accent === "amber" ? "bg-amber-400" : "bg-sky-400";
  const chipClass =
    accent === "amber"
      ? "border-amber-200 bg-amber-50/90 text-amber-900"
      : "border-sky-200 bg-sky-50/90 text-sky-900";

  return (
    <div className="relative z-10 flex h-full flex-col">
      <p className="landing-label">{eyebrow}</p>
      <h1 className="landing-display mt-5 text-4xl font-semibold leading-tight text-slate-950 md:text-5xl">
        {title}
      </h1>
      <p className="landing-muted mt-5 max-w-xl text-base leading-8 md:text-lg">
        {description}
      </p>

      <div className="mt-8 grid gap-3">
        {highlights.map((item) => (
          <div
            key={item}
            className="landing-panel flex items-center gap-3 px-4 py-4 text-sm font-medium text-slate-700"
          >
            <span className={`h-2.5 w-2.5 rounded-full ${dotClass}`} />
            {item}
          </div>
        ))}
      </div>

      <div className="mt-auto pt-8">
        <div className={`landing-chip ${chipClass}`}>
          Smart Logistics Platform
        </div>
      </div>
    </div>
  );
}
