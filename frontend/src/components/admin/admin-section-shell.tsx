import { ReactNode } from "react";

type AdminSectionShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  children: ReactNode;
};

export default function AdminSectionShell({
  eyebrow,
  title,
  description,
  aside,
  children
}: AdminSectionShellProps) {
  return (
    <section className="admin-surface p-6 md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="admin-label">{eyebrow}</p>
          <h2 className="admin-display mt-3 text-3xl font-semibold text-slate-950">
            {title}
          </h2>
          <p className="admin-muted mt-2 max-w-3xl text-sm leading-7 md:text-base">
            {description}
          </p>
        </div>

        {aside ? <div>{aside}</div> : null}
      </div>

      <div className="mt-6">{children}</div>
    </section>
  );
}
