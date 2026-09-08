import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
        emerald:
          "border-emerald-200 bg-emerald-50 text-emerald-800 font-medium",
        amber:
          "border-amber-200 bg-amber-50 text-amber-900 font-medium",
        blue:
          "border-blue-200 bg-blue-50 text-blue-800 font-medium",
        purple:
          "border-purple-200 bg-purple-50 text-purple-800 font-medium",
        rose:
          "border-rose-200 bg-rose-50 text-rose-800 font-medium",
        green:
          "border-emerald-200 bg-emerald-50 text-emerald-800 font-medium",
        red:
          "border-rose-200 bg-rose-50 text-rose-800 font-medium",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };