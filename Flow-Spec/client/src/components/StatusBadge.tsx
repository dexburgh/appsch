import { cn } from "@/lib/utils";

type Status = "submitted" | "deferred" | "done";

interface StatusBadgeProps {
  status: Status;
  className?: string;
}

const statusConfig = {
  submitted: {
    label: "Submitted",
    classes: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300 border-blue-200 dark:border-blue-500/30",
  },
  deferred: {
    label: "Deferred",
    classes: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300 border-orange-200 dark:border-orange-500/30",
  },
  done: {
    label: "Processed",
    classes: "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-300 border-green-200 dark:border-green-500/30",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-sm",
        config.classes,
        className
      )}
    >
      {config.label}
    </span>
  );
}
