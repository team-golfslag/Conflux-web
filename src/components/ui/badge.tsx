/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-lg border px-3 py-1.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gray-800 text-white shadow-sm [a&]:hover:bg-gray-900 [a&]:hover:shadow-md [a&]:hover:scale-105",
        secondary:
          "border-transparent bg-gray-200 text-gray-800 shadow-sm [a&]:hover:bg-gray-300 [a&]:hover:shadow-md [a&]:hover:scale-105",
        destructive:
          "border-transparent bg-red-600 text-white shadow-sm [a&]:hover:bg-red-700 [a&]:hover:shadow-md [a&]:hover:scale-105 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40",
        outline:
          "text-gray-700 border-gray-200 bg-white shadow-sm [a&]:hover:bg-gray-50 [a&]:hover:text-gray-900 [a&]:hover:border-gray-300 [a&]:hover:shadow-md [a&]:hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
