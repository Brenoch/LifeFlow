"use client";

import { Flame, Trophy } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { useLifeFlow } from "@/hooks/use-lifeflow";
import { cn } from "@/lib/cn";
import { navItems } from "@/components/layout/nav-items";

export function DesktopSidebar() {
  const pathname = usePathname();
  const { data, levelInfo, streak } = useLifeFlow();

  if (!data) {
    return null;
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[var(--border)] bg-[#151719]/95 px-5 py-6 backdrop-blur-xl xl:flex xl:flex-col">
      <Link className="flex min-w-0 items-center gap-3" href="/">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--primary)] text-sm font-black text-[var(--text-inverse)] shadow-[0_14px_34px_rgba(244,239,95,0.2)]">
          LF
        </span>
        <span className="min-w-0">
          <span className="block text-base font-black">LifeFlow</span>
          <span className="block truncate text-xs text-[var(--muted)]">Disciplina sem ruído</span>
        </span>
      </Link>

      <nav className="mt-8 grid gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              className={cn(
                "group flex min-h-12 items-center gap-3 rounded-lg border px-3 text-sm font800 font-semibold transition duration-200",
                active
                  ? "border-[color-mix(in_srgb,var(--primary)_38%,transparent)] bg-[var(--primary-soft)] text-[var(--primary)]"
                  : "border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:bg-white/[0.055] hover:text-[var(--text)]",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-4">
        <div className="panel p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Badge tone="warning">Nível {levelInfo.level}</Badge>
            <Trophy className="h-4 w-4 text-[var(--primary)]" />
          </div>
          <p className="truncate text-sm font-black">{data.profile.name}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">{data.profile.xp} XP acumulados</p>
          <div className="mt-4 h-2 overflow-hidden rounded-lg bg-white/[0.08]">
            <div
              className="h-full rounded-lg bg-[var(--primary)]"
              style={{ width: `${levelInfo.progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white/[0.045] px-3 py-2 text-xs text-[var(--muted)]">
          <Flame className="h-4 w-4 text-[var(--primary)]" />
          {streak} dia(s) em sequência
        </div>
      </div>
    </aside>
  );
}
