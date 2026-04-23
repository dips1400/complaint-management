import { format } from "date-fns";
import type { TimelineEvent } from "../lib/types";
import { CheckCircle2, Circle, AlertCircle, MessageSquare } from "lucide-react";
import { cn } from "../lib/utils";

export function ComplaintTimeline({ events }: { events: TimelineEvent[] }) {
  return (
    <ol className="relative space-y-6 border-l-2 border-border pl-6">
      {events.map((e, i) => {
        const isLast = i === events.length - 1;
        const Icon =
          e.status === "escalated" ? AlertCircle : e.status === "comment" ? MessageSquare : isLast ? Circle : CheckCircle2;
        return (
          <li key={i} className="relative">
            <span
              className={cn(
                "absolute -left-[34px] flex h-7 w-7 items-center justify-center rounded-full border-2 bg-background",
                isLast ? "border-primary text-primary" : "border-success text-success",
                e.status === "escalated" && "border-destructive text-destructive",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
            <div className="flex flex-wrap items-baseline gap-2">
              <p className="font-semibold capitalize text-foreground">
                {e.status.replace("_", " ")}
              </p>
              <span className="text-xs text-muted-foreground">
                {format(new Date(e.at), "dd MMM yyyy, hh:mm a")}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-muted-foreground">
              by <span className="font-medium text-foreground">{e.by}</span>
              {e.note && <> — {e.note}</>}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
