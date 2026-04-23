import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/app-shell"
import { auditLogs } from "../lib/mock-data"
import { format } from "date-fns";
import { Search, Download } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/admin/audit")({
  component: AuditLogsPage,
  head: () => ({ meta: [{ title: "Audit Logs — Admin" }] }),
});

function AuditLogsPage() {
  const [q, setQ] = useState("");
  const filtered = auditLogs.filter(
    (l) =>
      !q ||
      l.actor.toLowerCase().includes(q.toLowerCase()) ||
      l.action.toLowerCase().includes(q.toLowerCase()) ||
      l.target.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Audit Logs"
        description="Immutable record of every action taken across the system."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">
            <Download className="h-4 w-4" /> Export CSV
          </button>
        }
      />

      <div className="mb-4 flex gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search actor, action or target…"
            className="h-10 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Timestamp</th>
              <th className="px-4 py-3 text-left">Actor</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Target</th>
              <th className="px-4 py-3 text-left">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((l) => (
              <tr key={l.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                  {format(new Date(l.at), "dd MMM, hh:mm a")}
                </td>
                <td className="px-4 py-3 font-medium">{l.actor}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                    {l.action}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{l.target}</td>
                <td className="px-4 py-3 text-xs text-muted-foreground">{l.details}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                  No matching audit entries.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
