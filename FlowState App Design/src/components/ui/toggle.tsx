// src/components/ui/toggle.tsx
// adaptive toggle button (single + group support) for flowstate theme system

"use client";

import * as React from "react";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";
//import { useTheme } from "../ThemeContext";

// base toggle styling variants
const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 text-sm font-medium rounded-md transition-all duration-200 select-none focus-visible:ring-2 focus-visible:ring-offset-2 outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-transparent border border-transparent",
        outline:
          "border border-[var(--color-input)] bg-transparent hover:bg-[var(--color-accent)]",
      },
      size: {
        default: "h-9 px-3 min-w-9",
        sm: "h-8 px-2 min-w-8 text-xs",
        lg: "h-10 px-4 min-w-10 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// single toggle
export function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  //const { themeColors } = useTheme();

  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(
        toggleVariants({ variant, size, className }),
        "data-[state=on]:text-white"
      )}
      style={{
        backgroundColor: "var(--color-card)",
        color: "var(--color-card-foreground)",
        borderColor: "var(--color-accent)",
        transition: "all 0.2s ease",
      }}
      {...props}
    />
  );
}

// toggle group context
const ToggleGroupContext = React.createContext<
  VariantProps<typeof toggleVariants>
>({
  size: "default",
  variant: "default",
});

// toggle group root
export function ToggleGroup({
  className,
  variant,
  size,
  children,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      data-variant={variant}
      data-size={size}
      className={cn(
        "flex w-fit items-center rounded-md overflow-hidden border border-[var(--color-accent)] shadow-sm",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  );
}

// toggle group item
export function ToggleGroupItem({
  className,
  children,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof ToggleGroupPrimitive.Item> &
  VariantProps<typeof toggleVariants>) {
  const context = React.useContext(ToggleGroupContext);
  //const { themeColors } = useTheme();

  return (
    <ToggleGroupPrimitive.Item
      data-slot="toggle-group-item"
      data-variant={context.variant || variant}
      data-size={context.size || size}
      className={cn(
        toggleVariants({
          variant: context.variant || variant,
          size: context.size || size,
        }),
        "flex-1 shrink-0 first:rounded-l-md last:rounded-r-md border-r border-[var(--color-accent)] hover:bg-[var(--color-accent)] focus-visible:z-10",
        // dynamic active state via data attribute
        "data-[state=on]:bg-[var(--color-primary)] data-[state=on]:text-white",
        className
      )}
      style={{
        transition: "all 0.2s ease",
        backgroundColor: "var(--color-card)",
        color: "var(--color-card-foreground)",
        borderColor: "var(--color-accent)",
      }}
      {...props}
    >
      {children}
    </ToggleGroupPrimitive.Item>
  );
}
