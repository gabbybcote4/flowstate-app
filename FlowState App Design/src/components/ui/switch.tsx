// src/components/ui/switch.tsx
// elegant adaptive toggle for light & dark mode, matches FlowState theme
"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "../ui/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        // base structure
        "peer relative inline-flex h-[1.25rem] w-[2.25rem] shrink-0 cursor-pointer items-center rounded-full border transition-all outline-none",
        // background & state transitions
        "data-[state=checked]:bg-[var(--color-primary)] data-[state=unchecked]:bg-[var(--color-muted)]/40",
        // subtle inner border + glow when active
        "data-[state=checked]:shadow-[0_0_6px_rgba(167,139,250,0.6)] dark:data-[state=checked]:shadow-[0_0_8px_rgba(167,139,250,0.7)]",
        "focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]/40 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // base thumb size + motion
          "pointer-events-none block h-[0.9rem] w-[0.9rem] rounded-full transition-transform duration-200 ease-in-out",
          // position
          "translate-x-[0.2rem] data-[state=checked]:translate-x-[1.15rem]",
          // color logic
          "bg-white dark:bg-[var(--color-card)] shadow-md"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
