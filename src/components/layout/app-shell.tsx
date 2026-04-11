"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { cn } from "@/lib/cn";
import { useLifeFlow } from "@/hooks/use-lifeflow";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/calendario", label: "Calendário" },
  { href: "/estudos", label: "Estudos" },
  { href: "/pomodoro", label: "Foco" },
  { href: "/perfil", label: "Perfil" },
];

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
      <main className="grid min-h-screen place-items-center bg-[#101113] px-6 text-[#f4f7fb]">
        <div className="card w-full max-w-sm p-6 text-center">
          <p className="text-sm text-[#aeb7c2]">Carregando LifeFlow...</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#101113] px-6 text-[#f4f7fb]">
        <div className="card w-full max-w-sm p-6 text-center">
          <p className="text-sm text-[#aeb7c2]">Abrindo sua tela de login...</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#101113] text-[#f4f7fb]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-5 sm:px-6 lg:pb-8">
        <header className="mb-6 flex items-center justify-between gap-4">
          <Link className="flex min-w-0 items-center gap-3" href="/">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-[#39d98a] text-sm font-black text-[#101113]">
              LF
            </span>
            <span className="min-w-0">
              <span className="block text-base font-bold">LifeFlow</span>
              <span className="block truncate text-xs text-[#aeb7c2]">
                Nível {levelInfo.level} do seu sistema de disciplina
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-md border border-[#2b2f36] bg-[#17191e] px-3 py-2 text-xs text-[#aeb7c2] sm:flex">
            <span className="font-semibold text-[#f4f7fb]">{data.profile.name}</span>
            <span>{data.profile.xp} XP</span>
          </div>
        </header>

        <main className="flex-1">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#2b2f36] bg-[#121417]/95 px-2 py-2 backdrop-blur sm:left-1/2 sm:max-w-xl sm:-translate-x-1/2 sm:rounded-t-md sm:border-x">
        <div className="grid grid-cols-5 gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link
                className={cn(
                  "rounded-md px-2 py-2 text-center text-xs font-semibold transition",
                  isActive
                    ? "bg-[#39d98a] text-[#101113]"
                    : "text-[#aeb7c2] hover:bg-[#1a1d22] hover:text-[#f4f7fb]",
                )}
                href={item.href}
                key={item.href}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
