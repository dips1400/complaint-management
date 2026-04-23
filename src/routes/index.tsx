import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader, StatCard } from "../components/app-shell";
import { complaints, announcements, CATEGORIES, categoryIcon } from "../lib/mock-data";
import { StatusBadge, SLABadge } from "../components/status-badges";
import { ClipboardList, CheckCircle2, Clock, AlertTriangle, FilePlus, Megaphone, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/")({
  component: CitizenDashboard,
  head: () => ({
    meta: [
      { title: "Citizen Dashboard — Municipal Complaint Portal" },
      { name: "description", content: "File and track civic complaints, view announcements, and stay updated on resolutions." },
    ],
  }),
});

function CitizenDashboard() {
  const my = complaints.slice(0, 6);
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "resolved" || c.status === "closed").length;
  const pending = complaints.filter((c) => !["resolved", "closed"].includes(c.status)).length;
  const overdue = complaints.filter((c) => c.sla === "overdue").length;

  return (
    <div className="mx-auto max-w-7xl">
      {/* Hero */}
      <div
        className="mb-8 overflow-hidden rounded-2xl border p-8 text-primary-foreground"
        style={{ background: "var(--gradient-hero)" }}
      >
        <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
              Welcome, Ramesh Gupta
            </p>
            <h2 className="text-3xl font-bold leading-tight">
              Your voice builds a better city.
            </h2>
            <p className="mt-2 text-sm text-primary-foreground/80">
              Report civic issues, track resolution in real time, and help us serve you better.
            </p>
          </div>
          <Link
            to="/citizen/register"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground shadow-lg transition-transform hover:scale-105"
          >
            <FilePlus className="h-4 w-4" />
            Register a Complaint
          </Link>
        </div>
      </div>

      <PageHeader title="Overview" description="Snapshot of complaints across the municipality." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Complaints" value={total} icon={ClipboardList} tone="primary" hint="All wards" />
        <StatCard label="Resolved" value={resolved} icon={CheckCircle2} tone="success" hint="Closed this month" />
        <StatCard label="Pending" value={pending} icon={Clock} tone="warning" hint="Under action" />
        <StatCard label="Overdue (SLA)" value={overdue} icon={AlertTriangle} tone="destructive" hint="Need escalation" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recent complaints */}
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <h3 className="text-base font-semibold">My Recent Complaints</h3>
            <Link to="/citizen/track" className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ul className="divide-y">
            {my.map((c) => (
              <li key={c.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/30">
                <span className="text-2xl">{categoryIcon(c.category)}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate text-sm font-semibold">{c.title}</p>
                    <span className="text-xs text-muted-foreground">{c.id}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {c.ward} · {format(new Date(c.createdAt), "dd MMM, hh:mm a")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <StatusBadge status={c.status} />
                  <SLABadge sla={c.sla} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Announcements */}
        <div className="rounded-xl border bg-card shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2 border-b px-5 py-4">
            <Megaphone className="h-4 w-4 text-accent" />
            <h3 className="text-base font-semibold">Announcements</h3>
          </div>
          <ul className="space-y-1 p-2">
            {announcements.map((a) => (
              <li key={a.id} className="rounded-lg px-3 py-3 hover:bg-muted/40">
                <p className="text-sm font-semibold">{a.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{a.body}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  {format(new Date(a.date), "dd MMM yyyy")}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Quick categories */}
      <div className="mt-8">
        <PageHeader title="Quick Report" description="Tap a category to start a new complaint." />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to="/citizen/register"
              className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center shadow-[var(--shadow-card)] transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[var(--shadow-elevated)]"
            >
              <span className="text-3xl">{c.icon}</span>
              <span className="text-xs font-medium leading-tight">{c.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
