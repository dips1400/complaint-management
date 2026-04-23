export type Role = "citizen" | "officer" | "admin";

export type ComplaintStatus =
  | "registered"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "closed"
  | "reopened";

export type Priority = "low" | "medium" | "high" | "critical";
export type SLAStatus = "on_time" | "near_deadline" | "overdue";

export interface TimelineEvent {
  status: ComplaintStatus | "escalated" | "comment";
  at: string; // ISO
  by: string;
  note?: string;
}

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: string;
  ward: string;
  zone: string;
  department: string;
  citizenName: string;
  citizenPhone: string;
  location: { lat: number; lng: number; address: string };
  images: string[];
  status: ComplaintStatus;
  priority: Priority;
  sla: SLAStatus;
  slaDueAt: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  timeline: TimelineEvent[];
  escalationLevel: 0 | 1 | 2 | 3;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  staff: number;
  active: number;
  color: string;
  icon: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  department?: string;
  ward?: string;
  active: boolean;
}

export interface AuditLog {
  id: string;
  at: string;
  actor: string;
  action: string;
  target: string;
  details: string;
}
