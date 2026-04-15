"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/cn";
import { navItems } from "@/components/layout/nav-items";

export function BottomNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--border)] bg-[#151719]/95 px-2 py-2 backdrop-blur-xl xl:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-6 gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <Link
              className={cn(
                "flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-lg px-1 text-center text-[10px] font-bold transition duration-200",
                active
                  ? "bg-[var(--primary)] text-[var(--text-inverse)]"
                  : "text-[var(--muted)] hover:bg-white/[0.06] hover:text-white",
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-4 w-4" />
              <span className="max-w-full truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
