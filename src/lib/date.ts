export const weekdayLabels = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

export const weekdayShortLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function toDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function fromDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function getMonthGrid(anchorDate: Date) {
  const firstOfMonth = new Date(anchorDate.getFullYear(), anchorDate.getMonth(), 1);
  const start = addDays(firstOfMonth, -firstOfMonth.getDay());
  return Array.from({ length: 42 }, (_, index) => addDays(start, index));
}

export function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatShortDate(dateKey: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    day: "numeric",
  }).format(fromDateKey(dateKey));
}

export function formatRelativeStudyDate(date?: string) {
  if (!date) {
    return "Ainda não estudado";
  }

  const lastDate = new Date(date);
  const today = new Date();
  const diffInDays = Math.floor(
    (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (diffInDays <= 0) {
    return "Estudado hoje";
  }

  if (diffInDays === 1) {
    return "Estudado ontem";
  }

  return `Estudado há ${diffInDays} dias`;
}
