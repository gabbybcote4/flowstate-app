// src/components/ui/switch.tsx
// toggle switch component used for dark mode and settings options

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
        // base size and layout
        "peer inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50",
        // color logic for light and dark mode
        "data-[state=checked]:bg-[var(--color-primary)] data-[state=unchecked]:bg-[var(--color-switch-background)] dark:data-[state=unchecked]:bg-[var(--color-input)] focus-visible:ring-[3px] focus-visible:ring-[var(--color-ring)]/40",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          // thumb position + color transition
          "pointer-events-none block size-4 rounded-full ring-0 transition-transform",
          // background color logic
          "flow-card"
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
