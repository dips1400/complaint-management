import type {
  Complaint,
  Department,
  User,
  AuditLog,
  ComplaintStatus,
  Priority,
  SLAStatus,
} from "./types";

export const CATEGORIES = [
  { id: "roads", name: "Roads & Potholes", icon: "🛣️", sla: 72 },
  { id: "water", name: "Water Supply", icon: "💧", sla: 24 },
  { id: "garbage", name: "Garbage / Sanitation", icon: "🗑️", sla: 48 },
  { id: "streetlight", name: "Street Lights", icon: "💡", sla: 48 },
  { id: "drainage", name: "Drainage / Sewage", icon: "🚰", sla: 36 },
  { id: "parks", name: "Parks & Trees", icon: "🌳", sla: 96 },
  { id: "stray", name: "Stray Animals", icon: "🐕", sla: 24 },
  { id: "encroach", name: "Encroachment", icon: "🏗️", sla: 120 },
];

export const WARDS = [
  "Ward 1 - Central",
  "Ward 2 - North",
  "Ward 3 - East",
  "Ward 4 - West",
  "Ward 5 - South",
  "Ward 6 - Industrial",
];

export const ZONES = ["Zone A", "Zone B", "Zone C", "Zone D"];

export const departments: Department[] = [
  { id: "d1", name: "Public Works (PWD)", head: "Eng. R. Sharma", staff: 42, active: 36, color: "var(--chart-1)", icon: "🛣️" },
  { id: "d2", name: "Water Board", head: "Mrs. P. Iyer", staff: 28, active: 25, color: "var(--chart-5)", icon: "💧" },
  { id: "d3", name: "Sanitation", head: "Mr. K. Verma", staff: 64, active: 58, color: "var(--chart-2)", icon: "🗑️" },
  { id: "d4", name: "Electrical", head: "Mr. A. Khan", staff: 19, active: 17, color: "var(--chart-3)", icon: "💡" },
  { id: "d5", name: "Horticulture", head: "Dr. S. Reddy", staff: 12, active: 10, color: "var(--chart-2)", icon: "🌳" },
  { id: "d6", name: "Town Planning", head: "Mr. V. Joshi", staff: 9, active: 8, color: "var(--chart-4)", icon: "🏗️" },
];

export const users: User[] = [
  { id: "u1", name: "Anita Desai", email: "anita@city.gov.in", phone: "+91 98200 11111", role: "officer", department: "Public Works (PWD)", ward: "Ward 1 - Central", active: true },
  { id: "u2", name: "Rajesh Kumar", email: "rajesh@city.gov.in", phone: "+91 98200 22222", role: "officer", department: "Sanitation", ward: "Ward 3 - East", active: true },
  { id: "u3", name: "Sunita Patel", email: "sunita@city.gov.in", phone: "+91 98200 33333", role: "officer", department: "Water Board", ward: "Ward 2 - North", active: true },
  { id: "u4", name: "Vikram Singh", email: "vikram@city.gov.in", phone: "+91 98200 44444", role: "admin", active: true },
  { id: "u5", name: "Field Staff – M. Yadav", email: "myadav@city.gov.in", phone: "+91 98200 55555", role: "officer", department: "Electrical", ward: "Ward 4 - West", active: true },
  { id: "u6", name: "Field Staff – D. Naik", email: "dnaik@city.gov.in", phone: "+91 98200 66666", role: "officer", department: "Sanitation", ward: "Ward 5 - South", active: false },
];

const sampleImages = [
  "https://images.unsplash.com/photo-1545153996-1d1f37d2bf91?w=800&q=80",
  "https://images.unsplash.com/photo-1542395765-761de4ee9696?w=800&q=80",
  "https://images.unsplash.com/photo-1597007030739-6d2e7172ee9d?w=800&q=80",
  "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&q=80",
];

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600_000).toISOString();
const hoursAhead = (h: number) => new Date(now + h * 3600_000).toISOString();

function makeComplaint(
  i: number,
  status: ComplaintStatus,
  catIdx: number,
  priority: Priority,
  sla: SLAStatus,
  hoursOld: number,
  ward: number,
): Complaint {
  const cat = CATEGORIES[catIdx];
  const dept = departments[catIdx % departments.length];
  return {
    id: `CMP-${(2024000 + i).toString()}`,
    title: `${cat.name} issue near Sector ${i % 20}`,
    description: `Citizen reports a ${cat.name.toLowerCase()} issue affecting daily life. Immediate attention requested. Multiple residents have raised concerns about this matter in the locality.`,
    category: cat.id,
    ward: WARDS[ward % WARDS.length],
    zone: ZONES[ward % ZONES.length],
    department: dept.name,
    citizenName: ["Ramesh Gupta", "Priya Shah", "Mohammed Ali", "Lakshmi Rao", "Arjun Mehta"][i % 5],
    citizenPhone: `+91 9${(8000000000 + i * 137).toString().slice(0, 9)}`,
    location: {
      lat: 19.076 + (Math.sin(i) * 0.05),
      lng: 72.8777 + (Math.cos(i) * 0.05),
      address: `Plot ${i * 7}, Sector ${i % 20}, ${WARDS[ward % WARDS.length]}`,
    },
    images: [sampleImages[i % sampleImages.length], sampleImages[(i + 1) % sampleImages.length]],
    status,
    priority,
    sla,
    slaDueAt: hoursAhead(cat.sla - hoursOld),
    assignedTo: status === "registered" ? undefined : users[i % 3].name,
    createdAt: hoursAgo(hoursOld),
    updatedAt: hoursAgo(Math.max(0, hoursOld - 4)),
    escalationLevel: sla === "overdue" ? 2 : sla === "near_deadline" ? 1 : 0,
    timeline: buildTimeline(status, hoursOld),
  };
}

