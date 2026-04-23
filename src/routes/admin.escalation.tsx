import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/app-shell";
import { ChevronRight, AlertTriangle, Clock } from "lucide-react";

export const Route = createFileRoute("/admin/escalation")({
  component: Escalation,
  head: () => ({ meta: [{ title: "Escalation Matrix — Admin" }] }),
});

const matrix = [
  { level: 1, label: "Officer", role: "Department Officer", trigger: "No action within 50% of SLA", icon: "👤", color: "var(--info)" },
  { level: 2, label: "Senior Officer", role: "Senior / Asst. Engineer", trigger: "SLA breached", icon: "🧑‍💼", color: "var(--warning)" },
  { level: 3, label: "Commissioner", role: "Municipal Commissioner", trigger: "150% of SLA elapsed or 3+ reopens", icon: "🏛️", color: "var(--destructive)" },
];

function Escalation() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Escalation Matrix"
        description="Auto-escalate complaints when SLAs are at risk or breached."
      />

      <div className="rounded-xl border bg-card p-6 shadow-[var(--shadow-card)]">
        <div className="flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
          {matrix.map((m, i) => (
            <div key={m.level} className="flex flex-1 items-center gap-4">
              <div
                className="flex flex-1 items-start gap-4 rounded-xl border-2 p-4"
                style={{ borderColor: m.color, background: `color-mix(in oklab, ${m.color} 8%, transparent)` }}
              >
                <span className="text-3xl">{m.icon}</span>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Level {m.level}
                  </p>
                  <p className="font-bold">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                  <p className="mt-2 flex items-start gap-1.5 text-xs">
                    <Clock className="mt-0.5 h-3 w-3 shrink-0" />
                    <span>{m.trigger}</span>
                  </p>
                </div>
              </div>
              {i < matrix.length - 1 && (
                <ChevronRight className="hidden h-5 w-5 shrink-0 text-muted-foreground lg:block" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/5 p-4">
          <AlertTriangle className="h-4 w-4 shrink-0 text-warning-foreground" />
          <div className="text-xs">
            <p className="font-semibold">Auto-escalation runs every 15 minutes.</p>
            <p className="mt-1 text-muted-foreground">
              Triggers SMS + Email to the next level. Escalations are recorded in the audit log.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
        <h3 className="mb-3 text-base font-semibold">Per-Category Overrides</h3>
        <div className="space-y-2">
          {[
            { cat: "Water Supply", l1: "12h", l2: "24h", l3: "48h" },
            { cat: "Street Lights", l1: "24h", l2: "48h", l3: "72h" },
            { cat: "Garbage / Sanitation", l1: "24h", l2: "48h", l3: "72h" },
            { cat: "Roads & Potholes", l1: "36h", l2: "72h", l3: "120h" },
          ].map((r) => (
            <div key={r.cat} className="grid grid-cols-4 items-center rounded-lg border p-3 text-sm">
              <span className="font-medium">{r.cat}</span>
              <span className="text-center"><Pill label="L1" value={r.l1} /></span>
              <span className="text-center"><Pill label="L2" value={r.l2} /></span>
              <span className="text-center"><Pill label="L3" value={r.l3} /></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-2 py-0.5 text-xs">
      <span className="font-semibold text-muted-foreground">{label}</span>
      <span className="font-mono font-semibold">{value}</span>
    </span>
  );
}
