import { TASK_STATUS_LABELS, type TaskStatus } from "@/lib/types";

const STYLES: Record<TaskStatus, string> = {
  open: "bg-success/15 text-success border-success/30",
  assigned: "bg-info/15 text-info border-info/30",
  in_progress: "bg-warning/15 text-warning border-warning/30",
  completed: "bg-primary/15 text-primary border-primary/30",
};

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STYLES[status]}`}
    >
      {TASK_STATUS_LABELS[status]}
    </span>
  );
}
