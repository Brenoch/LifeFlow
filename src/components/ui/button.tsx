import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary: "border-transparent bg-[#39d98a] text-[#101113] hover:bg-[#6ee7aa]",
  secondary: "border-[#2b2f36] bg-[#1a1d22] text-[#f4f7fb] hover:bg-[#22262d]",
  ghost: "border-transparent bg-transparent text-[#aeb7c2] hover:bg-[#1a1d22]",
  danger: "border-[#4a2b2d] bg-[#2a1719] text-[#ff9b91] hover:bg-[#3a2023]",
};

export function Button({
  className,
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-10 items-center justify-center rounded-md border px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      type={type}
      {...props}
    />
  );
}
