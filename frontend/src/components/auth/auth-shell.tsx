import { ReactNode } from "react";

type AuthShellProps = {
  sidePanel: ReactNode;
  formPanel: ReactNode;
  formAccent?: "sky" | "amber";
};

export default function AuthShell({
  sidePanel,
  formPanel,
  formAccent = "sky"
}: AuthShellProps) {
  const formAccentClass =
    formAccent === "amber"
      ? "border-amber-200/90 bg-gradient-to-br from-white via-white to-amber-50/60"
      : "border-sky-200/90 bg-gradient-to-br from-white via-white to-sky-50/60";

  return (
    <main className="auth-experience px-6 py-8 md:px-8 md:py-10">
      <div className="auth-page-shell">
        <div className="auth-shell-card grid gap-6 p-5 md:p-7 xl:grid-cols-[1.02fr_0.98fr] xl:p-8">
          <div className="auth-side-panel p-6 md:p-8">{sidePanel}</div>
          <div className={`auth-form-card p-6 md:p-8 ${formAccentClass}`}>
            {formPanel}
          </div>
        </div>
      </div>
    </main>
  );
}
