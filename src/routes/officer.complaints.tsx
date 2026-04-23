import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/app-shell";
import { complaints, WARDS, categoryIcon, statusLabel, users } from "../lib/mock-data";
import { StatusBadge, SLABadge, PriorityBadge } from "../components/status-badges";
import { ComplaintTimeline } from "../components/complaint-timeline";
import { useState } from "react";
import { Search, UserPlus, Phone, MapPin, ImageIcon } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/officer/complaints")({
  component: ComplaintsList,
  head: () => ({ meta: [{ title: "Complaints — Officer" }] }),
});

function ComplaintsList() {
  const [q, setQ] = useState("");
  const [ward, setWard] = useState("all");
  const [status, setStatus] = useState("all");
  const [priority, setPriority] = useState("all");
  const [selected, setSelected] = useState(complaints[0]);

  const filtered = complaints.filter(
    (c) =>
      (!q || c.id.toLowerCase().includes(q.toLowerCase()) || c.title.toLowerCase().includes(q.toLowerCase())) &&
      (ward === "all" || c.ward === ward) &&
      (status === "all" || c.status === status) &&
      (priority === "all" || c.priority === priority),
  );

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        title="All Complaints"
        description="Filter, prioritise, and act on civic issues."
      />

      <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-5">
        <div className="relative col-span-2">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search ID or title…"
            className="h-10 w-full rounded-lg border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select value={ward} onChange={(e) => setWard(e.target.value)} className="h-10 rounded-lg border bg-card px-3 text-sm">
          <option value="all">All Wards</option>
          {WARDS.map((w) => <option key={w}>{w}</option>)}
        </select>
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-10 rounded-lg border bg-card px-3 text-sm">
          <option value="all">All Statuses</option>
          {["registered", "assigned", "in_progress", "resolved", "closed", "reopened"].map((s) => (
            <option key={s} value={s}>{statusLabel(s as never)}</option>
          ))}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="h-10 rounded-lg border bg-card px-3 text-sm">
          <option value="all">All Priorities</option>
          {["low", "medium", "high", "critical"].map((p) => <option key={p} className="capitalize">{p}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-5">
        {/* Table */}
        <div className="xl:col-span-3 overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">Complaint</th>
                  <th className="px-4 py-3 text-left">Ward</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">SLA</th>
                  <th className="px-4 py-3 text-left">Priority</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={`cursor-pointer transition-colors hover:bg-muted/40 ${selected.id === c.id ? "bg-muted/60" : ""}`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{categoryIcon(c.category)}</span>
                        <div>
                          <p className="font-medium">{c.title}</p>
                          <p className="text-xs font-mono text-muted-foreground">{c.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground">{c.ward.split(" - ")[0]}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3"><SLABadge sla={c.sla} /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={c.priority} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-sm text-muted-foreground">
                      No complaints match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Detail panel */}
        <div className="xl:col-span-2 space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-mono text-xs text-muted-foreground">{selected.id}</p>
                <h2 className="mt-1 text-lg font-bold leading-tight">{selected.title}</h2>
              </div>
              <span className="text-3xl">{categoryIcon(selected.category)}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <StatusBadge status={selected.status} />
              <SLABadge sla={selected.sla} />
              <PriorityBadge priority={selected.priority} />
            </div>

            <p className="mt-4 text-sm text-muted-foreground">{selected.description}</p>

            <div className="mt-4 space-y-2 rounded-lg border bg-muted/30 p-3 text-xs">
              <p className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" />{selected.location.address}</p>
              <p className="flex items-center gap-2"><Phone className="h-3.5 w-3.5" />{selected.citizenName} · {selected.citizenPhone}</p>
            </div>

            {selected.images.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                  <ImageIcon className="h-3 w-3" />
                  Evidence ({selected.images.length})
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {selected.images.map((src, i) => (
                    <img key={i} src={src} alt="" className="aspect-square rounded-md border object-cover" />
                  ))}
                </div>
              </div>
            )}

            {/* Action panel */}
            <div className="mt-5 space-y-3 border-t pt-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Assign to Field Staff
                </label>
                <div className="flex gap-2">
                  <select className="h-9 flex-1 rounded-lg border bg-background px-3 text-sm">
                    {users.filter((u) => u.role === "officer").map((u) => (
                      <option key={u.id}>{u.name}</option>
                    ))}
                  </select>
                  <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90">
                    <UserPlus className="h-3.5 w-3.5" />
                    Assign
                  </button>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Update Status
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(["assigned", "in_progress", "resolved", "closed"] as const).map((s) => (
                    <button
                      key={s}
                      className="rounded-lg border px-3 py-2 text-xs font-medium hover:border-primary hover:bg-primary/5"
                    >
                      {statusLabel(s)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                  Internal Note
                </label>
                <textarea
                  rows={2}
                  placeholder="Add a comment for the audit log…"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <p className="mb-3 text-sm font-semibold">Timeline</p>
            <ComplaintTimeline events={selected.timeline} />
            <p className="mt-4 text-[11px] text-muted-foreground">
              Created {format(new Date(selected.createdAt), "dd MMM yyyy, hh:mm a")} · Last update{" "}
              {format(new Date(selected.updatedAt), "dd MMM yyyy, hh:mm a")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
