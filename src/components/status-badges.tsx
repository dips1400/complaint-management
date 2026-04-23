import { cn } from "../lib/utils";
import type { ComplaintStatus, Priority, SLAStatus } from "../lib/types";
import { statusLabel } from "../lib/mock-data";

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const styles: Record<ComplaintStatus, string> = {
    registered: "bg-info/10 text-info border-info/20",
    assigned: "bg-accent/15 text-accent-foreground border-accent/30",
    in_progress: "bg-warning/15 text-warning-foreground border-warning/30",
    resolved: "bg-success/10 text-success border-success/20",
    closed: "bg-muted text-muted-foreground border-border",
    reopened: "bg-destructive/10 text-destructive border-destructive/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        styles[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {statusLabel(status)}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const styles: Record<Priority, string> = {
    low: "bg-muted text-muted-foreground",
    medium: "bg-info/10 text-info",
    high: "bg-warning/15 text-warning-foreground",
    critical: "bg-destructive/10 text-destructive",
  };
  return (
    <span className={cn("inline-flex rounded-md px-2 py-0.5 text-xs font-medium capitalize", styles[priority])}>
      {priority}
    </span>
  );
}

export function SLABadge({ sla }: { sla: SLAStatus }) {
  const map = {
    on_time: { dot: "bg-success", label: "On Time", cls: "text-success" },
    near_deadline: { dot: "bg-warning", label: "Near Deadline", cls: "text-warning-foreground" },
    overdue: { dot: "bg-destructive", label: "Overdue", cls: "text-destructive" },
  } as const;
  const m = map[sla];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium", m.cls)}>
      <span className={cn("h-2 w-2 rounded-full", m.dot)} />
      {m.label}
    </span>
  );
}
