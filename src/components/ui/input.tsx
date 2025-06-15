/**
 * This program has been developed by students from the bachelor Computer Science at Utrecht
 * University within the Software Project course.
 * © Copyright Utrecht University (Department of Information and Computing Sciences)
 */
import * as React from "react";

import { cn } from "@/lib/utils.ts";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "border-input file:text-foreground placeholder:text-muted-foreground flex h-10 w-full min-w-0 rounded-lg border bg-white/80 px-4 py-2 text-base shadow-sm backdrop-blur-sm transition-all duration-200 outline-none selection:bg-blue-500 selection:text-white file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "hover:border-blue-200 hover:bg-white hover:shadow-md",
        "focus-visible:border-blue-500 focus-visible:bg-white focus-visible:shadow-md focus-visible:ring-[3px] focus-visible:ring-blue-500/20",
        "aria-invalid:border-red-500 aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40",
        "placeholder:transition-colors placeholder:duration-200 focus:placeholder:text-gray-400",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
