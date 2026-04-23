import { createFileRoute, Link } from "@tanstack/react-router";
import { PageHeader } from "../components/app-shell";
import { CATEGORIES, WARDS } from "../lib/mock-data";
import { FileDropzone } from "../components/file-dropzone";
import { ComplaintMap } from "../components/complaint-map";
import { useState } from "react";
import { CheckCircle2, MapPin } from "lucide-react";

export const Route = createFileRoute("/citizen/register")({
  component: RegisterComplaint,
  head: () => ({ meta: [{ title: "Register Complaint — Municipal Portal" }] }),
});

function RegisterComplaint() {
  const [submitted, setSubmitted] = useState(false);
  const [picked, setPicked] = useState<{ lat: number; lng: number } | null>({
    lat: 19.076,
    lng: 72.8777,
  });
  const [category, setCategory] = useState("roads");
  const [ward, setWard] = useState(WARDS[0]);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold">Complaint Registered</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your complaint ID is <span className="font-mono font-semibold text-foreground">CMP-2024099</span>.
          You'll receive SMS & email updates.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/citizen/track" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Track Complaint
          </Link>
          <button
            onClick={() => setSubmitted(false)}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            File Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader
        title="Register a Complaint"
        description="Provide accurate details so the right department can act quickly."
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-3"
      >
        <div className="space-y-6 lg:col-span-2">
          {/* Category */}
          <section className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 text-sm font-semibold">1. Category</h3>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center transition-colors ${
                    category === c.id
                      ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <span className="text-2xl">{c.icon}</span>
                  <span className="text-xs font-medium leading-tight">{c.name}</span>
                  <span className="text-[10px] text-muted-foreground">SLA {c.sla}h</span>
                </button>
              ))}
            </div>
          </section>

          {/* Details */}
          <section className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 text-sm font-semibold">2. Issue Details</h3>
            <div className="space-y-4">
              <Field label="Title">
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Large pothole near bus stop"
                  className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </Field>
              <Field label="Description">
                <textarea
                  required
                  rows={4}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Describe the issue, when it started, and impact on residents…"
                  className="w-full rounded-lg border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </Field>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Ward">
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    {WARDS.map((w) => (
                      <option key={w}>{w}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Priority">
                  <select className="h-10 w-full rounded-lg border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring">
                    <option value="low">Low</option>
                    <option value="medium" defaultValue="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </Field>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-1 text-sm font-semibold">3. Location</h3>
            <p className="mb-3 text-xs text-muted-foreground">Click on the map to drop a pin.</p>
            <ComplaintMap
              markers={[]}
              picked={picked}
              onPick={(lat, lng) => setPicked({ lat, lng })}
              height="320px"
            />
            {picked && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" />
                Pinned at {picked.lat.toFixed(4)}, {picked.lng.toFixed(4)}
              </p>
            )}
          </section>

          {/* Media */}
          <section className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="mb-3 text-sm font-semibold">4. Photos / Videos</h3>
            <FileDropzone />
          </section>
        </div>

        {/* Sidebar summary */}
        <aside className="lg:sticky lg:top-20 self-start space-y-4">
          <div className="rounded-xl border bg-card p-5 shadow-[var(--shadow-card)]">
            <h3 className="text-sm font-semibold">Submission Summary</h3>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="Category" value={CATEGORIES.find((c) => c.id === category)?.name ?? "—"} />
              <Row label="Ward" value={ward} />
              <Row label="SLA" value={`${CATEGORIES.find((c) => c.id === category)?.sla}h target`} />
              <Row label="Location" value={picked ? "Pinned ✓" : "Not set"} />
            </dl>
            <button
              type="submit"
              className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow hover:bg-primary/90"
            >
              Submit Complaint
            </button>
            <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
              By submitting, you agree to be contacted by the corporation via SMS & email regarding
              this complaint.
            </p>
          </div>

          <div className="rounded-xl border bg-accent/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-accent-foreground">
              Did you know?
            </p>
            <p className="mt-1 text-sm">
              Complaints with location pins and clear photos get resolved <strong>2.4× faster</strong>.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2 border-b border-dashed pb-1.5 last:border-0 last:pb-0">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="text-right text-sm font-medium">{value}</dd>
    </div>
  );
}
