import {
  BarChart3,
  BookOpenCheck,
  CalendarDays,
  LayoutDashboard,
  TimerReset,
  UserRound,
} from "lucide-react";

export const navItems = [
  { href: "/", label: "Início", icon: LayoutDashboard },
  { href: "/calendario", label: "Calendário", icon: CalendarDays },
  { href: "/estudos", label: "Estudos", icon: BookOpenCheck },
  { href: "/pomodoro", label: "Foco", icon: TimerReset },
  { href: "/analytics", label: "Análise", icon: BarChart3 },
  { href: "/perfil", label: "Perfil", icon: UserRound },
];
