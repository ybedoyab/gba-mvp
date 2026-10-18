import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
  {
    variants: {
      tone: {
        neutral: "bg-paper text-muted",
        mint: "bg-mint-soft text-mint-dark",
        teal: "bg-teal-soft text-teal",
        amber: "bg-amber-soft text-amber",
        danger: "bg-danger-soft text-danger",
        plum: "bg-plum-soft text-plum",
        navy: "bg-navy text-white",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export function Badge({
  className,
  tone,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
