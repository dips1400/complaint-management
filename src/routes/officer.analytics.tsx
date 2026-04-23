import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/app-shell";
import { complaints, CATEGORIES, WARDS, categoryName } from "../lib/mock-data";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  LineChart, Line,
} from "recharts";

export const Route = createFileRoute("/officer/analytics")({
  component: Analytics,
  head: () => ({ meta: [{ title: "Analytics — Officer" }] }),
});

const COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)", "var(--chart-5)"];

function Analytics() {
  const byCategory = CATEGORIES.map((c) => ({
    name: c.name.split(" ")[0],
    value: complaints.filter((x) => x.category === c.id).length,
  })).filter((x) => x.value > 0);

  const byWard = WARDS.map((w) => ({
    name: w.split(" - ")[0],
    received: complaints.filter((c) => c.ward === w).length,
    resolved: complaints.filter((c) => c.ward === w && (c.status === "resolved" || c.status === "closed")).length,
  }));

  const trend = [
    { month: "Nov", complaints: 142, resolved: 128 },
    { month: "Dec", complaints: 168, resolved: 151 },
    { month: "Jan", complaints: 184, resolved: 170 },
    { month: "Feb", complaints: 156, resolved: 149 },
    { month: "Mar", complaints: 192, resolved: 175 },
    { month: "Apr", complaints: 211, resolved: 188 },
  ];

  const slaDist = [
    { name: "On Time", value: complaints.filter((c) => c.sla === "on_time").length, color: "var(--success)" },
    { name: "Near Deadline", value: complaints.filter((c) => c.sla === "near_deadline").length, color: "var(--warning)" },
    { name: "Overdue", value: complaints.filter((c) => c.sla === "overdue").length, color: "var(--destructive)" },
  ];

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader title="Analytics" description="Performance, distribution, and trends." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ChartCard title="Complaints by Category">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={byCategory} dataKey="value" nameKey="name" outerRadius={100} innerRadius={60}>
                {byCategory.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="SLA Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={slaDist} dataKey="value" nameKey="name" outerRadius={100} innerRadius={60}>
                {slaDist.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Ward-wise Performance" wide>
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={byWard}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 250)" />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="received" name="Received" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill="var(--chart-2)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="6-Month Trend" wide>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.91 0.01 250)" />
              <XAxis dataKey="month" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="complaints" stroke="var(--chart-1)" strokeWidth={2.5} />
              <Line type="monotone" dataKey="resolved" stroke="var(--chart-2)" strokeWidth={2.5} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

function ChartCard({ title, children, wide }: { title: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={`rounded-xl border bg-card p-5 shadow-[var(--shadow-card)] ${wide ? "lg:col-span-2" : ""}`}>
      <h3 className="mb-3 text-base font-semibold">{title}</h3>
      {children}
    </div>
  );
}
