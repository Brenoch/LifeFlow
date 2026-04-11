import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-normal text-[#39d98a]">
            {eyebrow}
          </p>
        ) : null}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-[#f4f7fb] sm:text-3xl">{title}</h1>
          {description ? <p className="max-w-2xl text-sm text-[#aeb7c2]">{description}</p> : null}
        </div>
      </div>
      {action ? <div>{action}</div> : null}
    </header>
  );
}
