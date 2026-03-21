type AdminTabKey = "overview" | "shipments" | "users" | "audit";

type AdminTabSwitcherProps = {
  activeTab: AdminTabKey;
  onChange: (tab: AdminTabKey) => void;
};

const tabs: Array<{ key: AdminTabKey; label: string; description: string }> = [
  {
    key: "overview",
    label: "Overview",
    description: "Network performance and current priorities."
  },
  {
    key: "shipments",
    label: "Shipments",
    description: "Dispatch planning and shipment routing."
  },
  {
    key: "users",
    label: "Users",
    description: "Access management and courier setup."
  },
  {
    key: "audit",
    label: "Audit",
    description: "Change history and operational traceability."
  }
];

export default function AdminTabSwitcher({
  activeTab,
  onChange
}: AdminTabSwitcherProps) {
  return (
    <div className="admin-surface p-3">
      <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`rounded-2xl px-4 py-4 text-left transition ${
                isActive
                  ? "border border-sky-200 bg-sky-50 text-slate-950 shadow-sm"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <p
                className={`admin-label ${
                  isActive ? "text-sky-700" : "text-slate-500"
                }`}
              >
                {tab.label}
              </p>
              <p className="mt-2 text-lg font-semibold">{tab.label}</p>
              <p
                className={`mt-1 text-sm ${
                  isActive ? "text-slate-600" : "text-slate-500"
                }`}
              >
                {tab.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