function buildTimeline(status: ComplaintStatus, hoursOld: number): Complaint["timeline"] {
  const events: Complaint["timeline"] = [
    { status: "registered", at: hoursAgo(hoursOld), by: "Citizen", note: "Complaint registered via portal" },
  ];
  const order: ComplaintStatus[] = ["assigned", "in_progress", "resolved", "closed"];
  let t = hoursOld - 2;
  for (const s of order) {
    events.push({
      status: s,
      at: hoursAgo(Math.max(0, t)),
      by: s === "assigned" ? "System (Auto-route)" : "Officer A. Desai",
      note:
        s === "assigned"
          ? "Routed to Public Works"
          : s === "in_progress"
            ? "Field team dispatched"
            : s === "resolved"
              ? "Issue fixed, before/after photos uploaded"
              : "Confirmed by citizen",
    });
    t -= 4;
    if (s === status) break;
  }
  return events;
}

export const complaints: Complaint[] = [
  makeComplaint(1, "in_progress", 0, "high", "near_deadline", 60, 0),
  makeComplaint(2, "resolved", 2, "medium", "on_time", 30, 1),
  makeComplaint(3, "assigned", 1, "critical", "overdue", 36, 2),
  makeComplaint(4, "registered", 3, "low", "on_time", 4, 3),
  makeComplaint(5, "in_progress", 4, "high", "near_deadline", 28, 4),
  makeComplaint(6, "resolved", 0, "medium", "on_time", 100, 0),
  makeComplaint(7, "closed", 2, "low", "on_time", 200, 1),
  makeComplaint(8, "in_progress", 5, "medium", "on_time", 20, 2),
  makeComplaint(9, "assigned", 6, "high", "overdue", 30, 3),
  makeComplaint(10, "registered", 7, "low", "on_time", 2, 4),
  makeComplaint(11, "reopened", 1, "high", "near_deadline", 12, 5),
  makeComplaint(12, "in_progress", 3, "medium", "on_time", 18, 0),
  makeComplaint(13, "resolved", 4, "low", "on_time", 80, 1),
  makeComplaint(14, "registered", 0, "critical", "overdue", 48, 2),
  makeComplaint(15, "assigned", 2, "medium", "near_deadline", 24, 3),
  makeComplaint(16, "in_progress", 5, "high", "on_time", 10, 4),
];

export const auditLogs: AuditLog[] = [
  { id: "a1", at: hoursAgo(1), actor: "Officer A. Desai", action: "Status Updated", target: "CMP-2024001", details: "in_progress → resolved" },
  { id: "a2", at: hoursAgo(2), actor: "System", action: "Auto-Escalated", target: "CMP-2024003", details: "SLA breach, level 1 → 2" },
  { id: "a3", at: hoursAgo(3), actor: "Admin V. Singh", action: "User Created", target: "u6", details: "Field Staff – D. Naik (Sanitation)" },
  { id: "a4", at: hoursAgo(5), actor: "Officer R. Kumar", action: "Assigned", target: "CMP-2024009", details: "Assigned to field staff M. Yadav" },
  { id: "a5", at: hoursAgo(8), actor: "Citizen R. Gupta", action: "Reopened", target: "CMP-2024011", details: "Issue not fully resolved" },
  { id: "a6", at: hoursAgo(12), actor: "Admin V. Singh", action: "Category Updated", target: "garbage", details: "SLA changed: 72h → 48h" },
  { id: "a7", at: hoursAgo(20), actor: "System", action: "Notification Sent", target: "CMP-2024014", details: "SMS + Email to citizen" },
  { id: "a8", at: hoursAgo(26), actor: "Officer S. Patel", action: "Comment Added", target: "CMP-2024005", details: "Awaiting parts from supplier" },
];

export const announcements = [
  { id: 1, title: "Water supply maintenance — Ward 3", body: "Scheduled disruption 10 AM – 2 PM on Saturday.", date: hoursAgo(6) },
  { id: 2, title: "Monsoon preparedness drive", body: "Report waterlogging hotspots via the portal.", date: hoursAgo(48) },
  { id: 3, title: "New 24×7 helpline launched", body: "Call 1800-0999 for urgent civic issues.", date: hoursAgo(120) },
];

export function statusLabel(s: ComplaintStatus): string {
  return {
    registered: "Registered",
    assigned: "Assigned",
    in_progress: "In Progress",
    resolved: "Resolved",
    closed: "Closed",
    reopened: "Reopened",
  }[s];
}

export function categoryName(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.name ?? id;
}

export function categoryIcon(id: string): string {
  return CATEGORIES.find((c) => c.id === id)?.icon ?? "📋";
}
