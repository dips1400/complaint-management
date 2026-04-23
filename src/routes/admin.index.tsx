import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, StatCard } from "../components/app-shell";
import { complaints, departments, CATEGORIES, WARDS } from "../lib/mock-data";
import { Building2, Users, ClipboardList, TrendingUp, Download } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  AreaChart, Area, PieChart, Pie, Cell,
} from "recharts";

export const Route = createFileRoute("/admin/")({
  component: AdminReports,
  head: () => ({ meta: [{ title: "Reports — Admin" }] }),
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function AdminReports() {
  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "resolved" || c.status === "closed").length;
  const pendingBacklog = complaints.filter((c) => !["resolved", "closed"].includes(c.status)).length;
  const rate = Math.round((resolved / total) * 100);

  const monthly = [
    { month: "Nov", roads: 32, water: 18, garbage: 28, light: 12, drainage: 10 },
    { month: "Dec", roads: 38, water: 22, garbage: 31, light: 16, drainage: 14 },
    { month: "Jan", roads: 45, water: 25, garbage: 35, light: 18, drainage: 17 },
    { month: "Feb", roads: 36, water: 21, garbage: 29, light: 14, drainage: 12 },
    { month: "Mar", roads: 48, water: 28, garbage: 42, light: 22, drainage: 20 },
    { month: "Apr", roads: 52, water: 31, garbage: 47, light: 25, drainage: 23 },
  ];

  const wardData = WARDS.map((w) => ({
    name: w.split(" - ")[0],
    received: complaints.filter((c) => c.ward === w).length,
    resolved: complaints.filter((c) => c.ward === w && (c.status === "resolved" || c.status === "closed")).length,
  }));

  const catPie = CATEGORIES.map((c) => ({
    name: c.name.split(" ")[0],
    value: complaints.filter((x) => x.category === c.id).length,
  })).filter((x) => x.value > 0);

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Reports Dashboard"
        description="Citywide performance, departmental load, and trends."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium hover:bg-muted">
            <Download className="h-4 w-4" />
            Export PDF
          </button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Complaints" value={total} icon={ClipboardList} tone="primary" />
        <StatCard label="Resolution Rate" value={`${rate}%`} icon={TrendingUp} tone="success" />
        <StatCard label="Pending Backlog" value={pendingBacklog} icon={ClipboardList} tone="warning" />
        <StatCard label="Active Departments" value={departments.length} icon={Building2} tone="info" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-3 text-base font-semibold">Monthly Trends by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthly}>
              <defs>
                {["roads", "water", "garbage", "light", "drainage"].map((k, i) => (
                  <linearGradient key={k} id={`g-${k}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS[i]} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={COLORS[i]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 250)" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {["roads", "water", "garbage", "light", "drainage"].map((k, i) => (
                <Area key={k} type="monotone" dataKey={k} stackId="1" stroke={COLORS[i]} fill={`url(#g-${k})`} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-3 text-base font-semibold">Category Mix</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={catPie} dataKey="value" nameKey="name" outerRadius={100} innerRadius={55}>
                {catPie.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-3 text-base font-semibold">Ward-wise Performance</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={wardData}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 250)" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="received" name="Received" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <h3 className="mb-4 text-base font-semibold">Department Load</h3>
          <ul className="space-y-3">
            {departments.map((d, i) => {
              const load = Math.round(20 + Math.random() * 80);
              return (
                <li key={d.id}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2"><span>{d.icon}</span>{d.name}</span>
                    <span className="font-mono text-xs text-muted-foreground">{load}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${load}%`, background: COLORS[i % COLORS.length] }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
