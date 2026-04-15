import { CheckCircle2, TriangleAlert } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/cn";
import { storageModeLabels } from "@/lib/labels";

interface FirebaseStatusCardProps {
  storageMode: "local" | "firebase";
  isFirebaseEnabled: boolean;
  syncError: string | null;
}

export function FirebaseStatusCard({
  storageMode,
  isFirebaseEnabled,
  syncError,
}: FirebaseStatusCardProps) {
  const healthy = isFirebaseEnabled && storageMode === "firebase" && !syncError;

  return (
    <div className="rounded-lg border border-[var(--border)] bg-white/[0.03] p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-black">Sincronização</p>
          <p className="mt-1 text-xs text-[var(--muted)]">Estado atual dos dados.</p>
        </div>
        <Badge tone={healthy ? "success" : syncError ? "error" : "warning"}>
          {healthy ? "Online" : syncError ? "Atenção" : "Local"}
        </Badge>
      </div>

      <div className="space-y-3 text-sm">
        <StatusRow label="Armazenamento" value={storageModeLabels[storageMode]} active={storageMode === "firebase"} />
        <StatusRow label="Configuração Firebase" value={isFirebaseEnabled ? "Ativa" : "Variáveis ausentes"} active={isFirebaseEnabled} />
        <div className="flex items-start justify-between gap-3">
          <span className="text-[var(--muted)]">Status</span>
          <span className={cn("max-w-[68%] text-right font-semibold", syncError ? "text-rose-200" : "text-emerald-200")}>
            {syncError ?? (storageMode === "firebase" ? "Firestore ativo" : "Somente neste navegador")}
          </span>
        </div>
      </div>
    </div>
  );
}

function StatusRow({ label, value, active }: { label: string; value: string; active: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[var(--muted)]">{label}</span>
      <span className={cn("inline-flex items-center gap-1 font-semibold", active ? "text-emerald-200" : "text-amber-200")}>
        {active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <TriangleAlert className="h-3.5 w-3.5" />}
        {value}
      </span>
    </div>
  );
}
