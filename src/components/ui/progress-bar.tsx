import { cn } from "@/lib/cn";

interface ProgressBarProps {
  value: number;
  label?: string;
  tone?: "green" | "cyan" | "coral";
}

const tones = {
  green: "bg-[#39d98a]",
  cyan: "bg-[#38c7ff]",
  coral: "bg-[#ff6f61]",
};

export function ProgressBar({ value, label, tone = "green" }: ProgressBarProps) {
  const safeValue = Math.min(100, Math.max(0, value));

  return (
    <div className="space-y-2">
      {label ? (
        <div className="flex items-center justify-between text-xs text-[#aeb7c2]">
          <span>{label}</span>
          <span>{safeValue}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-md bg-[#242830]">
        <div
          className={cn("h-full rounded-md transition-all", tones[tone])}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}
