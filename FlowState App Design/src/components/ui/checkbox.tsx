// src/components/ui/checkbox.tsx
// adaptive checkbox styled for flowstate theme system

"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";
import { useTheme } from "../ThemeContext";
import { cn } from "./utils";

export function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  const { themeColors } = useTheme();

  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer flex items-center justify-center rounded-[6px] border transition-all duration-200 size-5 shrink-0 focus-visible:ring-2 focus-visible:ring-offset-2 outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      style={{
        backgroundColor: "var(--color-card)",
        borderColor: "var(--color-input)",
        boxShadow: `0 0 0 1px ${themeColors.shadow}`,
      }}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center"
        style={{
          backgroundColor: themeColors.primary,
          color: "#fff",
          width: "100%",
          height: "100%",
          borderRadius: "6px",
        }}
      >
        <CheckIcon className="w-3.5 h-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
