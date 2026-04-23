import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatCard } from "../components/app-shell";
import { complaints, CATEGORIES, categoryIcon } from "../lib/mock-data";
import { StatusBadge, SLABadge, PriorityBadge } from "../components/status-badges";
import { ClipboardList, AlertTriangle, CheckCircle2, Clock, ArrowRight, Map } from "lucide-react";
import { ComplaintMap } from "../components/complaint-map";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";

export const Route = createFileRoute("/officer/")({
  component: OfficerDashboard,
  head: () => ({ meta: [{ title: "Officer Dashboard — Municipal Portal" }] }),
});

function OfficerDashboard() {
  const assigned = complaints.filter((c) => c.assignedTo === "Anita Desai" || c.status !== "resolved").slice(0, 8);
  const overdue = complaints.filter((c) => c.sla === "overdue").length;
  const inProg = complaints.filter((c) => c.status === "in_progress").length;
  const resolved = complaints.filter((c) => c.status === "resolved").length;

  const byCategory = CATEGORIES.map((c) => ({
    name: c.name.split(" ")[0],
    count: complaints.filter((x) => x.category === c.id).length,
  }));

  const markers = complaints.map((c) => ({
    id: c.id,
    lat: c.location.lat,
    lng: c.location.lng,
    title: `${c.id} — ${c.title}`,
    color:
      c.sla === "overdue" ? "#dc2626" : c.sla === "near_deadline" ? "#eab308" : "#16a34a",
  }));

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Officer Dashboard"
        description="Monitor SLA, assignments, and ward performance."
        actions={
          <Link to="/officer/complaints" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            All Complaints
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Assigned to me" value={assigned.length} icon={ClipboardList} tone="primary" />
        <StatCard label="Overdue" value={overdue} icon={AlertTriangle} tone="destructive" hint="SLA breached" />
        <StatCard label="In Progress" value={inProg} icon={Clock} tone="warning" />
        <StatCard label="Resolved (week)" value={resolved} icon={CheckCircle2} tone="success" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h3 className="text-base font-semibold">Priority Queue</h3>
            <Link to="/officer/complaints" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y">
            {assigned.slice(0, 6).map((c) => (
              <li key={c.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30">
                <span className="text-2xl">{categoryIcon(c.category)}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-2">
                    <p className="truncate text-sm font-semibold">{c.title}</p>
                    <span className="text-xs font-mono text-muted-foreground">{c.id}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{c.ward} · {c.citizenName}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <PriorityBadge priority={c.priority} />
                  <SLABadge sla={c.sla} />
                </div>
                <Link
                  to="/officer/complaints"
                  className="ml-2 hidden rounded-lg border px-3 py-1.5 text-xs font-medium hover:bg-muted sm:inline-block"
                >
                  Open
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-3 text-base font-semibold">By Category</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 250)" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip cursor={{ fill: "oklch(0.96 0.008 250 / 0.5)" }} />
              <Bar dataKey="count" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-8 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
        <div className="mb-3 flex items-center gap-2">
          <Map className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold">Complaint Hotspots</h3>
          <span className="ml-auto flex items-center gap-3 text-xs">
            <Legend color="#16a34a" label="On Time" />
            <Legend color="#eab308" label="Near Deadline" />
            <Legend color="#dc2626" label="Overdue" />
          </span>
        </div>
        <ComplaintMap markers={markers} height="380px" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="h-2.5 w-2.5 rounded-full" style={{ background: color }} />
      {label}
    </span>
  );
}
