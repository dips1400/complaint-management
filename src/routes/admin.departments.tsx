import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/app-shell"
import { departments } from "../lib/mock-data";
import { Plus, Pencil, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin/departments")({
  component: Departments,
  head: () => ({ meta: [{ title: "Departments — Admin" }] }),
});

function Departments() {
  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Manage Departments"
        description="Add, edit, or deactivate municipal departments."
        actions={
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> New Department
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((d) => (
          <div key={d.id} className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <div className="flex items-start justify-between">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-2xl">
                {d.icon}
              </span>
              <div className="flex gap-1">
                <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            <h3 className="mt-3 font-semibold">{d.name}</h3>
            <p className="text-xs text-muted-foreground">Head: {d.head}</p>

            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-muted/40 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Staff</p>
                <p className="text-lg font-bold">{d.staff}</p>
              </div>
              <div className="rounded-lg bg-success/10 px-3 py-2">
                <p className="text-[10px] uppercase tracking-wider text-success">Active</p>
                <p className="text-lg font-bold text-success">{d.active}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
