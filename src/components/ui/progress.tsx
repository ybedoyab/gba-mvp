import { cn } from "@/lib/utils";

export function Progress({
  value,
  className,
  barClassName,
}: {
  value: number;
  className?: string;
  barClassName?: string;
}) {
  const width = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("h-2 overflow-hidden rounded-full bg-line", className)} role="progressbar" aria-valuenow={width} aria-valuemin={0} aria-valuemax={100}>
      <div className={cn("h-full rounded-full bg-mint transition-all duration-500", barClassName)} style={{ width: `${width}%` }} />
    </div>
  );
}
