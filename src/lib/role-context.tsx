import { createContext, useContext, useState, type ReactNode } from "react";
import type { Role } from "./types";

interface RoleCtx {
  role: Role;
  setRole: (r: Role) => void;
  userName: string;
}

const Ctx = createContext<RoleCtx | null>(null);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("citizen");
  const userName =
    role === "citizen" ? "Ramesh Gupta" : role === "officer" ? "Anita Desai" : "Vikram Singh";
  return <Ctx.Provider value={{ role, setRole, userName }}>{children}</Ctx.Provider>;
}

export function useRole() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useRole must be inside RoleProvider");
  return c;
}
