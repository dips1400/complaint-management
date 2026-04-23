import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "../components/app-shell";
import { complaints, categoryIcon, statusLabel } from "../lib/mock-data";
import { StatusBadge, SLABadge, PriorityBadge } from "../components/status-badges";
import { ComplaintTimeline } from "../components/complaint-timeline";
import { useState } from "react";
import { Search, RefreshCw } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/citizen/track")({
  component: TrackComplaints,
  head: () => ({ meta: [{ title: "Track Complaints — Municipal Portal" }] }),
});

function TrackComplaints() {
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selected, setSelected] = useState(complaints[0]);

  const filtered = complaints.filter((c) => {
    const matchesQ =
      !q ||
      c.id.toLowerCase().includes(q.toLowerCase()) ||
      c.title.toLowerCase().includes(q.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    return matchesQ && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Track My Complaints"
        description="Search by ID, view status timeline, and reopen if needed."
      />

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by ID or title…"
            className="h-10 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 rounded-lg border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Statuses</option>
          {["registered", "assigned", "in_progress", "resolved", "closed", "reopened"].map((s) => (
            <option key={s} value={s}>{statusLabel(s as never)}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* List */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-[var(--shadow-card)]">
          <div className="border-b px-4 py-3 text-sm font-semibold">
            {filtered.length} complaints
          </div>
          <ul className="max-h-[640px] divide-y overflow-auto">
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setSelected(c)}
                  className={`flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-muted/40 ${
                    selected.id === c.id ? "bg-muted/60" : ""
                  }`}
                >
                  <span className="mt-0.5 text-2xl">{categoryIcon(c.category)}</span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="truncate text-sm font-semibold">{c.title}</p>
                      <span className="shrink-0 text-[10px] font-mono text-muted-foreground">{c.id}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.ward}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <StatusBadge status={c.status} />
                      <SLABadge sla={c.sla} />
                    </div>
                  </div>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="py-12 text-center text-sm text-muted-foreground">
                No complaints match your filter.
              </li>
            )}
          </ul>
        </div>

        {/* Detail */}
        <div className="lg:col-span-3 space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{selected.id}</p>
                <h2 className="mt-1 text-xl font-bold">{selected.title}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{selected.location.address}</p>
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <StatusBadge status={selected.status} />
                <PriorityBadge priority={selected.priority} />
                <SLABadge sla={selected.sla} />
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Mini label="Ward" value={selected.ward.split(" - ")[0]} />
              <Mini label="Department" value={selected.department.split(" ")[0]} />
              <Mini label="Assigned" value={selected.assignedTo ?? "—"} />
              <Mini label="Filed" value={format(new Date(selected.createdAt), "dd MMM")} />
            </div>

            {selected.images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {selected.images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt=""
                    className="h-28 w-full rounded-lg border object-cover"
                  />
                ))}
              </div>
            )}

            {(selected.status === "resolved" || selected.status === "closed") && (
              <button className="mt-4 inline-flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10">
                <RefreshCw className="h-3.5 w-3.5" />
                Reopen Complaint
              </button>
            )}
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-4 text-sm font-semibold">Status Timeline</h3>
            <ComplaintTimeline events={selected.timeline} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border bg-muted/30 px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 truncate text-sm font-semibold">{value}</p>
    </div>
  );
}
