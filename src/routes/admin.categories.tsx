import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/app-shell"
import { CATEGORIES } from "../lib/mock-data";
import { Plus, Pencil } from "lucide-react";

export const Route = createFileRoute("/admin/categories")({
  component: Categories,
  head: () => ({ meta: [{ title: "Categories & SLA — Admin" }] }),
});

function Categories() {
  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Complaint Categories & SLA"
        description="Define categories, target resolution times, and routing."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add Category
          </button>
        }
      />

      <div className="overflow-hidden rounded-xl border bg-card shadow-[var(--shadow-card)]">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Default Department</th>
              <th className="px-4 py-3 text-left">SLA (hours)</th>
              <th className="px-4 py-3 text-left">Auto-Escalation</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {CATEGORIES.map((c) => (
              <tr key={c.id} className="hover:bg-muted/40">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{c.icon}</span>
                    <div>
                      <p className="font-medium">{c.name}</p>
                      <p className="text-xs font-mono text-muted-foreground">{c.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-muted-foreground">
                  {c.id === "water" ? "Water Board" : c.id === "streetlight" ? "Electrical" : c.id === "garbage" ? "Sanitation" : "Public Works"}
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono font-semibold">{c.sla}h</span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    Enabled
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="rounded-md p-1.5 hover:bg-muted">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
