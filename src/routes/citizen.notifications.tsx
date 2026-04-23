import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "../components/app-shell";
import { Bell, Mail, MessageSquare, CheckCircle2, AlertTriangle, Settings } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export const Route = createFileRoute("/citizen/notifications")({
  component: Notifications,
  head: () => ({ meta: [{ title: "Notifications — Municipal Portal" }] }),
});

const items = [
  { id: 1, type: "status", title: "CMP-2024001 marked In Progress", body: "Your road repair complaint has been assigned to PWD field team.", channel: ["sms", "email", "app"], at: new Date(Date.now() - 1 * 3600_000), read: false },
  { id: 2, type: "resolved", title: "CMP-2024002 has been Resolved", body: "Garbage collection completed in Ward 2. Please verify and close.", channel: ["sms", "app"], at: new Date(Date.now() - 6 * 3600_000), read: false },
  { id: 3, type: "delay", title: "Delay alert on CMP-2024003", body: "SLA at risk — auto-escalated to Senior Officer.", channel: ["email", "app"], at: new Date(Date.now() - 18 * 3600_000), read: true },
  { id: 4, type: "status", title: "CMP-2024005 assigned to officer", body: "Officer Anita Desai will handle your street light complaint.", channel: ["sms", "email", "app"], at: new Date(Date.now() - 26 * 3600_000), read: true },
  { id: 5, type: "announce", title: "Water maintenance — Ward 3", body: "Scheduled disruption Saturday 10 AM–2 PM.", channel: ["email"], at: new Date(Date.now() - 48 * 3600_000), read: true },
];

const iconMap = {
  status: { Icon: Bell, cls: "bg-info/10 text-info" },
  resolved: { Icon: CheckCircle2, cls: "bg-success/10 text-success" },
  delay: { Icon: AlertTriangle, cls: "bg-destructive/10 text-destructive" },
  announce: { Icon: Bell, cls: "bg-accent/15 text-accent-foreground" },
};

function Notifications() {
  const [prefs, setPrefs] = useState({ sms: true, email: true, app: true });

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Notifications"
        description="All updates about your complaints in one place."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border bg-card shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <h3 className="text-sm font-semibold">Inbox</h3>
            <button className="text-xs font-medium text-primary hover:underline">Mark all read</button>
          </div>
          <ul className="divide-y">
            {items.map((n) => {
              const m = iconMap[n.type as keyof typeof iconMap];
              return (
                <li key={n.id} className={`flex gap-3 px-5 py-4 ${!n.read ? "bg-primary/5" : ""}`}>
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${m.cls}`}>
                    <m.Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="text-sm font-semibold">{n.title}</p>
                      <span className="text-xs text-muted-foreground">
                        {format(n.at, "dd MMM, hh:mm a")}
                      </span>
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
                    <div className="mt-2 flex items-center gap-2">
                      {n.channel.map((c) => (
                        <span key={c} className="inline-flex items-center gap-1 rounded-md border bg-muted/50 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                          {c === "sms" && <MessageSquare className="h-2.5 w-2.5" />}
                          {c === "email" && <Mail className="h-2.5 w-2.5" />}
                          {c === "app" && <Bell className="h-2.5 w-2.5" />}
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Preferences */}
        <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
          <div className="mb-4 flex items-center gap-2">
            <Settings className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold">Notification Channels</h3>
          </div>
          <div className="space-y-3">
            {([
              ["sms", "SMS", MessageSquare],
              ["email", "Email", Mail],
              ["app", "In-App", Bell],
            ] as const).map(([key, label, Icon]) => (
              <label
                key={key}
                className="flex cursor-pointer items-center justify-between rounded-lg border p-3 hover:bg-muted/40"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  {label}
                </span>
                <input
                  type="checkbox"
                  checked={prefs[key]}
                  onChange={() => setPrefs((p) => ({ ...p, [key]: !p[key] }))}
                  className="h-4 w-4 accent-primary"
                />
              </label>
            ))}
          </div>

          <div className="mt-5 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
            <strong className="text-foreground">Accessibility:</strong> Adjust contrast and text
            size from your profile settings.
          </div>
        </div>
      </div>
    </div>
  );
}
