interface StatCardProps {
  label: string;
  value: string | number;
  helper?: string;
  tone?: "green" | "cyan" | "coral" | "gold";
}

const tones = {
  green: "border-[#39d98a]/35",
  cyan: "border-[#38c7ff]/35",
  coral: "border-[#ff6f61]/35",
  gold: "border-[#f7c948]/35",
};

export function StatCard({ label, value, helper, tone = "green" }: StatCardProps) {
  return (
    <article className={`card ${tones[tone]} p-4`}>
      <p className="text-xs text-[#aeb7c2]">{label}</p>
      <p className="mt-2 text-2xl font-bold text-[#f4f7fb]">{value}</p>
      {helper ? <p className="mt-1 text-xs text-[#7e8896]">{helper}</p> : null}
    </article>
  );
}
