"use client";

import {
  BookOpenCheck,
  CalendarDays,
  Flame,
  LayoutDashboard,
  TimerReset,
  Trophy,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { useLifeFlow } from "@/hooks/use-lifeflow";
import { cn } from "@/lib/cn";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/calendario", label: "Calendário" },
  { href: "/estudos", label: "Estudos" },
  { href: "/pomodoro", label: "Foco" },
  { href: "/perfil", label: "Perfil" },
];

const navIcons = {
  "/": LayoutDashboard,
  "/calendario": CalendarDays,
  "/estudos": BookOpenCheck,
  "/pomodoro": TimerReset,
  "/perfil": UserRound,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isReady, levelInfo } = useLifeFlow();

  useEffect(() => {
    if (isReady && !data) {
      router.replace("/entrar");
    }
  }, [data, isReady, router]);

  if (!isReady) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--background)] px-6 text-[var(--text)]">
        <div className="card w-full max-w-sm p-6 text-center">
          <p className="text-sm text-[var(--muted)]">Carregando LifeFlow...</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="grid min-h-screen place-items-center bg-[var(--background)] px-6 text-[var(--text)]">
        <div className="card w-full max-w-sm p-6 text-center">
          <p className="text-sm text-[var(--muted)]">Abrindo sua tela de login...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--text)]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-[var(--border)] bg-[#11141d]/92 px-5 py-6 backdrop-blur-xl lg:flex lg:flex-col">
        <Link className="flex min-w-0 items-center gap-3" href="/">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[var(--primary)] text-sm font-black text-white shadow-[0_14px_34px_rgba(139,92,246,0.28)]">
            LF
          </span>
          <span className="min-w-0">
            <span className="block text-base font-black">LifeFlow</span>
            <span className="block truncate text-xs text-[var(--muted)]">
              Disciplina com ritmo
            </span>
          </span>
        </Link>

        <div className="mt-8 grid gap-2">
          {navItems.map((item) => {
            const Icon = navIcons[item.href as keyof typeof navIcons];
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                className={cn(
                  "group flex min-h-12 items-center gap-3 rounded-lg border px-3 text-sm font-semibold transition",
                  isActive
                    ? "border-violet-300/24 bg-violet-400/14 text-white"
                    : "border-transparent text-[var(--muted)] hover:border-[var(--border)] hover:bg-white/[0.05] hover:text-white",
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="mt-auto space-y-4">
          <div className="card p-4">
            <div className="mb-3 flex items-center justify-between">
              <Badge tone="violet">Nível {levelInfo.level}</Badge>
              <Trophy className="h-4 w-4 text-violet-200" />
            </div>
            <p className="truncate text-sm font-bold">{data.profile.name}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{data.profile.xp} XP acumulados</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-white/[0.035] px-3 py-2 text-xs text-[var(--muted)]">
            <Flame className="h-4 w-4 text-amber-200" />
            Sequência atual em foco
          </div>
        </div>
      </aside>

      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-24 pt-5 sm:px-6 lg:ml-72 lg:max-w-none lg:px-8 lg:pb-10 lg:pt-8">
        <header className="mb-6 flex items-center justify-between gap-4 lg:hidden">
          <Link className="flex min-w-0 items-center gap-3" href="/">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-[var(--primary)] text-sm font-black text-white">
              LF
            </span>
            <span className="min-w-0">
              <span className="block text-base font-black">LifeFlow</span>
              <span className="block truncate text-xs text-[var(--muted)]">
                Nível {levelInfo.level} do seu sistema de disciplina
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-lg border border-[var(--border)] bg-white/[0.04] px-3 py-2 text-xs text-[var(--muted)] sm:flex">
            <span className="font-semibold text-[var(--text)]">{data.profile.name}</span>
            <span>{data.profile.xp} XP</span>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[#11141d]/95 px-2 py-2 backdrop-blur-xl lg:hidden">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const Icon = navIcons[item.href as keyof typeof navIcons];
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg px-2 text-center text-[11px] font-bold transition",
                  isActive
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--muted)] hover:bg-white/[0.06] hover:text-white",
                )}
                href={item.href}
                key={item.href}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
