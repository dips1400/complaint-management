import { Link, useLocation } from "@tanstack/react-router";
import { useRole } from "../lib/role-context";
import {
  LayoutDashboard,
  FilePlus,
  ListChecks,
  Bell,
  ClipboardList,
  BarChart3,
  Building2,
  Users,
  Tag,
  GitBranch,
  ScrollText,
  ShieldCheck,
  Globe,
  Bell as BellIcon,
  Search,
  Sun,
  Moon,
} from "lucide-react";
import { cn } from "../lib/utils";
import type { Role } from "../lib/types";
import { useState, type ReactNode } from "react";

const navByRole: Record<Role, { to: string; label: string; icon: typeof LayoutDashboard }[]> = {
  citizen: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/citizen/register", label: "Register Complaint", icon: FilePlus },
    { to: "/citizen/track", label: "Track Complaints", icon: ListChecks },
    { to: "/citizen/notifications", label: "Notifications", icon: Bell },
  ],
  officer: [
    { to: "/officer", label: "Dashboard", icon: LayoutDashboard },
    { to: "/officer/complaints", label: "Complaints", icon: ClipboardList },
    { to: "/officer/analytics", label: "Analytics", icon: BarChart3 },
  ],
  admin: [
    { to: "/admin", label: "Reports", icon: BarChart3 },
    { to: "/admin/departments", label: "Departments", icon: Building2 },
    { to: "/admin/users", label: "Users & Roles", icon: Users },
    { to: "/admin/categories", label: "Categories & SLA", icon: Tag },
    { to: "/admin/escalation", label: "Escalation Matrix", icon: GitBranch },
    { to: "/admin/audit", label: "Audit Logs", icon: ScrollText },
  ],
};

export function AppShell({ children }: { children: ReactNode }) {
  const { role, setRole, userName } = useRole();
  const location = useLocation();
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<"EN" | "हिं">("EN");

  const nav = navByRole[role];

  const toggleDark = () => {
    setDark((d) => {
      const next = !d;
      document.documentElement.classList.toggle("dark", next);
      return next;
    });
  };

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-3 border-b border-sidebar-border px-5 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold leading-tight">Municipal</p>
            <p className="text-xs text-sidebar-foreground/70">Complaint Portal</p>
          </div>
        </div>

        <div className="px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
            {role === "citizen" ? "Citizen" : role === "officer" ? "Officer" : "Administration"}
          </p>
          <nav className="space-y-0.5">
            {nav.map((item) => {
              const Icon = item.icon;
              const active =
                location.pathname === item.to ||
                (item.to !== "/" && item.to !== "/officer" && item.to !== "/admin" && location.pathname.startsWith(item.to));
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-sidebar-accent text-sidebar-primary"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/60">
              Helpline
            </p>
            <p className="mt-1 text-sm font-bold">1800-0998</p>
            <p className="text-xs text-sidebar-foreground/70">24×7 citizen support</p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b bg-card/80 px-4 backdrop-blur lg:px-8">
          <div className="relative hidden flex-1 max-w-md md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search complaints, wards, departments…"
              className="h-9 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            {/* Language */}
            <button
              onClick={() => setLang((l) => (l === "EN" ? "हिं" : "EN"))}
              className="hidden h-9 items-center gap-1.5 rounded-lg border bg-background px-3 text-xs font-medium hover:bg-muted sm:flex"
              aria-label="Toggle language"
            >
              <Globe className="h-3.5 w-3.5" />
              {lang}
            </button>
            {/* Dark mode */}
            <button
              onClick={toggleDark}
              className="flex h-9 w-9 items-center justify-center rounded-lg border bg-background hover:bg-muted"
              aria-label="Toggle theme"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {/* Notifications */}
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border bg-background hover:bg-muted">
              <BellIcon className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
            </button>

            {/* Role switcher (demo) */}
            <div className="hidden items-center rounded-lg border bg-background p-0.5 md:flex">
              {(["citizen", "officer", "admin"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors",
                    role === r ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {r}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-lg border bg-background pl-2 pr-3 py-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                {userName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="hidden text-left lg:block">
                <p className="text-xs font-semibold leading-tight">{userName}</p>
                <p className="text-[10px] capitalize text-muted-foreground">{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile role switcher */}
        <div className="flex items-center gap-2 border-b bg-card px-4 py-2 md:hidden">
          <span className="text-xs font-medium text-muted-foreground">View as:</span>
          {(["citizen", "officer", "admin"] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium capitalize",
                role === r ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
            >
              {r}
            </button>
          ))}
        </div>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: typeof LayoutDashboard;
  tone?: "primary" | "success" | "warning" | "destructive" | "info";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning-foreground",
    destructive: "bg-destructive/10 text-destructive",
    info: "bg-info/10 text-info",
  } as const;
  return (
    <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", tones[tone])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
